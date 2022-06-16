from itertools import chain
from transaction import Transaction
import time
import json
from Crypto.Signature import PKCS1_v1_5
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
import random
from threading import Timer, Thread


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
        self.pending_transactions.append(Transaction.GetGenesisTransaction(
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

    def calculateSubsidy(self) -> int:
        halvings = len(self.chain) / self.subsidyHalvingInterval
        return self.subsidy // (2 ** halvings)

    def _mine(self) -> None:
        # if the no_of_block % adjust_after_block == 0, set the difficulty target to the next difficulty target
        # TODO: check this once
        if len(self.chain) != 0 and len(self.chain) % self.adjustAfterBlocks == 0:
            self.difficultyTarget *= (
                (self.chain[-1]['timestamp']-self.chain[-self.adjustAfterBlocks]['timestamp']) /
                (self.adjustAfterBlocks*self.timeForEachBlock)
            )
            print("New difficulty target: " + str(self.difficultyTarget))

        self.pending_transactions.insert(0, Transaction.GetCoinBaseTransaction(
            subsidy=self.calculateSubsidy(),
            pub_key=self.pub_key,
        ))

        # Create a block
        block = self.create_block()
        self.pending_transactions = []

        # Mine the block
        while True:
            block['nonce'] = random.getrandbits(128)
            hash = int(SHA256.new(str(json.dumps(block)).encode('utf-8')).hexdigest(), 16)
            if hash < self.difficultyTarget:
                break

        self.chain.append(block)
        print("Block mined")
        # TODO: Send to all

        self._timer = Timer(self.maximum_time, self.mine)
        self._timer.start()

    def mine(self) -> None:
        if self.timer != None:
            self.timer.cancel()

        t = Thread(target=self._mine)
        t.start()

    def addTransaction(self, transactions, transaction, pub_key, coinbase):
        if transaction['type'] == "Transaction":
            if transaction['sender_pub_key'] == pub_key:
                for inTransaction in transaction['in']:
                    if inTransaction['inId']:
                        del transaction['inId']
            for outTransaction in transaction['out']:
                if outTransaction['type'] == "transfer":
                    if outTransaction['receiver_pub_key'] == pub_key:
                        transactions[outTransaction['outId']] = outTransaction['amount']
                elif outTransaction['type'] == "reward":
                    if coinbase['pub_key'] == pub_key:
                        transactions[outTransaction['outId']] = outTransaction['amount']

    def getAvailableTransactions(self, pub_key):
        # dict of txn_id -> amount
        transactions = {}
        for block in self.chain:
            coinbase = block['transactions'][0]
            if coinbase['pub_key'] == pub_key:
                transactions[coinbase['transactionId']] = coinbase['subsidy']
            for transaction in block['transactions'][1:]:
                self.addTransaction(transactions, transaction, pub_key, coinbase)
        return transactions

    def on_transaction(self, transaction) -> bool:
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
        transactions = self.getAvailableTransactions(transaction['pub_key'])
        for pendingTransaction in self.pending_transactions:
            self.addTransaction(transactions, pendingTransaction, transaction['pub_key'], {'pub_key': None})

        for tranx in transaction['in']:
            if tranx['inId'] not in transactions:
                return False
            if tranx['amount'] != transactions[tranx['inId']]:
                return False

        # Add the transaction to the pending transactions
        self.pending_transactions.append(Transaction.GetTransaction(transaction))

        # If transaction_fee is not enough return, else call mine
        self.pending_transactions_fee += 0
        if self.pending_transactions_fee > self.minimum_fee:
            Timer(0, self.mine).start()

        return True

    def create_block(self):
        block = {}
        block['version'] = 1
        block['previousBlockHash'] = SHA256.new(str(json.dumps(self.chain[-1])).encode('utf-8')).hexdigest() if len(self.chain) > 1 else "0"
        block['timestamp'] = time.time()
        block['difficultyTarget'] = self.difficultyTarget
        block['height'] = len(chain) + 1
        block['num_transaction'] = len(self.pending_transactions)
        block['transactions'] = self.pending_transactions
        return block
