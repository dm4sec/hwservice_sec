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
    frameworks/native/libs/binder/Parcel.cpp
    uintptr_t Parcel::ipcData() const
    {
        return reinterpret_cast<uintptr_t>(mData);
    }

    size_t Parcel::ipcDataSize() const
    {
        return (mDataSize > mDataPos ? mDataSize : mDataPos);
    }

    uintptr_t Parcel::ipcObjects() const
    {
        return reinterpret_cast<uintptr_t>(mObjects);
    }

    size_t Parcel::ipcObjectsCount() const
    {
        return mObjectsSize;
    }

    uint8_t*            mData;              this + 1 * (QWORD)
    size_t              mDataSize;          this + 2 * (QWORD)
    size_t              mDataCapacity;
    mutable size_t      mDataPos;
    binder_size_t*      mObjects;           this + 5 * (QWORD)
    size_t              mObjectsSize;       this + 6 * (QWORD)

    */
    const mData_LOC         = 0x8;
    const mDataSize_LOC     = 0x10;
    const mObjects_LOC      = 0x28;
    const mObjectsSize_LOC  = 0x30;

    /*
    status_t BpBinder::transact(
    uint32_t code, const Parcel& data, Parcel* reply, uint32_t flags)
    {
        // Once a binder has died, it will never come back to life.
        if (mAlive) {
            status_t status = IPCThreadState::self()->transact(
                mHandle, code, data, reply, flags);             <- *((_DWORD *)this + 2) is the 2nd argument.
            if (status == DEAD_OBJECT) mAlive = 0;
            return status;
        }

        return DEAD_OBJECT;
    }
    */

    const mHandle_LOC      = 0x8;

    // defined in frameworks/native/libs/binder/Parcel.cpp
    function PAD_SIZE_UNSAFE(s)
    {
        return (((s)+3)&~3)
    }

    function fuzzOneSInt(fuzzPos, mHandle, code, data, reply, flags)
    {
        var org_value = fuzzPos.readS32();
        var new_value = [0,
                        0x7f, 0x7fff, 0x7fffffff,
                        0x80, 0x8000, 0x80000000,
                        0xff, 0xffff, 0xffffffff,
                        org_value + 1,
                        ~org_value]
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

//        console.log(hexdump(mData_pos.add(SInt_pos), {
//            offset: 0,
//            length: 0x10,
//            header: true,
//            ansi: true
//        }));
            console.log("|-----[i] fuzz Parcel: " + org_value + " -> " + new_value[i]);

            var func_IPCThreadState_self = new NativeFunction(IPCThreadState_self_p, 'pointer', []);
            var IPCThreadState_Obj = func_IPCThreadState_self();
            // console.log("|-----[i] IPCThreadState object: 0x" + IPCThreadState_Obj.toString(16));

            var func_IPCThreadState_transact = new NativeFunction(IPCThreadState_transact_p, 'int32', ['pointer', 'int32', 'uint32', 'pointer', 'pointer', 'uint32']);
            var ret = func_IPCThreadState_transact(
                IPCThreadState_Obj,
                mHandle,
                code,
                data,
                reply,
                flags);

            console.log("|-----[i] done, ret value: 0x" + ret.toString(16));
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
    function fuzzPeekhole(mData_pos, mDataSize, mObjects_pos, mObjectsSize, mHandle, code, data, reply, flags){
        console.log("|---[i] start fuzzing peekhole in mData");

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

        // the mData is slightly different from that of hwservice, the layout is depicted as:
        // |--StrictModePolicy stuff--|--PropagateWorkSource stuff--|--interface len--|--interface--|--...--|

        i = PAD_SIZE_UNSAFE(4 + 4 + 4 + (mData_pos.add(0x8).readU32() + 1) * 2);
        // console.log("|----[i] data loc: 0x" + i.toString(16));

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
                fuzzOneSInt(mData_pos.add(i), mHandle, code, data, reply, flags);
            }
        }
    }

    console.log('[*] Frida js is running.')

    // Use the mangled name
    var BpBinder_transact_p = Module.getExportByName("libbinder.so", '_ZN7android8BpBinder8transactEjRKNS_6ParcelEPS1_j');
    console.log("[i] BpBinder::transact addr: " + BpBinder_transact_p)

    // In order to reach this function, I need to invoke `IPCThreadState::self()` firstly (as the 1st argument) and locate the `mHandle` variable.
    var IPCThreadState_transact_p = Module.getExportByName("libbinder.so", '_ZN7android14IPCThreadState8transactEijRKNS_6ParcelEPS1_j');
    console.log("[i] IPCThreadState::transact addr: " + IPCThreadState_transact_p)

    var IPCThreadState_self_p = Module.getExportByName("libbinder.so", '_ZN7android14IPCThreadState4selfEv');
    console.log("[i] IPCThreadState::self addr: " + IPCThreadState_self_p)

    const black_interface_list = [
        "android.content.pm.IPackageManager",
        "android.os.IServiceManager",
        "android.aps.IHwApsManager",
        "android.content.IContentProvider",
        "android.gui.DisplayEventConnection",
        "android.gui.IGraphicBufferProducer",
        "android.app.IActivityManager",
        "android.app.INotificationManager",

        // "android.app.IActivityTaskManager",
        "android.app.IUiModeManager",

        "com.android.internal.view.IInputMethodManager",
        "android.view.IWindowManager",
        "android.ui.ISurfaceComposer",
        "android.hardware.display.IDisplayManager",
        "android.view.IGraphicsStats",
        "android.view.IWindowSession",

        "android.pc.IHwPCManager",
        "android.net.IConnectivityManager",
        "android.utils.IMemory",
        "android.utils.IMemoryHeap",
        "com.android.internal.telephony.ISub",

        "android.hardware.ICamera",
        "android.hardware.ICameraService",
        "android.media.IAudioService",
        "com.android.internal.app.IAppOpsService",

        "android.content.IContentService",
        "android.ashmemd.IAshmemDeviceService",
        "android.content.IBulkCursor",
        "android.os.IUserManager",
        "android.ui.ISurfaceComposerClient",

        ];

    Interceptor.attach(BpBinder_transact_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: service fuzzer")

            // args[0], `this` argument
            console.log("|-[i] 1st argument, this: 0x" + args[0].toString(16))
            var mHandle = args[0].add(mHandle_LOC).readU32()
            console.log("|-[i] mHandle value: 0x" + mHandle.toString(16))

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

            // for collecting the black list
            var interface_str = mData_pos.add(0xc).readUtf16String();
            // return

            if (black_interface_list.includes(interface_str))
            {
                return;
            }
            else
            {
                console.log("|--[i] continue fuzzing interface: " + interface_str);
            }

            console.log("|--[i] mData: ");
            console.log(hexdump(mData_pos, {
                offset: 0,
                length: mDataSize,
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

            // I would like to fuzz in runtime, such that I can covert back to the original mData.
            fuzzPeekhole(mData_pos, mDataSize, mObjects_pos, mObjectsSize, mHandle, args[1].toInt32(), args[2], args[3], args[4].toInt32());

        },


        onLeave: function(retval) {
            console.log("[*] onLeave: service fuzzer");
            console.log("|-[i] return value: " + retval);
        }
    });
});

