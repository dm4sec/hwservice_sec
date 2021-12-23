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

    // collect manually
    // 0x80, 0xfc, 0x12c, 0x1bc, 0x1c0, 0x1e0, 0x250, 0x25c, 0x2f0, 0x568, 0x5c4, 0x624, 0x82c, 0xa04
    var g_collected_crash           = [-4, 0x12c, 0x1bc, 0x1c0, 0x1e0, 0x1e4, 0x250, 0x25c, 0x260, 0x2f0, 0x2f4, 0x5c4, 0x5c8,
                                        0x624, 0x1b88, 0x3130, 0x4000, 0x4158, 0x416c, 0x4224, 0x4228, 0x422c,
                                        0x4244, ];
    // var g_obj_content_offset        = g_collected_crash[g_collected_crash.length - 1] + 0x4;
    var g_obj_content_offset        = 0x4244 + 4;
    var g_obj_content_seed          = 0x0;

    function genSeed(org_value)     // length: 38
    {
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

    function fuzz_textsuperresolution(mData_pos, mObjects_pos, mObjectsSize, code, data, reply, flags, isVendor)
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

        // this_size = 8;

        var this_mmap_p = Module.getExportByName("libai_client.so", 'mmap');
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

        var this_fd_memory = ptr(map_memory_addr);
//        console.log("|-----[i] mmap buffer: 0x" + ret.toString(16));
//        try{
//            console.log(hexdump(this_fd_memory, {
//                offset: 0,
//                length: 0x100,
//                header: true,
//                ansi: true
//            }));
//        }
//        catch(err)
//        {
//            console.log("|-----[e] can't read");
//            return;
//        }

        var dummy_seed = genSeed(0);
        if (g_obj_content_seed >= dummy_seed.length)
        {
            g_obj_content_offset += 4;
            g_obj_content_seed = 0;
//            while(g_collected_crash.includes(g_obj_content_offset)) // skip those crash the app
//            {
//                g_obj_content_offset += 4;
//            }
        }

        if (g_obj_content_seed == 0)
        {
            // send message to host.
            send("ready:" + g_obj_content_offset);
            // wait the host to finish it's task.
            var foo = recv('synchronize', function(value) {
                console.log("|-----[i] host ready message received, continue.");
            });
            foo.wait();
        }

        if (g_obj_content_offset >= this_size)
        {
            console.log("|[*] fuzz_textsuperresolution fuzz done");
            return;
        }

        var org_value = this_fd_memory.add(g_obj_content_offset).readS32();
        var new_value = genSeed(org_value);

        console.log("|-----[i] g_obj_content_offset: 0x" + g_obj_content_offset.toString(16) + ", g_obj_content_seed: 0x" + g_obj_content_seed.toString(16));
        console.log("|-----[i] fuzz memory: " + this_fd_memory.toString(16) + ", with offset: 0x" + g_obj_content_offset.toString(16) + ", with seed: 0x" + new_value[g_obj_content_seed].toString(16));

        this_fd_memory.add(g_obj_content_offset).writeS32(new_value[g_obj_content_seed]);

        var this_munmap_p = Module.getExportByName("libai_client.so", 'munmap');
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
        // 11,                                 // vendor.huawei.hardware.ai@2.1::IModelManagerService_hidl         _hidl_BuildModel
        11,                                 // vendor.huawei.hardware.ai@1.1::IAiModelMngr                      _hidl_startModelFromMem2
        // 12                                  // vendor.huawei.hardware.ai@1.1::IAiModelMngr                      _hidl_runModel2
    ];
    // const fuzzInterface     = "vendor.huawei.hardware.ai";
    const fuzzInterface             = "vendor.huawei.hardware.ai@1.1::IAiModelMngr"
    var     g_dead_obj_lst          = [];

    function parseParcel(args, that, isVendor){
        // remove to enable all transactions.
        if (whiteTransactionCode.includes(args[1].toInt32()) == false)
            return;

        // remove to enable all interfaces.
        if (args[2].add(mData_LOC).readPointer().readUtf8String().indexOf(fuzzInterface) == -1)
            return

        console.log("|-[*] dead object list: " + g_dead_obj_lst);

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
        console.log("|--[interface Token: ");
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
            var ret = fuzzPeekhole(mData_pos, mDataSize, mObjects_pos, mObjectsSize, args[1].toInt32(), args[2], args[3], args[4].toInt32(), isVendor);
            if (ret == -1)
                fuzz_textsuperresolution(mData_pos, mObjects_pos, mObjectsSize, args[1].toInt32(), args[2], args[3], args[4].toInt32(), isVendor);
    }


    console.log('[*] Frida js is running.');

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
                g_dead_obj_lst.push(g_obj_content_offset, g_obj_content_seed);    // should tell em apart
                send("dead_object:" + g_obj_content_offset);
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
                g_dead_obj_lst.push(g_obj_content_offset, g_obj_content_seed);    // should tell them apart
                send("dead_object:" + g_obj_content_offset);
//                g_dead_obj_lst.push(g_object_offset, g_object_index);
            }
//            send("done");
        }
    });


});

