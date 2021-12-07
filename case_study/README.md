# Intro
By observing, I find it's a case to case fuzzing for a specific service.
(e.g., the crash of the app by blind fuzzing will hinder the further test.)

## 1. `huaweiAI` is used to fuzz [huawei ai service](https://developer.huawei.com/consumer/cn/doc/overview/HUAWEI_HiAI).

### 1.1 Background
It's commonly known that in order to use a model, the ML framework should 1) load the model, 2) then feed the model with data to get result.
These are two ideal places to perform file (data) fuzzing.

### 1.2 Collecting Information
A. Use the [Frida Gadget](https://frida.re/docs/gadget/) to process the [Demo](https://developer.huawei.com/consumer/cn/doc/development/hiai-Examples/sample-code-0000001050265470). \
B. Distill `vendor.huawei.hardware.ai@*` from device, then use [idc_scirpt](https://github.com/dm4sec/hwservice_sec/idc_script) to parse these binaries.
```commandline
demo@demo:~/Downloads$ adb shell ls /vendor/lib64/vendor.huawei.hardware.ai@*
/vendor/lib64/vendor.huawei.hardware.ai@1.0.so
/vendor/lib64/vendor.huawei.hardware.ai@1.1.so
/vendor/lib64/vendor.huawei.hardware.ai@1.2.so
/vendor/lib64/vendor.huawei.hardware.ai@1.3.so
/vendor/lib64/vendor.huawei.hardware.ai@2.0.so
/vendor/lib64/vendor.huawei.hardware.ai@2.1.so
/vendor/lib64/vendor.huawei.hardware.ai@3.0.so
/vendor/lib64/vendor.huawei.hardware.ai@3.1.so
/vendor/lib64/vendor.huawei.hardware.ai@3.2.so
```

C. After exploring `文字图像超分` activity, I find the following methods are triggered.

| # | transaction code | interface token | interface method | 
| ----| :----: | :----: | :---- |
| 1 | 1 | vendor.huawei.hardware.ai@2.0::IModelManagerService_hidl | vendor::huawei::hardware::ai::V2_0::BpHwModelManagerService_hidl::_hidl_Init(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, android::hardware::hidl_string const&, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V2_0::hiai_model_hidl> const&) |
| 2 | 3 | vendor.huawei.hardware.ai@2.0::IModelManagerService_hidl | vendor::huawei::hardware::ai::V2_0::BpHwModelManagerService_hidl::_hidl_SetListener(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::sp\<vendor::huawei::hardware::ai::V2_0::IAIListener_hidl> const&)
| 3 | 4 | vendor.huawei.hardware.ai@2.0::IModelManagerService_hidl | vendor::huawei::hardware::ai::V2_0::BpHwModelManagerService_hidl::_hidl_UnInit(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int)
| 4 | 8 | vendor.huawei.hardware.ai@1.1::IAiModelMngr | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_registerInstance(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, bool)
| 5 | 9 | vendor.huawei.hardware.ai@1.1::IAiModelMngr | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_unregisterInstance(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int)
| 6 | 11 | vendor.huawei.hardware.ai@2.1::IModelManagerService_hidl | vendor::huawei::hardware::ai::V2_1::BpHwModelManagerService_hidl::_hidl_BuildModel(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, unsigned int, android::hardware::hidl_string const&, unsigned int, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V2_0::hiai_model_hidl> const&, vendor::huawei::hardware::ai::V2_0::hiai_model_hidl const&, std::__1::function<void ()(unsigned int, int)>)
| 7 | 11 | vendor.huawei.hardware.ai@1.1::IAiModelMngr | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_startModelFromMem2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::ModelBuffer\> const&) 
| 8 | 12 | vendor.huawei.hardware.ai@1.1::IAiModelMngr | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_runModel2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec\<android::hardware::hidl_handle> const&, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, android::hardware::hidl_vec\<android::hardware::hidl_handle> const&, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, unsigned int, android::hardware::hidl_string const&)
| 9 | 21 | vendor.huawei.hardware.ai@3.0::IAiModelMngr | vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_allocMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, int, std::__1::function<void ()(int, android::hardware::hidl_memory const&)>)
| 10 | 22 | vendor.huawei.hardware.ai@3.0::IAiModelMngr | vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_freeMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, android::hardware::hidl_memory const&)

From the `interface method` names, I would like to fuzz #6, #7, and #8 interfaces.

### 1.3 Start fuzzing
I take #7 as an example to perform both peekhole and object fuzz. The `mData` of the Parcel is depicted as below.
```
0          0x2c    0x30    0x34                     0x5c                     0x84                     0xac 0xb0 0xb4                     0xdc                     0xfc
|-----------|-------|-------|------------------------|------------------------|------------------------|----|----|------------------------|------------------------| 
| interface |  int  |  int  | BINDER_TYPE_PTR (0x28) | BINDER_TYPE_PTR (0x28) | BINDER_TYPE_PTR (0x28) | Uint64  | BINDER_TYPE_PTR (0x28) | BINDER_TYPE_FDA (0x20) |

             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
7a39846240  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
7a39846250  72 64 77 61 72 65 2e 61 69 40 31 2e 31 3a 3a 49  rdware.ai@1.1::I
7a39846260  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 01 00 00 00  AiModelMngr.....
7a39846270  a1 01 00 00 85 2a 74 70 00 00 00 00 08 3b ff cd  .....*tp.....;..
7a39846280  7f 00 00 00 10 00 00 00 00 00 00 00 00 00 00 00  ................
7a39846290  00 00 00 00 00 00 00 00 00 00 00 00 85 2a 74 70  .............*tp
7a398462a0  01 00 00 00 f8 2d 58 3b 7a 00 00 00 28 00 00 00  .....-X;z...(...
7a398462b0  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
7a398462c0  00 00 00 00 85 2a 74 70 01 00 00 00 80 2e 58 3b  .....*tp......X;
7a398462d0  7a 00 00 00 2b 00 00 00 00 00 00 00 01 00 00 00  z...+...........
7a398462e0  00 00 00 00 00 00 00 00 00 00 00 00 1c 00 00 00  ................
7a398462f0  00 00 00 00 85 2a 74 70 01 00 00 00 80 38 bc 39  .....*tp.....8.9
7a39846300  7a 00 00 00 1c 00 00 00 00 00 00 00 01 00 00 00  z...............
7a39846310  00 00 00 00 10 00 00 00 00 00 00 00 85 61 64 66  .............adf
7a39846320  00 00 00 00 01 00 00 00 00 00 00 00 03 00 00 00  ................
7a39846330  00 00 00 00 0c 00 00 00 00 00 00 00              ............
```

#### 1.3.1 fuzzPeekhole
fuzzPeekhole find nothing. 
**Note**, the [idc_scirpt](https://github.com/dm4sec/hwservice_sec/idc_script) issues: 

```
F: 0x69028 - 0x69398: vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_startModelFromMem2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::ModelBuffer> const&)
C: 0x690B0 -> 0x72500: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x690C4 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x690D8 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x690F4 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x69120 -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
G: *** Vendor's implementation, shall verify the below result ***: 0x69150 -> 0x73670: vendor::huawei::hardware::ai::V1_0::writeEmbeddedToParcel(vendor::huawei::hardware::ai::V1_0::ModelBuffer const&, android::hardware::Parcel *, unsigned long, unsigned long)
T: Transaction code at 0x69190: 11
```
And the last invocation is thunked to:
```cpp
// vendor::huawei::hardware::ai::V1_0::writeEmbeddedToParcel(vendor::huawei::hardware::ai::V1_0::ModelBuffer const&, android::hardware::Parcel *, unsigned long, unsigned long)
__int64 __fastcall vendor::huawei::hardware::ai::V1_0::writeEmbeddedToParcel(android::hardware *a1, const android::hardware::hidl_string *a2, android::hardware::Parcel *a3, unsigned __int64 a4, unsigned __int64 a5)
{
  __int64 result; // x0

  result = android::hardware::writeEmbeddedToParcel(a1, a2, a3, a4, a5);
  if ( !(_DWORD)result )
    result = android::hardware::writeEmbeddedToParcel();
  return result;
}
```
1) This method delivers 3 parameters, two `Int32`(s) and one `android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::ModelBuffer>`
2) This indicates there are 2 units can be fuzzed. However, offset 0x2c, 0x30, 0xac and 0xb0 of the above memory are fuzzed actually.
After going through `status_t writeEmbeddedToParcel(const hidl_memory &memory,
        Parcel *parcel, size_t parentHandle, size_t parentOffset)` (system/libhidl/transport/HidlBinderSupport.cpp), I find there is one leading `Uint64` inserted when performing `writeNativeHandleNoDup`. Anyway, it's doesn't matter if I fuzz one unit each time.
3) The workflow of delivering a `hidl_vec` is: \
A) `writeBuffer (VectorType::emitReaderWriter)` firstly, \
B) then assemble `writeEmbeddedToParcel (Type::emitReaderWriterEmbeddedForTypeName)`, \
C) assemble others (depending on the implementation of `emitReaderWriterEmbedded` of `type` in `mElementType`, c.f., system/tools/hidl/hidl-gen_y.yy) in a loop. \
D) goto step B) according to the next `type` in `mElementType`. \
An example which deliver a `hidl_vec` of `hidl_string` is given below. \
**NOTE**: I have gone through the source code of [hidl](https://android.googlesource.com/platform/system/tools/hidl/), but can't find out how `writeEmbeddedBuffer` is generated. 
Anyway, `writeEmbeddedToParcel` is equal to `writeEmbeddedBuffer` when processing `hidl_string`. 
```cpp
    hidl_vec<hidl_string> vec_str = {"a", "b", "c"};
    demo->t2(vec_str);

::android::hardware::Return<void> BpHwDemo::_hidl_t2(::android::hardware::IInterface *_hidl_this, ::android::hardware::details::HidlInstrumentor *_hidl_this_instrumentor, const ::android::hardware::hidl_vec<::android::hardware::hidl_string>& a) {
    // ...

    size_t _hidl_a_parent;

    _hidl_err = _hidl_data.writeBuffer(&a, sizeof(a), &_hidl_a_parent);
    if (_hidl_err != ::android::OK) { goto _hidl_error; }

    size_t _hidl_a_child;

    _hidl_err = ::android::hardware::writeEmbeddedToParcel(
            a,
            &_hidl_data,
            _hidl_a_parent,
            0 /* parentOffset */, &_hidl_a_child);

    if (_hidl_err != ::android::OK) { goto _hidl_error; }

    for (size_t _hidl_index_0 = 0; _hidl_index_0 < a.size(); ++_hidl_index_0) {
        _hidl_err = ::android::hardware::writeEmbeddedToParcel(
                a[_hidl_index_0],
                &_hidl_data,
                _hidl_a_child,
                _hidl_index_0 * sizeof(::android::hardware::hidl_string));

        if (_hidl_err != ::android::OK) { goto _hidl_error; }

    }
    // ...
```

#### 1.3.2 fuzzObject
###### Assemble a valid parcel
In order to fuzz object, I have to hack each object to assemble a valid Parcel to reach the server side. 
The most important thing is to tell apart user data from system data.
Buffers of each `binder_buffer_object` object are depicted below: \
~~\#1. 0x34 - 0x5c~~, assembled by `writeBuffer`, which write the object of `android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::ModelBuffer>`:
```
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
7fcdff3b08  f8 2d 58 3b 7a 00 00 00 01 00 00 00 01 00 00 00  .-X;z...........
```
\#2. 0x5c - 0x84, assembled by `writeEmbeddedToParcel`:
```
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
7a3b582df8  80 2e 58 3b 7a 00 00 00 2a 00 00 00 01 00 00 00  ..X;z...*.......
7a3b582e08  80 38 bc 39 7a 00 00 00 01 00 00 00 00 00 00 00  .8.9z...........
7a3b582e18  07 6c 01 00 03 00 00 00                          .l......
```
\#3. 0x84 - 0xac, assembled by `writeEmbeddedBuffer` ?:
```
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
7a3b582e80  67 65 5f 64 65 66 61 75 6c 74 5f 73 75 62 5f 67  ge_default_sub_g
7a3b582e90  72 61 70 68 5f 30 3a 63 6f 6d 2e 6d 6c 6b 69 74  raph_0:com.mlkit
7a3b582ea0  2e 73 61 6d 70 6c 65 2e 63 6e 00                 .sample.cn.
```
\#4. 0xb4 - 0xdc, `writeEmbeddedToParcel(const hidl_handle &handle` -> `writeNativeHandleNoDup(const native_handle_t *handle` -> `writeEmbeddedBuffer`
```
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
7a39bc3880  0c 00 00 00 01 00 00 00 03 00 00 00 71 00 00 00  ............q...
7a39bc3890  92 15 14 03 03 00 00 00 07 6c 01 00              .........l..
```
The object (in between 0xdc - 0xfc) is a `binder_fd_array_object` object, 
`writeEmbeddedToParcel(const hidl_handle &handle` -> `writeNativeHandleNoDup(const native_handle_t *handle`,
it has properties of: 
```
|----[i] num_fds: 0x1
|----[i] parent: 0x3
|----[i] parent_offset: 0xc 
```

There are inconsistency between the information generated by [idc_scirpt](https://github.com/dm4sec/hwservice_sec/idc_script) and the real-time parser.
But I believe the \#2, \#4, \#5 blocks are very important as it is the object of `ModelBuffer`. 
###### Profile the `ModelBuffer` object
The challenge is that the object is self organized (unknown to third-party).
By observation (e.g., the output of logcat, the layout of the 5 objects) and some assumption, I profile the layout of the `ModelBuffer` as:
```
0          0x08        0x0c    0x10          0x18    0x20      0x24    0x28                     0xdc                     0xfc
|-------------|---------|-------|-------------|-------|---------|-------| 
| str pointer | str len |  N/A  | mem pointer |  N/A  | mem len |  N/A  |
|       hidl_string object      |           Model Buffer                |
```
Ok, we take a long journey to reach here, now, let's roll.

