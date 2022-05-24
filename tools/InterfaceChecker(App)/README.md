## 功能
通过apk读取设备清单，获取供应商提供的专用HAL.

## 工具
Tinyxml2 (https://github.com/leethomason/tinyxml2)

## 相关概念

设备清单 (https://source.android.com/devices/architecture/vintf/objects?hl=zh-cn#device-manifest-file)

项目中对 "/vendor/etc/vintf/manifest.xml" 清单文件进行读取并解析，获取供应商提供的专用HAL接口

manifest.hal.name 的 HAL 指定实例的2种方法:
1) `<interface>xxx</interface>`
    必须。指明软件包中具有实例名称的接口，可以有多个，但不能重复，一个<interface>当中，也可以有多个不重复的实例，也就是<instance>元素
2) `<fqname>xxx</fqname>`
    可选。HAL指定实例的另一种方法

当前是根据 HAL 指定实例的第二种方法确定 HAL 接口，通过 `<hal>` 标签下的 `<name>` 和 `fqname` 组合成 HAL 接口名称。

```
一个HAL接口的例子，接口为：'android.hardware.audio@5.0::IDevicesFactory/default'

    <hal format="hidl">
        <name>android.hardware.audio</name>
        <transport>hwbinder</transport>
        <version>5.0</version>
        <interface>
            <name>IDevicesFactory</name>
            <instance>default</instance>
        </interface>
        <fqname>@5.0::IDevicesFactory/default</fqname>
    </hal>
```

后续通过 android.hardware.details.getRawServiceInternal() 方法，获取该 HAL 接口对象


## 编译时碰到的问题

报错："xxx is not accessible for the namespace"

在进行dlopen的时候 "void *handle = dlopen("/system/lib64/libhidlbase.so", RTLD_NOW)", 报错如下：

```
E/linker: library "/system/lib64/libhidlbase.so" ("/system/lib64/libhidlbase.so") needed or dlopened by
"/data/app/com.fy.mynative-hFgwbhWJv3EWF6HPMI3ERg==/base.apk!/lib/arm64-v8a/libmynative.so" is not accessible for the namespace:
[name="classloader-namespace", ld_library_paths="", default_library_paths="/data/app/com.fy.mynative-hFgwbhWJv3EWF6HPMI3ERg==/lib/arm64:/data/app/com.fy.mynative-hFgwbhWJv3EWF6HPMI3ERg==/base.apk!/lib/arm64-v8a", permitted_paths="/data:/mnt/expand:/data/data/com.fy.mynative"]
```

原因：谷歌从Android N开始, 限制了应用对系统私有库的加载。(https://developer.android.google.cn/about/versions/nougat/android-7.0-changes?hl=zh-cn#ndk)

解决办法：把应用需要加载的库和依赖的库从系统中pull出来，然后集成到自己的应用当中。

## 结果

从 HUAWEI MatePad Pro 5G 上获取的可调用的12个 HAL
```
android.hardware.configstore@1.1::ISurfaceFlingerConfigs/default
android.hardware.graphics.allocator@2.0::IAllocator/default
android.hardware.media.omx@1.0::IOmx/default
android.hardware.media.omx@1.0::IOmxStore/default
android.hardware.neuralnetworks@1.2::IDevice/liteadaptor
vendor.huawei.hardware.ai@1.3::IAiEngineService/hiaiserver
vendor.huawei.hardware.ai@2.1::IAIService_hidl/hiaiserver_v2
vendor.huawei.hardware.ai@2.1::IModelManagerService_hidl/hiaiserver_modelmanager
vendor.huawei.hardware.ai.hidlrequest@1.0::IHidlRequest/ai_fmk_hidl_service
vendor.huawei.hardware.ai.hidlrequest@1.0::IHidlRequest/aiengine_server
vendor.huawei.hardware.ai.om@1.0::IOmHidlBridge/default
vendor.huawei.hardware.ai.stats@1.0::IAiStatsService/aiserver_record_stats
```

