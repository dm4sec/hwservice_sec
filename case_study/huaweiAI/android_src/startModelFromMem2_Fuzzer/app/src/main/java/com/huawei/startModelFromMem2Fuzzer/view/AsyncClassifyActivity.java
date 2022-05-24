package com.huawei.startModelFromMem2Fuzzer.view;


import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;

import com.huawei.startModelFromMem2Fuzzer.bean.ModelInfo;
import com.huawei.startModelFromMem2Fuzzer.utils.ModelManager;
import com.huawei.startModelFromMem2Fuzzer.utils.ModelManagerListener;

import static com.huawei.startModelFromMem2Fuzzer.utils.Constant.AI_OK;


public class AsyncClassifyActivity extends NpuClassifyActivity {

    private static final String TAG = AsyncClassifyActivity.class.getSimpleName();


    ModelManagerListener listener = new ModelManagerListener() {

        @Override
        public void onStartDone(final int taskId) {
            Log.e(TAG, " java layer onStartDone: " + taskId);

            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (taskId > 0) {
                        Toast.makeText(AsyncClassifyActivity.this, "load model success. taskId is:" + taskId, Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(AsyncClassifyActivity.this, "load model fail. taskId is:" + taskId, Toast.LENGTH_SHORT).show();
                    }
                }
            });
        }

        @Override
        public void onRunDone(final int taskId, final float[][] output,final float inferencetime) {

            Log.e(TAG, " java layer onRunDone: " + taskId);
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (taskId > 0) {
                        Toast toast = Toast.makeText(AsyncClassifyActivity.this, "run model success. taskId is:" + taskId, Toast.LENGTH_SHORT);
                        CustomToast.showToast(toast, 50);
                        outputData = output;
                        inferenceTime = inferencetime/1000;
                        postProcess(outputData);
                    } else {
                        Toast toast = Toast.makeText(AsyncClassifyActivity.this, "run model fail. taskId is:" + taskId, Toast.LENGTH_SHORT);
                        CustomToast.showToast(toast, 50);
                    }
                }
            });

        }

        @Override
        public void onStopDone(final int taskId) {
            Log.e(TAG, "java layer onStopDone: " + taskId);

            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (taskId > 0) {
                        Toast.makeText(AsyncClassifyActivity.this, "unload model success. taskId is:" + taskId, Toast.LENGTH_SHORT).show();
                    } else {
                        Toast.makeText(AsyncClassifyActivity.this, "unload model fail. taskId is:" + taskId, Toast.LENGTH_SHORT).show();
                    }
                }
            });
        }

        @Override
        public void onTimeout(final int taskId) {
            Log.e(TAG, "java layer onTimeout: " + taskId);
        }

        @Override
        public void onError(final int taskId, final int errCode) {
            Log.e(TAG, "onError:" + taskId + " errCode:" + errCode);
        }

        @Override
        public void onServiceDied() {
            Log.e(TAG, "onServiceDied: ");
        }
    };

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
    }

    @Override
    protected void loadModelFromFile(String offlineModelName, String offlineModelPath,boolean isMixModel) {
        int ret = ModelManager.registerListenerJNI(listener);

        Log.e(TAG, "loadModelFromFile: " + ret + ".. offlineModelPath : "+offlineModelPath+".offlineModelName = "+offlineModelName);
        if (AI_OK == ret) {
            Toast.makeText(this,
                    "load model success.", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(this,
                    "load model fail.", Toast.LENGTH_SHORT).show();
        }
        ModelManager.loadModelFromFileAsync(offlineModelName,offlineModelPath,isMixModel);
    }

    @Override
    protected void loadModelFromBuffer(String offlineModelName, byte[] offlineModelBuffer,boolean isMixModel) {
        int ret = ModelManager.registerListenerJNI(listener);

        Log.e(TAG, "loadModelFromBuffer: " + ret);
        ModelManager.loadModelAsyncFromBuffer(offlineModelName,offlineModelBuffer,isMixModel);
    }

    @Override
    protected void runModel(ModelInfo modelInfo, float[][] inputData) {
        ModelManager.runModelAsync(modelInfo, inputData);
    }

    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        ModelManager.unloadModelAsync();
    }
}
