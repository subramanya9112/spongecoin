import uuid
import time
import random


class Transaction:
    @staticmethod
    def GetGenesisTransaction(
        name,
        totalCoins,
        difficultyTarget,
        adjustAfterBlocks,
        timeForEachBlock,
        subsidy,
        subsidyHalvingInterval,
    ):
        return {
            "type": "GenesisBlock",
            "name": name,
            "totalCoins": str(totalCoins),
            "difficultyTarget": str(difficultyTarget),
            "adjustAfterBlocks": str(adjustAfterBlocks),
            "timeForEachBlock": str(timeForEachBlock),
            "subsidy": str(subsidy),
            "subsidyHalvingInterval": str(subsidyHalvingInterval),
            "transactionId": uuid.uuid4().hex,
            "timestamp": (time.time() * 1000) + random.random()
        }

    @staticmethod
    def GetCoinBaseTransaction(subsidy, pub_key):
        return {
            "type": "CoinBaseTransaction",
            "subsidy": str(subsidy),
            "pub_key": pub_key,
            "transactionId": uuid.uuid4().hex,
            "timestamp": (time.time() * 1000) + random.random()
        }

    @staticmethod
    def GetSideChainCreateTransaction(transaction):
        transaction["type"] = "SideChainCreateTransaction"
        transaction["transactionId"] = uuid.uuid4().hex
        return transaction

    @staticmethod
    def GetTransaction(transaction):
        transaction["type"] = "Transaction"
        transaction["transactionId"] = uuid.uuid4().hex
        return transaction
