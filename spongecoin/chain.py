import Timer
import random
import hashlib
import json
import time

from transaction import Transaction


class Chain:
    def __init__(self) -> None:
        self.chain = []
        self.pending_transactions = []
        self.pending_transactions_fee = 0
        self.difficultyTarget = None
        self.adjustAfterBlocks = None
        self.timeForEachBlock = None
        self.subsidy = None
        self.subsidyHalvingInterval = None
        self.pub_key = None
        self.minimum_fee = None
        self.maximum_time = None
        self.client = None
        self.timer = None

        self.sha512 = hashlib.sha512()

    def startSpongeChain(
            self,
            totalCoins,
            difficultyTarget,
            adjustAfterBlocks,
            timeForEachBlock,
            subsidy,
            subsidyHalvingInterval,
            pub_key,
            minimum_fee,
            maximum_time,
            client,
    ) -> None:
        self.difficultyTarget = difficultyTarget
        self.adjustAfterBlocks = adjustAfterBlocks
        self.timeForEachBlock = timeForEachBlock
        self.subsidy = subsidy
        self.subsidyHalvingInterval = subsidyHalvingInterval
        self.pub_key = pub_key
        self.minimum_fee = minimum_fee
        self.maximum_time = maximum_time
        self.client = client

        # Create genesis block
        self.pending_transactions.append(Transaction.GetGenesisBlock(
            totalCoins=totalCoins,
            difficultyTarget=difficultyTarget,
            adjustAfterBlocks=adjustAfterBlocks,
            timeForEachBlock=timeForEachBlock,
            subsidy=subsidy,
            subsidyHalvingInterval=subsidyHalvingInterval,
        ))

        # Start the timer for mining
        self.timer = Timer(self.maximum_time, self.mine)
        self.timer.start()

    def start(self) -> None:
        # TODO: get the data from clients

        # TODO: set here

        # TODO: start the timer
        pass

    def mine(self) -> None:
        if self.timer != None:
            self.timer.cancel()

        # if the no_of_block % adjust_after_block == 0, set the difficulty target to the next difficulty target
        if len(self.chain) != 0 and len(self.chain) % self.adjustAfterBlocks == 0:
            self.difficultyTarget *= (1)
            # TODO: adjust the difficulty target
            pass

        # TODO: Add a coin base transaction to the pending transactions

        # Create a block
        block = self.create_block()

        # Mine the block
        while True:
            block['nonce'] = random.getrandbits(128)
            hash = self.sha512.update(str(json.dumps(block)).encode('utf-8'))
            if hash < self.difficultyTarget:
                break

        self.chain.append(block)
        # TODO: Send to all

        self._timer = Timer(self.maximum_time, self._run)
        self._timer.start()

    def on_transaction(self, transaction) -> None:
        # TODO: verify the transaction signature

        # TODO: verify has balance using the chain data and also the pending_transactions

        # TODO: add the transaction to the pending transactions

        # TODO: if transaction_fee is not enough, return

        # TODO: else call mine
        pass

    def create_block(self):
        # TODO: create a block
        od = {}
        od['version'] = 1
        od['previousBlockHash'] = 1
        od['merkleRoot'] = 1
        od['timestamp'] = time.time()
        od['difficultyTarget'] = 1
        od['nonce'] = 1
        od['transaction_length'] = 1
        od['transactions'] = self.pending_transactions
