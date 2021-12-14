// https://frida.re/docs/javascript-api/

Java.perform(function () {

    const mData_LOC         = 0x28;
    const mDataSize_LOC     = 0x30;
    const mObjects_LOC      = 0x48;
    const mObjectsSize_LOC  = 0x50;


	const PROT_READ         = 0x1;
	const PROT_WRITE        = 0x2;
	const MAP_SHARED        = 0x1;

    var g_cur_offset        = 0;
    var g_cur_seed          = 0;

    function fuzz_hidl_startModelFromMem2(mData_pos, mObjects_pos, mObjectsSize, code, data, reply, flags, isVendor)
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

        this_size = 8;

        var this_mmap_p = Module.getExportByName("libai_client.so", 'mmap');
        console.log("|-----[i] mmap addr: " + this_mmap_p);

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

        console.log("|-----[i] mmap ret: 0x" + ret.toString(16));

        var this_fd_memory = ptr(ret);
        console.log("|-----[i] mmap buffer: 0x" + ret.toString(16));
        try{
            console.log(hexdump(this_fd_memory, {
                offset: 0,
                length: 0x40,
                header: true,
                ansi: true
            }));
        }
        catch(err)
        {
            console.log("|-----[e] can't read");
            return;
        }

        if (g_cur_seed >= 21 /*21, new_value.length*/)
        {
            g_cur_offset += 4;
            g_cur_seed = 0;
        }
        if (g_cur_offset >= this_size)
        {
            console.log("|[*] fuzz done");
            return;
        }

        var org_value = this_fd_memory.add(g_cur_offset).readS32();
        var new_value = [//org_value,           // replay (test double-free?)
                        ~org_value,
                        org_value & 0xffffff00, org_value & 0xffff00ff, org_value & 0xff00ffff, org_value & 0x00ffffff,
                        org_value | 0x000000ff, org_value | 0x0000ff00, org_value | 0x00ff0000, org_value | 0xff000000,
                        0,
                        0x7f, 0x7fff, 0x7fffffff,
                        0x80, 0x8000, 0x80000000,
                        0xff, 0xffff, 0xffffffff,
                        org_value + 1, org_value - 1
                        ];

        console.log("|-----[i] g_cur_offset: 0x" + g_cur_offset.toString(16) + ", g_cur_seed: 0x" + g_cur_seed.toString(16));
        console.log("|-----[i] fuzz memory: " + this_fd_memory.toString(16) + ", with offset: 0x" + g_cur_offset.toString(16) + ", with seed: " + new_value[g_cur_seed].toString(16));

        this_fd_memory.add(g_cur_offset).writeS32(new_value[g_cur_seed]);

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

        g_cur_seed ++;

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
        console.log("|--[i] Interface Token: ");
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
            fuzz_hidl_startModelFromMem2(mData_pos, mObjects_pos, mObjectsSize, args[1].toInt32(), args[2], args[3], args[4].toInt32(), isVendor);
    }


    console.log('[*] Frida js is running.');

    // return
    // Use the mangled name
    var BpHwBinder_transact_p = Module.getExportByName("/system/lib64/libhidlbase.so", '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    console.log("[i] BpHwBinder::transact addr: " + BpHwBinder_transact_p)

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


});

