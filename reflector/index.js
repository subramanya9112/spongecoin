const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 3000;

io.on('connection', () => {
    // create room if unknown found
    // store that miner details

    // broadcast data to that room

    // remove someone from room
});


server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
