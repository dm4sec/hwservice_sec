// https://frida.re/docs/javascript-api/

Java.perform(function () {

    console.log('[*] Frida js is running.')

    Module.load("/system/lib64/libhidlbase.so");

    var f1 = "_ZN6vendor6huawei8hardware2ai4V1_09BpHwAiASR15_hidl_createASREPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS3_13ASRInitParamsE";
    var f1_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f1);
    console.log("[i] f1 addr: " + f1_p);
    Interceptor.attach(f1_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f1")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f1");
        }
    });

    var f2 = "_ZN6vendor6huawei8hardware2ai4V1_09BpHwAiASR14_hidl_startASREPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS3_16ASRRuntimeParamsE";
    var f2_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f2);
    console.log("[i] f2 addr: " + f2_p);
    Interceptor.attach(f2_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f2")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f2");
        }
    });

    var f3 = "_ZN6vendor6huawei8hardware2ai4V1_09BpHwAiASR16_hidl_writeAudioEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_8hidl_vecIaEEb";
    var f3_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f3);
    console.log("[i] f3 addr: " + f3_p);
    Interceptor.attach(f3_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f3")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f3");
        }
    });

    var f4 = "_ZN6vendor6huawei8hardware2ai4V1_09BpHwAiASR13_hidl_stopASREPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f4_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f4);
    console.log("[i] f4 addr: " + f4_p);
    Interceptor.attach(f4_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f4")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f4");
        }
    });

    var f5 = "_ZN6vendor6huawei8hardware2ai4V1_09BpHwAiASR15_hidl_cancelASREPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f5_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f5);
    console.log("[i] f5 addr: " + f5_p);
    Interceptor.attach(f5_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f5")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f5");
        }
    });

    var f6 = "_ZN6vendor6huawei8hardware2ai4V1_09BpHwAiASR16_hidl_releaseASREPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f6_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f6);
    console.log("[i] f6 addr: " + f6_p);
    Interceptor.attach(f6_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f6")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f6");
        }
    });

    var f7 = "_ZN6vendor6huawei8hardware2ai4V1_017BpHwAiASRListener19_hidl_createASRDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f7_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f7);
    console.log("[i] f7 addr: " + f7_p);
    Interceptor.attach(f7_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f7")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f7");
        }
    });

    var f8 = "_ZN6vendor6huawei8hardware2ai4V1_017BpHwAiASRListener18_hidl_startASRDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f8_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f8);
    console.log("[i] f8 addr: " + f8_p);
    Interceptor.attach(f8_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f8")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f8");
        }
    });

    var f9 = "_ZN6vendor6huawei8hardware2ai4V1_017BpHwAiASRListener20_hidl_writeAudioDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f9_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f9);
    console.log("[i] f9 addr: " + f9_p);
    Interceptor.attach(f9_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f9")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f9");
        }
    });

    var f10 = "_ZN6vendor6huawei8hardware2ai4V1_017BpHwAiASRListener17_hidl_stopASRDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f10_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f10);
    console.log("[i] f10 addr: " + f10_p);
    Interceptor.attach(f10_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f10")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f10");
        }
    });

    var f11 = "_ZN6vendor6huawei8hardware2ai4V1_017BpHwAiASRListener19_hidl_cancelASRDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f11_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f11);
    console.log("[i] f11 addr: " + f11_p);
    Interceptor.attach(f11_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f11")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f11");
        }
    });

    var f12 = "_ZN6vendor6huawei8hardware2ai4V1_017BpHwAiASRListener20_hidl_releaseASRDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f12_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f12);
    console.log("[i] f12 addr: " + f12_p);
    Interceptor.attach(f12_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f12")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f12");
        }
    });

    var f13 = "_ZN6vendor6huawei8hardware2ai4V1_017BpHwAiASRListener17_hidl_rmsCallbackEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEf";
    var f13_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f13);
    console.log("[i] f13 addr: " + f13_p);
    Interceptor.attach(f13_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f13")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f13");
        }
    });

    var f14 = "_ZN6vendor6huawei8hardware2ai4V1_017BpHwAiASRListener20_hidl_resultCallbackEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS3_9ASRResultE";
    var f14_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f14);
    console.log("[i] f14 addr: " + f14_p);
    Interceptor.attach(f14_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f14")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f14");
        }
    });

    var f15 = "_ZN6vendor6huawei8hardware2ai4V1_017BpHwAiASRListener20_hidl_statusCallbackEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorENS3_9ASRStatusEi";
    var f15_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f15);
    console.log("[i] f15 addr: " + f15_p);
    Interceptor.attach(f15_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f15")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f15");
        }
    });

    var f16 = "_ZN6vendor6huawei8hardware2ai4V1_019BpHwAiEngineService29_hidl_createAiSuperResolutionEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS3_18IAiSRListenerProxyEEE";
    var f16_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f16);
    console.log("[i] f16 addr: " + f16_p);
    Interceptor.attach(f16_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f16")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f16");
        }
    });

    var f17 = "_ZN6vendor6huawei8hardware2ai4V1_019BpHwAiEngineService29_hidl_removeAiSuperResolutionEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f17_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f17);
    console.log("[i] f17 addr: " + f17_p);
    Interceptor.attach(f17_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f17")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f17");
        }
    });

    var f18 = "_ZN6vendor6huawei8hardware2ai4V1_019BpHwAiEngineService33_hidl_createAiImageClassificationEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f18_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f18);
    console.log("[i] f18 addr: " + f18_p);
    Interceptor.attach(f18_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f18")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f18");
        }
    });

    var f19 = "_ZN6vendor6huawei8hardware2ai4V1_019BpHwAiEngineService33_hidl_removeAiImageClassificationEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f19_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f19);
    console.log("[i] f19 addr: " + f19_p);
    Interceptor.attach(f19_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f19")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f19");
        }
    });

    var f20 = "_ZN6vendor6huawei8hardware2ai4V1_019BpHwAiEngineService31_hidl_createAiImageSegmentationEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f20_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f20);
    console.log("[i] f20 addr: " + f20_p);
    Interceptor.attach(f20_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f20")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f20");
        }
    });

    var f21 = "_ZN6vendor6huawei8hardware2ai4V1_019BpHwAiEngineService31_hidl_removeAiImageSegmentationEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f21_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f21);
    console.log("[i] f21 addr: " + f21_p);
    Interceptor.attach(f21_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f21")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f21");
        }
    });

    var f22 = "_ZN6vendor6huawei8hardware2ai4V1_019BpHwAiEngineService22_hidl_createAiFstMakerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS3_14IAiFstListenerEEE";
    var f22_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f22);
    console.log("[i] f22 addr: " + f22_p);
    Interceptor.attach(f22_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f22")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f22");
        }
    });

    var f23 = "_ZN6vendor6huawei8hardware2ai4V1_019BpHwAiEngineService22_hidl_removeAiFstMakerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f23_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f23);
    console.log("[i] f23 addr: " + f23_p);
    Interceptor.attach(f23_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f23")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f23");
        }
    });

    var f24 = "_ZN6vendor6huawei8hardware2ai4V1_019BpHwAiEngineService17_hidl_createAiASREPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS3_14IAiASRListenerEEE";
    var f24_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f24);
    console.log("[i] f24 addr: " + f24_p);
    Interceptor.attach(f24_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f24")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f24");
        }
    });

    var f25 = "_ZN6vendor6huawei8hardware2ai4V1_019BpHwAiEngineService17_hidl_removeAiASREPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f25_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f25);
    console.log("[i] f25 addr: " + f25_p);
    Interceptor.attach(f25_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f25")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f25");
        }
    });

    var f26 = "_ZN6vendor6huawei8hardware2ai4V1_019BpHwAiEngineService23_hidl_createAiModelMngrEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS3_18IAiMMListenerProxyEEEj";
    var f26_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f26);
    console.log("[i] f26 addr: " + f26_p);
    Interceptor.attach(f26_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f26")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f26");
        }
    });

    var f27 = "_ZN6vendor6huawei8hardware2ai4V1_019BpHwAiEngineService23_hidl_removeAiModelMngrEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f27_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f27);
    console.log("[i] f27 addr: " + f27_p);
    Interceptor.attach(f27_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f27");
            console.log('f27 called from:\n' +
                Thread.backtrace(this.context, Backtracer.ACCURATE)
                .map(DebugSymbol.fromAddress).join('\n') + '\n');
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f27");
        }
    });

    var f28 = "_ZN6vendor6huawei8hardware2ai4V1_017BpHwAiFstListener21_hidl_createMakerDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f28_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f28);
    console.log("[i] f28 addr: " + f28_p);
    Interceptor.attach(f28_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f28")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f28");
        }
    });

    var f29 = "_ZN6vendor6huawei8hardware2ai4V1_017BpHwAiFstListener21_hidl_addContactsDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEb";
    var f29_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f29);
    console.log("[i] f29 addr: " + f29_p);
    Interceptor.attach(f29_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f29")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f29");
        }
    });

    var f30 = "_ZN6vendor6huawei8hardware2ai4V1_017BpHwAiFstListener22_hidl_buildGrammerDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEb";
    var f30_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f30);
    console.log("[i] f30 addr: " + f30_p);
    Interceptor.attach(f30_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f30")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f30");
        }
    });

    var f31 = "_ZN6vendor6huawei8hardware2ai4V1_017BpHwAiFstListener22_hidl_releaseMakerDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f31_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f31);
    console.log("[i] f31 addr: " + f31_p);
    Interceptor.attach(f31_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f31")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f31");
        }
    });

    var f32 = "_ZN6vendor6huawei8hardware2ai4V1_017BpHwAiFstListener13_hidl_onErrorEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f32_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f32);
    console.log("[i] f32 addr: " + f32_p);
    Interceptor.attach(f32_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f32")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f32");
        }
    });

    var f33 = "_ZN6vendor6huawei8hardware2ai4V1_014BpHwAiFstMaker20_hidl_registerClientEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS3_18IAiRecipientClientEEE";
    var f33_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f33);
    console.log("[i] f33 addr: " + f33_p);
    Interceptor.attach(f33_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f33")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f33");
        }
    });

    var f34 = "_ZN6vendor6huawei8hardware2ai4V1_014BpHwAiFstMaker17_hidl_createMakerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringESE_";
    var f34_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f34);
    console.log("[i] f34 addr: " + f34_p);
    Interceptor.attach(f34_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f34")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f34");
        }
    });

    var f35 = "_ZN6vendor6huawei8hardware2ai4V1_014BpHwAiFstMaker17_hidl_addContactsEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_8hidl_vecINS6_11hidl_stringEEEb";
    var f35_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f35);
    console.log("[i] f35 addr: " + f35_p);
    Interceptor.attach(f35_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f35")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f35");
        }
    });

    var f36 = "_ZN6vendor6huawei8hardware2ai4V1_014BpHwAiFstMaker18_hidl_buildGrammerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_11hidl_stringESE_SE_SE_";
    var f36_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f36);
    console.log("[i] f36 addr: " + f36_p);
    Interceptor.attach(f36_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f36")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f36");
        }
    });

    var f37 = "_ZN6vendor6huawei8hardware2ai4V1_014BpHwAiFstMaker18_hidl_releaseMakerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f37_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f37);
    console.log("[i] f37 addr: " + f37_p);
    Interceptor.attach(f37_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f37")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f37");
        }
    });

    var f38 = "_ZN6vendor6huawei8hardware2ai4V1_025BpHwAiImageClassification20_hidl_registerClientEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS3_18IAiRecipientClientEEE";
    var f38_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f38);
    console.log("[i] f38 addr: " + f38_p);
    Interceptor.attach(f38_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f38")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f38");
        }
    });

    var f39 = "_ZN6vendor6huawei8hardware2ai4V1_025BpHwAiImageClassification11_hidl_startEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f39_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f39);
    console.log("[i] f39 addr: " + f39_p);
    Interceptor.attach(f39_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f39")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f39");
        }
    });

    var f40 = "_ZN6vendor6huawei8hardware2ai4V1_025BpHwAiImageClassification13_hidl_processEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS3_13AIImageBufferE";
    var f40_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f40);
    console.log("[i] f40 addr: " + f40_p);
    Interceptor.attach(f40_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f40")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f40");
        }
    });

    var f41 = "_ZN6vendor6huawei8hardware2ai4V1_025BpHwAiImageClassification10_hidl_stopEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f41_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f41);
    console.log("[i] f41 addr: " + f41_p);
    Interceptor.attach(f41_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f41")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f41");
        }
    });

    var f42 = "_ZN6vendor6huawei8hardware2ai4V1_025BpHwAiImageClassification22_hidl_registerListenerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS3_30IAiImageClassificationListenerEEE";
    var f42_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f42);
    console.log("[i] f42 addr: " + f42_p);
    Interceptor.attach(f42_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f42")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f42");
        }
    });

    var f43 = "_ZN6vendor6huawei8hardware2ai4V1_025BpHwAiImageClassification24_hidl_unregisterListenerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f43_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f43);
    console.log("[i] f43 addr: " + f43_p);
    Interceptor.attach(f43_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f43")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f43");
        }
    });

    var f44 = "_ZN6vendor6huawei8hardware2ai4V1_033BpHwAiImageClassificationListener17_hidl_onStartDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f44_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f44);
    console.log("[i] f44 addr: " + f44_p);
    Interceptor.attach(f44_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f44")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f44");
        }
    });

    var f45 = "_ZN6vendor6huawei8hardware2ai4V1_033BpHwAiImageClassificationListener19_hidl_onProcessDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_8hidl_vecIjEERKNSC_INS3_8ICResultEEE";
    var f45_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f45);
    console.log("[i] f45 addr: " + f45_p);
    Interceptor.attach(f45_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f45")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f45");
        }
    });

    var f46 = "_ZN6vendor6huawei8hardware2ai4V1_033BpHwAiImageClassificationListener16_hidl_onStopDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f46_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f46);
    console.log("[i] f46 addr: " + f46_p);
    Interceptor.attach(f46_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f46")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f46");
        }
    });

    var f47 = "_ZN6vendor6huawei8hardware2ai4V1_033BpHwAiImageClassificationListener13_hidl_onErrorEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f47_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f47);
    console.log("[i] f47 addr: " + f47_p);
    Interceptor.attach(f47_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f47")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f47");
        }
    });

    var f48 = "_ZN6vendor6huawei8hardware2ai4V1_023BpHwAiImageSegmentation20_hidl_registerClientEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS3_18IAiRecipientClientEEE";
    var f48_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f48);
    console.log("[i] f48 addr: " + f48_p);
    Interceptor.attach(f48_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f48")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f48");
        }
    });

    var f49 = "_ZN6vendor6huawei8hardware2ai4V1_023BpHwAiImageSegmentation11_hidl_startEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f49_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f49);
    console.log("[i] f49 addr: " + f49_p);
    Interceptor.attach(f49_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f49")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f49");
        }
    });

    var f50 = "_ZN6vendor6huawei8hardware2ai4V1_023BpHwAiImageSegmentation10_hidl_stopEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f50_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f50);
    console.log("[i] f50 addr: " + f50_p);
    Interceptor.attach(f50_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f50")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f50");
        }
    });

    var f51 = "_ZN6vendor6huawei8hardware2ai4V1_023BpHwAiImageSegmentation13_hidl_processEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS3_13AIImageBufferESE_RKNS3_13SegmentConfigEi";
    var f51_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f51);
    console.log("[i] f51 addr: " + f51_p);
    Interceptor.attach(f51_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f51")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f51");
        }
    });

    var f52 = "_ZN6vendor6huawei8hardware2ai4V1_023BpHwAiImageSegmentation22_hidl_registerListenerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS3_28IAiImageSegmentationListenerEEE";
    var f52_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f52);
    console.log("[i] f52 addr: " + f52_p);
    Interceptor.attach(f52_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f52")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f52");
        }
    });

    var f53 = "_ZN6vendor6huawei8hardware2ai4V1_023BpHwAiImageSegmentation24_hidl_unregisterListenerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f53_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f53);
    console.log("[i] f53 addr: " + f53_p);
    Interceptor.attach(f53_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f53")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f53");
        }
    });

    var f54 = "_ZN6vendor6huawei8hardware2ai4V1_031BpHwAiImageSegmentationListener17_hidl_onStartDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f54_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f54);
    console.log("[i] f54 addr: " + f54_p);
    Interceptor.attach(f54_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f54")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f54");
        }
    });

    var f55 = "_ZN6vendor6huawei8hardware2ai4V1_031BpHwAiImageSegmentationListener16_hidl_onStopDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f55_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f55);
    console.log("[i] f55 addr: " + f55_p);
    Interceptor.attach(f55_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f55")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f55");
        }
    });

    var f56 = "_ZN6vendor6huawei8hardware2ai4V1_031BpHwAiImageSegmentationListener19_hidl_onProcessDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS3_13AIImageBufferE";
    var f56_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f56);
    console.log("[i] f56 addr: " + f56_p);
    Interceptor.attach(f56_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f56")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f56");
        }
    });

    var f57 = "_ZN6vendor6huawei8hardware2ai4V1_031BpHwAiImageSegmentationListener13_hidl_onErrorEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f57_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f57);
    console.log("[i] f57 addr: " + f57_p);
    Interceptor.attach(f57_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f57")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f57");
        }
    });

    var f58 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiMMListenerProxy17_hidl_onBuildDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f58_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f58);
    console.log("[i] f58 addr: " + f58_p);
    Interceptor.attach(f58_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f58")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f58");
        }
    });

    var f59 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiMMListenerProxy17_hidl_onStartDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f59_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f59);
    console.log("[i] f59 addr: " + f59_p);
    Interceptor.attach(f59_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f59")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f59");
        }
    });

    var f60 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiMMListenerProxy31_hidl_onSetInputsAndOutputsDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f60_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f60);
    console.log("[i] f60 addr: " + f60_p);
    Interceptor.attach(f60_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f60")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f60");
        }
    });

    var f61 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiMMListenerProxy24_hidl_onStartComputeDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f61_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f61);
    console.log("[i] f61 addr: " + f61_p);
    Interceptor.attach(f61_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f61")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f61");
        }
    });

    var f62 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiMMListenerProxy15_hidl_onRunDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_8hidl_vecINS6_11hidl_handleEEERKNSC_INS3_17TensorDescriptionEEE";
    var f62_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f62);
    console.log("[i] f62 addr: " + f62_p);
    Interceptor.attach(f62_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f62")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f62");
        }
    });

    var f63 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiMMListenerProxy16_hidl_onStopDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f63_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f63);
    console.log("[i] f63 addr: " + f63_p);
    Interceptor.attach(f63_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f63")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f63");
        }
    });

    var f64 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiMMListenerProxy15_hidl_onTimeoutEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_8hidl_vecINS6_11hidl_handleEEE";
    var f64_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f64);
    console.log("[i] f64 addr: " + f64_p);
    Interceptor.attach(f64_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f64")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f64");
        }
    });

    var f65 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiMMListenerProxy13_hidl_onErrorEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f65_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f65);
    console.log("[i] f65 addr: " + f65_p);
    Interceptor.attach(f65_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f65")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f65");
        }
    });

    var f66 = "_ZN6vendor6huawei8hardware2ai4V1_015BpHwAiModelMngr16_hidl_buildModelEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS3_9ModelInfoERKNS6_11hidl_stringE";
    var f66_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f66);
    console.log("[i] f66 addr: " + f66_p);
    Interceptor.attach(f66_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f66")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f66");
        }
    });

    var f67 = "_ZN6vendor6huawei8hardware2ai4V1_015BpHwAiModelMngr24_hidl_startModelFromFileEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_8hidl_vecINS3_16ModelDescriptionEEE";
    var f67_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f67);
    console.log("[i] f67 addr: " + f67_p);
    Interceptor.attach(f67_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f67")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f67");
        }
    });

    var f68 = "_ZN6vendor6huawei8hardware2ai4V1_015BpHwAiModelMngr23_hidl_startModelFromMemEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_8hidl_vecINS3_11ModelBufferEEE";
    var f68_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f68);
    console.log("[i] f68 addr: " + f68_p);
    Interceptor.attach(f68_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f68")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f68");
        }
    });

    var f69 = "_ZN6vendor6huawei8hardware2ai4V1_015BpHwAiModelMngr25_hidl_setInputsAndOutputsEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_11hidl_stringERKNS6_8hidl_vecINS3_21AINeuralNetworkBufferEEESJ_";
    var f69_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f69);
    console.log("[i] f69 addr: " + f69_p);
    Interceptor.attach(f69_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f69")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f69");
        }
    });

    var f70 = "_ZN6vendor6huawei8hardware2ai4V1_015BpHwAiModelMngr18_hidl_startComputeEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_11hidl_stringE";
    var f70_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f70);
    console.log("[i] f70 addr: " + f70_p);
    Interceptor.attach(f70_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f70")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f70");
        }
    });

    var f71 = "_ZN6vendor6huawei8hardware2ai4V1_015BpHwAiModelMngr14_hidl_runModelEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_8hidl_vecINS6_11hidl_handleEEERKNSC_INS3_17TensorDescriptionEEESG_SK_jRKNS6_11hidl_stringE";
    var f71_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f71);
    console.log("[i] f71 addr: " + f71_p);
    Interceptor.attach(f71_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f71")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f71");
        }
    });

    var f72 = "_ZN6vendor6huawei8hardware2ai4V1_015BpHwAiModelMngr15_hidl_stopModelEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f72_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f72);
    console.log("[i] f72 addr: " + f72_p);
    Interceptor.attach(f72_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f72")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f72");
        }
    });

    var f73 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiSRListenerProxy17_hidl_onStartDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f73_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f73);
    console.log("[i] f73 addr: " + f73_p);
    Interceptor.attach(f73_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f73")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f73");
        }
    });

    var f74 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiSRListenerProxy19_hidl_onProcessDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS3_13AIImageBufferE";
    var f74_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f74);
    console.log("[i] f74 addr: " + f74_p);
    Interceptor.attach(f74_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f74")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f74");
        }
    });

    var f75 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiSRListenerProxy16_hidl_onStopDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f75_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f75);
    console.log("[i] f75 addr: " + f75_p);
    Interceptor.attach(f75_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f75")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f75");
        }
    });

    var f76 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiSRListenerProxy15_hidl_onTimeoutEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS3_13AIImageBufferE";
    var f76_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f76);
    console.log("[i] f76 addr: " + f76_p);
    Interceptor.attach(f76_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f76")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f76");
        }
    });

    var f77 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiSRListenerProxy13_hidl_onErrorEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f77_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f77);
    console.log("[i] f77 addr: " + f77_p);
    Interceptor.attach(f77_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f77")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f77");
        }
    });

    var f78 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiSuperResolution11_hidl_startEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEj";
    var f78_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f78);
    console.log("[i] f78 addr: " + f78_p);
    Interceptor.attach(f78_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f78")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f78");
        }
    });

    var f79 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiSuperResolution13_hidl_processEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS3_13AIImageBufferESE_ii";
    var f79_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f79);
    console.log("[i] f79 addr: " + f79_p);
    Interceptor.attach(f79_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f79")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f79");
        }
    });

    var f80 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiSuperResolution10_hidl_stopEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f80_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f80);
    console.log("[i] f80 addr: " + f80_p);
    Interceptor.attach(f80_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f80")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f80");
        }
    });

    var f81 = "_ZN6vendor6huawei8hardware2ai4V1_09BpHwAiASR20_hidl_registerClientEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS3_18IAiRecipientClientEEE";
    var f81_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f81);
    console.log("[i] f81 addr: " + f81_p);
    Interceptor.attach(f81_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f81")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f81");
        }
    });

    var f82 = "_ZN6vendor6huawei8hardware2ai4V1_021BpHwAiSuperResolution12_hidl_cancelEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS3_13AIImageBufferE";
    var f82_p = Module.getExportByName("vendor.huawei.hardware.ai@1.0.so", f82);
    console.log("[i] f82 addr: " + f82_p);
    Interceptor.attach(f82_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f82")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f82");
        }
    });


    var f83 = "_ZN6vendor6huawei8hardware2ai4V1_117BpHwAiASRListener27_hidl_stopRecordingCallbackEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f83_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f83);
    console.log("[i] f83 addr: " + f83_p);
    Interceptor.attach(f83_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f83")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f83");
        }
    });

    var f84 = "_ZN6vendor6huawei8hardware2ai4V1_119BpHwAiEngineService32_hidl_createAiImageFaceDetectionEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f84_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f84);
    console.log("[i] f84 addr: " + f84_p);
    Interceptor.attach(f84_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f84")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f84");
        }
    });

    var f85 = "_ZN6vendor6huawei8hardware2ai4V1_119BpHwAiEngineService32_hidl_removeAiImageFaceDetectionEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f85_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f85);
    console.log("[i] f85 addr: " + f85_p);
    Interceptor.attach(f85_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f85")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f85");
        }
    });

    var f86 = "_ZN6vendor6huawei8hardware2ai4V1_119BpHwAiEngineService37_hidl_createAiImageClassificationV1_1EPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f86_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f86);
    console.log("[i] f86 addr: " + f86_p);
    Interceptor.attach(f86_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f86")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f86");
        }
    });

    var f87 = "_ZN6vendor6huawei8hardware2ai4V1_119BpHwAiEngineService37_hidl_removeAiImageClassificationV1_1EPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f87_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f87);
    console.log("[i] f87 addr: " + f87_p);
    Interceptor.attach(f87_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f87")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f87");
        }
    });

    var f88 = "_ZN6vendor6huawei8hardware2ai4V1_125BpHwAiImageClassification22_hidl_getMaxUsedMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f88_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f88);
    console.log("[i] f88 addr: " + f88_p);
    Interceptor.attach(f88_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f88")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f88");
        }
    });

    var f89 = "_ZN6vendor6huawei8hardware2ai4V1_124BpHwAiImageFaceDetection20_hidl_registerClientEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS2_4V1_018IAiRecipientClientEEE";
    var f89_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f89);
    console.log("[i] f89 addr: " + f89_p);
    Interceptor.attach(f89_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f89")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f89");
        }
    });
    
    var f90 = "_ZN6vendor6huawei8hardware2ai4V1_124BpHwAiImageFaceDetection11_hidl_startEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f90_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f90);
    console.log("[i] f90 addr: " + f90_p);
    Interceptor.attach(f90_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f90")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f90");
        }
    });

    var f91 = "_ZN6vendor6huawei8hardware2ai4V1_124BpHwAiImageFaceDetection13_hidl_processEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEbRKNS2_4V1_013AIImageBufferE";
    var f91_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f91);
    console.log("[i] f91 addr: " + f91_p);
    Interceptor.attach(f91_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f91")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f91");
        }
    });

    var f92 = "_ZN6vendor6huawei8hardware2ai4V1_124BpHwAiImageFaceDetection10_hidl_stopEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f92_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f92);
    console.log("[i] f92 addr: " + f92_p);
    Interceptor.attach(f92_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f92")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f92");
        }
    });

    var f93 = "_ZN6vendor6huawei8hardware2ai4V1_124BpHwAiImageFaceDetection22_hidl_registerListenerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS3_29IAiImageFaceDetectionListenerEEE";
    var f93_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f93);
    console.log("[i] f93 addr: " + f93_p);
    Interceptor.attach(f93_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f93")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f93");
        }
    });

    var f94 = "_ZN6vendor6huawei8hardware2ai4V1_124BpHwAiImageFaceDetection24_hidl_unregisterListenerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f94_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f94);
    console.log("[i] f94 addr: " + f94_p);
    Interceptor.attach(f94_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f94")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f94");
        }
    });

    var f95 = "_ZN6vendor6huawei8hardware2ai4V1_132BpHwAiImageFaceDetectionListener17_hidl_onStartDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f95_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f95);
    console.log("[i] f95 addr: " + f95_p);
    Interceptor.attach(f95_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f95")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f95");
        }
    });

    var f96 = "_ZN6vendor6huawei8hardware2ai4V1_132BpHwAiImageFaceDetectionListener16_hidl_onStopDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f96_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f96);
    console.log("[i] f96 addr: " + f96_p);
    Interceptor.attach(f96_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f96")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f96");
        }
    });

    var f97 = "_ZN6vendor6huawei8hardware2ai4V1_132BpHwAiImageFaceDetectionListener19_hidl_onProcessDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_8hidl_vecINS3_8FdResultEEE";
    var f97_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f97);
    console.log("[i] f97 addr: " + f97_p);
    Interceptor.attach(f97_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f97")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f97");
        }
    });

    var f98 = "_ZN6vendor6huawei8hardware2ai4V1_132BpHwAiImageFaceDetectionListener13_hidl_onErrorEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f98_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f98);
    console.log("[i] f98 addr: " + f98_p);
    Interceptor.attach(f98_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f98")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f98");
        }
    });

    var f99 = "_ZN6vendor6huawei8hardware2ai4V1_123BpHwAiImageSegmentation22_hidl_getMaxUsedMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f99_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f99);
    console.log("[i] f99 addr: " + f99_p);
    Interceptor.attach(f99_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f99")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f99");
        }
    });

    var f100 = "_ZN6vendor6huawei8hardware2ai4V1_121BpHwAiMMListenerProxy21_hidl_onStartTaskDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEii";
    var f100_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f100);
    console.log("[i] f100 addr: " + f100_p);
    Interceptor.attach(f100_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f100")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f100");
        }
    });

    var f101 = "_ZN6vendor6huawei8hardware2ai4V1_121BpHwAiMMListenerProxy19_hidl_onRunTaskDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiiRKNS6_8hidl_vecINS6_11hidl_handleEEERKNSC_INS2_4V1_017TensorDescriptionEEE";
    var f101_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f101);
    console.log("[i] f101 addr: " + f101_p);
    Interceptor.attach(f101_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f101")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f101");
        }
    });

    var f102 = "_ZN6vendor6huawei8hardware2ai4V1_121BpHwAiMMListenerProxy20_hidl_onStopTaskDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEii";
    var f102_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f102);
    console.log("[i] f102 addr: " + f102_p);
    Interceptor.attach(f102_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f102")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f102");
        }
    });

    var f103 = "_ZN6vendor6huawei8hardware2ai4V1_121BpHwAiMMListenerProxy22_hidl_onRunTaskTimeoutEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiiRKNS6_8hidl_vecINS6_11hidl_handleEEE";
    var f103_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f103);
    console.log("[i] f103 addr: " + f103_p);
    Interceptor.attach(f103_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f103")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f103");
        }
    });

    var f104 = "_ZN6vendor6huawei8hardware2ai4V1_121BpHwAiMMListenerProxy17_hidl_onTaskErrorEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiii";
    var f104_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f104);
    console.log("[i] f104 addr: " + f104_p);
    Interceptor.attach(f104_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f104")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f104");
        }
    });

    var f105 = "_ZN6vendor6huawei8hardware2ai4V1_121BpHwAiMMListenerProxy35_hidl_onSetInputsAndOutputsTaskDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEii";
    var f105_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f105);
    console.log("[i] f105 addr: " + f105_p);
    Interceptor.attach(f105_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f105")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f105");
        }
    });

    var f106 = "_ZN6vendor6huawei8hardware2ai4V1_121BpHwAiMMListenerProxy28_hidl_onStartComputeTaskDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEii";
    var f106_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f106);
    console.log("[i] f106 addr: " + f106_p);
    Interceptor.attach(f106_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f106")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f106");
        }
    });

    var f107 = "_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr22_hidl_registerInstanceEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEib";
    var f107_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f107);
    console.log("[i] f107 addr: " + f107_p);
    Interceptor.attach(f107_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f107")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f107");
        }
    });

    var f108 = "_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr24_hidl_unregisterInstanceEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f108_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f108);
    console.log("[i] f108 addr: " + f108_p);
    Interceptor.attach(f108_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f108")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f108");
        }
    });

    var f109 = "_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr25_hidl_startModelFromFile2EPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiiRKNS6_8hidl_vecINS2_4V1_016ModelDescriptionEEE";
    var f109_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f109);
    console.log("[i] f109 addr: " + f109_p);
    Interceptor.attach(f109_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f109")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f109");
        }
    });

    var f110 = "_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr24_hidl_startModelFromMem2EPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiiRKNS6_8hidl_vecINS2_4V1_011ModelBufferEEE";
    var f110_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f110);
    console.log("[i] f110 addr: " + f110_p);
    Interceptor.attach(f110_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f110")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f110");
        }
    });

    var f111 = "_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr15_hidl_runModel2EPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiiRKNS6_8hidl_vecINS6_11hidl_handleEEERKNSC_INS2_4V1_017TensorDescriptionEEESG_SL_jRKNS6_11hidl_stringE";
    var f111_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f111);
    console.log("[i] f111 addr: " + f111_p);
    Interceptor.attach(f111_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f111")
            console.log('f111 called from:\n' +
                Thread.backtrace(this.context, Backtracer.ACCURATE)
                .map(DebugSymbol.fromAddress).join('\n') + '\n');
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f111");
        }
    });

    var f112 = "_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr16_hidl_stopModel2EPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEii";
    var f112_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f112);
    console.log("[i] f112 addr: " + f112_p);
    Interceptor.attach(f112_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f112")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f112");
        }
    });

    var f113 = "_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr26_hidl_setInputsAndOutputs2EPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiiRKNS6_11hidl_stringERKNS6_8hidl_vecINS2_4V1_021AINeuralNetworkBufferEEESK_";
    var f113_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f113);
    console.log("[i] f113 addr: " + f113_p);
    Interceptor.attach(f113_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f113")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f113");
        }
    });

    var f114 = "_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr19_hidl_startCompute2EPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiiRKNS6_11hidl_stringE";
    var f114_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f114);
    console.log("[i] f114 addr: " + f114_p);
    Interceptor.attach(f114_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f114")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f114");
        }
    });

    var f115 = "_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr20_hidl_getModelTensorEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiiRKNS6_11hidl_stringENSt3__18functionIFvRKNS6_8hidl_vecINS2_4V1_017TensorDescriptionEEESM_EEE";
    var f115_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f115);
    console.log("[i] f115 addr: " + f115_p);
    Interceptor.attach(f115_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f115")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f115");
        }
    });

    var f116 = "_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr22_hidl_getMaxUsedMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEii";
    var f116_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f116);
    console.log("[i] f116 addr: " + f116_p);
    Interceptor.attach(f116_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f116")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f116");
        }
    });

    var f117 = "_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr21_hidl_checkModelValidEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEii";
    var f117_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f117);
    console.log("[i] f117 addr: " + f117_p);
    Interceptor.attach(f117_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f117")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f117");
        }
    });

    var f118 = "_ZN6vendor6huawei8hardware2ai4V1_115BpHwAiModelMngr29_hidl_checkModelCompatibilityEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiiRKNS2_4V1_011ModelBufferE";
    var f118_p = Module.getExportByName("vendor.huawei.hardware.ai@1.1.so", f118);
    console.log("[i] f118 addr: " + f118_p);
    Interceptor.attach(f118_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f118")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f118");
        }
    });

var f119 = "_ZN6vendor6huawei8hardware2ai4V1_219BpHwAiEngineService29_hidl_createAiObjectDetectionEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f119_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f119);
    console.log("[i] f119 addr: " + f119_p);
    Interceptor.attach(f119_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f119")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f119");
        }
    });

    var f120 = "_ZN6vendor6huawei8hardware2ai4V1_219BpHwAiEngineService29_hidl_removeAiObjectDetectionEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f120_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f120);
    console.log("[i] f120 addr: " + f120_p);
    Interceptor.attach(f120_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f120")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f120");
        }
    });

    var f121 = "_ZN6vendor6huawei8hardware2ai4V1_219BpHwAiEngineService29_hidl_createAiFoodRecognitionEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f121_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f121);
    console.log("[i] f121 addr: " + f121_p);
    Interceptor.attach(f121_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f121")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f121");
        }
    });

    var f122 = "_ZN6vendor6huawei8hardware2ai4V1_219BpHwAiEngineService29_hidl_removeAiFoodRecognitionEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f122_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f122);
    console.log("[i] f122 addr: " + f122_p);
    Interceptor.attach(f122_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f122")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f122");
        }
    });

    var f123 = "_ZN6vendor6huawei8hardware2ai4V1_219BpHwAiEngineService19_hidl_createAiStatsEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f123_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f123);
    console.log("[i] f123 addr: " + f123_p);
    Interceptor.attach(f123_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f123")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f123");
        }
    });


    var f124 = "_ZN6vendor6huawei8hardware2ai4V1_219BpHwAiEngineService19_hidl_removeAiStatsEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f124_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f124);
    console.log("[i] f124 addr: " + f124_p);
    Interceptor.attach(f124_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f124")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f124");
        }
    });


    var f125 = "_ZN6vendor6huawei8hardware2ai4V1_219BpHwAiEngineService28_hidl_createAiPoseEstimationEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f125_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f125);
    console.log("[i] f125 addr: " + f125_p);
    Interceptor.attach(f125_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f125")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f125");
        }
    });
    

    var f126 = "_ZN6vendor6huawei8hardware2ai4V1_219BpHwAiEngineService28_hidl_removeAiPoseEstimationEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f126_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f126);
    console.log("[i] f126 addr: " + f126_p);
    Interceptor.attach(f126_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f126")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f126");
        }
    });
  

    var f127 = "_ZN6vendor6huawei8hardware2ai4V1_221BpHwAiFoodRecognition20_hidl_registerClientEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS2_4V1_018IAiRecipientClientEEE";
    var f127_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f127);
    console.log("[i] f127 addr: " + f127_p);
    Interceptor.attach(f127_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f127")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f127");
        }
    });
  

    var f128 = "_ZN6vendor6huawei8hardware2ai4V1_221BpHwAiFoodRecognition11_hidl_startEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f128_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f128);
    console.log("[i] f128 addr: " + f128_p);
    Interceptor.attach(f128_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f128")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f128");
        }
    });
  

    var f129 = "_ZN6vendor6huawei8hardware2ai4V1_221BpHwAiFoodRecognition13_hidl_processEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS2_4V1_013AIImageBufferE";
    var f129_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f129);
    console.log("[i] f129 addr: " + f129_p);
    Interceptor.attach(f129_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f129")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f129");
        }
    });
  
    var f130 = "_ZN6vendor6huawei8hardware2ai4V1_221BpHwAiFoodRecognition10_hidl_stopEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f130_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f130);
    console.log("[i] f130 addr: " + f130_p);
    Interceptor.attach(f130_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f130")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f130");
        }
    });
  

    var f131 = "_ZN6vendor6huawei8hardware2ai4V1_221BpHwAiFoodRecognition22_hidl_registerListenerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS3_26IAiFoodRecognitionListenerEEE";
    var f131_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f131);
    console.log("[i] f131 addr: " + f131_p);
    Interceptor.attach(f131_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f131")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f131");
        }
    });
  

    var f132 = "_ZN6vendor6huawei8hardware2ai4V1_221BpHwAiFoodRecognition24_hidl_unregisterListenerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f132_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f132);
    console.log("[i] f132 addr: " + f132_p);
    Interceptor.attach(f132_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f132")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f132");
        }
    });
  

    var f133 = "_ZN6vendor6huawei8hardware2ai4V1_229BpHwAiFoodRecognitionListener17_hidl_onStartDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f133_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f133);
    console.log("[i] f133 addr: " + f133_p);
    Interceptor.attach(f133_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f133")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f133");
        }
    });
  

    var f134 = "_ZN6vendor6huawei8hardware2ai4V1_229BpHwAiFoodRecognitionListener19_hidl_onProcessDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_8hidl_vecINS3_21FoodRecognitionResultEEERKNSC_IfEE";
    var f134_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f134);
    console.log("[i] f134 addr: " + f134_p);
    Interceptor.attach(f134_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f134")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f134");
        }
    });
  

    var f135 = "_ZN6vendor6huawei8hardware2ai4V1_229BpHwAiFoodRecognitionListener16_hidl_onStopDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f135_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f135);
    console.log("[i] f135 addr: " + f135_p);
    Interceptor.attach(f135_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f135")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f135");
        }
    });
  

    var f136 = "_ZN6vendor6huawei8hardware2ai4V1_229BpHwAiFoodRecognitionListener13_hidl_onErrorEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f136_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f136);
    console.log("[i] f136 addr: " + f136_p);
    Interceptor.attach(f136_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f136")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f136");
        }
    });
  

    var f137 = "_ZN6vendor6huawei8hardware2ai4V1_224BpHwAiImageFaceDetection15_hidl_fsProcessEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS2_4V1_013AIImageBufferE";
    var f137_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f137);
    console.log("[i] f137 addr: " + f137_p);
    Interceptor.attach(f137_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f137")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f137");
        }
    });
  

    var f138 = "_ZN6vendor6huawei8hardware2ai4V1_224BpHwAiImageFaceDetection17_hidl_faceProcessEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS2_4V1_013AIImageBufferERKNS6_8hidl_vecINS3_8FsResultEEE";
    var f138_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f138);
    console.log("[i] f138 addr: " + f138_p);
    Interceptor.attach(f138_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f138")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f138");
        }
    });
  

    var f139 = "_ZN6vendor6huawei8hardware2ai4V1_232BpHwAiImageFaceDetectionListener21_hidl_onFsProcessDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_8hidl_vecINS3_8FsResultEEE";
    var f139_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f139);
    console.log("[i] f139 addr: " + f139_p);
    Interceptor.attach(f139_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f139")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f139");
        }
    });
  

    var f140 = "_ZN6vendor6huawei8hardware2ai4V1_221BpHwAiObjectDetection20_hidl_registerClientEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS2_4V1_018IAiRecipientClientEEE";
    var f140_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f140);
    console.log("[i] f140 addr: " + f140_p);
    Interceptor.attach(f140_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f140")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f140");
        }
    });
  

    var f141 = "_ZN6vendor6huawei8hardware2ai4V1_221BpHwAiObjectDetection11_hidl_startEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f141_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f141);
    console.log("[i] f141 addr: " + f141_p);
    Interceptor.attach(f141_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f141")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f141");
        }
    });
  

    var f142 = "_ZN6vendor6huawei8hardware2ai4V1_221BpHwAiObjectDetection13_hidl_processEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS2_4V1_013AIImageBufferE";
    var f142_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f142);
    console.log("[i] f142 addr: " + f142_p);
    Interceptor.attach(f142_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f142")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f142");
        }
    });
  

    var f143 = "_ZN6vendor6huawei8hardware2ai4V1_221BpHwAiObjectDetection10_hidl_stopEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f143_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f143);
    console.log("[i] f143 addr: " + f143_p);
    Interceptor.attach(f143_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f143")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f143");
        }
    });
  

    var f144 = "_ZN6vendor6huawei8hardware2ai4V1_221BpHwAiObjectDetection22_hidl_registerListenerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS3_26IAiObjectDetectionListenerEEE";
    var f144_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f144);
    console.log("[i] f144 addr: " + f144_p);
    Interceptor.attach(f144_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f144")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f144");
        }
    });
  

    var f145 = "_ZN6vendor6huawei8hardware2ai4V1_221BpHwAiObjectDetection24_hidl_unregisterListenerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f145_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f145);
    console.log("[i] f145 addr: " + f145_p);
    Interceptor.attach(f145_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f145")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f145");
        }
    });
  

    var f146 = "_ZN6vendor6huawei8hardware2ai4V1_229BpHwAiObjectDetectionListener17_hidl_onStartDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f146_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f146);
    console.log("[i] f146 addr: " + f146_p);
    Interceptor.attach(f146_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f146")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f146");
        }
    });
  
    var f147 = "_ZN6vendor6huawei8hardware2ai4V1_229BpHwAiObjectDetectionListener16_hidl_onStopDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f147_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f147);
    console.log("[i] f147 addr: " + f147_p);
    Interceptor.attach(f147_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f147")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f147");
        }
    });
  

    var f148 = "_ZN6vendor6huawei8hardware2ai4V1_229BpHwAiObjectDetectionListener19_hidl_onProcessDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_8hidl_vecINS3_8OdResultEEE";
    var f148_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f148);
    console.log("[i] f148 addr: " + f148_p);
    Interceptor.attach(f148_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f148")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f148");
        }
    });
  

    var f149 = "_ZN6vendor6huawei8hardware2ai4V1_229BpHwAiObjectDetectionListener13_hidl_onErrorEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f149_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f149);
    console.log("[i] f149 addr: " + f149_p);
    Interceptor.attach(f149_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f149")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f149");
        }
    });

    var f150 = "_ZN6vendor6huawei8hardware2ai4V1_220BpHwAiPoseEstimation20_hidl_registerClientEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS2_4V1_018IAiRecipientClientEEE";
    var f150_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f150);
    console.log("[i] f150 addr: " + f150_p);
    Interceptor.attach(f150_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f150")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f150");
        }
    });
  

    var f151 = "_ZN6vendor6huawei8hardware2ai4V1_220BpHwAiPoseEstimation11_hidl_startEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f151_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f151);
    console.log("[i] f151 addr: " + f151_p);
    Interceptor.attach(f151_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f151")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f151");
        }
    });
  

    var f152 = "_ZN6vendor6huawei8hardware2ai4V1_220BpHwAiPoseEstimation13_hidl_processEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS2_4V1_013AIImageBufferE";
    var f152_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f152);
    console.log("[i] f152 addr: " + f152_p);
    Interceptor.attach(f152_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f152")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f152");
        }
    });
  

    var f153 = "_ZN6vendor6huawei8hardware2ai4V1_220BpHwAiPoseEstimation10_hidl_stopEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f153_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f153);
    console.log("[i] f153 addr: " + f153_p);
    Interceptor.attach(f153_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f153")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f153");
        }
    });
  

    var f154 = "_ZN6vendor6huawei8hardware2ai4V1_220BpHwAiPoseEstimation22_hidl_registerListenerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS3_25IAiPoseEstimationListenerEEE";
    var f154_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f154);
    console.log("[i] f154 addr: " + f154_p);
    Interceptor.attach(f154_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f154")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f154");
        }
    });
  

    var f155 = "_ZN6vendor6huawei8hardware2ai4V1_220BpHwAiPoseEstimation24_hidl_unregisterListenerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f155_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f155);
    console.log("[i] f155 addr: " + f155_p);
    Interceptor.attach(f155_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f155")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f155");
        }
    });
  

    var f156 = "_ZN6vendor6huawei8hardware2ai4V1_228BpHwAiPoseEstimationListener17_hidl_onStartDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f156_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f156);
    console.log("[i] f156 addr: " + f156_p);
    Interceptor.attach(f156_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f156")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f156");
        }
    });
  

    var f157 = "_ZN6vendor6huawei8hardware2ai4V1_228BpHwAiPoseEstimationListener19_hidl_onProcessDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_8hidl_vecINS3_20PoseEstimationResultEEE";
    var f157_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f157);
    console.log("[i] f157 addr: " + f157_p);
    Interceptor.attach(f157_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f157")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f157");
        }
    });
  

    var f158 = "_ZN6vendor6huawei8hardware2ai4V1_228BpHwAiPoseEstimationListener16_hidl_onStopDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorE";
    var f158_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f158);
    console.log("[i] f158 addr: " + f158_p);
    Interceptor.attach(f158_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f158")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f158");
        }
    });
  

    var f159 = "_ZN6vendor6huawei8hardware2ai4V1_228BpHwAiPoseEstimationListener13_hidl_onErrorEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f159_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f159);
    console.log("[i] f159 addr: " + f159_p);
    Interceptor.attach(f159_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f159")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f159");
        }
    });
  

    var f160 = "_ZN6vendor6huawei8hardware2ai4V1_211BpHwAiStats20_hidl_registerClientEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS2_4V1_018IAiRecipientClientEEE";
    var f160_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f160);
    console.log("[i] f160 addr: " + f160_p);
    Interceptor.attach(f160_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f160")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f160");
        }
    });
  

    var f161 = "_ZN6vendor6huawei8hardware2ai4V1_211BpHwAiStats30_hidl_openEngineStatsLogSwitchEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorENS3_10EngineTypeE";
    var f161_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f161);
    console.log("[i] f161 addr: " + f161_p);
    Interceptor.attach(f161_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f161")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f161");
        }
    });
  

    var f162 = "_ZN6vendor6huawei8hardware2ai4V1_211BpHwAiStats31_hidl_closeEngineStatsLogSwitchEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorENS3_10EngineTypeE";
    var f162_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f162);
    console.log("[i] f162 addr: " + f162_p);
    Interceptor.attach(f162_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f162")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f162");
        }
    });
  

    var f163 = "_ZN6vendor6huawei8hardware2ai4V1_211BpHwAiStats34_hidl_setEngineStatsLogReserveTimeEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEjNS3_10EngineTypeE";
    var f163_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f163);
    console.log("[i] f163 addr: " + f163_p);
    Interceptor.attach(f163_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f163")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f163");
        }
    });
  

    var f164 = "_ZN6vendor6huawei8hardware2ai4V1_211BpHwAiStats27_hidl_getEngineStatsLogSizeEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorENS3_10EngineTypeE";
    var f164_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f164);
    console.log("[i] f164 addr: " + f164_p);
    Interceptor.attach(f164_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f164")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f164");
        }
    });
  

    var f165 = "_ZN6vendor6huawei8hardware2ai4V1_211BpHwAiStats23_hidl_getEngineStatsLogEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS6_11hidl_handleEjNS3_10EngineTypeE";
    var f165_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f165);
    console.log("[i] f165 addr: " + f165_p);
    Interceptor.attach(f165_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f165")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f165");
        }
    });


    var f166 = "_ZN6vendor6huawei8hardware2ai4V1_211BpHwAiStats26_hidl_deleteEngineStatsLogEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorENS3_10EngineTypeE";
    var f166_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f166);
    console.log("[i] f166 addr: " + f166_p);
    Interceptor.attach(f166_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f166")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f166");
        }
    });
  

    var f167 = "_ZN6vendor6huawei8hardware2ai4V1_211BpHwAiStats23_hidl_hasEngineStatsLogEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorENS3_10EngineTypeE";
    var f167_p = Module.getExportByName("vendor.huawei.hardware.ai@1.2.so", f167);
    console.log("[i] f167 addr: " + f167_p);
    Interceptor.attach(f167_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f167")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f167");
        }
    });
  

    var f168 = "_ZN6vendor6huawei8hardware2ai4V1_319BpHwAiEngineService27_hidl_createAiModelMngr_1_3EPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorERKNS5_2spINS2_4V1_018IAiMMListenerProxyEEERKNSC_INS3_22IAiMMMemAllocatorProxyEEEj";
    var f168_p = Module.getExportByName("vendor.huawei.hardware.ai@1.3.so", f168);
    console.log("[i] f168 addr: " + f168_p);

    var f168_1_p = f168_p.add(0x16CF8).sub(0x16B3C);
    console.log("[i] f168_1 addr: " + f168_1_p + ", inst: " + Instruction.parse(f168_1_p).toString());

//    var BpHwBinder_transact_p = Module.getExportByName("libhidlbase.so",
//        '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    var BpHwBinder_transact_p = Module.getExportByName("/system/lib64/vndk-sp-29/libhidlbase.so",
        '_ZN7android8hardware10BpHwBinder8transactEjRKNS0_6ParcelEPS2_jNSt3__18functionIFvRS2_EEE');
    console.log("[i] BpHwBinder::transact addr: " + BpHwBinder_transact_p)

    Interceptor.attach(f168_1_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f168_1");
            // blr x8

            console.log("[i] belongs to module: " + Process.getModuleByAddress(BpHwBinder_transact_p).name)

            console.log(hexdump(BpHwBinder_transact_p, {
                offset: 0,
                length: 0x40,
                header: true,
                ansi: true
            }));

            console.log(hexdump(this.context.x8, {
                offset: 0,
                length: 0x40,
                header: true,
                ansi: true
            }));

            console.log("[i] x8 value: " + this.context.x8);
            var module = Process.getModuleByAddress(this.context.x8)
            console.log("[i] belongs to module: " + module.name)

            var exports = module.enumerateExports();
            console.log("[i] export length: " + exports.length);
            for (var i = 0; i < exports.length; i ++)
            {
                console.log(exports[i].address + ": " + exports[i].name);
            }

            // Memory.readCString(this.context.r7)

        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f168_1");
        }
    });


    Interceptor.attach(f168_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f168")
            console.log('f168 called from:\n' +
                Thread.backtrace(this.context, Backtracer.ACCURATE)
                .map(DebugSymbol.fromAddress).join('\n') + '\n');
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f168");
        }
    });
  

    var f169 = "_ZN6vendor6huawei8hardware2ai4V1_325BpHwAiMMMemAllocatorProxy16_hidl_onAllocateEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEimiNSt3__18functionIFvRKNS6_11hidl_memoryEEEE";
    var f169_p = Module.getExportByName("vendor.huawei.hardware.ai@1.3.so", f169);
    console.log("[i] f169 addr: " + f169_p);
    Interceptor.attach(f169_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f169")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f169");
        }
    });
  

    var f170 = "_ZN6vendor6huawei8hardware2ai4V1_325BpHwAiMMMemAllocatorProxy12_hidl_onFreeEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_memoryE";
    var f170_p = Module.getExportByName("vendor.huawei.hardware.ai@1.3.so", f170);
    console.log("[i] f170 addr: " + f170_p);
    Interceptor.attach(f170_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f170")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f170");
        }
    });
  




    var f171 = "_ZN6vendor6huawei8hardware2ai4V2_019BpHwAIListener_hidl19_hidl_OnProcessDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringERKNS6_8hidl_vecINS3_14hiai_data_hidlEEE";
    var f171_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f171);
    console.log("[i] f171 addr: " + f171_p);
    Interceptor.attach(f171_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f171")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f171");
        }
    });
 

    var f172 = "_ZN6vendor6huawei8hardware2ai4V2_018BpHwAIService_hidl10_hidl_InitEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringESE_RKNS6_8hidl_vecINS3_15hiai_model_hidlEEE";
    var f172_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f172);
    console.log("[i] f172 addr: " + f172_p);
    Interceptor.attach(f172_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f172")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f172");
        }
    });
 

    var f173 = "_ZN6vendor6huawei8hardware2ai4V2_018BpHwAIService_hidl13_hidl_ProcessEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringERKNS6_8hidl_vecINS3_14hiai_data_hidlEEESJ_i";
    var f173_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f173);
    console.log("[i] f173 addr: " + f173_p);
    Interceptor.attach(f173_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f173")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f173");
        }
    });
 

    var f174 = "_ZN6vendor6huawei8hardware2ai4V2_018BpHwAIService_hidl17_hidl_SetListenerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS5_2spINS3_16IAIListener_hidlEEE";
    var f174_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f174);
    console.log("[i] f174 addr: " + f174_p);
    Interceptor.attach(f174_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f174")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f174");
        }
    });
 

    var f175 = "_ZN6vendor6huawei8hardware2ai4V2_018BpHwAIService_hidl12_hidl_UnInitEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f175_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f175);
    console.log("[i] f175 addr: " + f175_p);
    Interceptor.attach(f175_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f175")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f175");
        }
    });
 

    var f176 = "_ZN6vendor6huawei8hardware2ai4V2_028BpHwModelManagerService_hidl10_hidl_InitEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringESE_RKNS6_8hidl_vecINS3_15hiai_model_hidlEEE";
    var f176_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f176);
    console.log("[i] f176 addr: " + f176_p);
    Interceptor.attach(f176_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f176")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f176");
        }
    });
 

    var f177 = "_ZN6vendor6huawei8hardware2ai4V2_028BpHwModelManagerService_hidl13_hidl_ProcessEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringERKNS6_8hidl_vecINS3_14hiai_data_hidlEEESJ_i";
    var f177_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f177);
    console.log("[i] f177 addr: " + f177_p);
    Interceptor.attach(f177_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f177")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f177");
        }
    });
 

    var f178 = "_ZN6vendor6huawei8hardware2ai4V2_028BpHwModelManagerService_hidl17_hidl_SetListenerEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS5_2spINS3_16IAIListener_hidlEEE";
    var f178_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f178);
    console.log("[i] f178 addr: " + f178_p);
    Interceptor.attach(f178_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f178")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f178");
        }
    });
 

    var f179 = "_ZN6vendor6huawei8hardware2ai4V2_028BpHwModelManagerService_hidl12_hidl_UnInitEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f179_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f179);
    console.log("[i] f179 addr: " + f179_p);
    Interceptor.attach(f179_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f179")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f179");
        }
    });
 

    var f180 = "_ZN6vendor6huawei8hardware2ai4V2_028BpHwModelManagerService_hidl22_hidl_GetMaxUsedMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f180_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f180);
    console.log("[i] f180 addr: " + f180_p);
    Interceptor.attach(f180_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f180")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f180");
        }
    });
 

    var f181 = "_ZN6vendor6huawei8hardware2ai4V2_028BpHwModelManagerService_hidl25_hidl_SetInputsAndOutputsEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringERKNS6_8hidl_vecINS3_14hiai_data_hidlEEESJ_";
    var f181_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f181);
    console.log("[i] f181 addr: " + f181_p);
    Interceptor.attach(f181_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f181")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f181");
        }
    });
 

    var f182 = "_ZN6vendor6huawei8hardware2ai4V2_028BpHwModelManagerService_hidl18_hidl_StartComputeEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringE";
    var f182_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f182);
    console.log("[i] f182 addr: " + f182_p);
    Interceptor.attach(f182_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f182")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f182");
        }
    });
 

    var f183 = "_ZN6vendor6huawei8hardware2ai4V2_028BpHwModelManagerService_hidl25_hidl_GetModelIOTensorDimEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringENSt3__18functionIFvRKNS6_8hidl_vecINS3_23tensor_description_hidlEEESL_iEEE";
    var f183_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f183);
    console.log("[i] f183 addr: " + f183_p);
    Interceptor.attach(f183_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f183")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f183");
        }
    });
 

    var f184 = "_ZN6vendor6huawei8hardware2ai4V2_028BpHwModelManagerService_hidl21_hidl_CheckModelValidEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEi";
    var f184_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f184);
    console.log("[i] f184 addr: " + f184_p);
    Interceptor.attach(f184_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f184")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f184");
        }
    });
 

    var f185 = "_ZN6vendor6huawei8hardware2ai4V2_028BpHwModelManagerService_hidl29_hidl_CheckModelCompatibilityEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS3_15hiai_model_hidlE";
    var f185_p = Module.getExportByName("vendor.huawei.hardware.ai@2.0.so", f185);
    console.log("[i] f185 addr: " + f185_p);
    Interceptor.attach(f185_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f185")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f185");
        }
    });
 

    var f186 = "_ZN6vendor6huawei8hardware2ai4V2_122BpHwDebugListener_hidl19_hidl_OnProcessDoneEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_handleE";
    var f186_p = Module.getExportByName("vendor.huawei.hardware.ai@2.1.so", f186);
    console.log("[i] f186 addr: " + f186_p);
    Interceptor.attach(f186_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f186")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f186");
        }
    });
 
    var f187 = "_ZN6vendor6huawei8hardware2ai4V2_121BpHwDebugService_hidl13_hidl_DebugOnEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringERKNS6_11hidl_handleERKNS5_2spINS3_19IDebugListener_hidlEEE";
    var f187_p = Module.getExportByName("vendor.huawei.hardware.ai@2.1.so", f187);
    console.log("[i] f187 addr: " + f187_p);
    Interceptor.attach(f187_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f187")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f187");
        }
    });
 

    var f188 = "_ZN6vendor6huawei8hardware2ai4V2_121BpHwDebugService_hidl14_hidl_DebugOffEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringE";
    var f188_p = Module.getExportByName("vendor.huawei.hardware.ai@2.1.so", f188);
    console.log("[i] f188 addr: " + f188_p);
    Interceptor.attach(f188_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f188")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f188");
        }
    });
 

    var f189 = "_ZN6vendor6huawei8hardware2ai4V2_128BpHwModelManagerService_hidl16_hidl_BuildModelEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEjRKNS6_11hidl_stringEjRKNS6_8hidl_vecINS2_4V2_015hiai_model_hidlEEERKSH_NSt3__18functionIFvjiEEE";
    var f189_p = Module.getExportByName("vendor.huawei.hardware.ai@2.1.so", f189);
    console.log("[i] f189 addr: " + f189_p);
    Interceptor.attach(f189_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f189")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f189");
        }
    });
 

    var f190 = "_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr22_hidl_getModelTensorV2EPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiiRKNS6_11hidl_stringENSt3__18functionIFvRKNS6_8hidl_vecINS3_19TensorDescriptionV2EEESL_EEE";
    var f190_p = Module.getExportByName("vendor.huawei.hardware.ai@3.0.so", f190);
    console.log("[i] f190 addr: " + f190_p);
    Interceptor.attach(f190_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f190")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f190");
        }
    });
 

    var f191 = "_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr17_hidl_allocMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEiNSt3__18functionIFviRKNS6_11hidl_memoryEEEE";
    var f191_p = Module.getExportByName("vendor.huawei.hardware.ai@3.0.so", f191);
    console.log("[i] f191 addr: " + f191_p);
    Interceptor.attach(f191_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f191")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f191");
        }
    });
 

    var f192 = "_ZN6vendor6huawei8hardware2ai4V3_015BpHwAiModelMngr16_hidl_freeMemoryEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringERKNS6_11hidl_memoryE";
    var f192_p = Module.getExportByName("vendor.huawei.hardware.ai@3.0.so", f192);
    console.log("[i] f192 addr: " + f192_p);
    Interceptor.attach(f192_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f192")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f192");
        }
    });
 


    var f193 = "_ZN6vendor6huawei8hardware2ai4V3_115BpHwAiModelMngr23_hidl_getTensorAippInfoEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiiRKNS6_11hidl_stringEjNSt3__18functionIFvjjEEE";
    var f193_p = Module.getExportByName("vendor.huawei.hardware.ai@3.1.so", f193);
    console.log("[i] f193 addr: " + f193_p);
    Interceptor.attach(f193_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f193")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f193");
        }
    });
 

    var f194 = "_ZN6vendor6huawei8hardware2ai4V3_115BpHwAiModelMngr24_hidl_getTensorAippParasEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiiRKNS6_11hidl_stringEjRKNS6_8hidl_vecINS6_11hidl_handleEEE";
    var f194_p = Module.getExportByName("vendor.huawei.hardware.ai@3.1.so", f194);
    console.log("[i] f194 addr: " + f194_p);
    Interceptor.attach(f194_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f194")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f194");
        }
    });
 

    var f195 = "_ZN6vendor6huawei8hardware2ai4V3_115BpHwAiModelMngr18_hidl_runAippModelEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiiRKNS6_8hidl_vecINS6_11hidl_handleEEERKNSC_INS2_4V1_017TensorDescriptionEEESG_RKNSC_INS3_12AippPositionEEESG_SL_jRKNS6_11hidl_stringE";
    var f195_p = Module.getExportByName("vendor.huawei.hardware.ai@3.1.so", f195);
    console.log("[i] f195 addr: " + f195_p);
    Interceptor.attach(f195_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f195")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f195");
        }
    });
 


    var f196 = "_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr26_hidl_registerInstance_3_2EPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEibb";
    var f196_p = Module.getExportByName("vendor.huawei.hardware.ai@3.2.so", f196);
    console.log("[i] f196 addr: " + f196_p);
    Interceptor.attach(f196_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f196")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f196");
        }
    });
 

    var f197 = "_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr22_hidl_setModelPriorityEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringEi";
    var f197_p = Module.getExportByName("vendor.huawei.hardware.ai@3.2.so", f197);
    console.log("[i] f197 addr: " + f197_p);
    Interceptor.attach(f197_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f197")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f197");
        }
    });
 

    var f198 = "_ZN6vendor6huawei8hardware2ai4V3_215BpHwAiModelMngr19_hidl_cancelComputeEPN7android8hardware10IInterfaceEPNS6_7details16HidlInstrumentorEiRKNS6_11hidl_stringE";
    var f198_p = Module.getExportByName("vendor.huawei.hardware.ai@3.2.so", f198);
    console.log("[i] f198 addr: " + f198_p);
    Interceptor.attach(f198_p, {
        onEnter: function(args) {
            console.log("[*] onEnter: f198")
        },

        onLeave: function(retval) {
            console.log("[*] onLeave: f198");
        }
    });
 



});

