## 1. `idc_script` is used to distill interfaces, arguments of a given server. 

### 1.2 TODO:
A. To run in a batch mode.

### 1.3 Reference:
https://github.com/SiOS-Submission/SiOS/blob/master/GCDWebServerStud/GCDWebServer_Analysis.idc

## 2. `transact_fuzzer` is used to fuzz transact.

### 2.1 Design
### 2.1.1 Intercept

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
```
**NOTE**: `libhidlbase.so` is the binary for my `pixel3` and `honor` box.

### 2.1.2 Select the fuzz target
The peekholes (e.g., the `mData` exclude `mObjects`) are good fields to fuzz, we should hack `mObjects` to find more targets to fuzz.
### 2.2 TODO:
**T1**: How to replay? Use `Interceptor` alone is not enough. \
**T2**: Assemble the `Parcel` is a somewhat complex work, I need to hack each `mObjects`. \
**T3**: Observe the status of the server (running status, etc.).

### 2.3 Reference
https://frida.re/docs/javascript-api/
