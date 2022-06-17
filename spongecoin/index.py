from Crypto.PublicKey import RSA
from flask import Flask, request
from flask_cors import CORS
from flask_socketio import SocketIO, send
from chain import Chain
from client_ws import ClientWS
import variables

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
CORS(app, resources={r"*": {"origins": "*"}})
socketio = SocketIO(app)

client = None
chain = Chain()


@app.route('/status', methods=['GET'])
def status():
    return {"status": variables.STARTED}


@app.route('/start', methods=['POST'])
def start():
    try:
        if variables.STARTED:
            return {"status": variables.STARTED}

        data = request.get_json()

        # client.connect(variables.REFLECTOR_URL)

        totalCoins = data['totalCoins']
        difficultyTarget = data['difficultyTarget']
        adjustAfterBlocks = data['adjustAfterBlocks']
        timeForEachBlock = data['timeForEachBlock']
        subsidy = data['subsidy']
        subsidyHalvingInterval = data['subsidyHalvingInterval']
        pub_key = data['pub_key']
        minimum_fee = data['minimum_fee']
        maximum_time = data['maximum_time']

        chain.startSpongeChain(
            totalCoins=totalCoins,
            difficultyTarget=difficultyTarget,
            adjustAfterBlocks=adjustAfterBlocks,
            timeForEachBlock=timeForEachBlock,
            subsidy=subsidy,
            subsidyHalvingInterval=subsidyHalvingInterval,
            pub_key=pub_key,
            minimum_fee=minimum_fee,
            maximum_time=maximum_time,
            client=client,
        )

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


@app.route('/mined_coins', methods=['POST'])
def mined_coins():
    return {"chains": "chains"}


@app.route('/mined_blocks', methods=['POST'])
def mined_blocks():
    return {"chains": "chains"}


if __name__ == '__main__':
    socketio.run(app)
