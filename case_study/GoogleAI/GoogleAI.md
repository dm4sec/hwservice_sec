The difference between huaweiAI and GoogleAI is that the GoogleAI parses the model file in advance before passing the structured data to the service, 
c.f., `packages/modules/NeuralNetworks`, and google has done fuzz work on the service. c.f., `packages/modules/NeuralNetworks/runtime/test`. Anyway, I will fuzz the service.

```commandline
python3 GoogleAI.py --model-file="/sdcard/modelzoo/caffe/deploy.prototxt" --parameter-file="/sdcard/modelzoo/caffe/squeezenet_v1.1.caffemodel" --task-name="squeezenet" --dev-serial="948X1YQJB" --model-offset=0
```

android.hardware.neuralnetworks@1.0.so

```commandline
F: 0x18228 - 0x18678: android::hardware::neuralnetworks::V1_0::BpHwDevice::_hidl_getCapabilities(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, std::__1::function<void ()(android::hardware::neuralnetworks::V1_0::ErrorStatus, android::hardware::neuralnetworks::V1_0::Capabilities const&)>)
C: 0x182BC -> 0x32890: android::hardware::Parcel::writeInterfaceToken(char const*)
T: Transaction code at 0x182EC: 1

F: 0x18678 - 0x18B44: android::hardware::neuralnetworks::V1_0::BpHwDevice::_hidl_getSupportedOperations(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::hardware::neuralnetworks::V1_0::Model const&, std::__1::function<void ()(android::hardware::neuralnetworks::V1_0::ErrorStatus, android::hardware::hidl_vec<bool> const&)>)
C: 0x18710 -> 0x32890: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x1872C -> 0x32950: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
G: *** Vendor's implementation, shall verify the below result ***:
	 0x18748 -> 0x32960: android::hardware::neuralnetworks::V1_0::writeEmbeddedToParcel(android::hardware::neuralnetworks::V1_0::Model const&, android::hardware::Parcel *, unsigned long, unsigned long)
  C: 0x31FBC -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x31FF8 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x32034 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x320A4 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x320C8 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x32100 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x32124 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x32144 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x3216C -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
T: Transaction code at 0x18778: 2

F: 0x18B44 - 0x19058: android::hardware::neuralnetworks::V1_0::BpHwDevice::_hidl_prepareModel(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::hardware::neuralnetworks::V1_0::Model const&, android::sp<android::hardware::neuralnetworks::V1_0::IPreparedModelCallback> const&)
C: 0x18BD4 -> 0x32890: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x18BF0 -> 0x32950: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
G: *** Vendor's implementation, shall verify the below result ***:
	 0x18C0C -> 0x32960: android::hardware::neuralnetworks::V1_0::writeEmbeddedToParcel(android::hardware::neuralnetworks::V1_0::Model const&, android::hardware::Parcel *, unsigned long, unsigned long)
  C: 0x31FBC -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x31FF8 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x32034 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x320A4 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x320C8 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x32100 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x32124 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x32144 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x3216C -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x18C48 -> 0x32980: android::hardware::Parcel::writeStrongBinder(android::sp<android::hardware::IBinder> const&)
T: Transaction code at 0x18CC0: 3

F: 0x19058 - 0x19450: android::hardware::neuralnetworks::V1_0::BpHwDevice::_hidl_getStatus(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *)
C: 0x190E0 -> 0x32890: android::hardware::Parcel::writeInterfaceToken(char const*)
T: Transaction code at 0x19110: 4

F: 0x2215C - 0x224D0: android::hardware::neuralnetworks::V1_0::BpHwExecutionCallback::_hidl_notify(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::hardware::neuralnetworks::V1_0::ErrorStatus)
C: 0x221E8 -> 0x32890: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x221FC -> 0x32BB0: android::hardware::Parcel::writeInt32(int)
T: Transaction code at 0x2222C: 1

F: 0x275D4 - 0x27AE8: android::hardware::neuralnetworks::V1_0::BpHwPreparedModel::_hidl_execute(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::hardware::neuralnetworks::V1_0::Request const&, android::sp<android::hardware::neuralnetworks::V1_0::IExecutionCallback> const&)
C: 0x27664 -> 0x32890: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x27680 -> 0x32950: android::hardware::Parcel::writeBuffer(void const*, unsigned long, unsigned long *)
G: *** Vendor's implementation, shall verify the below result ***:
	 0x2769C -> 0x32EB0: android::hardware::neuralnetworks::V1_0::writeEmbeddedToParcel(android::hardware::neuralnetworks::V1_0::Request const&, android::hardware::Parcel *, unsigned long, unsigned long)
  C: 0x32494 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x324D0 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x32508 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x32544 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
  C: 0x32580 -> 0x32DE0: android::hardware::Parcel::writeEmbeddedBuffer(void const*, unsigned long, unsigned long *, unsigned long, unsigned long)
C: 0x276D8 -> 0x32980: android::hardware::Parcel::writeStrongBinder(android::sp<android::hardware::IBinder> const&)
T: Transaction code at 0x27750: 1

F: 0x2CDC0 - 0x2D1D8: android::hardware::neuralnetworks::V1_0::BpHwPreparedModelCallback::_hidl_notify(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, android::hardware::neuralnetworks::V1_0::ErrorStatus, android::sp<android::hardware::neuralnetworks::V1_0::IPreparedModel> const&)
C: 0x2CE50 -> 0x32890: android::hardware::Parcel::writeInterfaceToken(char const*)
C: 0x2CE64 -> 0x32BB0: android::hardware::Parcel::writeInt32(int)
C: 0x2CEA0 -> 0x32980: android::hardware::Parcel::writeStrongBinder(android::sp<android::hardware::IBinder> const&)
T: Transaction code at 0x2CF18: 1
```

android.hardware.neuralnetworks@1.1.so

# Reference
https://android.googlesource.com/platform/external/tensorflow/+/fec35b43fc608bfee5f3f23fdcd98f00a4aa7224/SECURITY.md  
https://android.googlesource.com/platform/external/tensorflow/+/refs/heads/master/tensorflow/security/README.md  
https://android.googlesource.com/platform/external/tensorflow/+/refs/heads/master/tensorflow/security/fuzzing/    

https://www.tensorflow.org/lite/examples?hl=zh-cn
