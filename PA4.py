import matplotlib.pyplot as plt
import datetime
import time
from lcg import *
from bbs import *
from ansi_x9_17 import *

def Main():
	print("Test Result for LCG :")
	lcg_main()
	print("Test Result for BBS :")
	bbs_main()
	print("Test Result for ANSI X9.17 :")
	ansi_main()
	
if __name__ == '__main__':
	Main()