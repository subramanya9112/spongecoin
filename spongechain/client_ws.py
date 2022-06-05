import socketio
import time


class ClientWS:
    instance = None

    @staticmethod
    def INSTANCE():
        if ClientWS.instance == None:
            ClientWS.instance = ClientWS()
        return ClientWS.instance

    def __init__(self):
        self.sio = socketio.Client()
        self.call_backs()

    def call_backs(self):
        @self.sio.event
        def connect():
            # on connected
            print("I'm connected!")

        @self.sio.event
        def connect_error(data):
            # on connection error
            print("The connection failed!")

        @self.sio.on('*')
        def catch_all(event, data):
            # catch all events
            print(event)
            print(data)

        @self.sio.event
        def disconnect():
            # on disconnected
            print("I'm disconnected!")

    def connect(self, url):
        self.sio.connect(url)

    def emit(self, event, data):
        if self.sio.connected:
            self.sio.emit(event, data)

    def disconnect(self):
        self.sio.disconnect()


ClientWS.INSTANCE.connect("http://localhost:3000")
time.sleep(5)
ClientWS.INSTANCE.disconnect()
ClientWS.INSTANCE.connect("http://localhost:5000")
ClientWS.INSTANCE.disconnect()
