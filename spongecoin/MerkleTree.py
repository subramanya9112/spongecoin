import json
from Crypto.Hash import SHA256


class MerkelTree(object):
    @staticmethod
    def chunks(transaction, n):
        for i in range(0, len(transaction), n):
            yield transaction[i:i+2]

    @staticmethod
    def merkel_tree(transactions, first=False):
        sub_tree = []
        for i in MerkelTree.chunks(transactions, 2):
            if len(i) == 2:
                if first:
                    hash = SHA256.new((str(json.dumps(i[0])) + str(json.dumps(i[1]))).encode('utf-8')).hexdigest()
                else:
                    hash = SHA256.new((str(json.dumps(i[0])) + str(json.dumps(i[1]))).encode('utf-8')).hexdigest()
            else:
                if first:
                    hash = SHA256.new((str(json.dumps(i[0])) + str(json.dumps(i[0]))).encode('utf-8')).hexdigest()
                else:
                    hash = SHA256.new((str(json.dumps(i[0])) + str(json.dumps(i[0]))).encode('utf-8')).hexdigest()
            sub_tree.append(hash)
        if len(sub_tree) == 1:
            return sub_tree[0]
        else:
            return MerkelTree.merkel_tree(sub_tree)
