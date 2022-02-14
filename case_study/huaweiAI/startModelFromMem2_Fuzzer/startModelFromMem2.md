It's compatible and faster (About 2x faster than previous scheme).

# HowTO
1. upload the `om` file to `/sdcard/models/`.
2. use startModelFromMem2.py to start fuzzing.
```
usage: startModelFromMem2.py [-h] --model-file MODEL_FILE --task-name
                             TASK_NAME --dev-serial DEV_SERIAL --model-offset
                             MODEL_OFFSET

optional arguments:
  -h, --help            show this help message and exit
  --model-file MODEL_FILE
                        The model file.
  --task-name TASK_NAME
                        Code name of this task, used to name the crash log
                        file.
  --dev-serial DEV_SERIAL
                        Serial of the device.
  --model-offset MODEL_OFFSET
                        Offset of model file.

e.g., 
python3 startModelFromMem2.py --model-file="/sdcard/models/detection.om" --task-name="detection" --dev-serial="JAM6R20406000226" --model-offset=32616
python3 startModelFromMem2.py --model-file="/sdcard/models/detection.om" --task-name="detection" --dev-serial="192.168.5.32:5555" --model-offset=206608
```

NOTE: the client is not well written to exhaust the resource, e.g., iterative lunching will issue below log, such that I restart the app per 2000 lunches.
```commandline
panmac@panmacdeMacBook-Pro Desktop % adb logcat | grep "CreateAshmemFd done"
02-12 23:51:50.798 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11018
02-12 23:51:50.886 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11020
02-12 23:51:50.970 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 10669
02-12 23:51:51.066 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11021
02-12 23:51:51.239 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11022
02-12 23:51:51.315 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11024
02-12 23:51:51.405 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11023
02-12 23:51:51.497 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11025
02-12 23:51:51.671 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11027
02-12 23:51:51.749 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11026
02-12 23:51:51.826 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11028
02-12 23:51:51.903 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11030
02-12 23:51:52.123 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11031
02-12 23:51:52.204 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11034
02-12 23:51:52.323 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11029
02-12 23:51:52.402 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11032
02-12 23:51:52.573 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11035
02-12 23:51:52.644 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11033
02-12 23:51:52.744 17593 17640 I aiclient: CreateAshmemFd done, name: handle_wrap_buffer, size: 420417, fd: 11036
```