from Crypto.PublicKey import RSA
from flask import Flask, request
from flask_socketio import SocketIO, send

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


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
