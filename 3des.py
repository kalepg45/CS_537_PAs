#fixed params
FIXED_IP = [2, 6, 3, 1, 4, 8, 5, 7]
FIXED_EP = [4, 1, 2, 3, 2, 3, 4, 1]
FIXED_IP_INVERSE = [4, 1, 3, 5, 7, 2, 8, 6]
FIXED_P10 = [3, 5, 2, 7, 4, 10, 1, 9, 8, 6]
FIXED_P8 = [6, 3, 7, 4, 8, 5, 10, 9]
FIXED_P4 = [2, 4, 3, 1]

S0 = [[1, 0, 3, 2],
      [3, 2, 1, 0],
      [0, 2, 1, 3],
      [3, 1, 3, 2]]

S1 = [[0, 1, 2, 3],
      [2, 0, 1, 3],
      [3, 0, 1, 0],
      [2, 1, 0, 3]]

#fixed keys
KEY1 = '0111111101'
KEY2 = '0110101110'

#permutation function
def permutate(original, fixed_key):
    return ''.join(original[i - 1] for i in fixed_key)

#return left half of 8-bit block
def left_half(bits):
    return bits[:len(bits)//2]

#return right half of 8-bit block
def right_half(bits):
    return bits[len(bits)//2:]

#shifts of key
def shift(bits):
    rotated_left_half = left_half(bits)[1:] + left_half(bits)[0]
    rotated_right_half = right_half(bits)[1:] + right_half(bits)[0]
    return rotated_left_half + rotated_right_half

#key of round 1(E)
key1=permutate(shift(permutate(KEY1, FIXED_P10)), FIXED_P8)

#key of round 2(E)
key2=permutate(shift(shift(shift(permutate(KEY1, FIXED_P10)))), FIXED_P8)

#key of round 1(D)
key3=permutate(shift(permutate(KEY2, FIXED_P10)), FIXED_P8)

#key of round 2(D)
key4=permutate(shift(shift(shift(permutate(KEY2, FIXED_P10)))), FIXED_P8)

#XOR function
def xor(bits, key):
    return ''.join(str(((bit + key_bit) % 2)) for bit, key_bit in
                   zip(map(int, bits), map(int, key)))

def xor(a,b):
    y = int(a,2) ^ int(b,2)
    return '{0:0{1}b}'.format(y,len(a))

#S-box lookup
def lookup_in_sbox(bits, sbox):
    row = int(bits[0] + bits[3], 2)
    col = int(bits[1] + bits[2], 2)
    return '{0:02b}'.format(sbox[row][col])

#f(p,k)
def f_k(bits, key):
    L = left_half(bits)
    R = right_half(bits)
    bits = permutate(R, FIXED_EP)
    bits = xor(bits, key)
    bits = lookup_in_sbox(left_half(bits), S0) + lookup_in_sbox(right_half(bits), S1)
    bits = permutate(bits, FIXED_P4)
    return xor(bits, L)

def E(plain_text):
    bits = permutate(plain_text, FIXED_IP)
    temp = f_k(bits, key1)
    bits = right_half(bits) + temp
    bits = f_k(bits, key2)
    return(permutate(bits + temp, FIXED_IP_INVERSE))

def D(cipher_text):
    bits = permutate(cipher_text, FIXED_IP)
    temp = f_k(bits, key4)
    bits = right_half(bits) + temp
    bits = f_k(bits, key3)
    return(permutate(bits + temp, FIXED_IP_INVERSE))

#3-DES
def encrypt(plain_text):
    return E(D(E(plain_text)))