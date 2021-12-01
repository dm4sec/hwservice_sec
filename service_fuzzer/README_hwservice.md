## `hwservice_fuzzer` is used to fuzz hwservice (hardware service).

### 1 Design
Considering that the owner of the `Parcel` is the client, I modified the parcel (context-aware) and replay it on-the-fly. 

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
```
**NOTE**: `libhidlbase.so` is the binary for my `pixel3` and `honor` boxes.

### 1.2 Select the fuzz target
The peekholes (e.g., the `mData` exclude `mObjects`) are good fields to fuzz, we should hack `mObjects` to find more targets to fuzz.

### 1.3 How to replay
Use `Interceptor` alone is not enough to replay the new generated data.
We are lucky to find that `BpHwBinder::transact` is a wrapper of `IPCThreadState::self()->transact`, such that we can invoke the later function over and over. 


### 2 TODO:
**T1**: Assemble the `Parcel` is a somewhat complex work, I need to hack each `mObjects`. There are quirks when mapping the high level calls and native APIs.
e.g., In order to pass the "test_client",

```cpp
    demo->foo("test_client", [&](hidl_string result) {
        printf("ret: %s\n", result.c_str());
    });
```
two `binder_buffer_object`s are written to the `Parcel`, they are:
```cpp
    size_t _hidl_name_parent;

    _hidl_err = _hidl_data.writeBuffer(&name, sizeof(name), &_hidl_name_parent);
    if (_hidl_err != ::android::OK) { goto _hidl_error; }

    _hidl_err = ::android::hardware::writeEmbeddedToParcel(
            name,
            &_hidl_data,
            _hidl_name_parent,
            0 /* parentOffset */);
```

**T2**: Observe the status of the server (running status, etc.).

### 3 Reference
https://frida.re/docs/javascript-api/

