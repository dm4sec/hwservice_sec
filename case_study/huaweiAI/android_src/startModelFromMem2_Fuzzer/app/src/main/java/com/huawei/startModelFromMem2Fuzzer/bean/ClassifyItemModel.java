package com.huawei.startModelFromMem2Fuzzer.bean;

import android.graphics.Bitmap;

public class ClassifyItemModel {
    private String top1Result;
    private String otherResults;
    private String classifyTime;
    private Bitmap classifyImg;

    public ClassifyItemModel(String top1Result, String otherResults, String classifyTime, Bitmap classifyImg) {
        this.top1Result = top1Result;
        this.otherResults = otherResults;
        this.classifyTime = classifyTime;
        this.classifyImg = classifyImg;
    }

    public String getTop1Result() {
        return top1Result;
    }

    public String getOtherResults() {
        return otherResults;
    }

    public String getClassifyTime() {
        return classifyTime;
    }

    public Bitmap getClassifyImg() {
        return classifyImg;
    }
}


