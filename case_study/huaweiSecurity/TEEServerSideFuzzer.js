
// old version frida does not support the `require` feature.
// var utils  = require("../../utils/utils.js");

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
    var this_int = mData_pos.add(0x34).readU32();
    console.log("|---[i] 1st args (int): 0x" + this_int.toString(16));

    var this_obj_pos = 0;
    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x10).readU32();
    console.log("|---[i] 2nd args (hidl_vec<unsigned char>): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));

    this_obj_pos += 0x10;
    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x10).readU32();
    console.log("|---[i] the 3rd args (hidl_vec<unsigned char>): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));

    var this_int = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x28).readU32();
    console.log("|---[i] the forth args (int): 0x" + this_int.toString(16));

    this_obj_pos += 0x10;
    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x10).readU32();
    console.log("|---[i] the fifth args (hidl_vec<unsigned char>): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));

    if (mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x28).readU64() == 0)
    {
        console.log("|---[i] the fifth args (hidl_memory): empty");
    }
    else
    {
        this_obj_pos += 0x10;
        var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x8).readU64();
        var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x10).readU32();
        console.log("|---[i] the fifth args (hidl_memory): ");
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

    var this_int = mData_pos.add(0x34).readU32();
    console.log("|---[i] 1st args (int): 0x" + this_int.toString(16));

    var this_obj_pos = 0;
    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x10).readU32();
    console.log("|---[i] 2nd args (hidl_vec<unsigned char>): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));


    if (mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x28).readU64() == 0)
    {
        console.log("|---[i] 3rd args (hidl_handle): empty");
    }
    else
    {
        this_obj_pos += 0x10;
        var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(this_obj_pos).readU64()).add(0x8).readU64();
        var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(this_obj_pos).readU64()).add(0x10).readU32();
        console.log("|---[i] 3rd args (hidl_handle): ");
        console.log(hexdump(ptr(binder_buffer_object_buffer), {
            offset: 0,
            length: binder_buffer_object_length,
            header: true,
            ansi: true
        }));
    }

    this_obj_pos += 0x10;
    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x10).readU32();
    console.log("|---[i] the forth args (hidl_string): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));

    this_obj_pos += 0x10;
    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x10).readU32();
    console.log("|---[i] the fifth args (hidl_vec<unsigned char>): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));

    var this_int = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x28).readU32();
    console.log("|---[i] the sixth args (int): 0x" + this_int.toString(16));

    this_obj_pos += 0x10;
    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x10).readU32();
    console.log("|---[i] the seventh args (hidl_vec<unsigned char>): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));

    this_obj_pos += 0x10;
    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x10).readU32();
    console.log("|---[i] the eighth args (hidl_vec<unsigned char>): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));

    if (mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x28).readU64() == 0)
    {
        console.log("|---[i] the ninth args (hidl_memory): empty");
    }
    else
    {
        this_obj_pos += 0x10;
        var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x8).readU64();
        var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(this_obj_pos + 0x8).readU64()).add(0x10).readU32();
        console.log("|---[i] the ninth args (hidl_memory): ");
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
    // vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_finalizeContext(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_vec<unsigned char> const&)

    var first_int = mData_pos.add(0x34).readU32();
    console.log("|---[i] 1st args (int): 0x" + first_int.toString(16));

    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(0x8).readU64()).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(0x8).readU64()).add(0x10).readU32();

    // the 1st argument, hidl_string, it's always be zero by observation.
    console.log("|---[i] 2nd args (hidl_vec<unsigned char>): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));
}


function fuzz_trans_1(mData_pos, mDataSize, mObjects_pos, mObjectsSize)
{
    // vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_initializeContext(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::hardware::hidl_string const&, android::hardware::hidl_vec<unsigned char> const&, std::__1::function<void ()(int, android::hardware::hidl_vec<unsigned char> const&)>)
    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(0x8).readU64()).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(0x8).readU64()).add(0x10).readU32();

    // the 1st argument, hidl_string, it's always be zero by observation.
    console.log("|---[i] 1st args (hidl_string): ");
    console.log(hexdump(ptr(binder_buffer_object_buffer), {
        offset: 0,
        length: binder_buffer_object_length,
        header: true,
        ansi: true
    }));

    // the 2nd argument, works as hidl_string
    var binder_buffer_object_buffer = mData_pos.add(mObjects_pos.add(0x18).readU64()).add(0x8).readU64();
    var binder_buffer_object_length = mData_pos.add(mObjects_pos.add(0x18).readU64()).add(0x10).readU32();

    // always be zero
    console.log("|---[i] 2nd args (hidl_vec<unsigned char>): ");
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
        console.log("|-[i] 2nd argument, transaction code: " + args[1].toInt32())
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
        console.log("|-[i] 2nd argument, transaction code: " + args[1].toInt32())

    },

    onLeave: function(retval) {
        console.log("[*] onLeave: BnHwLibteecGlobalNotify");
        // console.log("|-[i] return value: " + retval);
    }
});
