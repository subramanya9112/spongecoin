import React, { useState, Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './index.scss';
import Header from './../Header';
import Button from './../../basicComponents/Button';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMadeIcon from '@mui/icons-material/CallMade';

export default function Index() {
    const navigate = useNavigate();
    let { chain_name } = useParams();

    const reflectorURL = "http://reflector.subramanya.com";
    const [minerURL, setMinerURL] = useState('');
    const [coins, setCoins] = useState([]);
    const [transactions, setTransactions] = useState([]);
    const [amount, setAmount] = useState(0);

    // Get Sidebar chain details
    useEffect(() => {
        const getChains = async () => {
            let res = await axios.post(reflectorURL + "/chains");
            if (res.status !== 200) {
                return;
            }
            setCoins(res.data);
        }
        getChains().catch(console.error);
    }, [setCoins]);

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

    useEffect(() => {
        let getTransactions = async () => {
            let pub_key = window.localStorage.getItem('sponge_coin_public_key');
            let res = await axios.post(minerURL + "/client_transactions", {
                "accountId": pub_key
            });
            if (res.status !== 200) {
                return;
            }
            setTransactions(res.data.transaction);
            setAmount(res.data.amount);
            console.log(res.data)
        };
        if (minerURL && minerURL !== "") {
            getTransactions().catch(console.error);
        }
    }, [minerURL]);

    let getTransaction = (transaction) => {
        if (transaction['type'] === "CoinBaseTransaction")
            return (
                <div
                    className='accountTransaction'
                    onClick={() => {
                        navigate(`/transaction/${transaction['transactionId']}/${chain_name}`)
                    }}
                >
                    <div className='accountTransactionTransactionId'>{transaction['transactionId']}</div>
                    <div className='accountTransactionTimeStamp'>{(new Date(transaction['timestamp'])).toLocaleString()}</div>
                    <div className='accountTransactionSubsidy'>{transaction['subsidy']}</div>
                    <div className='accountTransactionImage'><CallReceivedIcon style={{ color: "green" }} /></div>
                </div>
            );
        else if (transaction['type'] === "Transaction") {
            return (
                <div
                    className='accountTransaction'
                    onClick={() => {
                        navigate(`/transaction/${transaction['transactionId']}/${chain_name}`)
                    }}
                >
                    <div className='accountTransactionTransactionId'>{transaction['transactionId']}</div>
                    <div className='accountTransactionTimeStamp'>{(new Date(transaction['timestamp'])).toLocaleString()}</div>
                    <div className='accountTransactionSubsidy'>{transaction['amount']}</div>
                    <div className='accountTransactionImage'>
                        {transaction['types'] === "in" ?
                            <CallReceivedIcon style={{ color: "green" }} />
                            : <CallMadeIcon style={{ color: "red" }} />
                        }
                    </div>
                </div>
            );
        }
        else if (transaction['type'] === "SideChainCreateTransaction") {
            return (
                <div
                    className='accountTransaction'
                    onClick={() => {
                        navigate(`/transaction/${transaction['transactionId']}/${chain_name}`)
                    }}
                >
                    <div className='accountTransactionTransactionId'>{transaction['transactionId']}</div>
                    <div className='accountTransactionTimeStamp'>{(new Date(transaction['timestamp'])).toLocaleString()}</div>
                    <div className='accountTransactionSubsidy'>{transaction['amount']}</div>
                    <div className='accountTransactionImage'>
                        <CallMadeIcon style={{ color: "red" }} />
                    </div>
                </div>
            );
        }
    };

    return (
        <Header
            style={{ display: "flex" }}
            content={
                <Fragment>
                    <div className="accountSidebar">
                        {coins.length === 0 ?
                            <div className="accountError">No coins running...</div>
                            : coins.map((item, index) => {
                                return <div
                                    className={"accountItems" + (chain_name === item ? " accountItemsActive" : "")}
                                    key={`items_${index}`}
                                    onClick={() => {
                                        navigate(`/account/${item}`);
                                    }}
                                >
                                    {item}
                                </div>
                            })}
                    </div>

                    {chain_name === undefined ?
                        <div className="accountChainError">Select the chain</div>
                        :
                        minerURL === '' ?
                            <div className="accountChainError">No miner is up</div>
                            :
                            <div className="accountPageContent">
                                <Fragment>
                                    <div className="accountHeader">
                                        <div>Account</div>
                                        <div className='accountHeaderRight'>
                                            <div style={{ marginRight: "20px" }}>Balance: {amount}</div>
                                            <Button
                                                onClick={() => navigate(`/transact/${chain_name}`)}
                                                name="Transact"
                                            />
                                        </div>
                                    </div>
                                </Fragment>

                                {transactions.length === 0 ?
                                    <div className='accountChainError' >No transaction yet..</div>
                                    : transactions.map((transaction, index) => {
                                        return (
                                            <Fragment key={index}>
                                                <div className="accountLineBreak"></div>
                                                {getTransaction(transaction)}
                                            </Fragment>
                                        );
                                    })
                                }
                            </div>
                    }
                </Fragment>
            }
        />
    )
}
