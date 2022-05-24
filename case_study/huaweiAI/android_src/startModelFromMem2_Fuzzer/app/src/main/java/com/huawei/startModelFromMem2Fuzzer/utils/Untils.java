package com.huawei.startModelFromMem2Fuzzer.utils;

import android.content.Context;
import android.content.res.AssetManager;
import android.graphics.Bitmap;
import android.util.Log;


import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.ByteArrayOutputStream;
import java.io.Closeable;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;

import static android.graphics.Color.blue;
import static android.graphics.Color.green;
import static android.graphics.Color.red;
import static com.huawei.startModelFromMem2Fuzzer.utils.Constant.meanValueOfBlue;
import static com.huawei.startModelFromMem2Fuzzer.utils.Constant.meanValueOfGreen;
import static com.huawei.startModelFromMem2Fuzzer.utils.Constant.meanValueOfRed;


public class Untils {

    private static final String TAG = Untils.class.getSimpleName();
    private static BufferedInputStream bis = null;
    private static InputStream fileInput = null;
    private static FileOutputStream fileOutput = null;
    private static ByteArrayOutputStream byteOut = null;

    public static byte[] getModelBufferFromModelFile(String modelPath){
        try{
            bis = new BufferedInputStream(new FileInputStream(modelPath));
            byteOut = new ByteArrayOutputStream(1024);
            byte[] buffer = new byte[1024];
            int size = 0;
            while((size = bis.read(buffer,0,1024)) != -1){
                byteOut.write(buffer,0,size);
            }
            return byteOut.toByteArray();

        }catch (Exception e){
            return  new byte[0];
        }finally {
            releaseResource(byteOut);
            releaseResource(bis);
        }
    }

    private static void releaseResource(Closeable resource){

        if(resource != null){
            try {
                resource.close();
                resource = null;
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    public static float[] NHWCtoNCHW(float[] orinal,int N, int C,int H,int W){
        if(orinal == null || orinal.length == 0 || N*H*W*C == 0 || N < 0 || C < 0 || H < 0 || W < 0){
            return orinal;
        }
        float[] nchw = new float[orinal.length];
        for(int i = 0; i < N;i++){
            for(int j = 0; j < C;j++){
                for(int k = 0; k < H*W;k++){
                    nchw[i*C*H*W+j*H*W+k] = orinal[i*H*W*C+ k*C + j];
                }
            }
        }
        return nchw;
    }

    public static float[] NCHWtoNHWC(float[] orinal,int N, int C,int H,int W){
        if(orinal == null || orinal.length == 0 || N*H*W*C == 0 || N < 0 || C < 0 || H < 0 || W < 0){
            return orinal;
        }
        float[] nhwc = new float[orinal.length];

        for(int i = 0 ;i < N;i++){
            for(int j = 0; j < C;j++){
                for(int k = 0; k < H*W;k++){
                    nhwc[i*C*H*W+ k*C + j] = orinal[i*C*H*W+j*H*W+k];
                }
            }
        }
        return nhwc;
    }

    public static float[] getPixels(String framework,Bitmap bitmap, int resizedWidth, int resizedHeight){
        if(framework == null){
            return  null;
        }
        else if(framework.equals("caffe")){
            return getPixelForSqueezeNet(bitmap,resizedWidth, resizedHeight);
        }
        else if(framework.equals("caffe_8bit")){
            return getPixelFor8bitSqueezeNet(bitmap,resizedWidth, resizedHeight);
        }
        else if(framework.equals("tensorflow")){
            return getPixelForInceptionV3(bitmap,resizedWidth, resizedHeight);
        }
        else if(framework.equals("tensorflow_8bit")){
            return getPixelFor8bitInceptionV3(bitmap,resizedWidth, resizedHeight);
        }
        return  null;
    }

    private static float[] getPixelForSqueezeNet(Bitmap bitmap, int resizedWidth, int resizedHeight) {
        int batch = 1;
        int channel = 3;
        float[] buff = new float[channel * resizedWidth * resizedHeight];

        int k = 0;
        for (int i = 0; i < resizedHeight; i++) {
            for (int j = 0; j < resizedWidth; j++) {

                int color = bitmap.getPixel(j, i);

                //NHWC
                buff[k] = (float) (blue(color) - meanValueOfBlue);
                k++;
                buff[k] = (float) (green(color) - meanValueOfGreen);
                k++;
                buff[k] = (float) (red(color) - meanValueOfRed);
                k++;
            }
        }

        return NHWCtoNCHW(buff,batch,channel,resizedHeight,resizedWidth);
    }

    private static float[] getPixelFor8bitSqueezeNet(Bitmap bitmap, int resizedWidth, int resizedHeight) {
        int batch = 1;
        int channel = 3;
        float[] buff = new float[channel * resizedWidth * resizedHeight];

        int k = 0;
        for (int i = 0; i < resizedHeight; i++) {
            for (int j = 0; j < resizedWidth; j++) {
                int color = bitmap.getPixel(j, i);

                //NHWC
                buff[k] = (float) (blue(color));
                k++;
                buff[k] = (float) (green(color));
                k++;
                buff[k] = (float) (red(color));
                k++;

            }
        }

        return NHWCtoNCHW(buff,batch,channel,resizedHeight,resizedWidth);
    }

    private static float[] getPixelForInceptionV3(Bitmap bitmap, int resizedWidth, int resizedHeight) {
        int batch = 1;
        int channel = 3;
        float[] buff = new float[channel * resizedWidth * resizedHeight];

        int k = 0;
        for (int i = 0; i < resizedHeight; i++) {
            for (int j = 0; j < resizedWidth; j++) {

                int color = bitmap.getPixel(j, i);

                //NHWC
                buff[k] = (float) ((red(color) - meanValueOfRed))/255;
                k++;
                buff[k] = (float) ((green(color) - meanValueOfGreen))/255;
                k++;
                buff[k] = (float) ((blue(color) - meanValueOfBlue))/255;
                k++;
            }
        }

        return NHWCtoNCHW(buff,batch,channel,resizedHeight,resizedWidth);
    }

    private static float[] getPixelFor8bitInceptionV3(Bitmap bitmap, int resizedWidth, int resizedHeight) {
        int batch = 1;
        int channel = 3;
        float[] buff = new float[channel * resizedWidth * resizedHeight];

        int k = 0;
        for (int i = 0; i < resizedHeight; i++) {
            for (int j = 0; j < resizedWidth; j++) {
                int color = bitmap.getPixel(j, i);

                //NHWC
                buff[k] = (float) (red(color));
                k++;
                buff[k] = (float) (green(color));
                k++;
                buff[k] = (float) (blue(color));
                k++;

            }
        }

        return NHWCtoNCHW(buff,batch,channel,resizedHeight,resizedWidth);
    }

    public static boolean copyModelsFromAssetToAppModelsByBuffer(AssetManager am,String sourceModelName,String destDir){

        try {
            fileInput = am.open(sourceModelName);
            String filename = destDir + sourceModelName;

            fileOutput = new FileOutputStream(filename);
            BufferedOutputStream bufferedOutputStream = new BufferedOutputStream(fileOutput);
            byteOut = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int len = -1;
            while ((len = fileInput.read(buffer)) != -1) {
                bufferedOutputStream.write(buffer, 0, len);
            }
            bufferedOutputStream.close();
            return true;
        } catch (Exception ex) {
            Log.e(TAG, "copyModelsFromAssetToAppModels : " + ex);
            return false;
        }finally {
            releaseResource(byteOut);
            releaseResource(fileOutput);
            releaseResource(fileInput);
        }
    }

    public static boolean copyModelsFromAssetToAppModels(AssetManager am,String sourceModelName,String destDir){

        try {
            fileInput = am.open(sourceModelName);
            String filename = destDir + sourceModelName;

            fileOutput = new FileOutputStream(filename);
            byteOut = new ByteArrayOutputStream();
            byte[] buffer = new byte[1024];
            int len = -1;
            while ((len = fileInput.read(buffer)) != -1) {
                byteOut.write(buffer, 0, len);
            }
            fileOutput.write(byteOut.toByteArray());
            return true;
        } catch (Exception ex) {
            Log.e(TAG, "copyModelsFromAssetToAppModels : " + ex);
            return false;
        }finally {
            releaseResource(byteOut);
            releaseResource(fileOutput);
            releaseResource(fileInput);
        }
    }

    public static boolean isExistModelsInAppModels(String modelname,String savedir){

        File dir = new File(savedir);
        File[] currentfiles = dir.listFiles();
        if(currentfiles == null){
            return false;
        }else{
            for(File file: currentfiles){
                if(file.getName().equals(modelname)){
                    return true;
                }
            }
        }
        return false;
    }

    /**
     * 将asset文件写入缓存
     */
    public static boolean copyAssetAndWrite(Context mContext, String fileName) {
        try {
            File cacheDir = mContext.getCacheDir();
            if (!cacheDir.exists()) {
                cacheDir.mkdirs();
            }
            File outFile = new File(cacheDir, fileName);
            if (!outFile.exists()) {
                boolean res = outFile.createNewFile();
                if (!res) {
                    return false;
                }
            } else {
                if (outFile.length() > 10) {//表示已经写入一次
                    return true;
                }
            }
            InputStream is = mContext.getAssets().open(fileName);
            FileOutputStream fos = new FileOutputStream(outFile);
            byte[] buffer = new byte[1024];
            int byteCount;
            while ((byteCount = is.read(buffer)) != -1) {
                fos.write(buffer, 0, byteCount);
            }
            fos.flush();
            is.close();
            fos.close();
            return true;
        } catch (IOException e) {
            e.printStackTrace();
        }

        return false;
    }


}
