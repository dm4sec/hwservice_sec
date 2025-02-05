1. The prototype of `hidl_BuildModel` is defined as:

| # | transaction code | interface token | interface method | 
| ----| :----: | :----: | :---- |
| 6 | 11 | vendor.huawei.hardware.ai@2.1::IModelManagerService_hidl | vendor::huawei::hardware::ai::V2_1::BpHwModelManagerService_hidl::_hidl_BuildModel(android::hardware::IInterface *, android::hardware::details::HidlInstrumentor *, unsigned int, android::hardware::hidl_string const&, unsigned int, android::hardware::hidl_vec\<vendor::huawei::hardware::ai::V2_0::hiai_model_hidl> const&, vendor::huawei::hardware::ai::V2_0::hiai_model_hidl const&, std::__1::function<void ()(unsigned int, int)>)

2. Parse `mData`.  
When using the [demo in DDK](https://developer.huawei.com/consumer/cn/doc/development/hiai-Library/ddk-download-0000001053590180) (Demo_Soure_Code.rar in HiAI DDK 100.300.010.010), the `hidl_BuildModel` method triggered, which covert `caffe` model to `om` model.  
2.1 An instance of `mData` is depicted as:
```commandline
             0  1  2  3  4  5  6  7  8  9  A  B  C  D  E  F  0123456789ABCDEF
6f64aff200  76 65 6e 64 6f 72 2e 68 75 61 77 65 69 2e 68 61  vendor.huawei.ha
6f64aff210  72 64 77 61 72 65 2e 61 69 40 32 2e 31 3a 3a 49  rdware.ai@2.1::I
6f64aff220  4d 6f 64 65 6c 4d 61 6e 61 67 65 72 53 65 72 76  ModelManagerServ
6f64aff230  69 63 65 5f 68 69 64 6c 00 00 00 00 01 00 00 00  ice_hidl........
6f64aff240  85 2a 74 70 00 00 00 00 e0 5e 85 fc 7f 00 00 00  .*tp.....^......
6f64aff250  10 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
6f64aff260  00 00 00 00 00 00 00 00 85 2a 74 70 01 00 00 00  .........*tp....
6f64aff270  30 4b 0e 7c 6f 00 00 00 29 00 00 00 00 00 00 00  0K.|o...).......
6f64aff280  00 00 00 00 00 00 00 00 00 00 00 00 00 00 00 00  ................
6f64aff290  00 00 00 00 85 2a 74 70 00 00 00 00 d0 5e 85 fc  .....*tp.....^..
6f64aff2a0  7f 00 00 00 10 00 00 00 00 00 00 00 00 00 00 00  ................
6f64aff2b0  00 00 00 00 00 00 00 00 00 00 00 00 85 2a 74 70  .............*tp
6f64aff2c0  01 00 00 00 08 8b af 64 6f 00 00 00 70 00 00 00  .......do...p...
6f64aff2d0  00 00 00 00 02 00 00 00 00 00 00 00 00 00 00 00  ................
6f64aff2e0  00 00 00 00 85 2a 74 70 01 00 00 00 f8 b2 4c 73  .....*tp......Ls
6f64aff2f0  6f 00 00 00 01 00 00 00 00 00 00 00 03 00 00 00  o...............
6f64aff300  00 00 00 00 00 00 00 00 00 00 00 00 1c 00 00 00  ................
6f64aff310  00 00 00 00 85 2a 74 70 01 00 00 00 20 06 a5 64  .....*tp.... ..d
6f64aff320  6f 00 00 00 1c 00 00 00 00 00 00 00 03 00 00 00  o...............
6f64aff330  00 00 00 00 10 00 00 00 00 00 00 00 85 61 64 66  .............adf
6f64aff340  00 00 00 00 01 00 00 00 00 00 00 00 05 00 00 00  ................
6f64aff350  00 00 00 00 0c 00 00 00 00 00 00 00 85 2a 74 70  .............*tp
6f64aff360  01 00 00 00 40 06 a5 64 6f 00 00 00 1d 00 00 00  ....@..do.......
6f64aff370  00 00 00 00 03 00 00 00 00 00 00 00 28 00 00 00  ............(...
6f64aff380  00 00 00 00 85 2a 74 70 01 00 00 00 e8 b2 4c 73  .....*tp......Ls
6f64aff390  6f 00 00 00 01 00 00 00 00 00 00 00 03 00 00 00  o...............
6f64aff3a0  00 00 00 00 38 00 00 00 00 00 00 00 1c 00 00 00  ....8...........
6f64aff3b0  00 00 00 00 85 2a 74 70 01 00 00 00 60 06 a5 64  .....*tp....`..d
6f64aff3c0  6f 00 00 00 1c 00 00 00 00 00 00 00 03 00 00 00  o...............
6f64aff3d0  00 00 00 00 48 00 00 00 00 00 00 00 85 61 64 66  ....H........adf
6f64aff3e0  00 00 00 00 01 00 00 00 00 00 00 00 09 00 00 00  ................
6f64aff3f0  00 00 00 00 0c 00 00 00 00 00 00 00 85 2a 74 70  .............*tp
6f64aff400  01 00 00 00 80 06 a5 64 6f 00 00 00 1d 00 00 00  .......do.......
6f64aff410  00 00 00 00 03 00 00 00 00 00 00 00 60 00 00 00  ............`...
6f64aff420  00 00 00 00 85 2a 74 70 00 00 00 00 18 5f 85 fc  .....*tp....._..
6f64aff430  7f 00 00 00 38 00 00 00 00 00 00 00 00 00 00 00  ....8...........
6f64aff440  00 00 00 00 00 00 00 00 00 00 00 00 85 2a 74 70  .............*tp
6f64aff450  01 00 00 00 0e 35 97 60 6f 00 00 00 01 00 00 00  .....5.`o.......
6f64aff460  00 00 00 00 0c 00 00 00 00 00 00 00 00 00 00 00  ................
6f64aff470  00 00 00 00 1c 00 00 00 00 00 00 00 85 2a 74 70  .............*tp
6f64aff480  01 00 00 00 40 03 a5 64 6f 00 00 00 1c 00 00 00  ....@..do.......
6f64aff490  00 00 00 00 0c 00 00 00 00 00 00 00 10 00 00 00  ................
6f64aff4a0  00 00 00 00 85 61 64 66 00 00 00 00 01 00 00 00  .....adf........
6f64aff4b0  00 00 00 00 0e 00 00 00 00 00 00 00 0c 00 00 00  ................
6f64aff4c0  00 00 00 00 85 2a 74 70 01 00 00 00 60 03 a5 64  .....*tp....`..d
6f64aff4d0  6f 00 00 00 1d 00 00 00 00 00 00 00 0c 00 00 00  o...............
6f64aff4e0  00 00 00 00 28 00 00 00 00 00 00 00              ....(.......
```

2.2 The prototype of `hiai_model_hidl` is likely to be:
```
|-------------|-------------|
| hidl_string | hidl_memory |
```
or
```
|-------------|-------------|-------------|
| hidl_string | hidl_handle | hidl_string |
```
I prefer the later one for we have to deliver the length of `hidl_memory` if we use the former one, but I can't find it in `mData`.

Such that the layout of the `mData` can be read according to the parameters as:
```
0                0x3c
|-----------------|-
| interface token |.

0x3c  0x40
-|-----|-
.| int |.

0x40              0x68          0x90
-|-----------------|-------------|-
.| hidl_string ptr | hidl_string |.

0x90  0x94
-|-----|-
.| int |.

0x94                            0xbc                        0xe4          0x10c                0x114           0x13c      0x15c         0x184         0x1ac                0x1b4           0x1dc      0x1fc         0x224
-|-------------------------------|---------------------------|-------------|--------------------|---------------|----------|-------------|-------------|--------------------|---------------|----------|-------------|-
.| hidl_vec<hiai_model_hidl> ptr | hidl_vec<hiai_model_hidl> | hidl_string | native_handle_size | native_handle | fd_array | hidl_string | hidl_string | native_handle_size | native_handle | fd_array | hidl_string |.

0x224                 0x24c         0x274                0x27c           0x2a4      0x2c4         0x2ec
-|---------------------|-------------|--------------------|---------------|----------|-------------|
.| may hiai_model_hidl | hidl_string | native_handle_size | native_handle | fd_array | hidl_string |
```

There are 2 elements in the vector, the first one contains plain text (the model file) while the second one contains binary data (the parameter file). Since our fuzzer does not work well on paint text, we fuzz the second file now.