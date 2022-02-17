The project is under the assumption that the code of [build model](https://developer.huawei.com/consumer/cn/doc/development/hiai-Guides/model-conversion-example-0000001053125647) is the same on both mobile device and PC , such that I use PC to speed up the fuzzing process.
To fuzz the binary, I use [afl](https://aflplus.plus/).

# HowTO

S1. prerequisite: 
```commandline
git clone https://github.com/AFLplusplus/AFLplusplus
cd AFLplusplus
sudo apt install cmake
make binary-only
sudo make install
```
S2. download tools from [site1](https://developer.huawei.com/consumer/cn/doc/development/hiai-Library/tools-download-0000001060044334) or [site2](https://support.huaweicloud.com/tg-Inference-cann/atlasinfertool_16_0004.html).  
```commandline
export LD_LIBRARY_PATH='/path/to/tools_for_DDK_100.510.020.010/tools_omg/IR/lib64'
```
S3. collect seed from Model Zoo (e.g., [huawei](https://developer.huawei.com/consumer/cn/doc/development/hiai-Guides/model-zoo-0000001187986457), [hiascend](https://www.hiascend.com/software/modelzoo)) in a `seed` folder and build another 2 `findings`, `cache` folders. The layout of the folder is as of:
```
.
├── AFLplusplus
| ...
├── Caffe
│   └── squeezenet
│       ├── cache
│       ├── findings
│       └── seed
│           ├── model
│           └── weight
├── MindSpore
│   ├── cache
│   ├── findings
│   └── seed
├── ONNX
│   ├── cache
│   ├── findings
│   └── seed
├── TensorFlow
│   └── mobilenet_v2_1_0_224
│       ├── cache
│       ├── findings
│       └── seed
│           └── mobilenet_v2_1_0_224
└── tools_for_DDK_100.510.020.010
``` 
S4. lunch the fuzzer for different models.  
4.1 for model of `Caffe` and tool of `omg`, I use the following command to fuzz.
```
verify it works by using:
../tools_for_DDK_100.510.020.010/tools_omg/IR/omg --model ../Caffe/squeezenet/seed/model/deploy.prototxt --weight ../Caffe/squeezenet/seed/weight/squeezenet_v1.1.caffemodel --framework 0 --output ../Caffe/squeezenet/cache/squeezenet

fuzz by using:
./afl-fuzz -n -m none -t 10000 -i ../Caffe/squeezenet/seed/weight -o ../Caffe/squeezenet/findings ../tools_for_DDK_100.510.020.010/tools_omg/IR/omg --model ../Caffe/squeezenet/seed/model/deploy.prototxt --weight ../Caffe/squeezenet/seed/weight/squeezenet_v1.1.caffemodel --framework 0 --output ../Caffe/squeezenet/cache/squeezenet
./afl-fuzz -n -m none -t 10000 -i ../Caffe/squeezenet/seed/weight -o ../Caffe/squeezenet/findings ../tools_for_DDK_100.510.020.010/tools_omg/IR/omg --model ../Caffe/squeezenet/seed/model/deploy.prototxt --weight @@ --framework 0 --output ../Caffe/squeezenet/cache/squeezenet
./afl-fuzz -n -m none -t 10000 -i ../Caffe/squeezenet/seed/model -o ../Caffe/squeezenet/findings ../tools_for_DDK_100.510.020.010/tools_omg/IR/omg --model @@ --weight ../Caffe/squeezenet/seed/weight/squeezenet_v1.1.caffemodel --framework 0 --output ../Caffe/squeezenet/cache/squeezenet
```
4.2 for model of `TensorFlow` and tool of `omg`, I use the following command to fuzz.
```commandline
ensure it works by using:
../tools_for_DDK_100.510.020.010/tools_omg/IR/omg --model ../TensorFlow/mobilenet_v2_1_0_224/seed/mobilenet_v2_1_0_224/mobilenet_v2_1.0_224_frozen.pb  --framework 3 --output ../TensorFlow/mobilenet_v2_1_0_224/cache/mobilenet_v2 --input_shape "input:1,224,224,3" --out_nodes "MobilenetV2/Predictions/Reshape_1:0"

fuzz by using:
./afl-fuzz -n -m none -t 10000 -i ../TensorFlow/mobilenet_v2_1_0_224/seed/mobilenet_v2_1_0_224 -o ../TensorFlow/mobilenet_v2_1_0_224/findings ../tools_for_DDK_100.510.020.010/tools_omg/IR/omg --model @@ --framework 3 --output ../TensorFlow/mobilenet_v2_1_0_224/cache/mobilenet_v2 --input_shape "input:1,224,224,3" --out_nodes "MobilenetV2/Predictions/Reshape_1:0"
```


4.3 for model of `ONNX` and tool of `omg`, I download models (e.g., `Googlenet` in [modelzoo](https://developer.huawei.com/consumer/cn/doc/development/hiai-Guides/model-zoo-0000001187986457)) firstly, then use the following command to fuzz.
```commandline
verify it works by using:
../tools_for_DDK_100.510.020.010/tools_omg/IR/omg --model ../ONNX/seed/googlenet.onnx --framework 5 --output ../ONNX/cache/googlenet

fuzz by using:
./afl-fuzz -n -m none -t 10000 -i ../ONNX/seed -o ../ONNX/findings ../tools_for_DDK_100.510.020.010/tools_omg/IR/omg --model @@  --framework 5 --output ../ONNX/cache/googlenet
```

4.4 for model of `MindSpore` and tool of `omg`, I [download models](https://download.mindspore.cn/model_zoo/) firstly (e.g., [resnext50_lite](https://download.mindspore.cn/model_zoo/official/lite/resnext50_lite/resnext50.mindir)), then use the following command to fuzz.
```commandline
TODO
```

The `omg` tools does not accept all models, e.g., [onnx models](https://github.com/onnx/models),  
I use `-n` instead of `-Q` for QEMU mode runs really slow.  
afl-fuzz issues \`All set and ready to roll!\`


# Reference
https://afl-1.readthedocs.io/en/latest/fuzzing.html  
