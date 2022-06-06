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
        od = OrderedDict()
        od['magic_number'] = 0xD9B4BEF9
        od['block_size'] = 1
        od['block_header'] = OrderedDict()
        od['block_header']['version'] = 1
        od['block_header']['previousBlockHash'] = 1
        od['block_header']['merkleRoot'] = 1
        od['block_header']['timestamp'] = 1
        od['block_header']['difficultyTarget'] = 1
        od['block_header']['Nonce'] = 1
        od['transaction_length'] = 1
        od['transactions'] = self.pending_transactions

    def write():
        pass

    def read():
        pass

    def lock(self):
        pass
