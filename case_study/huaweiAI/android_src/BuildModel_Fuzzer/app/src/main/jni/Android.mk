LOCAL_PATH := $(call my-dir)
DDK_LIB_PATH := $(LOCAL_PATH)/../../../libs/$(TARGET_ARCH_ABI)

include $(CLEAR_VARS)
LOCAL_MODULE    := hiai
LOCAL_SRC_FILES := $(DDK_LIB_PATH)/libhiai.so
include $(PREBUILT_SHARED_LIBRARY)

#include $(CLEAR_VARS)
#LOCAL_MODULE    := caffe_adapter
#LOCAL_SRC_FILES := $(DDK_LIB_PATH)/libcaffe_adapter.so
#include $(PREBUILT_SHARED_LIBRARY)

include $(CLEAR_VARS)
LOCAL_MODULE    := tensorflow_adapter
LOCAL_SRC_FILES := $(DDK_LIB_PATH)/libtensorflow_adapter.so
include $(PREBUILT_SHARED_LIBRARY)

#include $(CLEAR_VARS)
#LOCAL_MODULE    := caffe
#LOCAL_SRC_FILES := $(DDK_LIB_PATH)/libcaffe.so
#include $(PREBUILT_SHARED_LIBRARY)

include $(CLEAR_VARS)
LOCAL_MODULE    := tensorflow
LOCAL_SRC_FILES := $(DDK_LIB_PATH)/libtensorflow_inference.so
include $(PREBUILT_SHARED_LIBRARY)

include $(CLEAR_VARS)

LOCAL_MODULE := hiaijni
LOCAL_SRC_FILES := \
    mix_classify_jni.cpp \
    mix_classify_async_jni.cpp \
    mixbuildmodel.cpp

#LOCAL_SHARED_LIBRARIES := hiai
LOCAL_LDFLAGS := -L$(DDK_LIB_PATH)
LOCAL_LDLIBS += \
    -lhiai \
    -llog \
    -landroid


include $(BUILD_SHARED_LIBRARY)
