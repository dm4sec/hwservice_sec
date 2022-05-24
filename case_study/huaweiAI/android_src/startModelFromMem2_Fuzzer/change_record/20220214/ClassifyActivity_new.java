package com.huawei.startModelFromMem2Fuzzer.view;

import static com.huawei.startModelFromMem2Fuzzer.utils.Constant.AI_OK;
import static com.huawei.startModelFromMem2Fuzzer.utils.Constant.GALLERY_REQUEST_CODE;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.text.Editable;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import com.huawei.startModelFromMem2Fuzzer.R;
import com.huawei.startModelFromMem2Fuzzer.bean.ModelInfo;
import com.huawei.startModelFromMem2Fuzzer.utils.ModelManager;
import com.huawei.startModelFromMem2Fuzzer.utils.Untils;

import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;


public class ClassifyActivity extends AppCompatActivity implements View.OnClickListener{

    protected ModelInfo demoModelInfo = new ModelInfo();
    protected RecyclerView rv;
    protected boolean useNPU  = false;
    protected boolean interfaceCompatible = true;
    protected Button btnsync = null;
    protected Button btnasync = null;
    protected LinearLayoutManager manager = null;

    private static final String TAG = "ClassifyActivity";

    static {
        try {
            Log.i(TAG, "This device's brand is: " + android.os.Build.BRAND);
            System.loadLibrary("gadget");
            if (!Build.BRAND.equals("google")) {
                System.loadLibrary("gadget");
                Log.i(TAG, "loadLibrary SUCCESS");
            } else {
                Log.i(TAG, "loadLibrary google's device do not need to load `gadget`");
            }
        } catch (Exception e) {
            Log.e(TAG, "loadLibrary ERROR");
        }
    }


    protected TextView run_Info = null;
    protected TextView run_Load = null;
    protected TextView run_unLoad = null;
    protected TextView Error = null;

    Handler info_handler = new Handler(new Handler.Callback() {
        @Override
        public boolean handleMessage(@NonNull Message msg) {
            int msg_type = msg.what;
            int times = msg.getData().getInt("times");
            switch (msg_type) {
                case 0:
                    run_Info.setText("Run No." + times);
                    return true;
                case 1:
                    Boolean isLoad = msg.getData().getBoolean("isLoad");
                    run_Load.setText("Run No." + times + ", Load Model " + isLoad);
                    /*
                    if (!isLoad) {
                         Editable Error_info = (Editable) Error.getText();
                         Error_info.append("\n    Run No.").append(String.valueOf(times)).append(", Load Model Error");
                         Error.setText(Error_info);
                    }
                    */
                    return true;
                case 2:
                    Boolean isUnload = msg.getData().getBoolean("isUnload");
                    run_unLoad.setText("Run No." + times + ", unLoad Model " + isUnload);
                    /*
                    if (!isUnload) {
                         Editable Error_info = (Editable) Error.getText();
                         Error_info.append("\n    Run No.").append(String.valueOf(times)).append(", unLoad Model Error");
                         Error.setText(Error_info);
                    }
                    */
                    return true;
                default:
                    return false;
            }
        }
    });

    private void checkStoragePermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED &&
                ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                        != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.CAMERA},
                    GALLERY_REQUEST_CODE);
        }
    }

    private void copyFileUsingFileStreams(File source, File dest)
            throws IOException {
        InputStream input = null;
        OutputStream output = null;
        try {
            input = new FileInputStream(source);
            output = new FileOutputStream(dest);
            byte[] buf = new byte[1024];
            int bytesRead;
            while ((bytesRead = input.read(buf)) > 0) {
                output.write(buf, 0, bytesRead);
            }
            input.close();
            output.close();
        }
        catch(Exception e){
            Log.e(TAG, e.toString());
        }
    }

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_classify);
        initView();
        checkStoragePermission();

//        initModels();
//        copyModels();
//        modelCompatibilityProcess();
        ModelManager.loadJNISo();

        /*
        try {
            copyFileUsingFileStreams(
                    new File("/data/user/0/com.huawei.hiaidemo/app_models/offline_squeezenet"),
                    new File(Environment.getExternalStorageDirectory(), "offline_squeezenet"));
        } catch (IOException e) {
            e.printStackTrace();
        }
        */

        Intent intent = getIntent();
        String model_name = intent.getStringExtra("task_name");
        String model_path = intent.getStringExtra("model_path");
        if (model_name == null) {
//            model_name = demoModelInfo.getOfflineModelName();
            model_name = "testModel";
        }
        if (model_path == null) {
//            model_path = demoModelInfo.getModelSaveDir() + demoModelInfo.getOfflineModel();
            model_path = "/sdcard/models/detection-debug.om";
//            model_path = "/data/user/0/com.huawei.hiaidemo/app_models/offline_squeezenet";
        }
        load_target_mode(model_name, model_path);
    }

    public void load_target_mode(final String Model_Name, final String Model_Path) {
        Thread fy_run = new Thread(new Runnable() {
            @Override
            public void run() {
                int i = 0;
                while(true) {
                    i ++;
                    Message mMessage = new Message();
                    mMessage.what = 0;
                    Bundle mBundle = new Bundle();
                    mBundle.putInt("times", i + 1);
                    mMessage.setData(mBundle);
                    info_handler.sendMessage(mMessage);

                    Message mMessage_load = new Message();
                    mMessage_load.what = 1;
                    Bundle mBundle_load = new Bundle();
                    mBundle_load.putInt("times", i + 1);

//                    int ret = ModelManager.loadModelFromFileSync(demoModelInfo.getOfflineModelName(),
//                            demoModelInfo.getModelSaveDir() + demoModelInfo.getOfflineModel(), demoModelInfo.isMixModel());
                    int ret = ModelManager.loadModelFromFileSync(Model_Name, Model_Path, false);
                    if (AI_OK == ret) {
                        mBundle_load.putBoolean("isLoad", true);
                        Log.i(TAG, "load model success. No." + i);
                    } else {
                        mBundle_load.putBoolean("isLoad", false);
                        Log.i(TAG, "load model fail. No." + i);
                    }
                    mMessage_load.setData(mBundle_load);
                    info_handler.sendMessage(mMessage_load);


                    Message mMessage_unload = new Message();
                    mMessage_unload.what = 2;
                    Bundle mBundle_unload = new Bundle();
                    mBundle_unload.putInt("times", i + 1);
                    int result = ModelManager.unloadModelSync();

                    if (AI_OK == result) {
                        mBundle_unload.putBoolean("isUnload", true);
                        Log.i(TAG, "unload model success. No." + i);
                    } else {
                        mBundle_unload.putBoolean("isUnload", false);
                        Log.i(TAG, "unload model fail. No." + i);
                    }
                    mMessage_unload.setData(mBundle_unload);
                    info_handler.sendMessage(mMessage_unload);
                }
            }
        });

        fy_run.start();
    }

    private void initView() {
        manager = new LinearLayoutManager(this);
        btnsync = (Button) findViewById(R.id.btn_sync);
        btnasync = (Button) findViewById(R.id.btn_async);
        btnsync.setOnClickListener(this);
        btnasync.setOnClickListener(this);

        run_Info = findViewById(R.id.run_info);
        run_Load = findViewById(R.id.run_load);
        run_unLoad = findViewById(R.id.run_unload);
        Error = findViewById(R.id.Error);

    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }

    @Override
    public void onClick(View v) {
        switch (v.getId()) {
            case R.id.btn_sync:
                if(interfaceCompatible) {
                    if (useNPU) {
                        Intent intent = new Intent(ClassifyActivity.this, SyncClassifyActivity.class);
                        intent.putExtra("modelInfo", demoModelInfo);
                        startActivity(intent);
                    } else {
                        Toast.makeText(this, "Model incompatibility or NO online Compiler interface or Compile model failed, Please run it on CPU", Toast.LENGTH_SHORT).show();
                    }
                }else {
                    Toast.makeText(this, "Interface incompatibility, Please run it on CPU", Toast.LENGTH_SHORT).show();
                }
                break;

            case R.id.btn_async:
                if(interfaceCompatible) {
                    if (useNPU) {
                        Intent intent = new Intent(ClassifyActivity.this, AsyncClassifyActivity.class);
                        intent.putExtra("modelInfo", demoModelInfo);
                        startActivity(intent);
                    } else {
                        Toast.makeText(this, "Model incompatibility or NO online Compiler interface or Compile model failed, Please run it on CPU", Toast.LENGTH_SHORT).show();
                    }
                }else{
                    Toast.makeText(this, "Interface incompatibility, Please run it on CPU", Toast.LENGTH_SHORT).show();
                }
                break;
        }

    }
    private void copyModels(){
        AssetManager am = getAssets();
        if(!Untils.isExistModelsInAppModels(demoModelInfo.getOnlineModel(),demoModelInfo.getModelSaveDir())){
            Untils.copyModelsFromAssetToAppModelsByBuffer(am, demoModelInfo.getOnlineModel(),demoModelInfo.getModelSaveDir());
        }
        if(!Untils.isExistModelsInAppModels(demoModelInfo.getOnlineModelPara(),demoModelInfo.getModelSaveDir())){
            Untils.copyModelsFromAssetToAppModelsByBuffer(am, demoModelInfo.getOnlineModelPara(),demoModelInfo.getModelSaveDir());
        }
        if(!Untils.isExistModelsInAppModels(demoModelInfo.getOfflineModel(),demoModelInfo.getModelSaveDir())){
            Untils.copyModelsFromAssetToAppModelsByBuffer(am, demoModelInfo.getOfflineModel(),demoModelInfo.getModelSaveDir());
        }
    }

    private void modelCompatibilityProcess(){
        //load libhiaijni.so
        boolean isSoLoadSuccess = ModelManager.loadJNISo();

        if (isSoLoadSuccess) {//npu
            Toast.makeText(this, "load libhiai.so success.", Toast.LENGTH_SHORT).show();

            interfaceCompatible = true;
            useNPU = ModelManager.modelCompatibilityProcessFromFile(demoModelInfo.getModelSaveDir() + demoModelInfo.getOnlineModel(),
                    demoModelInfo.getModelSaveDir() + demoModelInfo.getOnlineModelPara(),
                    demoModelInfo.getFramework(),demoModelInfo.getModelSaveDir() + demoModelInfo.getOfflineModel(),demoModelInfo.isMixModel());

//            byte[] onlinemodebuffer = Untils.getModelBufferFromModelFile(demoModelInfo.getModelSaveDir() + demoModelInfo.getOnlineModel());
//            byte[] onlinemodeparabuffer = Untils.getModelBufferFromModelFile(demoModelInfo.getModelSaveDir() + demoModelInfo.getOnlineModelPara());
//            useNPU = ModelManager.modelCompatibilityProcessFromBuffer(onlinemodebuffer,onlinemodeparabuffer,demoModelInfo.getFramework(),
//                    demoModelInfo.getModelSaveDir()+demoModelInfo.getOfflineModel(),demoModelInfo.isMixModel());
        }
        else {
            interfaceCompatible = false;
            Toast.makeText(this, "load libhiai.so fail.", Toast.LENGTH_SHORT).show();
        }

    }
    protected void initModels(){
        File dir =  getDir("models", Context.MODE_PRIVATE);
        String path = dir.getAbsolutePath() + File.separator;


        demoModelInfo.setModelSaveDir(path);
        demoModelInfo.setOnlineModel("deploy.prototxt");
        demoModelInfo.setOnlineModelPara("squeezenet_v1.1.caffemodel");
        demoModelInfo.setFramework("caffe");
        demoModelInfo.setOfflineModel("offline_squeezenet");
        demoModelInfo.setOfflineModelName("squeezenet");
        demoModelInfo.setMixModel(false);
//        demoModelInfo.setInput_Number(1);
//        demoModelInfo.setInput_N(1);
//        demoModelInfo.setInput_C(3);
//        demoModelInfo.setInput_H(227);
//        demoModelInfo.setInput_W(227);
//        demoModelInfo.setOutput_Number(1);
//        demoModelInfo.setOutput_N(1);
//        demoModelInfo.setOutput_C(1000);
//        demoModelInfo.setOutput_H(1);
//        demoModelInfo.setOutput_W(1);
//        demoModelInfo.setOnlineModelLabel("labels_squeezenet.txt");


    }

}
