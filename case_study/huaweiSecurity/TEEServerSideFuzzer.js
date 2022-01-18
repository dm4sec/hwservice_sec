
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
