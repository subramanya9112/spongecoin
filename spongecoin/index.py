from Crypto.PublicKey import RSA
from flask import Flask, request
from flask_socketio import SocketIO, send
from chain import Chain
from client_ws import ClientWS
import variables

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
socketio = SocketIO(app)

client = ClientWS()
chain = None


@app.route('/status', methods=['GET'])
def status():
    return {"status": variables.STARTED}


@app.route('/start', methods=['POST'])
def start():
    try:
        if variables.STARTED:
            return {"status": variables.STARTED}

        data = request.get_json()
        
        client.connect(variables.REFLECTOR_URL)
        
        pub_key = data['pub_key']
        chain = data['chain']
        should_verify = data['should_verify']
        url = data['url']
        transaction_technique = data['transaction_technique']
        minimum_fee = data['minimum_fee']
        maximum_time = data['maximum_time']

        variables.STARTED = True
        return {"status": variables.STARTED}
    except Exception as e:
        return {"status": False, "error": str(e)}


@app.route('/block_count', methods=['POST'])
def block_count():
    return {"chains": "chains"}


@app.route('/transaction', methods=['POST'])
def transaction():
    return {"chains": "chains"}


@app.route('/client_balance', methods=['POST'])
def client_balance():
    return {"chains": "chains"}


@app.route('/client_transactions', methods=['POST'])
def client_transactions():
    return {"chains": "chains"}


@app.route('/blocks', methods=['POST'])
def blocks():
    return {"chains": "chains"}


@app.route('/blocks/<block_number>', methods=['POST'])
def blocks_block_number(block_number):
    return {"chains": "chains"}


@app.route('/create_sidechain', methods=['POST'])
def create_sidechain():
    return {"chains": "chains"}


@app.route('/mined_coins', method=['POST'])
def mined_coins():
    return {"chains": "chains"}


@app.route('/mined_blocks', methods=['POST'])
def mined_blocks():
    return {"chains": "chains"}


if __name__ == '__main__':
    socketio.run(app)
