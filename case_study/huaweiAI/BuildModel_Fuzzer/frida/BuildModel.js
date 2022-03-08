Java.perform(function () {

    const g_fuzz_status           = {
        "proc_name": "proc_name_AAoAA",
        "offset": mem_offset_AAoAA,
        "seed_index": 0,
        "original_value": 0,
        "new_value": 0,
        "last_exception": -1
    }

    // funcHelper("mmap")
    /***************************************************
    ** used to search for the target function **
    ***************************************************/
    function funcHelper(mangled_name){
        console.log("[i] searching for: " + mangled_name)
        var addr_map = new Map();

        var ms = Process.enumerateModules();
        for (var i = 0; i < ms.length; i ++ )
        {
            try{
                var func_ptr = Module.getExportByName(ms[i].path, mangled_name).toString(16);
                if (func_ptr != 0)
                {
                    console.log("[i] verbose info: " + ms[i].path + ", " + func_ptr);

                    if (!addr_map.has(func_ptr))
                    {
                        addr_map.set(func_ptr, ms[i].path);
                    }
                }
            }
            catch(err) {
                console.error(err);
            }
        }

        for (let [key, value] of addr_map.entries())
        {
            console.log("[i] " + mangled_name + ": " + value + ": 0x" + key);
        }
    }

    console.log('[*] Frida is attaching to process: ' + g_fuzz_status.proc_name);

    var g_BpHwBinder_transact_vendor_ptr = Module.getExportByName("/system/lib64/vndk-sp-29/libhidlbase.so", '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    console.log("[i] Vendor BpHwBinder::transact ptr addr: " + g_BpHwBinder_transact_vendor_ptr)

    var g_mmap_ptr = Module.getExportByName("/system/bin/app_process64", 'mmap');
    console.log("[i] mmap ptr addr: " + g_mmap_ptr);
    var g_mmap_func = new NativeFunction(g_mmap_ptr, 'uint64', ['uint64', 'uint32', 'int32', 'int32', 'int32', 'int32']);
    console.log("[i] mmap func addr: " + g_mmap_func)

    var g_munmap_ptr = Module.getExportByName("/system/bin/app_process64", 'munmap');
    console.log("[i] munmap ptr addr: " + g_munmap_ptr);
    var g_munmap_func = new NativeFunction(g_munmap_ptr, 'void', ['uint64', 'uint32']);
    console.log("[i] munmap func addr: " + g_munmap_func);

    function genSeed(org_value){
//        console.log("genSeed: ", org_value)
        return [//org_value,
                    ~org_value,
//                    org_value & 0xffffff00, org_value & 0xffff00ff, org_value & 0xff00ffff, org_value & 0x00ffffff,
//                    org_value | 0x000000ff, org_value | 0x0000ff00, org_value | 0x00ff0000, org_value | 0xff000000,
//                    org_value & 0xffffff00 + 0x7f, org_value & 0xffff00ff + 0x7f00, org_value & 0xff00ffff + 0x7f0000, org_value & 0x00ffffff + 0x7f000000,
//                    org_value & 0xffffff00 + 0x80, org_value & 0xffff00ff + 0x8000, org_value & 0xff00ffff + 0x800000, org_value & 0x00ffffff + 0x80000000,
                    0,
//                    0x7f, 0x7fff, 0x7fffff, 0x7fffffff,
//                    0x80, 0x8000, 0x800000, 0x80000000,
//                    0xff, 0xffff, 0xffffff,
                    0xffffffff,
//                    org_value + 1, org_value + 0x100, org_value + 0x10000, org_value + 0x1000000,
//                    org_value - 1, org_value - 0x100, org_value - 0x10000, org_value - 0x1000000,
                    0x41414141,
        ];
    }

    function dump_mem(mem_ptr, length){
        console.log(hexdump(mem_ptr, {
            offset: 0,
            length: length,
            header: true,
            ansi: true
        }));
    }

    // data in parcel
    const mData_LOC         = 0x28;
    const mDataSize_LOC     = 0x30;
    const mObjects_LOC      = 0x48;
    const mObjectsSize_LOC  = 0x50;

    const PROT_READ         = 0x1;
    const PROT_WRITE        = 0x2;
    const MAP_SHARED        = 0x1;

    const EPIPE		        = 32;	/* Broken pipe */
    const DEAD_OBJECT       = -EPIPE;

    // may help exploring the subtle exception.
    // in testing.

    Process.setExceptionHandler(function(error)
    {
        /*
        if (g_fuzz_status.last_exception != g_fuzz_status.offset)
        {
            g_fuzz_status.last_exception = g_fuzz_status.offset
        }
        else
        {
            console.warn("|-[!] ExceptionHandler: exception received, details: offset: 0x" + g_fuzz_status.offset.toString(16) + ", original value: 0x" + g_fuzz_status.original_value.toString(16) + ", new value: 0x" + g_fuzz_status.new_value.toString(16));
            console.warn("|-[!] ExceptionHandler: exception received, details: " + error);
            send("error|" + error + "|" + g_fuzz_status.offset + "|" + g_fuzz_status.original_value + "|" + g_fuzz_status.new_value);
            Interceptor.detachAll();
        }
        return false;
        */
        console.warn("|-[!] ExceptionHandler: exception received, details: offset: 0x" + g_fuzz_status.offset.toString(16) + ", original value: 0x" + g_fuzz_status.original_value.toString(16) + ", new value: 0x" + g_fuzz_status.new_value.toString(16));
        /*
        console.warn("|-[!] ExceptionHandler: exception received, error type: " + error.type + ", error address: " + error.address + ", in module: " + new ModuleMap().find(error.address).name);
        console.warn('|-[!] call stack:\n' +
            Thread.backtrace(error.context, Backtracer.ACCURATE)
            .map(DebugSymbol.fromAddress).join('\n') + '\n');
        */
        send("error|" + error + "|" + g_fuzz_status.offset + "|" + g_fuzz_status.original_value + "|" + g_fuzz_status.new_value);
        Interceptor.detachAll();
        return false;
    })

    Interceptor.attach(g_BpHwBinder_transact_vendor_ptr, {
        onEnter: function(args) {
//            console.log("[*] onEnter: g_BpHwBinder_transact_vendor_ptr");
            parseParcel(args);
        },

        onLeave: function(retval) {
//            console.log("[*] onLeave: g_BpHwBinder_transact_vendor_ptr");
            if (retval.toInt32() == DEAD_OBJECT){
                console.error("|-[!] error (dead object), offset: 0x" + g_fuzz_status.offset.toString(16) + ", original value: 0x" + g_fuzz_status.original_value.toString(16) + ", new value: 0x" + g_fuzz_status.new_value.toString(16));
                send("error|dead object|" + g_fuzz_status.offset + "|" + g_fuzz_status.original_value + "|" + g_fuzz_status.new_value);
                Interceptor.detachAll();
            }
        }
    });

    const whiteTransactionCode = [
        11,                             // vendor.huawei.hardware.ai@2.1::IModelManagerService_hidl      _hidl_BuildModel
    ];
    const fuzzInterface             = "vendor.huawei.hardware.ai@2.1::IModelManagerService_hidl"


    function parseParcel(args){
        // console.log("[i] InterfaceToken: " + args[2].add(mData_LOC).readPointer().readUtf8String() + ", TransactionCode: " + args[1].toInt32())

        // remove to enable all transactions.
        if (whiteTransactionCode.includes(args[1].toInt32()) == false)
            return;
        // remove to enable all interfaces.
        if (args[2].add(mData_LOC).readPointer().readUtf8String().indexOf(fuzzInterface) == -1)
            return;

        // mDataSize/mDataLen
        var mDataSize_offset = args[2].add(mDataSize_LOC);
        var mDataSize = mDataSize_offset.readU64();

        // mData
        var mData_offset = args[2].add(mData_LOC);
        var mData_ptr = mData_offset.readPointer();

        // dump_mem(mData_ptr, mDataSize);
        // return

        /*
        try{
        }
        catch(err) {
            console.error(err);
        }
        */

        // mObjectsSize
        var mObjectsSize_ptr = args[2].add(mObjectsSize_LOC);
        var mObjectsSize = mObjectsSize_ptr.readU64();
        // console.log("[i] mObjectsSize: 0x" + mObjectsSize.toString(16));

        // mObjects
        var mObjects_offset = args[2].add(mObjects_LOC);
        var mObjects_ptr = mObjects_offset.readPointer();

        fuzzObject(mData_ptr, mDataSize, mObjects_ptr, mObjectsSize)
        // studyObject(mData_ptr, mDataSize, mObjects_ptr, mObjectsSize)
    }

    function dump_native_handle(native_handle_ptr)
    {
        dump_mem(native_handle_ptr.add(0x8).readPointer(), native_handle_ptr.add(0x10).readU64());

        var this_fd = native_handle_ptr.add(0x8).readPointer().add(0x0c).readU32();
        var this_size = native_handle_ptr.add(0x8).readPointer().add(0x18).readU32();

        // console.log("|-[i] this_fd: 0x" + this_fd.toString(16));
        // console.log("|-[i] this_size: 0x" + this_size.toString(16));

        var map_memory_addr = g_mmap_func(
            0,
            this_size,
            PROT_READ|PROT_WRITE,
            MAP_SHARED,
            this_fd,
            0
        );

        dump_mem(ptr(map_memory_addr), 0x100)
    }

    function studyObject(mData_ptr, mDataSize, mObjects_ptr, mObjectsSize){
        dump_mem(mData_ptr.add(0x68 + 8).readPointer(), mData_ptr.add(0x68 + 0x10).readU64());

        dump_mem(mData_ptr.add(0xe4 + 8).readPointer(), mData_ptr.add(0xe4 + 0x10).readU64());
        dump_mem(mData_ptr.add(0x15c + 8).readPointer(), mData_ptr.add(0x15c + 0x10).readU64());

        dump_mem(mData_ptr.add(0x184 + 8).readPointer(), mData_ptr.add(0x184 + 0x10).readU64());
        dump_mem(mData_ptr.add(0x1fc + 8).readPointer(), mData_ptr.add(0x1fc + 0x10).readU64());

        dump_mem(mData_ptr.add(0x24c + 8).readPointer(), mData_ptr.add(0x24c + 0x10).readU64());
        dump_mem(mData_ptr.add(0x2c4 + 8).readPointer(), mData_ptr.add(0x2c4 + 0x10).readU64());

        dump_native_handle(mData_ptr.add(0x114))
        dump_native_handle(mData_ptr.add(0x1b4))
        dump_native_handle(mData_ptr.add(0x27c))
    }

    function fuzzObject(mData_ptr, mDataSize, mObjects_pos, mObjectsSize){
        // console.log("|-[i] enter fuzzObject")

        // dump_mem(mObjects_pos, mObjectsSize * 8);

        // go to the `fd` directly.
        var binder_object_ptr       = mData_ptr.add(0x1b4).add(0x8).readPointer();
        // var binder_object_ptr       = mData_ptr.add(0x114).add(0x8).readPointer();


        var this_fd = binder_object_ptr.add(0x0c).readU32();
        var this_size = binder_object_ptr.add(0x18).readU32();

        // console.log("|-[i] this_fd: 0x" + this_fd.toString(16));
        // console.log("|-[i] this_size: 0x" + this_size.toString(16));

        var map_memory_addr = g_mmap_func(
            0,
            this_size,
            PROT_READ|PROT_WRITE,
            MAP_SHARED,
            this_fd,
            0
        );

        // dump_mem(ptr(map_memory_addr), 0x20);

        if (g_fuzz_status.seed_index >= genSeed(0).length)
        {
            g_fuzz_status.offset += 4
            g_fuzz_status.seed_index = 0
        }
        if (g_fuzz_status.offset + 4 >= this_size)
        {
            console.warn("[i] finish fuzzing");
            send("done");
            Interceptor.detachAll();
        }

        if (g_fuzz_status.seed_index == 0)
        {
            // console.log("|-[d] send")
            send("info|" + g_fuzz_status.offset + "|" + this_size);
            // console.log("|-[d] send done")

            // wait the host to finish it's task.
            // console.log("|-[d] waiting message from host")
            var foo = recv('synchronize', function(value) {
                // console.log(value.payload)
                if (value.payload == "quit")
                {
                    console.log("|-[d] host message `quit` received, quit.");
                    Interceptor.detachAll();
                }
                else if (value.payload == "go")
                {
                    // console.log("|-[d] host message `go` received, continue.");
                }
            });
            foo.wait();
            // console.log("|-[d] host ready message received, continue.");
        }

        var fuzzPos = ptr(map_memory_addr).add(g_fuzz_status.offset);
        g_fuzz_status.original_value = fuzzPos.readU32();
        g_fuzz_status.new_value = genSeed(fuzzPos.readU32())[g_fuzz_status.seed_index];
        fuzzPos.writeS32(g_fuzz_status.new_value);

        // console.log("|-[i] fuzzing offset: 0x" + g_fuzz_status.offset.toString(16) + ", with org value: 0x" + g_fuzz_status.original_value.toString(16) + ", with seed: 0x" + g_fuzz_status.new_value.toString(16));

        // dump_mem(ptr(map_memory_addr).add(parseInt(g_fuzz_status.offset / 0x40) * 0x40), 0x40);

        g_munmap_func(
            map_memory_addr,
            this_size
        );

        g_fuzz_status.seed_index ++;
        // console.log("|-[i] fuzzing block: " + g_fuzz_status.block + ", with offset: " + g_fuzz_status.offset + ", with seed: " + new_value);
    }
});