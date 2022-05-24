#include <jni.h>
#include <sys/system_properties.h>
#include <dlfcn.h>
#include <stdlib.h>
#include <android/log.h>
#include <string>
#include <cstring>

#include "HIAIMixModel.h"

#define LOG_TAG "buildmodel"
#define ALOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)
#define ALOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)
using namespace std;

//online compile error code
typedef enum {
    CHECK_MODEL_COMPATIBILITY_SUCCESS = 0,
    BUILD_ONLINE_MODEL_SUCCESS,
    BUILD_ONLINE_MODEL_FAILED,
    GENERATE_OFFLINE_MODEL_FAILED,
    UNSUPPORT_FRAMEWORK,
    INVALID_OFFLINE_MODEL,
    INVALID_ONLINE_MODEL,
    INVALID_ONLINE_MODEL_PARA,
    CREATE_OFFLINE_MODEL_PATH_FAILED,
    CREATE_MODELMANAGER_FAILED,
    DL_OPEN_FAILD,
    NO_NPU
} RESULT_CODE;


bool _fileExist(const char* path)
{
    if(path == NULL){
        return false;
    }
    FILE *fp = fopen(path, "r+");
    if (fp == NULL)
    {
        // ALOGE("_fileExist ERROR: file %s not exists.", path.c_str());
        return false;
    }
    fclose(fp);
    return true;
}

bool checkModelCompatibility(HIAI_MixModelManager* mixModelManager, const char* modelpath,bool isMixModel){

       void *data = NULL;
       uint32_t read_size = 0;
       bool checkresult = false;
       if(_fileExist(modelpath)){

           FILE *fp = fopen(modelpath, "r+");

           fseek(fp, 0, SEEK_END);
           long file_length = ftell(fp);

           fseek(fp, 0, SEEK_SET);

           data = malloc((unsigned int)file_length);
           if (!data) {
               ALOGE("ERROR: malloc fail!");
               fclose(fp);
               return false;
           }
            read_size = (uint32_t)fread(data, 1, (unsigned int)file_length, fp);
           if ((long)read_size != file_length) {
               ALOGE(" ERROR: read_size(%d) != fileLength(%d)", (int)read_size, (int)file_length);
               free(data);
               data = NULL;
               fclose(fp);
               return false;
           }
           fclose(fp);
           checkresult = HIAI_CheckMixModelCompatibility_From_Buffer(mixModelManager,isMixModel,data,read_size);
           ALOGI(" HIAI_CheckMixModelCompatibility_From_Buffer checkresult : %d ", checkresult);
           if(data != NULL){
                free(data);
                data = NULL;
            }
       }
       return checkresult;

}

extern "C"
JNIEXPORT jboolean JNICALL
Java_com_huawei_startModelFromMem2Fuzzer_utils_ModelManager_modelCompatibilityProcessFromBuffer(JNIEnv *env, jclass type,
                                                                           jbyteArray onlinemodelbuffer_,
                                                                           jbyteArray modelparabuffer_,
                                                                           jstring framework_,
                                                                           jstring offlinemodelpath_,
                                                                           jboolean isMixModel_) {

    jbyte *onlinemodelbuffer = env->GetByteArrayElements(onlinemodelbuffer_, NULL);
    jbyte *modelparabuffer = env->GetByteArrayElements(modelparabuffer_, NULL);
    const char *framework = env->GetStringUTFChars(framework_, 0);
    const char *offlinemodelpath = env->GetStringUTFChars(offlinemodelpath_, 0);

    if(framework == NULL || offlinemodelpath == NULL ){
        env->ReleaseByteArrayElements(onlinemodelbuffer_, onlinemodelbuffer, 0);
        env->ReleaseByteArrayElements(modelparabuffer_, modelparabuffer, 0);
        env->ReleaseStringUTFChars(framework_, framework);
        env->ReleaseStringUTFChars(offlinemodelpath_, offlinemodelpath);
        return  false;
    }

     int onlinemodelbuffersize = env->GetArrayLength(onlinemodelbuffer_);
     int modelparabuffersize = env->GetArrayLength(modelparabuffer_);

    HIAI_Mix_Framework modelframework;
    string currentframe = string(framework);

    ALOGI("currentframe : %s", framework);
    if(currentframe.compare("caffe") == 0){
        modelframework = HIAI_Mix_Framework::HIAI_MIX_FRAMEWORK_CAFFE;
    }
    else if(currentframe.compare("caffe_8bit") == 0){
        modelframework = HIAI_Mix_Framework::HIAI_MIX_FRAMEWORK_CAFFE_8BIT;
    }
    else if(currentframe.compare("tensorflow") == 0){
        modelframework = HIAI_Mix_Framework::HIAI_MIX_FRAMEWORK_TENSORFLOW;
    }
    else if(currentframe.compare("tensorflow_8bit") == 0){
        modelframework = HIAI_Mix_Framework::HIAI_MIX_FRAMEWORK_TENSORFLOW_8BIT;
    }
    else{
        env->ReleaseByteArrayElements(onlinemodelbuffer_, onlinemodelbuffer, 0);
        env->ReleaseByteArrayElements(modelparabuffer_, modelparabuffer, 0);
        env->ReleaseStringUTFChars(framework_, framework);
        env->ReleaseStringUTFChars(offlinemodelpath_, offlinemodelpath);
        return  false;
    }

    HIAI_MixModelManager* mixModelManager = HIAI_MixModelManager_Create(NULL);
    if(mixModelManager == NULL){
        env->ReleaseByteArrayElements(onlinemodelbuffer_, onlinemodelbuffer, 0);
        env->ReleaseByteArrayElements(modelparabuffer_, modelparabuffer, 0);
        env->ReleaseStringUTFChars(framework_, framework);
        env->ReleaseStringUTFChars(offlinemodelpath_, offlinemodelpath);
        return false;
    }
    const char* currentversion = HIAI_ModelManager_GetVersion(mixModelManager);
    ALOGI("currentversion : %s", currentversion);
    RESULT_CODE result_code;
    if(string(currentversion).compare("000.000.000.000") == 0){
        result_code = NO_NPU;
    }else{

         bool checkresult = checkModelCompatibility(mixModelManager, offlinemodelpath, isMixModel_);

        if(checkresult){
            result_code = CHECK_MODEL_COMPATIBILITY_SUCCESS;
        }else{
            ALOGI("start to HIAI_MixModel_BuildModel_FromBuffer.");
            int res = HIAI_MixModel_BuildModel_FromBuffer(mixModelManager,
                                                          modelframework,
                                                          onlinemodelbuffer,
                                                          onlinemodelbuffersize,
                                                          modelparabuffer,
                                                          modelparabuffersize,
                                                          offlinemodelpath,isMixModel_);

    		ALOGI("HIAI_MixModel_BuildModel_FromBuffer result_code: %d", res);
            if(res != 0) {
                result_code = BUILD_ONLINE_MODEL_FAILED;
            }else{
                result_code = BUILD_ONLINE_MODEL_SUCCESS;
            }
        }
    }

    ALOGI("result_code : %d", result_code);
    HIAI_MixModelManager_Destroy(mixModelManager);
    env->ReleaseByteArrayElements(onlinemodelbuffer_, onlinemodelbuffer, 0);
    env->ReleaseByteArrayElements(modelparabuffer_, modelparabuffer, 0);
    env->ReleaseStringUTFChars(framework_, framework);
    env->ReleaseStringUTFChars(offlinemodelpath_, offlinemodelpath);

    bool result = false;
    if(result_code == CHECK_MODEL_COMPATIBILITY_SUCCESS || result_code == BUILD_ONLINE_MODEL_SUCCESS){
        result = true;
    }
    return result;

}

extern "C"
JNIEXPORT jboolean JNICALL
Java_com_huawei_startModelFromMem2Fuzzer_utils_ModelManager_modelCompatibilityProcessFromFile(JNIEnv *env, jclass type,
                                                    jstring onlinemodel_,jstring onlinemodepara_,jstring framework_ ,jstring offlinemodel_,
                                                    jboolean isMixModel_) {

    const char* onlinemodel = env->GetStringUTFChars(onlinemodel_, 0);
    if(onlinemodel == NULL) {
        onlinemodel = "";
    }

	ALOGI("onlinemodel : %s", onlinemodel);

    const char* framework = env->GetStringUTFChars(framework_, 0);
    if(framework == NULL) {
        return false;
    }

    HIAI_Mix_Framework modelframework;
    string currentframe = string(framework);
    ALOGI("currentframe : %s", framework);
    if(currentframe.compare("caffe") == 0){
        modelframework = HIAI_Mix_Framework::HIAI_MIX_FRAMEWORK_CAFFE;
    }
    else if(currentframe.compare("caffe_8bit") == 0){
        modelframework = HIAI_Mix_Framework::HIAI_MIX_FRAMEWORK_CAFFE_8BIT;
    }
    else if(currentframe.compare("tensorflow") == 0){
        modelframework = HIAI_Mix_Framework::HIAI_MIX_FRAMEWORK_TENSORFLOW;
    }
    else if(currentframe.compare("tensorflow_8bit") == 0){
        modelframework = HIAI_Mix_Framework::HIAI_MIX_FRAMEWORK_TENSORFLOW_8BIT;
    }
    else{
        return  false;
    }


	const char* onlinemodepara = env->GetStringUTFChars(onlinemodepara_, 0);
	if(onlinemodepara == NULL) {
        onlinemodepara = "";
    }
    ALOGI("onlinemodepara : %s", onlinemodepara);


	const char* offlinemodel = env->GetStringUTFChars(offlinemodel_, 0);
	if(offlinemodel == NULL) {
        offlinemodel = "";
    }
    ALOGI("offlinemodel : %s", offlinemodel);

    HIAI_MixModelManager* mixModelManager = HIAI_MixModelManager_Create(NULL);
    if(mixModelManager == NULL){
        env->ReleaseStringUTFChars(onlinemodel_, onlinemodel);
        env->ReleaseStringUTFChars(onlinemodepara_, onlinemodepara);
        env->ReleaseStringUTFChars(framework_, framework);
        env->ReleaseStringUTFChars(offlinemodel_, offlinemodel);
    }
    const char* currentversion = HIAI_ModelManager_GetVersion(mixModelManager);
    ALOGI("currentversion : %s", currentversion);
    RESULT_CODE result_code;
    if(string(currentversion).compare("000.000.000.000") == 0){
        result_code = NO_NPU;
    }else{
        bool check =  _fileExist(offlinemodel) && HIAI_CheckMixModelCompatibility_From_File(mixModelManager,isMixModel_,offlinemodel);
        ALOGI("check result : %d", check);
        if(check){
            result_code = CHECK_MODEL_COMPATIBILITY_SUCCESS;
        }else{
            int res = HIAI_MixModel_BuildModel_FromPath(mixModelManager,modelframework,onlinemodel,onlinemodepara,offlinemodel,isMixModel_);
            ALOGI("HIAI_MixModel_BuildModel_FromPath result_code : %d", res);
            if(res != 0) {
                result_code = BUILD_ONLINE_MODEL_FAILED;
            }else{
                result_code = BUILD_ONLINE_MODEL_SUCCESS;
            }
        }
    }

    ALOGI("result_code : %d", result_code);
    HIAI_MixModelManager_Destroy(mixModelManager);
	env->ReleaseStringUTFChars(onlinemodel_, onlinemodel);
    env->ReleaseStringUTFChars(onlinemodepara_, onlinemodepara);
    env->ReleaseStringUTFChars(framework_, framework);
    env->ReleaseStringUTFChars(offlinemodel_, offlinemodel);

    bool result = false;
    if(result_code == CHECK_MODEL_COMPATIBILITY_SUCCESS || result_code == BUILD_ONLINE_MODEL_SUCCESS){
        result = true;
    }
    return result;
}
