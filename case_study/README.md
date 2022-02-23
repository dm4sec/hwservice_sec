# Introduction
By observing, I find it's a case to case fuzzing for a specific service.
(e.g., the crash of the app by blind fuzzing will hinder the further test.)

1. `huaweiAI` is used to fuzz [huawei ai service](https://developer.huawei.com/consumer/cn/doc/overview/HUAWEI_HiAI).
2. `huaweiSurity` is used to fuzz [huawei security service](https://developer.huawei.com/consumer/cn/doc/development/Security-Guides/introduction-0000001051069988).
3. The AI services on [Google](https://github.com/dm4sec/hwservice_sec/tree/master/case_study/GoogleAI) and [Samsung](https://github.com/dm4sec/hwservice_sec/tree/master/case_study/SamsungAI) are the same, both of which are accessible via [NNAPI](https://developer.android.com/ndk/guides/neuralnetworks?hl=zh_cn). There has been lots of [work](https://android.googlesource.com/platform/external/tensorflow/+/refs/heads/master/tensorflow/security/README.md) in this area.  

# Reference

https://gitee.com/openharmony/ai_engine  
https://support.huawei.com/enterprise/zh/doc/EDOC1100150022?section=j00y  

https://android.googlesource.com/platform/external/tensorflow/+/refs/heads/master/tensorflow/security/README.md  
https://android.googlesource.com/platform/external/tensorflow/+/refs/heads/master/tensorflow/security/fuzzing/  
https://i.blackhat.com/EU-21/Wednesday/EU-21-Feng-AIModel-Mutator-Finding-Vulnerabilities-in-TensorFlow.pdf  

https://paper.seebug.org/1617/  

https://gitee.com/openharmony/security_itrustee_ree_lite
