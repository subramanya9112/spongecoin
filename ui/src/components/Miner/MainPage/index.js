import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Header from './../Header';
import Button from './../../basicComponents/Button';
import GetURL from '../../../GetURL';
import './index.scss';

export default function Index() {
    const navigate = useNavigate();
    const [start, setStart] = useState(false);

    useEffect(() => {
        axios.get(`${GetURL()}/status`)
            .then((response) => {
                let s = response.data.status;
                setStart(s);
            })
    }, [setStart]);
    return (
        <Header
            content={
                <div className="minerMainPage">
                    {start ?
                        <></> :
                        <Button
                            name="Start Sponge Coin"
                            onClick={() => navigate("/miner/startSpongeCoin")}
                        ></Button>
                    }
                    <Button
                        name="Connect to chain"
                        onClick={() => navigate("/miner/connectChain")}
                    ></Button>
                    {start ?
                        <Button
                            name="Create side chain"
                            onClick={() => navigate("/miner/createSideChain")}
                        ></Button>
                        : <></>
                    }
                </div>
            }
        />
    );
}
