#include <jni.h>
#include <string>
#include <unistd.h>
#include <sys/stat.h>
#include <fcntl.h>
#include "android/log.h"
#include <list>
#include <dlfcn.h>

#include "tinyxml2.h"       //用于解析xml文件

#define  LOG    "fy_tag"
#define  LOGD(...)  __android_log_print(ANDROID_LOG_DEBUG,LOG,__VA_ARGS__)

using namespace tinyxml2;

std::list<std::string> hal_list = {};               //解析后的HAL接口
std::list<std::string> useful_hal_list = {};        //可用于访问调用的HAL接口

struct test_s
(*hw_get_service)(std::basic_string<char, std::char_traits<char>, std::allocator<char>>, \
    std::basic_string<char, std::char_traits<char>, std::allocator<char>>, bool, bool);

struct test_s {
    void *tmp_1;
    uint64_t tmp_2;
    uint64_t tmp_3;
    uint64_t tmp_4;
    uint64_t tmp_5;
    uint64_t tmp_6;
};

extern "C"
JNIEXPORT jstring JNICALL
Java_com_fy_mynative_MainActivity_readFile(JNIEnv *env, jobject thiz, jstring file_path) {
    const char *c_src = (*env).GetStringUTFChars(file_path, nullptr);
    LOGD("[ReadFile] Ready to open file: %s", c_src);

    FILE *pFile = nullptr;
    pFile = fopen(c_src, "r");
    if (pFile == nullptr) {
        LOGD("[ReadFile] File not find.");
        fclose(pFile);
        return env->NewStringUTF("");
    }
    LOGD("[ReadFile] OpenFile Success");
    char *pBuf; // 文件指针
    fseek(pFile, 0, SEEK_END);  //把指针移动到文件的结尾,获取文件长度
    int size = (int) ftell(pFile);
    pBuf = new char[size + 1];
    rewind(pFile);  //文件指针移动到开头
    fread(pBuf, 1, (size_t) size, pFile);
    pBuf[size] = 0; //把读到的文件最后一位写为0,要不然系统会一直寻找到0后才结束

    fclose(pFile);
    return env->NewStringUTF(pBuf);
}

extern "C"
JNIEXPORT void JNICALL
Java_com_fy_mynative_MainActivity_parseHAL(JNIEnv *env, jobject thiz, jstring file_path) {
    const char *c_src = (*env).GetStringUTFChars(file_path, nullptr);
    FILE *pFile = nullptr;
    pFile = fopen(c_src, "r");
    if (pFile == nullptr) {
        LOGD("[parseHAL] File not find.");
        fclose(pFile);
        return;
    }
    XMLDocument doc;
    XMLError error = doc.LoadFile(pFile);
    if (!error) {
        LOGD("[parseHAL] LoadFile Success. ");
        XMLElement *rootElement = doc.RootElement();    //  "manifest"
        XMLElement *halElement = rootElement->FirstChildElement("hal");
        while (halElement) {
            XMLElement *halChild = halElement->FirstChildElement();

            std::string name;
            std::string version;
            std::string transport;
            std::list<std::string> interface;
            std::list<std::string> fqname;

            while (halChild) {
                const std::string childName = halChild->Name();
                std::string childValue;
                if (halChild->GetText() == nullptr) {
                    childValue = "";
                } else {
                    childValue = halChild->GetText();
                }
                if (childName == "name") {
                    name = childValue;
                } else if (childName == "version") {
                    version = childValue;
                } else if (childName == "transport") {
                    transport = childValue;
                } else if (childName == "fqname") {
                    fqname.insert(fqname.end(), childValue);
                } else if (childName == "interface") {
                    XMLElement *interface_element = halChild->FirstChildElement();
                    std::string interface_name;
                    std::string interface_instance;
                    while (interface_element) {
                        std::string a = interface_element->Name();
                        if (a == "name") {
                            interface_name = interface_element->GetText();
                        } else if (a == "instance") {
                            interface_instance = interface_element->GetText();
                        }
                        interface_element = interface_element->NextSiblingElement();
                    }
                    interface.insert(interface.end(),
                                     interface_name.append("/") + interface_instance);
                }
                halChild = halChild->NextSiblingElement();
            }

            std::list<std::string>::iterator mIterator;
            for (mIterator = fqname.begin(); mIterator != fqname.end(); mIterator++) {
                std::string ff = *mIterator;
//                LOGD("full_name: %s%s", name.c_str(), ff.c_str());
                hal_list.insert(hal_list.end(), name + ff);
            }
            halElement = halElement->NextSiblingElement();
        }
    } else {
        LOGD("[parseHAL] LoadFile Error.  Code:%d ", error);
    }
    LOGD("[parseHAL] parseHAL Finished.");
}

extern "C"
JNIEXPORT void JNICALL
Java_com_fy_mynative_MainActivity_findUsefulHAL(JNIEnv *env, jobject thiz) {
    std::list<std::string>::iterator hal_iterator;
    LOGD("[FindUsefulHAL] Start.");
//    void *handle = dlopen("/system/lib64/vndk-sp-29/libhidlbase.so", RTLD_NOW);
//    void *handle = dlopen("/system/lib64/libhidlbase.so", RTLD_NOW);
    void *handle = dlopen("libhidlbase.so", RTLD_NOW);  // 文件目录为/system/lib64/libhidlbase.so，设备提取后放入应用的libs目录进行加载
    if (handle == nullptr) {
        LOGD("[FindUsefulHAL] dlopen libhidlbase.so Error: %s", dlerror());
        return;
    }
    dlerror();
    const char *func_name = "_ZN7android8hardware7details21getRawServiceInternalERKNSt3__112basic_stringIcNS2_11char_traitsIcEENS2_9allocatorIcEEEESA_bb";
    void *get_service_handler = dlsym(handle, func_name);

    hw_get_service = (struct test_s(*)(
            std::basic_string<char, std::char_traits<char>, std::allocator<char>>,
            std::basic_string<char, std::char_traits<char>, std::allocator<char>>, bool,
            bool)) get_service_handler;

    for (hal_iterator = hal_list.begin(); hal_iterator != hal_list.end(); hal_iterator++) {
        std::string hal_name = *hal_iterator;

        struct test_s tmp_test = {nullptr, 0, 0, 0, 0, 0};
        std::string instance = "default";
        size_t a = hal_name.find("/");
        size_t b = hal_name.size();
        std::string hal_dis = hal_name.substr(0, a);
        instance = hal_name.substr(a + 1, b);

        LOGD("[FindUsefulHAL] hal_dis = %s, instance = %s", hal_dis.c_str(), instance.c_str());
        if (hal_dis == "android.hardware.graphics.mapper@2.0::IMapper" or hal_dis == "android.hardware.renderscript@1.0::IDevice"){
            /**
             * SAMSUNG device crash when these two hal_discriptions
             * GOOGLE(Pixel 2) device crash when "android.hardware.renderscript@1.0::IDevice"
             * HUAWEI(MatePad Pro 5G) device crash when "android.hardware.renderscript@1.0::IDevice"
             */
            continue;
        }
        try {
            tmp_test = (*hw_get_service)(hal_dis, instance, true, false);
        } catch (double) {
            LOGD("[FindUsefulHAL] Invoke Service Error");
        }

        if (tmp_test.tmp_1 == nullptr) {
//            LOGD("[FindUsefulHAL] Can not find useful HAL.");
            continue;
        } else {
            LOGD("[FindUsefulHAL] [Useful HAL] %s", hal_name.c_str());
            useful_hal_list.emplace_back(hal_name);
        }
    }
}

extern "C"
JNIEXPORT jstring JNICALL
Java_com_fy_mynative_MainActivity_getHALList(JNIEnv *env, jobject thiz) {
    if (hal_list.empty()) {
        return env->NewStringUTF("");
    }
    std::string hal_all;
    std::list<std::string>::iterator hal_iterator;
    for (hal_iterator = hal_list.begin(); hal_iterator != hal_list.end(); hal_iterator++) {
        std::string hal_name = *hal_iterator;
        hal_all.append(hal_name).append("\n");
    }
    return env->NewStringUTF(hal_all.c_str());
}

extern "C"
JNIEXPORT jstring JNICALL
Java_com_fy_mynative_MainActivity_getUsefulHALList(JNIEnv *env, jobject thiz) {
    if (useful_hal_list.empty()) {
        return env->NewStringUTF("");
    }
    std::string useful_hal_all;
    std::list<std::string>::iterator useful_hal_iterator;
    for (useful_hal_iterator = useful_hal_list.begin(); useful_hal_iterator != useful_hal_list.end(); useful_hal_iterator++) {
        std::string useful_hal_name = *useful_hal_iterator;
        useful_hal_all.append(useful_hal_name).append("\n");
    }
    return env->NewStringUTF(useful_hal_all.c_str());
}