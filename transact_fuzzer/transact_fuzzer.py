#!usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 2021/9/23 15:54
# @Author  : fy
# @FileName: transact_fuzzer.py

from __future__ import print_function
import frida
import sys
import socket

# Here's some message handling..
# [ It's a little bit more meaningful to read as output :-D
#   Errors get [!] and messages get [i] prefixes. ]
all_ip = []


def on_message(message, data):
    # print(message)
    # print(data)
    if message['type'] == 'error':
        print("[!] " + message['stack'])
    elif message['type'] == 'send':
        # print("-----------------------------")
        # print(message['payload'])
        if message['payload'] == "haha":
            print(data)
        if message['payload'] == "connect":
            # print (type(data))
            # print (data.encode('hex'))
            port = str(int(str(data[3].encode('hex')) + str(data[2].encode('hex')), 16))
            # print("port: " + str(int(port, 16)))

            ip1 = str(data[4].encode('hex'))
            ip2 = str(data[5].encode('hex'))
            ip3 = str(data[6].encode('hex'))
            ip4 = str(data[7].encode('hex'))
            ip = str(int(ip1, 16)) + "." + str(int(ip2, 16)) + "." + str(
                int(ip3, 16)) + "." + str(
                int(ip4, 16)) + ":" + port

            ddd = int(data[:1].encode('hex'), 16)
            # print(int(data[0].encode('hex'), 16))
            if ddd == socket.AF_INET:
                if ip not in all_ip:
                    print("" + ip)
                    all_ip.append(ip)
                    # print("AF_INET")
                # print(data.encode('hex'))
            elif ddd == socket.AF_UNIX:
                print("AF_UNIX")
            elif ddd == socket.AF_INET6:
                print("AF_INET6")
            elif ddd == socket.EAI_SOCKTYPE:
                print("EAI_SOCKTYPE")
            else:
                print("==>" + data.encode('hex'))

    else:
        print(message['payload'])


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
    # JSFile = open('transact_fuzzer.js')
    # JsCodeFromfile = JSFile.read()
    # script = process.create_script(JsCodeFromfile)
    #
    # script.on('message', on_message)
    # script.load()
    # sys.stdin.read()

    for proc in frida.get_usb_device().enumerate_processes():
        print("[i] {}".format(proc))
    # # for app in frida.get_usb_device().enumerate_applications():
    # #     print(app)
    #     if proc.pid < 2000:

    # process = frida.get_usb_device().attach("Camera")
    process = frida.get_usb_device().attach("Gadget")

    JSFile = open('transact_fuzzer.js')
    JsCodeFromfile = JSFile.read()
    script = process.create_script(JsCodeFromfile)

    script.on('message', on_message)
    script.load()
    sys.stdin.read()

if __name__ == '__main__':
    main()
