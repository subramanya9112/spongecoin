const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 3000;

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        console.log('user disconnected');
    });

    socket.on('listen-on', () => {

    });

    socket.on('stop-listening-on', () => {

    });

    socket.on('miners_count', () => {

    });

    socket.on('transaction', () => {

    });

    socket.on('block', () => {

    });

    socket.on('consensus', () => {

    });

    // create room if unknown found
    // store that miner details

    // broadcast data to that room

    // remove someone from room
});


server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
