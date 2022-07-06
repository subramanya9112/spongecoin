import json
import random
import time
from Crypto.Signature import PKCS1_v1_5
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from threading import Timer, Thread

import requests
from MerkleTree import MerkelTree
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
        self.waitForTransaction = None

    def onConnect(self) -> None:
        print("Connected to the reflector")

    def onConnectError(self, err) -> None:
        print("Connect Error " + err)

    def onDisconnect(self) -> None:
        print("Disconnected")

    def onEvent(self, event, data) -> None:
        if data["roomId"] == self.name:
            if event == "minersCount":
                pass
            elif event == "onTransaction":
                self.onTransaction(data["transaction"])
            elif event == "onSideChainTransaction":
                self.createSideChain(data['transaction'])
            elif event == "onBlock":
                self.onBlock(data['block'])

    def startChain(
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
            reflector_url,
    ) -> None:
        self.name = name
        self.chain = []
        self.pending_transactions = []
        self.pending_transactions_fee = 0
        self.difficultyTarget = difficultyTarget
        self.adjustAfterBlocks = adjustAfterBlocks
        self.timeForEachBlock = timeForEachBlock
        self.subsidy = subsidy
        self.subsidyHalvingInterval = subsidyHalvingInterval
        self.pub_key = pub_key
        self.minimum_fee = minimum_fee
        self.maximum_time = maximum_time
        self.reflector_url = reflector_url
        self.stop = False

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
        self.client.disconnect()
        self.client.connect(reflector_url)
        self.client.emit("addToRoom", {
            "roomId": self.name,
            "url": url,
        })

        # Start the timer for mining
        self.startTimer()
        self.waitForTransaction = None

    def start(
        self,
        name,
        pub_key,
        minimum_fee,
        maximum_time,
        url,
        reflector_url,
    ) -> bool:
        # Get the url from reflector
        res = requests.post(reflector_url + "/chain", json={
            "chainName": name,
        })
        if res.status_code != 200:
            print("Error: " + res.text)
            return False
        urls = res.json()

        # Set basic info
        self.name = name
        self.pub_key = pub_key
        self.minimum_fee = minimum_fee
        self.maximum_time = maximum_time
        self.url = url
        self.reflector_url = reflector_url
        self.waitForTransaction = None

        # Get the data from clients
        for urld in urls:
            urld = urld.replace(".localhost", "")
            res = requests.post(urld + "/aboutChain")
            if res.status_code != 200:
                print("Error: " + res.text)
                continue

            data = res.json()
            if data["status"] == False:
                print("Error: " + data["status"])
                continue

            self.difficultyTarget = data['difficultyTarget']
            self.adjustAfterBlocks = data['adjustAfterBlocks']
            self.timeForEachBlock = data['timeForEachBlock']
            self.subsidy = data['subsidy']
            self.subsidyHalvingInterval = data['subsidyHalvingInterval']

            # Get the chain
            res = requests.post(urld + "/chain")
            if res.status_code != 200:
                print("Error: " + res.text)
                continue

            data = res.json()
            if data["status"] == False:
                print("Error: " + data["status"])
                continue

            self.chain = data['chain']
            break
        else:
            return False

        # Listen on the reflector
        self.client.connect(reflector_url)
        self.client.emit("addToRoom", {
            "roomId": self.name,
            "url": url,
        })

        # Start the timer for mining
        self.startTimer()
        return True

    def calculateSubsidy(self) -> int:
        halvings = int(len(self.chain) / self.subsidyHalvingInterval)
        return self.subsidy / (2 ** halvings)

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
            block['nonce'] = str(random.getrandbits(128))
            hash = int(SHA256.new(
                str(json.dumps(block)).encode('utf-8')).hexdigest(), 16)
            if hash < self.difficultyTarget:
                block['hash'] = str(hash)
                break

        if self.stop:
            return
        self.chain.append(block)

        # Send to all
        self.client.emit("onBlock", {
            "roomId": self.name,
            "block": block,
        })
        self.checkNewChain()
        self.startTimer()

    def mine(self) -> None:
        if self._timer != None:
            self._timer.cancel()

        self.stop = False
        t = Thread(target=self._mine)
        t.start()

    def getUTXOsInTransaction(self, transactions, transaction, pub_key, add_reward) -> None:
        if transaction['type'] == "Transaction":
            if transaction['pub_key'] == pub_key:
                for inTransaction in transaction['in']:
                    del transactions[inTransaction['inId']]
            for outTransaction in transaction['out']:
                if outTransaction['type'] == "transfer":
                    if outTransaction['receiver_pub_key'] == pub_key:
                        transactions[outTransaction['outId']
                                     ] = outTransaction['amount']
                elif outTransaction['type'] == "reward":
                    if add_reward:
                        transactions[outTransaction['outId']
                                     ] = outTransaction['amount']
        if transaction['type'] == "SideChainCreateTransaction":
            if transaction['pub_key'] == pub_key:
                for inTransaction in transaction['in']:
                    del transactions[inTransaction['inId']]

    def getUTXOs(self, pub_key):
        # dict of txn_id -> amount
        transactions = {}
        for block in self.chain:
            coinbase = block['transactions'][0]
            if coinbase['pub_key'] == pub_key:
                transactions[coinbase['transactionId']] = coinbase['subsidy']
            for transaction in block['transactions'][1:]:
                self.getUTXOsInTransaction(
                    transactions, transaction, pub_key, coinbase['pub_key'] == pub_key)
        return transactions

    def onTransaction(self, transaction, add=True) -> bool:
        # Verify the transaction signature
        pub_key = RSA.import_key(transaction['pub_key'])
        signature = transaction['signature']
        del transaction['signature']
        hash_verify = PKCS1_v1_5.new(pub_key)
        try:
            data = json.dumps(transaction, separators=(',', ':'))
            hash_verify.verify(SHA256.new(data=bytes(
                data, encoding="utf-8")), signature=signature)
        except Exception as e:
            print(e)
            return False

        transaction['signature'] = signature

        # Verify has balance using the chain data and also the pending_transactions
        transactions = self.getUTXOs(transaction['pub_key'])
        for pendingTransaction in self.pending_transactions:
            self.getUTXOsInTransaction(
                transactions, pendingTransaction, transaction['pub_key'], False)

        inAmt = 0
        for tranx in transaction['in']:
            if tranx['inId'] not in transactions:
                return False
            if tranx['amount'] != transactions[tranx['inId']]:
                return False
            inAmt += float(tranx['amount'])

        outAmt = 0
        for tranx in transaction['out']:
            outAmt += float(tranx['amount'])

        # Check if out's equal to the total amount
        if inAmt != outAmt:
            return False

        if not add:
            return True

        # Send transaction to all
        self.client.emit("onTransaction", {
            "roomId": self.name,
            "transaction": transaction,
        })

        # Add the transaction to the pending transactions
        self.pending_transactions.append(
            Transaction.GetTransaction(transaction))

        # If transaction_fee is not enough return, else call mine
        if transaction['type'] == "Transaction":
            for outTransaction in transaction['out']:
                if outTransaction['type'] == "reward":
                    self.pending_transactions_fee += float(
                        outTransaction['amount'])
        if self.pending_transactions_fee > self.minimum_fee:
            self.stop = True
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

        # Check the height and clear all
        if len(self.chain) != 0 and len(self.chain) >= block['height']:
            if self.chain[block['height'] - 1]['timestamp'] >= block['timestamp']:
                self.chain = self.chain[:block['height'] - 1]
            else:
                return

        # Verify the block hash
        oldHash = block['hash']
        del block['hash']
        hash = int(SHA256.new(
            str(json.dumps(block)).encode('utf-8')).hexdigest(), 16)
        self.adjustDifficultyTarget()
        if hash > self.difficultyTarget or str(hash) != oldHash:
            return
        block['hash'] = oldHash

        # Verify the previous block hash
        if len(self.chain) != 0 and block['previousBlockHash'] != self.chain[-1]['hash']:
            return

        # Check merkle hash
        if block['merkleHash'] != MerkelTree.merkel_tree(block['transactions'], first=True):
            return

        # Check only one coinbase transaction
        coinbase_transaction = block['transactions'][0]
        if coinbase_transaction['type'] != "CoinBaseTransaction":
            return
        if float(coinbase_transaction['subsidy']) != self.calculateSubsidy():
            return

        for transaction in block['transactions'][1:]:
            if transaction['type'] == "Transaction":
                type = transaction['type']
                transactionId = transaction['transactionId']
                del transaction['type']
                del transaction['transactionId']
                valid = self.onTransaction(transaction, False)
                if not valid:
                    return
                transaction['type'] = type
                transaction['transactionId'] = transactionId
            elif transaction['type'] == "CoinBaseTransaction":
                return
            elif transaction['type'] == "SideChainCreateTransaction":
                type = transaction['type']
                transactionId = transaction['transactionId']
                del transaction['type']
                del transaction['transactionId']
                valid = self.onTransaction(transaction, False)
                if not valid:
                    return
                transaction['type'] = type
                transaction['transactionId'] = transactionId

        self.chain.append(block)
        self.checkNewChain()

        # start new block
        self.startTimer()
        Timer(2, self._stop).start()
        return True

    def getTransaction(self, transactionId):
        for block in self.chain:
            for transaction in block['transactions']:
                if transaction['transactionId'] == transactionId:
                    return transaction
                if transaction['type'] == "Transaction":
                    for outTransaction in transaction['out']:
                        if outTransaction['outId'] == transactionId:
                            return transaction
                if transaction['type'] == "SideChainCreateTransaction":
                    if transaction['transactionId'] == transactionId:
                        return transaction
        return None

    def create_block(self):
        block = {}
        block['version'] = 1
        block['previousBlockHash'] = self.chain[-1]['hash'] if len(
            self.chain) != 0 else "0"
        block['timestamp'] = (time.time() * 1000) + random.random()
        block['difficultyTarget'] = str(int(self.difficultyTarget))
        block['height'] = len(self.chain) + 1
        block['num_transaction'] = len(self.pending_transactions)
        block['merkleHash'] = MerkelTree.merkel_tree(
            self.pending_transactions, first=True)
        block['transactions'] = self.pending_transactions
        return block

    def getClientTransactions(self, accountId):
        transactions = []
        amount = 0
        for block in self.chain:
            coinBasePubKey = None
            if block['transactions'][0]['type'] == "CoinBaseTransaction":
                coinBasePubKey = block['transactions'][0]['pub_key']
                if coinBasePubKey == accountId:
                    amount += float(block['transactions'][0]['subsidy'])
                    transactions.append(block['transactions'][0])
                else:
                    coinBasePubKey = None

            for transaction in block['transactions'][1:]:
                if transaction['type'] == "Transaction":
                    for ins in transaction['in']:
                        if transaction['pub_key'] == accountId:
                            amount -= float(ins['amount'])
                    for outs in transaction['out']:
                        if outs['type'] == "reward":
                            if coinBasePubKey == accountId:
                                transactions.append({
                                    'type': 'Transaction',
                                    'transactionId': outs['outId'],
                                    'timestamp': transaction['timestamp'],
                                    'amount': outs['amount'],
                                    'types': "in",
                                })
                                amount += float(outs['amount'])
                            if transaction['pub_key'] == accountId:
                                transactions.append({
                                    'type': 'Transaction',
                                    'transactionId': outs['outId'],
                                    'timestamp': transaction['timestamp'],
                                    'amount': outs['amount'],
                                    'types': "out",
                                })
                        else:
                            if outs['receiver_pub_key'] == accountId:
                                amount += float(outs['amount'])
                            elif transaction['pub_key'] == accountId:
                                transactions.append({
                                    'type': 'Transaction',
                                    'transactionId': outs['outId'],
                                    'timestamp': transaction['timestamp'],
                                    'amount': outs['amount'],
                                    'types': "out",
                                })
                elif transaction['type'] == "SideChainCreateTransaction":
                    if transaction['pub_key'] == accountId:
                        amount -= transaction['amount']
                        transactions.append({
                            'type': 'SideChainCreateTransaction',
                            'transactionId': transaction['transactionId'],
                            'timestamp': transaction['timestamp'],
                            'amount': transaction['amount'],
                        })
        return transactions[::-1], amount

    def createSideChain(self, transaction, add=True, changeChain=False) -> bool:
        # Verify the transaction signature
        pub_key = RSA.import_key(transaction['pub_key'])
        signature = transaction['signature']
        del transaction['signature']
        hash_verify = PKCS1_v1_5.new(pub_key)
        try:
            data = json.dumps(transaction, separators=(',', ':'))
            hash_verify.verify(SHA256.new(data=bytes(
                data, encoding="utf-8")), signature=signature)
        except Exception as e:
            print(e)
            return False

        transaction['signature'] = signature

        # Verify has balance using the chain data and also the pending_transactions
        transactions = self.getUTXOs(transaction['pub_key'])
        for pendingTransaction in self.pending_transactions:
            self.getUTXOsInTransaction(
                transactions, pendingTransaction, transaction['pub_key'], False)

        inAmt = 0
        for tranx in transaction['in']:
            if tranx['inId'] not in transactions:
                return False
            if tranx['amount'] != transactions[tranx['inId']]:
                return False
            inAmt += float(tranx['amount'])

        # Check if out's equal to the total amount
        if inAmt != transaction['amount']:
            return False

        if not add:
            return True

        # Send transaction to all
        self.client.emit("onSideChainTransaction", {
            "roomId": self.name,
            "transaction": transaction,
        })

        # Add the transaction to the pending transactions
        self.pending_transactions.append(
            Transaction.GetSideChainCreateTransaction(transaction))
        if self.pub_key == transaction['pub_key'] and changeChain:
            self.waitForTransaction = transaction
        return True

    def checkNewChain(self):
        if self.waitForTransaction:
            for transaction in self.chain[-1]['transactions']:
                if transaction['type'] == "SideChainCreateTransaction":
                    if transaction['chainName'] == self.waitForTransaction['chainName'] and transaction['timestamp'] == self.waitForTransaction['timestamp']:
                        break
            else:
                return

            # clear all variables and start new chain
            self._timer.cancel()
            self.startChain(
                self.waitForTransaction['chainName'],
                int(self.waitForTransaction['totalCoins']),
                int(self.waitForTransaction['difficultyTarget'], 16),
                int(self.waitForTransaction['adjustAfterBlocks']),
                int(self.waitForTransaction['timeForEachBlock']),
                0,
                1,
                self.waitForTransaction['pub_key'],
                int(self.waitForTransaction['minimum_fee']),
                int(self.waitForTransaction['maximum_time']),
                self.waitForTransaction['url'],
                self.waitForTransaction['reflectorURL'],
            )
            self.waitForTransaction = None
