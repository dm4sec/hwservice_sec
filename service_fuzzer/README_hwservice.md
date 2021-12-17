## `hwservice_fuzzer` is used to fuzz hwservice (hardware service).

### 1 Design
Considering that the owner of the `Parcel` is the client, I modified the `Parcel` (context-aware) and replay it on-the-fly. 

### 1.1 Intercept

The call trace of `transact` is:

`out/soong/.intermediates/hardware/interfaces/demo/1.0/android.hardware.demo@1.0_genc++/gen/android/hardware/demo/1.0/DemoAll.cpp`
```cpp
    _hidl_err = ::android::hardware::IInterface::asBinder(_hidl_this)->transact(3 /* baz */, _hidl_data, &_hidl_reply);
```

`system/libhwbinder/BpHwBinder.cpp`<span id='intercept_pos'></span>
```cpp
status_t BpHwBinder::transact( <- intercept here.
    uint32_t code, const Parcel& data, Parcel* reply, uint32_t flags, TransactCallback /*callback*/)
{
    // Once a binder has died, it will never come back to life.
    if (mAlive) {
        status_t status = IPCThreadState::self()->transact(
            mHandle, code, data, reply, flags);
        if (status == DEAD_OBJECT) mAlive = 0;
        return status;
    }

    return DEAD_OBJECT;
}
```
To get this interface, I firstly pull the binary, then find the target.
```commandline
demo@demo:~/Downloads$ adb pull /system/lib64/libhidlbase.so
/system/lib64/libhidlbase.so: 1 file pulled, 0 skipped. 10.8 MB/s (688096 bytes in 0.061s)
demo@demo:~/Downloads$ objdump -tT libhidlbase.so | grep "transact"
0000000000087378 g    DF .text	00000000000010f4  Base        _ZN7android8hardware14IPCThreadState8transactEijRKNS0_6ParcelEPS2_j
0000000000082fd8 g    DF .text	0000000000000078  Base        _ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE
00000000000825fc g    DF .text	00000000000000b0  Base        _ZN7android8hardware9BHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE
demo@demo:~/Downloads$ objdump -tT libhidlbase.so | grep "self"
0000000000000000      DF *UND*	0000000000000000  Base        _ZN7android18IPCThreadStateBase4selfEv
0000000000085638 g    DF .text	0000000000000034  Base        _ZN7android8hardware14IPCThreadState10selfOrNullEv
00000000000854e0 g    DF .text	0000000000000104  Base        _ZN7android8hardware14IPCThreadState4selfEv
00000000000946dc g    DF .text	0000000000000068  Base        _ZN7android8hardware12ProcessState10selfOrNullEv
0000000000094430 g    DF .text	00000000000000c4  Base        _ZN7android8hardware12ProcessState4selfEv

demo@demo:~/Downloads$ adb pull /system/lib64/vndk-sp-29/libhidlbase.so 
/system/lib64/vndk-sp-29/libhidlbase.so: 1 file pulled, 0 skipped. 31.6 MB/s (771744 bytes in 0.023s)
demo@demo:~/Downloads$ objdump -tT libhidlbase.so | grep "transact"
0000000000095cf0 g    DF .text	00000000000000b0  Base        _ZN7android8hardware9BHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE
00000000000966cc g    DF .text	0000000000000078  Base        _ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE
000000000009aa6c g    DF .text	00000000000010f4  Base        _ZN7android8hardware14IPCThreadState8transactEijRKNS0_6ParcelEPS2_j
demo@demo:~/Downloads$ objdump -tT libhidlbase.so | grep "self"
0000000000000000      DF *UND*	0000000000000000  Base        _ZN7android18IPCThreadStateBase4selfEv
00000000000a7b24 g    DF .text	00000000000000c4  Base        _ZN7android8hardware12ProcessState4selfEv
0000000000098bd4 g    DF .text	0000000000000104  Base        _ZN7android8hardware14IPCThreadState4selfEv
00000000000a7dd0 g    DF .text	0000000000000068  Base        _ZN7android8hardware12ProcessState10selfOrNullEv
0000000000098d2c g    DF .text	0000000000000034  Base        _ZN7android8hardware14IPCThreadState10selfOrNullEv
```
**NOTE**: `libhidlbase.so` is the binary for my `pixel3` and `honor` boxes. By using [test_case1](https://github.com/dm4sec/hwservice_sec/blob/master/test_case/test_case1.js), I find `transact`s are thunked to different binaries. So I intercept them all.

### 1.2 Select the fuzz target
The peekholes (e.g., the `mData` exclude `mObjects`) are good fields to fuzz, we should hack `mObjects` to find more fields to fuzz.

### 1.3 How to replay
Use `Interceptor` alone is not enough to replay the new generated data.
We are lucky to find that `BpHwBinder::transact` is a wrapper of `IPCThreadState::self()->transact`, such that we can invoke the later method over and over. 


### 1.4 Assemble the `Parcel`
This is a somewhat complex task, the external resource FYI:
```
https://source.android.com/devices/architecture/hidl/types
https://source.android.com/devices/architecture/hidl-cpp/types
https://source.android.com/devices/architecture/hidl-java/types
https://android.googlesource.com/platform/system/tools/hidl/
```

### 1.5 Observe the status of the server 
Strategies for collecting crash of server depends.
A) Pay attention to the [code snippet](#intercept_pos) aforementioned, the [DEAD_OBJECT](https://source.android.com/devices/architecture/hidl-cpp/functions#transport) is an indication of the server's status. 
To catch such indication, a later on transaction may needed. 
B) We find on each lunch of the server, the hwservices issues: 
```
demo@demo:~/Downloads$ adb logcat | grep "HWSERVICES"
12-17 08:51:36.945 27672 27672 I HWSERVICES: hwnative_get_component_register:libdrmbitmap,JNI
12-17 08:51:46.444 28349 28349 I HWSERVICES: hwnative_get_component_register:libdrmbitmap,JNI
```
However, if the client does not process the crash gracefully and been killed (e.g., libai_client.so), we will miss such log.
C) The most reliable method is to analysis the crash log. There are lots of [literals](https://www.cnblogs.com/willhua/p/6718379.html) for analyzing the crash below.
```
12-16 17:13:22.912  1138  1530 F libc    : Fatal signal 11 (SIGSEGV), code 2 (SEGV_ACCERR), fault addr 0x7d3d503000 in tid 1530 (HwBinder:1138_1), pid 1138 (hiaiserver)
12-16 17:13:23.439 21601 21601 F DEBUG   : *** *** *** *** *** *** *** *** *** *** *** *** *** *** *** ***
12-16 17:13:23.440 21601 21601 F DEBUG   : Build fingerprint: 'HUAWEI/MRX-AN19/HWMRX:10/HUAWEIMRX-AN19/102.0.0.207C00:user/release-keys'
12-16 17:13:23.440 21601 21601 F DEBUG   : Revision: '0'
12-16 17:13:23.440 21601 21601 F DEBUG   : ABI: 'arm64'
12-16 17:13:23.440 21601 21601 F DEBUG   : Timestamp: 2021-12-16 17:13:23+0800
12-16 17:13:23.440 21601 21601 F DEBUG   : pid: 1138, tid: 1530, name: HwBinder:1138_1  >>> /vendor/bin/hiaiserver <<<
12-16 17:13:23.440 21601 21601 F DEBUG   : uid: 1000
12-16 17:13:23.440 21601 21601 F DEBUG   : signal 11 (SIGSEGV), code 2 (SEGV_ACCERR), fault addr 0x7d3d503000
12-16 17:13:23.440 21601 21601 F DEBUG   :     x0  00000000ffffffff  x1  0000007d3d463000  x2  0000007d3d503000  x3  0000007d56280dc0
12-16 17:13:23.440 21601 21601 F DEBUG   :     x4  0000000000000002  x5  00000000000001ff  x6  0000000000000194  x7  0000000000000001
12-16 17:13:23.440 21601 21601 F DEBUG   :     x8  0000000000000002  x9  000000000000d554  x10 0000000000010cce  x11 0000007d56280dbc
12-16 17:13:23.440 21601 21601 F DEBUG   :     x12 0000007d3d502ff8  x13 0000007d56230dc0  x14 0000000000000000  x15 aaaaaaaaaaaaaaab
12-16 17:13:23.440 21601 21601 F DEBUG   :     x16 0000007d664b1a30  x17 0000007d664a5f80  x18 0000007d5cd6e000  x19 0000007d56230dc0
12-16 17:13:23.440 21601 21601 F DEBUG   :     x20 0000007d3d463000  x21 0000007d5ddfa830  x22 0000007d5ddfc020  x23 0000007d653f62b0
12-16 17:13:23.440 21601 21601 F DEBUG   :     x24 0000007d653f62b0  x25 ffffffffffffffff  x26 0000000000000003  x27 0000007d5de27be0
12-16 17:13:23.440 21601 21601 F DEBUG   :     x28 0000000000000000  x29 0000007d5ddfa790
12-16 17:13:23.440 21601 21601 F DEBUG   :     sp  0000007d5ddfa740  lr  0000007d65330524  pc  0000007d6532eb74
12-16 17:13:23.460 21601 21601 F DEBUG   : 
12-16 17:13:23.460 21601 21601 F DEBUG   : backtrace:
12-16 17:13:23.460 21601 21601 F DEBUG   :       #00 pc 0000000000062b74  /vendor/lib64/libhiai_executor.so (BuildId: ca52f23246f4bcdca3d8f95220427e4e)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #01 pc 0000000000064520  /vendor/lib64/libhiai_executor.so (ge::TransTensor(ge::TensorDesc const&, void const*, ge::TensorDesc const&, void*)+1440) (BuildId: ca52f23246f4bcdca3d8f95220427e4e)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #02 pc 000000000005dd0c  /vendor/lib64/libhiai_executor.so (BuildId: ca52f23246f4bcdca3d8f95220427e4e)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #03 pc 00000000000496d8  /vendor/lib64/libhiai_executor.so (ge::GeneralModelExecutor::Execute(std::__1::vector<ge::TensorBuffer, std::__1::allocator<ge::TensorBuffer>> const&, std::__1::vector<ge::TensorBuffer, std::__1::allocator<ge::TensorBuffer>>&)+1320) (BuildId: ca52f23246f4bcdca3d8f95220427e4e)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #04 pc 00000000000335a0  /vendor/lib64/libhiai_server.so (ge::ExecutorManager::Execute(unsigned int, std::__1::vector<ge::TensorBuffer, std::__1::allocator<ge::TensorBuffer>> const&, std::__1::vector<ge::TensorBuffer, std::__1::allocator<ge::TensorBuffer>>&)+92) (BuildId: 9e821c0de2c487f8e644fcfe3ebe1094)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #05 pc 0000000000020a68  /vendor/lib64/libhiai_server.so (hiai::AIModelManagerImpl::ForwardCompute(hiai::AIContext&, std::__1::vector<std::__1::shared_ptr<hiai::IAITensor>, std::__1::allocator<std::__1::shared_ptr<hiai::IAITensor>>> const&, std::__1::vector<std::__1::shared_ptr<hiai::IAITensor>, std::__1::allocator<std::__1::shared_ptr<hiai::IAITensor>>>&, int)+1268) (BuildId: 9e821c0de2c487f8e644fcfe3ebe1094)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #06 pc 000000000005bac4  /vendor/bin/hiaiserver (ai::AiModelMngrService::ExecuteModel(int, int, std::__1::shared_ptr<ai::TaskHandleWrap>, hiai::AIContext&, std::__1::vector<std::__1::shared_ptr<hiai::IAITensor>, std::__1::allocator<std::__1::shared_ptr<hiai::IAITensor>>> const&, std::__1::vector<std::__1::shared_ptr<hiai::IAITensor>, std::__1::allocator<std::__1::shared_ptr<hiai::IAITensor>>>&, int)+716) (BuildId: 480c54fdb0df11b667956c294e2d001a)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #07 pc 000000000005cafc  /vendor/bin/hiaiserver (ai::AiModelMngrService::runModel2(int, int, android::hardware::hidl_vec<android::hardware::hidl_handle> const&, android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, android::hardware::hidl_vec<android::hardware::hidl_handle> const&, android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, unsigned int, android::hardware::hidl_string const&)+1200) (BuildId: 480c54fdb0df11b667956c294e2d001a)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #08 pc 000000000006cd38  /vendor/lib64/vendor.huawei.hardware.ai@1.1.so (vendor::huawei::hardware::ai::V1_1::BnHwAiModelMngr::_hidl_runModel2(android::hidl::base::V1_0::BnHwBase*, android::hardware::Parcel const&, android::hardware::Parcel*, std::__1::function<void (android::hardware::Parcel&)>)+692) (BuildId: 401d2d5fe2bf2a86050ef8f4ab4ffb3f)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #09 pc 0000000000015d84  /vendor/lib64/vendor.huawei.hardware.ai@3.2.so (vendor::huawei::hardware::ai::V3_2::BnHwAiModelMngr::onTransact(unsigned int, android::hardware::Parcel const&, android::hardware::Parcel*, unsigned int, std::__1::function<void (android::hardware::Parcel&)>)+1940) (BuildId: 8d0033ecc5612c03f0f58d8e15dfa964)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #10 pc 00000000000825f4  /system/lib64/vndk-sp-29/libhidlbase.so (android::hardware::BHwBinder::transact(unsigned int, android::hardware::Parcel const&, android::hardware::Parcel*, unsigned int, std::__1::function<void (android::hardware::Parcel&)>)+68) (BuildId: 11681eaa4cb6b125f8ee49040fbec465)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #11 pc 0000000000085e88  /system/lib64/vndk-sp-29/libhidlbase.so (android::hardware::IPCThreadState::getAndExecuteCommand()+1036) (BuildId: 11681eaa4cb6b125f8ee49040fbec465)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #12 pc 0000000000087518  /system/lib64/vndk-sp-29/libhidlbase.so (android::hardware::IPCThreadState::joinThreadPool(bool)+152) (BuildId: 11681eaa4cb6b125f8ee49040fbec465)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #13 pc 00000000000965ac  /system/lib64/vndk-sp-29/libhidlbase.so (android::hardware::PoolThread::threadLoop()+24) (BuildId: 11681eaa4cb6b125f8ee49040fbec465)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #14 pc 00000000000136d8  /system/lib64/vndk-sp-29/libutils.so (android::Thread::_threadLoop(void*)+288) (BuildId: d8022ba6148997b3e4f5f130703a1b11)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #15 pc 00000000000cf7c0  /apex/com.android.runtime/lib64/bionic/libc.so (__pthread_start(void*)+36) (BuildId: b91c775ccc9b0556e91bc575a2511cd0)
12-16 17:13:23.460 21601 21601 F DEBUG   :       #16 pc 00000000000721a8  /apex/com.android.runtime/lib64/bionic/libc.so (__start_thread+64) (BuildId: b91c775ccc9b0556e91bc575a2511cd0)
```

### 2 Reference
https://frida.re/docs/javascript-api/

