from subprocess import Popen, PIPE
import os
import logging
import sys

logging.basicConfig(stream=sys.stdout, format="%(levelname)s: %(asctime)s: %(message)s", level=logging.INFO, datefmt='%a %d %b %Y %H:%M:%S')
log = logging.getLogger(__name__)

class WithdrawInterface(object):
    BINARY_loc = None
    LOG_loc = None
    LOG_tmp = None

    IDA_loc = None

    IR_loc = None
    # IR_name = None
    Script_loc = None

    def __init__(self, binary_loc, log_loc, ida_loc = r"/Applications/IDA\ Pro\ 7.0/ida.app/Contents/MacOS/ida64"):
        self.BINARY_loc = binary_loc
        self.LOG_loc = log_loc
        self.LOG_tmp = self.LOG_loc + ".tmp"
        self.IDA_loc = ida_loc

        self.IR_loc = ('.').join(binary_loc.split('.')[:-1]) + ".i64"
        # self.IR_loc, self.IR_name = os.path.split(binary_loc);
        # self.IR_name = ('.').join(self.IR_name.split('.')[:-1]) + ".i64"
        self.Script_loc = os.path.join(os.getcwd(), "AnalysisInterface.idc")

        # self.IR_loc = ('.').join(binary_loc.split('.')[:-1]) + ".i64"

        # print("foo")

    def pre_process(self):
        # os.system("\"{}\" -B \"{}\"".format(self.IDA_loc, self.BINARY_loc))
        # cmd = [self.IDA_loc, "-B", self.BINARY_loc]
        # p = Popen(cmd,
        p = Popen("{} -B {}".format(self.IDA_loc, self.BINARY_loc),
                  stdout=PIPE,
                  stderr=PIPE,
                  shell=True)
        stdout, stderr = p.communicate()
        print(stderr.decode())
        return
        # return error message or sth.
        # if stderr.decode() == "":
        #     return True
        # else:
        #     return False
    def analysis_go(self):

        # os.system("\"{}\" \"{}\" -A -S\"{} {}\"".format(self.IDA_loc, self.IR_loc, self.Script_loc, self.LOG_tmp))
        # return
        # https://hex-rays.com/products/ida/support/idadoc/417.shtml

        # **** the IR_loc should be the last args, pay attention to the IDA_loc argument in the mean time.
        p = Popen("{} -A -S\"{} {}\" {}".format(self.IDA_loc, self.Script_loc, self.LOG_tmp, self.IR_loc),
                  stdout=PIPE,
                  stderr=PIPE,
                  shell=True
                  )
        stdout, stderr = p.communicate()
        print(stderr.decode())

        return

    def post_process(self):
        # verify the result
        return

def main():
    parser = WithdrawInterface(
        binary_loc = "/Users/panmac/Desktop/workspace/hwservice_sec/demo/jpegdec/vendor.huawei.hardware.jpegdec@1.0.so",
        log_loc = "/Users/panmac/Desktop/workspace/hwservice_sec/code/log.txt",
        ida_loc = r"/Applications/IDA\ Pro\ 7.0/ida.app/Contents/MacOS/ida64",
    )
    parser.pre_process()
    parser.analysis_go()
    parser.post_process()
    logging.info("** log file loc: {} **".format(parser.LOG_loc))

if __name__ == '__main__':
    main()