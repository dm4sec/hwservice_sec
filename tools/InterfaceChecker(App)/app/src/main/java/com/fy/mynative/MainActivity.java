package com.fy.mynative;

import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.text.method.ScrollingMovementMethod;
import android.util.Log;
import android.view.View;
import android.widget.TextView;

import com.fy.mynative.databinding.ActivityMainBinding;

public class MainActivity extends AppCompatActivity implements View.OnClickListener {

    // Used to load the 'mynative' library on application startup.
    static {
        System.loadLibrary("mynative");
    }

    private ActivityMainBinding binding;

    String[] permissions = {
            "android.permission.READ_EXTERNAL_STORAGE",
            "android.permission.WRITE_EXTERNAL_STORAGE"};

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        try {
            int per = ActivityCompat.checkSelfPermission(this, "android.permission.WRITE_EXTERNAL_STORAGE");
            if (per != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, permissions, 1);
            }
        } catch (Exception e) {
            e.printStackTrace();
        }

        binding = ActivityMainBinding.inflate(getLayoutInflater());
        setContentView(binding.getRoot());

        // Example of a call to a native method
        TextView tv = binding.sampleText;
        tv.setMovementMethod(new ScrollingMovementMethod());
        String file_path = "/vendor/etc/vintf/manifest.xml";    //供应商清单列出了vendor分区中的产品专用HAL(https://source.android.com/devices/architecture/vintf/objects?hl=zh-cn#device-manifest-file)
//        String file_path = "/vendor/etc/audio_policy_configuration.xml";
        String file_body = readFile(file_path);
        parseHAL(file_path);
        findUsefulHAL();

        String UsefulHALList = getUsefulHALList();
        Log.d("fy_native", "UsefulHALList: " + UsefulHALList);
        tv.setText(UsefulHALList);
        tv.append("\n==============\n");
        String HALList = getHALList();
        Log.d("fy_native", "HALList: " + HALList);
//        tv.setText(getHALList());
        tv.append("\n==============\n");
//        tv.append(file_body);


    }

    public native String readFile(String file_path);        //直接返回文件内容

    public native void parseHAL(String file_path);          //解析xml,并将HAL接口命名,存入hal_list

    public native String getHALList();                      //获取存入hal_list, "\n"间隔

    public native String getUsefulHALList();                //获取存入hal_list, "\n"间隔

    public native void findUsefulHAL();                     //获取可用的接口

    @Override
    public void onClick(View v) {

    }
}