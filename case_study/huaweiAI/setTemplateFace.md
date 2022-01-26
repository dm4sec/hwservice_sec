ML-body
人脸比对中调用的TransactionCode 和 InterfaceToken

1) 进入"人脸比对"
   Transact( 8, vendor.huawei.hardware.ai@1.1::IAiModelMngr
   Transact( 21, vendor.huawei.hardware.ai@3.0::IAiModelMngr
   Transact( 11, vendor.huawei.hardware.ai@1.1::IAiModelMngr
   Transact( 16, vendor.huawei.hardware.ai@1.1::IAiModelMngr
   Transact( 8, vendor.huawei.hardware.ai@1.1::IAiModelMngr
   Transact( 21, vendor.huawei.hardware.ai@3.0::IAiModelMngr
   Transact( 11, vendor.huawei.hardware.ai@1.1::IAiModelMngr
   Transact( 16, vendor.huawei.hardware.ai@1.1::IAiModelMngr

8, vendor.huawei.hardware.ai@1.1::IAiModelMngr
vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_registerInstance(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, bool)

21, vendor.huawei.hardware.ai@3.0::IAiModelMngr
vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_allocMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, int, std::__1::function<void ()(int, android::hardware::hidl_memory const&)>)

11, vendor.huawei.hardware.ai@1.1::IAiModelMngr
vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_startModelFromMem2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::ModelBuffer> const&)

16, vendor.huawei.hardware.ai@1.1::IAiModelMngr
vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_getModelTensor(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_string const&, std::__1::function<void ()(android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&)>)


目标: 11, vendor.huawei.hardware.ai@1.1::IAiModelMngr
F: 0x69028 - 0x69398: vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_startModelFromMem2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::ModelBuffer> const&)
C: 0x690B0 -> 0x72500: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x690C4 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x690D8 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x690F4 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x69120 -> 0x73150: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
G: *** Vendor's implementation, shall verify the below result ***: 0x69150 -> 0x73670: vendor::huawei::hardware::ai::V1_0::writeEmbeddedToParcel(vendor::huawei::hardware::ai::V1_0::ModelBuffer const&, android::hardware::Parcel *, unsigned long, unsigned long)
T: Transaction code at 0x69190: 11






*******************************************************************

2) 选择模板图片
    Transact( 22, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 21, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 21, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 21, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 22, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 21, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 21, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 12, vendor.huawei.hardware.ai@1.1::IAiModelMngr
    Transact( 22, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 22, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 22, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 21, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 21, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 21, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 21, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 22, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 22, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 22, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 21, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 12, vendor.huawei.hardware.ai@1.1::IAiModelMngr
    Transact( 22, vendor.huawei.hardware.ai@3.0::IAiModelMngr
    Transact( 22, vendor.huawei.hardware.ai@3.0::IAiModelMngr

22, vendor.huawei.hardware.ai@3.0::IAiModelMngr
vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_freeMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, android::hardware::hidl_memory const&)

21, vendor.huawei.hardware.ai@3.0::IAiModelMngr
vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_allocMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, int, std::__1::function<void ()(int, android::hardware::hidl_memory const&)>)

12, vendor.huawei.hardware.ai@1.1::IAiModelMngr
vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_runModel2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec\<android::hardware::hidl_handle> const&, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, android::hardware::hidl_vec\<android::hardware::hidl_handle> const&, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, unsigned int, android::hardware::hidl_string const&)

目标InterfaceToken: hidl_runModel2
F: 0x69398 - 0x6986C: vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_runModel2(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec\<android::hardware::hidl_handle> const&, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, android::hardware::hidl_vec\<android::hardware::hidl_handle> const&, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V1_0::TensorDescription> const&, unsigned int, android::hardware::hidl_string const&)
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








