const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const PORT = 8000;
const Chains = require('./chains.js');
const chain = new Chains();
chain.add('chain1', 'socket1', 'http://localhost:3000/');

app.use(express.json())

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

app.post('/chains', (req, res) => {
    res.json(chain.get_chain_name());
});

app.post('/chain', (req, res) => {
    let { chainName } = req.body;
    if (chainName) {
        res.json(chain.get_chain(chain));
    } else {
        res.status(400).json({ error: 'chainName is required' });
    }
});

app.post('/onTransaction', (req, res) => {
    let { transaction, chainName } = req.body;
    if (transaction && chainName) {
        // emit to all clients
    } else {
        res.status(400).json({ error: 'transaction and chainName is required' });
    }
});

app.get('/', (req, res) => {
    url = chain.get_url();
    if (url) {
        res.redirect(url)
    } else {
        res.send('Sorry, No client is up');
    }
});

server.listen(PORT, () => {
    console.log(`listening on ${PORT}`);
});
