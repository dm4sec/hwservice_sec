Java.perform(function () {

    // may help exploring the stealthy exception.
    Process.setExceptionHandler(function(error)
    {
        send("app_exception:" + g_cur_progress[2]);
        console.warn("|-[i] app exception received. current offset: 0x" + g_cur_progress[2].toString(16));
        return false;
    })

    funcHelper('_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE')
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


    function genSeed(org_value)     // length: 38
    {
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

    console.log('[*] Frida scenedection.js is running.');

    var g_BpHwBinder_transact_ptr = Module.getExportByName("/vendor/lib64/hw/android.hardware.graphics.mapper@2.0-impl-2.1.so", '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    console.log("[i] BpHwBinder::transact addr: " + g_BpHwBinder_transact_ptr)

    const g_BpHwBinder_transact_func = new NativeFunction(g_BpHwBinder_transact_ptr, 'int', ['pointer', 'int', 'pointer', 'pointer', 'int', 'pointer']);
    console.log("[i] BpHwBinder::transact func addr: " + g_BpHwBinder_transact_func)

    const g_whiteTransactionCode = [
        12                      //vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_runModel2
    ];
    const g_fuzzInterface = "vendor.huawei.hardware.ai@1.1::IAiModelMngr";

    Interceptor.replace(g_BpHwBinder_transact_ptr, new NativeCallback(BpHwBinder_transact_fuzzer, 'int', ['pointer', 'int', 'pointer', 'pointer', 'int', 'pointer']));

    // data in parcel
    const g_mData_LOC         = 0x28;
    const g_mDataSize_LOC     = 0x30;
    const g_mObjects_LOC      = 0x48;
    const g_mObjectsSize_LOC  = 0x50;

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

        if (mObjectsSize != 0)
            console.log("start fuzzing");
    }



    function studyObject(mData_pos, mDataSize, mObjects_pos, mObjectsSize)
    {

        if (mObjectsSize <= 2)
            return;

        for (var index = 2; index < mObjectsSize; index += 2)
        {
            // dump each hidl_handle
            var hidl_handle_pos = mData_pos.add(mObjects_pos.add(index * 0x8).readU64());
            var buffer          = hidl_handle_pos.add(0x8).readPointer();
            var length          = hidl_handle_pos.add(0x10).readU32();

            console.log(hexdump(buffer, {
                offset: 0,
                length: length,
                header: true,
                ansi: true
            }));

            var this_fd         = buffer.add(0x0c).readU32();
            var this_size       = buffer.add(0x18).readU32();

            var this_mmap_p = Module.getExportByName("libai_hidl_request_client.so", 'mmap');
            console.log("|-----[i] mmap addr: " + this_mmap_p);

            var func_mmap = new NativeFunction(this_mmap_p,
                'uint64',
                ['uint64', 'uint32', 'int32', 'int32', 'int32', 'int32']
                );
            var map_memory_addr = func_mmap(
                0,
                this_size,
                PROT_READ|PROT_WRITE,
                MAP_SHARED,
                this_fd,
                0);

            console.log("|-----[i] mmap ret: 0x" + map_memory_addr.toString(16));
            console.log("|-----[i] dumping fd: 0x" + this_fd.toString(16) + ", size: 0x" + this_size.toString(16));

            var that_size = this_size > 0x100 ? 0x100: this_size;
            console.log(hexdump(ptr(map_memory_addr), {
                offset: 0,
                length: that_size,
                header: true,
                ansi: true
            }));

        }
    }


});
