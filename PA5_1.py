import plotly.plotly as plt
import plotly.graph_objs as go

def etf(n):
	phi = []
	for i in range(n+1):
		phi.append(i)

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

plot = go.Scatter(x=x,y=y,mode='markers')

data = [plot]

plt.plot(data, filename='etf')