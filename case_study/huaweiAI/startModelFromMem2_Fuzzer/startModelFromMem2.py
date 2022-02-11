#!usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 2022/1/24 15:14
# @Author  : fy
# @FileName: startModelFromMem2.py

import subprocess

import frida
import sys
import time
import logging
import threading
import argparse

logging.basicConfig(stream=sys.stdout, format="%(levelname)s: %(asctime)s: %(message)s", level=logging.INFO, datefmt='%a %d %b %Y %H:%M:%S')
log = logging.getLogger(__name__)

global g_script

g_model_file = None
g_task_name = None
g_dev_serial = None
g_model_offset = None
g_seed_index = None

def collect_crash_log():
    retMe = False
    p = subprocess.Popen("adb -s {} logcat -b crash -d".format(g_dev_serial),
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()

    if "Build fingerprint" in stdout.decode():
        with open("{}_crash.log".format(g_task_name), "a+") as fwh:
            fwh.write(stdout.decode())
            fwh.write("\n")
            retMe = True
    p = subprocess.Popen("adb -s {} logcat -c".format(g_dev_serial),
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()

    return retMe

def on_message(message, data):
    global g_model_offset, g_seed_index

    if message["type"] == "send":
        if "info" in message["payload"]:
            '''
            global timer
            timer.cancel()
            timer = threading.Timer(5, new_round)
            timer.start();
            '''
            msg = message["payload"].strip().split("|")
            g_model_offset = int(msg[1])
            g_seed_index = int(msg[2])
            model_size = int(msg[3])

            collect_crash_log()
            log.info("[Host MSG]: fuzzing offset: {}, model size: {}, progress: {:.3%}".format(
                g_model_offset, model_size, g_seed_index / model_size)
            )
            # if collect_crash_log():
            #     g_fuzz_config["g_mem_offset"] += 4
            #    new_round()
            g_script.post({'type': 'synchronize',
                               'payload': "foo"})

        if "error" in message["payload"]:
            with open("{}_crash.log".format(g_task_name), "a+") as fwh:
                fwh.write("---------- {} ----------\n".format(message["payload"]));
            collect_crash_log()

            msg = message["payload"].strip().split("|")
            # the ExceptionHandler of client will be triggered multiple time.
            if g_model_offset > int(msg[1]):
                log.info("[Host MSG]: duplicate on_message enter")
                return

            g_model_offset = int(msg[1])
            g_seed_index = int(msg[2])
            log.info("[Host MSG]: gotcha err in offset: {}".format(g_model_offset))

            g_model_offset += 4
            new_round()

def new_round():

    # for app in frida.get_usb_device().enumerate_applications():
    #     print("[i] {}".format(app))
    # clean the env
    p = subprocess.Popen("adb -s {} shell am force-stop {}".format(g_dev_serial, "com.huawei.hiaidemo"),
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()
    # if stderr != b"":
    #     log.error(stderr)
    #     return

    time.sleep(0.1)
    p = subprocess.Popen("adb -s {} shell am start -n {} --es \"task_name\" \"{}\" --es \"model_path\" \"{}\"".format(
        g_dev_serial,
        "com.huawei.hiaidemo/.view.ClassifyActivity",
        g_task_name,
        g_model_file
    ),
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()

    while True:
        try:
            time.sleep(0.1)
            frida.get_device(g_dev_serial).get_process("Gadget")
            time.sleep(0.2)
            break
        except:
            pass

    print("[*] new fuzzing starts from: {}.".format(g_model_offset))

    # to enable remote session
    '''
    1. config the `libgadget.config.so` file ?
    2. config adbd via usb connection:
    2.1. to enable adb over network: 
    adb kill-server
    adb tcpip 5555
    adb connect 192.168.2.205:5555
    adb connect 192.168.2.197:5555
    adb devices
    2.2 to disable adb over network:
    adb kill-server
    adb usb
    '''
    session = frida.get_device(g_dev_serial).attach("Gadget")

    JSFile = open('startModelFromMem2.js')
    JsCodeFromfile = JSFile.read()
    JsCodeFromfile = JsCodeFromfile.replace("proc_name_AAoAA", "Gadget")
    JsCodeFromfile = JsCodeFromfile.replace("mem_offset_AAoAA", str(g_model_offset))
    # print(JsCodeFromfile)
    global g_script
    g_script = session.create_script(JsCodeFromfile)
    g_script.on('message', on_message)
    g_script.load()
    # g_script.unload()

def main():

    parser = argparse.ArgumentParser()
    parser.add_argument('--model-file', required=True,
                        help="The model file.")
    parser.add_argument('--task-name', required=True,
                        help="Code name of this task, used to name the crash log file.")
    parser.add_argument('--dev-serial', required=True,
                        help="Serial of the device.")
    parser.add_argument('--model-offset', type=int, required=True,
                        help="Offset of model file.")

    args = parser.parse_args()
    global g_model_file, g_task_name, g_dev_serial, g_model_offset
    g_model_file = args.model_file
    g_task_name = args.task_name
    g_dev_serial = args.dev_serial
    g_model_offset = args.model_offset

    new_round()
    sys.stdin.read()
    # print("NEVER run here.")
if __name__ == '__main__':
    main()
