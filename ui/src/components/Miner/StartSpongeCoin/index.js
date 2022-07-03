import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './../Header';
import Input from '../../basicComponents/Input'
import Button from '../../basicComponents/Button'
import './index.scss';
import GetURL from '../../../GetURL';

export default function Index() {
    const navigate = useNavigate();
    const [totalCoins, setTotalCoins] = useState(1000000);
    const [difficultyTarget, setDifficultyTarget] = useState("0x0000ffff00000000000000000000000000000000000000000000000000000000");
    const [adjustAfterBlocks, setAdjustAfterBlocks] = useState(14400);
    const [timeForEachBlock, setTimeForEachBlock] = useState(6000);
    const [subsidy, setSubsidy] = useState(50);
    const [subsidyHalvingInterval, setSubsidyHalvingInterval] = useState(14400);
    const [minimumFee, setMinimumFee] = useState(5);
    const [maximumTime, setMaximumTime] = useState(1200);
    const [reflectorURL, setReflectorURL] = useState("");

    useEffect(() => {
        let pub_key = window.localStorage.getItem('sponge_coin_public_key');
        if (!pub_key) {
            navigate('/login');
        }
    }, []);

    return (
        <Header
            content={
                <div className="startSpongeCoin">
                    <div className='startSpongeCoinHeader'>Start Sponge Coin</div>
                    <div className="startSpongeCoinDiv">
                        <div className="startSpongeCoinKey">Total coins</div>
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
                    </div>
                    <div className="startSpongeCoinDiv">
                        <div className="startSpongeCoinKey">Difficulty Target</div>
                        <Input
                            name="Difficulty Target"
                            value={difficultyTarget}
                            style={{
                                width: "100%",
                                flex: "1",
                            }}
                            onChange={(val) => setDifficultyTarget(val)}
                        />
                    </div>
                    <div className="startSpongeCoinDiv">
                        <div className="startSpongeCoinKey">Adjust After Blocks</div>
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
                    </div>
                    <div className="startSpongeCoinDiv">
                        <div className="startSpongeCoinKey">Time for each block</div>
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
                    </div>
                    <div className="startSpongeCoinDiv">
                        <div className="startSpongeCoinKey">Subsidy</div>
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
                    </div>
                    <div className="startSpongeCoinDiv">
                        <div className="startSpongeCoinKey">Subsidy Halving Interval</div>
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
                    </div>
                    <div className="startSpongeCoinDiv">
                        <div className="startSpongeCoinKey">Minimum fee</div>
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
                    </div>
                    <div className="startSpongeCoinDiv">
                        <div className="startSpongeCoinKey">Maximum Time</div>
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
                    </div>
                    <div className="startSpongeCoinDiv">
                        <div className="startSpongeCoinKey">Reflector URL</div>
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
                    <Button
                        style={{
                            width: "100%",
                            marginTop: "20px"

                        }}
                        name="Start"
                        onClick={async () => {
                            let pub_key = window.localStorage.getItem('sponge_coin_public_key');
                            if (!pub_key) navigate('/login');
                            let res = await axios.post(`${GetURL()}/startSpongeCoin`, {
                                name: "Sponge Coin",
                                totalCoins,
                                difficultyTarget,
                                adjustAfterBlocks,
                                timeForEachBlock,
                                subsidy,
                                subsidyHalvingInterval,
                                pub_key,
                                minimum_fee: minimumFee,
                                maximum_time: maximumTime,
                                url: GetURL(),
                                reflectorURL,
                            });
                            if (res.data.status == true) {
                                navigate('/');
                            }
                        }}
                    />
                </ div>
            }
        />
    );
}