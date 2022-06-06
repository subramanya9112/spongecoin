class Transaction:
    def __init__(
        self,
        sender_public_address,
        input_transactions,
        output_transactions,
        receiver_public_address,
        receiver_signature,
        amount,
        transaction_fee
    ):
        self.sender_public_address = sender_public_address
        self.input_transactions = input_transactions
        self.output_transactions = output_transactions
        self.receiver_public_address = receiver_public_address
        self.receiver_signature = receiver_signature
        self.amount = amount
        self.transaction_fee = transaction_fee
