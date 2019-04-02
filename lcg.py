import matplotlib.pyplot as plt
from scipy.stats import chi2

def freq(x0,a,c,m,n):
    f= {}
    x = x0
    for i in range(n):
        x = (a * x0 + c) % m
        if x in f:
            f[x] += 1
        else:
            f[x] = 1
    return f

def chi_square_test(f,n,m):
    exp = n / (m-1)
    D = 0
    for act in f.values():
        D += ((act-exp)**2) / exp
    if D < chi2.ppf(1-0.05, m-1):
        print("Chi-Suare Test Passed")
    else:
        print("Chi-Suare Test Failed")

def spectral_test(m,a,c):
    x=[i for i in range(m)]
    y=[(a*i+c)%m for i in range(m)]
    plt.scatter(x,y,s=5)
    plt.title("Spectral test for LCG")
    plt.xlabel("x(n-1)")
    plt.ylabel("x(n)")
    plt.show()

def kolmogorov_smirnov_test(l,n,m):
    f = [0] * m
    for i in l:
        f[i] = l[i]
    for i in range(m):
        if i:
            f[i] += f[i-1]
    for i in range(m):
        f[i] /= n
    P=0
    N=0
    for i in range(m):
        if i:
            P = max(P, i/(m-1) - f[i])
            N = max(N, f[i] - (i-1)/(m-1))
    D = max(P,N)
    if D<0.23: # value of D(29) for 5% confidence
        print("Kolmogorov-Smirnov Test Passed")
    else:
        print("Kolmogorov-Smirnov Test Failed")
        
def lcg_main():
    x0 = 8
    a = 23
    c = 5
    f = freq(x0,a,c,31,1000)
    chi_square_test(f,1000,31)
    spectral_test(31,a,c)
    kolmogorov_smirnov_test(f,1000,31)