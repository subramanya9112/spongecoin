import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import CreateAccount from './CreateAccount';
import Explorer from './Explorer';
import Transact from './Transact';
import Block from './Block';
import Transaction from './Transaction';
import Account from './Account';
import Login from './Login';

export default function Index() {
    return (
        <Routes>
            <Route path={`/`} element={<MainPage />} />
            <Route path={`/create_account`} element={<CreateAccount />} />
            <Route path={`/explorer`} element={<Explorer />} />
            <Route path={`/explorer/:chain_name`} element={<Explorer />} />
            <Route path={`/block/:block_index/:chain_name`} element={<Block />} />
            <Route path={`/transaction/:transaction_id/:chain_name`} element={<Transaction />} />
            <Route path={`/transact/:chain_name`} element={<Transact />} />
            <Route path={`/account`} element={<Account />} />
            <Route path={`/account/:chain_name`} element={<Account />} />
            <Route path={`/login`} element={<Login />} />
            <Route path={`/*`} element={<div>Error from client</div>} />
        </Routes>
    )
}
