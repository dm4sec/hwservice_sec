Java.perform(function () {

    // may help exploring the stealthy exception.
    Process.setExceptionHandler(function(error)
    {
        send("app_exception:" + g_cur_progress.offset);
        console.warn("|-[i] app exception received. current offset: 0x" + g_cur_progress.offset.toString(16));
        return false;
    })

    // funcHelper('_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE')
    // funcHelper('mmap')
    function funcHelper(mangled_name){
        var addr_map = new Map();

        var ms = Process.enumerateModules();
        for (var i = 0; i < ms.length; i ++ )
        {
            try{
                var func_ptr = Module.getExportByName(ms[i].path, mangled_name).toString(16);
                if (func_ptr != 0 && !addr_map.has(func_ptr))
                {
                    addr_map.set(func_ptr, ms[i].path);
                }
            }
            catch(err) {
            }
        }

        for (let [key, value] of addr_map.entries())
        {
            console.log("[i] " + value + ": 0x" + key);
        }
    }


    function genSeed(org_value)
    {
        console.log("genSeed for: 0x", org_value.toString(16))
        return [//org_value,           // replay (test double-free?)
                        ~org_value,
                        org_value & 0xffffff00, org_value & 0xffff00ff, org_value & 0xff00ffff, org_value & 0x00ffffff,
                        org_value | 0x000000ff, org_value | 0x0000ff00, org_value | 0x00ff0000, org_value | 0xff000000,
                        org_value & 0xffffff00 + 0x7f, org_value & 0xffff00ff + 0x7f00, org_value & 0xff00ffff + 0x7f0000, org_value & 0x00ffffff + 0x7f000000,
                        org_value & 0xffffff00 + 0x80, org_value & 0xffff00ff + 0x8000, org_value & 0xff00ffff + 0x800000, org_value & 0x00ffffff + 0x80000000,
                        0,
                        0x7f, 0x7fff, 0x7fffff, 0x7fffffff,
                        0x80, 0x8000, 0x800000, 0x80000000,
                        0xff, 0xffff, 0xffffff, 0xffffffff,
                        org_value + 1, org_value + 0x100, org_value + 0x10000, org_value + 0x1000000,
                        org_value - 1, org_value - 0x100, org_value - 0x10000, org_value - 0x1000000
                        ];
    }

    console.log('[*] Frida scenedection.js is running.');

    const g_BpHwBinder_transact_ptr = Module.getExportByName("/vendor/lib64/hw/android.hardware.graphics.mapper@2.0-impl-2.1.so", '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    console.log("[i] BpHwBinder::transact addr: " + g_BpHwBinder_transact_ptr)
    const g_BpHwBinder_transact_func = new NativeFunction(g_BpHwBinder_transact_ptr, 'int', ['pointer', 'int', 'pointer', 'pointer', 'int', 'pointer']);
    console.log("[i] BpHwBinder::transact func addr: " + g_BpHwBinder_transact_func)

    const g_mmap_ptr = Module.getExportByName("/system/bin/app_process64", 'mmap');
    console.log("[i] mmap addr: " + g_mmap_ptr);
    const g_mmap_func = new NativeFunction(g_mmap_ptr, 'uint64', ['uint64', 'uint32', 'int32', 'int32', 'int32', 'int32']);
    console.log("[i] mmap func addr: " + g_mmap_func)

    const g_whiteTransactionCode = [
        12                      //vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_runModel2
    ];
    const g_fuzzInterface = "vendor.huawei.hardware.ai@1.1::IAiModelMngr";

    Interceptor.replace(g_BpHwBinder_transact_ptr, new NativeCallback(BpHwBinder_transact_fuzzer, 'int', ['pointer', 'int', 'pointer', 'pointer', 'int', 'pointer']));

    // data in parcel
    const g_mData_LOC           = 0x28;
    const g_mDataSize_LOC       = 0x30;
    const g_mObjects_LOC        = 0x48;
    const g_mObjectsSize_LOC    = 0x50;

    const EPIPE		            = 32;	/* Broken pipe */
    const DEAD_OBJECT           = -EPIPE;

	const PROT_READ             = 0x1;
	const PROT_WRITE            = 0x2;
	const MAP_SHARED            = 0x1;

    const g_cur_progress        = {"offset": -4 + 0x4};


    function BpHwBinder_transact_fuzzer(this_context /* this */, code, data, reply, flags, TransactCallback)
    {
        if (data.add(g_mData_LOC).readPointer().readUtf8String().indexOf(g_fuzzInterface) == -1)
            return g_BpHwBinder_transact_func(this_context, code, data, reply, flags, TransactCallback);

        if (g_whiteTransactionCode.includes(code) == false)
            return g_BpHwBinder_transact_func(this_context, code, data, reply, flags, TransactCallback);

        var mData_offset = data.add(g_mData_LOC);
        var mData_pos = mData_offset.readPointer();

//        console.log('[i] call stack:\n' +
//            Thread.backtrace(that.context, Backtracer.ACCURATE)
//            .map(DebugSymbol.fromAddress).join('\n') + '\n');

        // transact code
        console.log("|-[i] 2nd argument, transaction code: " + code)

        // Parcel data
        console.log("|-[i] 3rd argument, Parcel addr: " + data)

        // mDataSize
        var mDataSize_pos = data.add(g_mDataSize_LOC);
        var mDataSize = mDataSize_pos.readU64();
        console.log("|--[i] mDataSize: 0x" + mDataSize.toString(16));

        // mData
        var mData_offset = data.add(g_mData_LOC);
        var mData_pos = mData_offset.readPointer();

        console.log(hexdump(mData_pos, {
            offset: 0,
            length: mDataSize,
            header: true,
            ansi: true
        }));

        // dump the InterfaceToken
        var interfaceToken = mData_pos.readUtf8String();
        console.log("|--[i]interface Token: ");
        console.log(hexdump(mData_pos, {
            offset: 0,
            length: interfaceToken.length,
            header: true,
            ansi: true
        }));

        // mObjectsSize
        var mObjectsSize_pos = data.add(g_mObjectsSize_LOC);
        var mObjectsSize = mObjectsSize_pos.readU64();
        console.log("|--[i] mObjectsSize: 0x" + mObjectsSize.toString(16));

        // mObjects
        var mObjects_offset = data.add(g_mObjects_LOC);
        var mObjects_pos = mObjects_offset.readPointer();
        // var mObjects = mObjects_pos.readByteArray(mObjectsSize * 0x8);
        console.log("|--[i] mObjects: ");
        console.log(hexdump(mObjects_pos, {
            offset: 0,
            length: mObjectsSize * 0x8,
            header: true,
            ansi: true
        }));

        // studyObject(mData_pos, mDataSize, mObjects_pos, mObjectsSize);

        /*********************************************************
        * string fuzzer template *
        **********************************************************/

        /*
        var org_str_len = mData_pos.add(mObjects_pos.add(13 * 0x8).readU64()).add(0x10).readU32();
        console.log("|---[i] str len: " + org_str_len.toString(16));
        var org_str_val = mData_pos.add(mObjects_pos.add(13 * 0x8).readU64()).add(0x8).readPointer().readUtf8String();
        console.log("|---[i] str val: " + org_str_val.toString(16));

        const FUZZ_STR_LEN = 0x100;
        var mem_ptr = Memory.alloc(FUZZ_STR_LEN);
        for (var i = org_str_len; i < FUZZ_STR_LEN; i ++)
        {
            mem_ptr.writeByteArray(Array(FUZZ_STR_LEN).fill(0));
            mem_ptr.writeUtf8String(org_str_val);
            mem_ptr.add(i - 1).writeByteArray(Array(i - org_str_len + 1).fill(0x41));

            var addr = mData_pos.add(mObjects_pos.add(12 * 0x8).readU64()).add(0x8).readPointer();
            addr.writePointer(mem_ptr);
            addr.add(0x8).writeUInt(i);

            addr = mData_pos.add(mObjects_pos.add(13 * 0x8).readU64());
            addr.add(0x8).writePointer(mem_ptr);
            addr.add(0x10).writeUInt(i + 1);

            var retval = g_BpHwBinder_transact_func(this_context, code, data, reply, flags, TransactCallback);
        }
        */

        // another block
        var this_fd         = mData_pos.add(0x17c).add(0x8).readPointer().add(0xc).readU32();
        // console.log(this_fd.toString(16));
        var this_size       = mData_pos.add(0x17c).add(0x8).readPointer().add(0x18).readU32();
        // console.log(this_size.toString(16));

        /*
        var this_fd         = mData_pos.add(0x8c).add(0x8).readPointer().add(0xc).readU32();
        // console.log(this_fd.toString(16));
        var this_size       = mData_pos.add(0x8c).add(0x8).readPointer().add(0x18).readU32();
        // console.log(this_size.toString(16));
        */

        var map_memory_p = g_mmap_func(
            0,
            this_size,
            PROT_READ|PROT_WRITE,
            MAP_SHARED,
            this_fd,
            0);

        var map_memory_ptr = ptr(map_memory_p);

        console.log(hexdump(map_memory_ptr, {
            offset: 0,
            length: this_size,
            header: true,
            ansi: true
        }));

        // return g_BpHwBinder_transact_func(this_context, code, data, reply, flags, TransactCallback);

        for (var i = g_cur_progress.offset; i < this_size; i += 4)
        {
            send("ready:" + i);
            // wait the host to finish it's task.
            var foo = recv('sig_synchronize', function(value) {
                console.log("|--[i] host ready message received, continue testing.");
            });
            foo.wait();

            var org_value = map_memory_ptr.add(i).readS32();
            var new_value = genSeed(org_value);

            for (var j = 0; j < new_value.length; j ++)
            {
                console.log("|--[i] fuzz memory: 0x" + map_memory_ptr.toString(16) + ", with offset: 0x" + i.toString(16) + ", with seed: 0x" + new_value[j].toString(16));
                map_memory_ptr.add(i).writeS32(new_value[j]);
                var retval = g_BpHwBinder_transact_func(this_context, code, data, reply, flags, TransactCallback);
                if (retval == DEAD_OBJECT)
                {
                    send("dead_object:" + i);
                    console.warn("|--[i] dead object received, stop intercepting. current offset: 0x" + i.toString(16));
                    Interceptor.detachAll();
                }
            }
            map_memory_ptr.add(i).writeS32(org_value);
        }

        console.error("|[*] fuzz_scenedection fuzz done");
        return g_BpHwBinder_transact_func(this_context, code, data, reply, flags, TransactCallback);
    }


    /*****************************************************************
    * Study the object in parcel data *
    ******************************************************************/
    /*
    system/libhwbinder/Parcel.cpp
    /usr/include/linux/android/binder.h

    enum {
        BINDER_TYPE_BINDER	= B_PACK_CHARS('s', 'b', '*', B_TYPE_LARGE),
        BINDER_TYPE_WEAK_BINDER	= B_PACK_CHARS('w', 'b', '*', B_TYPE_LARGE),
        BINDER_TYPE_HANDLE	= B_PACK_CHARS('s', 'h', '*', B_TYPE_LARGE),
        BINDER_TYPE_WEAK_HANDLE	= B_PACK_CHARS('w', 'h', '*', B_TYPE_LARGE),
        BINDER_TYPE_FD		= B_PACK_CHARS('f', 'd', '*', B_TYPE_LARGE),
        BINDER_TYPE_FDA		= B_PACK_CHARS('f', 'd', 'a', B_TYPE_LARGE),
        BINDER_TYPE_PTR		= B_PACK_CHARS('p', 't', '*', B_TYPE_LARGE),
    };
    */
    const BINDER_TYPE_BINDER          = 0x73622a85                // .*bs
    const BINDER_TYPE_WEAK_BINDER     = 0x77622a85                // .*bw
    const BINDER_TYPE_HANDLE          = 0x73682a85                // .*hs
    const BINDER_TYPE_WEAK_HANDLE     = 0x77682a85                // .*hw
    const BINDER_TYPE_FD              = 0x66642a85                // .*df
    const BINDER_TYPE_FDA             = 0x66646185                // .adf
    const BINDER_TYPE_PTR             = 0x70742a85                // .*tp


    function getBinderObjectLen(BinderObjectPos)
    {
            var type_val = BinderObjectPos.readU32();
            if (type_val == BINDER_TYPE_BINDER ||
                type_val == BINDER_TYPE_WEAK_BINDER ||
                type_val == BINDER_TYPE_HANDLE ||
                type_val == BINDER_TYPE_WEAK_HANDLE)            // flat_binder_object
                return 0x18;
            else if (type_val == BINDER_TYPE_FD)                // flat_binder_object
                return 0x18;
            else if (type_val == BINDER_TYPE_FDA)               // binder_fd_array_object
                return 0x20;
            else if (type_val == BINDER_TYPE_PTR)               // binder_buffer_object
                return 0x28;
    }

    // study the object
    function studyObject(mData_pos, mDataSize, mObjects_pos, mObjectsSize){
        console.log("|---[i] start dumping binder objects in mData");

        // parse each Object
        for (var i = 0; i < mObjectsSize; i ++)
        {
            var binder_object_offset    = mObjects_pos.add(i * 0x8).readU64();
            var binder_object_pos       = mData_pos.add(binder_object_offset);
            var type_pos                = binder_object_pos;

//            console.log("|----[i] type:");
//            console.log(hexdump(type_pos, {
//                offset: 0,
//                length: 0x4,
//                header: true,
//                ansi: true
//            }));
            var obj_len                 = getBinderObjectLen(binder_object_pos)

            console.log("|---[i] dumping binder_object: " + (i + 1) + " (" + i + ") / " + mObjectsSize + ", 0x" + binder_object_offset.toString(16) + " - 0x" + (binder_object_offset + obj_len).toString(16));
            console.log(hexdump(binder_object_pos, {
                offset: 0,
                length: obj_len,
                header: true,
                ansi: true
            }));

            if (type_pos.readU32() == BINDER_TYPE_PTR)
            {
                console.log("|----[i] identified as BINDER_TYPE_PTR, parse by struct `binder_buffer_object`.");

                const BINDER_BUFFER_FLAG_HAS_PARENT   = 0x01;
                const BINDER_BUFFER_FLAG_REF          = 0x1 << 1;

                /*
                struct binder_object_header {
                    __u32        type;
                };
                struct binder_buffer_object {
                    struct binder_object_header	hdr;
                    __u32				flags;
                    binder_uintptr_t		buffer;
                    binder_size_t			length;
                    binder_size_t			parent;
                    binder_size_t			parent_offset;
                };
                */
                var flags_pos           = binder_object_pos.add(0x4);
                var buffer_pos          = binder_object_pos.add(0x8);
                var length_pos          = binder_object_pos.add(0x10);
                var parent_pos          = binder_object_pos.add(0x18);
                var parent_offset_pos   = binder_object_pos.add(0x20);

                console.log("|----[i] flags: 0x" + flags_pos.readU32().toString(16));

                if (flags_pos.readU32() == BINDER_BUFFER_FLAG_HAS_PARENT)
                {
                    // writeEmbeddedBuffer
                    console.log("|----[i] assembled by `writeEmbeddedBuffer`");
                    console.log("|----[i] buffer: " + buffer_pos.readPointer());
                    if(length_pos.readU64() != 0)
                    {
                        console.log("|-----[i] buffer content: ");
                        console.log(hexdump(buffer_pos.readPointer(), {
                            offset: 0,
                            length: length_pos.readU64(),
                            header: true,
                            ansi: true
                        }));

                        console.log("|-----[i] real buffer content: ");
                        try{
                            console.log(hexdump(buffer_pos.readPointer().readPointer(), {
                                offset: 0,
                                length: 0x80,
                                header: true,
                                ansi: true
                            }));
                        }
                        catch(err) {
                            console.log("|-----[e] can't read");
                        }
                    }
                    else
                    {
                        console.error("|-----[e] shall NEVER run me");
                        // parent and parent_offset take place.
                        // check validateBufferParent to find out how they are used.
                        // used to point to another BINDER_TYPE_PTR, such that modify one of them is enough.
                    }
                    console.log("|----[i] length: 0x" + length_pos.readU64().toString(16));
                    console.log("|----[i] parent: 0x" + parent_pos.readU64().toString(16));
                    console.log("|----[i] parent_offset: 0x" + parent_offset_pos.readU64().toString(16));
                }
                else if (flags_pos.readU32() == 0)
                {
                    // writeBuffer
                    console.log("|----[i] assembled by `writeBuffer`");
                    console.log("|----[i] buffer: " + buffer_pos.readPointer());
                    if(length_pos.readU64() != 0)
                    {
                        console.log("|-----[i] buffer content: ");
                        console.log(hexdump(buffer_pos.readPointer(), {
                            offset: 0,
                            length: length_pos.readU64(),
                            header: true,
                            ansi: true
                        }));

                        console.log("|-----[i] real buffer content: ");
                        try{
                            console.log(hexdump(buffer_pos.readPointer().readPointer(), {
                                offset: 0,
                                length: 0x80,
                                header: true,
                                ansi: true
                            }));
                        }
                        catch(err) {
                            console.log("|-----[e] can't read");
                        }
                    }
                    else
                    {
                        console.error("|-----[e] shall NEVER run me");
                    }
                    console.log("|----[i] length: 0x" + length_pos.readU64().toString(16));
                }
                else if (flags_pos.readU32() == BINDER_BUFFER_FLAG_REF)
                {
                    // writeReference
                    // writeNullReference
                    // have not tested.
                    if (buffer_pos.readU64() == 0)
                    {
                        console.log("|----[i] assembled by `writeNullReference`");
                    }
                    else
                    {
                        console.log("|----[i] assembled by `writeReference`");
                        console.log("|----[i] buffer (child_buffer_handle): 0x" + buffer_pos.readU64().toString(16));
                        console.log("|----[i] length (child_offset): 0x" + length_pos.readU64().toString(16));
                    }
                }
                else if (flags_pos.readU32() == BINDER_BUFFER_FLAG_REF | BINDER_BUFFER_FLAG_HAS_PARENT)
                {
                    // writeEmbeddedReference
                    // have not tested.
                    console.log("|----[i] assembled by `writeEmbeddedReference`");
                    console.log("|----[i] buffer (child_buffer_handle): 0x" + buffer_pos.readU64().toString(16));
                    console.log("|----[i] length (child_offset): 0x" + length_pos.readU64().toString(16));
                    console.log("|----[i] parent (parent_buffer_handle): 0x" + parent_pos.readU64().toString(16));
                    console.log("|----[i] parent_offset (parent_offset): 0x" + parent_offset_pos.readU64().toString(16));
                }
                else
                {
                    console.log("|----[e] TODO:: unknown BINDER_TYPE_PTR");
                }

                // I would like that you should check the flags in advance to know how this data is assembled (e.g., by using writeEmbeddedBuffer or writeBuffer).
            }
            else if (type_pos.readU32() == BINDER_TYPE_BINDER)
            {
                console.log("|----[i] identified as BINDER_TYPE_BINDER, parse by struct `flat_binder_object`.");

//                struct binder_object_header {
//                    __u32        type;
//                };

//                struct flat_binder_object {
//                    struct binder_object_header	hdr;
//                    __u32				flags;
//
//                    /* 8 bytes of data. */
//                    union {
//                        binder_uintptr_t	binder;	/* local object */
//                        __u32			handle;	/* remote object */
//                    };
//
//                    /* extra data associated with local object */
//                    binder_uintptr_t	cookie;
//                };

                var flags_pos               = binder_object_pos.add(0x4);
                var binder_or_handle_pos    = binder_object_pos.add(0x8);
                var cookie_pos              = binder_object_pos.add(0x10);

	            const FLAT_BINDER_FLAG_PRIORITY_MASK        = 0xff;
	            const FLAT_BINDER_FLAG_ACCEPTS_FDS          = 0x100;
	            const FLAT_BINDER_FLAG_TXN_SECURITY_CTX     = 0x1000;

                var this_flags              = flags_pos.readU32();
                var this_binder             = binder_or_handle_pos.readU64();
                var this_handle             = binder_or_handle_pos.readU32();
                var this_cookie             = cookie_pos.readU64();

                console.log("|----[i] flags: 0x" + this_flags.toString(16));


                if ((0x7f | FLAT_BINDER_FLAG_ACCEPTS_FDS) == this_flags)
                {
                    console.log("|----[i] flatten_binder (wp)");
                }
                else if (FLAT_BINDER_FLAG_ACCEPTS_FDS == this_flags)
                {
                    console.log("|----[i] flatten_binder (sp, backgroundSchedulingDisabled)");
                }
                else if ((0x13 | FLAT_BINDER_FLAG_ACCEPTS_FDS) == this_flags)
                {
                    console.log("|----[i] flatten_binder (sp, !backgroundSchedulingDisabled)");
                    if (this_cookie != 0)
                    {
                        console.log("|----[i] local binder");
//                        console.log(hexdump(ptr(this_binder).add(0x8).readPointer(), {
//                            offset: 0,
//                            length: 0x80,
//                            header: true,
//                            ansi: true
//                        }));

                    }
                    else
                    {
                        console.log("|----[i] TODO");
                    }
                }
                else
                {
                    console.log("|----[i] flatten_binder (sp, backgroundSchedulingDisabled | !backgroundSchedulingDisabled, isRequestingSid)");
                }

                if (binder_or_handle_pos.readU64() == 0)
                {
                    console.log("|-----[i] assembled by `writeStrongBinder->flatten_binder->binder == null` or `writeWeakBinder->flatten_binder->binder == null / real == null`");
                }
                else
                {
                    console.log("|-----[i] assembled by `writeStrongBinder->flatten_binder->local binder`");
                    console.log("|-----[i] binder_or_handle (binder): 0x" + binder_or_handle_pos.readU64().toString(16));     // weak / strong reference
                    console.log("|-----[i] cookie: 0x" + cookie_pos.readU64().toString(16));                                  // binder object
                }
            }
            else if (type_pos.readU32() == BINDER_TYPE_FDA)
            {

                console.log("|----[i] identified as BINDER_TYPE_FDA, parse by struct `binder_fd_array_object`.");
                console.log("|----[i] assembled by `writeNativeHandleNoDup`");

                /*
                struct binder_fd_array_object {
                    struct binder_object_header	hdr;
                    __u32				pad;
                    binder_size_t			num_fds;
                    binder_size_t			parent;
                    binder_size_t			parent_offset;
                };
                */

                var num_fds_pos                 = binder_object_pos.add(0x8);
                var parent_pos                  = binder_object_pos.add(0x10);
                var parent_offset_pos           = binder_object_pos.add(0x18);

                console.log("|----[i] num_fds: 0x" + num_fds_pos.readU64().toString(16));
                console.log("|----[i] parent: 0x" + parent_pos.readU64().toString(16));
                console.log("|----[i] parent_offset: 0x" + parent_offset_pos.readU64().toString(16));
            }
            else
            {
                console.error("|-----[e] shall NEVER run me");
            }
        }
        console.log("|---[i] end dumping binder objects in mData");
    }


});
