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
    0x11,
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
