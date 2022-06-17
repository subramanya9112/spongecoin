import React, { Fragment } from 'react';
import './index.scss';
import Header from './../Header';
import bitcoini from './../../../images/bitcoin.svg';

export default function Index() {
    const items = [{
        icon: bitcoini,
        text: "index"
    }, {
        icon: bitcoini,
        text: "index"
    }, {
        icon: bitcoini,
        text: "index"
    }, {
        icon: bitcoini,
        text: "index"
    }, {
        icon: bitcoini,
        text: "index"
    }, {
        icon: bitcoini,
        text: "index"
    }, {
        icon: bitcoini,
        text: "index"
    }, {
        icon: bitcoini,
        text: "index"
    }, {
        icon: bitcoini,
        text: "index"
    }, {
        icon: bitcoini,
        text: "index"
    }, {
        icon: bitcoini,
        text: "index"
    }, {
        icon: bitcoini,
        text: "index"
    }, {
        icon: bitcoini,
        text: "index"
    }, {
        icon: bitcoini,
        text: "index"
    }]

    return (
        <Header
            style={{ display: "flex" }}
            content={
                <Fragment>
                    <div className="sidebar">
                        {items.map((item, index) => {
                            return <div className="itemsInExplorer" key={`items_${index}`}>
                                <img className="itemsPic" src={item.icon} alt="React Logo" />
                                <div className="itemsText">{item.text}</div>
                            </div>
                        })}
                    </div>

                    <div className="transactionPageContent">
                        <div className="balance">
                            Balance: 123.456 BTC
                        </div>
                        <div className="transcationHeading">
                            Transactions
                        </div>
                        <div className="transcationList">
                            <div className="feeDivision">
                                <div className="fee">
                                    Fee
                                </div>
                                <div className="feeComponents">
                                    <div className="transactionFee">
                                        0.00003024 BTC
                                    </div>
                                    <div className="satsat">
                                        (13.440 sat/B - 5.277 sat/WU - 225 bytes)
                                    </div>
                                    <div className="virtualBytes">
                                        (21.000 sat/vByte - 144 virtual bytes)
                                    </div>
                                </div>
                            </div>
                            <div className="hashDivision">
                                <div className="hash">
                                    hash
                                </div>
                                <div className="hashComponents">
                                    <div className="hashValue">
                                        750750252a37e83d413671413d217f051fe3cba50553d6d6238eda936f944d61
                                    </div>
                                    <div className="inout">
                                        <div className="in">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                        <div className="out">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v65c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                    </div>
                                    <div className="inout">
                                        <div className="in">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v65c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                        <div className="out">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6cs
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                    </div>
                                    <div className="inout">
                                        <div className="in">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                        <div className="out">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v65c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="transcationList">
                            <div className="feeDivision">
                                <div className="fee">
                                    Fee
                                </div>
                                <div className="feeComponents">
                                    <div className="transactionFee">
                                        0.00003024 BTC
                                    </div>
                                    <div className="satsat">
                                        (13.440 sat/B - 5.277 sat/WU - 225 bytes)
                                    </div>
                                    <div className="virtualBytes">
                                        (21.000 sat/vByte - 144 virtual bytes)
                                    </div>
                                </div>
                            </div>
                            <div className="hashDivision">
                                <div className="hash">
                                    hash
                                </div>
                                <div className="hashComponents">
                                    <div className="hashValue">
                                        750750252a37e83d413671413d217f051fe3cba50553d6d6238eda936f944d61
                                    </div>
                                    <div className="inout">
                                        <div className="in">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v65c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                        <div className="out">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v65c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                    </div>
                                    <div className="inout">
                                        <div className="in">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v65c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                        <div className="out">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v65c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                    </div>
                                    <div className="inout">
                                        <div className="in">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v65c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                        <div className="out">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v65c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                        </div>
                        <div className="transcationList">
                            <div className="feeDivision">
                                <div className="fee">
                                    Fee
                                </div>
                                <div className="feeComponents">
                                    <div className="transactionFee">
                                        0.00003024 BTC
                                    </div>
                                    <div className="satsat">
                                        (13.440 sat/B - 5.277 sat/WU - 225 bytes)
                                    </div>
                                    <div className="virtualBytes">
                                        (21.000 sat/vByte - 144 virtual bytes)
                                    </div>
                                </div>
                            </div>
                            <div className="hashDivision">
                                <div className="hash">
                                    hash
                                </div>
                                <div className="hashComponents">
                                    <div className="hashValue">
                                        750750252a37e83d413671413d217f051fe3cba50553d6d6238eda936f944d61
                                    </div>
                                    <div className="inout">
                                        <div className="in">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                        <div className="out">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v65c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                    </div>
                                    <div className="inout">
                                        <div className="in">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v65c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                        <div className="out">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v65c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                    </div>
                                    <div className="inout">
                                        <div className="in">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v65c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                        <div className="out">
                                            <div className="id">
                                                bc1qjw6ey0ed9l02sav3p69vqh98ml6csvh0c2v65c
                                            </div>
                                            <div className="amount">
                                                0.03406413 BTC
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Fragment>
            }
        />

    )
}
