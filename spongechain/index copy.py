from Crypto.PublicKey import RSA

maxi = 0

key = RSA.generate(2048)
f = open('mykey.pem', 'wb')
f.write(key.export_key('PEM'))
f.close()

f = open('mykey.pem', 'r')
key = RSA.import_key(f.read())
pub = key.n
print(pub)
pub = key.e
print(pub)
pub = key.d
print(pub)
f.close()
