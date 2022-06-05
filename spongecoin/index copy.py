from Crypto.PublicKey import RSA
from Crypto.Hash import SHA512
# maxi = 0

key = RSA.generate(2048)
print(key.export_key('PEM'))

# f = open('mykey.pem', 'r')
# key = RSA.import_key(f.read())
# pub = key.n
# print(pub)
# pub = key.e
# print(pub)
# pub = key.d
# print(pub)
# f.close()

# print(int(SHA512.new(b'Hello, world!').hexdigest(), 16) < 2 ** 600)
