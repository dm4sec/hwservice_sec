# TEEServiceSideFuzzer

NOTE that we can not modify data from the server side (`mmap` with `PROT_READ` arg).

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
use following command to kill `security2`.
```commandline
while [ 1 ]; do ps -AZ| grep com.huawei.security2 | awk '{print $3}' | xargs kill -9; done
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
3. Disable pre-fuzzer to enable the current fuzzer, e.g., disable `_hidl_initializeContext` to enable the later on `_hidl_invokeCommandHidl`. 
4. The [TEEServerSideFuzzer.log](https://github.com/dm4sec/hwservice_sec/blob/master/case_study/huaweiSecurity/TEEServerSideFuzzer_crash.log.log) is the crash we collected. The crash can only be gotcha on the first lunch.

