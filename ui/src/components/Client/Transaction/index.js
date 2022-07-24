import React, { useState, Fragment, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Header from './../Header';
import './index.scss';

export default function Index() {
    let { transaction_id, chain_name } = useParams();

    const reflectorURL = "http://reflector.subramanya.com";
    const [minerURL, setMinerURL] = useState('');
    const [transaction, setTransaction] = useState(null);

    // Get Miner URL
    useEffect(() => {
        const getMinerURL = async () => {
            let res = await axios.post(reflectorURL + "/chain", {
                "chainName": chain_name
            });
            if (res.status !== 200) {
                return;
            }
            if (res.data.length !== 0) {
                setMinerURL(res.data[Math.floor(Math.random() * res.data.length)]);
            }
        };
        if (chain_name !== undefined) {
            getMinerURL().catch(console.error);
        }
    }, [chain_name]);

    // Get Block Details
    useEffect(() => {
        let getTransactionDetails = async () => {
            let res = await axios.post(minerURL + "/transaction", {
                "transaction_id": transaction_id
            });
            if (res.status !== 200 || res.data.status === false) {
                return;
            }
            setTransaction(res.data.transaction);
        }
        if (minerURL && minerURL !== '') {
            getTransactionDetails().catch(console.error);
        }
    }, [minerURL, transaction_id]);

    let getPublicKeyDiv = (pub_key) => {
        return pub_key.split('\n').map((val, index) => {
            return <div key={index}>{val}</div>
        })
    };

    let getTransacation = (transaction) => {
        if (transaction['type'] === "CoinBaseTransaction") {
            return (
                <Fragment>
                    <div className='transactionHeader'>Coin Base Transaction</div>
                    <div className='transactionData'>
                        <div className='transactionKey'>Transaction ID</div>
                        <div className='transactionValue'>{transaction['transactionId']}</div>
                    </div>
                    <div className='transactionData'>
                        <div className='transactionKey'>Subsidy</div>
                        <div className='transactionValue'>{transaction['subsidy']}</div>
                    </div>
                    <div className='transactionData'>
                        <div className='transactionKey'>Public Key</div>
                        <div className='transactionValue'>
                            {getPublicKeyDiv(transaction['pub_key'])}
                        </div>
                    </div>
                </Fragment>
            );
        } else if (transaction['type'] === "GenesisBlock") {
            return (
                <Fragment>
                    <div className='transactionHeader'>Genesis Block Transaction</div>
                    <div className='transactionData'>
                        <div className='transactionKey'>Transaction ID</div>
                        <div className='transactionValue'>{transaction['transactionId']}</div>
                    </div>
                    <div className='transactionData'>
                        <div className='transactionKey'>Name</div>
                        <div className='transactionValue'>{transaction['name']}</div>
                    </div>
                    <div className='transactionData'>
                        <div className='transactionKey'>Total Coins</div>
                        <div className='transactionValue'>{transaction['totalCoins']}</div>
                    </div>
                    <div className='transactionData'>
                        <div className='transactionKey'>Adjust After Blocks</div>
                        <div className='transactionValue'>{transaction['adjustAfterBlocks']}</div>
                    </div>
                    <div className='transactionData'>
                        <div className='transactionKey'>Time for each Block</div>
                        <div className='transactionValue'>{transaction['timeForEachBlock']} ms</div>
                    </div>
                    <div className='transactionData'>
                        <div className='transactionKey'>Difficulty Target</div>
                        <div className='transactionValue'>{transaction['difficultyTarget']}</div>
                    </div>
                    <div className='transactionData'>
                        <div className='transactionKey'>Subsidy</div>
                        <div className='transactionValue'>{transaction['subsidy']}</div>
                    </div>
                    <div className='transactionData'>
                        <div className='transactionKey'>Subsidy Halving Interval</div>
                        <div className='transactionValue'>{transaction['subsidyHalvingInterval']} ms</div>
                    </div>
                </Fragment>
            );
        } else if (transaction['type'] === "Transaction") {
            return (
                <Fragment>
                    <div className='transactionHeader'>Transaction</div>
                    <div className='transactionCoinBase'>
                        <div className='transactionCoinBaseKey'>Transaction ID</div>
                        <div className='transactionCoinBaseValue'>{transaction['transactionId']}</div>
                    </div>
                    <div className='transactionCoinBase'>
                        <div className='transactionCoinBaseKey'>Public Key</div>
                        <div className='transactionCoinBaseValue'>
                            {getPublicKeyDiv(transaction['pub_key'])}
                        </div>
                    </div>
                    <div className='transactionCoinBase'>
                        <div className='transactionCoinBaseKey'>Signature</div>
                        <div className='transactionCoinBaseValue'>{transaction['signature']}</div>
                    </div>
                    <div className='transactionCoinBase'>
                        <div className='transactionCoinBaseKey'>Time Stamp</div>
                        <div className='transactionCoinBaseValue'>{(new Date(transaction['timestamp'])).toLocaleString()}</div>
                    </div>
                    <div className='transactionTranx'>
                        <div className='transactionTranxHeader'>In Transaction</div>
                        <div className='transactionTranxHeader'>Out Transaction</div>
                    </div>
                    <div className='transactionTranx'>
                        <div className='transactionTranxIn'>
                            {transaction['in'].map((tranx, index) => {
                                return (
                                    <Fragment key={index}>
                                        <div className='transactionTranxInData'>
                                            <div className='transactionTranxInDataHeader'>
                                                <div className='transactionTranxInKey'>Transaction ID</div>
                                                <div className='transactionTranxInValue'>{tranx['inId']}</div>
                                            </div>
                                            <div className='transactionTranxInDataHeader'>
                                                <div className='transactionTranxInKey'>Amount</div>
                                                <div className='transactionTranxInValue'>{tranx['amount']}</div>
                                            </div>
                                        </div>
                                        <div className='transactionTranxLineBreak' />
                                    </Fragment>
                                );
                            })}
                        </div>
                        <div className='transactionTranxOut'>
                            {transaction['out'].map((tranx, index) => {
                                if (tranx['type'] === "transfer")
                                    return (
                                        <Fragment key={index}>
                                            <div className='transactionTranxOutData' >
                                                <div className='transactionTranxOutDataHeader'>
                                                    <div className='transactionTranxOutKey'>Transaction Type</div>
                                                    <div className='transactionTranxOutValue'>Transfer</div>
                                                </div>
                                                <div className='transactionTranxOutDataHeader'>
                                                    <div className='transactionTranxOutKey'>Transaction ID</div>
                                                    <div className='transactionTranxOutValue'>{tranx['outId']}</div>
                                                </div>
                                                <div className='transactionTranxOutDataHeader'>
                                                    <div className='transactionTranxOutKey'>Amount</div>
                                                    <div className='transactionTranxOutValue'>{tranx['amount']}</div>
                                                </div>
                                                <div className='transactionTranxOutDataHeader'>
                                                    <div className='transactionTranxOutKey'>Public Key</div>
                                                    <div className='transactionTranxOutValue'>{getPublicKeyDiv(tranx['receiver_pub_key'])}</div>
                                                </div>
                                            </div>
                                            <div className='transactionTranxLineBreak' />
                                        </Fragment>
                                    );
                                else
                                    return (
                                        <Fragment key={index}>
                                            <div className='transactionTranxOutData' >
                                                <div className='transactionTranxOutDataHeader'>
                                                    <div className='transactionTranxOutKey'>Transaction Type</div>
                                                    <div className='transactionTranxOutValue'>Reward</div>
                                                </div>
                                                <div className='transactionTranxOutDataHeader'>
                                                    <div className='transactionTranxOutKey'>Transaction Id</div>
                                                    <div className='transactionTranxOutValue'>{tranx['outId']}</div>
                                                </div>
                                                <div className='transactionTranxOutDataHeader'>
                                                    <div className='transactionTranxOutKey'>Amount</div>
                                                    <div className='transactionTranxOutValue'>{tranx['amount']}</div>
                                                </div>
                                            </div>
                                            <div className='transactionTranxLineBreak' />
                                        </Fragment>
                                    )
                            })}
                        </div>
                    </div>
                </Fragment>
            )
        } else if (transaction['type'] === "SideChainCreateTransaction") {
            return (
                <Fragment>
                    <div className='transactionHeader'>SideChain Create Transaction</div>
                    <div className='transactionCoinBase'>
                        <div className='transactionCoinBaseKey'>Transaction ID</div>
                        <div className='transactionCoinBaseValue'>{transaction['transactionId']}</div>
                    </div>
                    <div className='transactionCoinBase'>
                        <div className='transactionCoinBaseKey'>Public Key</div>
                        <div className='transactionCoinBaseValue'>
                            {getPublicKeyDiv(transaction['pub_key'])}
                        </div>
                    </div>
                    <div className='transactionCoinBase'>
                        <div className='transactionCoinBaseKey'>Signature</div>
                        <div className='transactionCoinBaseValue'>{transaction['signature']}</div>
                    </div>
                    <div className='transactionCoinBase'>
                        <div className='transactionCoinBaseKey'>Chain Name</div>
                        <div className='transactionCoinBaseValue'>{transaction['chainName']}</div>
                    </div>
                    <div className='transactionCoinBase'>
                        <div className='transactionCoinBaseKey'>Time Stamp</div>
                        <div className='transactionCoinBaseValue'>{(new Date(transaction['timestamp'])).toLocaleString()}</div>
                    </div>
                    <div className='transactionCoinBase'>
                        <div className='transactionCoinBaseKey'>Peg amount</div>
                        <div className='transactionCoinBaseValue'>{transaction['amount']}</div>
                    </div>
                    <div className='transactionCoinBase'>
                        <div className='transactionCoinBaseKey'>Total Coins</div>
                        <div className='transactionCoinBaseValue'>{transaction['totalCoins']}</div>
                    </div>
                    <div className='transactionCoinBase'>
                        <div className='transactionCoinBaseKey'>Chain Name</div>
                        <div className='transactionCoinBaseValue'>{transaction['chainName']}</div>
                    </div>
                    <div className='transactionData'>
                        <div className='transactionKey'>Adjust After Blocks</div>
                        <div className='transactionValue'>{transaction['adjustAfterBlocks']}</div>
                    </div>
                    <div className='transactionData'>
                        <div className='transactionKey'>Time for each Block</div>
                        <div className='transactionValue'>{transaction['timeForEachBlock']} ms</div>
                    </div>
                    <div className='transactionData'>
                        <div className='transactionKey'>Difficulty Target</div>
                        <div className='transactionValue'>{transaction['difficultyTarget']}</div>
                    </div>
                    <div className='transactionTranx'>
                        <div className='transactionTranxHeader'>In Transaction</div>
                    </div>
                    <div className='transactionTranx'>
                        <div className='transactionTranxIn'>
                            {transaction['in'].map((tranx, index) => {
                                return (
                                    <Fragment key={index}>
                                        <div className='transactionTranxInData'>
                                            <div className='transactionTranxInDataHeader'>
                                                <div className='transactionTranxInKey'>Transaction ID</div>
                                                <div className='transactionTranxInValue'>{tranx['inId']}</div>
                                            </div>
                                            <div className='transactionTranxInDataHeader'>
                                                <div className='transactionTranxInKey'>Amount</div>
                                                <div className='transactionTranxInValue'>{tranx['amount']}</div>
                                            </div>
                                        </div>
                                        <div className='transactionTranxLineBreak' />
                                    </Fragment>
                                );
                            })}
                        </div>
                    </div>
                </Fragment>
            )
        } else {
            return <div>Transaction type not found</div>
        }
    }

    return (
        <Header
            style={{ display: "flex" }}
            content={
                <Fragment>
                    {transaction === null ?
                        <div className='transactionLoading'>Loading...</div>
                        :
                        <div className="transaction">
                            <div className="transactionHeader">
                                Transaction {transaction_id}
                            </div>
                            {getTransacation(transaction)}
                        </div>
                    }
                </Fragment>
            }
        />
    )
}
