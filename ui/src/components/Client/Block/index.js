import React, { useState, Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './index.scss';
import Header from './../Header';

export default function Index() {
  const navigate = useNavigate();
  let { block_index, chain_name } = useParams();

  const reflectorURL = "http://reflector.subramanya.com";
  const [minerURL, setMinerURL] = useState('');
  const [block, setBlock] = useState(null);

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
    let getBlockDetails = async () => {
      let res = await axios.post(minerURL + "/block", {
        "block_id": parseInt(block_index)
      });
      if (res.status !== 200 || res.data.status === false) {
        return;
      }
      setBlock(res.data.block);
    }
    if (minerURL && minerURL !== '') {
      getBlockDetails().catch(console.error);
    }
  }, [minerURL, block_index]);

  let getPublicKeyDiv = (pub_key) => {
    return pub_key.split('\n').map((val, index) => {
      return <div key={index}>{val}</div>
    })
  };

  let getTransacation = (transaction) => {
    if (transaction['type'] === "CoinBaseTransaction") {
      return (
        <Fragment>
          <div className='blockTransactionHeader'>Coin Base Transaction</div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Transaction ID</div>
            <div className='blockCoinBaseValue'>{transaction['transactionId']}</div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Subsidy</div>
            <div className='blockCoinBaseValue'>{transaction['subsidy']}</div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Public Key</div>
            <div className='blockCoinBaseValue'>
              {getPublicKeyDiv(transaction['pub_key'])}
            </div>
          </div>
        </Fragment>
      );
    } else if (transaction['type'] === "GenesisBlock") {
      return (
        <Fragment>
          <div className='blockTransactionHeader'>Genesis Block Transaction</div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Transaction ID</div>
            <div className='blockCoinBaseValue'>{transaction['transactionId']}</div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Name</div>
            <div className='blockCoinBaseValue'>{transaction['name']}</div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Total Coins</div>
            <div className='blockCoinBaseValue'>{transaction['totalCoins']}</div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Adjust After Blocks</div>
            <div className='blockCoinBaseValue'>{transaction['adjustAfterBlocks']}</div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Time for each Block</div>
            <div className='blockCoinBaseValue'>{transaction['timeForEachBlock']} ms</div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Difficulty Target</div>
            <div className='blockCoinBaseValue'>{transaction['difficultyTarget']}</div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Subsidy</div>
            <div className='blockCoinBaseValue'>{transaction['subsidy']}</div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Subsidy Halving Interval</div>
            <div className='blockCoinBaseValue'>{transaction['subsidyHalvingInterval']} ms</div>
          </div>
        </Fragment>
      );
    } else if (transaction['type'] === "Transaction") {
      return (
        <Fragment>
          <div className='blockTransactionHeader'>Transaction</div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Transaction ID</div>
            <div className='blockCoinBaseValue'>{transaction['transactionId']}</div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Public Key</div>
            <div className='blockCoinBaseValue'>
              {getPublicKeyDiv(transaction['pub_key'])}
            </div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Signature</div>
            <div className='blockCoinBaseValue'>{transaction['signature']}</div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Time Stamp</div>
            <div className='blockCoinBaseValue'>{(new Date(transaction['timestamp'])).toLocaleString()}</div>
          </div>
          <div className='blockTranx'>
            <div className='blockTranxHeader'>In Transaction</div>
            <div className='blockTranxHeader'>Out Transaction</div>
          </div>
          <div className='blockTranx'>
            <div className='blockTranxIn'>
              {transaction['in'].map((tranx, index) => {
                return (
                  <Fragment key={index}>
                    <div className='blockTranxInData'>
                      <div className='blockTranxInDataHeader'>
                        <div className='blockTranxInKey'>Transaction ID</div>
                        <div className='blockTranxInValue'>{tranx['inId']}</div>
                      </div>
                      <div className='blockTranxInDataHeader'>
                        <div className='blockTranxInKey'>Amount</div>
                        <div className='blockTranxInValue'>{tranx['amount']}</div>
                      </div>
                    </div>
                    <div className='blockTranxLineBreak' />
                  </Fragment>
                );
              })}
            </div>
            <div className='blockTranxOut'>
              {transaction['out'].map((tranx, index) => {
                if (tranx['type'] === "transfer")
                  return (
                    <Fragment key={index}>
                      <div className='blockTranxOutData' >
                        <div className='blockTranxOutDataHeader'>
                          <div className='blockTranxOutKey'>Transaction Type</div>
                          <div className='blockTranxOutValue'>Transfer</div>
                        </div>
                        <div className='blockTranxOutDataHeader'>
                          <div className='blockTranxOutKey'>Transaction ID</div>
                          <div className='blockTranxOutValue'>{tranx['outId']}</div>
                        </div>
                        <div className='blockTranxOutDataHeader'>
                          <div className='blockTranxOutKey'>Amount</div>
                          <div className='blockTranxOutValue'>{tranx['amount']}</div>
                        </div>
                        <div className='blockTranxOutDataHeader'>
                          <div className='blockTranxOutKey'>Public Key</div>
                          <div className='blockTranxOutValue'>{getPublicKeyDiv(tranx['receiver_pub_key'])}</div>
                        </div>
                      </div>
                      <div className='blockTranxLineBreak' />
                    </Fragment>
                  );
                else
                  return (
                    <Fragment key={index}>
                      <div className='blockTranxOutData' >
                        <div className='blockTranxOutDataHeader'>
                          <div className='blockTranxOutKey'>Transaction Type</div>
                          <div className='blockTranxOutValue'>Reward</div>
                        </div>
                        <div className='blockTranxOutDataHeader'>
                          <div className='blockTranxOutKey'>Transaction Id</div>
                          <div className='blockTranxOutValue'>{tranx['outId']}</div>
                        </div>
                        <div className='blockTranxOutDataHeader'>
                          <div className='blockTranxOutKey'>Amount</div>
                          <div className='blockTranxOutValue'>{tranx['amount']}</div>
                        </div>
                      </div>
                      <div className='blockTranxLineBreak' />
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
          <div className='blockTransactionHeader'>SideChain Create Transaction</div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Transaction ID</div>
            <div className='blockCoinBaseValue'>{transaction['transactionId']}</div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Public Key</div>
            <div className='blockCoinBaseValue'>
              {getPublicKeyDiv(transaction['pub_key'])}
            </div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Signature</div>
            <div className='blockCoinBaseValue'>{transaction['signature']}</div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Chain Name</div>
            <div className='blockCoinBaseValue'>{transaction['timestamp']}</div>
          </div>
          <div className='blockCoinBase'>
            <div className='blockCoinBaseKey'>Time Stamp</div>
            <div className='blockCoinBaseValue'>{(new Date(transaction['timestamp'])).toLocaleString()}</div>
          </div>
          <div className='blockTranx'>
            <div className='blockTranxHeader'>In Transaction</div>
          </div>
          <div className='blockTranx'>
            <div className='blockTranxIn'>
              {transaction['in'].map((tranx, index) => {
                return (
                  <Fragment key={index}>
                    <div className='blockTranxInData'>
                      <div className='blockTranxInDataHeader'>
                        <div className='blockTranxInKey'>Transaction ID</div>
                        <div className='blockTranxInValue'>{tranx['inId']}</div>
                      </div>
                      <div className='blockTranxInDataHeader'>
                        <div className='blockTranxInKey'>Amount</div>
                        <div className='blockTranxInValue'>{tranx['amount']}</div>
                      </div>
                    </div>
                    <div className='blockTranxLineBreak' />
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

  let getTotalFee = () => {
    return block['transactions'].reduce((accumulator, transaction) => {
      if (transaction.type === "CoinBaseTransaction")
        return accumulator + parseFloat(transaction.subsidy);
      else
        return accumulator;
    }, 0.0);
  }

  return (
    <Header
      style={{ display: "flex" }}
      content={
        <Fragment>
          {block === null ?
            <div className='blockLoading'>Loading...</div>
            :
            <div className="block">
              <div className="blockHeader">
                Block {block.height}
              </div>
              <div className="blockData">
                <div className="blockKey">Version</div>
                <div className="blockValue">{block['version']}</div>
              </div>
              <div className="blockData">
                <div className="blockKey">Height</div>
                <div className="blockValue">{block['height']}</div>
              </div>
              <div className="blockData">
                <div className="blockKey">Nonce</div>
                <div className="blockValue">{block['nonce']}</div>
              </div>
              <div className="blockData">
                <div className="blockKey">Number of Transaction</div>
                <div className="blockValue">{block['num_transaction']}</div>
              </div>
              <div className="blockData">
                <div className="blockKey">Difficulty Target</div>
                <div className="blockValue">{block['difficultyTarget']}</div>
              </div>
              <div className="blockData">
                <div className="blockKey">Hash</div>
                <div className="blockValue">{block['hash']}</div>
              </div>
              <div className="blockData">
                <div className="blockKey">Merkle root</div>
                <div className="blockValue">{block['merkleHash']}</div>
              </div>
              <div className="blockData">
                <div className="blockKey">Previous Hash</div>
                <div className="blockValue">{block['previousBlockHash']}</div>
              </div>
              <div className="blockData">
                <div className="blockKey">Timestamp</div>
                <div className="blockValue">{(new Date(block['timestamp'])).toLocaleString()}</div>
              </div>
              <div className="blockData">
                <div className="blockKey">Miner Fee</div>
                <div className="blockValue">{getTotalFee()}</div>
              </div>
              {block['transactions'].map((transaction, index) => {
                return (
                  <Fragment key={index}>
                    <div className="blockLineBreak" />
                    <div
                      className="blockTransaction"
                      onClick={() => {
                        navigate(`/transaction/${transaction['transactionId']}/${chain_name}`);
                      }}
                    >
                      {getTransacation(transaction)}
                    </div>
                  </Fragment>
                )
              })}
            </div>
          }
        </Fragment>
      }
    />
  )
}
