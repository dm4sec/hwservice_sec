#!usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 2022/1/24 15:14
# @Author  : fy
# @FileName: setTemplateFace.py

import subprocess

import frida
import sys

global g_script
g_log_file = "setTemplateFace_crash.log"
g_obj_content_offset = 0


def on_message(message, data):
    global g_obj_content_offset
    global g_log_file

    if message["type"] == "send":
        if message["payload"].find("dead_object") != -1:
            msg = message["payload"].strip().split(":")
            g_obj_content_offset = int(msg[1])

            print("[*] logging dead_object")
            with open(g_log_file, "a+") as fwh:
                fwh.write("************ model offset: {} crashed the server. ************\n".format(
                    hex(g_obj_content_offset)))

        if message["payload"].find("ready") != -1:
            p = subprocess.Popen("adb logcat -b crash -d",
                                 shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                 stderr=subprocess.PIPE
                                 )
            stdout, stderr = p.communicate()
            info = message["payload"].strip().split(":")
            print("get ready: " + info[1] + "/" + info[2])
            g_obj_content_offset = int(info[1])
            g_gen_seed_offset = int(info[2])
            print("[*] check crash")
            if stdout.decode().find("Build fingerprint") != -1 and g_obj_content_offset != 0:
                print("[*] logging crash")
                crash_seed_offset = g_gen_seed_offset - 1
                crash_content_offset = g_obj_content_offset if (crash_seed_offset == 0) else (g_obj_content_offset - 4)
                with open(g_log_file, "a+") as fwh:
                    fwh.write("------------ model offset: {}/{} crashed the app. ------------\n".format(
                        hex(crash_content_offset), crash_seed_offset))
                    fwh.write(stdout.decode())
                    fwh.close()
            print("[*] clear logcat")
            p = subprocess.Popen("adb logcat -c",
                                 shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                                 stderr=subprocess.PIPE
                                 )
            stdout, stderr = p.communicate()
            # time.sleep(2)
            g_script.post({'type': 'synchronize',
                           'payload': {"g_cur_progress": g_obj_content_offset, "g_gen_seed": g_gen_seed_offset}})


def de():
    print("[Exit] The target process exits")


def main():
    session = frida.get_usb_device().attach("Gadget")
    session.on('detached', de)

    JSFile = open('setTemplateFace.js')
    JsCodeFromfile = JSFile.read()
    global g_script
    g_script = session.create_script(JsCodeFromfile)
    g_script.on('message', on_message)
    g_script.load()
    sys.stdin.read()


if __name__ == '__main__':
    main()
