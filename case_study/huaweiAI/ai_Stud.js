// https://frida.re/docs/javascript-api/

Java.perform(function () {

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

    // retrieve these offsets by using IDA, e.g., by cross checking the corresponding method in IDA
    /*
    system/libhwbinder/Parcel.cpp

    uintptr_t Parcel::ipcData() const
    {
        return reinterpret_cast<uintptr_t>(mData);
    }

    size_t Parcel::ipcDataSize() const
    {
        return mDataSize > mDataPos ? mDataSize : mDataPos;
    }

    uintptr_t Parcel::ipcObjects() const
    {
        return reinterpret_cast<uintptr_t>(mObjects);
    }

    size_t Parcel::ipcObjectsCount() const
    {
        return mObjectsSize;
    }

    uint8_t*            mData;              this + 5 * (QWORD)
    size_t              mDataSize;          this + 6 * (QWORD)
    size_t              mDataCapacity;
    mutable size_t      mDataPos;
    binder_size_t*      mObjects;           this + 9 * (QWORD)
    size_t              mObjectsSize;       this + 10 * (QWORD)

    */

    const mData_LOC         = 0x28;
    const mDataSize_LOC     = 0x30;
    const mObjects_LOC      = 0x48;
    const mObjectsSize_LOC  = 0x50;

    /*
    status_t BpHwBinder::transact(
    uint32_t code, const Parcel& data, Parcel* reply, uint32_t flags, TransactCallback)
    {
        // Once a binder has died, it will never come back to life.
        if (mAlive) {
            status_t status = IPCThreadState::self()->transact(         <- *((_DWORD *)this + 2) is the 2nd argument.
                mHandle, code, data, reply, flags);
            if (status == DEAD_OBJECT) mAlive = 0;
            return status;
        }

        return DEAD_OBJECT;
    }
    */

    const mHandle_LOC       = 0x8;
	const PROT_READ         = 0x1;
	const PROT_WRITE        = 0x2;
	const MAP_SHARED        = 0x1;

    function fuzz_hidl_startModelFromMem2(mData_pos, mObjects_pos, mObjectsSize, mHandle, code, data, reply, flags, isVendor)
    {
// The parcel layout:
//        0          0x2c    0x30    0x34                     0x5c                     0x84                     0xac 0xb0 0xb4                     0xdc                     0xfc
//        |-----------|-------|-------|------------------------|------------------------|------------------------|----|----|------------------------|------------------------|
//        | interface |  int  |  int  | BINDER_TYPE_PTR (0x28) | BINDER_TYPE_PTR (0x28) | BINDER_TYPE_PTR (0x28) | Uint64  | BINDER_TYPE_PTR (0x28) | BINDER_TYPE_FDA (0x20) |

//        0                        0x04     0x08      0x0c      0x10      0x14      0x18      0x2c
//        |-------------------------|--------|---------|---------|---------|---------|---------|
//        | sizeof(native_handle_t) | numFds | numInts | 1st fds | 1st int |    V2   |    V1   |

        var binder_object_offset    = mObjects_pos.add(3 * 0x8).readU64();
        var binder_object_pos       = mData_pos.add(binder_object_offset);

        var buffer_pos          = binder_object_pos.add(0x8);
        var length_pos          = binder_object_pos.add(0x10);
        var parent_pos          = binder_object_pos.add(0x18);
        var parent_offset_pos   = binder_object_pos.add(0x20);

        console.log("|----[i] buffer: " + buffer_pos.readPointer());
        if(length_pos.readU64() != 0)
        {
            console.log("|----[i] buffer content: ");
            console.log(hexdump(buffer_pos.readPointer(), {
                offset: 0,
                length: length_pos.readU64(),
                header: true,
                ansi: true
            }));
        }

        var this_fd = buffer_pos.readPointer().add(0x0c).readU32();
        console.log("|----[i] this_fd: 0x" + this_fd.toString(16));
        var this_size = buffer_pos.readPointer().add(0x18).readU32();
        console.log("|----[i] this_size: 0x" + this_size.toString(16));

//        console.log("|----[i] fd info: " + mem_info.get(this_fd));
//        var this_fd_size = mem_info.get(this_fd)[0];
//        console.log("|----[i] size info: 0x" + this_fd_size.toString(16));
//        var this_fd_buffer = ptr("0x" + mem_info.get(this_fd)[1]);
//        console.log("|----[i] buffer info: 0x" + this_fd_buffer.toString(16));

        // void* mmap(void* addr, size_t size, int prot, int flags, int fd, off_t offset) {

        var this_mmap_p = Module.getExportByName("libai_client.so", 'mmap');
        console.log("[i] mmap addr: " + this_mmap_p);

        var func_mmap = new NativeFunction(this_mmap_p,
            'uint64',
            ['uint64', 'uint32', 'int32', 'int32', 'int32', 'int32']
            );
        var ret = func_mmap(
            0,
            this_size,
            PROT_READ|PROT_WRITE,
            MAP_SHARED,
            this_fd,
            0);

        console.log("[i] mmap ret: 0x" + ret.toString(16));

        var this_fd_buffer = ptr(ret);
        try{
            console.log(hexdump(this_fd_buffer, {
                offset: 0,
                length: 0x200,
                header: true,
                ansi: true
            }));
        }
        catch(err)
        {
            console.log("|----[e] can't read");
            return;
        }

        return;

        for (var i = 0; i < this_size; i += 4 )
        {
            console.log("|----[i] fuzz offset: 0x" + this_fd_buffer.add(i).toString(16));
            fuzzOneSInt(this_fd_buffer.add(i), mHandle, code, data, reply, flags, isVendor);
        }


//        try{
//            console.log(hexdump(g_model_buf, {
//                offset: 0,
//                length: 0x100,
//                header: true,
//                ansi: true
//            }));
//        }
//        catch(err)
//        {
//            console.log("|----[e] can't read");
//            return;
//        }
//
//        for (var i = 0; i < g_model_size; i += 4 )
//        {
//            console.log("|----[i] fuzz offset: 0x" + i + ", addr: " + g_model_buf.add(i).toString(16));
//            fuzzOneSInt(g_model_buf.add(i), mHandle, code, data, reply, flags, isVendor);
//        }

    }

    // study the object
    function studyObject(mData_pos, mObjects_pos, mObjectsSize, mHandle, code, data, reply, flags, isVendor){
        console.log("|---[i] start dumping binder objects in mData");

        // parse each Object
        for (var i = 0; i < mObjectsSize; i ++)
        {
            console.log("|---[i] dumping binder_object: " + (i + 1) + " (" + i + ") / " + mObjectsSize);
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
                        console.log("|-----[e] shall NEVER run me");
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
                // check `BHwBinder` in system/libhwbinder/include/hwbinder/Binder.h, I don't think there are any thing we can fuzz.
                console.log("|----[i] identified as BINDER_TYPE_BINDER, parse by struct `flat_binder_object`.");

                /*
                struct binder_object_header {
                    __u32        type;
                };

                struct flat_binder_object {
                    struct binder_object_header	hdr;
                    __u32				flags;

                    union {
                        binder_uintptr_t	binder;
                        __u32			handle;
                    };

                    binder_uintptr_t	cookie;
                };
                */

                var flags_pos               = binder_object_pos.add(0x4);
                var binder_or_handle_pos    = binder_object_pos.add(0x8);
                var cookie_pos              = binder_object_pos.add(0x10);

                console.log("|----[i] flags: 0x" + flags_pos.readU32().toString(16));

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
                console.log("|----[e] TODO:: Unknown BINDER_TYPE");
            }
        }

        console.log("|---[i] end dumping binder objects in mData");
    }

    // defined in system/libhwbinder/Parcel.cpp
    function PAD_SIZE_UNSAFE(s)
    {
        return (((s)+3)&~3)
    }


    function fuzzOneSInt(fuzzPos, mHandle, code, data, reply, flags, isVendor)
    {
        var org_value = fuzzPos.readS32();
        var new_value = [//org_value,           // replay (test double-free?)
                        ~org_value,
                        org_value & 0xffffff00, org_value & 0xffff00ff, org_value & 0xff00ffff, org_value & 0x00ffffff,
                        org_value | 0x000000ff, org_value | 0x0000ff00, org_value | 0x00ff0000, org_value | 0xff000000,
                        0,
                        0x7f, 0x7fff, 0x7fffffff,
                        0x80, 0x8000, 0x80000000,
                        0xff, 0xffff, 0xffffffff,
                        org_value + 1
                        ];
//        var new_value = org_value | 0xffff;
//        console.log("|-----[i] original value: 0x" + org_value.toString(16) + ", new value: 0x" + (~org_value).toString(16));

//        console.log(hexdump(mData_pos.add(SInt_pos), {
//            offset: 0,
//            length: 0x10,
//            header: true,
//            ansi: true
//        }));

        for (var i = 0; i < new_value.length; i ++)
        {
            fuzzPos.writeS32(new_value[i]);
    //        mData_pos.add(SInt_pos).writeS32(org_value | 0xffff);
//            console.log(hexdump(fuzzPos, {
//                offset: 0,
//                length: 0x10,
//                header: true,
//                ansi: true
//            }));


            if (isVendor == false)
            {
                console.log("|-----[i] fuzz system Parcel (" + fuzzPos + "): 0x" + org_value.toString(16) + " -> 0x" + new_value[i].toString(16));
                var func_IPCThreadState_self = new NativeFunction(IPCThreadState_self_p, 'pointer', []);
                var IPCThreadState_Obj = func_IPCThreadState_self();
                // console.log("|-----IPCThreadState object: 0x" + IPCThreadState_Obj.toString(16));

                var func_IPCThreadState_transact = new NativeFunction(IPCThreadState_transact_p, 'int32', ['pointer', 'int32', 'uint32', 'pointer', 'pointer', 'uint32']);
                var ret = func_IPCThreadState_transact(
                    IPCThreadState_Obj,
                    mHandle,
                    code,
                    data,
                    reply,
                    flags);
            }
            else
            {
                // console.log("|-----[i] fuzz vendor Parcel: (" + fuzzPos + "): 0x" + org_value.toString(16) + " -> 0x" + new_value[i].toString(16));
                var func_IPCThreadState_self_vendor = new NativeFunction(IPCThreadState_self_vendor_p, 'pointer', []);
                var IPCThreadState_Obj = func_IPCThreadState_self_vendor();
                // console.log("|-----IPCThreadState object: 0x" + IPCThreadState_Obj.toString(16));

                var func_IPCThreadState_transact_vendor = new NativeFunction(IPCThreadState_transact_vendor_p, 'int32', ['pointer', 'int32', 'uint32', 'pointer', 'pointer', 'uint32']);
                var ret = func_IPCThreadState_transact_vendor(
                    IPCThreadState_Obj,
                    mHandle,
                    code,
                    data,
                    reply,
                    flags);
            }
            // console.log("|-----[i] done, ret value: 0x" + ret.toString(16));
        }
        fuzzPos.writeS32(org_value);
    }

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

    // fuzz the Peekhole in mData
    function fuzzPeekhole(mData_pos, mDataSize, mObjects_pos, mObjectsSize, mHandle, code, data, reply, flags, isVendor){
        console.log("|---[i] start fuzzing peekholes in mData");

        // dump data for debugging
        console.log(hexdump(mData_pos, {
            offset: 0,
            length: mDataSize,
            header: true,
            ansi: true
        }));

        var object_offset_lst = new Array();
        for (var i = 0; i < mObjectsSize; i ++)
        {
            var object_offset = mObjects_pos.add(i * 0x8).readU64();
            console.log("|----[i] binder_object offset: 0x" + object_offset.toString(16));
            object_offset_lst[i] = object_offset.toNumber();
        }

        // skip the descriptor and pad i to next block
        i = PAD_SIZE_UNSAFE(mData_pos.readUtf8String().length);
        // console.log("|----[i] cur offset: 0x" + i.toString(16));

        for (; i < mDataSize; i += 4 )      // likely all dataz are aligned, I have not check all of them.
        {
            if (object_offset_lst.includes(i))
            {
                i += getBinderObjectLen(mData_pos.add(i));
                i -= 4;
            }
            else
            {
                console.log("|----[i] fuzz offset: 0x" + i.toString(16));
                fuzzOneSInt(mData_pos.add(i), mHandle, code, data, reply, flags, isVendor);
            }
        }
    }

    const whiteTransactionCode = [
        // 11,                                 // vendor.huawei.hardware.ai@2.1::IModelManagerService_hidl         _hidl_BuildModel
        11,                                 // vendor.huawei.hardware.ai@1.1::IAiModelMngr                      _hidl_startModelFromMem2
        // 12                                  // vendor.huawei.hardware.ai@1.1::IAiModelMngr                      _hidl_runModel2
    ];
    // const fuzzInterface     = "vendor.huawei.hardware.ai";
    const fuzzInterface             = "vendor.huawei.hardware.ai@1.1::IAiModelMngr"

    function parseParcel(args, that, isVendor){
        // remove to enable all transactions.
        if (whiteTransactionCode.includes(args[1].toInt32()) == false)
            return;

        // remove to enable all interfaces.
        if (args[2].add(mData_LOC).readPointer().readUtf8String().indexOf(fuzzInterface) == -1)
            return

        console.log("[i] memory information:");
        for (let [key, value] of mem_info.entries()) {
            console.log("0x" + key.toString(16) + " = " + "0x" + value[0].toString(16) + ", 0x" + value[1].toString(16));
        }

        console.log('[i] call stack:\n' +
            Thread.backtrace(that.context, Backtracer.ACCURATE)
            .map(DebugSymbol.fromAddress).join('\n') + '\n');

        // args[0], `this` argument (should not depend on `args[0]`, use `this` instead.)
        console.log("[i] 1st argument, this: 0x" + args[0].toString(16))
        var mHandle = args[0].add(mHandle_LOC).readU32()
        console.log("[i] mHandle value: 0x" + mHandle.toString(16))

        // transact code
        console.log("|-[i] 2nd argument, transaction code: " + args[1].toInt32())

        // Parcel data
        console.log("|-[i] 3rd argument, Parcel addr: " + args[2])

        // mDataSize
        var mDataSize_pos = args[2].add(mDataSize_LOC);
        var mDataSize = mDataSize_pos.readU64();
        console.log("|--[i] mDataSize: 0x" + mDataSize.toString(16));

        // mData
        var mData_offset = args[2].add(mData_LOC);
        var mData_pos = mData_offset.readPointer();
        // var mData = ArrayBuffer.wrap(mData_pos, mDataSize);
        // var mData = mData_pos.readByteArray(mDataSize);

        if (isVendor == false)
            console.log("|--[i] mData (system): ");
        else
            console.log("|--[i] mData (vendor): ");
        console.log(hexdump(mData_pos, {
            offset: 0,
            length: mDataSize,
            header: true,
            ansi: true
        }));


        // dump the InterfaceToken
        var descriptor = mData_pos.readUtf8String();
        console.log("|--[i] Interface Token: ");
        console.log(hexdump(mData_pos, {
            offset: 0,
            length: descriptor.length,
            header: true,
            ansi: true
        }));

        // mObjectsSize
        var mObjectsSize_pos = args[2].add(mObjectsSize_LOC);
        var mObjectsSize = mObjectsSize_pos.readU64();
        console.log("|--[i] mObjectsSize: 0x" + mObjectsSize.toString(16));

        // mObjects
        var mObjects_offset = args[2].add(mObjects_LOC);
        var mObjects_pos = mObjects_offset.readPointer();
        // var mObjects = mObjects_pos.readByteArray(mObjectsSize * 0x8);
        console.log("|--[i] mObjects: ");
        console.log(hexdump(mObjects_pos, {
            offset: 0,
            length: mObjectsSize * 0x8,
            header: true,
            ansi: true
        }));

        // start parsing the mData
        // the layout of mData is:
        // |--descriptor--|--peekhole--|--Object--|--peekhole--|--peekhole--|--Object--|...
        // the mObjects[x] indicates the start of each `Object`
        // all Objects are defined in `/usr/include/linux/android/binder.h`

        // e.g., binder_buffer_object
        /*
        struct binder_buffer_object {
          struct binder_object_header hdr;
          __u32 flags;
          binder_uintptr_t buffer;
          binder_size_t length;
          binder_size_t parent;
          binder_size_t parent_offset;
        };

        struct binder_object_header {
          __u32 type;
        };
        */

        // return;
        // I would like to fuzz in runtime, such that I can covert back to the original mData.
        // fuzzPeekhole(mData_pos, mDataSize, mObjects_pos, mObjectsSize, mHandle, args[1].toInt32(), args[2], args[3], args[4].toInt32(), isVendor);
        if (mObjectsSize != 0)
            // studyObject(mData_pos, mObjects_pos, mObjectsSize, mHandle, args[1].toInt32(), args[2], args[3], args[4].toInt32(), isVendor);
            fuzz_hidl_startModelFromMem2(mData_pos, mObjects_pos, mObjectsSize, mHandle, args[1].toInt32(), args[2], args[3], args[4].toInt32(), isVendor);
    }


    function dumpModuleInfo(){
        var ms = Process.enumerateModules();
        for (var i = 0; i < ms.length; i ++ )
        {
            // console.log(ms[i].name);
            if (ms[i].path.indexOf("libc") != -1)
                console.log(ms[i].path);
        }
    }

    console.log('[*] Frida js is running.');
    dumpModuleInfo();

    // return
    // Use the mangled name
    var BpHwBinder_transact_p = Module.getExportByName("/system/lib64/libhidlbase.so", '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    console.log("[i] BpHwBinder::transact addr: " + BpHwBinder_transact_p)
    // system/libhwbinder/IPCThreadState.cpp
    //status_t IPCThreadState::transact(int32_t handle,
    //                             uint32_t code, const Parcel& data,
    //                             Parcel* reply, uint32_t flags)

    // In order to reach this function, I need to invoke `IPCThreadState::self()` firstly (as the 1st argument) and locate the `mHandle` variable.
    var IPCThreadState_transact_p = Module.getExportByName("/system/lib64/libhidlbase.so", '_ZN7android8hardware14IPCThreadState8transactEijRKNS0_6ParcelEPS2_j');
    console.log("[i] IPCThreadState::transact addr: " + IPCThreadState_transact_p)

    // system/libhwbinder/BpHwBinder.cpp
    //status_t BpHwBinder::transact(
    //    uint32_t code, const Parcel& data, Parcel* reply, uint32_t flags, TransactCallback /*callback*/)
    //{
    //    // Once a binder has died, it will never come back to life.
    //    if (mAlive) {
    //        status_t status = IPCThreadState::self()->transact(
    //            mHandle, code, data, reply, flags);
    //        if (status == DEAD_OBJECT) mAlive = 0;
    //        return status;
    //    }
    //
    //    return DEAD_OBJECT;
    //}

    var IPCThreadState_self_p = Module.getExportByName("/system/lib64/libhidlbase.so", '_ZN7android8hardware14IPCThreadState4selfEv');
    console.log("[i] IPCThreadState::self addr: " + IPCThreadState_self_p)

    Interceptor.attach(BpHwBinder_transact_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: BpHwBinder::transact");
//            console.log('[i] called from:\n' +
//                Thread.backtrace(this.context, Backtracer.ACCURATE)
//                .map(DebugSymbol.fromAddress).join('\n') + '\n');

            parseParcel(args, this, false);
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: BpHwBinder::transact");
            console.log("|-[i] ret value: " + retval);
            // print the return value
        }
    });

    var BpHwBinder_transact_vendor_p = Module.getExportByName("/system/lib64/vndk-sp-29/libhidlbase.so", '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    console.log("[i] Vendor BpHwBinder::transact addr: " + BpHwBinder_transact_vendor_p)

    var IPCThreadState_transact_vendor_p = Module.getExportByName("/system/lib64/vndk-sp-29/libhidlbase.so", '_ZN7android8hardware14IPCThreadState8transactEijRKNS0_6ParcelEPS2_j');
    console.log("[i] Vendor IPCThreadState::transact addr: " + IPCThreadState_transact_vendor_p)

    var IPCThreadState_self_vendor_p = Module.getExportByName("/system/lib64/vndk-sp-29/libhidlbase.so", '_ZN7android8hardware14IPCThreadState4selfEv');
    console.log("[i] Vendor IPCThreadState::self addr: " + IPCThreadState_self_vendor_p)

    Interceptor.attach(BpHwBinder_transact_vendor_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: Vendor BpHwBinder::transact");
            parseParcel(args, this, true);
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: Vendor BpHwBinder::transact");
            console.log("|-[i] ret value: " + retval);
            // print the return value
        }
    });

    // collect the <fd, [size, buffer]> pair
    var mem_info = new Map();

    var g_fd;
    var g_size;
    var g_buffer;

/*
bionic/libc/bionic/mmap.cpp
void* mmap(void* addr, size_t size, int prot, int flags, int fd, off_t offset) {


system/core/libcutils/ashmem-dev.cpp
int ashmem_create_region(const char *name, size_t size)


	F_DUPFD                              = 0x0
	F_DUPFD_CLOEXEC                      = 0x406

device/linaro/bootloader/edk2/StdLib/LibC/Uefi/SysCalls.c
int
fcntl     (int fildes, int cmd, ...)
{
  va_list             p3;
  struct __filedes   *MyFd;
  int                 retval = -1;
  int                 temp;

//Print(L"%a( %d, %d, ...)\n", __func__, fildes, cmd);
  va_start(p3, cmd);

  if(ValidateFD( fildes, VALID_OPEN )) {
    MyFd = &gMD->fdarray[fildes];

    switch(cmd) {
      case F_DUPFD:


the dup is thunked to fcntl
device/linaro/bootloader/edk2/StdLib/LibC/Uefi/SysCalls.c
int
dup   (int fildes)
{
  return fcntl(fildes, F_DUPFD, 0);
}

void munmap(void *addr, size_t length)
{

*/

//    var close_p = Module.getExportByName("libai_client.so",
//    'close');
//    console.log("[i] close addr: " + close_p);
//
//    Interceptor.attach(close_p, {
//        onEnter: function(args) {
//            console.log("[*] onEnter: close");
//            console.log("[i] the 0 argument, fd: 0x" + args[0].toString(16));
//            mem_info.remove(args[0].toInt32());
//        },
//
//        onLeave: function(retval) {
//            console.log("[*] onLeave: close");
//            console.log("|-[i] ret value: " + retval);
//        }
//    });

//    var munmap_p = Module.getExportByName("libai_client.so",
//    'munmap');
//    console.log("[i] munmap addr: " + munmap_p);
//
//    Interceptor.attach(munmap_p, {
//        onEnter: function(args) {
//            console.log("[*] onEnter: munmap");
//            console.log("[i] the 0 argument, addr: 0x" + args[0].toString(16));
//            console.log("[i] the 1 argument, length: 0x" + args[1].toString(16));
//
//        },
//
//        onLeave: function(retval) {
//            console.log("[*] onLeave: munmap");
//            console.log("|-[i] ret value: " + retval);
//        }
//    });


    var dup_p = Module.getExportByName("libai_client.so",
    'dup');
    console.log("[i] dup addr: " + dup_p);

    var g_dup_old_fd;

    Interceptor.attach(dup_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: dup");
            console.log("[i] the 0 argument, fildes: 0x" + args[0].toString(16));

            g_dup_old_fd = args[0].toInt32();
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: dup");
            console.log("|-[i] ret value: " + retval);

            // as stated in frida's document, the `retval` is a NativePointer.
            // I have no idea about how to covert the `NativePointer` to an UInt64.
            // So I convert it to a string temporarily.
            if (g_dup_old_fd != 0)
            {
                console.log("|-[i] old fd: 0x" + g_dup_old_fd.toString(16) + " -> new fd: 0x" + retval.toString(16));
                mem_info.set(retval.toInt32(), mem_info.get(g_dup_old_fd));
            }
        }
    });


    var fcntl_p = Module.getExportByName("libai_client.so",
    'fcntl');
    console.log("[i] fcntl addr: " + fcntl_p);

    var g_fcntl_old_fd;

    Interceptor.attach(fcntl_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: fcntl");
            console.log("[i] the 0 argument, fildes: 0x" + args[0].toString(16));
            console.log("[i] the 1 argument, cmd: 0x" + args[1].toString(16));
            var cmd = args[1].toInt32();
            if (cmd == 0x406 || cmd == 0x0)
            {
                g_fcntl_old_fd = args[0].toInt32();
            }
            else
            {
                g_fcntl_old_fd = 0;
            }

        },

        onLeave: function(retval) {
            console.log("[*] onLeave: fcntl");
            console.log("|-[i] ret value: " + retval);

            // as stated in frida's document, the `retval` is a NativePointer.
            // I have no idea about how to covert the `NativePointer` to an UInt64.
            // So I convert it to a string temporarily.
            if (g_fcntl_old_fd != 0)
            {
                console.log("|-[i] old fd: 0x" + g_fcntl_old_fd.toString(16) + " -> new fd: 0x" + retval.toString(16));
//                mem_info.set(retval.toInt32(), mem_info.get(g_fcntl_old_fd));
//                console.log("foo");
            }
        }
    });

    var mmap_p = Module.getExportByName("libai_client.so",
    'mmap');
    console.log("[i] mmap addr: " + mmap_p);

    Interceptor.attach(mmap_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: mmap");
            console.log("[i] the 0 argument, addr: 0x" + args[0].toString(16));
            console.log("[i] the 1 argument, size: 0x" + args[1].toString(16));
            console.log("[i] the 4 argument, fd: 0x" + args[4].toString(16));
            console.log("[i] the 5 argument, offset: 0x" + args[5].toString(16));
            g_fd = args[4].toInt32();
            g_size = args[1].toInt32();
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: mmap");
            console.log("|-[i] ret value: " + retval);
//            console.log(hexdump(retval, {
//                offset: 0,
//                length: 0x40,
//                header: true,
//                ansi: true
//            }));

            // as stated in frida's document, the `retval` is a NativePointer.
            // I have no idea about how to covert the `NativePointer` to an UInt64.
            // So I convert it to a string temporarily.
            g_buffer = retval.toString(16);
            mem_info.set(g_fd, [g_size, g_buffer]);
        }
    });


    var ashmem_create_region_p = Module.getExportByName("libai_client.so",
    'ashmem_create_region');
    console.log("[i] ashmem_create_region addr: " + ashmem_create_region_p)

    Interceptor.attach(ashmem_create_region_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: ashmem_create_region");
            console.log("[i] the 0 argument, name: " + args[0].readUtf8String())
            console.log("[i] the 1 argument, size: 0x" + args[1].toString(16))
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: ashmem_create_region");
            console.log("|-[i] ret value: " + retval);
        }
    });

    var CreateAshmemRegionFd_p = Module.getExportByName("libai_client.so",
    'CreateAshmemRegionFd');
    console.log("[i] CreateAshmemRegionFd addr: " + CreateAshmemRegionFd_p)

    Interceptor.attach(CreateAshmemRegionFd_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: CreateAshmemRegionFd");
            console.log("[i] the 0 argument, name: " + args[0].readUtf8String())
            console.log("[i] the 1 argument, size: 0x" + args[1].toString(16))
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: CreateAshmemRegionFd");
            console.log("|-[i] ret value: " + retval);
        }
    });



/*
    var g_model_buf;
    var g_model_size;

    var HIAI_ModelBuffer_create_from_buffer_p = Module.getExportByName("libai_client.so",
    'HIAI_ModelBuffer_create_from_buffer');
    console.log("[i] HIAI_ModelBuffer_create_from_buffer addr: " + HIAI_ModelBuffer_create_from_buffer_p)

    var log_p = HIAI_ModelBuffer_create_from_buffer_p.add(0x40968).sub(0x407f4);


    Interceptor.attach(log_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: HIAI_ModelBuffer_create_from_buffer");
//            console.log("[i] x3 value: " + this.context.x3);
//            console.log("[i] x4 value: " + this.context.x4);
            g_model_buf = this.context.x4;
            g_model_size = this.context.x6.toInt32();
            console.log("[i] x3 value: " + g_model_buf);
            console.log("[i] x5 value: " + g_model_size);
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: HIAI_ModelBuffer_create_from_buffer");
            console.log("|-[i] ret value: " + retval);
        }
    });
*/

    /**

    //    Used for testing
    // Use the mangled name
    var startModelFromMem2_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", '_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr24_hidl_startModelFromMem2EPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiiRKNS6_8hidl_vecINS2_4V1_011ModelBufferEEE');
    console.log("[i] BpHwAiModelMngr::_hidl_startModelFromMem2 addr: " + startModelFromMem2_p)

//    vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_startModelFromMem2(
//        android::hardware::IInterface *,
//        android::hardware::details::HidlInstrumentor *,
//        int,
//        int,
//        android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::ModelBuffer> const&
//        )

    Interceptor.attach(startModelFromMem2_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: BpHwAiModelMngr::_hidl_startModelFromMem2");
            console.log('[i] called from:\n' +
                Thread.backtrace(this.context, Backtracer.ACCURATE)
                .map(DebugSymbol.fromAddress).join('\n') + '\n');

            console.log("[i] the first argument, int: 0x" + args[0].toString(16))
            console.log("[i] the second argument, int: 0x" + args[1].toString(16))
            console.log("[i] the third argument, int: 0x" + args[2].toString(16))
            console.log("[i] the forth argument, int: 0x" + args[3].toString(16))
            console.log("[i] the fifth argument, int: 0x" + args[4].toString(16))

            console.log(hexdump(args[4], {
                offset: 0,
                length: 0x8,
                header: true,
                ansi: true
            }));

            console.log(hexdump(args[4].readPointer(), {
                offset: 0,
                length: 0x200,
                header: true,
                ansi: true
            }));

            console.log("[i] the fifth argument, obj: 0x" + args[5].toString(16))


        },

        onLeave: function(retval) {
            console.log("[*] onLeave: BpHwAiModelMngr::_hidl_startModelFromMem2");
            console.log("|-[i] ret value: " + retval);
            // print the return value
        }
    });


//demo@demo:~/Downloads$ adb pull /vendor/lib64/vendor.huawei.hardware.ai@1.0.so
///vendor/lib64/vendor.huawei.hardware.ai@1.0.so: 1 file pulled, 0 skipped. 26.3 MB/s (777000 bytes in 0.028s)
//demo@demo:~/Downloads$ objdump -tT vendor.huawei.hardware.ai@1.0.so  | grep "writeEmbeddedToParcel"
//0000000000000000      DF *UND*	0000000000000000  Base        _ZN7android8hardware21writeEmbeddedToParcelERKNS0_11hidl_stringEPNS0_6ParcelEmm
//0000000000000000      DF *UND*	0000000000000000  Base        _ZN7android8hardware21writeEmbeddedToParcelERKNS0_11hidl_handleEPNS0_6ParcelEmm
//00000000000a7b40 g    DF .text	000000000000000c  Base        _ZN6vendor6huawei8hardware2ai4V1_021writeEmbeddedToParcelERKNS3_16ASRRuntimeParamsEPN7android8hardware6ParcelEmm
//00000000000a7a64 g    DF .text	00000000000000d0  Base        _ZN6vendor6huawei8hardware2ai4V1_021writeEmbeddedToParcelERKNS3_13ASRInitParamsEPN7android8hardware6ParcelEmm
//00000000000a7ed4 g    DF .text	00000000000000c0  Base        _ZN6vendor6huawei8hardware2ai4V1_021writeEmbeddedToParcelERKNS3_16ModelDescriptionEPN7android8hardware6ParcelEmm
//00000000000a7d9c g    DF .text	0000000000000078  Base        _ZN6vendor6huawei8hardware2ai4V1_021writeEmbeddedToParcelERKNS3_9ModelInfoEPN7android8hardware6ParcelEmm
//00000000000a8058 g    DF .text	0000000000000004  Base        _ZN6vendor6huawei8hardware2ai4V1_021writeEmbeddedToParcelERKNS3_21AINeuralNetworkBufferEPN7android8hardware6ParcelEmm
//00000000000a8048 g    DF .text	0000000000000004  Base        _ZN6vendor6huawei8hardware2ai4V1_021writeEmbeddedToParcelERKNS3_13AIImageBufferEPN7android8hardware6ParcelEmm
//00000000000a7c38 g    DF .text	00000000000000ec  Base        _ZN6vendor6huawei8hardware2ai4V1_021writeEmbeddedToParcelERKNS3_9ASRResultEPN7android8hardware6ParcelEmm
//00000000000a7fec g    DF .text	0000000000000058  Base        _ZN6vendor6huawei8hardware2ai4V1_021writeEmbeddedToParcelERKNS3_11ModelBufferEPN7android8hardware6ParcelEmm
//00000000000a8050 g    DF .text	0000000000000004  Base        _ZN6vendor6huawei8hardware2ai4V1_021writeEmbeddedToParcelERKNS3_8ICResultEPN7android8hardware6ParcelEmm

    // Use the mangled name
    var writeEmbeddedToParcel_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so",
    '_ZN6vendor6huawei8hardware2ai4V1_021writeEmbeddedToParcelERKNS3_11ModelBufferEPN7android8hardware6ParcelEmm');
    console.log("[i] writeEmbeddedToParcel addr: " + writeEmbeddedToParcel_p)

    Interceptor.attach(writeEmbeddedToParcel_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: V1_0::writeEmbeddedToParcel");
            console.log('[i] called from:\n' +
                Thread.backtrace(this.context, Backtracer.ACCURATE)
                .map(DebugSymbol.fromAddress).join('\n') + '\n');

            console.log("[i] the 0 argument, int: 0x" + args[0].toString(16))
            console.log("[i] the 1 argument, int: 0x" + args[1].toString(16))
            console.log("[i] the 2 argument, int: 0x" + args[2].toString(16))
            console.log("[i] the 3 argument, int: 0x" + args[3].toString(16))

            console.log(hexdump(args[0], {
                offset: 0,
                length: 0x28,
                header: true,
                ansi: true
            }));

            console.log(hexdump(args[0].readPointer(), {
                offset: 0,
                length: 0x2a,
                header: true,
                ansi: true
            }));

            console.log(hexdump(args[0].add(0x10).readPointer(), {
                offset: 0,
                length: 0x16c07,
                header: true,
                ansi: true
            }));

        },

        onLeave: function(retval) {
            console.log("[*] onLeave: V1_0::writeEmbeddedToParcel");
            console.log("|-[i] ret value: " + retval);
            // print the return value
        }
    });
    */


});

