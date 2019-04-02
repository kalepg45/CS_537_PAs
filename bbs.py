from scipy.stats import chi2

def freq(x0,m,n):
    x0=(x0**2)%m
    f = {}
    x = x0
    for i in range(n):
        x = (x**2)%m
        if x&1 in f:
            f[x&1] += 1
        else:
            f[x&1] = 1
    return f

def bbs_seq(x0,m,n):
    x0=(x0**2)%m
    a = []
    x = x0
    for i in range(n):
        x = (x**2)%m
        a.append(x&1)
    return a

def run_test(x0,m,n):
    a = bbs_seq(x0,m,n)
    f = [0, 0]
    c = 1
    for i in range(n):
        f[a[i]] += 1
        if i:
            if a[i] != a[i-1]:
                c += 1
    if c>=11 and c<=21: # for n = 30
        print("Run Test Passed")
    else:
        print("Run Test Failed")

def chi_square_test(f,n,m):
    exp = 1.0*n / (m-1)
    D = 0
    for act in f.values():
        D += ((act-exp)**2) / exp
    if D < chi2.ppf(1-0.05, m-1):
        print("Chi-Suare Test Passed")
    else:
        print("Chi-Suare Test Failed")

def kolmogorov_smirnov_test(l,n,m):
    f = [0, 0]
    f[0] = l[0]
    f[1] = l[1]
    for i in range(2):
        f[i] /= n
    P=0
    N=0
    for i in range(2):
        P = max(P, (i+1)/2 - f[i])
        N = max(N, f[i] - i/2)
    D = max(P,N)
    if D < 0.975: # value of D(29) for 5% confidence
        print("Kolmogorov-Smirnov Test Passed")
    else:
        print("Kolmogorov-Smirnov Test Failed")

def bbs_main():
    x0 = 101355
    m = 192649
    f = freq(x0,m,1000)
    run_test(x0,m,30)
    chi_square_test(f,1000,m)
    kolmogorov_smirnov_test(f,1000,31)