#!usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 2022/1/24 15:14
# @Author  : fy
# @FileName: setTemplateFace.py

import subprocess

import frida
import sys
import time
# from utils.adbUtils import restart_top

global g_script

g_config = {
    "g_mem_block": 0,
    "g_mem_offset": 0,
    "g_seed_index": 0,
    "g_log_file": "setTemplateFace_crash.log",
    "g_proc_name": "Gadget"

}

def collect_crash_log():
    retMe = False

    p = subprocess.Popen("adb logcat -b crash -d",
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()
    if stdout.decode().find("Build fingerprint") != -1:
        with open(g_config["g_log_file"], "a+") as fwh:
            fwh.write(stdout.decode())
            retMe = True
    p = subprocess.Popen("adb logcat -c",
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()
    return retMe

def on_message(message, data):
    global g_config

    if message["type"] == "send":
        if message["payload"].find("info") != -1:
            msg = message["payload"].strip().split("|")
            g_config["g_mem_block"] = int(msg[1])
            g_config["g_mem_offset"] = int(msg[2])
            g_config["g_seed_index"] = int(msg[3])
            print("[*][Host]: fuzzing block: {}, offset: {}".format(g_config["g_mem_block"], g_config["g_mem_offset"]))
            if collect_crash_log():
                print("TODO:")

            g_script.post({'type': 'synchronize',
                           'payload': {"g_mem_block": g_config["g_mem_block"], "g_mem_offset": g_config["g_mem_offset"]}})

        if message["payload"].find("error") != -1:
            with open(g_config["g_log_file"], "a+") as fwh:
                fwh.write("---------- {} ----------".format(message["payload"]));
            collect_crash_log()
            new_round()

def new_round():


    # for app in frida.get_usb_device().enumerate_applications():
    #     print("[i] {}".format(app))

    # clean the env
    p = subprocess.Popen("adb shell am force-stop {}".format("com.mlkit.sample.body"),
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()

    p = subprocess.Popen("adb shell am start -n {}".format("com.mlkit.sample.body/com.huawei.mlkit.sample.activity.StartActivity"),
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()

    while True:
        try:
            time.sleep(1)
            frida.get_usb_device().get_process(g_config["g_proc_name"])
            break
        except:
            pass

    print("[*] start new testing from: {}/{}.".format(g_config["g_mem_offset"], g_config["g_mem_block"]))

    session = frida.get_usb_device().attach(g_config["g_proc_name"])
    # session.on('detached', new_round)
    JSFile = open('setTemplateFace.js')
    JsCodeFromfile = JSFile.read()
    JsCodeFromfile = JsCodeFromfile.replace("proc_name_AAoAA", g_config["g_proc_name"])
    JsCodeFromfile = JsCodeFromfile.replace("mem_block_AAoAA", str(g_config["g_mem_block"]))
    JsCodeFromfile = JsCodeFromfile.replace("mem_offset_AAoAA", str(g_config["g_mem_offset"]))
    # print(JsCodeFromfile)
    global g_script
    g_script = session.create_script(JsCodeFromfile)
    g_script.on('message', on_message)
    g_script.load()
    # g_script.unload()
    sys.stdin.read()

def main():
    new_round()

if __name__ == '__main__':
    main()
