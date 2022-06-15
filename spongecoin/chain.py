import Timer


class Chain:
    def __init__(self) -> None:
        self.chain = []
        self.pending_transactions = []
        self.pending_transactions_fee = 0
        self.timeForEachBlock = None
        self.adjustAfterBlocks = None
        self.difficultyTarget = None
        self.pub_key = None
        self.minimum_fee = None
        self.maximum_time = None
        self.client = None
        self.time = None

    def startSpongeChain(
            self,
            timeForEachBlock,
            adjustAfterBlocks,
            difficultyTarget,
            pub_key,
            minimum_fee,
            maximum_time,
            client,
    ) -> None:
        self.timeForEachBlock = timeForEachBlock
        self.adjustAfterBlocks = adjustAfterBlocks
        self.difficultyTarget = difficultyTarget
        self.pub_key = pub_key
        self.minimum_fee = minimum_fee
        self.maximum_time = maximum_time
        self.client = client

        # create genesis block

    def start(self) -> None:
        # get the data from clients
        # set here
        pass

    def mine(self) -> None:
        if self.timer != None:
            self.timer.cancel()

        # mine the block

        self._timer = Timer(self.maximum_time, self._run)
        self._timer.start()

    def on_transaction(self, transaction) -> None:
        # verify the transaction signature

        # verify has balance using the chain data and also the pending_transactions

        # add the transaction to the pending transactions

        # if transaction_fee is not enough, return

        # else call mine
        pass

    def create_block(self):
        od = {}
        od['version'] = 1
        od['previousBlockHash'] = 1
        od['merkleRoot'] = 1
        od['timestamp'] = 1
        od['difficultyTarget'] = 1
        od['Nonce'] = 1
        od['transaction_length'] = 1
        od['transactions'] = self.pending_transactions
