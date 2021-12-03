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

    const fuzzInterface     = "vendor.huawei.hardware.ai";

    // fuzz the object
    function fuzzObject(mData_pos, mObjects_pos, mObjectsSize, mHandle, code, data, reply, flags, isVendor){
        console.log("|---[i] start fuzzing binder objects in mData");

        // parse each Object
        for (var i = 0; i < mObjectsSize; i ++)
        {
            console.log("|---[i] dumping binder_object: " + (i + 1) + " / " + mObjectsSize);
            var binder_object_offset    = mObjects_pos.add(i * 0x8).readU64();
            var binder_object_pos       = mData_pos.add(binder_object_offset);
            var type_pos                = binder_object_pos;

            console.log("|----[i] type:");
            console.log(hexdump(type_pos, {
                offset: 0,
                length: 0x4,
                header: true,
                ansi: true
            }));

            if (type_pos.readU32() == BINDER_TYPE_PTR)
            {
                console.log("|----[i] identified as BINDER_TYPE_PTR, parse by following struct `binder_buffer_object`.");

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
                        console.log("|----[i] buffer content: ");
                        console.log(hexdump(buffer_pos.readPointer(), {
                            offset: 0,
                            length: length_pos.readU64(),
                            header: true,
                            ansi: true
                        }));
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
                    }
                    else
                    {
                        console.log("|-----[e] never run ME");
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
                console.log("|----[i] identified as BINDER_TYPE_BINDER, parse by following struct `flat_binder_object`.");

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
            else
            {
                console.log("|----[e] TODO:: Unknown BINDER_TYPE");
            }
        }
    }

    // defined in system/libhwbinder/Parcel.cpp
    function PAD_SIZE_UNSAFE(s)
    {
        return (((s)+3)&~3)
    }

    function fuzzOneSInt(mData_pos, SInt_pos, mHandle, code, data, reply, flags, isVendor)
    {
        var org_value = mData_pos.add(SInt_pos).readS32();
//        console.log("|-----[i] original value: 0x" + org_value.toString(16) + ", new value: 0x" + (~org_value).toString(16));

//        console.log(hexdump(mData_pos.add(UInt_pos), {
//            offset: 0,
//            length: 0x10,
//            header: true,
//            ansi: true
//        }));

        mData_pos.add(SInt_pos).writeS32(~org_value);

//        console.log(hexdump(mData_pos.add(UInt_pos), {
//            offset: 0,
//            length: 0x10,
//            header: true,
//            ansi: true
//        }));


        if (isVendor == false)
        {
            console.log("|-----[i] fuzz system Parcel");
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
            console.log("|-----[i] fuzz vendor Parcel");
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

        mData_pos.add(SInt_pos).writeS32(org_value);
        console.log("|-----[!] fuzz done, fuzzer ret value: 0x" + ret.toString(16));
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

        var object_offset_lst = new Array();;
        for (var i = 0; i < mObjectsSize; i ++)
        {
            object_offset_lst[i] = mObjects_pos.add(i * 0x8).readU64().toNumber();
        }
        console.log("|----[i] binder_object offset: " + object_offset_lst);

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
                fuzzOneSInt(mData_pos, i, mHandle, code, data, reply, flags, isVendor);
            }
        }
    }

    function parseParcel(args, isVendor){
        // args[0], `this` argument
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


        // dump the descriptor
        var descriptor = mData_pos.readUtf8String();
        console.log("|--[i] Descriptor: ");
        console.log(hexdump(mData_pos, {
            offset: 0,
            length: descriptor.length,
            header: true,
            ansi: true
        }));
//        if (descriptor.indexOf(fuzzInterface) == -1)
//            return

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

        // I would like to fuzz in runtime, such that I can covert back to the original mData.
        fuzzPeekhole(mData_pos, mDataSize, mObjects_pos, mObjectsSize, mHandle, args[1].toInt32(), args[2], args[3], args[4].toInt32(), isVendor);

        // console.log("|---[i] target: " + descriptor.indexOf("vendor.huawei.hardware.ai"));
//        if (mObjectsSize != 0)
//            fuzzObject(mData_pos, mObjects_pos, mObjectsSize, mHandle, args[1].toInt32(), args[2], args[3], args[4].toInt32(), isVendor);
    }

    console.log('[*] Frida js is running.')

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
            parseParcel(args, false);
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
            parseParcel(args, true);
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: Vendor BpHwBinder::transact");
            console.log("|-[i] ret value: " + retval);
            // print the return value
        }
    });

});

