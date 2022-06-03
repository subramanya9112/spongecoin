from Crypto.PublicKey import RSA

maxi = 0

key = RSA.generate(2048)
print(key.size_in_bits)
