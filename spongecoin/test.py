from Crypto.PublicKey import RSA
from flask import Flask, request
from flask_socketio import SocketIO, send
from chain import Chain
import variables

# create app
app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
socketio = SocketIO(app)

chain = Chain()
chain.startSpongeChain(
    2100,
    0x0000ffff00000000000000000000000000000000000000000000000000000000,
    5,
    20,
    50,
    120,
    """-----BEGIN PUBLIC KEY-----
MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAsOAGoh0dDZPtrYqixggL
W2wWz43ZPPgM5Mq+9yNlsfQSefS0IEOf9SftMsiP+cYDBVFPb0gbHXdIjucSpVFz
BH94e/Uly/IXlQ8bHJ8mFuAvNFn6i1+H29J5lC+ZCZsGd2VN5a3iAWtnsFYvqPHf
6yDKxMFfp7iRhgkCNHSVBsdppjERX7AUTkqVH6dDOjPvJX6OJJFTPj4YpqaE/DfY
XukkGcy9INP71367fR7Ux62MlsjL+hcda84PxepoPWMtf5xRElVo46yyfWRWF+VS
HltdBBQ/OzAxsCYcRClydflFkPpA5kyAsjz4D9eKT3oEczJkzZEbeiIn0yLdrNhY
V+XYwZrxsEPje9CmSO3sscUQCE+m4yu/rGdg2hK/yWHUxRopawcN/mg3V5PubRAH
Dv/a6RiKCp/3gSXqApOpW8e9UO9y+xh/aLXsU89kaab/v2weAvR4nOqbltduJC1G
77WBj7VVxuZ3NYgxYPGuNJ0HIkUYZ5kSPN3SWhPAJM5Y1yz2Kz2SvbXAdEIHxH/N
TwPr4rONhl1CsMVKVSoqxcZOs+73hroT0XCvOcBm09uWUES59CgRD9igNLtlIKgM
Hz3UfSYghPiwLwKusJ5cNcaT8ct5AP95LimHtLMX09Yf5X5kxN1VxJGvIkvNkykm
OARu1iHafh3NGdY/+lSrI0cCAwEAAQ==
-----END PUBLIC KEY-----
""",
    2,
    10,
    None
)
variables.STARTED = True


@app.route('/status', methods=['GET'])
def status():
    return {"status": variables.STARTED}


@app.route('/start', methods=['GET'])
def start():
    return {"chain": chain.chain}


if __name__ == '__main__':
    socketio.run(app, port=5000)
