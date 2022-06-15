import enum


class TransactionType(enum.Enum):
    GenesisBlock = 1
    CoinBaseTransaction = 2
    Transaction = 3
    CreateSideChain = 3


class Transaction:
    @staticmethod
    def GetTransaction(
        type
    ):
        if type == TransactionType.GenesisBlock:
            return {}
        elif type == TransactionType.CoinBaseTransaction:
            return {}
        elif type == TransactionType.Transaction:
            return {}
        elif type == TransactionType.CreateSideChain:
            return {}
