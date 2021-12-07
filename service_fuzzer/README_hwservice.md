## `hwservice_fuzzer` is used to fuzz hwservice (hardware service).

### 1 Design
Considering that the owner of the `Parcel` is the client, I modified the `Parcel` (context-aware) and replay it on-the-fly. 

### 1.1 Intercept

The call trace of `transact` is:

`out/soong/.intermediates/hardware/interfaces/demo/1.0/android.hardware.demo@1.0_genc++/gen/android/hardware/demo/1.0/DemoAll.cpp`
```cpp
    _hidl_err = ::android::hardware::IInterface::asBinder(_hidl_this)->transact(3 /* baz */, _hidl_data, &_hidl_reply);
```

`system/libhwbinder/BpHwBinder.cpp`
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
The peekholes (e.g., the `mData` exclude `mObjects`) are good fields to fuzz, we should hack `mObjects` to find more targets to fuzz.

### 1.3 How to replay
Use `Interceptor` alone is not enough to replay the new generated data.
We are lucky to find that `BpHwBinder::transact` is a wrapper of `IPCThreadState::self()->transact`, such that we can invoke the later method over and over. 


### 2 TODO:
**T1**: Assemble the `Parcel` is a somewhat complex work.
The external resource includes:
```
https://source.android.com/devices/architecture/hidl/types
https://source.android.com/devices/architecture/hidl-cpp/types
https://source.android.com/devices/architecture/hidl-java/types
https://android.googlesource.com/platform/system/tools/hidl/
```

**T2**: Observe the status of the server (running status, etc.).

### 3 Reference
https://frida.re/docs/javascript-api/

