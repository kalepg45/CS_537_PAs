import os, random, cv2
import numpy as np
from matplotlib import pyplot as plt
from Crypto.Cipher import DES
from Crypto.Random import get_random_bytes

def img_2_bin_img(filename):
	img = cv2.imread(filename,0)
	ret,th1 = cv2.threshold(img,130,255,cv2.THRESH_BINARY)
	r, c = th1.shape
	th1 = cv2.resize(th1,(256, int(256*r/c)))
	cv2.imwrite('binary_'+filename,th1)
	return th1

def bin_img_2_data(img):
	r, c = img.shape
	res = ''
	for i in range(r):
		for j in range(c):
			if img[i][j]==0:
				res += '0'
			else:
				res += '1'
	return res

def bin_2_ascii(data):
	res = ''
	for i in range(0,len(data),8):
		x = 0
		for j in range(i,i+8):
			x = 2*x
			if data[j]=='1':
				x += 1
		res += chr(x)
	return res

def ascii_2_bin(text):
	res = ''
	for i in range(len(text)):
		x = '{0:08b}'.format(ord(text[i]))
		res += x
	return res

def data_2_bin_img(data):
	res = []
	for i in range(0,len(data),256):
		temp = []
		for j in range(i,i+256):
			if data[j]=='1':
				temp.append(255)
			else:
				temp.append(0)
		res.append(temp)
	return res

def encrypt(key, filename):
	chunksize = 64*1024
	opfile_ecb = "ecb_"+filename
	opfile_cbc = "cbc_"+filename
	IV = get_random_bytes(8)

	des_ecb = DES.new(key, DES.MODE_ECB)
	des_cbc = DES.new(key, DES.MODE_CBC, IV)

	img = img_2_bin_img(filename)
	data = bin_img_2_data(img)
	data = bin_2_ascii(data)

	cipher_ecb = ''
	cipher_cbc = ''
	for i in range(0,len(data),8):
		s = data[i:i+8]
		cipher_ecb += des_ecb.encrypt(s)
		cipher_cbc += des_cbc.encrypt(s)

	c_data_ecb = ascii_2_bin(cipher_ecb)
	c_data_ecb = data_2_bin_img(c_data_ecb)
	c_data_cbc = ascii_2_bin(cipher_cbc)
	c_data_cbc = data_2_bin_img(c_data_cbc)

	c_data_ecb = np.matrix(c_data_ecb)
	c_data_cbc = np.matrix(c_data_cbc)
	cv2.imwrite('ecb_'+filename,c_data_ecb)
	cv2.imwrite('cbc_'+filename,c_data_cbc)

def Main():
	filename = raw_input("File to encrypt: ")
	key = get_random_bytes(8)
	q = raw_input("Query : ")
	encrypt(key, filename)
	img = cv2.imread('binary_'+filename, 0)
	img_1 = cv2.imread('ecb_'+filename, 0)
	img_2 = cv2.imread('cbc_'+filename, 0)
	if q=='0':
		fig = plt.figure(figsize=(1,3))
		fig.add_subplot(1,3,1)
		plt.imshow(img, cmap='Greys',  interpolation='nearest')
		fig.add_subplot(1,3,2)
		plt.imshow(img_1, cmap='Greys',  interpolation='nearest')
		fig.add_subplot(1,3,3)
		plt.imshow(img_2, cmap='Greys',  interpolation='nearest')
		plt.show()
	else:
		cv2.imshow('binary_image', img)
		cv2.imshow('ecb_mode_encryption', img_1)
		cv2.imshow('cbc_mode_encryption', img_2)
		cv2.waitKey(0)
		cv2.destroyAllWindows()

if __name__ == '__main__':
	Main()