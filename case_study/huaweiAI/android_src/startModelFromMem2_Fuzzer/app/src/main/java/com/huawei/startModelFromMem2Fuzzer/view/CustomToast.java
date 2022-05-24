package com.huawei.startModelFromMem2Fuzzer.view;

import android.widget.Toast;

import java.util.Timer;
import java.util.TimerTask;

public class CustomToast {

    public static void showToast(final Toast toast, final int time) {
        final Timer timer = new Timer();
        timer.schedule(new TimerTask() {
            @Override
            public void run() {
                toast.show();
            }
        }, 0, 3000);
        new Timer().schedule(new TimerTask() {
            @Override
            public void run() {
                toast.cancel();
                timer.cancel();
            }
        }, time);
    }

}
