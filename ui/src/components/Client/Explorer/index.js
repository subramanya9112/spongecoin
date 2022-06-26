import React, { useState, Fragment } from 'react';
import './index.scss';
import Header from './../Header';
import bitcoini from './../../../images/bitcoin.svg';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';

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

  const listItems = [{
    height: 456132,
    hash: "asdfasdffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    mined: "asdddddd",
    miner: "by me i",
    size: "sdnfldjfdf"
  }, {
    height: 456132,
    hash: "asdfasdffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    mined: "asdddddd",
    miner: "by me i",
    size: "sdnfldjfdf"
  }, {
    height: 456132,
    hash: "asdfasdffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    mined: "asdddddd",
    miner: "by me i",
    size: "sdnfldjfdf"
  }, {
    height: 456132,
    hash: "asdfasdffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    mined: "asdddddd",
    miner: "by me i",
    size: "sdnfldjfdf"
  }, {
    height: 456132,
    hash: "asdfasdffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    mined: "asdddddd",
    miner: "by me i",
    size: "sdnfldjfdf"
  }, {
    height: 456132,
    hash: "asdfasdffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    mined: "asdddddd",
    miner: "by me i",
    size: "sdnfldjfdf"
  }, {
    height: 456132,
    hash: "asdfasdffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    mined: "asdddddd",
    miner: "by me i",
    size: "sdnfldjfdf"
  }, {
    height: 456132,
    hash: "asdfasdffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    mined: "asdddddd",
    miner: "by me i",
    size: "sdnfldjfdf"
  }, {
    height: 456132,
    hash: "asdfasdffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    mined: "asdddddd",
    miner: "by me i",
    size: "sdnfldjfdf"
  }, {
    height: 456132,
    hash: "asdfasdffffffffffffaaaaaaaaaaaaaaaaaaaaaaaaaaa",
    mined: "asdddddd",
    miner: "by me i",
    size: "sdnfldjfdf"
  },]

  const [num, setNum] = useState([1, 2, 3, 4])

  function arrowClicked(j) {
    setNum(prevState => {
      let newNum = []
      for (let i = 0; i < prevState.length; i++) {
        newNum.push(prevState[i] + j)
      }
      return newNum;
    })
  }

  const [transactionCount, settransactionCount] = useState(10)

  function transactionsCount(j) {
    settransactionCount(j)
    console.log(transactionCount)
  }

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

          <div className="pageContentInExplorer">
            <div className="contentInExplorer">
              <div className="headerForListItems"> Your Blockchain data</div>
              <div className="listItemsInExplorer">
                <div className="eachItem list_header height">Height</div>
                <div className="eachItem list_header hash">Hash</div>
                <div className="eachItem list_header mined">Mined</div>
                <div className="eachItem list_header miner">Miner</div>
                <div className="eachItem list_header size">Size</div>
              </div>
              {listItems.map((item, index) => {
                return <div className="listItemsInExplorer" key={`listItems_${index}`}>
                  <div className="eachItem height">{item.height}</div>
                  <div className="eachItem hash">{item.hash}</div>
                  <div className="eachItem mined">{item.mined}</div>
                  <div className="eachItem miner">{item.miner}</div>
                  <div className="eachItem size">{item.size}</div>
                </div>
              })}
            </div>

            <div className="pageNumView">
              <div className="pageNum" onClick={() => arrowClicked(-2)}><KeyboardDoubleArrowLeftIcon /></div>
              <div className="pageNum" onClick={() => arrowClicked(-1)}><KeyboardArrowLeftIcon /></div>
              {num.map((item, index) => {
                return <div className="pageNum" key={`pageNumView_${index}`}>{item}</div>
              })}
              <div className="pageNum" onClick={() => arrowClicked(1)}><KeyboardArrowRightIcon /></div>
              <div className="pageNum" onClick={() => arrowClicked(2)}><KeyboardDoubleArrowRightIcon /></div>
            </div>

            <div className="numOfPages">
              No. of transactions to be displayed:
              <div className="projects">
                <button>{transactionCount}<KeyboardArrowDownIcon /></button>
                <ul>
                  <li onClick={() => transactionsCount(10)}><a href="#">10</a></li>
                  <li onClick={() => transactionsCount(20)}><a href="#">20</a></li>
                  <li onClick={() => transactionsCount(50)}><a href="#">50</a></li>
                  <li onClick={() => transactionsCount(100)}><a href="#">100</a></li>
                </ul>
              </div>
            </div>

          </div>
        </Fragment>
      }
    />
  )
}
