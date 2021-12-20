
| # | transaction code | interface token | interface method | 
| ----| :----: | :----: | :---- |
| 1 | 2 | 	vendor.huawei.hardware.ai.hidlrequest@1.0::IHidlRequest| vendor::huawei::hardware::ai::hidlrequest::V1_0::BpHwHidlRequest::_hidl_bindDeathMonitor(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::sp\<vendor::huawei::hardware::ai::hidlrequest::V1_0::IDeathMonitor> const&) | 
| 2 | 1 | 	vendor.huawei.hardware.ai.hidlrequest@1.0::IHidlRequest| vendor::huawei::hardware::ai::hidlrequest::V1_0::BpHwHidlRequest::_hidl_execute(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec\<android::hardware::hidl_handle> const&, std::__1::function<void ()(int, android::hardware::hidl_vec\<android::hardware::hidl_handle> const&)>) | 
| 3 | 3 | 	vendor.huawei.hardware.ai.hidlrequest@1.0::IHidlRequest| vendor::huawei::hardware::ai::hidlrequest::V1_0::BpHwHidlRequest::_hidl_setListener(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_vec\<android::hardware::hidl_handle> const&, android::sp\<vendor::huawei::hardware::ai::hidlrequest::V1_0::IHidlListener> const&) | 
| 4 | 25 | 	vendor.huawei.hardware.ai@1.3::IAiEngineService| vendor::huawei::hardware::ai::V1_3::BpHwAiEngineService::_hidl_createAiModelMngr_1_3(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::sp\<vendor::huawei::hardware::ai::V1_0::IAiMMListenerProxy> const&, android::sp\<vendor::huawei::hardware::ai::V1_3::IAiMMMemAllocatorProxy> const&, unsigned int) | 
| 5 | 8 | 	vendor.huawei.hardware.ai@1.1::IAiModelMngr| vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_registerInstance(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, bool) | 
| 6 | 21 | 	vendor.huawei.hardware.ai@3.0::IAiModelMngr| vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_allocMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, int, std::__1::function<void ()(int, android::hardware::hidl_memory const&)>) | 
| 7 | 22 | 	vendor.huawei.hardware.ai@3.0::IAiModelMngr| vendor::huawei::hardware::ai::V3_0::BpHwAiModelMngr::_hidl_freeMemory(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_string const&, android::hardware::hidl_memory const&) | 

so files
```
vendor/lib64/vendor.huawei.hardware.ai.hidlrequest@1.0.so
vendor/lib64/vendor.huawei.hardware.ai@1.1.so
vendor/lib64/vendor.huawei.hardware.ai@1.3.so
vendor/lib64/vendor.huawei.hardware.ai@3.0.so
```

ida_script_out(AnalysisInterface.idc):
```
F: 0x13228 - 0x13618: vendor::huawei::hardware::ai::hidlrequest::V1_0::BpHwHidlRequest::_hidl_execute(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, int, android::hardware::hidl_vec<android::hardware::hidl_handle> const&, std::__1::function<void ()(int, android::hardware::hidl_vec<android::hardware::hidl_handle> const&)>)
C: 0x132BC -> 0x22030: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x132D0 -> 0x22040: android::hardware::Parcel::writeInt32(int)
C: 0x132E4 -> 0x22040: android::hardware::Parcel::writeInt32(int)
C: 0x13300 -> 0x22050: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x13328 -> 0x22060: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x13358 -> 0x22070: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_handle const&, android::hardware::Parcel *, unsigned long, unsigned long)
T: Transaction code at 0x13398: 1

F: 0x13618 - 0x13938: vendor::huawei::hardware::ai::hidlrequest::V1_0::BpHwHidlRequest::_hidl_bindDeathMonitor(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::sp<vendor::huawei::hardware::ai::hidlrequest::V1_0::IDeathMonitor> const&)
C: 0x13694 -> 0x22030: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x136D0 -> 0x22140: android::hardware::Parcel::writeStrongBinder(android::sp<android::hardware::IBinder> const&)
T: Transaction code at 0x13748: 2

F: 0x13938 - 0x13D14: vendor::huawei::hardware::ai::hidlrequest::V1_0::BpHwHidlRequest::_hidl_setListener(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_vec<android::hardware::hidl_handle> const&, android::sp<vendor::huawei::hardware::ai::hidlrequest::V1_0::IHidlListener> const&)
C: 0x139C0 -> 0x22030: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x139D4 -> 0x22040: android::hardware::Parcel::writeInt32(int)
C: 0x139F0 -> 0x22050: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
C: 0x13A18 -> 0x22060: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x13A48 -> 0x22070: android::hardware::writeEmbeddedToParcel(android::hardware::hidl_handle const&, android::hardware::Parcel *, unsigned long, unsigned long)
C: 0x13A9C -> 0x22140: android::hardware::Parcel::writeStrongBinder(android::sp<android::hardware::IBinder> const&)
T: Transaction code at 0x13B14: 3

F: 0x16B3C - 0x16FE0: vendor::huawei::hardware::ai::V1_3::BpHwAiEngineService::_hidl_createAiModelMngr_1_3(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::sp<vendor::huawei::hardware::ai::V1_0::IAiMMListenerProxy> const&, android::sp<vendor::huawei::hardware::ai::V1_3::IAiMMMemAllocatorProxy> const&, unsigned int)
C: 0x16BC8 -> 0x27590: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x16C04 -> 0x275A0: android::hardware::Parcel::writeStrongBinder(android::sp<android::hardware::IBinder> const&)
C: 0x16C5C -> 0x275A0: android::hardware::Parcel::writeStrongBinder(android::sp<android::hardware::IBinder> const&)
C: 0x16C8C -> 0x275B0: android::hardware::Parcel::writeUint32(unsigned int)
T: Transaction code at 0x16CE8: 25

F: 0x68738 - 0x68A08: vendor::huawei::hardware::ai::V1_1::BpHwAiModelMngr::_hidl_registerInstance(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, bool)
C: 0x687BC -> 0x72500: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x687D0 -> 0x72A90: android::hardware::Parcel::writeInt32(int)
C: 0x687E4 -> 0x72F80: android::hardware::Parcel::writeBool(bool)
T: Transaction code at 0x68814: 8

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



log
```
/usr/local/bin/python3.9 /Users/fy/Gitee/hwservice_sec/case_study/huaweiAI/ai_Stud.py
[i] Process(pid=1, name="init", parameters={})
[i] Process(pid=505, name="init", parameters={})
[i] Process(pid=506, name="ueventd", parameters={})
[i] Process(pid=525, name="logd", parameters={})
[i] Process(pid=526, name="servicemanager", parameters={})
[i] Process(pid=527, name="hwservicemanager", parameters={})
[i] Process(pid=528, name="vndbinder", parameters={})
[i] Process(pid=544, name="vold", parameters={})
[i] Process(pid=545, name="oeminfo_nvm_server", parameters={})
[i] Process(pid=613, name="android.hardware.atrace@1.0-service", parameters={})
[i] Process(pid=614, name="android.hardware.keymaster@3.0-service", parameters={})
[i] Process(pid=615, name="tee_auth_daemon", parameters={})
[i] Process(pid=616, name="teecd", parameters={})
[i] Process(pid=617, name="vendor.huawei.hardware.libteec@3.0-service", parameters={})
[i] Process(pid=619, name="bms_event", parameters={})
[i] Process(pid=622, name="powerct", parameters={})
[i] Process(pid=655, name="apexd", parameters={})
[i] Process(pid=701, name="samgr", parameters={})
[i] Process(pid=702, name="secserver", parameters={})
[i] Process(pid=716, name="netd", parameters={})
[i] Process(pid=717, name="zygote64", parameters={})
[i] Process(pid=718, name="zygote", parameters={})
[i] Process(pid=759, name="android.hidl.allocator@1.0-service", parameters={})
[i] Process(pid=760, name="android.system.suspend@1.0-service", parameters={})
[i] Process(pid=761, name="healthd", parameters={})
[i] Process(pid=762, name="activity_recognition_service", parameters={})
[i] Process(pid=763, name="android.hardware.cas@1.1-service", parameters={})
[i] Process(pid=764, name="android.hardware.configstore@1.1-service", parameters={})
[i] Process(pid=767, name="android.hardware.gatekeeper@1.0-service", parameters={})
[i] Process(pid=769, name="android.hardware.graphics.allocator@2.0-service", parameters={})
[i] Process(pid=770, name="android.hardware.graphics.composer@2.2-service", parameters={})
[i] Process(pid=771, name="android.hardware.health@2.0-service", parameters={})
[i] Process(pid=772, name="android.hardware.memtrack@1.0-service", parameters={})
[i] Process(pid=774, name="android.hardware.power.stats@1.0-service.mock", parameters={})
[i] Process(pid=775, name="android.hardware.secure_element@1.0-service", parameters={})
[i] Process(pid=776, name="android.hardware.thermal@2.0-service-hisi", parameters={})
[i] Process(pid=778, name="vendor.huawei.hardware.graphics.hwcinterface@1.1-service", parameters={})
[i] Process(pid=779, name="vendor.huawei.hardware.audio@5.0-service", parameters={})
[i] Process(pid=780, name="vendor.huawei.hardware.gnss@2.0-service", parameters={})
[i] Process(pid=782, name="vendor.huawei.hardware.graphics.mediacomm@2.1-service", parameters={})
[i] Process(pid=783, name="vendor.huawei.hardware.hivrar@2.1-service", parameters={})
[i] Process(pid=784, name="vendor.huawei.hardware.hwdisplay.displayengine@1.2-service", parameters={})
[i] Process(pid=785, name="vendor.huawei.hardware.hwdisplay@1.1-service", parameters={})
[i] Process(pid=787, name="vendor.huawei.hardware.hwfactoryinterface@1.1-service", parameters={})
[i] Process(pid=788, name="vendor.huawei.hardware.hwhiview@1.1-service", parameters={})
[i] Process(pid=789, name="vendor.huawei.hardware.hwsched@1.0-service", parameters={})
[i] Process(pid=792, name="vendor.huawei.hardware.hwsecurity-service", parameters={})
[i] Process(pid=793, name="vendor.huawei.hardware.hwvibrator@1.1-service", parameters={})
[i] Process(pid=794, name="vendor.huawei.hardware.iawareperf@1.0-service", parameters={})
[i] Process(pid=795, name="vendor.huawei.hardware.jpegdec@1.0-service", parameters={})
[i] Process(pid=796, name="vendor.huawei.hardware.light@2.0-service", parameters={})
[i] Process(pid=799, name="vendor.huawei.hardware.motion@1.0-service", parameters={})
[i] Process(pid=802, name="vendor.huawei.hardware.perfgenius@2.0-service", parameters={})
[i] Process(pid=803, name="vendor.huawei.hardware.power@1.0-service", parameters={})
[i] Process(pid=804, name="vendor.huawei.hardware.tp@1.0-service", parameters={})
[i] Process(pid=805, name="ashmemd", parameters={})
[i] Process(pid=806, name="audioserver", parameters={})
[i] Process(pid=807, name="displayservice", parameters={})
[i] Process(pid=808, name="gpuservice", parameters={})
[i] Process(pid=809, name="lmkd", parameters={})
[i] Process(pid=810, name="surfaceflinger", parameters={})
[i] Process(pid=813, name="powerlogd", parameters={})
[i] Process(pid=895, name="hivrarserver", parameters={})
[i] Process(pid=901, name="hsensors", parameters={})
[i] Process(pid=902, name="netmanager", parameters={})
[i] Process(pid=903, name="accountmgr", parameters={})
[i] Process(pid=904, name="audio_sa", parameters={})
[i] Process(pid=905, name="bluetoothservic", parameters={})
[i] Process(pid=906, name="distributedsche", parameters={})
[i] Process(pid=907, name="locationhub", parameters={})
[i] Process(pid=908, name="nfcservice", parameters={})
[i] Process(pid=909, name="resschedd", parameters={})
[i] Process(pid=910, name="telephony", parameters={})
[i] Process(pid=911, name="wifiservice", parameters={})
[i] Process(pid=912, name="aptouch_daemon", parameters={})
[i] Process(pid=995, name="bsoh", parameters={})
[i] Process(pid=998, name="hisecd", parameters={})
[i] Process(pid=1013, name="log", parameters={})
[i] Process(pid=1102, name="emcomd", parameters={})
[i] Process(pid=1104, name="rild", parameters={})
[i] Process(pid=1106, name="bastetd", parameters={})
[i] Process(pid=1107, name="vendor.huawei.hardware.biometrics.hwfacerecognize@1.1-service", parameters={})
[i] Process(pid=1110, name="AGPService", parameters={})
[i] Process(pid=1113, name="cameraserver", parameters={})
[i] Process(pid=1114, name="displayengineserver", parameters={})
[i] Process(pid=1115, name="drmserver", parameters={})
[i] Process(pid=1116, name="dubaid", parameters={})
[i] Process(pid=1117, name="iGraphicsservice", parameters={})
[i] Process(pid=1120, name="incidentd", parameters={})
[i] Process(pid=1121, name="installd", parameters={})
[i] Process(pid=1123, name="keystore", parameters={})
[i] Process(pid=1124, name="mediadrmserver", parameters={})
[i] Process(pid=1125, name="media.extractor", parameters={})
[i] Process(pid=1126, name="media.metrics", parameters={})
[i] Process(pid=1127, name="mediaserver", parameters={})
[i] Process(pid=1128, name="statsd", parameters={})
[i] Process(pid=1129, name="storaged", parameters={})
[i] Process(pid=1130, name="thermal-daemon", parameters={})
[i] Process(pid=1131, name="CameraDaemon", parameters={})
[i] Process(pid=1136, name="android.hardware.media.omx@1.0-service", parameters={})
[i] Process(pid=1139, name="hwpged", parameters={})
[i] Process(pid=1140, name="vendor.huawei.hardware.sensors@1.2-service", parameters={})
[i] Process(pid=1145, name="mediaswcodec", parameters={})
[i] Process(pid=1155, name="unrmd", parameters={})
[i] Process(pid=1163, name="gatekeeper", parameters={})
[i] Process(pid=1167, name="hiview", parameters={})
[i] Process(pid=1168, name="tombstoned", parameters={})
[i] Process(pid=1171, name="hinetmanager", parameters={})
[i] Process(pid=1174, name="fusion_daemon", parameters={})
[i] Process(pid=1187, name="vendor.huawei.hardware.wifi@1.2-service", parameters={})
[i] Process(pid=1666, name="system_server", parameters={})
[i] Process(pid=1933, name="octty", parameters={})
[i] Process(pid=1934, name="oam_hisi", parameters={})
[i] Process(pid=1935, name="hignss_1103", parameters={})
[i] Process(pid=2046, name="wificond", parameters={})
[i] Process(pid=2076, name="android.hardware.usb@1.0-service", parameters={})
[i] Process(pid=2179, name="设置", parameters={})
[i] Process(pid=2180, name="com.android.systemui", parameters={})
[i] Process(pid=2183, name="com.huawei.systemserver", parameters={})
[i] Process(pid=2184, name="com.huawei.hwid.core", parameters={})
[i] Process(pid=2196, name="com.baidu.input_huawei", parameters={})
[i] Process(pid=2257, name="com.huawei.harmonyos.foundation", parameters={})
[i] Process(pid=2264, name="com.huawei.HwOPServer", parameters={})
[i] Process(pid=2269, name="com.huawei.hiview", parameters={})
[i] Process(pid=2367, name="com.huawei.nearby", parameters={})
[i] Process(pid=2386, name="com.huawei.securityserver", parameters={})
[i] Process(pid=2389, name="com.huawei.iaware", parameters={})
[i] Process(pid=2436, name="SIM 卡应用", parameters={})
[i] Process(pid=2447, name="com.huawei.android.launcher", parameters={})
[i] Process(pid=2459, name="com.huawei.hwid.container1", parameters={})
[i] Process(pid=2500, name="手机管家", parameters={})
[i] Process(pid=2505, name="com.huawei.hwid.persistent", parameters={})
[i] Process(pid=2763, name="天气", parameters={})
[i] Process(pid=2870, name="hilogd", parameters={})
[i] Process(pid=3105, name="com.huawei.intelligent:intelligentService", parameters={})
[i] Process(pid=3107, name="日历", parameters={})
[i] Process(pid=3730, name="distributedfiledaemon", parameters={})
[i] Process(pid=3752, name="adbd", parameters={})
[i] Process(pid=3803, name="智慧语音", parameters={})
[i] Process(pid=3815, name="com.huawei.hiaction", parameters={})
[i] Process(pid=4026, name="com.huawei.pengine", parameters={})
[i] Process(pid=4028, name="com.huawei.hitouch", parameters={})
[i] Process(pid=4030, name="com.android.providers.calendar", parameters={})
[i] Process(pid=4250, name="备忘录", parameters={})
[i] Process(pid=4266, name="com.android.permissioncontroller", parameters={})
[i] Process(pid=4271, name="com.huawei.hiai", parameters={})
[i] Process(pid=4281, name="com.huawei.hiai.engineservice", parameters={})
[i] Process(pid=4464, name="com.huawei.profile", parameters={})
[i] Process(pid=4695, name="ML Vision", parameters={})
[i] Process(pid=4696, name="usap64", parameters={})
[i] Process(pid=4699, name="usap64", parameters={})
[i] Process(pid=4971, name="usap64", parameters={})
[i] Process(pid=4976, name="usap64", parameters={})
[i] Process(pid=4978, name="usap64", parameters={})
[i] Process(pid=5042, name="usap32", parameters={})
[i] Process(pid=5046, name="usap32", parameters={})
[i] Process(pid=5055, name="usap32", parameters={})
[i] Process(pid=5834, name="运动健康", parameters={})
[i] Process(pid=5843, name="sh", parameters={})
[i] Process(pid=5878, name="com.huawei.android.pushagent.PushService", parameters={})
[i] Process(pid=6913, name="modemchr", parameters={})
[i] Process(pid=8829, name="com.huawei.recsys", parameters={})
[i] Process(pid=9656, name="vendor.huawei.hardware.hwfs@1.0-service", parameters={})
[i] Process(pid=10286, name="com.huawei.hwid.container2", parameters={})
[i] Process(pid=18465, name="hiaiserver", parameters={})
[i] Process(pid=18632, name="图库", parameters={})
[i] Process(pid=18913, name="android.process.media", parameters={})
[i] Process(pid=19890, name="com.android.bluetooth", parameters={})
[i] Process(pid=20592, name="android.hardware.bluetooth@1.1-service", parameters={})
[i] Process(pid=21327, name="com.android.gallery3d:vision", parameters={})
[i] Process(pid=21763, name="usb_port", parameters={})
[i] Process(pid=21765, name="bms_soc", parameters={})
[i] Process(pid=21766, name="chargelogcat-c", parameters={})
[i] Process(pid=21767, name="bms_auth", parameters={})
[i] Process(pid=21768, name="bms_protocol", parameters={})
[i] Process(pid=21769, name="bms_behavior", parameters={})
[i] Process(pid=23003, name="com.huawei.videoeditor", parameters={})
[i] Process(pid=26188, name="usap32", parameters={})
[i] Process(pid=26202, name="usap32", parameters={})
[i] Process(pid=26203, name="usap32", parameters={})
[i] Process(pid=27308, name="com.huawei.lbs", parameters={})
[i] Process(pid=32462, name="com.huawei.intelligent", parameters={})
[i] Process(pid=4695, name="Gadget", parameters={})
[*] Frida js is running.
/system/lib64/libcutils.so
/system/lib64/libc++.so
/apex/com.android.runtime/lib64/bionic/libc.so
/system/lib64/libcrypto.so
/system/lib64/libcamera_client.so
/system/lib64/libcamera_metadata.so
/system/lib64/libc_secshared.so
/system/lib64/libcgrouprc.so
/system/lib64/libcamera2ndk.so
/apex/com.android.conscrypt/lib64/libcrypto.so
/apex/com.android.conscrypt/lib64/libc++.so
/system/lib64/vndk-sp-29/libcutils.so
/system/lib64/vndk-sp-29/libc++.so
/vendor/lib64/libc_secshared.so
/system/lib64/libcompiler_rt.so
[i] BpHwBinder::transact addr: 0x74d8a54fd8
[i] IPCThreadState::transact addr: 0x74d8a59914
[i] IPCThreadState::self addr: 0x74d8a5749c
[i] Vendor BpHwBinder::transact addr: 0x743c18ff8c
[i] Vendor IPCThreadState::transact addr: 0x743c1948c8
[i] Vendor IPCThreadState::self addr: 0x743c192450
foo
[*] onEnter: BpHwBinder::transact
[*] onLeave: BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: BpHwBinder::transact
[*] onLeave: BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: BpHwBinder::transact
[*] onLeave: BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: BpHwBinder::transact
[*] onLeave: BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: BpHwBinder::transact
[*] onLeave: BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: BpHwBinder::transact
[*] onLeave: BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: BpHwBinder::transact
[*] onLeave: BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: BpHwBinder::transact
[*] onLeave: BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d75c vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest22_hidl_bindDeathMonitorEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorERKNS6_2spINS4_13IDeathMonitorEEE+0x144
0x73cccd7968 libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest10GetServiceEv+0x40c
0x73cccd7f60 libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x60
0x73bc36deb8 libmlkit-segmentation.so!0x550eb8
0x73bc36deb8 libmlkit-segmentation.so!0x550eb8

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 2
|-[i] 3rd argument, Parcel addr: 0x7fdb26da68
|--[i] mDataSize: 0x50
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9d54e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de9d54f0  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73de9d5500  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73de9d5510  52 65 71 75 65 73 74 00 85 2a 62 73 00 09 00 00  Request..*bs....
73de9d5520  e0 01 52 de 73 00 00 00 a0 2b dd 57 74 00 00 00  ..R.s....+.Wt...
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9d54e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de9d54f0  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73de9d5500  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73de9d5510  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x1
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5203c0  38 00 00 00 00 00 00 00                          8.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d3ac vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest13_hidl_executeEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorEiiRKNS7_8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSH_EEE+0x184
0x73ccd1ddb8 vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest7executeEiiRKN7android8hardware8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSC_EEE+0xa4
0x73cccd807c libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x17c
0x73bc36deb8 libmlkit-segmentation.so!0x550eb8
0x73bc36deb8 libmlkit-segmentation.so!0x550eb8

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 1
|-[i] 3rd argument, Parcel addr: 0x7fdb26da80
|--[i] mDataSize: 0x90
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73debf25e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73debf25f0  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73debf2600  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73debf2610  52 65 71 75 65 73 74 00 00 00 00 00 0b 00 00 00  Request.........
73debf2620  85 2a 74 70 00 00 00 00 80 dc 26 db 7f 00 00 00  .*tp......&.....
73debf2630  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73debf2640  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73debf2650  f0 4d 9f de 73 00 00 00 00 00 00 00 00 00 00 00  .M..s...........
73debf2660  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73debf25e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73debf25f0  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73debf2600  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73debf2610  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de520420  40 00 00 00 00 00 00 00 68 00 00 00 00 00 00 00  @.......h.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1db28 vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest17_hidl_setListenerEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorEiRKNS7_8hidl_vecINS7_11hidl_handleEEERKNS6_2spINS4_13IHidlListenerEEE+0x1f0
0x73cccd8530 libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest11SetListenerEiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERKN7android2spIN6vendor6huawei8hardware2ai11hidlrequest4V1_013IHidlListenerEEE+0x150
0x73cccd9910 libai_hidl_request_client.so!_ZN4hiai11HidlRequest11SetListenerEiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERKNS1_10shared_ptrINS3_12IRPCListenerEEE+0x12c
0x73bc36dfa8 libmlkit-segmentation.so!0x550fa8
0x73bc36dfa8 libmlkit-segmentation.so!0x550fa8

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 3
|-[i] 3rd argument, Parcel addr: 0x7fdb26daf8
|--[i] mDataSize: 0xa4
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de713600  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de713610  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73de713620  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73de713630  52 65 71 75 65 73 74 00 00 00 00 00 85 2a 74 70  Request......*tp
73de713640  00 00 00 00 58 dc 26 db 7f 00 00 00 10 00 00 00  ....X.&.........
73de713650  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73de713660  00 00 00 00 85 2a 74 70 01 00 00 00 f8 4d 9f de  .....*tp.....M..
73de713670  73 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  s...............
73de713680  00 00 00 00 00 00 00 00 00 00 00 00 85 2a 62 73  .............*bs
73de713690  00 09 00 00 c0 bd 03 4f 74 00 00 00 80 26 bf de  .......Ot....&..
73de7136a0  73 00 00 00                                      s...
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de713600  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de713610  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73de713620  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73de713630  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x3
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de520500  3c 00 00 00 00 00 00 00 64 00 00 00 00 00 00 00  <.......d.......
73de520510  8c 00 00 00 00 00 00 00                          ........
|----[i] buffer: 0x61682e6965776175
|----[i] buffer content: 
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d3ac vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest13_hidl_executeEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorEiiRKNS7_8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSH_EEE+0x184
0x73ccd1ddb8 vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest7executeEiiRKN7android8hardware8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSC_EEE+0xa4
0x73cccd807c libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x17c
0x73bc36e1bc libmlkit-segmentation.so!0x5511bc
0x73bc36e1bc libmlkit-segmentation.so!0x5511bc

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 1
|-[i] 3rd argument, Parcel addr: 0x7fdb26da10
|--[i] mDataSize: 0x90
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73debf25e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73debf25f0  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73debf2600  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73debf2610  52 65 71 75 65 73 74 00 00 00 00 00 1f 00 00 00  Request.........
73debf2620  85 2a 74 70 00 00 00 00 10 dc 26 db 7f 00 00 00  .*tp......&.....
73debf2630  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73debf2640  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73debf2650  f8 4d 9f de 73 00 00 00 00 00 00 00 00 00 00 00  .M..s...........
73debf2660  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73debf25e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73debf25f0  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73debf2600  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73debf2610  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de520500  40 00 00 00 00 00 00 00 68 00 00 00 00 00 00 00  @.......h.......
|----[i] buffer: 0x61682e6965776175
|----[i] buffer content: 
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73cfb9bcfc vendor.huawei.hardware.ai@1.3.so!_ZN6vendor6huawei8hardware2ai4V1_319BpHwAiEngineService27_hidl_createAiModelMngr_1_3EPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS2_4V1_018IAiMMListenerProxyEEERKNSC_INS3_22IAiMMMemAllocatorProxyEEEj+0x1c0
0x73f64d2da8 libai_client.so!0x48da8
0x73f64d23ac libai_client.so!0x483ac
0x73f64c71d8 libai_client.so!0x3d1d8
0x73f64cd324 libai_client.so!HIAI_ModelManager_create+0x3c
0x73bc379d3c libmlkit-segmentation.so!0x55cd3c
0x73bc379d3c libmlkit-segmentation.so!0x55cd3c

[i] 1st argument, this: 0x73debf25e0
[i] mHandle value: 0x2
|-[i] 2nd argument, transaction code: 25
|-[i] 3rd argument, Parcel addr: 0x7fdb26d788
|--[i] mDataSize: 0x64
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73debf2860  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73debf2870  72 64 77 61 72 65 2e 61 69 40 31 2e 33 3a 3a 49  rdware.ai@1.3::I
73debf2880  41 69 45 6e 67 69 6e 65 53 65 72 76 69 63 65 00  AiEngineService.
73debf2890  85 2a 62 73 00 09 00 00 a0 06 52 de 73 00 00 00  .*bs......R.s...
73debf28a0  20 27 bf de 73 00 00 00 85 2a 62 73 00 09 00 00   '..s....*bs....
73debf28b0  20 07 52 de 73 00 00 00 c0 27 bf de 73 00 00 00   .R.s....'..s...
73debf28c0  00 00 00 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73debf2860  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73debf2870  72 64 77 61 72 65 2e 61 69 40 31 2e 33 3a 3a 49  rdware.ai@1.3::I
73debf2880  41 69 45 6e 67 69 6e 65 53 65 72 76 69 63 65     AiEngineService
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5206e0  30 00 00 00 00 00 00 00 48 00 00 00 00 00 00 00  0.......H.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ee328828 vendor.huawei.hardware.ai@1.1.so!_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr22_hidl_registerInstanceEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEib+0xf0
0x73f64d3f9c libai_client.so!0x49f9c
0x73f64cd42c libai_client.so!HIAI_ModelManager_create+0x144
0x73bc379d3c libmlkit-segmentation.so!0x55cd3c
0x73bc379d3c libmlkit-segmentation.so!0x55cd3c

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 8
|-[i] 3rd argument, Parcel addr: 0x7fdb26d868
|--[i] mDataSize: 0x34
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9d2080  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de9d2090  72 64 77 61 72 65 2e 61 69 40 31 2e 31 3a 3a 49  rdware.ai@1.1::I
73de9d20a0  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73de9d20b0  01 00 00 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9d2080  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de9d2090  72 64 77 61 72 65 2e 61 69 40 31 2e 31 3a 3a 49  rdware.ai@1.1::I
73de9d20a0  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x0
|--[i] mObjects: 
           0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF

[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26d800
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73debf29a0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73debf29b0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73debf29c0  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73debf29d0  85 2a 74 70 00 00 00 00 f8 d9 26 db 7f 00 00 00  .*tp......&.....
73debf29e0  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73debf29f0  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73debf2a00  40 08 52 de 73 00 00 00 19 00 00 00 00 00 00 00  @.R.s...........
73debf2a10  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73debf2a20  08 00 00 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73debf29a0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73debf29b0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73debf29c0  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de520880  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d3ac vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest13_hidl_executeEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorEiiRKNS7_8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSH_EEE+0x184
0x73ccd1ddb8 vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest7executeEiiRKN7android8hardware8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSC_EEE+0xa4
0x73cccd807c libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x17c
0x73bc36e318 libmlkit-segmentation.so!0x551318
0x73bc36e318 libmlkit-segmentation.so!0x551318

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 1
|-[i] 3rd argument, Parcel addr: 0x7fdb26da10
|--[i] mDataSize: 0xe0
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
7457c6e280  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
7457c6e290  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
7457c6e2a0  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
7457c6e2b0  52 65 71 75 65 73 74 00 00 00 00 00 20 00 00 00  Request..... ...
7457c6e2c0  85 2a 74 70 00 00 00 00 10 dc 26 db 7f 00 00 00  .*tp......&.....
7457c6e2d0  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
7457c6e2e0  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
7457c6e2f0  48 08 52 de 73 00 00 00 10 00 00 00 00 00 00 00  H.R.s...........
7457c6e300  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
7457c6e310  24 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  $........*tp....
7457c6e320  20 8d 1d 4f 74 00 00 00 24 00 00 00 00 00 00 00   ..Ot...$.......
7457c6e330  01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
7457c6e340  85 61 64 66 00 00 00 00 01 00 00 00 00 00 00 00  .adf............
7457c6e350  02 00 00 00 00 00 00 00 0c 00 00 00 00 00 00 00  ................
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
7457c6e280  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
7457c6e290  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
7457c6e2a0  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
7457c6e2b0  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x4
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de560f80  40 00 00 00 00 00 00 00 68 00 00 00 00 00 00 00  @.......h.......
73de560f90  98 00 00 00 00 00 00 00 c0 00 00 00 00 00 00 00  ................
|----[i] buffer: 0x1
|----[i] buffer content: 
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc3760e4 libmlkit-segmentation.so!0x5590e4
0x73bc3760e4 libmlkit-segmentation.so!0x5590e4

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26cc90
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d17489a0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73d17489b0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73d17489c0  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73d17489d0  85 2a 74 70 00 00 00 00 88 ce 26 db 7f 00 00 00  .*tp......&.....
73d17489e0  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73d17489f0  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73d1748a00  a0 02 75 d1 73 00 00 00 19 00 00 00 00 00 00 00  ..u.s...........
73d1748a10  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73d1748a20  28 47 41 01                                      (GA.
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d17489a0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73d17489b0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73d17489c0  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d1750300  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
|----[i] buffer: 0x61682e6965776175
|----[i] buffer content: 
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d75c vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest22_hidl_bindDeathMonitorEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorERKNS6_2spINS4_13IDeathMonitorEEE+0x144
0x73cccd7968 libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest10GetServiceEv+0x40c
0x73cccd7f60 libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x60
0x73bc376e9c libmlkit-segmentation.so!0x559e9c
0x73bc376e9c libmlkit-segmentation.so!0x559e9c

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 2
|-[i] 3rd argument, Parcel addr: 0x7fdb26ce98
|--[i] mDataSize: 0x50
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9d55a0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de9d55b0  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73de9d55c0  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73de9d55d0  52 65 71 75 65 73 74 00 85 2a 62 73 00 09 00 00  Request..*bs....
73de9d55e0  00 03 75 d1 73 00 00 00 a0 89 74 d1 73 00 00 00  ..u.s.....t.s...
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9d55a0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de9d55b0  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73de9d55c0  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73de9d55d0  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x1
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d1755de0  38 00 00 00 00 00 00 00                          8.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d3ac vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest13_hidl_executeEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorEiiRKNS7_8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSH_EEE+0x184
0x73ccd1ddb8 vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest7executeEiiRKN7android8hardware8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSC_EEE+0xa4
0x73cccd807c libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x17c
0x73bc376e9c libmlkit-segmentation.so!0x559e9c
0x73bc376e9c libmlkit-segmentation.so!0x559e9c

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 1
|-[i] 3rd argument, Parcel addr: 0x7fdb26ceb0
|--[i] mDataSize: 0xe0
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
7457c71200  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
7457c71210  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
7457c71220  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
7457c71230  52 65 71 75 65 73 74 00 00 00 00 00 11 00 00 00  Request.........
7457c71240  85 2a 74 70 00 00 00 00 b0 d0 26 db 7f 00 00 00  .*tp......&.....
7457c71250  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
7457c71260  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
7457c71270  08 5e 75 d1 73 00 00 00 10 00 00 00 00 00 00 00  .^u.s...........
7457c71280  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
7457c71290  24 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  $........*tp....
7457c712a0  b0 4c 9f a1 73 00 00 00 24 00 00 00 00 00 00 00  .L..s...$.......
7457c712b0  01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
7457c712c0  85 61 64 66 00 00 00 00 01 00 00 00 00 00 00 00  .adf............
7457c712d0  02 00 00 00 00 00 00 00 0c 00 00 00 00 00 00 00  ................
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
7457c71200  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
7457c71210  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
7457c71220  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
7457c71230  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x4
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73a19f7800  40 00 00 00 00 00 00 00 68 00 00 00 00 00 00 00  @.......h.......
73a19f7810  98 00 00 00 00 00 00 00 c0 00 00 00 00 00 00 00  ................
|----[i] buffer: 0x1
|----[i] buffer content: 
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26cb90
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73f6df8f00  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73f6df8f10  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73f6df8f20  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73f6df8f30  85 2a 74 70 00 00 00 00 88 cd 26 db 7f 00 00 00  .*tp......&.....
73f6df8f40  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73f6df8f50  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73f6df8f60  00 4e 08 4f 74 00 00 00 19 00 00 00 00 00 00 00  .N.Ot...........
73f6df8f70  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73f6df8f80  fe 46 41 01                                      .FA.
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73f6df8f00  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73f6df8f10  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73f6df8f20  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5d7020  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26cb90
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73f6df8f00  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73f6df8f10  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73f6df8f20  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73f6df8f30  85 2a 74 70 00 00 00 00 88 cd 26 db 7f 00 00 00  .*tp......&.....
73f6df8f40  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73f6df8f50  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73f6df8f60  00 4e 08 4f 74 00 00 00 19 00 00 00 00 00 00 00  .N.Ot...........
73f6df8f70  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73f6df8f80  06 00 00 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73f6df8f00  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73f6df8f10  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73f6df8f20  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5d7020  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d75c vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest22_hidl_bindDeathMonitorEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorERKNS6_2spINS4_13IDeathMonitorEEE+0x144
0x73cccd7968 libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest10GetServiceEv+0x40c
0x73cccd7f60 libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x60
0x73bc378ab4 libmlkit-segmentation.so!0x55bab4
0x73bc378ab4 libmlkit-segmentation.so!0x55bab4

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 2
|-[i] 3rd argument, Parcel addr: 0x7fdb26cc28
|--[i] mDataSize: 0x50
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9d5540  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de9d5550  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73de9d5560  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73de9d5570  52 65 71 75 65 73 74 00 85 2a 62 73 00 09 00 00  Request..*bs....
73de9d5580  00 4e 08 4f 74 00 00 00 00 8f df f6 73 00 00 00  .N.Ot.......s...
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9d5540  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de9d5550  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73de9d5560  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73de9d5570  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x1
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5d7020  38 00 00 00 00 00 00 00                          8.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d3ac vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest13_hidl_executeEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorEiiRKNS7_8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSH_EEE+0x184
0x73ccd1ddb8 vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest7executeEiiRKN7android8hardware8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSC_EEE+0xa4
0x73cccd807c libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x17c
0x73bc378ab4 libmlkit-segmentation.so!0x55bab4
0x73bc378ab4 libmlkit-segmentation.so!0x55bab4

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 1
|-[i] 3rd argument, Parcel addr: 0x7fdb26cc40
|--[i] mDataSize: 0x130
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
74405d5800  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
74405d5810  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
74405d5820  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
74405d5830  52 65 71 75 65 73 74 00 00 00 00 00 10 00 00 00  Request.........
74405d5840  85 2a 74 70 00 00 00 00 40 ce 26 db 7f 00 00 00  .*tp....@.&.....
74405d5850  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
74405d5860  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
74405d5870  48 ed df f6 73 00 00 00 20 00 00 00 00 00 00 00  H...s... .......
74405d5880  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
74405d5890  24 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  $........*tp....
74405d58a0  a0 ed df f6 73 00 00 00 24 00 00 00 00 00 00 00  ....s...$.......
74405d58b0  01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
74405d58c0  85 61 64 66 00 00 00 00 01 00 00 00 00 00 00 00  .adf............
74405d58d0  02 00 00 00 00 00 00 00 0c 00 00 00 00 00 00 00  ................
74405d58e0  24 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  $........*tp....
74405d58f0  70 ed df f6 73 00 00 00 24 00 00 00 00 00 00 00  p...s...$.......
74405d5900  01 00 00 00 00 00 00 00 10 00 00 00 00 00 00 00  ................
74405d5910  85 61 64 66 00 00 00 00 01 00 00 00 00 00 00 00  .adf............
74405d5920  04 00 00 00 00 00 00 00 0c 00 00 00 00 00 00 00  ................
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
74405d5800  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
74405d5810  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
74405d5820  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
74405d5830  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x6
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d1f8f640  40 00 00 00 00 00 00 00 68 00 00 00 00 00 00 00  @.......h.......
73d1f8f650  98 00 00 00 00 00 00 00 c0 00 00 00 00 00 00 00  ................
73d1f8f660  e8 00 00 00 00 00 00 00 10 01 00 00 00 00 00 00  ................
|----[i] buffer: 0x1
|----[i] buffer content: 
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26d0b0
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73debf2ae0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73debf2af0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73debf2b00  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73debf2b10  85 2a 74 70 00 00 00 00 a8 d2 26 db 7f 00 00 00  .*tp......&.....
73debf2b20  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73debf2b30  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73debf2b40  80 06 52 de 73 00 00 00 19 00 00 00 00 00 00 00  ..R.s...........
73debf2b50  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73debf2b60  d1 4d 41 01                                      .MA.
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73debf2ae0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73debf2af0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73debf2b00  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5206c0  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26d0b0
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73debf2ae0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73debf2af0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73debf2b00  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73debf2b10  85 2a 74 70 00 00 00 00 a8 d2 26 db 7f 00 00 00  .*tp......&.....
73debf2b20  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73debf2b30  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73debf2b40  80 06 52 de 73 00 00 00 19 00 00 00 00 00 00 00  ..R.s...........
73debf2b50  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73debf2b60  06 00 00 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73debf2ae0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73debf2af0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73debf2b00  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5206c0  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26d0b0
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73debf2ae0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73debf2af0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73debf2b00  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73debf2b10  85 2a 74 70 00 00 00 00 a8 d2 26 db 7f 00 00 00  .*tp......&.....
73debf2b20  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73debf2b30  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73debf2b40  80 06 52 de 73 00 00 00 19 00 00 00 00 00 00 00  ..R.s...........
73debf2b50  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73debf2b60  01 00 00 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73debf2ae0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73debf2af0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73debf2b00  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5206c0  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d75c vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest22_hidl_bindDeathMonitorEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorERKNS6_2spINS4_13IDeathMonitorEEE+0x144
0x73cccd7968 libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest10GetServiceEv+0x40c
0x73cccd7f60 libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x60
0x73bc3720f4 libmlkit-segmentation.so!0x5550f4
0x73bc3720f4 libmlkit-segmentation.so!0x5550f4

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 2
|-[i] 3rd argument, Parcel addr: 0x7fdb26d2d8
|--[i] mDataSize: 0x50
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9d5540  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de9d5550  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73de9d5560  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73de9d5570  52 65 71 75 65 73 74 00 85 2a 62 73 00 09 00 00  Request..*bs....
73de9d5580  80 95 9d ae 73 00 00 00 e0 2a bf de 73 00 00 00  ....s....*..s...
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9d5540  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de9d5550  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73de9d5560  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73de9d5570  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x1
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73ae9d9520  38 00 00 00 00 00 00 00                          8.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d3ac vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest13_hidl_executeEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorEiiRKNS7_8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSH_EEE+0x184
0x73ccd1ddb8 vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest7executeEiiRKN7android8hardware8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSC_EEE+0xa4
0x73cccd807c libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x17c
0x73bc3720f4 libmlkit-segmentation.so!0x5550f4
0x73bc3720f4 libmlkit-segmentation.so!0x5550f4

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 1
|-[i] 3rd argument, Parcel addr: 0x7fdb26d2f0
|--[i] mDataSize: 0x180
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
74405d5a00  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
74405d5a10  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
74405d5a20  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
74405d5a30  52 65 71 75 65 73 74 00 00 00 00 00 13 00 00 00  Request.........
74405d5a40  85 2a 74 70 00 00 00 00 f0 d4 26 db 7f 00 00 00  .*tp......&.....
74405d5a50  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
74405d5a60  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
74405d5a70  c8 b8 9d ae 73 00 00 00 30 00 00 00 00 00 00 00  ....s...0.......
74405d5a80  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
74405d5a90  24 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  $........*tp....
74405d5aa0  b0 73 9d ae 73 00 00 00 24 00 00 00 00 00 00 00  .s..s...$.......
74405d5ab0  01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
74405d5ac0  85 61 64 66 00 00 00 00 01 00 00 00 00 00 00 00  .adf............
74405d5ad0  02 00 00 00 00 00 00 00 0c 00 00 00 00 00 00 00  ................
74405d5ae0  24 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  $........*tp....
74405d5af0  d0 71 9d ae 73 00 00 00 24 00 00 00 00 00 00 00  .q..s...$.......
74405d5b00  01 00 00 00 00 00 00 00 10 00 00 00 00 00 00 00  ................
74405d5b10  85 61 64 66 00 00 00 00 01 00 00 00 00 00 00 00  .adf............
74405d5b20  04 00 00 00 00 00 00 00 0c 00 00 00 00 00 00 00  ................
74405d5b30  24 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  $........*tp....
74405d5b40  00 72 9d ae 73 00 00 00 24 00 00 00 00 00 00 00  .r..s...$.......
74405d5b50  01 00 00 00 00 00 00 00 20 00 00 00 00 00 00 00  ........ .......
74405d5b60  85 61 64 66 00 00 00 00 01 00 00 00 00 00 00 00  .adf............
74405d5b70  06 00 00 00 00 00 00 00 0c 00 00 00 00 00 00 00  ................
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
74405d5a00  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
74405d5a10  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
74405d5a20  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
74405d5a30  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x8
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d1f9c550  40 00 00 00 00 00 00 00 68 00 00 00 00 00 00 00  @.......h.......
73d1f9c560  98 00 00 00 00 00 00 00 c0 00 00 00 00 00 00 00  ................
73d1f9c570  e8 00 00 00 00 00 00 00 10 01 00 00 00 00 00 00  ................
73d1f9c580  38 01 00 00 00 00 00 00 60 01 00 00 00 00 00 00  8.......`.......
|----[i] buffer: 0x1
|----[i] buffer content: 
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26d230
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73aeb9d5e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73aeb9d5f0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73aeb9d600  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73aeb9d610  85 2a 74 70 00 00 00 00 28 d4 26 db 7f 00 00 00  .*tp....(.&.....
73aeb9d620  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73aeb9d630  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73aeb9d640  c0 06 52 de 73 00 00 00 19 00 00 00 00 00 00 00  ..R.s...........
73aeb9d650  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73aeb9d660  0e 00 00 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73aeb9d5e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73aeb9d5f0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73aeb9d600  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de520f40  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d75c vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest22_hidl_bindDeathMonitorEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorERKNS6_2spINS4_13IDeathMonitorEEE+0x144
0x73cccd7968 libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest10GetServiceEv+0x40c
0x73cccd7f60 libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x60
0x73bc370808 libmlkit-segmentation.so!0x553808
0x73bc370808 libmlkit-segmentation.so!0x553808

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 2
|-[i] 3rd argument, Parcel addr: 0x7fdb26d3f8
|--[i] mDataSize: 0x50
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9d5540  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de9d5550  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73de9d5560  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73de9d5570  52 65 71 75 65 73 74 00 85 2a 62 73 00 09 00 00  Request..*bs....
73de9d5580  c0 0f 52 de 73 00 00 00 e0 d5 b9 ae 73 00 00 00  ..R.s.......s...
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9d5540  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de9d5550  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73de9d5560  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73de9d5570  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x1
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de520fe0  38 00 00 00 00 00 00 00                          8.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d3ac vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest13_hidl_executeEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorEiiRKNS7_8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSH_EEE+0x184
0x73ccd1ddb8 vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest7executeEiiRKN7android8hardware8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSC_EEE+0xa4
0x73cccd807c libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x17c
0x73bc370808 libmlkit-segmentation.so!0x553808
0x73bc370808 libmlkit-segmentation.so!0x553808

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 1
|-[i] 3rd argument, Parcel addr: 0x7fdb26d410
|--[i] mDataSize: 0xe0
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
7457c6f7c0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
7457c6f7d0  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
7457c6f7e0  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
7457c6f7f0  52 65 71 75 65 73 74 00 00 00 00 00 1b 00 00 00  Request.........
7457c6f800  85 2a 74 70 00 00 00 00 10 d6 26 db 7f 00 00 00  .*tp......&.....
7457c6f810  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
7457c6f820  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
7457c6f830  c8 0f 52 de 73 00 00 00 10 00 00 00 00 00 00 00  ..R.s...........
7457c6f840  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
7457c6f850  24 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  $........*tp....
7457c6f860  b0 7b de d1 73 00 00 00 24 00 00 00 00 00 00 00  .{..s...$.......
7457c6f870  01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
7457c6f880  85 61 64 66 00 00 00 00 01 00 00 00 00 00 00 00  .adf............
7457c6f890  02 00 00 00 00 00 00 00 0c 00 00 00 00 00 00 00  ................
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
7457c6f7c0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
7457c6f7d0  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
7457c6f7e0  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
7457c6f7f0  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x4
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d171a4c0  40 00 00 00 00 00 00 00 68 00 00 00 00 00 00 00  @.......h.......
73d171a4d0  98 00 00 00 00 00 00 00 c0 00 00 00 00 00 00 00  ................
|----[i] buffer: 0x1
|----[i] buffer content: 
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ee328828 vendor.huawei.hardware.ai@1.1.so!_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr22_hidl_registerInstanceEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEib+0xf0
0x73f64d3f9c libai_client.so!0x49f9c
0x73f64cd42c libai_client.so!HIAI_ModelManager_create+0x144
0x73bc35523c libmlkit-segmentation.so!0x53823c
0x73bc35523c libmlkit-segmentation.so!0x53823c

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 8
|-[i] 3rd argument, Parcel addr: 0x7fdb26d2f8
|--[i] mDataSize: 0x34
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d1710850  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73d1710860  72 64 77 61 72 65 2e 61 69 40 31 2e 31 3a 3a 49  rdware.ai@1.1::I
73d1710870  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 01 00 00 00  AiModelMngr.....
73d1710880  01 00 00 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d1710850  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73d1710860  72 64 77 61 72 65 2e 61 69 40 31 2e 31 3a 3a 49  rdware.ai@1.1::I
73d1710870  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x0
|--[i] mObjects: 
           0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF

[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db3b4 libai_client.so!0x513b4
0x73f64c8acc libai_client.so!_ZN2ai19NativeHandleWrapper24createFromTensorWithSizeEN6vendor6huawei8hardware2ai4V1_017TensorDescriptionEi+0x8c
0x73f64cb010 libai_client.so!0x41010
0x73f64cb6b4 libai_client.so!HIAI_TensorBuffer_create_v2+0x64
0x73bc3614c8 libmlkit-segmentation.so!0x5444c8
0x73bc3614c8 libmlkit-segmentation.so!0x5444c8

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26d100
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73def41d40  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73def41d50  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73def41d60  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 57 12 00 00  AiModelMngr.W...
73def41d70  85 2a 74 70 00 00 00 00 e8 d2 26 db 7f 00 00 00  .*tp......&.....
73def41d80  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73def41d90  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73def41da0  b8 eb 93 de 73 00 00 00 04 00 00 00 00 00 00 00  ....s...........
73def41db0  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73def41dc0  00 b2 16 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73def41d40  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73def41d50  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73def41d60  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de520fc0  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db3b4 libai_client.so!0x513b4
0x73f64c8acc libai_client.so!_ZN2ai19NativeHandleWrapper24createFromTensorWithSizeEN6vendor6huawei8hardware2ai4V1_017TensorDescriptionEi+0x8c
0x73f64cb010 libai_client.so!0x41010
0x73f64cb6b4 libai_client.so!HIAI_TensorBuffer_create_v2+0x64
0x73bc3614c8 libmlkit-segmentation.so!0x5444c8
0x73bc3614c8 libmlkit-segmentation.so!0x5444c8

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26d100
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73def41d40  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73def41d50  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73def41d60  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 57 12 00 00  AiModelMngr.W...
73def41d70  85 2a 74 70 00 00 00 00 e8 d2 26 db 7f 00 00 00  .*tp......&.....
73def41d80  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73def41d90  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73def41da0  b8 ec 93 de 73 00 00 00 04 00 00 00 00 00 00 00  ....s...........
73def41db0  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73def41dc0  00 02 00 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73def41d40  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73def41d50  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73def41d60  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5d7000  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc372574 libmlkit-segmentation.so!0x555574
0x73bc372574 libmlkit-segmentation.so!0x555574

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26cfd0
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73def41d40  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73def41d50  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73def41d60  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73def41d70  85 2a 74 70 00 00 00 00 c8 d1 26 db 7f 00 00 00  .*tp......&.....
73def41d80  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73def41d90  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73def41da0  40 72 5d de 73 00 00 00 19 00 00 00 00 00 00 00  @r].s...........
73def41db0  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73def41dc0  98 0b cd 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73def41d40  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73def41d50  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73def41d60  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5d7260  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d75c vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest22_hidl_bindDeathMonitorEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorERKNS6_2spINS4_13IDeathMonitorEEE+0x144
0x73cccd7968 libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest10GetServiceEv+0x40c
0x73cccd7f60 libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x60
0x73bc3743bc libmlkit-segmentation.so!0x5573bc
0x73bc3743bc libmlkit-segmentation.so!0x5573bc

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 2
|-[i] 3rd argument, Parcel addr: 0x7fdb26d188
|--[i] mDataSize: 0x50
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9d5540  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de9d5550  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73de9d5560  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73de9d5570  52 65 71 75 65 73 74 00 85 2a 62 73 00 09 00 00  Request..*bs....
73de9d5580  a0 72 5d de 73 00 00 00 40 1d f4 de 73 00 00 00  .r].s...@...s...
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9d5540  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73de9d5550  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
73de9d5560  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
73de9d5570  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x1
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5d72c0  38 00 00 00 00 00 00 00                          8.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d3ac vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest13_hidl_executeEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorEiiRKNS7_8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSH_EEE+0x184
0x73ccd1ddb8 vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest7executeEiiRKN7android8hardware8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSC_EEE+0xa4
0x73cccd807c libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x17c
0x73bc3743bc libmlkit-segmentation.so!0x5573bc
0x73bc3743bc libmlkit-segmentation.so!0x5573bc

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 1
|-[i] 3rd argument, Parcel addr: 0x7fdb26d1a0
|--[i] mDataSize: 0xe0
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
7457c6f7c0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
7457c6f7d0  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
7457c6f7e0  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
7457c6f7f0  52 65 71 75 65 73 74 00 00 00 00 00 14 00 00 00  Request.........
7457c6f800  85 2a 74 70 00 00 00 00 a0 d3 26 db 7f 00 00 00  .*tp......&.....
7457c6f810  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
7457c6f820  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
7457c6f830  e8 72 5d de 73 00 00 00 10 00 00 00 00 00 00 00  .r].s...........
7457c6f840  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
7457c6f850  24 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  $........*tp....
7457c6f860  a0 7c de d1 73 00 00 00 24 00 00 00 00 00 00 00  .|..s...$.......
7457c6f870  01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
7457c6f880  85 61 64 66 00 00 00 00 01 00 00 00 00 00 00 00  .adf............
7457c6f890  02 00 00 00 00 00 00 00 0c 00 00 00 00 00 00 00  ................
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
7457c6f7c0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
7457c6f7d0  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
7457c6f7e0  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
7457c6f7f0  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x4
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de9417c0  40 00 00 00 00 00 00 00 68 00 00 00 00 00 00 00  @.......h.......
73de9417d0  98 00 00 00 00 00 00 00 c0 00 00 00 00 00 00 00  ................
|----[i] buffer: 0x1
|----[i] buffer content: 
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26c610
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73aeb9d5e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73aeb9d5f0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73aeb9d600  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73aeb9d610  85 2a 74 70 00 00 00 00 08 c8 26 db 7f 00 00 00  .*tp......&.....
73aeb9d620  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73aeb9d630  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73aeb9d640  40 73 5d de 73 00 00 00 19 00 00 00 00 00 00 00  @s].s...........
73aeb9d650  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73aeb9d660  08 00 00 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73aeb9d5e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73aeb9d5f0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73aeb9d600  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5d73a0  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
|----[i] buffer: 0x0
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26c610
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73aeb9d5e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73aeb9d5f0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73aeb9d600  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73aeb9d610  85 2a 74 70 00 00 00 00 08 c8 26 db 7f 00 00 00  .*tp......&.....
73aeb9d620  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73aeb9d630  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73aeb9d640  40 73 5d de 73 00 00 00 19 00 00 00 00 00 00 00  @s].s...........
73aeb9d650  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73aeb9d660  08 00 00 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73aeb9d5e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73aeb9d5f0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73aeb9d600  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5d73a0  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
|----[i] buffer: 0x0
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26c610
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73aeb9d5e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73aeb9d5f0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73aeb9d600  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73aeb9d610  85 2a 74 70 00 00 00 00 08 c8 26 db 7f 00 00 00  .*tp......&.....
73aeb9d620  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73aeb9d630  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73aeb9d640  40 73 5d de 73 00 00 00 19 00 00 00 00 00 00 00  @s].s...........
73aeb9d650  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73aeb9d660  08 00 00 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73aeb9d5e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73aeb9d5f0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73aeb9d600  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5d73a0  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
|----[i] buffer: 0x0
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26c610
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73aeb9d5e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73aeb9d5f0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73aeb9d600  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73aeb9d610  85 2a 74 70 00 00 00 00 08 c8 26 db 7f 00 00 00  .*tp......&.....
73aeb9d620  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73aeb9d630  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73aeb9d640  40 73 5d de 73 00 00 00 19 00 00 00 00 00 00 00  @s].s...........
73aeb9d650  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73aeb9d660  08 00 00 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73aeb9d5e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73aeb9d5f0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73aeb9d600  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5d73a0  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
|----[i] buffer: 0x0
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c
0x73bc379f0c libmlkit-segmentation.so!0x55cf0c

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x7fdb26c610
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73aeb9d5e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73aeb9d5f0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73aeb9d600  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73aeb9d610  85 2a 74 70 00 00 00 00 08 c8 26 db 7f 00 00 00  .*tp......&.....
73aeb9d620  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73aeb9d630  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73aeb9d640  40 73 5d de 73 00 00 00 19 00 00 00 00 00 00 00  @s].s...........
73aeb9d650  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73aeb9d660  08 00 00 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73aeb9d5e0  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73aeb9d5f0  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73aeb9d600  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73de5d73a0  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
|----[i] buffer: 0x0
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db3b4 libai_client.so!0x513b4
0x73f64c8acc libai_client.so!_ZN2ai19NativeHandleWrapper24createFromTensorWithSizeEN6vendor6huawei8hardware2ai4V1_017TensorDescriptionEi+0x8c
0x73f64cb010 libai_client.so!0x41010
0x73f64cb6b4 libai_client.so!HIAI_TensorBuffer_create_v2+0x64
0x73bc3992d4 libmlkit-segmentation.so!0x57c2d4
0x73bc3992d4 libmlkit-segmentation.so!0x57c2d4

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x739b616130
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d0e2e260  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73d0e2e270  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73d0e2e280  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 57 12 00 00  AiModelMngr.W...
73d0e2e290  85 2a 74 70 00 00 00 00 18 63 61 9b 73 00 00 00  .*tp.....ca.s...
73d0e2e2a0  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73d0e2e2b0  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73d0e2e2c0  d0 08 e2 4a 74 00 00 00 04 00 00 00 00 00 00 00  ...Jt...........
73d0e2e2d0  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73d0e2e2e0  00 b0 16 00                                      ....
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d0e2e260  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73d0e2e270  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73d0e2e280  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d0ce21e0  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db3b4 libai_client.so!0x513b4
0x73f64c8acc libai_client.so!_ZN2ai19NativeHandleWrapper24createFromTensorWithSizeEN6vendor6huawei8hardware2ai4V1_017TensorDescriptionEi+0x8c
0x73f64cb010 libai_client.so!0x41010
0x73f64cb6b4 libai_client.so!HIAI_TensorBuffer_create_v2+0x64
0x73bc3992d4 libmlkit-segmentation.so!0x57c2d4
0x73bc3992d4 libmlkit-segmentation.so!0x57c2d4

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x739b616130
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d0e2e260  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73d0e2e270  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73d0e2e280  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 57 12 00 00  AiModelMngr.W...
73d0e2e290  85 2a 74 70 00 00 00 00 18 63 61 9b 73 00 00 00  .*tp.....ca.s...
73d0e2e2a0  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73d0e2e2b0  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73d0e2e2c0  d8 08 e2 4a 74 00 00 00 04 00 00 00 00 00 00 00  ...Jt...........
73d0e2e2d0  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73d0e2e2e0  00 30 53 00                                      .0S.
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d0e2e260  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73d0e2e270  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73d0e2e280  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d0d29060  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f0d9c vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0x138
0x73f6466b74 vendor.huawei.hardware.ai@3.2.so!_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr11allocMemoryEiRKN7android8hardware11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE+0xac
0x73f64db184 libai_client.so!0x51184
0x73bc373468 libmlkit-segmentation.so!0x556468
0x73bc373468 libmlkit-segmentation.so!0x556468

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 21
|-[i] 3rd argument, Parcel addr: 0x739b6159d0
|--[i] mDataSize: 0x84
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d0e2e260  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73d0e2e270  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73d0e2e280  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 00 00 00 00  AiModelMngr.....
73d0e2e290  85 2a 74 70 00 00 00 00 c8 5b 61 9b 73 00 00 00  .*tp.....[a.s...
73d0e2e2a0  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73d0e2e2b0  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
73d0e2e2c0  80 92 d2 d0 73 00 00 00 19 00 00 00 00 00 00 00  ....s...........
73d0e2e2d0  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
73d0e2e2e0  26 00 00 00                                      &...
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d0e2e260  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
73d0e2e270  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
73d0e2e280  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x2
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d0d292a0  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73ccd1d3ac vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest13_hidl_executeEPN7android8hardware10IInterfaceEPNS7_7details16HidlInstrumentorEiiRKNS7_8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSH_EEE+0x184
0x73ccd1ddb8 vendor.huawei.hardware.ai.hidlrequest@1.0.so!_ZN6vendor6huawei8hardware2ai11hidlrequest4V1_015BpHwHidlRequest7executeEiiRKN7android8hardware8hidl_vecINS7_11hidl_handleEEENSt3__18functionIFviSC_EEE+0xa4
0x73cccd807c libai_hidl_request_client.so!_ZN4hiai15HIAIHidlRequest6ExcuteEiiRKNSt3__16vectorINS_3rpc9RpcHandleENS1_9allocatorIS4_EEEERS7_+0x17c
0x73bc374f8c libmlkit-segmentation.so!0x557f8c
0x73bc374f8c libmlkit-segmentation.so!0x557f8c

[i] 1st argument, this: 0x7457dd2b00
[i] mHandle value: 0x1
|-[i] 2nd argument, transaction code: 1
|-[i] 3rd argument, Parcel addr: 0x739b615ba0
|--[i] mDataSize: 0x180
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
744afe9200  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
744afe9210  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
744afe9220  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
744afe9230  52 65 71 75 65 73 74 00 00 00 00 00 16 00 00 00  Request.........
744afe9240  85 2a 74 70 00 00 00 00 a0 5d 61 9b 73 00 00 00  .*tp.....]a.s...
744afe9250  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
744afe9260  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
744afe9270  88 3a ce d0 73 00 00 00 30 00 00 00 00 00 00 00  .:..s...0.......
744afe9280  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
744afe9290  24 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  $........*tp....
744afe92a0  c0 e6 58 d2 73 00 00 00 24 00 00 00 00 00 00 00  ..X.s...$.......
744afe92b0  01 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
744afe92c0  85 61 64 66 00 00 00 00 01 00 00 00 00 00 00 00  .adf............
744afe92d0  02 00 00 00 00 00 00 00 0c 00 00 00 00 00 00 00  ................
744afe92e0  24 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  $........*tp....
744afe92f0  f0 e6 58 d2 73 00 00 00 24 00 00 00 00 00 00 00  ..X.s...$.......
744afe9300  01 00 00 00 00 00 00 00 10 00 00 00 00 00 00 00  ................
744afe9310  85 61 64 66 00 00 00 00 01 00 00 00 00 00 00 00  .adf............
744afe9320  04 00 00 00 00 00 00 00 0c 00 00 00 00 00 00 00  ................
744afe9330  24 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  $........*tp....
744afe9340  20 e7 58 d2 73 00 00 00 24 00 00 00 00 00 00 00   .X.s...$.......
744afe9350  01 00 00 00 00 00 00 00 20 00 00 00 00 00 00 00  ........ .......
744afe9360  85 61 64 66 00 00 00 00 01 00 00 00 00 00 00 00  .adf............
744afe9370  06 00 00 00 00 00 00 00 0c 00 00 00 00 00 00 00  ................
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
744afe9200  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
744afe9210  72 64 77 61 72 65 2e 61 69 2e 68 69 64 6c 72 65  rdware.ai.hidlre
744afe9220  71 75 65 73 74 40 31 2e 30 3a 3a 49 48 69 64 6c  quest@1.0::IHidl
744afe9230  52 65 71 75 65 73 74                             Request
|--[i] mObjectsSize: 0x8
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
744ae338a0  40 00 00 00 00 00 00 00 68 00 00 00 00 00 00 00  @.......h.......
744ae338b0  98 00 00 00 00 00 00 00 c0 00 00 00 00 00 00 00  ................
744ae338c0  e8 00 00 00 00 00 00 00 10 01 00 00 00 00 00 00  ................
744ae338d0  38 01 00 00 00 00 00 00 60 01 00 00 00 00 00 00  8.......`.......
|----[i] buffer: 0x1
|----[i] buffer content: 
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f1100 vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr16_hidl_freeMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringERKNS6_11hidl_memoryE+0x150
0x73f64db724 libai_client.so!0x51724
0x73f64db5a8 libai_client.so!0x515a8
0x73f64c911c libai_client.so!_ZN2ai19NativeHandleWrapperD2Ev+0xd4
0x73f64c9370 libai_client.so!_ZTv0_n24_N2ai19NativeHandleWrapperD0Ev+0x28
0x743c45a6e4 libutils.so!_ZNK7android7RefBase9decStrongEPKv+0x74
0x73f64cbc84 libai_client.so!HIAI_TensorBuffer_destroy+0x28
0x73bc398ddc libmlkit-segmentation.so!0x57bddc
0x73bc398ddc libmlkit-segmentation.so!0x57bddc

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 22
|-[i] 3rd argument, Parcel addr: 0x739b616328
|--[i] mDataSize: 0x120
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
744aed6000  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
744aed6010  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
744aed6020  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 57 12 00 00  AiModelMngr.W...
744aed6030  85 2a 74 70 00 00 00 00 78 64 61 9b 73 00 00 00  .*tp....xda.s...
744aed6040  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
744aed6050  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
744aed6060  28 09 e2 4a 74 00 00 00 04 00 00 00 00 00 00 00  (..Jt...........
744aed6070  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
744aed6080  85 2a 74 70 00 00 00 00 f0 64 61 9b 73 00 00 00  .*tp.....da.s...
744aed6090  28 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  (...............
744aed60a0  00 00 00 00 00 00 00 00 24 00 00 00 00 00 00 00  ........$.......
744aed60b0  85 2a 74 70 01 00 00 00 30 e6 58 d2 73 00 00 00  .*tp....0.X.s...
744aed60c0  24 00 00 00 00 00 00 00 02 00 00 00 00 00 00 00  $...............
744aed60d0  00 00 00 00 00 00 00 00 85 61 64 66 00 00 00 00  .........adf....
744aed60e0  01 00 00 00 00 00 00 00 03 00 00 00 00 00 00 00  ................
744aed60f0  0c 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
744aed6100  30 09 e2 4a 74 00 00 00 07 00 00 00 00 00 00 00  0..Jt...........
744aed6110  02 00 00 00 00 00 00 00 18 00 00 00 00 00 00 00  ................
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
744aed6000  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
744aed6010  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
744aed6020  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x6
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d0ce39c0  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
73d0ce39d0  80 00 00 00 00 00 00 00 b0 00 00 00 00 00 00 00  ................
73d0ce39e0  d8 00 00 00 00 00 00 00 f8 00 00 00 00 00 00 00  ................
|----[i] buffer: 0x73d258e630
|----[i] buffer content: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d258e630  0c 00 00 00 01 00 00 00 05 00 00 00 84 00 00 00  ................
73d258e640  92 15 14 03 03 00 00 00 00 30 53 00 01 00 00 00  .........0S.....
73d258e650  1d 00 00 00                                      ....
|----[i] this_fd: 0x84
|----[i] this_size: 0x533000
[i] mmap addr: 0x74d8594a80
[i] mmap ret: 0x73e1d69000
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73e1d69000  00 00 03 41 00 40 06 41 00 80 09 41 00 e0 0c 41  ...A.@.A...A...A
73e1d69010  00 20 10 41 00 e0 11 41 00 60 13 41 00 00 15 41  . .A...A.`.A...A
73e1d69020  00 a0 16 41 00 e0 17 41 00 00 19 41 00 40 1a 41  ...A...A...A.@.A
73e1d69030  00 60 1b 41 00 c0 1c 41 00 00 1e 41 00 60 1f 41  .`.A...A...A.`.A
73e1d69040  00 e0 20 41 00 c0 20 41 00 80 20 41 00 40 20 41  .. A.. A.. A.@ A
73e1d69050  00 00 20 41 00 e0 1f 41 00 a0 1f 41 00 60 1f 41  .. A...A...A.`.A
73e1d69060  00 20 1f 41 00 60 1f 41 00 e0 1f 41 00 40 20 41  . .A.`.A...A.@ A
73e1d69070  00 a0 20 41 00 e0 20 41 00 20 21 41 00 40 21 41  .. A.. A. !A.@!A
73e1d69080  00 80 21 41 00 60 21 41 00 60 21 41 00 60 21 41  ..!A.`!A.`!A.`!A
73e1d69090  00 40 21 41 00 20 21 41 00 a0 20 41 00 60 20 41  .@!A. !A.. A.` A
73e1d690a0  00 20 20 41 00 e0 1f 41 00 c0 1f 41 00 80 1f 41  .  A...A...A...A
73e1d690b0  00 40 1f 41 00 40 1f 41 00 40 1f 41 00 60 1f 41  .@.A.@.A.@.A.`.A
73e1d690c0  00 80 1f 41 00 60 1f 41 00 40 1f 41 00 20 1f 41  ...A.`.A.@.A. .A
73e1d690d0  00 e0 1e 41 00 e0 1e 41 00 20 1f 41 00 40 1f 41  ...A...A. .A.@.A
73e1d690e0  00 60 1f 41 00 80 1f 41 00 a0 1f 41 00 c0 1f 41  .`.A...A...A...A
73e1d690f0  00 c0 1f 41 00 e0 1f 41 00 e0 1f 41 00 00 20 41  ...A...A...A.. A
73e1d69100  00 20 20 41 00 00 20 41 00 20 20 41 00 00 20 41  .  A.. A.  A.. A
73e1d69110  00 00 20 41 00 20 20 41 00 40 20 41 00 60 20 41  .. A.  A.@ A.` A
73e1d69120  00 a0 20 41 00 c0 20 41 00 c0 20 41 00 c0 20 41  .. A.. A.. A.. A
73e1d69130  00 c0 20 41 00 c0 20 41 00 e0 20 41 00 00 21 41  .. A.. A.. A..!A
73e1d69140  00 20 21 41 00 00 21 41 00 e0 20 41 00 80 20 41  . !A..!A.. A.. A
73e1d69150  00 40 20 41 00 e0 1f 41 00 a0 1f 41 00 80 1f 41  .@ A...A...A...A
73e1d69160  00 40 1f 41 00 00 1f 41 00 80 1e 41 00 00 1e 41  .@.A...A...A...A
73e1d69170  00 80 1d 41 00 20 1d 41 00 e0 1c 41 00 c0 1c 41  ...A. .A...A...A
73e1d69180  00 80 1c 41 00 60 1c 41 00 a0 1c 41 00 c0 1c 41  ...A.`.A...A...A
73e1d69190  00 e0 1c 41 00 20 1d 41 00 40 1d 41 00 60 1d 41  ...A. .A.@.A.`.A
73e1d691a0  00 80 1d 41 00 a0 1d 41 00 00 1e 41 00 80 1e 41  ...A...A...A...A
73e1d691b0  00 e0 1e 41 00 40 1f 41 00 80 1f 41 00 c0 1f 41  ...A.@.A...A...A
73e1d691c0  00 20 20 41 00 60 20 41 00 c0 20 41 00 20 21 41  .  A.` A.. A. !A
73e1d691d0  00 80 21 41 00 e0 21 41 00 60 22 41 00 c0 22 41  ..!A..!A.`"A.."A
73e1d691e0  00 40 23 41 00 c0 23 41 00 80 23 41 00 40 23 41  .@#A..#A..#A.@#A
73e1d691f0  00 20 23 41 00 e0 22 41 00 80 22 41 00 40 22 41  . #A.."A.."A.@"A
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0
[*] onEnter: Vendor BpHwBinder::transact
[i] memory information:
[i] call stack:
0x73f65f1100 vendor.huawei.hardware.ai@3.0.so!_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr16_hidl_freeMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringERKNS6_11hidl_memoryE+0x150
0x73f64db724 libai_client.so!0x51724
0x73f64db5a8 libai_client.so!0x515a8
0x73f64c911c libai_client.so!_ZN2ai19NativeHandleWrapperD2Ev+0xd4
0x73f64c9370 libai_client.so!_ZTv0_n24_N2ai19NativeHandleWrapperD0Ev+0x28
0x743c45a6e4 libutils.so!_ZNK7android7RefBase9decStrongEPKv+0x74
0x73f64cbc84 libai_client.so!HIAI_TensorBuffer_destroy+0x28
0x73bc398ddc libmlkit-segmentation.so!0x57bddc
0x73bc398ddc libmlkit-segmentation.so!0x57bddc

[i] 1st argument, this: 0x73debf2900
[i] mHandle value: 0x3
|-[i] 2nd argument, transaction code: 22
|-[i] 3rd argument, Parcel addr: 0x739b616328
|--[i] mDataSize: 0x120
|--[i] mData (vendor): 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
744aed6000  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
744aed6010  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
744aed6020  41 69 4d 6f 64 65 6c 4d 6e 67 72 00 57 12 00 00  AiModelMngr.W...
744aed6030  85 2a 74 70 00 00 00 00 78 64 61 9b 73 00 00 00  .*tp....xda.s...
744aed6040  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
744aed6050  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
744aed6060  d8 08 e2 4a 74 00 00 00 04 00 00 00 00 00 00 00  ...Jt...........
744aed6070  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
744aed6080  85 2a 74 70 00 00 00 00 f0 64 61 9b 73 00 00 00  .*tp.....da.s...
744aed6090  28 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  (...............
744aed60a0  00 00 00 00 00 00 00 00 24 00 00 00 00 00 00 00  ........$.......
744aed60b0  85 2a 74 70 01 00 00 00 e0 e4 58 d2 73 00 00 00  .*tp......X.s...
744aed60c0  24 00 00 00 00 00 00 00 02 00 00 00 00 00 00 00  $...............
744aed60d0  00 00 00 00 00 00 00 00 85 61 64 66 00 00 00 00  .........adf....
744aed60e0  01 00 00 00 00 00 00 00 03 00 00 00 00 00 00 00  ................
744aed60f0  0c 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
744aed6100  30 09 e2 4a 74 00 00 00 07 00 00 00 00 00 00 00  0..Jt...........
744aed6110  02 00 00 00 00 00 00 00 18 00 00 00 00 00 00 00  ................
|--[i] Interface Token: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
744aed6000  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
744aed6010  72 64 77 61 72 65 2e 61 69 40 33 2e 30 3a 3a 49  rdware.ai@3.0::I
744aed6020  41 69 4d 6f 64 65 6c 4d 6e 67 72                 AiModelMngr
|--[i] mObjectsSize: 0x6
|--[i] mObjects: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d0ce36c0  30 00 00 00 00 00 00 00 58 00 00 00 00 00 00 00  0.......X.......
73d0ce36d0  80 00 00 00 00 00 00 00 b0 00 00 00 00 00 00 00  ................
73d0ce36e0  d8 00 00 00 00 00 00 00 f8 00 00 00 00 00 00 00  ................
|----[i] buffer: 0x73d258e4e0
|----[i] buffer content: 
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73d258e4e0  0c 00 00 00 01 00 00 00 05 00 00 00 83 00 00 00  ................
73d258e4f0  92 15 14 03 03 00 00 00 00 b0 16 00 01 00 00 00  ................
73d258e500  19 00 00 00                                      ....
|----[i] this_fd: 0x83
|----[i] this_size: 0x16b000
[i] mmap addr: 0x74d8594a80
[i] mmap ret: 0x73e1bfe000
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
73e1bfe000  00 00 a0 42 00 00 9c 42 00 00 9c 42 00 00 9e 42  ...B...B...B...B
73e1bfe010  00 00 9e 42 00 00 9e 42 00 00 9c 42 00 00 9e 42  ...B...B...B...B
73e1bfe020  00 00 a0 42 00 00 9e 42 00 00 9c 42 00 00 9c 42  ...B...B...B...B
73e1bfe030  00 00 9e 42 00 00 9e 42 00 00 9c 42 00 00 9e 42  ...B...B...B...B
73e1bfe040  00 00 9e 42 00 00 9e 42 00 00 9e 42 00 00 9e 42  ...B...B...B...B
73e1bfe050  00 00 9e 42 00 00 9e 42 00 00 a0 42 00 00 a0 42  ...B...B...B...B
73e1bfe060  00 00 9e 42 00 00 9e 42 00 00 9e 42 00 00 9e 42  ...B...B...B...B
73e1bfe070  00 00 a0 42 00 00 a0 42 00 00 9e 42 00 00 a0 42  ...B...B...B...B
73e1bfe080  00 00 a0 42 00 00 9e 42 00 00 9e 42 00 00 9e 42  ...B...B...B...B
73e1bfe090  00 00 9e 42 00 00 a2 42 00 00 9e 42 00 00 9e 42  ...B...B...B...B
73e1bfe0a0  00 00 a0 42 00 00 9e 42 00 00 9e 42 00 00 a2 42  ...B...B...B...B
73e1bfe0b0  00 00 9e 42 00 00 a0 42 00 00 a0 42 00 00 9e 42  ...B...B...B...B
73e1bfe0c0  00 00 a0 42 00 00 a0 42 00 00 9e 42 00 00 9e 42  ...B...B...B...B
73e1bfe0d0  00 00 a0 42 00 00 9e 42 00 00 9e 42 00 00 9e 42  ...B...B...B...B
73e1bfe0e0  00 00 9c 42 00 00 9c 42 00 00 9c 42 00 00 9e 42  ...B...B...B...B
73e1bfe0f0  00 00 9e 42 00 00 a0 42 00 00 a0 42 00 00 9e 42  ...B...B...B...B
73e1bfe100  00 00 9e 42 00 00 a0 42 00 00 a0 42 00 00 9e 42  ...B...B...B...B
73e1bfe110  00 00 a0 42 00 00 9e 42 00 00 a0 42 00 00 a0 42  ...B...B...B...B
73e1bfe120  00 00 a0 42 00 00 a0 42 00 00 a0 42 00 00 a2 42  ...B...B...B...B
73e1bfe130  00 00 a0 42 00 00 a2 42 00 00 a0 42 00 00 a2 42  ...B...B...B...B
73e1bfe140  00 00 a2 42 00 00 a6 42 00 00 a4 42 00 00 a4 42  ...B...B...B...B
73e1bfe150  00 00 a2 42 00 00 a2 42 00 00 a6 42 00 00 a4 42  ...B...B...B...B
73e1bfe160  00 00 a4 42 00 00 a8 42 00 00 a8 42 00 00 a4 42  ...B...B...B...B
73e1bfe170  00 00 a8 42 00 00 a8 42 00 00 a8 42 00 00 a8 42  ...B...B...B...B
73e1bfe180  00 00 a4 42 00 00 a8 42 00 00 a6 42 00 00 a4 42  ...B...B...B...B
73e1bfe190  00 00 a8 42 00 00 a8 42 00 00 a4 42 00 00 a4 42  ...B...B...B...B
73e1bfe1a0  00 00 a8 42 00 00 a4 42 00 00 a6 42 00 00 aa 42  ...B...B...B...B
73e1bfe1b0  00 00 aa 42 00 00 a6 42 00 00 aa 42 00 00 a8 42  ...B...B...B...B
73e1bfe1c0  00 00 a6 42 00 00 a6 42 00 00 a6 42 00 00 aa 42  ...B...B...B...B
73e1bfe1d0  00 00 a6 42 00 00 a4 42 00 00 a6 42 00 00 a6 42  ...B...B...B...B
73e1bfe1e0  00 00 a6 42 00 00 a6 42 00 00 a8 42 00 00 a8 42  ...B...B...B...B
73e1bfe1f0  00 00 a6 42 00 00 a8 42 00 00 a8 42 00 00 ac 42  ...B...B...B...B
[*] onLeave: Vendor BpHwBinder::transact
|-[i] ret value: 0x0

```