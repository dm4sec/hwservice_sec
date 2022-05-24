#include <jni.h>
#include <cstring>

#include <memory.h>
#include <android/asset_manager.h>
#include <android/asset_manager_jni.h>
#include <android/log.h>
#include <stdlib.h>
#include <cmath>
#include <sys/time.h>
#include <android/log.h>

#include "HIAIMixModel.h"

#define LOG_TAG "SYNC_DDK_MSG"

#define LOGE(...) __android_log_print(ANDROID_LOG_ERROR, LOG_TAG, __VA_ARGS__)
#define LOGI(...) __android_log_print(ANDROID_LOG_INFO, LOG_TAG, __VA_ARGS__)

using namespace std;

static HIAI_MixModelManager *manager = NULL;

static HIAI_MixTensorBuffer *inputtensor = NULL;

static HIAI_MixTensorBuffer *outputtensor = NULL;

static HIAI_MixModelBuffer *modelBuffer = NULL;

static HIAI_MixModelTensorInfo* modelTensorinfo = NULL;

int output_size = 0;

extern "C"
JNIEXPORT jint JNICALL
Java_com_huawei_hiaidemo_utils_ModelManager_loadModelSync(JNIEnv *env, jclass instance,
                                                    jstring jmodelName,jstring jofflinemodelfile,jobject assetManager,jboolean ixMixModel) {
    const char *modelName = env->GetStringUTFChars(jmodelName, 0);
    const char *offlinemodelfile = env->GetStringUTFChars(jofflinemodelfile, 0);

    manager = HIAI_MixModelManager_Create(NULL);
    if(manager == NULL){
        return -1;
    }

    AAssetManager *mgr = AAssetManager_fromJava(env, assetManager);
    LOGI("Attempting to load model...\n");

    LOGE("model name is %s", modelName);
    LOGE("offlinemodelfile is %s", offlinemodelfile);

    AAsset *asset = AAssetManager_open(mgr, offlinemodelfile, AASSET_MODE_BUFFER);

    if (nullptr == asset) {
        LOGE("AAsset is null...\n");
        return -1;
    }

    const void *data = AAsset_getBuffer(asset);

    if (nullptr == data) {
        LOGE("model buffer is null...\n");
        return -1;
    }

    off_t len = AAsset_getLength(asset);

    if (0 == len) {
        LOGE("model buffer length is 0...\n");
        return -1;
    }

    modelBuffer = HIAI_MixModelBuffer_Create_From_Buffer(modelName,(void *) data, len,
                                                         HIAI_MixDevPerf::HIAI_MIX_DEVPREF_HIGH,
                                                         ixMixModel);

     if(modelBuffer == NULL){
            HIAI_MixModelManager_Destroy(manager);
            return -1;
        }

    HIAI_MixModelBuffer* bufferarray[1] = {modelBuffer};
    int ret = HIAI_MixModel_LoadFromModelBuffers(manager, bufferarray, 1);
    if(ret == 0){
        modelTensorinfo = HIAI_MixModel_GetModelTensorInfo(manager,modelName);
    }
    LOGI("load model from assets ret = %d", ret);

    env->ReleaseStringUTFChars(jmodelName, modelName);
    env->ReleaseStringUTFChars(jofflinemodelfile, offlinemodelfile);
    AAsset_close(asset);

    return ret;

}

extern "C"
JNIEXPORT jint JNICALL
Java_com_huawei_hiaidemo_utils_ModelManager_unloadModelSync(JNIEnv *env, jclass instance) {
    if (NULL == manager) {
        LOGE("please load model first.");
        return -1;
    } else {
        if (modelBuffer != NULL) {
            HIAI_MixModelBuffer_Destroy(modelBuffer);
            modelBuffer = NULL;
        }
        if(NULL != modelTensorinfo){
            HIAI_MixModel_ReleaseModelTensorInfo(modelTensorinfo);
        }

        int ret = HIAI_MixModel_UnLoadModel(manager);

        LOGE("JNI unload model ret:%d", ret);

        HIAI_MixModelManager_Destroy(manager);
        manager = NULL;

        return ret;
    }
}

extern "C"
JNIEXPORT jint JNICALL
Java_com_huawei_hiaidemo_utils_ModelManager_loadModelFromFileSync(JNIEnv *env, jclass type,jstring modelname_,
                                                            jstring modelpath_, jboolean ixMixModel) {
    const char *modelname = env->GetStringUTFChars(modelname_, 0);
    const char *modelpath = env->GetStringUTFChars(modelpath_, 0);
    LOGI("Java_com_huawei_hiaidemo_utils_ModelManager_loadModelFromFileSync. modelpath : %s ", modelpath);
    LOGI("Java_com_huawei_hiaidemo_utils_ModelManager_loadModelFromFileSync. modelname : %s ", modelname);

    modelBuffer = HIAI_MixModelBuffer_Create_From_File(modelname,modelpath , HIAI_MIX_DEVPREF_LOW,ixMixModel);

    if(modelBuffer == NULL){
        LOGI("mixModel is NULL");
        return -1;
    }


    HIAI_MixModelBuffer *modelBufferArray[] = {modelBuffer};
    manager = HIAI_MixModelManager_Create(NULL);

    if(manager == NULL){
        //cout<<"creat manager failed."<<endl;
        return -1;
    }

    int ret = HIAI_MixModel_LoadFromModelBuffers(manager, modelBufferArray, 1);

    LOGI("load model from file ret = %d", ret);
    if(ret == 0){

        modelTensorinfo = HIAI_MixModel_GetModelTensorInfo(manager,modelname);
    }

    env->ReleaseStringUTFChars(modelname_, modelname);
    env->ReleaseStringUTFChars(modelpath_, modelpath);
    return ret;
}
extern "C"
JNIEXPORT jint JNICALL
Java_com_huawei_hiaidemo_utils_ModelManager_loadModelSyncFromBuffer(JNIEnv *env, jclass type,
                                                              jstring offlineModelName_,
                                                              jbyteArray offlineModelBuffer_, jboolean ixMixModel) {
    const char *modelname = env->GetStringUTFChars(offlineModelName_, 0);
    jbyte *offlineModelBuffer = env->GetByteArrayElements(offlineModelBuffer_, NULL);

    manager = HIAI_MixModelManager_Create(NULL);
    if(offlineModelBuffer == NULL){
        LOGE("offlineModelBuffer is NULL");
        env->ReleaseByteArrayElements(offlineModelBuffer_, offlineModelBuffer, 0);
        return -1;
    }
    int bufferSize = env->GetArrayLength(offlineModelBuffer_);
    modelBuffer = HIAI_MixModelBuffer_Create_From_Buffer(modelname,
                                                                        (void *) offlineModelBuffer, bufferSize,
                                                                              HIAI_MixDevPerf::HIAI_MIX_DEVPREF_HIGH,
                                                                              ixMixModel);
    HIAI_MixModelBuffer *modelBufferArray[] = {modelBuffer};

    int ret = HIAI_MixModel_LoadFromModelBuffers(manager, modelBufferArray, 1);

    LOGI("load model from buffer ret = %d", ret);
    env->ReleaseStringUTFChars(offlineModelName_, modelname);
    env->ReleaseByteArrayElements(offlineModelBuffer_, offlineModelBuffer, 0);
    return ret;
}

extern "C"
JNIEXPORT jobjectArray JNICALL
Java_com_huawei_hiaidemo_utils_ModelManager_runModelSync(JNIEnv *env, jclass type, jobject modelInfo,
                                                             jobjectArray buf_) {
    jclass ModelInfo = env->GetObjectClass(modelInfo);
    if(ModelInfo == NULL){
        LOGE("can not find ModelInfo class.");
        return NULL;
    }

    jmethodID getOfflineModelName = env->GetMethodID(ModelInfo,"getOfflineModelName","()Ljava/lang/String;");
    if(getOfflineModelName == NULL){
        LOGE("can not find getOfflineModelName method.");
        return NULL;
    }

    jstring modelname = (jstring)env->CallObjectMethod(modelInfo,getOfflineModelName);
    const char *modelName = env->GetStringUTFChars(modelname, 0);

    if (NULL == manager || NULL == modelTensorinfo) {
        LOGE("please load model first");
        return NULL;
    }


    if (NULL == buf_) {
        LOGE("please input somedata for the model.");
        return NULL;
    }


    int inputNum = env->GetArrayLength(buf_);

    float *dataBuff[inputNum];
    //init input data
    for(int i = 0 ;i <  inputNum; i++){
        jobject inputdata = env->GetObjectArrayElement(buf_,i);
        dataBuff[i] = env->GetFloatArrayElements((jfloatArray)inputdata, NULL);
        env->DeleteLocalRef(inputdata);
    }

    HIAI_MixTensorBuffer* inputs[modelTensorinfo->input_cnt];
    HIAI_MixTensorBuffer* outputs[modelTensorinfo->output_cnt];
    int *output_size = new int[modelTensorinfo->output_cnt];
    int in_n=0;
    int in_c=0;
    int in_h=0;
    int in_w=0;

    int out_n=0;
    int out_c=0;
    int out_h=0;
    int out_w=0;
    for (int i = 0,pos = 0; i < modelTensorinfo->input_cnt; ++i)
    {
        if(NULL !=modelTensorinfo->input_shape)
        {
            LOGI("input %d shape show as below : ", i);
            in_n = modelTensorinfo->input_shape[pos++];
            in_c = modelTensorinfo->input_shape[pos++];
            in_h =modelTensorinfo->input_shape[pos++];
            in_w =modelTensorinfo->input_shape[pos++];

            LOGI("input_n = %d input_c = %d input_h = %d input_w = %d", in_n,in_c,in_h,in_w);
        }

        HIAI_MixTensorBuffer* input = HIAI_MixTensorBuffer_Create( in_n, in_c,in_h, in_w); // NCHW
        if(NULL == input)
        {
            LOGE("fail :HIAI_MixTensorBuffer_Create input");
            HIAI_MixModel_ReleaseModelTensorInfo(modelTensorinfo);
            HIAI_MixModelBuffer_Destroy(modelBuffer);
            HIAI_MixModelManager_Destroy(manager);
            return NULL;
        }

        inputs[i] = input;
    }

    for (int i = 0 ,pos = 0; i < modelTensorinfo->output_cnt; ++i)
    {
        if(NULL !=modelTensorinfo->output_shape)
        {
            LOGI("output %d shape show as below : ", i);
            out_n =  modelTensorinfo->output_shape[pos++];
            out_c =  modelTensorinfo->output_shape[pos++];
            out_h =  modelTensorinfo->output_shape[pos++];
            out_w =  modelTensorinfo->output_shape[pos++];

            LOGI("output_n = %d output_c = %d output_h = %d output_w = %d", out_n,out_c,out_h,out_w);
        }
        output_size[i] = out_n * out_c * out_h * out_w;
        //3.3 malloc   output
        HIAI_MixTensorBuffer* output = HIAI_MixTensorBuffer_Create(out_n, out_c,out_h, out_w);

        if(NULL == output)
        {
            LOGE("fail :HIAI_MixTensorBuffer_Create output");
            HIAI_MixModel_ReleaseModelTensorInfo(modelTensorinfo);
            HIAI_MixModelBuffer_Destroy(modelBuffer);
            HIAI_MixModelManager_Destroy(manager);
            return NULL;
        }
        outputs[i] = output;
    }
    //init  inputtensor
    for(int i = 0; i < modelTensorinfo->input_cnt; ++i)
    {
        float *in_data = (float*)HIAI_MixTensorBuffer_GetRawBuffer(inputs[i]);
        int size = HIAI_MixTensorBuffer_GetBufferSize(inputs[i]);
        memcpy(in_data, dataBuff[i], size);
    }

    float time_use;
    struct timeval tpstart, tpend;
    gettimeofday(&tpstart, NULL);

    int ret = HIAI_MixModel_RunModel(
            manager,
            inputs,
            modelTensorinfo->input_cnt,
            outputs,
            modelTensorinfo->output_cnt,
            1000,
            modelName);

    LOGE("run model ret: %d", ret);

    jfloatArray *result_ = new jfloatArray[modelTensorinfo->output_cnt];
    for(int o = 0;o < modelTensorinfo->output_cnt; o++){
        float *outputBuffer = (float *) HIAI_MixTensorBuffer_GetRawBuffer(outputs[o]);
        //jfloat temp[output_size[o]];
		float* temp = new float[output_size[o]];
        for(int i =0;i < output_size[o];i++){
            temp[i] = outputBuffer[i];
        }
        result_[o] = env->NewFloatArray(output_size[o]);
        env->SetFloatArrayRegion(result_[o],0,output_size[o],temp);
		delete [] temp;
    }

    if (inputtensor != NULL) {
        HIAI_MixTensorBufferr_Destroy(inputtensor);
        inputtensor = NULL;
    }

    if (outputtensor != NULL) {
        HIAI_MixTensorBufferr_Destroy(outputtensor);
        outputtensor = NULL;
    }
    jclass floatClass = env->FindClass("[F");
    jobjectArray jdata=env->NewObjectArray(modelTensorinfo->output_cnt,floatClass,NULL);
    for(int i=0;i<modelTensorinfo->output_cnt;i++){
        env->SetObjectArrayElement(jdata,i,result_[i]);
    }


    env->ReleaseStringUTFChars(modelname, modelName);
    env->DeleteLocalRef(buf_);
    delete [] result_;
    delete [] output_size;

    return jdata;
}