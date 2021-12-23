// https://frida.re/docs/javascript-api/

Java.perform(function () {

    const mData_LOC         = 0x28;
    const mDataSize_LOC     = 0x30;
    const mObjects_LOC      = 0x48;
    const mObjectsSize_LOC  = 0x50;


	const PROT_READ         = 0x1;
	const PROT_WRITE        = 0x2;
	const MAP_SHARED        = 0x1;

    const EPIPE		        = 32;	/* Broken pipe */
    const DEAD_OBJECT       = -EPIPE;

    /* I defined 3 stages of the fuzzing,
    the 1st stage is to fuzz the peekhole within the parcel,
    the 2nd stage is to fuzz the binder_object of the parcel,
    the 3rd stage is to fuzz the content of the binder_object.
    */

    var stage               = 0;

    const peekHoleOffset    = [0x2c, 0x30];
    var g_peekhole_index    = 2;
    var g_peekhole_seed     = 0;


    function genSeed(org_value)
    {
        return [//org_value,           // replay (test double-free?)
// I removed most of them, for it works really slow.
                        ~org_value,
//                        org_value & 0xffffff00, org_value & 0xffff00ff, org_value & 0xff00ffff, org_value & 0x00ffffff,
//                        org_value | 0x000000ff, org_value | 0x0000ff00, org_value | 0x00ff0000, org_value | 0xff000000,
//                        org_value & 0xffffff00 + 0x7f, org_value & 0xffff00ff + 0x7f00, org_value & 0xff00ffff + 0x7f0000, org_value & 0x00ffffff + 0x7f000000,
//                        org_value & 0xffffff00 + 0x80, org_value & 0xffff00ff + 0x8000, org_value & 0xff00ffff + 0x800000, org_value & 0x00ffffff + 0x80000000,
                        0,
//                        0x7f, 0x7fff, 0x7fffff, 0x7fffffff,
//                        0x80, 0x8000, 0x800000, 0x80000000,
//                        0xff, 0xffff, 0xffffff,
                        0xffffffff,
//                        org_value + 1, org_value + 0x100, org_value + 0x10000, org_value + 0x1000000,
//                        org_value - 1, org_value - 0x100, org_value - 0x10000, org_value - 0x1000000,
                        0x41414141,
                        ];
    }


    function studyObject(mData_pos, mDataSize, mObjects_pos, mObjectsSize, code, data, reply, flags, isVendor)
    {
// the layout of mData is as:
//    0                0x38  0x3c  0x40       0x68                    0x90                 0x98          0xc0       0xe8
//    |-----------------|-----|-----|----------|-----------------------|--------------------|-------------|----------|-----
//    | interface token | int | int | hidl_vec | hidl_vec<hidl_handle> | native_handle_size | hidl_handle | fd_array | ...
//                                                                     \--------------------------- zero or more --------

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


    function fuzzPeekhole(mData_pos, mDataSize, mObjects_pos, mObjectsSize, code, data, reply, flags, isVendor)
    {
        console.log("|---[i] start fuzzing peekholes in mData");

        var dummy_seed = genSeed(0);
        if (g_peekhole_seed >= dummy_seed.length)
        {
            g_peekhole_index += 1;
            g_peekhole_seed = 0;
        }
        if (g_peekhole_index >= peekHoleOffset.length)
        {
            console.log("|---[*] peekholes fuzz done");
            return -1;
        }

        var fuzz_pos       = mData_pos.add(peekHoleOffset[g_peekhole_index]);

        console.log(hexdump(mData_pos, {
            offset: 0,
            length: mDataSize,
            header: true,
            ansi: true
        }));

        var org_value = fuzz_pos.readS32();
        var new_value = genSeed(org_value);

        console.log("|-----[i] g_peekhole_index: 0x" + g_peekhole_index.toString(16) + ", g_peekhole_seed: 0x" + g_peekhole_seed.toString(16));
        console.log("|-----[i] fuzz memory: " + mData_pos.toString(16) + ", with offset: 0x" + peekHoleOffset[g_peekhole_index].toString(16) + ", with seed: 0x" + new_value[g_peekhole_seed].toString(16));

        fuzz_pos.writeS32(new_value[g_obj_content_seed]);
        console.log(hexdump(mData_pos, {
            offset: 0,
            length: mDataSize,
            header: true,
            ansi: true
        }));

        g_peekhole_seed ++;
        return 1;
    }

    /* TODO::
    // fuzz the field in the <hidl_vec> and <hidl_handle>?
    */

    // 0x11 (#2), 0x10 (#3, #4), 0x13 (#5, #6, #7), 0x1b (#8) and 0x14 (#9)
    // set manually
    const g_cur_process = [
        0x11, /* which tag */
        0, /* which hidl_handle */
        0x5f4 + 4, /* offset */
        ];

    // collect manually
    var g_obj_content_seed          = 0x0;

    function fuzz_imagesegmentation(mData_pos, mDataSize, mObjects_pos, mObjectsSize, code, data, reply, flags, isVendor)
    {
// the layout of mData is as:
//    0                0x38  0x3c  0x40       0x68                    0x90                 0x98          0xc0       0xe8
//    |-----------------|-----|-----|----------|-----------------------|--------------------|-------------|----------|-----
//    | interface token | int | int | hidl_vec | hidl_vec<hidl_handle> | native_handle_size | hidl_handle | fd_array | ...
//                                                                     \--------------------------- zero or more --------

        var binder_object_offset    = mObjects_pos.add(2 * 0x8 + g_cur_process[1] * 0x10).readU64();
        var binder_object_pos       = mData_pos.add(binder_object_offset);

        var buffer_pos              = binder_object_pos.add(0x8);
        var length_pos              = binder_object_pos.add(0x10);

        console.log("|---[i] buffer: " + buffer_pos.readPointer());
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

        console.log("|-----[i] mmap buffer: 0x" + map_memory_addr.toString(16));

        var this_fd_memory = ptr(map_memory_addr);

//        console.log(hexdump(ptr(map_memory_addr), {
//            offset: 0,
//            length: this_size > 0x100 ? 0x100: this_size,
//            header: true,
//            ansi: true
//        }));

        var dummy_seed = genSeed(0);
        if (g_obj_content_seed >= dummy_seed.length)
        {
            g_cur_process[2] += 4;
            g_obj_content_seed = 0;
//            while(g_collected_crash.includes(g_cur_process[2])) // skip those crash the app
//            {
//                g_cur_process[2] += 4;
//            }
        }

        if (g_obj_content_seed == 0)
        {
            // send message to host.
            send("ready:" + g_cur_process[2]);
            // wait the host to finish it's task.
            var foo = recv('synchronize', function(value) {
                console.log("|-----[i] host ready message received, continue.");
            });
            foo.wait();
        }

        if (g_cur_process[2] >= this_size)
        {
            console.error("|[*] fuzz_imagesegmentation fuzz done");
            Interceptor.detachAll();
        }

        var org_value = this_fd_memory.add(g_cur_process[2]).readS32();
        var new_value = genSeed(org_value);

        console.log("|-----[i] g_cur_process[2]: 0x" + g_cur_process[2].toString(16) + ", g_obj_content_seed: 0x" + g_obj_content_seed.toString(16));
        console.log("|-----[i] fuzz memory: " + this_fd_memory.toString(16) + ", with offset: 0x" + g_cur_process[2].toString(16) + ", with seed: 0x" + new_value[g_obj_content_seed].toString(16));

        this_fd_memory.add(g_cur_process[2]).writeS32(new_value[g_obj_content_seed]);

        var this_munmap_p = Module.getExportByName("libai_hidl_request_client.so", 'munmap');
        console.log("|-----[i] munmap addr: " + this_munmap_p);

        var func_munmap = new NativeFunction(this_munmap_p,
            'void',
            ['uint64', 'uint32']
            );
        func_munmap(
            map_memory_addr,
            this_size
            );

//        try{
//            console.log(hexdump(this_fd_memory, {
//                offset: 0,
//                length: 0x40,
//                header: true,
//                ansi: true
//            }));
//        }
//        catch(err)
//        {
//            console.log("|-----[e] can't read");
//            return;
//        }

        g_obj_content_seed ++;

    }

    const whiteTransactionCode = [
        1,                                 // vendor::huawei::hardware::ai::hidlrequest::V1_0::BpHwHidlRequest::_hidl_execute
    ];

    const fuzzInterface             = "vendor.huawei.hardware.ai.hidlrequest@1.0::IHidlRequest"
    var     g_dead_obj_lst          = [];

    function parseParcel(args, that, isVendor){
        // remove to enable all transactions.
        if (whiteTransactionCode.includes(args[1].toInt32()) == false)
            return;

        // remove to enable all interfaces.
        if (args[2].add(mData_LOC).readPointer().readUtf8String().indexOf(fuzzInterface) == -1)
            return

        var mData_offset = args[2].add(mData_LOC);
        var mData_pos = mData_offset.readPointer();
        if (mData_pos.add(0x3c).readU32() != g_cur_process[0])
            return;

//        console.log('[i] call stack:\n' +
//            Thread.backtrace(that.context, Backtracer.ACCURATE)
//            .map(DebugSymbol.fromAddress).join('\n') + '\n');

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
        var interfaceToken = mData_pos.readUtf8String();
        console.log("|--[i]interface Token: ");
        console.log(hexdump(mData_pos, {
            offset: 0,
            length: interfaceToken.length,
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

        if (mObjectsSize != 0)
//            var ret = fuzzPeekhole(mData_pos, mDataSize, mObjects_pos, mObjectsSize, args[1].toInt32(), args[2], args[3], args[4].toInt32(), isVendor);
//            if (ret == -1)
                // studyObject(mData_pos, mDataSize, mObjects_pos, mObjectsSize, args[1].toInt32(), args[2], args[3], args[4].toInt32(), isVendor);
                fuzz_imagesegmentation(mData_pos, mDataSize, mObjects_pos, mObjectsSize, args[1].toInt32(), args[2], args[3], args[4].toInt32(), isVendor);
    }

    console.log('[*] Frida js is running.');


    // may help exploring the stealthy exception.
    // in testing.
    Process.setExceptionHandler(function(error)
    {
        send("app_exception:" + g_cur_process[2]);
        console.warn("|-[i] app exception received. current offset: 0x" + g_cur_process[2].toString(16));
        return false;
    })

    // return
    // Use the mangled name
    var BpHwBinder_transact_p = Module.getExportByName("/system/lib64/libhidlbase.so", '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    console.log("[i] BpHwBinder::transact addr: " + BpHwBinder_transact_p)

    Interceptor.attach(BpHwBinder_transact_p, {
        onEnter: function(args) {
//            console.log("[*] onEnter: BpHwBinder::transact");
//            console.log('[i] called from:\n' +
//                Thread.backtrace(this.context, Backtracer.ACCURATE)
//                .map(DebugSymbol.fromAddress).join('\n') + '\n');

            parseParcel(args, this, false);
        },

        onLeave: function(retval) {
//            console.log("[*] onLeave: BpHwBinder::transact");
//            console.log("|-[i] ret value: " + retval);
            if (retval.toInt32() == DEAD_OBJECT)
            {
                g_dead_obj_lst.push(g_cur_process[2], g_obj_content_seed);
                send("dead_object:" + g_cur_process[2]);
                console.warn("|-[i] dead object received, stop intercepting. current offset: 0x" + g_cur_process[2].toString(16));
                Interceptor.detachAll();
//                g_dead_obj_lst.push(g_object_offset, g_object_index);
            }
//            send("done");
        }
    });


    var BpHwBinder_transact_vendor_p = Module.getExportByName("/system/lib64/vndk-sp-29/libhidlbase.so", '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    console.log("[i] Vendor BpHwBinder::transact addr: " + BpHwBinder_transact_vendor_p)

    Interceptor.attach(BpHwBinder_transact_vendor_p, {
        onEnter: function(args) {
//            console.log("[*] onEnter: Vendor BpHwBinder::transact");
            parseParcel(args, this, true);
        },

        onLeave: function(retval) {
//            console.log("[*] onLeave: Vendor BpHwBinder::transact");
//            console.log("|-[i] ret value: " + retval);
            if (retval.toInt32() == DEAD_OBJECT)
            {
                g_dead_obj_lst.push(g_cur_process[2], g_obj_content_seed);
                send("dead_object:" + g_cur_process[2]);
//                g_dead_obj_lst.push(g_object_offset, g_object_index);
                console.warn("|-[i] dead object received, stop intercepting. current offset: 0x" + g_cur_process[2].toString(16));
                Interceptor.detachAll();
            }
//            send("done");
        }
    });


});

