from flask import Flask, request
from flask_cors import CORS
from chain import Chain
import sys

import variables
from werkzeug.middleware.proxy_fix import ProxyFix

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret'
app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_host=1)
CORS(app, resources={r"*": {"origins": "*"}})

chain = Chain()


@app.route('/status', methods=['GET'])
def status():
    return {"status": variables.STARTED}


@app.route('/startSpongeCoin', methods=['POST'])
def startSpongeCoin():
    try:
        if variables.STARTED:
            return {"status": variables.STARTED}

        data = request.json

        name = data['name']
        totalCoins = 1000000
        difficultyTarget = 0x0000ffff00000000000000000000000000000000000000000000000000000000
        adjustAfterBlocks = 14400
        timeForEachBlock = 60
        subsidy = 50
        subsidyHalvingInterval = 14400
        pub_key = data['pub_key']
        minimum_fee = float(data['minimum_fee'])
        maximum_time = int(data['maximum_time'])
        url = data['url']
        reflectorURL = data['reflectorURL']

        chain.startChain(
            name=name,
            totalCoins=totalCoins,
            difficultyTarget=difficultyTarget,
            adjustAfterBlocks=adjustAfterBlocks,
            timeForEachBlock=timeForEachBlock,
            subsidy=subsidy,
            subsidyHalvingInterval=subsidyHalvingInterval,
            pub_key=pub_key,
            minimum_fee=minimum_fee,
            maximum_time=maximum_time,
            url=url,
            reflector_url=reflectorURL,
        )

        variables.STARTED = True
        return {"status": variables.STARTED}
    except Exception as e:
        return {"status": False, "error": str(e)}


@app.route('/chainName', methods=['POST'])
def getChainName():
    if variables.STARTED:
        return {"status": True, "name": chain.name}
    return {"status": False, "error": "Not started"}


@app.route('/start', methods=['POST'])
def start():
    try:
        data = request.json

        name = data['name']
        pub_key = data['pub_key']
        minimum_fee = int(data['minimum_fee'])
        maximum_time = int(data['maximum_time'])
        url = data['url']
        reflectorURL = data['reflectorURL']

        status = chain.start(
            name=name,
            pub_key=pub_key,
            minimum_fee=minimum_fee,
            maximum_time=maximum_time,
            url=url,
            reflector_url=reflectorURL,
        )
        if status:
            variables.STARTED = True
            return {"status": variables.STARTED}
        else:
            return {"status": variables.STARTED}
    except Exception as e:
        return {"status": False, "error": str(e)}


@app.route('/aboutChain', methods=['POST'])
def aboutChain():
    if variables.STARTED:
        return {
            "status": True,
            "name": chain.name,
            "difficultyTarget": chain.difficultyTarget,
            "adjustAfterBlocks": chain.adjustAfterBlocks,
            "timeForEachBlock": chain.timeForEachBlock,
            "subsidy": chain.subsidy,
            "subsidyHalvingInterval": chain.subsidyHalvingInterval,
        }
    return {"status": False, "error": "Not started"}


@app.route('/block_count', methods=['POST'])
def block_count():
    if variables.STARTED:
        return {
            "status": True,
            "block_count": len(chain.chain),
        }
    return {"status": False, "error": "Not started"}


@app.route('/blocks', methods=['POST'])
def blocks():
    if variables.STARTED:
        try:
            data = request.json

            range = data['range']
            if range not in [10, 20, 50, 100]:
                return {"status": False, "error": "Invalid range"}
            start = data['start']

            return {
                "status": True,
                "blocks": chain.chain[::-1][start: start + range]
            }
        except Exception as e:
            return {"status": False, "error": str(e)}
    return {"status": False, "error": "Not started"}


@app.route('/block', methods=['POST'])
def block():
    if variables.STARTED:
        try:
            data = request.json

            block_id = data['block_id']
            return {
                "status": True,
                "block": chain.chain[block_id - 1],
            }
        except Exception as e:
            return {"status": False, "error": str(e)}
    return {"status": False, "error": "Not started"}


@app.route('/chain', methods=['POST'])
def getChain():
    if variables.STARTED:
        return {
            "status": True,
            "chain": chain.chain,
        }
    return {"status": False, "error": "Not started"}


@app.route('/get_reflector_url', methods=['POST'])
def get_reflector_url():
    if variables.STARTED:
        return {
            "status": True,
            "reflector_url": chain.reflector_url,
        }
    return {"status": False, "error": "Not started"}


@app.route('/transaction', methods=['POST'])
def transaction():
    if variables.STARTED:
        try:
            data = request.json

            transaction_id = data['transaction_id']
            return {
                "status": True,
                "transaction": chain.getTransaction(transaction_id),
            }
        except Exception as e:
            return {"status": False, "error": str(e)}
    return {"status": False, "error": "Not started"}


@app.route('/client_transactions', methods=['POST'])
def client_transactions():
    if variables.STARTED:
        try:
            data = request.json
            accountId = data['accountId']
            transactions, amount = chain.getClientTransactions(accountId)

            return {
                "status": True,
                "transaction": transactions,
                "amount": amount,
            }
        except Exception as e:
            return {"status": False, "error": str(e)}
    return {"status": False, "error": "Not started"}


@app.route('/client_getUTXO', methods=['POST'])
def client_getUTXO():
    if variables.STARTED:
        try:
            data = request.json
            accountId = data['accountId']
            utxo = chain.getUTXOs(accountId)

            return {
                "status": True,
                "utxos": utxo,
            }
        except Exception as e:
            return {"status": False, "error": str(e)}
    return {"status": False, "error": "Not started"}


@app.route('/on_transaction', methods=['POST'])
def onTransaction():
    if variables.STARTED:
        try:
            data = request.json

            transaction = data['transaction']
            added = chain.onTransaction(transaction)
            return {
                "status": True,
                "transaction_added": added
            }
        except Exception as e:
            return {"status": False, "error": str(e)}
    return {"status": False, "error": "Not started"}


@app.route('/create_sidechain', methods=['POST'])
def create_sidechain():
    if variables.STARTED:
        try:
            data = request.json
            transaction = data['transaction']
            added = chain.createSideChain(transaction, changeChain=True)
            return {
                "status": True,
                "sidechain_added": added
            }
        except Exception as e:
            print(e)
            return {"status": False, "error": str(e)}
    return {"status": False, "error": "Not started"}


if __name__ == '__main__':
    if len(sys.argv) >= 2:
        app.run(port=int(sys.argv[1]), debug=True)
    else:
        app.run(host='0.0.0.0', port=80)
