import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Crypt } from 'hybrid-crypto-js';
import Header from './../Header';
import Input from '../../basicComponents/Input';
import Button from '../../basicComponents/Button';
import Checkbox from '../../basicComponents/CheckBox';
import GetURL from '../../../GetURL';
import './index.scss';

export default function Index() {
    const navigate = useNavigate();
    const [inTransactAmount, setInTransactAmount] = useState(0);
    const [utxos, setUTXOs] = useState([]);
    const [chainName, setChainName] = useState("");
    const [minimumFee, setMinimumFee] = useState(5);
    const [maximumTime, setMaximumTime] = useState(1200);
    const [reflectorURL, setReflectorURL] = useState("");

    useEffect(() => {
        let pub_key = window.localStorage.getItem('sponge_coin_public_key');
        if (!pub_key) {
            navigate('/login');
        }
    }, []);

    useEffect(() => {
        let getUTXOs = async () => {
            let pub_key = window.localStorage.getItem('sponge_coin_public_key');
            let res = await axios.post(`${GetURL()}/client_getUTXO`, {
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
        getUTXOs().catch(console.error);
    }, []);

    return (
        <Header
            content={
                <div className="createSideChain">
                    <div className='createSideChainHeader'>
                        Create SideChain
                        <Button
                            style={{
                                width: "180px",
                                marginTop: "20px"

                            }}
                            name="Create"
                            onClick={async () => {
                                let crypt = new Crypt({
                                    aesStandard: 'AES-CBC',
                                    rsaStandard: 'RSAES-PKCS1-V1_5',
                                });
                                let pub_key = window.localStorage.getItem('sponge_coin_public_key');
                                let pri_key = window.localStorage.getItem('sponge_coin_private_key');
                                let data = {
                                    pub_key,
                                    chainName,
                                    totalCoins: "1000000",
                                    difficultyTarget: "0x0000ffff00000000000000000000000000000000000000000000000000000000",
                                    adjustAfterBlocks: "14400",
                                    timeForEachBlock: "20",
                                    subsidy: "25",
                                    subsidyHalvingInterval: "14400",
                                    minimum_fee: minimumFee,
                                    maximum_time: maximumTime,
                                    url: GetURL(),
                                    amount: inTransactAmount,
                                    reflectorURL,
                                    timestamp: (new Date()).getTime(),
                                    in: utxos.reduce((acc, cur) => {
                                        if (cur.checked) {
                                            acc.push({
                                                inId: cur.transactionID,
                                                amount: cur.amount,
                                            });
                                        }
                                        return acc;
                                    }, []),
                                }
                                let signature = JSON.parse(crypt.signature(pri_key, JSON.stringify(data)))['signature'];
                                data['signature'] = signature;
                                // transaction with signature
                                let res = await axios.post(`${GetURL()}/create_sidechain`, {
                                    transaction: data
                                });
                                if (res.status === 200 && res.data.status === true) {
                                    navigate('/');
                                }
                            }}
                        />
                    </div>
                    <div className='createSideChainBody'>
                        <div className="createSideChainIn">
                            <div className='createSideChainHeaderIn'>
                                <div>In Transaction</div>
                                <div>{inTransactAmount}</div>
                            </div>
                            <div className='createSideChainIn'>
                                {utxos.map((utxo, index) => {
                                    return (
                                        <div className='createSideChainInData' key={index}>
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
                                                className='createSideChainInDataCheckbox'
                                            />
                                            <div className='createSideChainInDataTransactionId'>{utxo.transactionID}</div>
                                            <div className='createSideChainInDataAmount'>{utxo.amount}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <div className='createSideChainInForm'>
                            <Input
                                name="Name"
                                value={chainName}
                                style={{
                                    width: "100%",
                                    flex: "1",
                                }}
                                onChange={(val) => setChainName(val)}
                            />
                            <Input
                                name="Minimum fee"
                                value={minimumFee}
                                style={{
                                    width: "100%",
                                    flex: "1",
                                }}
                                onChange={(val) => setMinimumFee(val)}
                                type="number"
                            />
                            <Input
                                name="Maximum Time (ms)"
                                value={maximumTime}
                                style={{
                                    width: "100%",
                                    flex: "1",
                                }}
                                onChange={(val) => setMaximumTime(val)}
                                type="number"
                            />
                            <Input
                                name="Reflector URL"
                                value={reflectorURL}
                                style={{
                                    width: "100%",
                                    flex: "1",
                                }}
                                onChange={(val) => setReflectorURL(val)}
                            />
                        </div>
                    </div>
                </ div>
            }
        />
    );
}
