package com.huawei.startModelFromMem2Fuzzer.view;

import android.Manifest;
import android.content.ContentResolver;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.content.res.AssetManager;
import android.database.Cursor;
import android.graphics.Bitmap;
import android.net.Uri;
import android.os.Bundle;
import android.provider.MediaStore;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AppCompatActivity;
import android.support.v7.widget.LinearLayoutManager;
import android.support.v7.widget.RecyclerView;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.huawei.startModelFromMem2Fuzzer.R;
import com.huawei.startModelFromMem2Fuzzer.adapter.ClassifyAdapter;
import com.huawei.startModelFromMem2Fuzzer.bean.ClassifyItemModel;
import com.huawei.startModelFromMem2Fuzzer.bean.ModelInfo;
import com.huawei.startModelFromMem2Fuzzer.utils.Untils;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;
import java.util.Vector;

import static com.huawei.startModelFromMem2Fuzzer.utils.Constant.GALLERY_REQUEST_CODE;
import static com.huawei.startModelFromMem2Fuzzer.utils.Constant.IMAGE_CAPTURE_REQUEST_CODE;


public abstract class NpuClassifyActivity extends AppCompatActivity{
    private static final String TAG = NpuClassifyActivity.class.getSimpleName();
    protected List<ClassifyItemModel> items;

    protected RecyclerView rv;

    protected AssetManager mgr;

    protected String[] predictedClass =  new String[3];

    protected Bitmap initClassifiedImg;

    protected ClassifyAdapter adapter;

    protected Button btnGallery;
    protected Button btnCamera;
    protected ModelInfo modelInfo;

    protected Vector<String> word_label =  new Vector<String>();

    protected float inferenceTime;

    protected float[][] outputData;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        //getSupportActionBar().hide();
        setContentView(R.layout.activity_npu_classify);

        items = new ArrayList<>();

        mgr = getResources().getAssets();

        initView();

        modelInfo = (ModelInfo)getIntent().getSerializableExtra("modelInfo");

        preProcess();
        Log.i("QG","START loadModelFromFile  "+modelInfo.getModelSaveDir()+modelInfo.getOfflineModel());
        loadModelFromFile(modelInfo.getOfflineModelName(),modelInfo.getModelSaveDir()+modelInfo.getOfflineModel(),modelInfo.isMixModel());

    }

    private void setHeaderView(RecyclerView view) {
        View header = LayoutInflater.from(this).inflate(R.layout.recyclerview_hewader, view, false);

        btnGallery = header.findViewById(R.id.btn_gallery);
        btnCamera = header.findViewById(R.id.btn_camera);

        adapter.setHeaderView(header);
    }

    private void initView() {
        rv = (RecyclerView) findViewById(R.id.rv);
        LinearLayoutManager manager = new LinearLayoutManager(this);
        rv.setLayoutManager(manager);

        adapter = new ClassifyAdapter(items);
        rv.setAdapter(adapter);

        setHeaderView(rv);

        btnGallery.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                checkStoragePermission();
            }
        });

        btnCamera.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                checkCameraPermission();
            }
        });
    }

    private void checkStoragePermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED &&
                ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                        != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.CAMERA},
                    GALLERY_REQUEST_CODE);
        } else {
            chooseImageAndClassify();
        }
    }

    private void checkCameraPermission() {
        if (ContextCompat.checkSelfPermission(this, Manifest.permission.WRITE_EXTERNAL_STORAGE)
                != PackageManager.PERMISSION_GRANTED &&
                ContextCompat.checkSelfPermission(this, Manifest.permission.CAMERA)
                        != PackageManager.PERMISSION_GRANTED) {
            ActivityCompat.requestPermissions(this,
                    new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE, Manifest.permission.CAMERA},
                    IMAGE_CAPTURE_REQUEST_CODE);
        } else {
            takePictureAndClassify();
        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == GALLERY_REQUEST_CODE &&
                grantResults[1] == PackageManager.PERMISSION_GRANTED) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                chooseImageAndClassify();
            } else {
                Toast.makeText(NpuClassifyActivity.this, "Permission Denied", Toast.LENGTH_SHORT).show();
            }
        }

        if (requestCode == IMAGE_CAPTURE_REQUEST_CODE) {
            if (grantResults[0] == PackageManager.PERMISSION_GRANTED &&
                    grantResults[1] == PackageManager.PERMISSION_GRANTED) {
                takePictureAndClassify();
            } else {
                Toast.makeText(NpuClassifyActivity.this, "Permission Denied", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private void takePictureAndClassify() {
        Intent takePictureIntent = new Intent(MediaStore.ACTION_IMAGE_CAPTURE);
        if (takePictureIntent.resolveActivity(getPackageManager()) != null) {
            startActivityForResult(takePictureIntent, IMAGE_CAPTURE_REQUEST_CODE);
        }
    }

    private void chooseImageAndClassify() {
        Intent intent = new Intent(Intent.ACTION_PICK, null);
        intent.setDataAndType(MediaStore.Images.Media.EXTERNAL_CONTENT_URI, "image/*");
        startActivityForResult(intent, GALLERY_REQUEST_CODE);
    }

    @Override
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (resultCode == RESULT_OK && data != null) switch (requestCode) {
            case GALLERY_REQUEST_CODE:
                try {
                    Bitmap bitmap;
                    ContentResolver resolver = getContentResolver();
                    Uri originalUri = data.getData();
                    bitmap = MediaStore.Images.Media.getBitmap(resolver, originalUri);
                    String[] proj = {MediaStore.Images.Media.DATA};
                    Cursor cursor = managedQuery(originalUri, proj, null, null, null);
                    cursor.moveToFirst();
                    Bitmap rgba = bitmap.copy(Bitmap.Config.ARGB_8888, true);
                    Log.i("QG","GALLERY_REQUEST_CODE getInput_W:"+modelInfo.getInput_W()+",getInput_H:"+ modelInfo.getInput_H());
                    initClassifiedImg = Bitmap.createScaledBitmap(rgba, modelInfo.getInput_W(), modelInfo.getInput_H(), false);

                    float[] inputData = Untils.getPixels(modelInfo.getFramework(),initClassifiedImg,modelInfo.getInput_W(),modelInfo.getInput_H());
                    float inputdatas[][] = new float[1][];
                    inputdatas[0] = inputData;
                    runModel(modelInfo,inputdatas);


                } catch (IOException e) {
                    Log.e(TAG, e.toString());
                }

                break;
            case IMAGE_CAPTURE_REQUEST_CODE:
                Log.i("TAG","IMAGE_CAPTURE_REQUEST_CODE RETURN");
                Bundle extras = data.getExtras();
                Bitmap imageBitmap = (Bitmap) extras.get("data");
                Bitmap rgba = imageBitmap.copy(Bitmap.Config.ARGB_8888, true);

                Log.i("QG","IMAGE_CAPTURE_REQUEST_CODE getInput_W:"+modelInfo.getInput_W()+",getInput_H:"+ modelInfo.getInput_H());
                initClassifiedImg = Bitmap.createScaledBitmap(rgba, modelInfo.getInput_W(), modelInfo.getInput_H(), true);

                float[] inputData = Untils.getPixels(modelInfo.getFramework(),initClassifiedImg,modelInfo.getInput_W(),modelInfo.getInput_H());
                float inputdatas[][] = new float[1][];
                inputdatas[0] = inputData;
                runModel(modelInfo,inputdatas);

                break;

            default:
                break;
        }
        else {
            Toast.makeText(NpuClassifyActivity.this,
                    "Return without selecting pictures|Gallery has no pictures|Return without taking pictures", Toast.LENGTH_SHORT).show();
        }

    }

    protected void preProcess() {
        byte[] labels;
        try {
            InputStream assetsInputStream = getAssets().open(modelInfo.getOnlineModelLabel());
            int available = assetsInputStream.available();
            labels = new byte[available];
            assetsInputStream.read(labels);
            assetsInputStream.close();
            String words = new String(labels);
            String[] contens = words.split("\n");

            for(String conten:contens){
                word_label.add(conten);
            }
            Log.i(TAG, "initLabel size: " + word_label.size());
        }catch (Exception e){
            Log.e(TAG,e.getMessage());
        }

    }

    protected void postProcess(float[][] outputData){
        if(outputData != null){
            int[] max_index = new int[3];
            double[] max_num = new double[3];

            Log.i(TAG, "outputData.length : " + outputData.length);
            for (int i = 0; i < outputData.length; i++) {
                for (int x = 0; x < outputData[i].length; x++) {
                    double tmp = outputData[i][x];
                    //Log.i(TAG, "outputData[" + i + "]: " + outputData[i]);
                    int tmp_index = x;
                    for (int j = 0; j < 3; j++) {
                        if (tmp > max_num[j]) {
                            tmp_index += max_index[j];
                            max_index[j] = tmp_index - max_index[j];
                            tmp_index -= max_index[j];
                            tmp += max_num[j];
                            max_num[j] = tmp - max_num[j];
                            tmp -= max_num[j];
                        }
                    }
                }
                predictedClass[0] = word_label.get(max_index[0]) + " - " + max_num[0] * 100 +"%\n";
                predictedClass[1] = word_label.get(max_index[1]) + " - " + max_num[1] * 100 +"%\n"+
                        word_label.get(max_index[2]) + " - " + max_num[2] * 100 +"%\n";
                predictedClass[2] ="inference time:" +inferenceTime+ "ms\n";
                for(String res : predictedClass) {
                    Log.i(TAG, res);
                }

                items.add(new ClassifyItemModel(predictedClass[0], predictedClass[1], predictedClass[2], initClassifiedImg));

            }
            adapter.notifyDataSetChanged();


        }else {
            Toast.makeText(NpuClassifyActivity.this,
                    "run model fail.", Toast.LENGTH_SHORT).show();
        }
    }

    protected abstract void loadModelFromFile(String offlineModelName,String offlineModelPath,boolean isMixModel);

    protected abstract void loadModelFromBuffer(String offlineModelName, byte[] offlineModelBuffer, boolean isMixModel);

    protected abstract void runModel(ModelInfo modelInfo, float[][] inputData);



    @Override
    protected void onResume() {
        super.onResume();
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
    }
}
