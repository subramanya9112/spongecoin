import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Header from './../Header';
import Input from '../../basicComponents/Input'
import Button from '../../basicComponents/Button'
import './index.scss';
import GetURL from '../../../GetURL';

export default function Index() {
    const navigate = useNavigate();
    const [chain, setChain] = useState("");
    const [chains, setChains] = useState([]);
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
        let getChains = async () => {
            let res = await axios.post(`http://reflector.localhost/chains`);
            if (res.status !== 200) return;
            setChains(res.data);
        }
        getChains().catch(console.error)
    }, []);

    return (
        <Header
            content={
                <div className="connectChain">
                    <div className='connectChainHeader'>Connect chain</div>
                    <div className="connectChainDiv">
                        <div className="connectChainKey">Chain to Connect to</div>
                        <FormControl
                            variant="standard"
                            style={{ flex: 1 }}
                        >
                            <InputLabel id="chainNameSelect">Chain Name</InputLabel>
                            <Select
                                labelId="chainNameSelect"
                                value={chain}
                                onChange={(e) => { setChain(e.target.value) }}
                                label="Age"
                            >
                                {chains.map((chain, index) => {
                                    return <MenuItem key={index} value={chain}>{chain}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </div>
                    <div className="connectChainDiv">
                        <div className="connectChainKey">Minimum fee</div>
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
                    <div className="connectChainDiv">
                        <div className="connectChainKey">Maximum Time</div>
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
                    </div>
                    <div className="connectChainDiv">
                        <div className="connectChainKey">Reflector URL</div>
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
                            let res = await axios.post(`${GetURL()}/start`, {
                                name: "Sponge Coin",
                                pub_key,
                                minimum_fee: minimumFee,
                                maximum_time: maximumTime,
                                url: GetURL(),
                                reflectorURL,
                            });
                            console.log(res.data)
                            if (res.data.status === true) {
                                navigate('/');
                            }
                        }}
                    />
                </ div>
            }
        />
    );
}
