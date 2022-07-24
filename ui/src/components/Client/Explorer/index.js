import React, { useState, Fragment, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import './index.scss';
import Header from './../Header';

export default function Index() {
  const navigate = useNavigate();
  let { chain_name } = useParams();

  const reflectorURL = "http://reflector.subramanya.com";
  const [minerURL, setMinerURL] = useState('');
  const [coins, setCoins] = useState([]);
  const [blockCount, setBlockCount] = useState(0);
  const [page, setPage] = useState(0);
  const [transactionRange, setTransactionRange] = useState(10);
  const [paginationNum, setPaginationNum] = useState([]);
  const [transaction, setTransaction] = useState([]);

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

  const getBlockCount = async () => {
    let res = await axios.post(minerURL + "/block_count",);
    if (res.status !== 200 && res.data.status === false) {
      return;
    }
    setBlockCount(res.data.block_count);
    if (res.data.block_count > 0) {
      setPage(prevPage => prevPage === 0 ? 1 : prevPage);
    }
    if (paginationNum.length === 0) {
      let val = [];
      for (let i = 1; i <= Math.min(4, Math.ceil(res.data.block_count / transactionRange)); i++) {
        val.push(i);
      }
      setPaginationNum(val);
    }
  };

  // Get Block count
  useEffect(() => {
    if (minerURL && minerURL !== '') {
      getBlockCount().catch(console.error);
    }
  }, [minerURL]);

  useEffect(() => {
    let val = [];
    for (let i = 1; i <= Math.min(4, Math.ceil(blockCount / transactionRange)); i++) {
      val.push(i);
    }
    setPaginationNum(val);
  }, [transactionRange, setPaginationNum]);

  // Get Transaction
  useEffect(() => {
    const getTransactionPage = async () => {
      await getBlockCount();
      let res = await axios.post(minerURL + "/blocks", {
        range: transactionRange,
        start: (page - 1) * transactionRange
      });
      if (res.status !== 200 && res.data.status === false) {
        return;
      }
      let data = [];
      res.data.blocks.forEach(block => {
        data.push({
          height: block.height,
          hash: block.hash,
          minedAt: (new Date(block.timestamp)).toLocaleString(),
          size: JSON.stringify(block).length,
        });
      });
      setTransaction(data);
    }
    if (page !== 0) {
      getTransactionPage().catch(console.error);
    }
  }, [page, transactionRange]);

  return (
    <Header
      style={{ display: "flex" }}
      content={
        <Fragment>
          <div className="explorerSidebar">
            {coins.length === 0 ?
              <div className="explorerError">No coins running...</div>
              : coins.map((item, index) => {
                return <div
                  className={"explorerItems" + (chain_name === item ? " explorerItemsActive" : "")}
                  key={`items_${index}`}
                  onClick={() => {
                    navigate(`/explorer/${item}`);
                  }}
                >
                  {item}
                </div>
              })}
          </div>

          {chain_name === undefined ?
            <div className="explorerChainError">Select the chain</div>
            :
            minerURL === '' ?
              <div className="explorerChainError">No miner is up</div>
              :
              <div className="explorerPageContent">
                <Fragment>
                  <div className="explorerHeader">Chain data</div>
                  <div className="explorerListItems">
                    <div className="explorerListItem explorerListItemHeader explorerListItemHeight">Height</div>
                    <div className="explorerListItem explorerListItemHeader explorerListItemHash">Hash</div>
                    <div className="explorerListItem explorerListItemHeader explorerListItemMinedAt">Mined At</div>
                    <div className="explorerListItem explorerListItemHeader explorerListItemSize">Size</div>
                  </div>
                  {transaction.map((item, index) => {
                    return <div
                      className="explorerListItems"
                      key={`listItems_${index}`}
                      onClick={() => {
                        navigate(`/block/${item.height}/${chain_name}`);
                      }}
                    >
                      <div className="explorerListItem explorerListItemHeight">{item.height}</div>
                      <div className="explorerListItem explorerListItemHash">{item.hash.substring(0, 30) + "..."}</div>
                      <div className="explorerListItem explorerListItemMinedAt">{item.minedAt}</div>
                      <div className="explorerListItem explorerListItemSize">{item.size}</div>
                    </div>
                  })}
                </Fragment>

                <div className="explorerPageNumView">
                  <div className="explorerPageNum" onClick={() => {
                    let val = [];
                    for (let i = 1; i <= Math.min(4, Math.ceil(blockCount / transactionRange)); i++) {
                      val.push(i);
                    }
                    setPaginationNum(val);
                  }}><KeyboardDoubleArrowLeftIcon /></div>
                  <div className="explorerPageNum" onClick={() => {
                    if (paginationNum[0] === 1)
                      return;
                    let val = [];
                    for (let i = 0; i < paginationNum.length; i++) {
                      val.push(paginationNum[i] - 1);
                    }
                    setPaginationNum(val);
                  }}><KeyboardArrowLeftIcon /></div>
                  {paginationNum.map((item, index) => {
                    return <div
                      className="explorerPageNum"
                      key={`explorerPageNumView_${index}`}
                      onClick={() => {
                        console.log(item)
                        setPage(item);
                      }}
                    >{item}</div>
                  })}
                  <div className="explorerPageNum" onClick={() => {
                    if (paginationNum[paginationNum.length - 1] === Math.ceil(blockCount / transactionRange))
                      return;
                    let val = [];
                    for (let i = 0; i < paginationNum.length; i++) {
                      val.push(paginationNum[i] + 1);
                    }
                    setPaginationNum(val);
                  }}><KeyboardArrowRightIcon /></div>
                  <div className="explorerPageNum" onClick={() => {
                    let val = [];
                    for (let i = Math.max(1, Math.ceil(blockCount / transactionRange) - 3); i <= Math.ceil(blockCount / transactionRange); i++) {
                      val.push(i);
                    }
                    setPaginationNum(val);
                  }}><KeyboardDoubleArrowRightIcon /></div>
                </div>

                <div className="explorerNumOfTranx">
                  No. of transactions to be displayed:
                  <div className="explorerNumOfTranxDiv">
                    <button>{transactionRange}<KeyboardArrowDownIcon /></button>
                    <ul>
                      <li onClick={() => setTransactionRange(10)}><div>10</div></li>
                      <li onClick={() => setTransactionRange(20)}><div>20</div></li>
                      <li onClick={() => setTransactionRange(50)}><div>50</div></li>
                      <li onClick={() => setTransactionRange(100)}><div>100</div></li>
                    </ul>
                  </div>
                </div>
              </div>
          }
        </Fragment>
      }
    />
  )
}
