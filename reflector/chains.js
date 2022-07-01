class Chains {
    constructor() {
        // mapping of chain=>sockets
        this.chains = {};
        this.urls = [];
    }

    addClientToChain(chainName, socketId, url) {
        if (!this.chains[chainName]) {
            this.chains[chainName] = [];
        }
        this.chains[chainName].push({
            socketId: socketId,
            url: url
        });
        this.urls.push(url);
    }

    getAllChainName() {
        return Object.keys(this.chains);
    }

    getChainDetails(chainName) {
        let urls = [];
        if (this.chains[chainName]) {
            for (var i = 0; i < this.chains[chainName].length; i++) {
                urls.push(this.chains[chainName][i].url);
            }
        }
        return this.urls;
    }

    getURL() {
        let url = this.urls.shift();
        this.urls.push(url);
        return url;
    }

    removeClientFromChain(socketId, chainName) {
        if (this.chains[chainName]) {
            for (var i = this.chains[chainName].length; i--;) {
                if (this.chains[chainName][i].socketId == socketId) {
                    for (var j = this.urls.length; j--;) {
                        if (this.urls[j] == this.chains[chainName][i].url) {
                            this.urls.splice(j, 1);
                        }
                    }
                    this.chains[chainName].splice(i, 1);
                    break;
                }
            }
        }
    }

    removeClient(socketId) {
        Object.entries(this.chains).forEach(([chainName, chain]) => {
            for (var i = chain.length; i--;) {
                if (chain[i].socketId == socketId) {
                    for (var j = this.urls.length; j--;) {
                        if (this.urls[j] == chain[i].url) {
                            this.urls.splice(j, 1);
                        }
                    }
                    chain.splice(i, 1);
                    break;
                }
            }
        });
    }
}

module.exports = Chains;
