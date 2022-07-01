const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 8000;
const cors = require('cors')
const Chains = require('./chains.js');
const chain = new Chains();

app.use(express.json())
app.use(cors())

io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('disconnect', () => {
        chain.removeClient(socket.id);
        console.log('user disconnected');
    });

    socket.on('addToRoom', (data) => {
        const { roomId, url } = data;
        if (roomId && url) {
            socket.join(roomId);
            chain.addClientToChain(roomId, socket.id, url);
        }
    });

    socket.on('removeFromRoom', (data) => {
        const { roomId } = data;
        if (roomId) {
            socket.leave(roomId);
            chain.removeClientFromChain(socket.id, roomId);
        }
    });

    socket.on('minersCount', (data) => {
        const { roomId } = data;
        if (roomId) {
            socket.emit('minersCount', {
                roomId,
                count: chain.getChainDetails(roomId).length,
            });
        } else {
            socket.emit('minersCount', {
                roomId,
                count: chain.getAllChainName().length,
            });
        }
    });

    socket.on('onTransaction', (data) => {
        const { roomId, transaction } = data;
        if (roomId && transaction) {
            socket.broadcast.to(roomId).emit('onTransaction', {
                roomId,
                transaction,
            });
        }
    });

    socket.on('onBlock', (data) => {
        const { roomId, block } = data;
        if (roomId && block) {
            socket.broadcast.to(roomId).emit('onBlock', {
                roomId,
                block,
            });
        }
    });
});

app.post('/chains', (req, res) => {
    res.json(chain.getAllChainName());
});

app.post('/chain', (req, res) => {
    let { chainName } = req.body;
    if (chainName) {
        res.json(chain.getChainDetails(chain));
    } else {
        res.status(400).json({ error: 'chainName is required' });
    }
});

app.post('/minersCount', (req, res) => {
    const { roomId } = req.body;
    if (roomId) {
        res.json({
            count: chain.getChainDetails(roomId).length,
        });
    } else {
        res.json({
            count: chain.getAllChainName().length,
        });
    }
});

app.get('/', (req, res) => {
    url = chain.getURL();
    if (url) {
        res.redirect(url)
    } else {
        res.send('Sorry, No client is up');
    }
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
