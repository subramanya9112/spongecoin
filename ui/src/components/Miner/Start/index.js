import React from 'react';
import Header from './../Header';
import InputBox from '../../basicComponents/InputBox'
import './index.scss';

// check box
// totalCoins = data['totalCoins']
// difficultyTarget = data['difficultyTarget']
// adjustAfterBlocks = data['adjustAfterBlocks']
// timeForEachBlock = data['timeForEachBlock']
// subsidy = data['subsidy']
// subsidyHalvingInterval = data['subsidyHalvingInterval']
// pub_key = data['pub_key']
// minimum_fee = data['minimum_fee']
// maximum_time = data['maximum_time']

export default function Index() {
    return (
        <Header
            content={
                <div className="startPage">
                    <div class="checkbox-container">
                        <input type="checkbox" id="rememberMe" />
                        <label class="checkbox" for="rememberMe"></label>
                        <label for="rememberMe">Some text here</label>
                    </div>
                    <div className="someForm">
                        <div className="formComponents">
                            <div className="formHeading">Total coins:</div>
                            <InputBox
                                name="Total coins"
                                width="80%"
                                type="number"
                                margin="0px auto"
                            />
                        </div>
                        <div className="formComponents">
                            <div className="formHeading">DifficultyTarget:</div>
                            <InputBox
                                name="DifficultyTarget"
                                width="80%"
                                type="text"
                                margin="0px auto"
                            />
                        </div>
                        <div className="formComponents">
                            <div className="formHeading">adjustAfterBlocks:</div>
                            <InputBox
                                name="adjustAfterBlocks"
                                width="80%"
                                type="number"
                                margin="0px auto"
                            />
                        </div>
                        <div className="formComponents">
                            <div className="formHeading">timeForEachBlock:</div>
                            <InputBox
                                name="timeForEachBlock"
                                width="80%"
                                type="number"
                                margin="0px auto"
                            />
                        </div>
                        <div className="formComponents">
                            <div className="formHeading">subsidy:</div>
                            <InputBox
                                name="subsidy"
                                width="80%"
                                type="number"
                                margin="0px auto"
                            />
                        </div>
                        <div className="formComponents">
                            <div className="formHeading">subsidyHalvingInterval:</div>
                            <InputBox
                                name="subsidyHalvingInterval"
                                width="80%"
                                type="number"
                                margin="0px auto"
                            />
                        </div>
                        <div className="formComponents">
                            <div className="formHeading">Public key:</div>
                            <textarea name="Public key" rows="3" cols="82" wrap="hard"></textarea>
                        </div>
                        <div className="formComponents">
                            <div className="formHeading">minimum_fee:</div>
                            <InputBox
                                name="minimum_fee"
                                width="80%"
                                type="number"
                                margin="0px auto"
                            />
                        </div>
                        <div className="formComponents">
                            <div className="formHeading">maximum_time:</div>
                            <InputBox
                                name="maximum_time"
                                width="80%"
                                type="number"
                                margin="0px auto"
                            />
                        </div>
                    </div>
                </ div>
            }
        />
    );
}
