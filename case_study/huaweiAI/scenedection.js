Java.perform(function () {

    // data in parcel
    const mData_LOC         = 0x28;
    const mDataSize_LOC     = 0x30;
    const mObjects_LOC      = 0x48;
    const mObjectsSize_LOC  = 0x50;

    // binder object type
    const BINDER_TYPE_BINDER          = 0x73622a85                // .*bs
    const BINDER_TYPE_WEAK_BINDER     = 0x77622a85                // .*bw
    const BINDER_TYPE_HANDLE          = 0x73682a85                // .*hs
    const BINDER_TYPE_WEAK_HANDLE     = 0x77682a85                // .*hw
    const BINDER_TYPE_FD              = 0x66642a85                // .*df
    const BINDER_TYPE_FDA             = 0x66646185                // .adf
    const BINDER_TYPE_PTR             = 0x70742a85                // .*tp

    const BINDER_BUFFER_FLAG_HAS_PARENT = 0x01

    // defined in system/libhwbinder/Parcel.cpp
    function PAD_SIZE_UNSAFE(s){
        return (((s)+3)&~3)
    }

    function dumpModuleInfo(){
        var ms = Process.enumerateModules();
        for (var i = 0; i < ms.length; i ++ )
        {
//            console.log(ms[i].name);
            if (ms[i].path.indexOf("libc") != -1)
                console.log(ms[i].path);
        }
    }
    function printBacktrace(that){
        console.log('   called from:\n' +
            Thread.backtrace(that.context, Backtracer.ACCURATE)
            .map(DebugSymbol.fromAddress).join('\n') + '\n');
    }

    function dump(pos, length){
        console.log(hexdump(pos, {
            offset: 0,
            length: length,
            header: true,
            ansi: true
        }));
    }

    console.log('[*] Frida scenedection.js is running.');
//    dumpModuleInfo();

    // from path: /system/lib64/libhidlbase.so
    var BpHwBinder_transact_p = Module.getExportByName("/system/lib64/libhidlbase.so", '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    console.log("[ixx] BpHwBinder::transact addr    : " + BpHwBinder_transact_p)

    var IPCThreadState_transact_p = Module.getExportByName("/system/lib64/libhidlbase.so", '_ZN7android8hardware14IPCThreadState8transactEijRKNS0_6ParcelEPS2_j');
    console.log("[ixx] IPCThreadState::transact addr: " + IPCThreadState_transact_p)

    var IPCThreadState_self_p = Module.getExportByName("/system/lib64/libhidlbase.so", '_ZN7android8hardware14IPCThreadState4selfEv');
    console.log("[ixx] IPCThreadState::self addr    : " + IPCThreadState_self_p)

    // from path: /system/lib64/vndk-sp-29/libhidlbase.so
    var BpHwBinder_transact_vendor_p = Module.getExportByName("/system/lib64/vndk-sp-29/libhidlbase.so", '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    console.log("[i] Vendor BpHwBinder::transact addr    : " + BpHwBinder_transact_vendor_p)

    var IPCThreadState_transact_vendor_p = Module.getExportByName("/system/lib64/vndk-sp-29/libhidlbase.so", '_ZN7android8hardware14IPCThreadState8transactEijRKNS0_6ParcelEPS2_j');
    console.log("[i] Vendor IPCThreadState::transact addr: " + IPCThreadState_transact_vendor_p)

    var IPCThreadState_self_vendor_p = Module.getExportByName("/system/lib64/vndk-sp-29/libhidlbase.so", '_ZN7android8hardware14IPCThreadState4selfEv');
    console.log("[i] Vendor IPCThreadState::self addr    : " + IPCThreadState_self_vendor_p)

/*
    // attach for test
    Interceptor.attach(BpHwBinder_transact_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: BpHwBinder_transact_p");
            var name = "BpHwBinder_transact_p"
            parseParcel(name, args, this, false);
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: BpHwBinder_transact_p");
//            console.log("|-[i] ret value: " + retval);
            // print the return value
        }
    });
    Interceptor.attach(IPCThreadState_transact_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: IPCThreadState_transact_p");
            var name = "IPCThreadState_transact_p"
            parseParcel(name, args, this, false);
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: IPCThreadState_transact_p");
//            console.log("|-[i] ret value: " + retval);
            // print the return value
        }
    });
    Interceptor.attach(IPCThreadState_self_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: IPCThreadState_self_p");
            var name = "IPCThreadState_self_p"
            parseParcel(name, args, this, false);
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: IPCThreadState_self_p");
//            console.log("|-[i] ret value: " + retval);
            // print the return value
        }
    });
*/

//    var fy_transact = new NativeFunction(BpHwBinder_transact_vendor_p, 'int32', ['uint32', 'pointer', 'pointer', 'uint32', 'pointer']);
//    console.log("fy_transact = " + fy_transact);
//    Interceptor.replace(BpHwBinder_transact_vendor_p, new NativeCallback(fy_transact,));

    Interceptor.attach(BpHwBinder_transact_vendor_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: Vendor BpHwBinder::transact");
            var name = "Vendor BpHwBinder::transact"
            parseParcel(name, args, this, true);
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: Vendor BpHwBinder::transact");
            console.log("|-[i] ret value: " + retval);
            // print the return value
        }
    });
//    Interceptor.attach(IPCThreadState_transact_vendor_p, {
//        onEnter: function(args) {
//            console.log("[*] onEnter: Vendor IPCThreadState_transact_vendor_p");
//            var name = "Vendor IPCThreadState_transact_vendor_p"
//            parseParcel(name, args, this, true);
//        },
//
//        onLeave: function(retval) {
//            console.log("[*] onLeave: Vendor IPCThreadState_transact_vendor_pt");
////            console.log("|-[i] ret value: " + retval);
//            // print the return value
//        }
//    });
//    Interceptor.attach(IPCThreadState_self_vendor_p, {
//        onEnter: function(args) {
//            console.log("[*] onEnter: Vendor IPCThreadState_self_vendor_p");
//            var name = "Vendor IPCThreadState_self_vendor_p"
//            parseParcel(name, args, this, true);
//        },
//
//        onLeave: function(retval) {
//            console.log("[*] onLeave: Vendor IPCThreadState_self_vendor_p");
////            console.log("|-[i] ret value: " + retval);
//            // print the return value
//        }
//    });

    const whiteTransactionCode = [
        12                      //vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_runModel2
    ]
    const fuzzInterface = "vendor.huawei.hardware.ai@1.1::IAiModelMngr"
//    const fuzzInterface = "vendor.huawei.hardware.ai.hidlrequest@1.0::IHidlRequest"


    function parseParcel(name, args, that, isVendor){
        // remove to enable all transactions.
        if (whiteTransactionCode.includes(args[1].toInt32()) == false)
            return;
        // remove to enable all interfaces.
//            console.log("fffff: "+args[2].add(mData_LOC).readPointer().readUtf8String())
        if (args[2].add(mData_LOC).readPointer().readUtf8String().indexOf(fuzzInterface) == -1)
            return;

        // print backtrace
//        printBacktrace(that)

        console.log("-->parseParcel start:", name)

        /*
        status_t BpHwBinder::transact(
            uint32_t code, const Parcel& data, Parcel* reply, uint32_t flags, TransactCallback callback)
        */
        console.log("transact p1(this pos)          arg[0]=", args[0])
        console.log("transact p2(transaction_code)  arg[1]=", args[1].toInt32())
        console.log("transact p3(Parcel_hidl_data)  arg[2]=", args[2])
        console.log("transact p4(Parcel_hidl_reply) arg[3]=", args[3])
        console.log("transact p5(flags code)        arg[4]=", args[4].toInt32())
        console.log("transact p6(callback)          arg[5]=", args[5])

        /*       Parcel    (*arg[2])    */
        /*
            const mData_LOC         = 0x28;
            const mDataSize_LOC     = 0x30;
            const mObjects_LOC      = 0x48;
            const mObjectsSize_LOC  = 0x50;
        */
//        console.log("Parcel 数据段:")
//        dump(args[2], 0x200)
        console.log("Parcel mData_size   =", "0x" + args[2].add(mDataSize_LOC).readU64().toString(16))
        console.log("Parcel mData_pos    =", args[2].add(mData_LOC).readPointer())
        console.log("Parcel mObjects_num =", args[2].add(mObjectsSize_LOC).readU64())
        console.log("Parcel mObjects_pos =", args[2].add(mObjects_LOC).readPointer())

        // mDataSize/mDataLen
        var mDataSize_pos = args[2].add(mDataSize_LOC);
        var mDataSize = mDataSize_pos.readU64();

        // mData
        var mData_offset = args[2].add(mData_LOC);
        var mData_pos = mData_offset.readPointer();
        console.log("|--[Parcel] mDataPos: " + mData_pos + ", mDataSize: 0x" + mDataSize.toString(16));
        console.log("|--[Parcel] [mData] interface_token: "+mData_pos.readUtf8String()+", method_code: "+args[1].toInt32())
        console.log("Memory.read: "+Memory.readU32(mData_pos.add(0x30)));
//        Memory.writeU32(mData_pos.add(0x30), 0x12345678);       // Maybe a way of fuzz
        dump(mData_pos, mDataSize)

        // mObjectsSize/mObjectsLen
        var mObjectsSize_pos = args[2].add(mObjectsSize_LOC);
        var mObjectsSize = mObjectsSize_pos.readU64();
        console.log("|--[i] mObjectsSize: 0x" + mObjectsSize.toString(16));

        // mObjects
        var mObjects_offset = args[2].add(mObjects_LOC);
        var mObjects_pos = mObjects_offset.readPointer();

//        console.log("|--[i] mObjects: ");
//        console.log(hexdump(mObjects_pos, {
//            offset: 0,
//            length: mObjectsSize * 0x8,
//            header: true,
//            ansi: true
//        }));

        /*
            Parse Object in Parcel
        */
        parseObject(mData_pos, mDataSize, mObjects_pos, mObjectsSize);
        console.log("<--parseParcel   end:", name)
    }

    function parseObject(mData_pos, mDataSize, mObjects_pos, mObjectsSize){
    /*  parcel 中各类信息的偏移
        const mData_LOC         = 0x28;
        const mDataSize_LOC     = 0x30;
        const mObjects_LOC      = 0x48;
        const mObjectsSize_LOC  = 0x50;
    */
    /*  参数含义
        mData_pos       parcel 中 mData 的指针, mData 的地址保存在 (基地址 arg[2] + 偏移 mData_LOC), 通过readPointer()读取
        mDataSize       parcel 中 mData 的长度, 长度 保存在 (基地址 arg[2] + 偏移 mDataSize_LOC), 通过readU64()读取
        mObjects_pos    parcel 中 mObject 的指针, mObject 的地址保存在 (基地址 arg[2] + 偏移 mObjects_LOC), 通过readPointer()读取
                                  (读出来的地址为第一个 mObject 的地址, 也是整个 mObject 数据段的起始地址，每个 mObject 固定长度0x8)
        mObjectsSize    parcel 中 mObject 的个数, 个数 保存在 (基地址 arg[2] + 偏移 mObjectsSize_LOC), 通过readU64()读取

        // arg[*] 为 transact 中的参数
        code            arg[1]  transaction_code
        data            arg[2]  parcel_hidl_data
        reply           arg[3]  parcel_hidl_reply
        flags           arg[4]  flags
    */

        var name = mData_pos.readUtf8String();
        console.log("---->>parseObject start:", name);
        console.log("|--[Parcel] [mObject] pos: " + mObjects_pos + ", num: " + mObjectsSize)
//        dump(mObjects_pos, (mObjectsSize * 0x8 + mObjectsSize * 0x10));
        dump(mObjects_pos, (mObjectsSize * 0x8));

//        var binder_object_offset    = mObjects_pos.add(0 * 0x8).readU64();
//        var binder_object_pos       = mData_pos.add(binder_object_offset);
//        var buffer_pos              = binder_object_pos.add(0x8);
//        var length_pos              = binder_object_pos.add(0x10);

        console.log("......... Start parse each buffer_object .........")
        var mObjectsList = []
        for(var i = 0; i < mObjectsSize; i++){
            // each binder object
            console.log("Deal buffer_object No." + (i + 1))
            var binder_object_offset    = mObjects_pos.add(i * 0x8).readU64();
            var binder_object_pos       = mData_pos.add(binder_object_offset);

            mObjectsList[i] = binder_object_pos;        //record each buffer_object_pos

            if(mObjectsSize - i == 1){
                var binder_object_size  = mData_pos.add(mDataSize) - binder_object_pos
//                console.log("   [[[[[[ last mObjectSize: 0x" + binder_object_size.toString(16))
            }else{
                var binder_object_size  = mObjects_pos.add((i + 1) * 0x8).readU64() - mObjects_pos.add(i * 0x8).readU64()
            }

            console.log("   [binder object] pos: " + binder_object_pos + ", size: 0x" + binder_object_size.toString(16))
            dump(binder_object_pos, binder_object_size) // dump binder_object

            /* code form linux/android/binder.h
            #define B_PACK_CHARS(c1,c2,c3,c4) ((((c1) << 24)mObjectsSize) | (((c2) << 16)) | (((c3) << 8)) | (c4))
            #define B_TYPE_LARGE 0x85
            enum {
                BINDER_TYPE_BINDER      = B_PACK_CHARS('s', 'b', '*', B_TYPE_LARGE),
                BINDER_TYPE_WEAK_BINDER = B_PACK_CHARS('w', 'b', '*', B_TYPE_LARGE),
                BINDER_TYPE_HANDLE      = B_PACK_CHARS('s', 'h', '*', B_TYPE_LARGE),
                BINDER_TYPE_WEAK_HANDLE = B_PACK_CHARS('w', 'h', '*', B_TYPE_LARGE),
                BINDER_TYPE_FD          = B_PACK_CHARS('f', 'd', '*', B_TYPE_LARGE),
                BINDER_TYPE_FDA         = B_PACK_CHARS('f', 'd', 'a', B_TYPE_LARGE),
                BINDER_TYPE_PTR         = B_PACK_CHARS('p', 't', '*', B_TYPE_LARGE),
            };
            */
//            console.log("BINDER_TYPE: 0x" + binder_object_pos.readS32().toString(16))    // 读长度为0x4的内容

            if(binder_object_pos.readS32() == BINDER_TYPE_PTR){
                console.log("|--[Parcel] [mObject] [BINDER_TYPE_PTR] ")
                /* the struct of binder_buffer_object

                    struct binder_object_header {
                        __u32        type;
                    };
                    struct binder_buffer_object {
                        struct binder_object_header hdr;            //__u32     0x0
                        __u32                       flags;          //__u32     0x4
                        binder_uintptr_t            buffer;         //__u64     0x8
                        binder_size_t               length;         //__u64     0x10
                        binder_size_t               parent;         //__u64     0x18
                        binder_size_t               parent_offset;  //__u64     0x20
                    };
                */
                var flags_pos           = binder_object_pos.add(0x4);
                var buffer_pos          = binder_object_pos.add(0x8);
                var length_pos          = binder_object_pos.add(0x10);      // sizeof(buffer)
                var parent_pos          = binder_object_pos.add(0x18);
                var parent_offset_pos   = binder_object_pos.add(0x20);

                console.log("PTR_binder flags: 0x" + flags_pos.readU32())
                if(flags_pos.readU32() == BINDER_BUFFER_FLAG_HAS_PARENT){   //BINDER_BUFFER_FLAG_HAS_PARENT = 0x01
                    // writeEmbeddedBuffer
                    console.log("PTR_binder assembled by `writeEmbeddedBuffer`");
                    if(i == 13){
                        console.log(buffer_pos.readPointer());
                        Memory.writeUtf8String(buffer_pos.readPointer(), "SceneRecognition_v2_new.fy");
                    }

                    console.log("PTR_binder binder buffer_pos: "+ buffer_pos.readPointer() +", buffer_length: 0x" + length_pos.readU64().toString(16))

                    if(length_pos.readU64() != 0){
                        dump(buffer_pos.readPointer(), length_pos.readU64())
                        try{
                            dump(buffer_pos.readPointer().add(0 * 0x10).readPointer(), 0x20)
                        }catch(e){
                            console.log("can not read the address of buffer_pos.readPointer() "+buffer_pos.readPointer().add(0 * 0x10).readPointer())
                        }
                    }
                }
                else{
                    console.log("------binder buffer has not parent");
                    dump(buffer_pos, length_pos.readU64())
                    try{
                        buffer_pos.readPointer()
                        dump(buffer_pos.readPointer(), 0x10)
                    }catch{
                        console.log("------ can not read 0x"+buffer_pos.toString(16))
                    }
                }
            }

            if(binder_object_pos.readS32() == BINDER_TYPE_FDA){
                console.log("|--[Parcel] [mObject] [BINDER_TYPE_FDA] ")
                /*
                    struct binder_object_header {
                        __u32                       type;
                    };
                    struct binder_fd_array_object {
                        struct binder_object_header	hdr;            //__u32      0x0
                        __u32				        pad;            //__u32      0x4
                        binder_size_t			    num_fds;        //__u64      0x8
                        binder_size_t			    parent;         //__u64      0x10
                        binder_size_t			    parent_offset;  //__u64      0x18
                    };
                */

                var num_fds_pos                 = binder_object_pos.add(0x8);
                var parent_pos                  = binder_object_pos.add(0x10);      // handle
                var parent_offset_pos           = binder_object_pos.add(0x18);      // handle中的偏移

                console.log("|----[i] num_fds: 0x" + num_fds_pos.readU64().toString(16));
                /*  from source code:
                    if (handle != nullptr) {
                        // We use an index into mObjects as a handle
                        *handle = mObjectsSize;
                    }
                */
                console.log("|----[i] parent(mObject_index): " + parent_pos.readU64() + " --> No." + parent_pos.readU64().add(1));
                console.log("|----[i] parent_offset: 0x" + parent_offset_pos.readU64().toString(16));

                var this_mmap_p = Module.getExportByName("libai_client.so", 'mmap');
//                var this_mmap_p = Module.getExportByName("libai_hidl_request_client.so", 'mmap');
                console.log("|------[i] mmap addr: " + this_mmap_p);

                var func_mmap = new NativeFunction(this_mmap_p,
                    'uint64',
                    ['uint64', 'uint32', 'int32', 'int32', 'int32', 'int32']
                );

                // just copy
                var PROT_READ         = 0x1;
                var PROT_WRITE        = 0x2;
                var MAP_SHARED        = 0x1;

//                var this_size = buffer_pos.readPointer().add(0x18).readU32();
//                var this_fd   = buffer_pos.readPointer().add(0x0c).readU32();
                var real_parent_pos = mObjectsList[parent_pos.readU64()];
                console.log("real_parent_pos  : " + real_parent_pos);
                var binder_buffer_pos = real_parent_pos.add(0x8).readPointer()
                console.log("binder_buffer_pos: " + binder_buffer_pos);

                var fd = binder_buffer_pos.add(parent_offset_pos.readU64())
                console.log("fd_pos           : " + fd);

                var this_fd         = fd.readU32();
                console.log("this_size_pos    : " + binder_buffer_pos.add(0x18))
                var this_size       = binder_buffer_pos.add(0x18).readU32()
//                var this_size       = binder_buffer_pos.readU64().toString(16)
                console.log("this_size        : 0x" + this_size.toString(16))
                console.log("this_fd          : 0x" + this_fd.toString(16));

                var map_memory_addr = func_mmap(
                    0,
                    this_size,
                    PROT_READ|PROT_WRITE,
                    MAP_SHARED,
                    this_fd,
                    0
                );

//                console.log("map_memory_addr: " + ptr(map_memory_addr));
//                dump(ptr(map_memory_addr), this_size);        //  some this_size is too large
                if(this_size > 0x200){
                    console.log("map_memory_addr: " + ptr(map_memory_addr) + ", size: 0x" + this_size.toString(16) + "(too large, dump 0x200)");
                    dump(ptr(map_memory_addr), 0x200)
                }else{
                    console.log("map_memory_addr: " + ptr(map_memory_addr) + ", size: 0x" + this_size.toString(16));
                    dump(ptr(map_memory_addr), this_size);
                }
            }
        }
        console.log("The pos of each mObject:", mObjectsList);
        console.log("<<----parseObject   end:", name);
    }
});
