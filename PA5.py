import matplotlib.pyplot as plt
plt.style.use('seaborn-whitegrid')

def etf(n):
	phi = []
	for i in range(n+1):
		phi.append(i)
	phi[1] = 0
	for p in range(2,n+1):
		if phi[p]==p:
			phi[p] = p-1
			for i in range(2*p,n+1,p):
				phi[i] = phi[i]//p*(p-1)
	return phi

n = int(raw_input("Value of n : "))
y = etf(n)
x = []
for i in range(n+1):
	x.append(i)

plt.axis([0,n,0,n])
plt.plot(x,y,'bo',markersize=2)
plt.xlabel('n')
plt.ylabel('$Phi$(n)')
plt.title("Euler's Totient Funation")

plt.show()