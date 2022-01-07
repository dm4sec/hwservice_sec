Java.perform(function () {
    console.log('[*] Frida scenedection_new.js is running.');

    // data in parcel
    const mData_LOC         = 0x28;
    const mDataSize_LOC     = 0x30;
    const mObjects_LOC      = 0x48;
    const mObjectsSize_LOC  = 0x50;

    // type of BINDER
    const BINDER_TYPE_BINDER          = 0x73622a85                // .*bs
    const BINDER_TYPE_WEAK_BINDER     = 0x77622a85                // .*bw
    const BINDER_TYPE_HANDLE          = 0x73682a85                // .*hs
    const BINDER_TYPE_WEAK_HANDLE     = 0x77682a85                // .*hw
    const BINDER_TYPE_FD              = 0x66642a85                // .*df
    const BINDER_TYPE_FDA             = 0x66646185                // .adf
    const BINDER_TYPE_PTR             = 0x70742a85                // .*tp

    const ptr_flags             = 0x4;
    const ptr_buffer            = 0x8;
    const ptr_length            = 0x10;      // sizeof(buffer)
    const ptr_parent            = 0x18;
    const ptr_parent_offset     = 0x20;

    const PROT_READ             = 0x1;
    const PROT_WRITE            = 0x2;
    const MAP_SHARED            = 0x1;



    function dump(pos, length){
        console.log(hexdump(pos, {
            offset: 0,
            length: length,
            header: true,
            ansi: true
        }));
    }

//    const g_BpHwBinder_transact_ptr = Module.getExportByName("/vendor/lib64/hw/android.hardware.graphics.mapper@2.0-impl-2.1.so", '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
//    console.log("[i] BpHwBinder::transact addr           : " + g_BpHwBinder_transact_ptr)
//    const g_BpHwBinder_transact_func = new NativeFunction(g_BpHwBinder_transact_ptr, 'int', ['pointer', 'int', 'pointer', 'pointer', 'int', 'pointer']);
//    console.log("[i] BpHwBinder::transact func addr      : " + g_BpHwBinder_transact_func)


    const g_cur_progress        = {"offset": 176};
//    const g_cur_progress        = {"offset": 4};
//    const g_cur_progress        = {"offset": -4 + 0x4};
    const g_gen_seed            = {"offset": 7};
//    const g_gen_seed            = {"offset": 0};

    function genSeed(org_value){    // length: 38
        console.log("genSeed: ", org_value)
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

    function getBinderObjectLen(BinderObjectPos){
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

    // from path: /system/lib64/vndk-sp-29/libhidlbase.so
    const BpHwBinder_transact_vendor_p = Module.getExportByName("/system/lib64/vndk-sp-29/libhidlbase.so", '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    console.log("[i] Vendor BpHwBinder::transact addr    : " + BpHwBinder_transact_vendor_p)

    const g_mTransaction_code = [
        11                      //vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_startModelFromMem2
    ]
    const g_fuzzInterface = "vendor.huawei.hardware.ai@1.1::IAiModelMngr"

    Interceptor.attach(BpHwBinder_transact_vendor_p, {
        onEnter: function(args) {
//            console.log("[*] onEnter: Vendor BpHwBinder::transact");
            var name = "Vendor BpHwBinder::transact"
            parseParcel(name, args, this, true);
        },

        onLeave: function(retval) {
//            console.log("[*] onLeave: Vendor BpHwBinder::transact");
//            console.log("|-[i] ret value: " + retval);
//            console.log("retval.toInt32(): " + retval.toInt32())

//            if (retval.toInt32() == DEAD_OBJECT){
//                g_dead_obj_lst.push(g_obj_content_offset, g_obj_content_seed);    // should tell them apart
//                send("BpHwBinder_transact_vendor_p dead_object:" + g_obj_content_offset);
//                console.warn("|-[i] dead object received, stop intercepting. current offset: 0x" + g_obj_content_offset.toString(16));
//                Interceptor.detachAll();
//            }
//            send("done");
        }
    });


    function parseParcel(name, args, that, isVendor){
        var mInterface_token    = args[2].add(mData_LOC).readPointer().readUtf8String();
        var mTransaction_code   = args[1].toInt32();

        if  (!g_mTransaction_code.includes(mTransaction_code) || (mInterface_token.indexOf(g_fuzzInterface) == -1))
            return;

        console.log("-->parseParcel start: " + name)
        console.log("[Parcel_mData] interface_token: " + mInterface_token + ", method_code: " + mTransaction_code)
//        console.log("transact p1(this pos)          arg[0]=", args[0])
//        console.log("transact p2(transaction_code)  arg[1]=", args[1].toInt32())
//        console.log("transact p3(Parcel_hidl_data)  arg[2]=", args[2])
//        console.log("transact p4(Parcel_hidl_reply) arg[3]=", args[3])
//        console.log("transact p5(flags code)        arg[4]=", args[4].toInt32())
//        console.log("transact p6(callback)          arg[5]=", args[5])

        // mDataSize/mDataLen
        var mDataSize_pos = args[2].add(mDataSize_LOC);
        var mDataSize = mDataSize_pos.readU64();

        // mData
        var mData_offset = args[2].add(mData_LOC);
        var mData_pos = mData_offset.readPointer();
        console.log("[Parcel_mData] mDataPos: " + mData_pos + ", mDataSize: 0x" + mDataSize.toString(16));
        dump(mData_pos, mDataSize)

        // mObjectsSize/mObjectsLen
        var mObjectsSize_pos = args[2].add(mObjectsSize_LOC);
        var mObjectsSize = mObjectsSize_pos.readU64();
//        console.log("[Parcel_mData] mObjectsSize: 0x" + mObjectsSize.toString(16));

        // mObjects
        var mObjects_offset = args[2].add(mObjects_LOC);
        var mObjects_pos = mObjects_offset.readPointer();

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
        var name = mData_pos.readUtf8String();
        console.log("---->>parseObject start:", name);
        console.log("[Parcel_mData] [mObjects] pos: " + mObjects_pos + ", num: " + mObjectsSize)
//        dump(mObjects_pos, (mObjectsSize * 0x8));

        console.log("......... Start parse each buffer_object .........")
        var mObjectsList = [];      //  record pos of each mObject
        for(var i = 0; i < mObjectsSize; i++){
            console.log("[Parcel_mData] [mObjects] " + (i + 1) + "/" + mObjectsSize)
            var binder_object_offset    = mObjects_pos.add(i * 0x8).readU64();
            var binder_object_pos       = mData_pos.add(binder_object_offset);
            var obj_len                 = getBinderObjectLen(binder_object_pos);
            dump(binder_object_pos, obj_len);     //  dump each object
            mObjectsList[i] = binder_object_pos;

            var type_pos = binder_object_pos;
            if (type_pos.readU32() == BINDER_TYPE_PTR){

            }
            else if (type_pos.readU32() == BINDER_TYPE_BINDER){

            }
            else if (type_pos.readU32() == BINDER_TYPE_FDA){
                console.log("[Parcel_mData] [mObjects] [BINDER_TYPE_FDA], parse by struct `binder_fd_array_object`.");

                var num_fds         = binder_object_pos.add(0x8).readU64();
                var handle          = binder_object_pos.add(0x10).readU64();      // handle
                var buffer_offset   = binder_object_pos.add(0x18).readU64();      // handle中的偏移

                console.log("[Parcel_mData] [mObjects] [BINDER_TYPE_FDA], parent(mObject_index): " + handle);

                var parent_pos  = mObjectsList[handle];
                var buffer_pos  = parent_pos.add(ptr_buffer).readPointer();
                var buffer_len  = parent_pos.add(ptr_length).readU64();
                dump(buffer_pos, buffer_len)

                var this_fd     = buffer_pos.add(buffer_offset).readU32();
                var this_size   = buffer_pos.add(0x18).readU32();
                console.log("fuzz fd", this_fd, this_size);
                fuzz_obj(this_fd, this_size, "handle");
            }
            else{
                console.log("[Parcel_mData] [mObjects] Unknown binder type.")
            }
        }
        console.log(mObjectsList)
    }


    function fuzz_obj(obj, obj_len, type){
        console.log("in fuzz_obj");
        if(type == "handle"){
            var g_mmap_ptr = Module.getExportByName("libai_client.so", 'mmap');
        //    var g_mmap_ptr = Module.getExportByName("libai_hidl_request_client.so", 'mmap');
        //    var g_mmap_ptr = Module.getExportByName("/system/bin/app_process64", 'mmap');
            console.log("[i] mmap addr: " + g_mmap_ptr);
            var g_mmap_func = new NativeFunction(g_mmap_ptr, 'uint64', ['uint64', 'uint32', 'int32', 'int32', 'int32', 'int32']);
            console.log("[i] mmap func addr: " + g_mmap_func)
            var map_memory_addr = g_mmap_func(
                0,
                obj_len,
                PROT_READ|PROT_WRITE,
                MAP_SHARED,
                obj,
                0
            );
            fuzz_obj(map_memory_addr, obj_len, "buffer");
        }
        else if(type == "buffer"){
            var map_memory_ptr = ptr(obj);

            if(g_gen_seed.offset == 38){
                g_gen_seed.offset = 0
                send("ready:" + (g_cur_progress.offset + 4) + ":" + (g_gen_seed.offset))
            }else{
                send("ready:" + g_cur_progress.offset + ":" + (g_gen_seed.offset + 1))
            }
            recv('sig_synchronize', function(value) {
                g_cur_progress.offset   = value["payload"]["g_cur_progress"];
                g_gen_seed.offset       = value["payload"]["g_gen_seed"];
                console.log("|--[i] host ready message received, continue testing. " + g_cur_progress.offset+":"+g_gen_seed.offset);
            }).wait();

            var org_value = map_memory_ptr.add(g_cur_progress.offset).readS32();
            dump(map_memory_ptr.add(g_cur_progress.offset), 0x4)
            var new_value = genSeed(org_value)[g_gen_seed.offset];
            console.log("map_memory_ptr : " + map_memory_ptr.add(g_cur_progress.offset))
            console.log("org_value      0x: " + org_value.toString(16))
            console.log("new_value      0x: " + new_value.toString(16))
            map_memory_ptr.add(g_cur_progress.offset).writeS32(new_value);
            dump(map_memory_ptr.add(g_cur_progress.offset), 0x4)
        }
    }

    var SceneDectionActivity = Java.use("com.huawei.mlkit.sample.activity.scenedection.SceneDectionActivity");
    SceneDectionActivity.initAnalyzer.overload().implementation = function () {
        console.log("Start initAnalyzer.");
//        this.initAnalyzer();
//        this.detectImage();
//        this.stopAnalyzer();
        var m = 1;
        while(true){
//        for(var m = 1; m <= 10; m++){
            console.log("fy_fuzz_Noo." + m);
            this.initAnalyzer();
            this.detectImage();
            this.stopAnalyzer();
        }
    }
});