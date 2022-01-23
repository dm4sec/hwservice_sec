# TEEServiceSideFuzzer

```
HWJAD:/ # cd /system/                                                                                                                                                                                      
HWJAD:/system # grep -r "vendor.huawei.hardware.libteec@3.0.so" ./ 2>>/dev/null
Binary file ./bin/tee_auth_daemon matches
./etc/NOTICE.txt:/system/lib/vendor.huawei.hardware.libteec@3.0.so
./etc/NOTICE.txt:/system/lib64/vendor.huawei.hardware.libteec@3.0.so
Binary file ./lib/vendor.huawei.hardware.libteec@3.0.so matches
Binary file ./lib64/vendor.huawei.hardware.libteec@3.0.so matches
Binary file ./vendor/bin/hw/vendor.huawei.hardware.libteec@3.0-service matches
./vendor/etc/NOTICE.txt:/system/lib/vendor.huawei.hardware.libteec@3.0.so
./vendor/etc/NOTICE.txt:/system/lib64/vendor.huawei.hardware.libteec@3.0.so
./vendor/etc/selinux/vendor_file_contexts:/vendor/lib(64)?/vendor.huawei.hardware.libteec@3.0.so		u:object_r:same_process_hal_file:s0
Binary file ./vendor/lib/hw/vendor.huawei.hardware.libteec@3.0-impl.so matches
Binary file ./vendor/lib/vendor.huawei.hardware.libteec@3.0.so matches
Binary file ./vendor/lib64/hw/vendor.huawei.hardware.libteec@3.0-impl.so matches
Binary file ./vendor/lib64/vendor.huawei.hardware.libteec@3.0.so matches
2|HWJAD:/system # cd /vendor/                                                                                                                                                                              
HWJAD:/vendor # grep -r "vendor.huawei.hardware.libteec@3.0.so" ./ 2>>/dev/null                                                                                                                            
Binary file ./bin/hw/vendor.huawei.hardware.libteec@3.0-service matches
./etc/NOTICE.txt:/system/lib/vendor.huawei.hardware.libteec@3.0.so
./etc/NOTICE.txt:/system/lib64/vendor.huawei.hardware.libteec@3.0.so
./etc/selinux/vendor_file_contexts:/vendor/lib(64)?/vendor.huawei.hardware.libteec@3.0.so		u:object_r:same_process_hal_file:s0
Binary file ./lib/hw/vendor.huawei.hardware.libteec@3.0-impl.so matches
Binary file ./lib/vendor.huawei.hardware.libteec@3.0.so matches
Binary file ./lib64/hw/vendor.huawei.hardware.libteec@3.0-impl.so matches
Binary file ./lib64/vendor.huawei.hardware.libteec@3.0.so matches
HWJAD:/vendor # ps -ef | grep "tee_auth"
system         613     1 0 00:53:04 ?     00:00:00 tee_auth_daemon
root          6790  6779 0 01:11:35 pts/0 00:00:00 grep tee_auth
```

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

set lock screen password or remove lock screen password will trigger the following transactions.

| # | transaction code | interface token | interface method                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   | 
| ----|:----------------:| :----: |:-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1 |        1         | vendor.huawei.hardware.libteec@3.0::BnHwLibteecGlobal | vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_initializeContext(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::hardware::hidl_string const&, android::hardware::hidl_vec\<unsigned char\> const&, std::__1::function<void ()(int, android::hardware::hidl_vec\<unsigned char> const&)\>)                                                                                                                                                                                                                                                                                                                                                                            |
| 2 |        2         | vendor.huawei.hardware.libteec@3.0::BnHwLibteecGlobal | vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_finalizeContext(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_vec\<unsigned char\> const&)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| 3 |        3         | vendor.huawei.hardware.libteec@3.0::BnHwLibteecGlobal | vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_openSession(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_handle const&, android::hardware::hidl_string const&, android::hardware::hidl_vec\<unsigned char\> const&, unsigned int, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_memory const&, std::__1::function\<void ()(int, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_vec\<unsigned char\> const&, int)\>) |
| 4 |        5         | vendor.huawei.hardware.libteec@3.0::BnHwLibteecGlobal | vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_invokeCommandHidl(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_vec\<unsigned char\> const&, unsigned int, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_memory const&, std::__1::function\<void ()(int, android::hardware::hidl_vec\<unsigned char\> const&, android::hardware::hidl_vec\<unsigned char> const&, int)\>)                                                                                                                                                                                    |
| 5 |        13        | vendor.huawei.hardware.libteec@3.0::BnHwLibteecGlobal | vendor::huawei::hardware::libteec::V3_0::BpHwLibteecGlobal::_hidl_processCaDied(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, int)                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              

## NOTE
1. Downgrade both the `frida-server` and host. e.g., 14.2.17.
2. No java environment provided.
