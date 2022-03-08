#!usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 2022/1/24 15:14

import subprocess

import frida
import sys
import time
import logging
import argparse
from tqdm import tqdm
import time

logging.basicConfig(stream=sys.stdout, format="%(levelname)s: %(asctime)s: %(message)s", level=logging.INFO, datefmt='%a %d %b %Y %H:%M:%S')
log = logging.getLogger(__name__)

g_script = None

g_model_file = None
g_task_name = None
g_dev_serial = None
g_model_offset = None

g_last_relunch = None

def collect_crash_log():
    global g_dev_serial, g_task_name
    retMe = False
    # log.info("collect_crash_log_1")
    p = subprocess.Popen("adb -s {} logcat -b crash -d".format(g_dev_serial),
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()
    # log.info("collect_crash_log_2")

    if "Build fingerprint" in stdout.decode():
        with open("./models/{}_crash.log".format(g_task_name), "a+") as fwh:
            fwh.write(stdout.decode())
            fwh.write("\n")
            retMe = True
    p = subprocess.Popen("adb -s {} logcat -c".format(g_dev_serial),
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()
    # log.info("collect_crash_log_3")

    return retMe

g_tqdm = tqdm(unit='B',unit_scale=True,unit_divisor=1024,miniters=1)
g_last_offset = [0]

def progress(size, offset):
    g_tqdm.set_postfix(offset = offset, time = time.strftime("%Y-%m-%d %H:%M:%S", time.localtime()))
    g_tqdm.desc = "fuzzing " + g_model_file
    g_tqdm.total = size
    g_tqdm.update(offset - g_last_offset[0])
    g_last_offset[0] = 0 if size == offset else offset
    # log.info("fuzzing: {}, offset: {}, restart: {}, percent: {:.2%}".format(g_model_file, offset, g_c_restart, float(offset) / size))

def on_message(message, data):
    global g_model_offset, g_task_name, g_last_relunch

    if message["type"] == "send":
        if "done" in message["payload"]:
            log.info("[Host MSG]: task finished")
            new_round(False)
        if "info" in message["payload"]:

            msg = message["payload"].strip().split("|")
            g_model_offset = int(msg[1])
            model_size = int(msg[2])

            # log.info("on_message_1")
            collect_crash_log()
            '''
            log.info("[Host MSG]: fuzzing offset: {} ({}), model size: {}, progress: {:.3%}".format(
                g_model_offset, hex(g_model_offset), model_size, float(g_model_offset) / model_size)
            )
            '''
            progress(model_size, g_model_offset)
            # if collect_crash_log():
            #     g_fuzz_config["g_mem_offset"] += 4
            #    new_round()
            # log.info("on_message_2")

            # the client is not well written to exhaust the resource, such that I restart the app per 2000 lunches.
            if g_model_offset - g_last_relunch == 700:
                g_script.post({'type': 'synchronize',
                                   'payload': "quit"})
                g_last_relunch = g_model_offset
                new_round(True)
            else:
                g_script.post({'type': 'synchronize',
                                   'payload': "go"})
            # log.info("on_message_3")

        if "error" in message["payload"]:
            # log.info("on_message_4")

            msg = message["payload"].strip().split("|")
            # the ExceptionHandler of client will be triggered multiple time.
            if g_model_offset > int(msg[2]):
                log.info("[Host MSG]: duplicate on_message enter")
                return

            reason = msg[1]
            g_model_offset = int(msg[2])
            original_value = int(msg[3])
            new_value = int(msg[4])

            if "dead object" in message["payload"]:
                log.info("[Host MSG]: gotcha err (server) in offset: {}".format(hex(g_model_offset)))
            else:
                log.info("[Host MSG]: gotcha err (app) in offset: {}".format(hex(g_model_offset)))

            with open("./models/{}_crash.log".format(g_task_name), "a+") as fwh:
                fwh.write("---------- crash reason: {}, offset: {} ({}), original value: {}, new value: {} ----------\n".format(
                reason, g_model_offset, hex(g_model_offset), hex(original_value), hex(new_value)))

            collect_crash_log()

            g_model_offset += 4
            new_round(True)
            # log.info("on_message_5")

g_failed_launch = 0
g_relaunch = 1

def new_round(T):
    global g_dev_serial, g_task_name, g_model_file, g_failed_launch, g_relaunch
    # for app in frida.get_usb_device().enumerate_applications():
    #     print("[i] {}".format(app))
    # clean the env
    p = subprocess.Popen("adb -s {} shell am force-stop {}".format(g_dev_serial, "com.huawei.hiaidemoFuzzer"),
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()
    if not T:
        return
    # if stderr != b"":
    #     log.error(stderr)
    #     return

    time.sleep(0.5)

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
    print("[*] new fuzzing starts from: {} ({}).".format(g_model_offset, hex(g_model_offset)))

    while True:
        print("[*] #{} re-launching, with {} failures.".format(g_relaunch, g_failed_launch))
        try:
            p = subprocess.Popen(
                "adb -s {} shell am start -n {} --es \"task_name\" \"{}\" --es \"model_path\" \"{}\"".format(
                    g_dev_serial,
                    "com.huawei.hiaidemoFuzzer/.view.ClassifyActivity",
                    g_task_name,
                    g_model_file
                ),
                shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )
            stdout, stderr = p.communicate()

            time.sleep(1)
            # frida.get_device(g_dev_serial).get_process("Gadget")
            session = frida.get_device(g_dev_serial).attach("Gadget")

            JSFile = open('startModelFromMem2.js')
            JsCodeFromfile = JSFile.read()
            JsCodeFromfile = JsCodeFromfile.replace("proc_name_AAoAA", "Gadget")
            JsCodeFromfile = JsCodeFromfile.replace("mem_offset_AAoAA", str(g_model_offset))
            # print(JsCodeFromfile)
            global g_script
            g_script = session.create_script(JsCodeFromfile)
            g_script.on('message', on_message)
            # time.sleep(0.5)
            g_script.load()
            # g_script.unload()
            break
        except:
            g_failed_launch += 1
            pass
    g_relaunch += 1

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
    global g_model_file, g_task_name, g_dev_serial, g_model_offset, g_last_relunch
    g_model_file = args.model_file
    g_task_name = args.task_name
    g_dev_serial = args.dev_serial
    g_model_offset = args.model_offset
    g_last_relunch = args.model_offset

    new_round(True)

    while(True):
        try:
            sys.stdin.read()
        except:
            pass
    # sys.stdin.read()
    print("NEVER run ME.")
if __name__ == '__main__':
    main()
