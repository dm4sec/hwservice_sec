
// old version frida does not support the `require` feature.
// var utils  = require("../../utils/utils.js");

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


function parseParcel(args)
{
    // mDataSize
    var mDataSize_pos = args[2].add(mDataSize_LOC);
    var mDataSize = mDataSize_pos.readU64();
    console.log("|--[i] mDataSize: 0x" + mDataSize.toString(16));

    // mData
    var mData_offset = args[2].add(mData_LOC);
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

    switch(args[1].toInt32()) {
         case 1:
            fuzz_trans_1(mData_pos, mDataSize, mObjects_pos, mObjectsSize);
            break;
         case 2:
            fuzz_trans_2(mData_pos, mDataSize, mObjects_pos, mObjectsSize);
            break;
         case 3:
            fuzz_trans_3(mData_pos, mDataSize, mObjects_pos, mObjectsSize);
            break;
         case 5:
            fuzz_trans_5(mData_pos, mDataSize, mObjects_pos, mObjectsSize);
            break;
         case 13:
            fuzz_trans_13(mData_pos, mDataSize, mObjects_pos, mObjectsSize);
            break;
         default:
            console.error("|--[i] Transaction code need to parse: " + args[1].toInt32());
    }
}

function fuzz_trans_13(mData_pos, mDataSize, mObjects_pos, mObjectsSize)
{
    // vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_processCaDied(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int)
    var this_int = mData_pos.add(0x34).readU32();
    console.log("|---[i] 1st args (int): 0x" + this_int.toString(16));
}

function fuzz_trans_5(mData_pos, mDataSize, mObjects_pos, mObjectsSize)
{
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
    var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU64();
    console.log("|---[i] 2nd arg (hidl_vec<unsigned char>): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));
    cur_offset += BINDER_TYPE_BINDER_LEN;

    cur_offset += BINDER_TYPE_BINDER_LEN;
    var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU32();
    console.log("|---[i] the 3rd arg (hidl_vec<unsigned char>): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));
    cur_offset += BINDER_TYPE_BINDER_LEN;

    var this_int = mData_pos.add(cur_offset).readU32();
    console.log("|---[i] the forth arg (int): 0x" + this_int.toString(16));
    cur_offset += 4;

    cur_offset += BINDER_TYPE_BINDER_LEN;
    var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU32();
    console.log("|---[i] the fifth arg (hidl_vec<unsigned char>): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));
    cur_offset += BINDER_TYPE_BINDER_LEN;


    // oops, the size of the ashmem is not delivered.
    cur_offset += BINDER_TYPE_BINDER_LEN
    if (mData_pos.add(cur_offset).readU64() == 0)
    {
        console.log("|---[i] the fifth arg (hidl_memory): null ptr");
        cur_offset += 0x8;
    }
    else
    {
        cur_offset += 0x8
        var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readU64();
        var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU64();
        console.log("|---[i] the fifth arg (hidl_memory): ");
        console.log(hexdump(ptr(binder_buffer_object_buffer), {
            offset: 0,
            length: binder_buffer_object_length,
            header: true,
            ansi: true
        }));
        dump_ashmem(ptr(binder_buffer_object_buffer).add(0xc).readU32());
        cur_offset += BINDER_TYPE_BINDER_LEN
        cur_offset += BINDER_TYPE_FDA_LEN

        var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readU64();
        var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU64();
        console.log("|---[i] the fifth arg's name (hidl_memory): ");
        console.log(hexdump(ptr(binder_buffer_object_buffer), {
            offset: 0,
            length: binder_buffer_object_length,
            header: true,
            ansi: true
        }));

    }
}


function fuzz_trans_3(mData_pos, mDataSize, mObjects_pos, mObjectsSize)
{
    /*
    vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_openSession(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *,
    int,
    android::hardware::hidl_vec<unsigned char> const&,
    android::hardware::hidl_handle const&,
    android::hardware::hidl_string const&,
    android::hardware::hidl_vec<unsigned char> const&,
    unsigned int,
    android::hardware::hidl_vec<unsigned char> const&,
    android::hardware::hidl_vec<unsigned char> const&,
    android::hardware::hidl_memory const&,
    std::__1::function<void ()(int, android::hardware::hidl_vec<unsigned char> const&, android::hardware::hidl_vec<unsigned char> const&, android::hardware::hidl_vec<unsigned char> const&, int)>)
    */

    var cur_offset = 0x34;

    var this_int = mData_pos.add(cur_offset).readU32();
    console.log("|---[i] 1st arg (int): 0x" + this_int.toString(16));
    cur_offset += 4;

    // lot's of pointer
    cur_offset += BINDER_TYPE_BINDER_LEN;
    var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU64();
    console.log("|---[i] 2nd arg (hidl_vec<unsigned char>): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));
    cur_offset += BINDER_TYPE_BINDER_LEN;


    if (mData_pos.add(cur_offset).readU64() == 0)
    {
        console.log("|---[i] 3rd arg (hidl_handle): null pointer");
        cur_offset += 0x8;
    }
    else
    {
        cur_offset += 0x8;
        var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readU64();
        var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU64();
        console.log("|---[i] 3rd arg (hidl_handle): ");
        console.log(hexdump(ptr(binder_buffer_object_buffer), {
            offset: 0,
            length: binder_buffer_object_length,
            header: true,
            ansi: true
        }));
        cur_offset += BINDER_TYPE_BINDER_LEN;
        cur_offset += BINDER_TYPE_FDA_LEN;
    }

    cur_offset += BINDER_TYPE_BINDER_LEN
    var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU64();
    console.log("|---[i] the forth arg (hidl_string): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));
    cur_offset += BINDER_TYPE_BINDER_LEN


    cur_offset += BINDER_TYPE_BINDER_LEN
    var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU64();
    if (binder_buffer_object_buffer == 0)
    {
        console.log("|---[i] the fifth arg (hidl_vec<unsigned char>): null pointer");
    }
    else
    {
        console.log("|---[i] the fifth arg (hidl_vec<unsigned char>): ");
        console.log(hexdump(ptr(binder_buffer_object_buffer), {
            offset: 0,
            length: binder_buffer_object_length,
            header: true,
            ansi: true
        }));
    }
    cur_offset += BINDER_TYPE_BINDER_LEN

    var this_int = mData_pos.add(cur_offset).readU32();
    console.log("|---[i] the sixth arg (int): 0x" + this_int.toString(16));
    cur_offset += 4

    // a null pointer is written, such that there is no record in the mObjects.
    // I would like to use the tag of an obj for indexing instead of mObject.
    cur_offset += BINDER_TYPE_BINDER_LEN
    var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU64();
    if (binder_buffer_object_buffer == 0)
    {
        console.log("|---[i] the seventh arg (hidl_vec<unsigned char>): null pointer");
    }
    else
    {
        console.log("|---[i] the seventh arg (hidl_vec<unsigned char>): ");
        console.log(hexdump(ptr(binder_buffer_object_buffer), {
            offset: 0,
            length: binder_buffer_object_length,
            header: true,
            ansi: true
        }));
    }
    cur_offset += BINDER_TYPE_BINDER_LEN


    cur_offset += BINDER_TYPE_BINDER_LEN
    var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU64();
    if (binder_buffer_object_buffer == 0)
    {
        console.log("|---[i] the eighth arg (hidl_vec<unsigned char>): null pointer");
    }
    else
    {
        console.log("|---[i] the eighth arg (hidl_vec<unsigned char>): ");
        console.log(hexdump(ptr(binder_buffer_object_buffer), {
            offset: 0,
            length: binder_buffer_object_length,
            header: true,
            ansi: true
        }));
    }
    cur_offset += BINDER_TYPE_BINDER_LEN

    // oops, the size of the ashmem is not delivered.
    cur_offset += BINDER_TYPE_BINDER_LEN
    if (mData_pos.add(cur_offset).readU64() == 0)
    {
        console.log("|---[i] the ninth arg (hidl_memory): null ptr");
        cur_offset += 0x8;
    }
    else
    {
        cur_offset += 0x8
        var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readU64();
        var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU64();
        console.log("|---[i] the ninth arg (hidl_memory): ");
        console.log(hexdump(ptr(binder_buffer_object_buffer), {
            offset: 0,
            length: binder_buffer_object_length,
            header: true,
            ansi: true
        }));
        dump_ashmem(ptr(binder_buffer_object_buffer).add(0xc).readU32());
        cur_offset += BINDER_TYPE_BINDER_LEN
        cur_offset += BINDER_TYPE_FDA_LEN

        var binder_buffer_object_buffer = mData_pos.add(cur_offset).add(0x8).readU64();
        var binder_buffer_object_length = mData_pos.add(cur_offset).add(0x10).readU64();
        console.log("|---[i] the ninth arg's name (hidl_memory): ");
        console.log(hexdump(ptr(binder_buffer_object_buffer), {
            offset: 0,
            length: binder_buffer_object_length,
            header: true,
            ansi: true
        }));

    }
}

function fuzz_trans_2(mData_pos, mDataSize, mObjects_pos, mObjectsSize)
{
    /*
    vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_finalizeContext(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *,
    int,
    android::hardware::hidl_vec<unsigned char> const&
    )
    */
    var first_int = mData_pos.add(0x34).readU32();
    console.log("|---[i] 1st arg (int): 0x" + first_int.toString(16));

    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(0x8).readU64()).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(0x8).readU64()).add(0x10).readU64();

    // lots of pointer.
    console.log("|---[i] 2nd arg (hidl_vec<unsigned char>): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));
}


function fuzz_trans_1(mData_pos, mDataSize, mObjects_pos, mObjectsSize)
{
    /*
    vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_initializeContext(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *,
    android::hardware::hidl_string const&,
    android::hardware::hidl_vec<unsigned char> const&,
    std::__1::function<void ()(int, android::hardware::hidl_vec<unsigned char> const&)>)
    */
    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(0x8).readU64()).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(0x8).readU64()).add(0x10).readU32();

    // the 1st argument, hidl_string, it's always be zero by observation.
    console.log("|---[i] 1st arg (hidl_string): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));

    // the 2nd argument, works as hidl_string
    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(0x18).readU64()).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(0x18).readU64()).add(0x10).readU64();

    console.log("|---[i] 2nd arg (hidl_vec<unsigned char>): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));
}


// Use the mangled name
// vendor::huawei::hardware::libteec::V3_0::BnHwLibteecGlobal::onTransact(unsigned int, android::hardware::Parcel const&, android::hardware::Parcel*, unsigned int, std::__1::function<void ()(android::hardware::Parcel&)>)
// _ZN6vendor6huawei8hardware7libteec4V3_017BnHwLibteecGlobal10onTransactEjRKN7android8hardware6ParcelEPS7_jNSt3__18functionIFvRS7_EEE

// funcHelper("_ZN6vendor6huawei8hardware7libteec4V3_017BnHwLibteecGlobal10onTransactEjRKN7android8hardware6ParcelEPS7_jNSt3__18functionIFvRS7_EEE")

var BnHwLibteecGlobal_onTransact_ptr = Module.getExportByName(
    "/vendor/lib64/hw/vendor.huawei.hardware.libteec@3.0-impl.so",
    '_ZN6vendor6huawei8hardware7libteec4V3_017BnHwLibteecGlobal10onTransactEjRKN7android8hardware6ParcelEPS7_jNSt3__18functionIFvRS7_EEE');
console.log("[i] BnHwLibteecGlobal::onTransact addr: " + BnHwLibteecGlobal_onTransact_ptr)

Interceptor.attach(BnHwLibteecGlobal_onTransact_ptr, {
    onEnter: function(args) {
        console.log("[*] onEnter: BnHwLibteecGlobal")
        // transact code
        console.log("|-[i] transaction code: " + args[1].toInt32())
        parseParcel(args)

    },

    onLeave: function(retval) {
        console.log("[*] onLeave: BnHwLibteecGlobal");
        // console.log("|-[i] return value: " + retval);
    }
});

// Use the mangled name
// vendor::huawei::hardware::libteec::V3_0::BnHwLibteecGlobalNotify::onTransact(unsigned int, android::hardware::Parcel const&, android::hardware::Parcel*, unsigned int, std::__1::function<void ()(android::hardware::Parcel&)>)
// _ZN6vendor6huawei8hardware7libteec4V3_023BnHwLibteecGlobalNotify10onTransactEjRKN7android8hardware6ParcelEPS7_jNSt3__18functionIFvRS7_EEE

// funcHelper("_ZN6vendor6huawei8hardware7libteec4V3_023BnHwLibteecGlobalNotify10onTransactEjRKN7android8hardware6ParcelEPS7_jNSt3__18functionIFvRS7_EEE")

var BnHwLibteecGlobalNotify_onTransact_ptr = Module.getExportByName(
    "/vendor/lib64/hw/vendor.huawei.hardware.libteec@3.0-impl.so",
    '_ZN6vendor6huawei8hardware7libteec4V3_023BnHwLibteecGlobalNotify10onTransactEjRKN7android8hardware6ParcelEPS7_jNSt3__18functionIFvRS7_EEE');
console.log("[i] BnHwLibteecGlobalNotify::onTransact addr: " + BnHwLibteecGlobalNotify_onTransact_ptr)

Interceptor.attach(BnHwLibteecGlobalNotify_onTransact_ptr, {
    onEnter: function(args) {
        console.log("[*] onEnter: BnHwLibteecGlobalNotify")
        // transact code
        console.log("|-[i] transaction code: " + args[1].toInt32())

    },

    onLeave: function(retval) {
        console.log("[*] onLeave: BnHwLibteecGlobalNotify");
        // console.log("|-[i] return value: " + retval);
    }
});

const PROT_READ             = 0x1;
const PROT_WRITE            = 0x2;
const MAP_SHARED            = 0x1;

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
}
