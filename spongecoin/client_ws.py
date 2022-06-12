import socketio


class ClientWS:
    def __init__(self, onConnect, onConnectError, onEvent, onDisconnect):
        self.sio = socketio.Client()
        self.onConnect = onConnect
        self.onConnectError = onConnectError
        self.onEvent = onEvent
        self.onDisconnect = onDisconnect
        self.call_backs()

    def call_backs(self):
        @self.sio.event
        def connect():
            self.onConnect()

        @self.sio.event
        def connect_error(data):
            self.onConnectError(data)

        @self.sio.on('*')
        def catch_all(event, data):
            self.onEvent(event, data)

        @self.sio.event
        def disconnect():
            self.onDisconnect()

    def connect(self, url):
        self.sio.connect(url)

    def emit(self, event, data):
        if self.sio.connected:
            self.sio.emit(event, data)
        else:
            raise Exception("SocketIO is not connected")

    def disconnect(self):
        self.sio.disconnect()
