import datetime
import time
from scipy.stats import chi2
from des_3 import *

def time_fun():
    time.sleep(.0001)
    t = datetime.datetime.now()
    T = t.strftime("%f")
    T = int(T)%256
    return '{0:0{1}b}'.format(T,8)

def ansi(x0):
    DT = encrypt(time_fun())
    R = encrypt(xor(DT, x0))
    x0 = encrypt(xor(R, DT))
    return R, x0

def freq(x0,n):
    f = [0] * 256
    for i in range(5000):
        R, x0 = ansi(x0)
        f[int(R,2)] += 1
    return f

def seq(x0):
    l = []
    for i in range(30):
        r, x0 = ansi(x0)
        if int(r,2) < 127.5:
            l.append(0)
        else:
            l.append(1)
    return l

def run_test(x0):
    l = seq(x0)
    z = [0, 0]
    c = 1
    for i in range(30):
        z[l[i]] += 1
        if i:
            if l[i]!=l[i-1]:
                c += 1
    if c >= 10 and c <= 19:
        print("Run Test Passed")
    else:
        print("Run Test Failed")

def chi_square_test(f,n):
    exp = n / 256
    D = 0
    for act in f:
        if act < 5:
            print('1')
        D += ((act - exp)**2) / exp
    if D < chi2.ppf(1-0.05, 255):
        print("Chi-Suare Test Passed")
    else:
        print("Chi-Suare Test Failed")

def kolmogorov_smirnov_test(f,n):
    for i in range(256):
        if i:
            f[i] += f[i-1]
    for i in range(256):
        f[i] /= n
    P=0
    N=0
    for i in range(256):
        P = max(P, (i+1)/256 - f[i])
        N = max(N, f[i] - i/256)
    D = max(P,N)
    if D < 0.08488125: #value of D(29) for 5% confidence
        print("Kolmogorov-Smirnov Test Passed")
    else:
        print("Kolmogorov-Smirnov Test Failed")

def ansi_main():
    x0 = '10011101'
    f = freq(x0, 5000)
    run_test(x0)
    chi_square_test(f,5000)
    kolmogorov_smirnov_test(f,5000)