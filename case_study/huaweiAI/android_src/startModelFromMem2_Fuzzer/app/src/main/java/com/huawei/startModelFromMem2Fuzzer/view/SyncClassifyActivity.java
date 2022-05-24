package com.huawei.startModelFromMem2Fuzzer.view;


import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.huawei.startModelFromMem2Fuzzer.bean.ModelInfo;
import com.huawei.startModelFromMem2Fuzzer.utils.ModelManager;


import static com.huawei.startModelFromMem2Fuzzer.utils.Constant.AI_OK;


public class SyncClassifyActivity extends NpuClassifyActivity {

    private static final String TAG = SyncClassifyActivity.class.getSimpleName();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void loadModelFromFile(String offlineModelName, String offlineModelPath,boolean isMixModel) {
        int ret = ModelManager.loadModelFromFileSync(offlineModelName,offlineModelPath,isMixModel);
        if (AI_OK == ret) {
            Toast.makeText(SyncClassifyActivity.this,
                    "load model success.", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(SyncClassifyActivity.this,
                    "load model fail.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void loadModelFromBuffer(String offlineModelName, byte[] offlineModelBuffer,boolean isMixModel) {
            int ret = ModelManager.loadModelSyncFromBuffer(offlineModelName,offlineModelBuffer,isMixModel);
        if (AI_OK == ret) {
            Toast.makeText(SyncClassifyActivity.this,
                    "load model success.", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(SyncClassifyActivity.this,
                    "load model fail.", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    protected void runModel(ModelInfo modelInfo, float[][] inputData) {
        long start = System.currentTimeMillis();
        outputData = ModelManager.runModelSync(modelInfo, inputData);
        long end = System.currentTimeMillis();
        inferenceTime = end - start;
        if(outputData == null){
            Log.e(TAG,"runModelSync fail ,outputData is null");
            return;
        }
        Log.i(TAG, "runModel outputdata length : " + outputData.length + "/inferenceTime = "+inferenceTime);

        postProcess(outputData);
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        int result = ModelManager.unloadModelSync();

        if (AI_OK == result) {
            Toast.makeText(this, "unload model success.", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(this, "unload model fail.", Toast.LENGTH_SHORT).show();
        }
    }
}
