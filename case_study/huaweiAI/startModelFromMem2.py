#!usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 2021/9/23 15:54

from __future__ import print_function
import frida
import sys
import subprocess

g_obj_content_offset = 0
g_obj_content_seed = 0
g_script = 0

def on_message(message, data):

    global g_obj_content_offset
    global g_obj_content_seed

    if message["type"] == "send":
        print(message["payload"])

        if message["payload"].find("ready") != -1:
            print(message["payload"])
            # g_script.post({'type': 'synchronize', 'payload': 'roll'})
            # print(message["payload"])

            p = subprocess.Popen("adb logcat -s '*:F'", shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.STDOUT)
            stdout, stderr = p.communicate()
            # print(stdout.decode())
            print("1")
            # print(stderr.decode())
            # print("2")
            # print(message["payload"])

            if stdout.decode().find("Build fingerprint") != -1:
                with open("crash.log", "a+") as fwh:
                    fwh.write("model offset: {} with seed: {} crashed the server.\n".format(g_obj_content_offset, g_obj_content_seed))
                    fwh.write(stdout.decode())

            msg = message["payload"].strip().split(":")
            g_obj_content_offset = msg[1]
            print(g_obj_content_offset)
            g_obj_content_seed = msg[2]
            print(g_obj_content_seed)

            while(True):
                p = subprocess.Popen("adb logcat -c",
                                     shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                                     )
                stdout, stderr = p.communicate()
                # print(stderr.decode())
                if stderr.decode() == "":
                    break

            g_script.post({'type': 'synchronize', 'payload': 'roll'})
            print(message["payload"])

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
    JSFile = open('startModelFromMem2.js')
    JsCodeFromfile = JSFile.read()
    global g_script
    g_script = session.create_script(JsCodeFromfile)
    g_script.on('message', on_message)
    g_script.load()
    sys.stdin.read()

if __name__ == '__main__':
    main()
