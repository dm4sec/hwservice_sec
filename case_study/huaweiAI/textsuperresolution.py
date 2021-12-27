#!usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 2021/9/23 15:54

from __future__ import print_function
import subprocess
import frida
import sys

g_obj_content_offset = 0
g_script = 0

def on_message(message, data):

    global g_obj_content_offset
    global g_obj_content_seed

    if message["type"] == "send":
        if message["payload"].find("dead_object") != -1:
            msg = message["payload"].strip().split(":")
            g_obj_content_offset = int(msg[1])

            print("[*] logging dead_object")
            with open("textsuperresolution_crash.log", "a+") as fwh:
                fwh.write("************ model offset: {} crashed the server. ************\n".format(
                    hex(g_obj_content_offset)))

        if message["payload"].find("ready") != -1:
            p = subprocess.Popen("adb logcat -b crash -d",
                                 shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                 stderr=subprocess.PIPE
                                 )

            stdout, stderr = p.communicate()

            msg = message["payload"].strip().split(":")
            g_obj_content_offset = int(msg[1])

            if stdout.decode().find("Build fingerprint") != -1 and g_obj_content_offset != 0:
                print("[*] logging crash")
                with open("textsuperresolution_crash.log", "a+") as fwh:
                    fwh.write("------------ model offset: {} crashed the app. ------------\n".format(hex(g_obj_content_offset - 4)))
                    fwh.write(stdout.decode())

            p = subprocess.Popen("adb logcat -c",
                                 shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                     stderr=subprocess.PIPE
                                 )
            stdout, stderr = p.communicate()

            g_script.post({'type': 'synchronize', 'payload': 'roll'})

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

    for proc in frida.get_usb_device().enumerate_processes():
        print("[i] {}".format(proc))
    # # for app in frida.get_usb_device().enumerate_applications():
    # #     print(app)
    #     if proc.pid < 2000:

    # process = frida.get_usb_device().attach("Camera")
    session = frida.get_usb_device().attach("Gadget")
    JSFile = open('textsuperresolution.js')
    JsCodeFromfile = JSFile.read()
    global g_script
    g_script = session.create_script(JsCodeFromfile)
    g_script.on('message', on_message)
    g_script.load()
    sys.stdin.read()

if __name__ == '__main__':
    main()