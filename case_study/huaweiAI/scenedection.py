#!usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 2021/9/23 15:54

from __future__ import print_function
import frida
import sys


def main():
    '''
    find the target

    adb shell pm list package -f

    blueline:/ # ps -ef | grep "chrom"
    u0_a96        3924   860 0 13:39:34 ?     00:00:02 org.chromium.webview_shell
    u0_i9000      3991  1976 0 13:39:34 ?     00:00:00 com.android.webview:sandboxed_process0:org.chromium.content.app.SandboxedProcessService0
    root          5287  5283 1 16:27:23 pts/1 00:00:00 grep chrom
    blueline:/ # lsof -p 3924 | grep "libhidlbase"
    m.webview_shell  3924     u0_a96  mem       REG              253,3    771744       2892 /system/lib64/vndk-sp-29/libhidlbase.so
    m.webview_shell  3924     u0_a96  mem       REG              253,3    771752       2460 /system/lib64/libhidlbase.so

    pip install frida-tools
    demo@demo:/$ frida-ps -U
     PID  Name
    ----  ----------------------------------------------------------------------------------------
    2985  Email
    3377  Phone
    3186  Settings
    3924  WebView Shell <-
     899  adbd
    '''

    # process = frida.get_usb_device().attach("netmgrd")
    #
    # JSFile = open('hwservice_fuzzer.js')
    # JsCodeFromfile = JSFile.read()
    # script = process.create_script(JsCodeFromfile)
    #
    # script.on('message', on_message)
    # script.load()
    # sys.stdin.read()

    # for proc in frida.get_usb_device().enumerate_processes():
    # print("[i] {}".format(proc))
    # # for app in frida.get_usb_device().enumerate_applications():
    # #     print(app)
    #     if proc.pid < 2000:

    process = frida.get_usb_device().attach("Gadget")

    JSFile = open('scenedection.js')
    JsCodeFromfile = JSFile.read()
    script = process.create_script(JsCodeFromfile)

    script.load()
    sys.stdin.read()


if __name__ == '__main__':
    main()
