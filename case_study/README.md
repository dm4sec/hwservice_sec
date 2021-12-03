# Design
By observing, I find it's a case to case fuzzing for `binder object` of a specific service.

##1. `huaweiAI` is used to fuzz [huawei ai service](https://developer.huawei.com/consumer/cn/doc/overview/HUAWEI_HiAI).
A. Use the [Frida Gadget](https://frida.re/docs/gadget/) to process the `Demo_Source_Code`. \
B. Distill `vendor.huawei.hardware.ai@` from device. 
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
Then use [idc_scirpt](https://github.com/dm4sec/hwservice_sec/idc_script) to parse these binaries.
```
F: 0x6AB9C - 0x6AEA8: vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_checkModelCompatibility(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, vendor::huawei::hardware::ai::V1_0::ModelBuffer const&)
C: 0x6AC24 -> 0x72500: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x6AC38 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x6AC4C -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x6AC68 -> 0x72F90: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
G: *** Vendor's implementation, shall verify the below result ***: 0x6AC84 -> 0x73670: vendor::huawei::hardware::ai::V1_0::writeEmbeddedToParcel(vendor::huawei::hardware::ai::V1_0::ModelBuffer const&, android::hardware::Parcel *, unsigned long, unsigned long)
T: Transaction code at 0x6ACB4: 19

F: 0x16B3C - 0x16FE0: vendor::huawei::hardware::ai::V1_3::BpHwAiEngineService::_hidl_createAiModelMngr_1_3(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::sp<vendor::huawei::hardware::ai::V1_0::IAiMMListenerProxy> const&, android::sp<vendor::huawei::hardware::ai::V1_3::IAiMMMemAllocatorProxy> const&, unsigned int)
C: 0x16BC8 -> 0x27590: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x16C04 -> 0x275A0: android::hardware::Parcel::writeStrongBinder(android::sp<android::hardware::IBinder> const&)
C: 0x16C5C -> 0x275A0: android::hardware::Parcel::writeStrongBinder(android::sp<android::hardware::IBinder> const&)
C: 0x16C8C -> 0x275B0: android::hardware::Parcel::writeUint32(unsigned int)
T: Transaction code at 0x16CE8: 25
```

C. On startup, I find the following interface triggered.


| # | transaction code | interface | func | 
| ----| :----: | :----: | :----: |
| 1 | 25 | vendor.huawei.hardware.ai@1.3::IAiEngineService | vendor::huawei::hardware::ai::V1_3::BpHwAiEngineService::_hidl_createAiModelMngr_1_3(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::sp\<vendor::huawei::hardware::ai::V1_0::IAiMMListenerProxy> const&, android::sp\<vendor::huawei::hardware::ai::V1_3::IAiMMMemAllocatorProxy> const&, unsigned int)
| 2 | 19 | vendor.huawei.hardware.ai@1.1::IAiModelMngr | vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_checkModelCompatibility(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, vendor::huawei::hardware::ai::V1_0::ModelBuffer const&)



