import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import TextField from '@mui/material/TextField';
import { Crypt } from 'hybrid-crypto-js';
import { v4 as uuidv4 } from "uuid";
import Header from './../Header';
import './index.scss';
import Checkbox from './../../basicComponents/CheckBox';

export default function Index() {
    const navigate = useNavigate();
    let { chain_name } = useParams();

    const [reflectorURL, setReflectorURL] = useState('');
    const [minerURL, setMinerURL] = useState('');
    const [amount, setAmount] = useState(0);
    const [inTransactAmount, setInTransactAmount] = useState(0);
    const [outTransactAmount, setOutTransactAmount] = useState(0);
    const [selfAmout, setSelfAmount] = useState(0);
    const [utxos, setUTXOs] = useState([]);
    const [outTransaction, setOutTransaction] = useState([]);
    const [privatePem, setPrivatePem] = useState(null);

    // Get Reflector URL
    useEffect(() => {
        const getReflectorURL = async () => {
            let res = await axios.post('http://localhost:3000/get_reflector_url');
            if (res.status !== 200 || res.data.status === false) {
                return;
            }
            setReflectorURL(res.data.reflector_url);
        }
        getReflectorURL().catch(console.error);
    }, [setReflectorURL]);

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
                setMinerURL(res.data[0]);
            }
        };
        if (chain_name !== undefined && reflectorURL !== '') {
            getMinerURL().catch(console.error);
        }
    }, [chain_name, reflectorURL]);

    useEffect(() => {
        let getUTXOs = async () => {
            let pub_key = window.localStorage.getItem('sponge_coin_public_key');
            let res = await axios.post(minerURL + "/client_transactions", {
                "accountId": pub_key
            });
            if (res.status !== 200) {
                return;
            }
            setAmount(res.data.amount);
        };
        if (minerURL !== undefined && minerURL !== '') {
            getUTXOs().catch(console.error);
        }
    }, [minerURL]);

    useEffect(() => {
        let getUTXOs = async () => {
            let pub_key = window.localStorage.getItem('sponge_coin_public_key');
            let res = await axios.post(minerURL + "/client_getUTXO", {
                "accountId": pub_key
            });
            if (res.status !== 200 || res.data.status === false) {
                return;
            }
            let data = []
            Object.entries(res.data.utxos).forEach(([key, value]) => {
                data.push({
                    "checked": false,
                    "transactionID": key,
                    "amount": value
                });
            });
            setUTXOs(data);
        };
        if (minerURL !== undefined && minerURL !== '') {
            getUTXOs().catch(console.error);
        }
    }, [minerURL]);

    const loadPrivateKey = (fileName) => {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            let privateKey = event.target.result;
            setPrivatePem(privateKey);
        });
        reader.readAsText(fileName);
    };

    return (
        <Header
            content={
                <div className='transact'>
                    <div className='transactHeader'>
                        <div>Transact</div>
                        <div className='transactHeaderRight'>
                            <div>Balance: {amount}</div>
                            {privatePem === null ?
                                <div className='transactPrivateFile'>
                                    Choose Private File
                                    <input
                                        type="file"
                                        name="file"
                                        accept=".pem"
                                        onChange={(e) => {
                                            e.preventDefault();
                                            if (e.target.files) {
                                                for (var i = 0; i < e.target.files.length; i++) {
                                                    var file = e.target.files[i];
                                                    if (file.name.endsWith('.pem')) {
                                                        loadPrivateKey(file);
                                                        break;
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                </div>
                                : <></>
                            }
                            {(inTransactAmount === (outTransactAmount + selfAmout) && inTransactAmount !== 0 && privatePem != null) ?
                                <button
                                    onClick={async () => {
                                        let crypt = new Crypt({
                                            aesStandard: 'AES-CBC',
                                            rsaStandard: 'RSAES-PKCS1-V1_5',
                                        });
                                        let pub_key = window.localStorage.getItem('sponge_coin_public_key');
                                        let data = {
                                            pub_key: pub_key,
                                            in: utxos.reduce((acc, cur) => {
                                                if (cur.checked) {
                                                    acc.push({
                                                        inId: cur.transactionID,
                                                        amount: cur.amount,
                                                    });
                                                }
                                                return acc;
                                            }, []),
                                            out: outTransaction.reduce((acc, cur) => {
                                                if (cur.type === 'reward') {
                                                    return [...acc, {
                                                        type: "reward",
                                                        outId: uuidv4().replaceAll('-', ''),
                                                        amount: cur.amount,
                                                    }];
                                                } else if (cur.type === "transaction") {
                                                    return [...acc, {
                                                        type: "transfer",
                                                        outId: uuidv4().replaceAll('-', ''),
                                                        amount: cur.amount,
                                                        receiver_pub_key: cur.pub_key,
                                                    }];
                                                }
                                                return acc;
                                            }, [{
                                                type: "transfer",
                                                outId: uuidv4().replaceAll('-', ''),
                                                amount: selfAmout,
                                                receiver_pub_key: pub_key,
                                            }]),
                                            timestamp: (new Date()).getTime(),
                                        };
                                        let signature = JSON.parse(crypt.signature(privatePem, JSON.stringify(data)))['signature'];
                                        data['signature'] = signature;

                                        let res = await axios.post(minerURL + "/on_transaction", {
                                            transaction: data
                                        });
                                        if (res.status !== 200) {
                                            return;
                                        }
                                        if (res.data.transaction_added === true) {
                                            navigate(`/account/${chain_name}`);
                                        }
                                    }}
                                >Transact</button>
                                : <></>}
                        </div>
                    </div>
                    <div className='transactHeaderDiv'>
                        <div className='transactHeaderIn'>
                            <div>In Transaction</div>
                            <div>{inTransactAmount}</div>
                        </div>
                        <div className='transactHeaderOut'>
                            <div className='transactHeaderOutDiv'>
                                <div>Out Transaction</div>
                                <div>{outTransactAmount}</div>
                            </div>
                            <AddIcon onClick={() => {
                                setOutTransaction(prevOutTransaction => [...prevOutTransaction, {
                                    "type": "transaction",
                                    "amount": 0,
                                    "pub_key": "",
                                }]);
                            }} />
                        </div>
                    </div>
                    <div className='transactData'>
                        <div className='transactIn'>
                            {utxos.map((utxo, index) => {
                                return (
                                    <div className='transactInData' key={index}>
                                        <Checkbox
                                            checked={utxo.checked}
                                            onChecked={() => {
                                                let newUTXOs = [...utxos];
                                                newUTXOs[index].checked = !newUTXOs[index].checked;
                                                if (newUTXOs[index].checked) {
                                                    setInTransactAmount(prevInTransactAmount => prevInTransactAmount + parseFloat(utxo.amount));
                                                } else {
                                                    setInTransactAmount(prevInTransactAmount => prevInTransactAmount - parseFloat(utxo.amount));
                                                }
                                                setUTXOs(newUTXOs);
                                            }}
                                            id={`In${index}`}
                                            className='transactInDataCheckbox'
                                        />
                                        <div className='transactInDataTransactionId'>{utxo.transactionID}</div>
                                        <div className='transactInDataAmount'>{utxo.amount}</div>
                                    </div>
                                );
                            })}
                        </div>
                        <div className='transactOut'>
                            <div className='transactSelfData'>
                                <div>Self</div>
                                <div>{selfAmout}</div>
                            </div>
                            {outTransaction.map((item, index) => {
                                return (
                                    <div className='transactOutData' key={index}>
                                        <div className='transactionOutDataDiv'>
                                            <Checkbox
                                                id={`Out${index}`}
                                                checked={item.type === "reward" ? true : false}
                                                onChecked={() => {
                                                    let newOutTransactions = [...outTransaction];
                                                    if (newOutTransactions[index].type === "reward") {
                                                        newOutTransactions[index].type = "transaction";
                                                        newOutTransactions[index].pub_key = "";
                                                    } else {
                                                        newOutTransactions[index].type = "reward";
                                                        delete newOutTransactions[index].pub_key;
                                                    }
                                                    setOutTransaction(newOutTransactions);
                                                }}
                                            />
                                            {item.type === "reward" ? "Reward" : "Transaction"}
                                            <DeleteIcon
                                                onClick={() => {
                                                    let newOutTransactions = [...outTransaction];
                                                    newOutTransactions.splice(index, 1);
                                                    let amout = newOutTransactions.reduce((acc, item) => {
                                                        return acc + parseFloat(item.amount);
                                                    }, 0);
                                                    setSelfAmount(Math.max(0, inTransactAmount - amout));
                                                    setOutTransactAmount(amout);
                                                    setOutTransaction(newOutTransactions);
                                                }}
                                            />
                                        </div>
                                        {item.type === "transaction" ?
                                            <TextField
                                                label="Public Key"
                                                multiline
                                                maxRows={10}
                                                value={item.pub_key}
                                                onChange={(e) => {
                                                    let newOutTransactions = [...outTransaction];
                                                    newOutTransactions[index].pub_key = e.target.value;
                                                    setOutTransaction(newOutTransactions);
                                                }}
                                                variant="filled"
                                            />
                                            : <></>
                                        }
                                        <TextField
                                            label="Amount"
                                            variant="standard"
                                            style={{ width: "100%", margin: "5px 0px" }}
                                            value={item.amount}
                                            onChange={(e) => {
                                                let newOutTransactions = [...outTransaction];
                                                newOutTransactions[index].amount = e.target.value;
                                                let amout = newOutTransactions.reduce((acc, item) => {
                                                    let val = parseFloat(item.amount);
                                                    if (val !== val) {
                                                        return acc;
                                                    }
                                                    return acc + val;
                                                }, 0);
                                                setSelfAmount(Math.max(0, inTransactAmount - amout));
                                                setOutTransactAmount(amout);
                                                setOutTransaction(newOutTransactions);
                                            }}
                                            type="number"
                                        />
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                </div>
            }
        />
    )
}
