#!usr/bin/env python3
# -*- coding: utf-8 -*-
# @Time    : 2022/1/27 16:28
import subprocess


def kill_by_pkgName(pid):
    command_line = "adb shell am force-stop {}".format(pid)
    run_adb_shell(command_line)


def get_top_info():
    command_line = "adb shell dumpsys activity top|grep ACTIVITY"
    p = subprocess.Popen(command_line,
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()
    return stdout.decode().strip().split("ACTIVITY")[-1]


def run_adb_shell(command_line):
    p = subprocess.Popen(command_line,
                         shell=True, stdin=subprocess.PIPE, stdout=subprocess.PIPE,
                         stderr=subprocess.PIPE
                         )
    stdout, stderr = p.communicate()


def start_by_component_name(component_name):
    command_line = "adb shell am start -n {}".format(component_name)
    run_adb_shell(command_line)


def restart_top():
    activity_info = get_top_info()
    component_name = activity_info.split(" ")[1]
    pkg_name = component_name.split("/")[0]
    print("Top package_name : " + pkg_name)
    kill_by_pkgName(pkg_name)
    start_by_component_name(component_name)
