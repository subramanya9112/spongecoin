import json
import random
import time
from Crypto.Signature import PKCS1_v1_5
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from threading import Timer, Thread
from transaction import Transaction
from client_ws import ClientWS


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
        self.name = None
        self.reflector_url = None
        self.client = ClientWS(
            onConnect=self.onConnect,
            onConnectError=self.onConnectError,
            onDisconnect=self.onDisconnect,
            onEvent=self.onEvent,
        )
        self._timer = None
        self.stop = False

    def onConnect(self) -> None:
        print("Connected to the reflector")

    def onConnectError(self, err) -> None:
        print("Connect Error " + err)

    def onDisconnect(self) -> None:
        print("Disconnected")

    def onEvent(self, event, data) -> None:
        if data.roomId == self.name:
            if event == "minersCount":
                pass
            elif event == "onTransaction":
                self.onTransaction(data.transaction)
            elif event == "onBlock":
                self.onBlock(data.block)

    def startSpongeChain(
            self,
            name,
            totalCoins,
            difficultyTarget,
            adjustAfterBlocks,
            timeForEachBlock,
            subsidy,
            subsidyHalvingInterval,
            pub_key,
            minimum_fee,
            maximum_time,
            url,
            reflector_url
    ) -> None:
        self.name = name
        self.difficultyTarget = difficultyTarget
        self.adjustAfterBlocks = adjustAfterBlocks
        self.timeForEachBlock = timeForEachBlock
        self.subsidy = subsidy
        self.subsidyHalvingInterval = subsidyHalvingInterval
        self.pub_key = pub_key
        self.minimum_fee = minimum_fee
        self.maximum_time = maximum_time
        self.reflector_url = reflector_url

        # Create genesis block
        self.pending_transactions.append(Transaction.GetGenesisTransaction(
            name=name,
            totalCoins=totalCoins,
            difficultyTarget=difficultyTarget,
            adjustAfterBlocks=adjustAfterBlocks,
            timeForEachBlock=timeForEachBlock,
            subsidy=subsidy,
            subsidyHalvingInterval=subsidyHalvingInterval,
        ))

        # Connect to reflector
        self.client.connect(reflector_url)
        self.client.emit("addToRoom", {
            "roomId": self.name,
            "url": url,
        })

        # Start the timer for mining
        self.startTimer()

    def start(self) -> None:
        # TODO: get the data from clients

        # TODO: set here

        # TODO: start the timer
        pass

    def calculateSubsidy(self) -> int:
        halvings = len(self.chain) / self.subsidyHalvingInterval
        return self.subsidy // (2 ** halvings)

    def startTimer(self) -> None:
        self._timer = Timer(self.maximum_time, self.mine)
        self._timer.start()

    def adjustDifficultyTarget(self) -> None:
        # if the no_of_block % adjust_after_block == 0, set the difficulty target to the next difficulty target
        if len(self.chain) != 0 and len(self.chain) % self.adjustAfterBlocks == 0:
            if len(self.chain) == self.adjustAfterBlocks:
                self.difficultyTarget *= (
                    (self.chain[-1]['timestamp'] - self.chain[-self.adjustAfterBlocks]['timestamp']) /
                    (self.adjustAfterBlocks * self.timeForEachBlock)
                )
            else:
                self.difficultyTarget *= (
                    (self.chain[-1]['timestamp'] - self.chain[-self.adjustAfterBlocks - 1]['timestamp']) /
                    (self.adjustAfterBlocks * self.timeForEachBlock)
                )

    def _mine(self) -> None:
        self.adjustDifficultyTarget()

        self.pending_transactions.insert(0, Transaction.GetCoinBaseTransaction(
            subsidy=self.calculateSubsidy(),
            pub_key=self.pub_key,
        ))

        # Create a block
        block = self.create_block()
        self.pending_transactions = []
        self.pending_transactions_fee = 0

        # Mine the block
        while True:
            if self.stop:
                return
            block['nonce'] = random.getrandbits(128)
            hash = int(SHA256.new(str(json.dumps(block)).encode('utf-8')).hexdigest(), 16)
            if hash < self.difficultyTarget:
                break

        if self.stop:
            return
        self.chain.append(block)

        # Send to all
        self.client.emit("onBlock", {
            "roomId": self.name,
            "block": block,
        })
        self.startTimer()

    def mine(self) -> None:
        if self._timer != None:
            self._timer.cancel()

        t = Thread(target=self._mine)
        t.start()

    def getUTXOsInTransaction(self, transactions, transaction, pub_key, add_reward) -> None:
        if transaction['type'] == "Transaction":
            if transaction['sender_pub_key'] == pub_key:
                for inTransaction in transaction['in']:
                    if inTransaction['inId']:
                        del transactions['inId']
            for outTransaction in transaction['out']:
                if outTransaction['type'] == "transfer":
                    if outTransaction['receiver_pub_key'] == pub_key:
                        transactions[outTransaction['outId']] = outTransaction['amount']
                elif outTransaction['type'] == "reward":
                    if add_reward:
                        transactions[outTransaction['outId']] = outTransaction['amount']

    def getUTXOs(self, pub_key):
        # dict of txn_id -> amount
        transactions = {}
        for block in self.chain:
            coinbase = block['transactions'][0]
            if coinbase['pub_key'] == pub_key:
                transactions[coinbase['transactionId']] = coinbase['subsidy']
            for transaction in block['transactions'][1:]:
                self.getUTXOsInTransaction(transactions, transaction, coinbase['pub_key'] == pub_key)
        return transactions

    def onTransaction(self, transaction) -> bool:
        # Verify the transaction signature
        pub_key = RSA.import_key(transaction['pub_key'])
        signature = transaction['signature']
        del transaction['signature']
        hash_verify = PKCS1_v1_5.new(pub_key)
        try:
            hash_verify.verify(SHA256.new(data=json.dumps(transaction)), signature=signature)
        except Exception as e:
            print(e)
            return False

        transaction['signature'] = signature

        # Verify has balance using the chain data and also the pending_transactions
        transactions = self.getUTXOs(transaction['pub_key'])
        for pendingTransaction in self.pending_transactions:
            self.getUTXOsInTransaction(transactions, pendingTransaction, transaction['pub_key'], False)

        for tranx in transaction['in']:
            if tranx['inId'] not in transactions:
                return False
            if tranx['amount'] != transactions[tranx['inId']]:
                return False

        # TODO: Check if out's equal to the total amount

        # Send transaction to all
        self.client.emit("onTransaction", {
            "roomId": self.name,
            "transaction": transaction,
        })

        # Add the transaction to the pending transactions
        self.pending_transactions.append(Transaction.GetTransaction(transaction))

        # If transaction_fee is not enough return, else call mine
        if transaction['type'] == "Transaction":
            for outTransaction in transaction['out']:
                if outTransaction['type'] == "reward":
                    self.pending_transactions_fee += outTransaction['amount']
        if self.pending_transactions_fee > self.minimum_fee:
            Timer(0, self.mine).start()

        return True

    def _stop(self) -> None:
        self.stop = False

    def onBlock(self, block) -> bool:
        # Call stop
        self.pending_transactions = []
        self.pending_transactions_fee = 0
        self.stop = True
        self._timer.cancel()

        # Verify the block hash
        self.adjustDifficultyTarget()
        hash = int(SHA256.new(str(json.dumps(block)).encode('utf-8')).hexdigest(), 16)
        if hash > self.difficultyTarget:
            return

        # Check only one coinbase transaction
        coinbase_transaction = block['transactions'][0]
        if coinbase_transaction['type'] != "CoinBaseTransaction":
            return
        if coinbase_transaction['subsidy'] != self.calculateSubsidy():
            return

        for transaction in block['transactions']:
            if transaction['type'] == "Transaction":
                # Check if the transaction is valid
                pass
            else:
                return

        # TODO: verify the block signature
        self.chain.append(block)

        # start new block
        self.startTimer()
        Timer(2, self._stop).start()
        return True

    def create_block(self):
        block = {}
        block['version'] = 1
        block['previousBlockHash'] = SHA256.new(str(json.dumps(self.chain[-1])).encode('utf-8')).hexdigest() if len(self.chain) > 1 else "0"
        block['timestamp'] = time.time()
        block['difficultyTarget'] = self.difficultyTarget
        block['height'] = len(self.chain) + 1
        block['num_transaction'] = len(self.pending_transactions)
        block['transactions'] = self.pending_transactions
        return block
