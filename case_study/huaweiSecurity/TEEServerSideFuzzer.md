# TEEServiceSideFuzzer

First of all, the service should not be accessed by a shell user.

**NOTE:**
1. downgrade both the `frida-server` and host. e.g., 14.2.17.
2. no java environment provided.

## FYI
1. use following command to kill `security2`.
```commandline
while [ 1 ]; do ps -AZ| grep com.huawei.security2 | awk '{print $3}' | xargs kill -9; done
```
2. 
```commandline
HWJAD:/vendor/lib64 # ps -ef -Z | grep "tee"                                                                                                                                    
u:r:system_teecd:s0            system         616     1 0 09:15:03 ?     00:00:02 tee_auth_daemon
u:r:tee:s0                     root           617     1 0 09:15:03 ?     00:00:01 teecd
u:r:hal_libteec_default:s0     system         618     1 0 09:15:03 ?     00:00:04 vendor.huawei.hardware.libteec@3.0-service
```


| # | transaction code | interface token | interface method                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 
| ----|:----------------:| :----: |:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 |        1         | vendor.huawei.hardware.libteec@3.0::BnHwLibteecGlobal | vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_initializeContext(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::hardware::hidl_string const&, android::hardware::hidl_vec\<unsigned char\> const&, std::__1::function<void ()(int, android::hardware::hidl_vec\<unsigned char> const&)\>)                                                                                                                                                                                                                                                                                                                                                                            |
| 2 |        2         | vendor.huawei.hardware.libteec@3.0::BnHwLibteecGlobal | vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_finalizeContext(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_vec\<unsigned char\> const&)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 3 |        3         | vendor.huawei.hardware.libteec@3.0::BnHwLibteecGlobal | vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_openSession(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_handle const&, android::hardware::hidl_string const&, android::hardware::hidl_vec\<unsigned char\> const&, unsigned int, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_memory const&, std::__1::function\<void ()(int, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_vec\<unsigned char\> const&, int)\>) |
| 4 |        5         | vendor.huawei.hardware.libteec@3.0::BnHwLibteecGlobal | vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_invokeCommandHidl(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_vec\<unsigned char\> const&, unsigned int, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_memory const&, std::__1::function\<void ()(int, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_vec\<unsigned char> const&, int)\>)                                                                                                                                                                                    |
| 5 |        13        | vendor.huawei.hardware.libteec@3.0::BnHwLibteecGlobal | vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_processCaDied(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              


set lock screen password.
```commandline
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 1
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 3
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 1
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 3
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 2
[*] onLeave: BnHwLibteecGlobal
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 13
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 2
[*] onLeave: BnHwLibteecGlobal
```

remove lock screen password.
```commandline
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 1
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 3
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 1
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 3
[*] onLeave: BnHwLibteecGlobal
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 2
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 13
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 5
[*] onLeave: BnHwLibteecGlobal
[*] onEnter: BnHwLibteecGlobal
|-[i] 2nd argument, transaction code: 2
[*] onLeave: BnHwLibteecGlobal
```
