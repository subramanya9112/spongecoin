class Transaction:
    @staticmethod
    def GetGenesisBlock(
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
        }

    @staticmethod
    def GetCoinBaseTransaction(coins, pub_key):
        return {
            "type": "CoinBaseTransaction",
            "coins": coins,
            "pub_key": pub_key,
        }

    @staticmethod
    def GetSideChainCreateTransaction():
        return {
            "type": "SideChainCreateTransaction",
        }

    @staticmethod
    def GetTransaction():
        return {
            "type": "Transaction",
        }
