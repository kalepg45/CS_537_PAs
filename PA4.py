import matplotlib.pyplot as plt
import datetime
import time
from lcg import *
from bbs import *
from ansi_x9_17 import *

def Main():
	print("Test Result for LCG :")
	lcg_main()
	print("Test Result for LCG :")
	bbs_main()
	print("Test Result for LCG :")
	ansi_main()
	
if __name__ == '__main__':
	Main()