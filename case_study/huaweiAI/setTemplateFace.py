#!usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 2022/1/24 15:14
# @Author  : fy
# @FileName: setTemplateFace.py

import subprocess

import frida
import sys
import time
import logging
import threading

logging.basicConfig(stream=sys.stdout, format="%(levelname)s: %(asctime)s: %(message)s", level=logging.INFO, datefmt='%a %d %b %Y %H:%M:%S')
log = logging.getLogger(__name__)

global g_script

g_config = {
    "g_mem_block": 2,
    "g_mem_offset": 496208,
    "g_log_file": "setTemplateFace_2_crash.log",
    "g_model_size": 0x1d5b50,

    # "g_mem_block": 1,
    # "g_mem_offset": 557912,
    # "g_log_file": "setTemplateFace_1_0x102536_crash.log",
    # "g_model_size": 0x102536,

    # "g_mem_block": 1,
    # "g_mem_offset": 0,
    # "g_log_file": "setTemplateFace_1_0x1a00ef_crash.log",
    # "g_model_size": 0x1a00ef,

    "g_seed_index": 0,
    "g_proc_name": "Gadget"
}

def collect_crash_log():
    retMe = False
    print("|-[d] collect_crash_log_1")
    p = subprocess.Popen("adb logcat -b crash -d",
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()

    print("|-[d] collect_crash_log_2")
    if "Build fingerprint" in stdout.decode():
        with open(g_config["g_log_file"], "a+") as fwh:
            fwh.write(stdout.decode())
            fwh.write("\n")
            retMe = True
    p = subprocess.Popen("adb logcat -c",
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()
    print("|-[d] collect_crash_log_3")

    return retMe

def on_message(message, data):
    global g_config

    if message["type"] == "send":
        if "info" in message["payload"]:
            '''
            global timer
            timer.cancel()
            timer = threading.Timer(5, new_round)
            timer.start();
            '''
            msg = message["payload"].strip().split("|")
            g_config["g_mem_block"] = int(msg[1])
            g_config["g_mem_offset"] = int(msg[2])
            g_config["g_seed_index"] = int(msg[3])
            collect_crash_log()
            log.info("[Host MSG]: fuzzing block: #{}, offset: {}, progress: {:.3%}".format(
                g_config["g_mem_block"], g_config["g_mem_offset"], g_config["g_mem_offset"] / g_config["g_model_size"])
            )
            # if collect_crash_log():
            #     g_config["g_mem_offset"] += 4
            #    new_round()
            print("|-[d] on_message_1")
            g_script.post({'type': 'synchronize',
                               'payload': {"g_mem_block": g_config["g_mem_block"], "g_mem_offset": g_config["g_mem_offset"]}})
            print("|-[d] on_message_2")

        if "error" in message["payload"]:
            with open(g_config["g_log_file"], "a+") as fwh:
                fwh.write("---------- {} ----------\n".format(message["payload"]));
            print("|-[d] on_message_3")
            collect_crash_log()
            print("|-[d] on_message_4")

            msg = message["payload"].strip().split("|")
            # the ExceptionHandler of client will be triggered multiple time.
            if g_config["g_mem_offset"] > int(msg[2]):
                log.info("[Host MSG]: duplicate on_message enter")
                return

            g_config["g_mem_block"] = int(msg[1])
            g_config["g_mem_offset"] = int(msg[2])
            g_config["g_seed_index"] = int(msg[3])
            log.info("[Host MSG]: gotcha err in block: #{}, offset: {}".format(g_config["g_mem_block"], g_config["g_mem_offset"]))

            g_config["g_mem_offset"] += 4
            new_round()
            print("|-[d] on_message_5")

def new_round():

    # for app in frida.get_usb_device().enumerate_applications():
    #     print("[i] {}".format(app))
    # clean the env
    p = subprocess.Popen("adb shell am force-stop {}".format("com.mlkit.sample.body"),
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()

    time.sleep(1)
    p = subprocess.Popen("adb shell am start -n {}".format("com.mlkit.sample.body/com.huawei.mlkit.sample.activity.StartActivity"),
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()

    while True:
        try:
            time.sleep(1)
            frida.get_usb_device().get_process(g_config["g_proc_name"])
            time.sleep(3)
            break
        except:
            pass

    print("[*] new fuzzing starts from: {}/{}.".format(g_config["g_mem_offset"], g_config["g_mem_block"]))

    # usb session
    # session = frida.get_usb_device().attach(g_config["g_proc_name"])

    # remote session
    '''
    1. config the `libgadget.config.so` file
    2. config adbd via usb connection:
    2.1. to enable adb over network: 
    adb kill-server
    adb tcpip 5555
    adb connect 192.168.5.149:5555
    adb devices
    2.2 to disable adb over network:
    adb kill-server
    adb usb
    '''
    session = frida.get_device_manager().add_remote_device('192.168.5.149:27042').attach(g_config["g_proc_name"])

    JSFile = open('setTemplateFace.js')
    JsCodeFromfile = JSFile.read()
    JsCodeFromfile = JsCodeFromfile.replace("proc_name_AAoAA", g_config["g_proc_name"])
    JsCodeFromfile = JsCodeFromfile.replace("mem_block_AAoAA", str(g_config["g_mem_block"]))
    JsCodeFromfile = JsCodeFromfile.replace("mem_offset_AAoAA", str(g_config["g_mem_offset"]))
    JsCodeFromfile = JsCodeFromfile.replace("model_size_AAoAA", str(g_config["g_model_size"]))
    # print(JsCodeFromfile)
    global g_script
    g_script = session.create_script(JsCodeFromfile)
    g_script.on('message', on_message)
    g_script.load()
    # g_script.unload()

def main():
    new_round()
    sys.stdin.read()
    # print("NEVER run here.")
if __name__ == '__main__':
    main()
