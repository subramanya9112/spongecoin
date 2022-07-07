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
    const [totalCoins, setTotalCoins] = useState(1000000);
    const [difficultyTarget, setDifficultyTarget] = useState("0x0000ffff00000000000000000000000000000000000000000000000000000000");
    const [adjustAfterBlocks, setAdjustAfterBlocks] = useState(14400);
    const [timeForEachBlock, setTimeForEachBlock] = useState(6000);
    const [subsidy, setSubsidy] = useState(50);
    const [subsidyHalvingInterval, setSubsidyHalvingInterval] = useState(14400);
    const [minimumFee, setMinimumFee] = useState(5);
    const [maximumTime, setMaximumTime] = useState(1200);
    const [reflectorURL, setReflectorURL] = useState("");
    const [privatePem, setPrivatePem] = useState(null);

    useEffect(() => {
        let pub_key = window.localStorage.getItem('sponge_coin_public_key');
        if (!pub_key) {
            navigate('/login');
        }
    }, []);

    const loadPrivateKey = (fileName) => {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            let privateKey = event.target.result;
            setPrivatePem(privateKey);
        });
        reader.readAsText(fileName);
    };

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
                        {privatePem === null ?
                            <div className='createSideChainPrivateFile'>
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
                            : <Button
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
                                    let data = {
                                        pub_key,
                                        chainName,
                                        totalCoins,
                                        difficultyTarget,
                                        adjustAfterBlocks,
                                        timeForEachBlock,
                                        subsidy,
                                        subsidyHalvingInterval,
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
                                    let signature = JSON.parse(crypt.signature(privatePem, JSON.stringify(data)))['signature'];
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
                        }
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
                                name="Total coins"
                                value={totalCoins}
                                style={{
                                    width: "100%",
                                    flex: "1",
                                }}
                                onChange={(val) => setTotalCoins(val)}
                                type="number"
                            />
                            <Input
                                name="Difficulty Target"
                                value={difficultyTarget}
                                style={{
                                    width: "100%",
                                    flex: "1",
                                }}
                                onChange={(val) => setDifficultyTarget(val)}
                            />
                            <Input
                                name="Adjust After Blocks"
                                value={adjustAfterBlocks}
                                style={{
                                    width: "100%",
                                    flex: "1",
                                }}
                                onChange={(val) => setAdjustAfterBlocks(val)}
                                type="number"
                            />
                            <Input
                                name="Time for each block"
                                value={timeForEachBlock}
                                style={{
                                    width: "100%",
                                    flex: "1",
                                }}
                                onChange={(val) => setTimeForEachBlock(val)}
                                type="number"
                            />
                            <Input
                                name="Subsidy"
                                value={subsidy}
                                style={{
                                    width: "100%",
                                    flex: "1",
                                }}
                                onChange={(val) => setSubsidy(val)}
                                type="number"
                            />
                            <Input
                                name="Subsidy Halving Interval"
                                value={subsidyHalvingInterval}
                                style={{
                                    width: "100%",
                                    flex: "1",
                                }}
                                onChange={(val) => setSubsidyHalvingInterval(val)}
                                type="number"
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
                                name="Maximum Time"
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
