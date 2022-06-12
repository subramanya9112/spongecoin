from collections import OrderedDict


class Chain:
    def __init__(self):
        self.pending_transactions = []
        self.pending_transactions_fee = 0

    def start(self):
        pass

    def on_transaction(self, transaction):
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

    def write():
        pass

    def read():
        pass

    def lock(self):
        pass
