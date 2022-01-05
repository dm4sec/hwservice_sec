### 1 Collect Info

Interface_token Transaction_code & Method

|  #  | code | interface_token                                 | interface_method                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       | 
|:---:|:----:|:------------------------------------------------|:-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
|  1  |  25  | vendor.huawei.hardware.ai@1.3::IAiEngineService | vendor::huawei::hardware::ai::V1_3::BpHwAiEngineService::_hidl_createAiModelMngr_1_3(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::sp\<vendor::huawei::hardware::ai::V1_0::IAiMMListenerProxy> const&, android::sp\<vendor::huawei::hardware::ai::V1_3::IAiMMMemAllocatorProxy> const&, unsigned int)                                                                                                                                                                                                      |
|  2  |  8   | vendor.huawei.hardware.ai@1.1::IAiModelMngr     | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_registerInstance(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, bool)                                                                                                                                                                                                                                                                                                                                                                                |
|  3  |  21  | vendor.huawei.hardware.ai@3.0::IAiModelMngr     | vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_allocMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, int, std::__1::function<void ()(int, android::hardware::hidl_memory const&)>)                                                                                                                                                                                                                                                                      |
|  4  |  11  | vendor.huawei.hardware.ai@1.1::IAiModelMngr     | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_startModelFromMem2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::ModelBuffer> const&)                                                                                                                                                                                                                                                                                         |
|  5  |  16  | vendor.huawei.hardware.ai@1.1::IAiModelMngr     | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_getModelTensor(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_string const&, std::__1::function<void ()(android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&)>)                                                                                                                       |
|  6  |  13  | vendor.huawei.hardware.ai@1.1::IAiModelMngr     | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_stopModel2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int)                                                                                                                                                                                                                                                                                                                                                                                       |
|  7  |  13  | vendor.huawei.hardware.ai@1.1::IAiModelMngr     | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_stopModel2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int)                                                                                                                                                                                                                                                                                                                                                                                       |
|  8  |  9   | vendor.huawei.hardware.ai@1.1::IAiModelMngr     | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_unregisterInstance(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int)                                                                                                                                                                                                                                                                                                                                                                                    |
|  9  |  12  | vendor.huawei.hardware.ai@1.0::IAiEngineService | vendor::huawei::hardware::ai::V1_0::BpHwAiEngineService::_hidl_removeAiModelMngr(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *)                                                                                                                                                                                                                                                                                                                                                                                      |
| 10  |  25  | vendor.huawei.hardware.ai@1.3::IAiEngineService | vendor::huawei::hardware::ai::V1_3::BpHwAiEngineService::_hidl_createAiModelMngr_1_3(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::sp\<vendor::huawei::hardware::ai::V1_0::IAiMMListenerProxy> const&, android::sp\<vendor::huawei::hardware::ai::V1_3::IAiMMMemAllocatorProxy> const&, unsigned int)                                                                                                                                                                                                      |
| 11  |  8   | vendor.huawei.hardware.ai@1.1::IAiModelMngr     | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_registerInstance(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, bool)                                                                                                                                                                                                                                                                                                                                                                                |
| 12  |  21  | vendor.huawei.hardware.ai@3.0::IAiModelMngr     | vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_allocMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, int, std::__1::function<void ()(int, android::hardware::hidl_memory const&)>)                                                                                                                                                                                                                                                                      |
| 13  |  11  | vendor.huawei.hardware.ai@1.1::IAiModelMngr     | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_startModelFromMem2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::ModelBuffer> const&)                                                                                                                                                                                                                                                                                         |
| 14  |  16  | vendor.huawei.hardware.ai@1.1::IAiModelMngr     | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_getModelTensor(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_string const&, std::__1::function<void ()(android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&)>)                                                                                                                       |
| 15  |  21  | vendor.huawei.hardware.ai@3.0::IAiModelMngr     | vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_allocMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, int, std::__1::function<void ()(int, android::hardware::hidl_memory const&)>)                                                                                                                                                                                                                                                                      |
| 16  |  21  | vendor.huawei.hardware.ai@3.0::IAiModelMngr     | vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_allocMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, int, std::__1::function<void ()(int, android::hardware::hidl_memory const&)>)                                                                                                                                                                                                                                                                      |
| 17  |  12  | vendor.huawei.hardware.ai@1.1::IAiModelMngr     | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_runModel2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec\<android::hardware::hidl_handle> const&, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, android::hardware::hidl_vec\<android::hardware::hidl_handle> const&, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, unsigned int, android::hardware::hidl_string const&) |
| 18  |  21  | vendor.huawei.hardware.ai@3.0::IAiModelMngr     | vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_allocMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, int, std::__1::function<void ()(int, android::hardware::hidl_memory const&)>)                                                                                                                                                                                                                                                                      |
| 19  |  21  | vendor.huawei.hardware.ai@3.0::IAiModelMngr     | vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_allocMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, int, std::__1::function<void ()(int, android::hardware::hidl_memory const&)>)                                                                                                                                                                                                                                                                      |
| 20  |  22  | vendor.huawei.hardware.ai@3.0::IAiModelMngr     | vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_freeMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, android::hardware::hidl_memory const&)                                                                                                                                                                                                                                                                                                              |
| 21  |  22  | vendor.huawei.hardware.ai@3.0::IAiModelMngr     | vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_freeMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, android::hardware::hidl_memory const&)                                                                                                                                                                                                                                                                                                              |
| 22  |  22  | vendor.huawei.hardware.ai@3.0::IAiModelMngr     | vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_freeMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, android::hardware::hidl_memory const&)                                                                                                                                                                                                                                                                                                              |
| 23  |  22  | vendor.huawei.hardware.ai@3.0::IAiModelMngr     | vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_freeMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, android::hardware::hidl_memory const&)                                                                                                                                                                                                                                                                                                              |

related files:

```
vendor/lib64/vendor.huawei.hardware.ai@1.0.so
vendor/lib64/vendor.huawei.hardware.ai@1.1.so
vendor/lib64/vendor.huawei.hardware.ai@1.3.so
vendor/lib64/vendor.huawei.hardware.ai@3.0.so
```

method info from script `AnalysisInterface.idc`

```
----vendor/lib64/vendor.huawei.hardware.ai@1.0.so
F: 0x5F98C - 0x5FC24: vendor::huawei::hardware::ai::V1_0::BpHwAiEngineService::_hidl_removeAiModelMngr(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *)
C: 0x5FA04 -> 0xA82F0: android::hardware::Parcel::writeInterfaceToken(char const*)
T: Transaction code at 0x5FA34: 12

----vendor/lib64/vendor.huawei.hardware.ai@1.1.so
F: 0x68738 - 0x68A08: vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_registerInstance(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, bool)
C: 0x687BC -> 0x72500: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x687D0 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x687E4 -> 0x72F80: android::hardware::Parcel::writeBool(bool)
T: Transaction code at 0x68814: 8

F: 0x69028 - 0x69398: vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_startModelFromMem2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::ModelBuffer> const&)
C: 0x690B0 -> 0x72500: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x690C4 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x690D8 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x690F4 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x69120 -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
G: *** Vendor's implementation, shall verify the below result ***:
	 0x69150 -> 0x73670: vendor::huawei::hardware::ai::V1_0::writeEmbeddedToParcel(vendor::huawei::hardware::ai::V1_0::ModelBuffer const&, android::hardware::Parcel *, unsigned long, unsigned long)
T: Transaction code at 0x69190: 11

F: 0x6A278 - 0x6A5FC: vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_getModelTensor(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_string const&, std::__1::function<void ()(android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&)>)
C: 0x6A30C -> 0x72500: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x6A320 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x6A334 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x6A350 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x6A36C -> 0x73690: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_string const&, android::hardware::Parcel *, unsigned long, unsigned long)
T: Transaction code at 0x6A39C: 16

F: 0x6986C - 0x69B3C: vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_stopModel2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int)
C: 0x698F0 -> 0x72500: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x69904 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x69918 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
T: Transaction code at 0x69948: 13

F: 0x68A08 - 0x68CB8: vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_unregisterInstance(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int)
C: 0x68A84 -> 0x72500: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x68A98 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
T: Transaction code at 0x68AC8: 9

F: 0x68738 - 0x68A08: vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_registerInstance(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, bool)
C: 0x687BC -> 0x72500: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x687D0 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x687E4 -> 0x72F80: android::hardware::Parcel::writeBool(bool)
T: Transaction code at 0x68814: 8

F: 0x69398 - 0x6986C: vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_runModel2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec<android::hardware::hidl_handle> const&, android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, android::hardware::hidl_vec<android::hardware::hidl_handle> const&, android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, unsigned int, android::hardware::hidl_string const&)
C: 0x6942C -> 0x72500: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x69440 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x69454 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x69470 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x69498 -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x694C8 -> 0x733E0: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_handle const&, android::hardware::Parcel *, unsigned long, unsigned long)
C: 0x694F4 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x6951C -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x69538 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x69560 -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x69590 -> 0x733E0: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_handle const&, android::hardware::Parcel *, unsigned long, unsigned long)
C: 0x695BC -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x695E4 -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x695F8 -> 0x73680: android::hardware::Parcel::writeUint32(unsigned int)
C: 0x69618 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x69634 -> 0x73690: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_string const&, android::hardware::Parcel *, unsigned long, unsigned long)
T: Transaction code at 0x69664: 12

----vendor/lib64/vendor.huawei.hardware.ai@1.3.so
F: 0x16B3C - 0x16FE0: vendor::huawei::hardware::ai::V1_3::BpHwAiEngineService::_hidl_createAiModelMngr_1_3(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::sp<vendor::huawei::hardware::ai::V1_0::IAiMMListenerProxy> const&, android::sp<vendor::huawei::hardware::ai::V1_3::IAiMMMemAllocatorProxy> const&, unsigned int)
C: 0x16BC8 -> 0x27590: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x16C04 -> 0x275A0: android::hardware::Parcel::writeStrongBinder(android::sp<android::hardware::IBinder> const&)
C: 0x16C5C -> 0x275A0: android::hardware::Parcel::writeStrongBinder(android::sp<android::hardware::IBinder> const&)
C: 0x16C8C -> 0x275B0: android::hardware::Parcel::writeUint32(unsigned int)
T: Transaction code at 0x16CE8: 25

----vendor/lib64/vendor.huawei.hardware.ai@3.0.so
F: 0x10C64 - 0x10FB0: vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_allocMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, int, std::__1::function<void ()(int, android::hardware::hidl_memory const&)>)
C: 0x10CF8 -> 0x193B0: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x10D0C -> 0x193C0: android::hardware::Parcel::writeInt32(int)
C: 0x10D28 -> 0x193D0: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x10D44 -> 0x193E0: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_string const&, android::hardware::Parcel *, unsigned long, unsigned long)
C: 0x10D58 -> 0x193C0: android::hardware::Parcel::writeInt32(int)
T: Transaction code at 0x10D88: 21

F: 0x10FB0 - 0x112E0: vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_freeMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, android::hardware::hidl_memory const&)
C: 0x11038 -> 0x193B0: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x1104C -> 0x193C0: android::hardware::Parcel::writeInt32(int)
C: 0x11068 -> 0x193D0: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x11084 -> 0x193E0: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_string const&, android::hardware::Parcel *, unsigned long, unsigned long)
C: 0x110A0 -> 0x193D0: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x110BC -> 0x194C0: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_memory const&, android::hardware::Parcel *, unsigned long, unsigned long)
T: Transaction code at 0x110EC: 22
```

Choose the target method: _hidl_runModel2

```
F: 0x69398 - 0x6986C: vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_runModel2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec<android::hardware::hidl_handle> const&, android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, android::hardware::hidl_vec<android::hardware::hidl_handle> const&, android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, unsigned int, android::hardware::hidl_string const&)
C: 0x6942C -> 0x72500: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x69440 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x69454 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x69470 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x69498 -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x694C8 -> 0x733E0: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_handle const&, android::hardware::Parcel *, unsigned long, unsigned long)
C: 0x694F4 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x6951C -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x69538 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x69560 -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x69590 -> 0x733E0: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_handle const&, android::hardware::Parcel *, unsigned long, unsigned long)
C: 0x695BC -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x695E4 -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x695F8 -> 0x73680: android::hardware::Parcel::writeUint32(unsigned int)
C: 0x69618 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x69634 -> 0x73690: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_string const&, android::hardware::Parcel *, unsigned long, unsigned long)
T: Transaction code at 0x69664: 12
```

### 2 Parse Params

interface_token: vendor.huawei.hardware.ai@1.1::IAiModelMngr, method_code: 12

```
|--[Parcel] [mData] interface_token: vendor.huawei.hardware.ai@1.1::IAiModelMngr, method_code: 12
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
737d94e700  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
737d94e710  72 64 77 61 72 65 2e 61 69 40 31 2e 31 3a 3a 49  rdware.ai@1.1::I
737d94e720  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
737d94e730  07 00 00 00 85 2a 74 70 00 00 00 00 38 98 b5 d0  .....*tp....8...
737d94e740  7f 00 00 00 10 00 00 00 00 00 00 00 00 00 00 00  ................
737d94e750  00 00 00 00 00 00 00 00 00 00 00 00 85 2a 74 70  .............*tp
737d94e760  01 00 00 00 68 87 e1 94 73 00 00 00 10 00 00 00  ....h...s.......
737d94e770  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
737d94e780  00 00 00 00 24 00 00 00 00 00 00 00 85 2a 74 70  ....$........*tp
737d94e790  01 00 00 00 d0 88 5d f9 73 00 00 00 24 00 00 00  ......].s...$...
737d94e7a0  00 00 00 00 01 00 00 00 00 00 00 00 00 00 00 00  ................
737d94e7b0  00 00 00 00 85 61 64 66 00 00 00 00 01 00 00 00  .....adf........
737d94e7c0  00 00 00 00 02 00 00 00 00 00 00 00 0c 00 00 00  ................
737d94e7d0  00 00 00 00 85 2a 74 70 00 00 00 00 28 98 b5 d0  .....*tp....(...
737d94e7e0  7f 00 00 00 10 00 00 00 00 00 00 00 00 00 00 00  ................
737d94e7f0  00 00 00 00 00 00 00 00 00 00 00 00 85 2a 74 70  .............*tp
737d94e800  01 00 00 00 90 cc 98 7d 73 00 00 00 10 00 00 00  .......}s.......
737d94e810  00 00 00 00 04 00 00 00 00 00 00 00 00 00 00 00  ................
737d94e820  00 00 00 00 85 2a 74 70 00 00 00 00 18 98 b5 d0  .....*tp........
737d94e830  7f 00 00 00 10 00 00 00 00 00 00 00 00 00 00 00  ................
737d94e840  00 00 00 00 00 00 00 00 00 00 00 00 85 2a 74 70  .............*tp
737d94e850  01 00 00 00 88 87 e1 94 73 00 00 00 10 00 00 00  ........s.......
737d94e860  00 00 00 00 06 00 00 00 00 00 00 00 00 00 00 00  ................
737d94e870  00 00 00 00 24 00 00 00 00 00 00 00 85 2a 74 70  ....$........*tp
737d94e880  01 00 00 00 00 89 5d f9 73 00 00 00 24 00 00 00  ......].s...$...
737d94e890  00 00 00 00 07 00 00 00 00 00 00 00 00 00 00 00  ................
737d94e8a0  00 00 00 00 85 61 64 66 00 00 00 00 01 00 00 00  .....adf........
737d94e8b0  00 00 00 00 08 00 00 00 00 00 00 00 0c 00 00 00  ................
737d94e8c0  00 00 00 00 85 2a 74 70 00 00 00 00 08 98 b5 d0  .....*tp........
737d94e8d0  7f 00 00 00 10 00 00 00 00 00 00 00 00 00 00 00  ................
737d94e8e0  00 00 00 00 00 00 00 00 00 00 00 00 85 2a 74 70  .............*tp
737d94e8f0  01 00 00 00 a0 cc 98 7d 73 00 00 00 10 00 00 00  .......}s.......
737d94e900  00 00 00 00 0a 00 00 00 00 00 00 00 00 00 00 00  ................
737d94e910  00 00 00 00 d0 07 00 00 85 2a 74 70 00 00 00 00  .........*tp....
737d94e920  f8 97 b5 d0 7f 00 00 00 10 00 00 00 00 00 00 00  ................
737d94e930  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
737d94e940  85 2a 74 70 01 00 00 00 a0 87 e1 94 73 00 00 00  .*tp........s...
737d94e950  1b 00 00 00 00 00 00 00 0c 00 00 00 00 00 00 00  ................
737d94e960  00 00 00 00 00 00 00 00                          ........
```

```
android::hardware::IInterface *, 
android::hardware::details::HidlInstrumentor *, 
int, 
int, 
android::hardware::hidl_vec<android::hardware::hidl_handle> const&, 
android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, 
android::hardware::hidl_vec<android::hardware::hidl_handle> const&, 
android::hardware::hidl_vec<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, 
unsigned int, 
android::hardware::hidl_string const&



C: 0x6942C -> 0x72500: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x69440 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x69454 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x69470 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x69498 -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x694C8 -> 0x733E0: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_handle const&, android::hardware::Parcel *, unsigned long, unsigned long)
C: 0x694F4 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x6951C -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x69538 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x69560 -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x69590 -> 0x733E0: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_handle const&, android::hardware::Parcel *, unsigned long, unsigned long)
C: 0x695BC -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x695E4 -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x695F8 -> 0x73680: android::hardware::Parcel::writeUint32(unsigned int)
C: 0x69618 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x69634 -> 0x73690: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_string const&, android::hardware::Parcel *, unsigned long, unsigned long)

```


```
0                0x2c  0x30  0x34
|-----------------|-----|-----|-
| interface token | int | int |.

0x34       0x5c                    0x84                 0x8c          0xb4       0xd4
-|----------|-----------------------|--------------------|-------------|----------|-
.| hidl_vec | hidl_vec<hidl_handle> | native_handle_size | hidl_handle | fd_array |. 

0xd4       0xfc                          0x124 
-|----------|-----------------------------|-
.| hidl_vec | hidl_vec<TensorDescription> |. 

0x124     0x14c                    0x174                0x17c         0x1a4      0x1c4
-|---------|------------------------|--------------------|-------------|----------|-
.| hidl_vec | hidl_vec<hidl_handle> | native_handle_size | hidl_handle | fd_array |. 

0x1c4      0x1ec                         0x214 
-|----------|-----------------------------|-
.| hidl_vec | hidl_vec<TensorDescription> |. 

0x214 0x218              0x240         0x268
-|-----|------------------|-------------|
.| int | hidl_string addr | hidl_string |  
```

### 4 Fuzz

