import uuid


class Transaction:
    @staticmethod
    def GetGenesisTransaction(
        totalCoins,
        difficultyTarget,
        adjustAfterBlocks,
        timeForEachBlock,
        subsidy,
        subsidyHalvingInterval,
    ):
        return {
            "type": "GenesisBlock",
            "totalCoins": totalCoins,
            "difficultyTarget": difficultyTarget,
            "adjustAfterBlocks": adjustAfterBlocks,
            "timeForEachBlock": timeForEachBlock,
            "subsidy": subsidy,
            "subsidyHalvingInterval": subsidyHalvingInterval,
            "transactionId": uuid.uuid4().hex,
        }

    @staticmethod
    def GetCoinBaseTransaction(subsidy, pub_key):
        return {
            "type": "CoinBaseTransaction",
            "subsidy": subsidy,
            "pub_key": pub_key,
            "transactionId": uuid.uuid4().hex,
        }

    @staticmethod
    def GetSideChainCreateTransaction():
        return {
            "type": "SideChainCreateTransaction",
            # TODO: Add some data here
            "transactionId": uuid.uuid4().hex,
        }

    @staticmethod
    def GetTransaction(transaction):
        transaction["type"] = "Transaction"
        transaction["transactionId"] = uuid.uuid4().hex
        return transaction
