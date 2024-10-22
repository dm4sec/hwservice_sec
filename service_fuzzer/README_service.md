## `service_fuzzer` is used to fuzz service.

### 1 Design
This is just a PoC to prove that this project can work on service as well.

### 1.1 Intercept

The transact process located at `frameworks/native/libs/binder/BpBinder.cpp`.

```cpp
status_t BpBinder::transact( <- intercept here.
    uint32_t code, const Parcel& data, Parcel* reply, uint32_t flags)
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
demo@demo:~/Downloads$ adb pull /system/lib64/libbinder.so
/system/lib64/libbinder.so: 1 file pulled, 0 skipped. 28.5 MB/s (638792 bytes in 0.021s)
demo@demo:~/Downloads$ objdump -tT libbinder.so | grep "transact"
000000000004c5e8 g    DF .text	00000000000000b8  Base        _ZN7android7BBinder8transactEjRKNS_6ParcelEPS1_j
000000000004def0 g    DF .text	0000000000000074  Base        _ZN7android8BpBinder8transactEjRKNS_6ParcelEPS1_j
0000000000058e38 g    DF .text	00000000000001c4  Base        _ZN7android14IPCThreadState8transactEijRKNS_6ParcelEPS1_j
demo@demo:~/Downloads$ objdump -tT libbinder.so | grep "self"
0000000000000000      DF *UND*	0000000000000000  Base        _ZN7android18IPCThreadStateBase4selfEv
0000000000057ef0 g    DF .text	0000000000000034  Base        _ZN7android14IPCThreadState10selfOrNullEv
0000000000057d44 g    DF .text	0000000000000100  Base        _ZN7android14IPCThreadState4selfEv
000000000007d4b8 g    DF .text	00000000000000f0  Base        _ZN7android12ProcessState4selfEv
000000000007d8e8 g    DF .text	0000000000000068  Base        _ZN7android12ProcessState10selfOrNullEv
```
`libbinder.so` is the binary for my `pixel3` and `honor` boxes.

**NOTE**: This scheme is deprecated, for we now have a better solution to get the target.

### 1.2 Select the fuzz target
Since this is just a PoC, only the peekholes (e.g., the `mData` exclude `mObjects`) are fuzzed.

### 1.3 How to replay
~~BpBinder::transact is a wrapper of IPCThreadState::self()->transact, such that we can invoke the later function over and over.~~
1. If `Interceptor.attach` used, just let it go without `return` statement.
2. Else if `Interceptor.replace` used, call the original function and return the ret value.

Considering that the target for fuzzing depends on the previous steps (state machine), to ease the work, we adopt to use app to do the replay work. 
In such scenario, we can use either the 1st scheme which modify the input and let it go, or the 2nd scheme, which modify the input and return the original return value. 

For these targets that can run standalone, we use the 2nd scheme for replaying. For the 1st scheme will lead to an infinite loop when replaying in our interceptor.

## 2 Reference
system/tools/aidl/tests
out/soong/.intermediates/system/tools/aidl/libaidl-integration-test/android_arm_armv8-a_kryo_core_shared/gen/aidl/system/tools/aidl/tests/android/aidl/tests/ITestService.cpp
out/soong/.intermediates/system/tools/aidl/libaidl-integration-test/android_arm64_armv8-a_kryo_core_shared/gen/aidl/system/tools/aidl/tests/android/aidl/tests/ITestService.cpp

https://developer.android.com/guide/components/aidl
https://android.googlesource.com/platform/system/tools/aidl/+/brillo-m10-dev/docs/aidl-cpp.md
https://source.android.com/devices/architecture/aidl/aidl-backends
https://juejin.cn/post/6858235310891859981

### 3 TODO
1. To parse objects in Parcel, especially those `binder object`s.
