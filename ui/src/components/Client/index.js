import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import CreateAccount from './CreateAccount';
import GetPublicKey from './GetPublicKey';
import Explorer from './Explorer';
import Transact from './Transact';
import Transaction from './Transaction';
import Login from './Login';

export default function Index() {
    return (
        <Routes >
            <Route path={`/`} element={<MainPage />} />
            <Route path={`/create_account`} element={<CreateAccount />} />
            <Route path={`/get_public_key`} element={<GetPublicKey />} />
            <Route path={`/explorer/*`} element={<Explorer />} />
            <Route path={`/transact`} element={<Transact />} />
            <Route path={`/transaction/*`} element={<Transaction />} />
            <Route path={`/login`} element={<Login />} />
            <Route path={`/*`} element={<div>Error from client</div>} />
        </Routes>
    )
}
