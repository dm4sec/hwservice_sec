// old version frida does not support the `require` feature.
// var utils  = require("../../../utils/utils.js");

const PROT_READ             = 0x1;
const PROT_WRITE            = 0x2;
const MAP_SHARED            = 0x1;

const EPIPE		            = 32;	/* Broken pipe */
const DEAD_OBJECT           = -EPIPE;

// funcHelper("mmap")
function dump_ashmem(this_fd, this_size = 0x100)
{
    try{
        var mmap_ptr = Module.getExportByName("/system/lib64/libc++.so", 'mmap');
        console.log("|----[i] mmap addr: " + mmap_ptr);

        var mmap_func = new NativeFunction(mmap_ptr,
            'uint64',
            ['uint64', 'uint32', 'int32', 'int32', 'int32', 'int32']
            );

        var map_memory_addr = mmap_func(
            0,
            this_size,
            PROT_READ|PROT_WRITE,
            MAP_SHARED,
            this_fd,
            0);

        console.log("|----[i] mmap ret: 0x" + map_memory_addr.toString(16));
        console.log("|----[i] dumping fd: 0x" + this_fd.toString(16) + ", size: 0x" + this_size.toString(16));

        console.log(hexdump(ptr(map_memory_addr), {
            offset: 0,
            length: this_size,
            header: true,
            ansi: true
        }));
    }
    catch(err)
    {
        console.error(err);
    }
    return map_memory_addr;
}

function genSeed(org_value)
{
    return [//org_value,
                    ~org_value,
                    org_value & 0xffffff00, org_value & 0xffff00ff, org_value & 0xff00ffff, org_value & 0x00ffffff,
                    org_value | 0x000000ff, org_value | 0x0000ff00, org_value | 0x00ff0000, org_value | 0xff000000,
                    org_value & 0xffffff00 + 0x7f, org_value & 0xffff00ff + 0x7f00, org_value & 0xff00ffff + 0x7f0000, org_value & 0x00ffffff + 0x7f000000,
                    org_value & 0xffffff00 + 0x80, org_value & 0xffff00ff + 0x8000, org_value & 0xff00ffff + 0x800000, org_value & 0x00ffffff + 0x80000000,
                    0,
                    0x7f, 0x7fff, 0x7fffff, 0x7fffffff,
                    0x80, 0x8000, 0x800000, 0x80000000,
                    0xff, 0xffff, 0xffffff,
                    0xffffffff,
                    org_value + 1, org_value + 0x100, org_value + 0x10000, org_value + 0x1000000,
                    org_value - 1, org_value - 0x100, org_value - 0x10000, org_value - 0x1000000,
                    0x41414141,
                    ];
}

const BINDER_TYPE_BINDER_LEN    = 0x28;
const BINDER_TYPE_FDA_LEN       = 0x20;

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


const g_proc_name = "AAoAA";

console.log('[*] Frida is attaching to: ' + g_proc_name)


const mData_LOC         = 0x28;
const mDataSize_LOC     = 0x30;
const mObjects_LOC      = 0x48;
const mObjectsSize_LOC  = 0x50;



function BpHwBinder_transact_fuzzer(this_context /* this */, code, data, reply, flags, TransactCallback)
{
    console.log("|--[i] transaction code: " + code);

    // mDataSize
    var mDataSize_pos = data.add(mDataSize_LOC);
    var mDataSize = mDataSize_pos.readU64();
    console.log("|--[i] mDataSize: 0x" + mDataSize.toString(16));

    // mData
    var mData_offset = data.add(mData_LOC);
    var mData_pos = mData_offset.readPointer();

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
    var mObjectsSize_pos = data.add(mObjectsSize_LOC);
    var mObjectsSize = mObjectsSize_pos.readU64();
    console.log("|--[i] mObjectsSize: 0x" + mObjectsSize.toString(16));

    // mObjects
    var mObjects_offset = data.add(mObjects_LOC);
    var mObjects_pos = mObjects_offset.readPointer();
    // var mObjects = mObjects_pos.readByteArray(mObjectsSize * 0x8);
    console.log("|--[i] mObjects: ");
    console.log(hexdump(mObjects_pos, {
        offset: 0,
        length: mObjectsSize * 0x8,
        header: true,
        ansi: true
    }));

    if (data.add(mData_LOC).readPointer().readUtf8String().indexOf("vendor.huawei.hardware.libteec@3.0::ILibteecGlobal") == -1)
    {
        return g_BpHwBinder_transact_func(this_context, code, data, reply, flags, TransactCallback);
    }

    switch(code) {
         case 1:
            fuzz_trans_1(mData_pos, mDataSize, mObjects_pos, mObjectsSize, this_context /* this */, code, data, reply, flags, TransactCallback);
            break;
         case 2:
            fuzz_trans_2(mData_pos, mDataSize, mObjects_pos, mObjectsSize, this_context /* this */, code, data, reply, flags, TransactCallback);
            break;
         case 3:
            fuzz_trans_3(mData_pos, mDataSize, mObjects_pos, mObjectsSize, this_context /* this */, code, data, reply, flags, TransactCallback);
            break;
         case 5:
            fuzz_trans_5(mData_pos, mDataSize, mObjects_pos, mObjectsSize, this_context /* this */, code, data, reply, flags, TransactCallback);
            break;
         case 13:
            fuzz_trans_13(mData_pos, mDataSize, mObjects_pos, mObjectsSize, this_context /* this */, code, data, reply, flags, TransactCallback);
            break;
         default:
            console.error("|--[i] Transaction code need to parse: " + code);
    }

    return g_BpHwBinder_transact_func(this_context, code, data, reply, flags, TransactCallback);
}

function fuzz_trans_2(mData_pos, mDataSize, mObjects_pos, mObjectsSize,
    this_context /* this */, code, data, reply, flags, TransactCallback)
{
}

function fuzz_trans_3(mData_pos, mDataSize, mObjects_pos, mObjectsSize,
    this_context /* this */, code, data, reply, flags, TransactCallback)
{
}

function fuzz_trans_13(mData_pos, mDataSize, mObjects_pos, mObjectsSize,
    this_context /* this */, code, data, reply, flags, TransactCallback)
{
}

function fuzz_trans_5(mData_pos, mDataSize, mObjects_pos, mObjectsSize,
    this_context /* this */, code, data, reply, flags, TransactCallback)
{
    console.log("|---[i] entering: _hidl_invokeCommandHidl");
    /*
    vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_invokeCommandHidl(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *,
    int,
    android::hardware::hidl_vec<unsigned char> const&,
    android::hardware::hidl_vec<unsigned char> const&,
    unsigned int,
    android::hardware::hidl_vec<unsigned char> const&,
    android::hardware::hidl_memory const&,
    std::__1::function<void ()(int, android::hardware::hidl_vec<unsigned char> const&, android::hardware::hidl_vec<unsigned char> const&, int)>)
    */
    var cur_offset = 0x34;

    var this_int = mData_pos.add(cur_offset).readU32();
    console.log("|---[i] 1st arg (int): 0x" + this_int.toString(16));
    cur_offset += 4;

    cur_offset += BINDER_TYPE_BINDER_LEN;
    var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readPointer();
    var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU64();
    console.log("|---[i] 2nd arg (hidl_vec<unsigned char>): ");
    console.log(hexdump(binder_buffer_object_buffer, {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));
    cur_offset += BINDER_TYPE_BINDER_LEN;

    console.log("|---[i] fuzzing the 2nd arg");
    for (var i = 0; i < binder_buffer_object_length; i += 4)
    {
        try{
            var org_value = binder_buffer_object_buffer.add(i).readU32()
            var new_value = genSeed(org_value);

            for (var j = 0; j < new_value.length; j ++)
            {
                binder_buffer_object_buffer.add(i).writeInt(new_value[j]);
//                console.log(hexdump(binder_buffer_object_buffer, {
//                    offset: 0,
//                    length: binder_buffer_object_length,
//                    header: true,
//                    ansi: true
//                }));

                var ret = g_BpHwBinder_transact_func(this_context /* this */, code, data, reply, flags, TransactCallback);
                if (ret == DEAD_OBJECT)
                {
                    console.error("dead_object: fuzzing _hidl_invokeCommandHidl, code 5, 2nd arg, offset " + i + ", seed " + new_value[j] + ".")
                    send("dead_object: fuzzing _hidl_invokeCommandHidl, code 5, 2nd arg, offset " + i + ", seed " + new_value[j]);
                }
            }
            binder_buffer_object_buffer.add(i).writeU32(org_value);
        }
        catch(err){
            console.error(err);
        }
    }

    cur_offset += BINDER_TYPE_BINDER_LEN;
    var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readPointer();
    var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU32();
    console.log("|---[i] the 3rd arg (hidl_vec<unsigned char>): ");
    console.log(hexdump(binder_buffer_object_buffer, {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));
    cur_offset += BINDER_TYPE_BINDER_LEN;

    console.log("|---[i] fuzzing the 3rd arg");
    for (var i = 0; i < binder_buffer_object_length; i += 4)
    {
        try{
            var org_value = binder_buffer_object_buffer.add(i).readU32()
            var new_value = genSeed(org_value);

            for (var j = 0; j < new_value.length; j ++)
            {
                binder_buffer_object_buffer.add(i).writeInt(new_value[j]);
                var ret = g_BpHwBinder_transact_func(this_context /* this */, code, data, reply, flags, TransactCallback);
                if (ret == DEAD_OBJECT)
                {
                    console.error("dead_object: fuzzing _hidl_invokeCommandHidl, code 5, 3rd arg, offset " + i + ", seed " + new_value[j] + ".")
                    send("dead_object: fuzzing _hidl_invokeCommandHidl, code 5, 3rd arg, offset " + i + ", seed " + new_value[j]);
                }
            }
            binder_buffer_object_buffer.add(i).writeInt(org_value);
        }
        catch(err){
            console.error(err);
        }
    }

    var this_int = mData_pos.add(cur_offset).readU32();
    console.log("|---[i] the forth arg (int): 0x" + this_int.toString(16));
    cur_offset += 4;

    cur_offset += BINDER_TYPE_BINDER_LEN;
    var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readPointer();
    var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU32();
    console.log("|---[i] the fifth arg (hidl_vec<unsigned char>): ");
    console.log(hexdump(binder_buffer_object_buffer, {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));
    cur_offset += BINDER_TYPE_BINDER_LEN;

    console.log("|---[i] fuzzing the fifth arg");
    for (var i = 0; i < binder_buffer_object_length; i += 4)
    {
        try{
            var org_value = binder_buffer_object_buffer.add(i).readU32()
            var new_value = genSeed(org_value);

            for (var j = 0; j < new_value.length; j ++)
            {
                binder_buffer_object_buffer.add(i).writeInt(new_value[j]);
                var ret = g_BpHwBinder_transact_func(this_context /* this */, code, data, reply, flags, TransactCallback);
                if (ret == DEAD_OBJECT)
                {
                    console.error("dead_object: fuzzing _hidl_invokeCommandHidl, code 5, the fifth arg, offset " + i + ", seed " + new_value[j] + ".");
                    send("dead_object: fuzzing _hidl_invokeCommandHidl, code 5, the fifth arg, offset " + i + ", seed " + new_value[j]);
                }
            }
            binder_buffer_object_buffer.add(i).writeInt(org_value);
        }
        catch(err){
            console.error(err);
        }
    }

    cur_offset += BINDER_TYPE_BINDER_LEN
    if (mData_pos.add(cur_offset).readU64() == 0)
    {
        console.log("|---[i] the sixth arg (hidl_memory): null ptr");
        cur_offset += 0x8;
    }
    else
    {
        console.log("|---[i] hidl_memory info");

        var binder_buffer_object_buffer = mData_pos.add(cur_offset - BINDER_TYPE_BINDER_LEN).add(0x8).readPointer();
        console.log(hexdump(binder_buffer_object_buffer, {
            offset: 0,
            length: 0x28,
            header: true,
            ansi: true
        }));

        var ashmem_len = binder_buffer_object_buffer.add(0x10).readU32();

        cur_offset += 0x8
        var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readPointer();
        var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU64();
        console.log("|---[i] the sixth arg (hidl_memory): ");
        console.log(hexdump(binder_buffer_object_buffer, {
            offset: 0,
            length: binder_buffer_object_length,
            header: true,
            ansi: true
        }));
        var ashmem = dump_ashmem(binder_buffer_object_buffer.add(0xc).readU32(), ashmem_len);

        console.log("|---[i] fuzzing the sixth arg");
        for (var i = 0; i < ashmem_len; i += 4)
        {
            try{
                var org_value = ptr(ashmem).add(i).readU32()
                var new_value = genSeed(org_value);

                for (var j = 0; j < new_value.length; j ++)
                {
                    ptr(ashmem).add(i).writeInt(new_value[j]);
                    var ret = g_BpHwBinder_transact_func(this_context /* this */, code, data, reply, flags, TransactCallback);
                    if (ret == DEAD_OBJECT)
                    {
                        console.error("dead_object: fuzzing _hidl_invokeCommandHidl, code 5, the sixth arg, offset " + i + ", seed " + new_value[j] + ".");
                        send("dead_object: fuzzing _hidl_invokeCommandHidl, code 5, the sixth arg, offset " + i + ", seed " + new_value[j]);
                    }
                }
                ptr(ashmem).add(i).writeInt(org_value);
            }
            catch(err){
                console.error(err);
            }
        }

        cur_offset += BINDER_TYPE_BINDER_LEN
        cur_offset += BINDER_TYPE_FDA_LEN

        var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readPointer();
        var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU64();
        console.log("|---[i] the sixth arg's name (hidl_memory): ");
        console.log(hexdump(binder_buffer_object_buffer, {
            offset: 0,
            length: binder_buffer_object_length,
            header: true,
            ansi: true
        }));

    }

    console.log("|---[i] leave: _hidl_invokeCommandHidl");
}


function fuzz_trans_1(mData_pos, mDataSize, mObjects_pos, mObjectsSize,
    this_context /* this */, code, data, reply, flags, TransactCallback)
{
    return;

    console.log("|---[i] entering: _hidl_initializeContext");
    var CallingPid = mData_pos.add(mObjects_pos.add(0x18).readU64()).add(0x8).readPointer().add(0x1008).readU32();
    console.log("|---[i] CallingPid: " + CallingPid);
    /*
    vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_initializeContext(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *,
    android::hardware::hidl_string const&,
    android::hardware::hidl_vec<unsigned char> const&,
    std::__1::function<void ()(int, android::hardware::hidl_vec<unsigned char> const&)>)
    */

    // the 1st argument, hidl_string, it's always be zero by observation.
    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(0x8).readU64()).add(0x8).readPointer();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(0x8).readU64()).add(0x10).readU32();

    // the 1st argument, hidl_string, it's always be zero by observation.
    console.log("|---[i] 1st arg (hidl_string): ");
    console.log(hexdump(binder_buffer_object_buffer, {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));

    console.log("|---[i] fuzzing the 1st arg");

    const FUZZ_STR_LEN = 0x256 + 1;
    var mBuffer = Memory.alloc(FUZZ_STR_LEN);
    // for(var i = FUZZ_STR_LEN; i > 0; i --)
    for(var i = 0; i < FUZZ_STR_LEN; i ++)
    {
        try{
            mBuffer.writeByteArray(Array(FUZZ_STR_LEN).fill(0));
            mBuffer.writeByteArray(Array(i).fill(0x41));

            /*
            console.log(hexdump(mData_pos.add(mObjects_pos.readU64()).add(0x8).readPointer(), {
                offset: 0,
                length: 0x10,
                header: true,
                ansi: true
            }));
            */

            mData_pos.add(mObjects_pos.readU64()).add(0x8).readPointer().writePointer(mBuffer);
            mData_pos.add(mObjects_pos.readU64()).add(0x8).readPointer().add(0x8).writeUInt(i);

            /*
            console.log(hexdump(mData_pos.add(mObjects_pos.readU64()).add(0x8).readPointer(), {
                offset: 0,
                length: 0x10,
                header: true,
                ansi: true
            }));
            */

            mData_pos.add(mObjects_pos.add(0x8).readU64()).add(0x8).writePointer(mBuffer);
            mData_pos.add(mObjects_pos.add(0x8).readU64()).add(0x10).writeUInt(i + 1);

            /*
            console.log(hexdump(mData_pos.add(mObjects_pos.add(0x8).readU64()), {
                offset: 0,
                length: 0x28,
                header: true,
                ansi: true
            }));
            */

            var ret = g_BpHwBinder_transact_func(this_context /* this */, code, data, reply, flags, TransactCallback);
            if (ret == DEAD_OBJECT)
            {
                console.error("dead_object: fuzzing _hidl_initializeContext, code 1, 1st arg, len " + i + ".");
                send("dead_object: fuzzing _hidl_initializeContext, code 1, 1st arg, len " + i);
            }

        }
        catch(err){
            console.error(err);
        }
    }

    // the 2nd argument, works as hidl_string
    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(0x18).readU64()).add(0x8).readPointer();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(0x18).readU64()).add(0x10).readU64();

    console.log("|---[i] 2nd arg (hidl_vec<unsigned char>): ");
    console.log(hexdump(binder_buffer_object_buffer, {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));

    console.log("|---[i] fuzzing the 2nd arg");
    for (var i = 0; i < binder_buffer_object_length; i += 4)
    {
        try{
            var org_value = binder_buffer_object_buffer.add(i).readU32()
            var new_value = genSeed(org_value);

            for (var j = 0; j < new_value.length; j ++)
            {
                binder_buffer_object_buffer.add(i).writeInt(new_value[j]);
                var ret = g_BpHwBinder_transact_func(this_context /* this */, code, data, reply, flags, TransactCallback);
                if (ret == DEAD_OBJECT)
                {
                    console.error("dead_object: fuzzing _hidl_initializeContext, code 1, 2nd arg, offset " + i + ", seed " + new_value[j] + ".");
                    send("dead_object: fuzzing _hidl_initializeContext, code 1, 2nd arg, offset " + i + ", seed " + new_value[j]);
                }
            }
            binder_buffer_object_buffer.add(i).writeU32(org_value);
        }
        catch(err){
            console.error(err);
        }
    }

    console.log("|---[i] leave: _hidl_initializeContext");
}


var g_BpHwBinder_transact_func;

// /system/lib64/vndk-sp-29/libhidlbase.so
// /system/lib64/libhidlbase.so

function trans_fuzzer()
{
    const BpHwBinder_transact_ptr = Module.getExportByName(
        "/system/lib64/libhidlbase.so",
        '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    console.log("[i] BpHwBinder::transact ptr addr: " + BpHwBinder_transact_ptr)
    g_BpHwBinder_transact_func = new NativeFunction(BpHwBinder_transact_ptr, 'int', ['pointer', 'int', 'pointer', 'pointer', 'int', 'pointer']);
    console.log("[i] BpHwBinder::transact func addr: " + g_BpHwBinder_transact_func)

    Interceptor.replace(BpHwBinder_transact_ptr, new NativeCallback(BpHwBinder_transact_fuzzer, 'int', ['pointer', 'int', 'pointer', 'pointer', 'int', 'pointer']));

    // TODO: Another interface
}

trans_fuzzer()
