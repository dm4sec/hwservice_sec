# This is the case of fuzzing `textsuperresolution` of [huawei ai service](https://developer.huawei.com/consumer/cn/doc/overview/HUAWEI_HiAI).

## 1 Background
It's commonly known that in order to use a model, the ML framework should 1) load the model, 2) then feed the model with data to get the result.
These are the two ideal places to perform file (data) fuzzing.

## 2 Collecting information
A. Use the [Frida Gadget](https://frida.re/docs/gadget/) to process the [Sample](https://developer.huawei.com/consumer/cn/doc/development/hiai-Examples/sample-code-0000001050265470), e.g., [Vision Demo](https://github.com/HMS-Core/hms-ml-demo/tree/master/MLKit-Sample/module-vision). \
B. Withdraw `vendor.huawei.hardware.ai@*` from device, then use [idc_scirpt](https://github.com/dm4sec/hwservice_sec/tree/master/idc_script) to parse these binaries.
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

C. After exploring `文字图像超分` (a.k.a textsuperresolution) activity, I find the following methods are triggered.

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

I would like to fuzz #6, #7, and #8 interfaces after going through the `interface method` names.
I take #7 as an example to perform both peekhole and object fuzz. 

D) The runtime `Parcel` information is collected below. 

I) An instance of `mData` in the `Parcel`:
```
0                0x2c    0x30    0x34                     0x5c                     0x84                     0xac 0xb0 0xb4                     0xdc                     0xfc
|-----------------|-------|-------|------------------------|------------------------|------------------------|----|----|------------------------|------------------------| 
| interface token |  int  |  int  | BINDER_TYPE_PTR (0x28) | BINDER_TYPE_PTR (0x28) | BINDER_TYPE_PTR (0x28) | Uint64  | BINDER_TYPE_PTR (0x28) | BINDER_TYPE_FDA (0x20) |

             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
75dbac08c0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
75dbac08d0  72 64 77 61 72 65 2e 61 69 40 31 2e 31 3a 3a 49  rdware.ai@1.1::I
75dbac08e0  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 02 00 00 00  AiModelMngr.....
75dbac08f0  12 00 00 00 85 2a 74 70 00 00 00 00 88 bb 9a e8  .....*tp........
75dbac0900  7f 00 00 00 10 00 00 00 00 00 00 00 00 00 00 00  ................
75dbac0910  00 00 00 00 00 00 00 00 00 00 00 00 85 2a 74 70  .............*tp
75dbac0920  01 00 00 00 28 0d a2 e9 75 00 00 00 28 00 00 00  ....(...u...(...
75dbac0930  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
75dbac0940  00 00 00 00 85 2a 74 70 01 00 00 00 b0 0d a2 e9  .....*tp........
75dbac0950  75 00 00 00 2e 00 00 00 00 00 00 00 01 00 00 00  u...............
75dbac0960  00 00 00 00 00 00 00 00 00 00 00 00 1c 00 00 00  ................
75dbac0970  00 00 00 00 85 2a 74 70 01 00 00 00 e0 d8 b2 db  .....*tp........
75dbac0980  75 00 00 00 1c 00 00 00 00 00 00 00 01 00 00 00  u...............
75dbac0990  00 00 00 00 10 00 00 00 00 00 00 00 85 61 64 66  .............adf
75dbac09a0  00 00 00 00 01 00 00 00 00 00 00 00 03 00 00 00  ................
75dbac09b0  00 00 00 00 0c 00 00 00 00 00 00 00              ............
```

II) Buffers of each `binder_buffer_object` object: \
~~\#1. 0x34 - 0x5c~~, assembled by `writeBuffer`, which write the object of `hidl_vec`:
```
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
7fe89abb88  28 0d a2 e9 75 00 00 00 01 00 00 00 01 00 00 00  (...u...........
```
\#2. <span id='2nd_binder_buffer_object'></span> 0x5c - 0x84, assembled by `writeEmbeddedBuffer`, which write the object of `hidl_vect<t>`:
```
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
75e9a20d28  b0 0d a2 e9 75 00 00 00 2d 00 00 00 01 00 00 00  ....u...-.......
75e9a20d38  e0 d8 b2 db 75 00 00 00 01 00 00 00 00 00 00 00  ....u...........
75e9a20d48  e2 42 00 00 03 00 00 00                          .B......
```
\#3. 0x84 - 0xac, assembled by `writeEmbeddedToParcel(const hidl_string &string`:
```
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
75e9a20db0  6d 6c 5f 74 65 78 74 73 75 70 65 72 72 65 73 6f  ml_textsuperreso
75e9a20dc0  6c 75 74 69 6f 6e 36 30 30 3a 63 6f 6d 2e 6d 6c  lution600:com.ml
75e9a20dd0  6b 69 74 2e 73 61 6d 70 6c 65 2e 63 6e 00        kit.sample.cn.
```
\#4. <span id='4th_binder_buffer_object'> 0xb4 - 0xdc, `status_t writeEmbeddedToParcel(const hidl_handle &handle,` -> `status_t Parcel::writeEmbeddedNativeHandle(const native_handle_t *handle,` -> `status_t Parcel::writeNativeHandleNoDup(const native_handle_t *handle,
` -> `status_t Parcel::writeEmbeddedBuffer(`
```
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
75dbb2d8e0  0c 00 00 00 01 00 00 00 03 00 00 00 6d 00 00 00  ............m...
75dbb2d8f0  92 15 14 03 03 00 00 00 e2 42 00 00              .........B..
```
\#5. The last object (in between 0xdc - 0xfc) is a `binder_fd_array_object` object, 
`status_t writeEmbeddedToParcel(const hidl_handle &handle,` -> `status_t Parcel::writeEmbeddedNativeHandle(const native_handle_t *handle,` -> `status_t Parcel::writeNativeHandleNoDup(const native_handle_t *handle,
`, it has properties of: 
```
|----[i] num_fds: 0x1
|----[i] parent: 0x3
|----[i] parent_offset: 0xc 
```
III) For this method, the [idc_scirpt](https://github.com/dm4sec/hwservice_sec/tree/master/idc_script) issues: 

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
```
.text:00000000000A7FEC ; vendor::huawei::hardware::ai::V1_0::writeEmbeddedToParcel(vendor::huawei::hardware::ai::V1_0::ModelBuffer const&, android::hardware::Parcel *, unsigned long, unsigned long)
.text:00000000000A7FEC                 EXPORT _ZN6vendor6huawei8hardware2ai4V1_021writeEmbeddedToParcelERKNS3_11ModelBufferEPN7android8hardware6ParcelEmm
.text:00000000000A7FEC _ZN6vendor6huawei8hardware2ai4V1_021writeEmbeddedToParcelERKNS3_11ModelBufferEPN7android8hardware6ParcelEmm
.text:00000000000A7FEC                                         ; CODE XREF: vendor::huawei::hardware::ai::V1_0::writeEmbeddedToParcel(vendor::huawei::hardware::ai::V1_0::ModelBuffer const&,android::hardware::Parcel *,ulong,ulong)+C↓j
.text:00000000000A7FEC                                         ; DATA XREF: LOAD:00000000000078A8↑o ...
.text:00000000000A7FEC
.text:00000000000A7FEC var_20          = -0x20
.text:00000000000A7FEC var_10          = -0x10
.text:00000000000A7FEC var_s0          =  0
.text:00000000000A7FEC
.text:00000000000A7FEC ; __unwind {
.text:00000000000A7FEC                 STP             X22, X21, [SP,#-0x10+var_20]!
.text:00000000000A7FF0                 STP             X20, X19, [SP,#0x20+var_10]
.text:00000000000A7FF4                 STP             X29, X30, [SP,#0x20+var_s0]
.text:00000000000A7FF8                 ADD             X29, SP, #0x20
.text:00000000000A7FFC                 MOV             X21, X3
.text:00000000000A8000                 MOV             X19, X2
.text:00000000000A8004                 MOV             X20, X1
.text:00000000000A8008                 MOV             X22, X0
.text:00000000000A800C                 BL              ._ZN7android8hardware21writeEmbeddedToParcelERKNS0_11hidl_stringEPNS0_6ParcelEmm ; android::hardware::writeEmbeddedToParcel(android::hardware::hidl_string const&,android::hardware::Parcel *,ulong,ulong)
.text:00000000000A8010                 CBZ             W0, loc_A8024
.text:00000000000A8014                 LDP             X29, X30, [SP,#0x20+var_s0]
.text:00000000000A8018                 LDP             X20, X19, [SP,#0x20+var_10]
.text:00000000000A801C                 LDP             X22, X21, [SP+0x20+var_20],#0x30
.text:00000000000A8020                 RET
.text:00000000000A8024 ; ---------------------------------------------------------------------------
.text:00000000000A8024
.text:00000000000A8024 loc_A8024                               ; CODE XREF: vendor::huawei::hardware::ai::V1_0::writeEmbeddedToParcel(vendor::huawei::hardware::ai::V1_0::ModelBuffer const&,android::hardware::Parcel *,ulong,ulong)+24↑j
.text:00000000000A8024                 MOV             X1, X20
.text:00000000000A8028                 MOV             X2, X19
.text:00000000000A802C                 LDP             X29, X30, [SP,#0x20+var_s0]
.text:00000000000A8030                 LDP             X20, X19, [SP,#0x20+var_10]
.text:00000000000A8034                 ADD             X0, X22, #0x10
.text:00000000000A8038                 ADD             X3, X21, #0x10
.text:00000000000A803C                 LDP             X22, X21, [SP+0x20+var_20],#0x30
.text:00000000000A8040                 B               ._ZN7android8hardware21writeEmbeddedToParcelERKNS0_11hidl_handleEPNS0_6ParcelEmm ; android::hardware::writeEmbeddedToParcel(android::hardware::hidl_handle const&,android::hardware::Parcel *,ulong,ulong)
.text:00000000000A8040 ; } // starts at A7FEC
.text:00000000000A8040 ; End of function vendor::huawei::hardware::ai::V1_0::writeEmbeddedToParcel(vendor::huawei::hardware::ai::V1_0::ModelBuffer const&,android::hardware::Parcel *,ulong,ulong)
```

## 3. Start Fuzzing
### 3.1 fuzzPeekhole
This method delivers 3 parameters, two `Int32`(s) and one `android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::ModelBuffer>`.
This indicates there are 2 units can be fuzzed. However, offset 0x2c, 0x30, 0xac and 0xb0 of the above memory are fuzzed actually.
After going through `status_t writeEmbeddedToParcel(const hidl_memory &memory,
        Parcel *parcel, size_t parentHandle, size_t parentOffset)` (system/libhidl/transport/HidlBinderSupport.cpp), I find there is one leading `Uint64` inserted when performing `writeNativeHandleNoDup`. Anyway, it's doesn't matter if I fuzz one unit each time.

### 3.2 fuzzObject

In order to fuzz object, we have to hack each object to assemble a valid Parcel to reach the server side. 
The most important thing is to tell apart user data from system data.

The workflow of delivering a `hidl_vec` is: 
A) `writeBuffer (VectorType::emitReaderWriter)` firstly (\#1), 
B) then assemble `writeEmbeddedToParcel (Type::emitReaderWriterEmbeddedForTypeName)`(\#2), 
C) assemble others (depending on the implementation of `emitReaderWriterEmbedded` of `type` in `mElementType`, c.f., system/tools/hidl/hidl-gen_y.yy) in a loop (\#3, \#4, \#5). \
**NOTE**: I have gone through the source code of [hidl](https://android.googlesource.com/platform/system/tools/hidl/), but can't find out how `writeEmbeddedBuffer` is generated. 
Anyway, `writeEmbeddedToParcel` is equal to `writeEmbeddedBuffer` when processing `hidl_vec`. 

###### Profile the `ModelBuffer` object
The challenge is that the object is self organized (unknown to third-party).
By observation (e.g., by cross referencing the libai_client.so, vendor.huawei.hardware.ai@1.0.so, the output of logcat, and some testcases), we profile the layout of the `ModelBuffer` ([#2](#2nd_binder_buffer_object)) as:
```
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
75e9a20d28  b0 0d a2 e9 75 00 00 00 2d 00 00 00 01 00 00 00  ....u...-.......
75e9a20d38  e0 d8 b2 db 75 00 00 00 01 00 00 00 00 00 00 00  ....u...........
75e9a20d48  e2 42 00 00 03 00 00 00                          .B......

0        0x08    0x0c    0x10      0x18    0x1c    0x20      0x24      0x28
|---------|-------|-------|---------|-------|-------|---------|---------| 
| mBuffer |   -   |   -   | mHandle |   -   |   -   |    V1   |    V2   |
|   hidl_string object    |   hidl_handle object    | 1st int | 2nd int |     
```

The `hidl_handle` object is a variant-length object, the instance of [#4](#4th_binder_buffer_object) can be read as:

```
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
75dbb2d8e0  0c 00 00 00 01 00 00 00 03 00 00 00 6d 00 00 00  ............m...
75dbb2d8f0  92 15 14 03 03 00 00 00 e2 42 00 00              .........B..

0                        0x04     0x08      0x0c      0x10      0x14      0x18      0x2c
|-------------------------|--------|---------|---------|---------|---------|---------|
| sizeof(native_handle_t) | numFds | numInts | 1st fds | 1st int |    V2   |    V1   |
```

###### Locate the fuzz data
We conclude that the overall `ModelBuffer` is assembled by a `hidl_string` object, a `hidl_handle` object and 2 additional `int`(s).
The `hidl_handle` object contains 1 `fd` and 3 `int`(s). After inspecting all these information, we narrow down the target from the `ModelBuffer` to the four elements within \#4.
By referring the information of logcat below, we found the `V1` is the `size` and `V2` is the `perf` field. 
```
12-10 15:31:34.273  4419  4419 I aiclient: HIAI_GetVersion_Config ERROR __system_property_get <= 0
12-10 15:31:34.273  4419  4419 I aiclient: success
12-10 15:31:34.274  4419  4419 I aiclient: CreateAshmemFd done, name: ion_alloc, size: 17007, fd: 107
12-10 15:31:34.279  4419  4419 I aiclient: CreateAshmemFd done, name: ion_alloc, size: 16989, fd: 107
12-10 15:31:34.279  4419  4419 I aiclient: CreateAshmemFd done, name: ion_alloc, size: 6, fd: 108
12-10 15:31:34.285  4419  4419 I aiclient: CreateAshmemFd done, name: ion_alloc, size: 17052, fd: 107
12-10 15:31:34.286  4419  4419 I aiclient: CreateAshmemFd done, name: ion_alloc, size: 6, fd: 108
12-10 15:31:34.286  4419  4419 I aiclient: CreateAshmemFd done, name: ion_alloc, size: 1, fd: 109
12-10 15:31:34.305  4419  4419 I aiclient: AiModelManagerImpl::CreateInstanceID create instance id: 1
12-10 15:31:34.305  4419  4419 I aiclient: AiModelManagerImpl::Register: clientID:0x75ca9b4450(sync), total client num:2
12-10 15:31:34.305  4419  4419 I aiclient: success
12-10 15:31:34.305  4419  4419 I aiclient: HIAI_TensorBuffer_create: N[979972] C[1] H[1] W[1].
12-10 15:31:34.306  4419  4419 I aiclient: NativeHandleWrapper::AllocMemory : AllocMemory size:3919888, IonSizeCeil(size):3923968
12-10 15:31:34.306  4419  4419 I aiclient: N[979972] C[1] H[1] W[1] data[0x75ec0e8000] size[3919888] name[]
12-10 15:31:34.306  4419  4419 I aiclient: HIAI_TensorBuffer_create: N[516] C[1] H[1] W[1].
12-10 15:31:34.306  4419  4419 I aiclient: NativeHandleWrapper::AllocMemory : AllocMemory size:2064, IonSizeCeil(size):4096
12-10 15:31:34.306  4419  4419 I aiclient: N[516] C[1] H[1] W[1] data[0x76ce93d000] size[2064] name[]
12-10 15:31:34.307  4419  4419 I aiclient: CreateAshmemFd done, name: ion_alloc, size: 1112630, fd: 109
12-10 15:31:34.309  4419  4419 I aiclient: ~NativeHandleWrapper   fd:107.
12-10 15:31:34.310  4419  4419 I aiclient: success
12-10 15:31:34.310  4419  4419 I aiclient: ~NativeHandleWrapper   fd:108.
12-10 15:31:34.310  4419  4419 I aiclient: success
12-10 15:31:34.310  4419  4419 I aiclient: AiModelManagerImpl::Unregister: clientID:0x75ca9b4450, total client num:1
12-10 15:31:34.310  4419  4419 I aiclient: success
12-10 15:31:34.312  4419  4419 I aiclient: AiModelManagerImpl::CreateInstanceID create instance id: 1
12-10 15:31:34.312  4419  4419 I aiclient: AiModelManagerImpl::Register: clientID:0x75ca9b4420(sync), total client num:2
12-10 15:31:34.312  4419  4419 I aiclient: success
12-10 15:31:34.312  4419  4419 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 17122, fd: 107
12-10 15:31:34.313  4419  4419 I aiclient: ModelBufferWrapper::createFromModelBuf [ok]
12-10 15:31:34.313  4419  4419 I aiclient: ModelBufferWrapper::ModelBufferWrapper
12-10 15:31:34.313  4419  4419 I aiclient: ModelBufferWrapper::getModelBuf
12-10 15:31:34.313  4419  4419 I aiclient: name[ml_textsuperresolution400], buff[0x75cb18ff00], perf[3], size[17122]
12-10 15:31:34.313  4419  4419 I aiclient: buff0 name[ml_textsuperresolution400] path[] perf[3] size[17122]
12-10 15:31:34.313  4419  4419 I aiclient: ModelBufferWrapper::getModelBuf
12-10 15:31:34.313  4419  4419 I aiclient: AiModelManagerImpl::isModelBufferValid [ok]
12-10 15:31:34.313  4419  4419 I aiclient: AiModelManagerImpl::CheckModelBufferVecValid [ok]
12-10 15:31:34.367  4419  4419 I aiclient: name[ml_textsuperresolution400], path[], perf[3], size[17122]
12-10 15:31:34.369  4419  4419 I aiclient: HIAI_GetVersion_Config ERROR __system_property_get <= 0
12-10 15:31:34.369  4419  4419 I aiclient: success
12-10 15:31:34.369  4419  4419 I aiclient: CreateAshmemFd done, name: ion_alloc, size: 17007, fd: 107
12-10 15:31:34.373  4419  4419 I aiclient: CreateAshmemFd done, name: ion_alloc, size: 16989, fd: 107
12-10 15:31:34.373  4419  4419 I aiclient: CreateAshmemFd done, name: ion_alloc, size: 6, fd: 108
12-10 15:31:34.378  4419  4419 I aiclient: CreateAshmemFd done, name: ion_alloc, size: 17053, fd: 107
12-10 15:31:34.378  4419  4419 I aiclient: CreateAshmemFd done, name: ion_alloc, size: 6, fd: 108
12-10 15:31:34.378  4419  4419 I aiclient: CreateAshmemFd done, name: ion_alloc, size: 1, fd: 109
12-10 15:31:34.395  4419  4419 I aiclient: AiModelManagerImpl::CreateInstanceID create instance id: 2
12-10 15:31:34.395  4419  4419 I aiclient: AiModelManagerImpl::Register: clientID:0x75ca9b4480(sync), total client num:3
12-10 15:31:34.395  4419  4419 I aiclient: success
12-10 15:31:34.395  4419  4419 I aiclient: HIAI_TensorBuffer_create: N[2189828] C[1] H[1] W[1].
12-10 15:31:34.395  4419  4419 I aiclient: NativeHandleWrapper::AllocMemory : AllocMemory size:8759312, IonSizeCeil(size):8761344
12-10 15:31:34.395  4419  4419 I aiclient: N[2189828] C[1] H[1] W[1] data[0x75af1a5000] size[8759312] name[]
12-10 15:31:34.395  4419  4419 I aiclient: HIAI_TensorBuffer_create: N[516] C[1] H[1] W[1].
12-10 15:31:34.396  4419  4419 I aiclient: NativeHandleWrapper::AllocMemory : AllocMemory size:2064, IonSizeCeil(size):4096
12-10 15:31:34.396  4419  4419 I aiclient: N[516] C[1] H[1] W[1] data[0x76ce93d000] size[2064] name[]
12-10 15:31:34.396  4419  4419 I aiclient: CreateAshmemFd done, name: ion_alloc, size: 2338900, fd: 109
12-10 15:31:34.398  4419  4419 I aiclient: ~NativeHandleWrapper   fd:107.
12-10 15:31:34.398  4419  4419 I aiclient: success
12-10 15:31:34.398  4419  4419 I aiclient: ~NativeHandleWrapper   fd:108.
12-10 15:31:34.398  4419  4419 I aiclient: success
12-10 15:31:34.398  4419  4419 I aiclient: AiModelManagerImpl::Unregister: clientID:0x75ca9b4480, total client num:2
12-10 15:31:34.398  4419  4419 I aiclient: success
12-10 15:31:34.400  4419  4419 I aiclient: AiModelManagerImpl::CreateInstanceID create instance id: 2
12-10 15:31:34.400  4419  4419 I aiclient: AiModelManagerImpl::Register: clientID:0x75ca9b4450(sync), total client num:3
12-10 15:31:34.400  4419  4419 I aiclient: success
12-10 15:31:34.400  4419  4419 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 17122, fd: 107
12-10 15:31:34.400  4419  4419 I aiclient: ModelBufferWrapper::createFromModelBuf [ok]
12-10 15:31:34.400  4419  4419 I aiclient: ModelBufferWrapper::ModelBufferWrapper
12-10 15:31:34.400  4419  4419 I aiclient: ModelBufferWrapper::getModelBuf
12-10 15:31:34.400  4419  4419 I aiclient: name[ml_textsuperresolution600], buff[0x75ca5785c0], perf[3], size[17122]
12-10 15:31:34.400  4419  4419 I aiclient: buff0 name[ml_textsuperresolution600] path[] perf[3] size[17122]
12-10 15:31:34.400  4419  4419 I aiclient: ModelBufferWrapper::getModelBuf
12-10 15:31:34.400  4419  4419 I aiclient: AiModelManagerImpl::isModelBufferValid [ok]
12-10 15:31:34.400  4419  4419 I aiclient: AiModelManagerImpl::CheckModelBufferVecValid [ok]
12-10 15:31:34.471  4419  4419 I aiclient: name[ml_textsuperresolution600], path[], perf[3], size[17122]
```
It's hard to tease out the relationship of the output. 
However, the `CreateAshmemFd` is an important clue 
to tell that the memory is created by using `ashmem_create_region` and `mmap`.
The interceptor (e.g., `CreateAshmemRegionFd`) verified the thought. 
So, we use `mmap` to map and modify the memory for fuzzing. 

**NOTE: what confused me is that by intercepting the `dup`, `mmap`, `munmap`, I found the buffer is munmap(ped) by the client, but the model is still there.**
The model looks like:
```
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
76cb33d000  49 4d 4f 44 00 01 00 00 00 00 00 10 00 00 00 00  IMOD............
76cb33d010  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
76cb33d020  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
76cb33d030  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
76cb33d040  00 00 00 00 00 00 00 00 00 00 00 00 e2 41 00 00  .............A..
76cb33d050  00 00 03 00 67 65 5f 64 65 66 61 75 6c 74 00 00  ....ge_default..
76cb33d060  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
76cb33d070  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
76cb33d080  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
76cb33d090  00 00 00 00 00 00 00 00 02 00 00 00 33 2e 35 31  ............3.51
76cb33d0a0  2e 7a 2e 30 00 00 00 00 00 00 00 00 00 00 00 00  .z.0............
76cb33d0b0  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
76cb33d0c0  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
76cb33d0d0  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
76cb33d0e0  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
76cb33d0f0  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
```

During the fuzzing, the logcat generates:
```
12-13 23:27:11.635  1138  9059 W ENGINE  : /ai_timer_manager.cpp CreateTimer(164)::"interval must be larger than 1000ms."
12-13 23:27:11.635  1138  9059 I ENGINE  : /ai_model_manager_impl.cpp ParseAIConfig(280)::"Get pid config, value:6389"
12-13 23:27:11.635  1138  9059 I ENGINE  : /ai_model_manager_impl.cpp LoadModelFromMem(693)::"Load Model name: ml_textsuperresolution400, omOptions type: 0"
12-13 23:27:11.635  1138  9059 W RUNTIME : PrimaryContextRetain:359 Context IncRef, count = 0x2
12-13 23:27:11.635  1138  9059 E AI_FMK  : /model_buffer_helper.cpp GetModelType(1104)::"ModelBufferLoader parse invalid model. input buffer size:17122, parse size:17122"
12-13 23:27:11.635  1138  9059 E AI_FMK  : /model_generator.cpp GetModelTypeFromBuffer(264)::"ModelGenerator::GenerateFromBuffer get modelType fail."
12-13 23:27:11.635  1138  9059 E ENGINE  : /ai_model_executor_manager.cpp LoadModel(158)::"ModelGenerator GetModelTypeFromBuffer failed!"
12-13 23:27:11.635  1138  9059 E ENGINE  : /ai_model_manager_impl.cpp LoadModelFromMem(717)::"LoadModelFromMem failed!"
12-13 23:27:11.635  1138  9059 W RUNTIME : PrimaryContextRelease:390 Context TryDecRef, count = 0x1, reset:0
12-13 23:27:11.635  1138  9059 E ENGINE  : /ai_model_manager_impl.cpp LoadModels(347)::"Load model \"ml_textsuperresolution400\" failed!"
12-13 23:27:11.635  1138  9059 E ENGINE  : /ai_model_manager_impl.cpp Init(249)::"Load models failed!"
12-13 23:27:11.635  1138  9059 I ENGINE  : /ai_model_manager_impl.cpp UnloadModels(751)::"Unload models failed."
12-13 23:27:11.635  1138  9059 I aiserver: AiModelMngrService::LoadModel init ret = 1
12-13 23:27:11.635  1138  9059 I ENGINE  : SetPerfRelease(110)::"updata data->current(426) != data->last(425)."
12-13 23:27:11.635  1138  9059 I aiserver: AiModelMngrService::startModelFromMem2 PIDCID_CONCAT = 6389001
12-13 23:27:11.635  1138  9059 E aiserver: AiModelMngrService::startModelFromMem2 ERROR: pid 6389001 already registered!
12-13 23:27:11.635  1138  9059 I aiserver: AiModelMngrService::startModelFromMem2 PIDCID_CONCAT = 6389001
12-13 23:27:11.635  1138  9059 E aiserver: AiModelMngrService::startModelFromMem2 ERROR: pid 6389001 already registered!
12-13 23:27:11.635  1138  9059 I aiserver: AiModelMngrService::startModelFromMem2 PIDCID_CONCAT = 6389001
12-13 23:27:11.635  1138  9059 E aiserver: AiModelMngrService::startModelFromMem2 ERROR: pid 6389001 already registered!
12-13 23:27:11.635  1138  9059 I aiserver: AiModelMngrService::startModelFromMem2 PIDCID_CONCAT = 6389001
12-13 23:27:11.635  1138  9059 E aiserver: AiModelMngrService::startModelFromMem2 ERROR: pid 6389001 already registered!
12-13 23:27:11.635  1138  9059 I aiserver: AiModelMngrService::startModelFromMem2 PIDCID_CONCAT = 6389001
12-13 23:27:11.635  1138  9059 E aiserver: AiModelMngrService::startModelFromMem2 ERROR: pid 6389001 already registered!
```
This means our fuzzer works and trigger the first error, but the following error indicates the `_hidl_startModelFromMem2` method depends on the previous steps. 
So that the replay strategy can't be applied to this scenario. There are 2 solutions for this problem. One is that we play the pre-steps, and the other one is that we modify the code of app to load the model over and over. We adopt the later one to simplified the process.
To do so, we write a clean version of `textsuperresolution.js`, it works as:

![image](https://github.com/dm4sec/hwservice_sec/blob/master/case_study/huaweiAI/images/startModelFromMem2.gif)

**NOTE**: The output of logcat also indicates that we should fuzz the Peekhole one unit per lunch.

## 4. Fuzz result
Ok, It took us a few days to reach here, now, let's roll! \
After one whole night, I found lots of crashes like:
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
Values of the model that will crash the server are collected as [textsuperresolution_carsh.log](https://github.com/dm4sec/hwservice_sec/blob/master/case_study/huaweiAI/textsuperresolution_crash.log).

## 4. Reference:
[IMOD](https://bio3d.colorado.edu/imod/), [Imod ASCII File Format](https://bio3d.colorado.edu/imod/doc/asciispec.html), [IMOD Binary File Format](https://bio3d.colorado.edu/imod/doc/binspec.html).