
/*
Ghidr issues:
vendor::huawei::hardware::libteec::V3_0::implementation::LibteecGlobal::initializeContext
          (LibteecGlobal *this,hidl_string *param_1,hidl_vec *param_2,function param_3)

IDA 7.0 issues:
void __usercall vendor::huawei::hardware::libteec::V3_0::implementation::LibteecGlobal::initializeContext(_QWORD *a1@<X0>, __int64 a2@<X1>, __int64 a3@<X2>, __int64 a4@<X3>, __int64 a5@<X8>)

_ZN6vendor6huawei8hardware7libteec4V3_014implementation13LibteecGlobal17initializeContextERKN7android8hardware11hidl_stringERKNS7_8hidl_vecIhEENSt3__18functionIFviSE_EEE
*/
function LibteecGlobal_initializeContext_fuzzer(
    this_context,
    param_1, /* hidl_string */
    param_2, /* hidl_vec<unsigned char> */
    param_3  /* call back */
    )
{
    var CallingPid = param_2.readPointer().add(0x1008).readU32();
    console.log("CallingPid: " + CallingPid);
    // dataz in parcel are parsed, such I modify these `type`s directly, but not the object in `parcel`
    console.log(hexdump(param_1, {
        offset: 0,
        length: 0x10,
        header: true,
        ansi: true
    }));

    // If I modify param_1 directly, I will get Error: access violation accessing 0x708f9020f8
    // so I build a new hidl_string obj
    var hidl_string_obj = Memory.alloc(0x10);
    hidl_string_obj.writeByteArray(Array(0x10).fill(0));

    const FUZZ_STR_LEN = 0x256 + 1;
    var mBuffer = Memory.alloc(FUZZ_STR_LEN);
    for (var i = 0; i < FUZZ_STR_LEN; i ++)
    {
        mBuffer.writeByteArray(Array(FUZZ_STR_LEN).fill(0));
        mBuffer.writeByteArray(Array(i).fill(0x41));

        ptr(hidl_string_obj).writePointer(mBuffer);
        hidl_string_obj.add(0x8).writeUInt(i);

        console.log(hexdump(ptr(hidl_string_obj), {
            offset: 0,
            length: 0x10,
            header: true,
            ansi: true
        }));

        console.log(hexdump(ptr(mBuffer), {
            offset: 0,
            length: FUZZ_STR_LEN,
            header: true,
            ansi: true
        }));

        try{
            /*
            logcat issues:
            01-21 04:17:36.357 27339 27339 D LibteecGlobal@3.0: invokeCommandHidl: getCallingPid=9049
            01-21 04:17:36.358 27339 27339 E LibteecGlobal@3.0: CallGetBnProxy: invalid context!
            01-21 04:22:36.358 27339 27339 D LibteecGlobal@3.0: invokeCommandHidl: getCallingPid=9049
            01-21 04:22:36.358 27339 27339 E LibteecGlobal@3.0: CallGetBnProxy: invalid context!
            01-21 04:27:36.358 27339 27339 D LibteecGlobal@3.0: invokeCommandHidl: getCallingPid=9049
            01-21 04:27:36.358 27339 27339 E LibteecGlobal@3.0: CallGetBnProxy: invalid context!
            01-21 04:32:36.358 27339 27339 D LibteecGlobal@3.0: invokeCommandHidl: getCallingPid=9049
            01-21 04:32:36.359 27339 27339 E LibteecGlobal@3.0: CallGetBnProxy: invalid context!
            01-21 04:37:36.359 27339 27339 D LibteecGlobal@3.0: invokeCommandHidl: getCallingPid=9049
            01-21 04:37:36.359 27339 27339 E LibteecGlobal@3.0: CallGetBnProxy: invalid context!
            01-21 04:42:36.359 27339 27339 D LibteecGlobal@3.0: invokeCommandHidl: getCallingPid=9049
            01-21 04:42:36.360 27339 27339 E LibteecGlobal@3.0: CallGetBnProxy: invalid context!
            01-21 04:47:36.360 27339 27339 D LibteecGlobal@3.0: invokeCommandHidl: getCallingPid=9049
            01-21 04:47:36.360 27339 27339 E LibteecGlobal@3.0: CallGetBnProxy: invalid context!
            01-21 04:52:36.361 27339 27339 D LibteecGlobal@3.0: invokeCommandHidl: getCallingPid=9049
            01-21 04:52:36.361 27339 27339 E LibteecGlobal@3.0: CallGetBnProxy: invalid context!
            01-21 04:55:06.917 27339 27339 D LibteecGlobal@3.0: invokeCommandHidl: getCallingPid=9049
            01-21 04:55:06.917 27339 27339 E LibteecGlobal@3.0: CallGetBnProxy: invalid context!
            01-21 04:55:06.920 27339 27339 D LibteecGlobal@3.0: invokeCommandHidl: getCallingPid=9049
            01-21 04:55:06.920 27339 27339 E LibteecGlobal@3.0: CallGetBnProxy: invalid context!
            */
            g_LibteecGlobal_initializeContext_func(this_context, hidl_string_obj, param_2, param_3);
            g_LibteecGlobal_processCaDied_func(CallingPid);
            g_LibteecGlobal_finalizeContext_func(this_context, CallingPid, param_2);
        }
        catch(err)
        {
            console.error(err);
        }
    }

    console.log(hexdump(param_2, {
        offset: 0,
        length: 0x10,
        header: true,
        ansi: true
    }));
}

var g_LibteecGlobal_initializeContext_func;
var g_LibteecGlobal_finalizeContext_func;
var g_LibteecGlobal_processCaDied_func;

function fuzz_LibteecGlobal_initializeContext()
{
    const LibteecGlobal_initializeContext_ptr = Module.getExportByName(
        "/vendor/lib64/hw/vendor.huawei.hardware.libteec@3.0-impl.so",
        '_ZN6vendor6huawei8hardware7libteec4V3_014implementation13LibteecGlobal17initializeContextERKN7android8hardware11hidl_stringERKNS7_8hidl_vecIhEENSt3__18functionIFviSE_EEE');
    console.log("[i] LibteecGlobal::initializeContext ptr addr: " + LibteecGlobal_initializeContext_ptr)

    g_LibteecGlobal_initializeContext_func = new NativeFunction(LibteecGlobal_initializeContext_ptr, 'void', ['pointer', 'pointer', 'pointer', 'pointer']);
    console.log("[i] LibteecGlobal::initializeContext func addr: " + g_LibteecGlobal_initializeContext_func)

    const LibteecGlobal_finalizeContext_ptr = Module.getExportByName(
        "/vendor/lib64/hw/vendor.huawei.hardware.libteec@3.0-impl.so",
        '_ZN6vendor6huawei8hardware7libteec4V3_014implementation13LibteecGlobal15finalizeContextEiRKN7android8hardware8hidl_vecIhEE');
    console.log("[i] LibteecGlobal::finalizeContext ptr addr: " + LibteecGlobal_finalizeContext_ptr)

    g_LibteecGlobal_finalizeContext_func = new NativeFunction(LibteecGlobal_finalizeContext_ptr, 'void', ['pointer', 'int', 'pointer']);
    console.log("[i] LibteecGlobal::finalizeContext func addr: " + g_LibteecGlobal_finalizeContext_func)

    const LibteecGlobal_processCaDied_ptr = Module.getExportByName(
        "/vendor/lib64/hw/vendor.huawei.hardware.libteec@3.0-impl.so",
        '_ZN6vendor6huawei8hardware7libteec4V3_014implementation13LibteecGlobal13processCaDiedEi');
    console.log("[i] LibteecGlobal::processCaDied ptr addr: " + LibteecGlobal_processCaDied_ptr)

    g_LibteecGlobal_processCaDied_func = new NativeFunction(LibteecGlobal_processCaDied_ptr, 'void', ['int']);
    console.log("[i] LibteecGlobal::processCaDied func addr: " + g_LibteecGlobal_processCaDied_func)


    Interceptor.replace(LibteecGlobal_initializeContext_ptr, new NativeCallback(LibteecGlobal_initializeContext_fuzzer, 'void', ['pointer', 'pointer', 'pointer', 'pointer']));
}


/*
void __thiscall
vendor::huawei::hardware::libteec::V3_0::implementation::LibteecGlobal::openSession
          (LibteecGlobal *this,int param_1,hidl_vec *param_2,hidl_handle *param_3,
          hidl_string *param_4,hidl_vec *param_5,uint param_6,hidl_vec *param_7,hidl_vec *param_8,
          hidl_memory *param_9,function param_10)


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

function LibteecGlobal_openSession_fuzzer(
    this_context,
    param_1, /* int */
    param_2, /* hidl_vec<unsigned char> */
    param_3, /* hidl_handle */
    param_4, /* hidl_string */
    param_5, /* hidl_vec<unsigned char> */
    param_6, /* int */
    param_7, /* hidl_vec<unsigned char> */
    param_8, /* hidl_vec<unsigned char> */
    param_9, /* hidl_memory */
    param_10 /* call back */
    )
{
    console.log("[*] entering LibteecGlobal::openSession")
    console.log("[i] |- the 1st arg is the CallingPid, skip fuzzing")

    var new_value = genSeed(param_1);
    console.log("[i] fuzz the 1st arg: " + param_1)
    for (var i = 0; i < new_value.length; i ++)
    {
        console.log("[i] |- new arg: " + new_value[i])
        try{
            g_LibteecGlobal_openSession_func(this_context, param_1, param_2, param_3, param_4, param_5, param_6, param_7, param_8, param_9, param_10);
        }
        catch(err){
            console.error(err);
        }
    }


}


var g_LibteecGlobal_openSession_func;

function fuzz_LibteecGlobal_openSession()
{
    const LibteecGlobal_openSession_ptr = Module.getExportByName(
        "/vendor/lib64/hw/vendor.huawei.hardware.libteec@3.0-impl.so",
        '_ZN6vendor6huawei8hardware7libteec4V3_014implementation13LibteecGlobal11openSessionEiRKN7android8hardware8hidl_vecIhEERKNS7_11hidl_handleERKNS7_11hidl_stringESB_jSB_SB_RKNS7_11hidl_memoryENSt3__18functionIFviSB_SB_SB_iEEE');
    console.log("[i] LibteecGlobal::openSession ptr addr: " + LibteecGlobal_openSession_ptr)

    g_LibteecGlobal_openSession_func = new NativeFunction(LibteecGlobal_openSession_ptr, 'void', ['pointer', 'int', 'pointer', 'pointer', 'pointer', 'pointer', 'int', 'pointer', 'pointer', 'pointer', 'pointer']);
    console.log("[i] LibteecGlobal::openSession func addr: " + g_LibteecGlobal_openSession_func)

    Interceptor.replace(LibteecGlobal_openSession_ptr, new NativeCallback(LibteecGlobal_openSession_fuzzer, 'void', ['pointer', 'int', 'pointer', 'pointer', 'pointer', 'pointer', 'int', 'pointer', 'pointer', 'pointer', 'pointer']));

}


// fuzz_LibteecGlobal_initializeContext()
// fuzz_LibteecGlobal_openSession()
