class Chains {
    constructor() {
        // mapping of chain=>sockets
        this.chains = {};
        this.urls = [];
    }

    add(chainName, socketId, url) {
        if (!this.chains[chainName]) {
            this.chains[chainName] = [];
        }
        this.chains[chainName].push({
            socketId: socketId,
            url: url
        });
        this.urls.push(url);
    }

    get_chain_name() {
        return Object.keys(this.chains);
    }

    get_chain(chainName) {
        let urls = [];
        if (this.chains[chainName]) {
            for (var i = 0; i < this.chains[chainName].length; i++) {
                urls.push(this.chains[chainName][i].url);
            }
        }
        return this.urls;
    }

    get_url() {
        let url = this.urls.shift();
        this.urls.push(url);
        return url;
    }

    remove(socketId, chainsName) {
        for (var chainName in chainsName) {
            if (this.chains[chainName]) {
                for (var i = this.chains[chainName].length; i--;) {
                    if (this.chains[chainName][i].socketId === socketId) {
                        this.chains[chainName].splice(i, 1);
                        for (var j = this.urls; j--;) {
                            if (this.urls[j] === this.chains[chainName][i].url) {
                                this.urls.splice(j, 1);
                            }
                        }
                        break;
                    }
                }
            }
        }
    }
}

module.exports = Chains;
