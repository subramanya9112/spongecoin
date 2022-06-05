from Crypto.PublicKey import RSA
from flask import Flask, request
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)
started = False

# set variables
# create sidechain
# on sidechain create success

# on transaction
# get blocks info, 1-10, 1-50, 1-100
# get block info, no=100
# on new block


@app.route('/status', methods=['GET'])
def status():
    return {"status": started}


@app.route('/get_chains', methods=['GET'])
def get_chains():
    # TODO: get chains
    return {"chains": "chains"}


@app.route('/start', methods=['POST'])
def start():
    try:
        global started
        if started:
            return {"status": "started"}

        data = request.get_json()
        pub_key = data['pub_key']
        chain = data['chain']
        should_verify = data['should_verify']
        url = data['url']
        transaction_technique = data['transaction_technique']
        minimum_fee = data['minimum_fee']
        maximum_time = data['maximum_time']


        started = True
        return {"status": started}
    except Exception as e:
        return {"status": False, "error": str(e)}


@socketio.on('message')
def handle_message(message):
    send(message)


@app.route('/', methods=['POST'])
def result():
    print(request.data)
    print(request.json)
    print(request.get_json(force=True))


@app.route('/users/<user_id>', methods=['GET', 'POST', 'DELETE'])
def user(user_id):
    if request.method == 'GET':
        print("""return the information for <user_id>""")


if __name__ == '__main__':
    socketio.run(app)
