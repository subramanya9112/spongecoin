import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import StartSpongeCoin from './StartSpongeCoin';
import ConnectChain from './ConnectChain';
import CreateSideChain from './CreateSideChain';

export default function Index() {
    return (
        <Routes >
            <Route path={`/`} element={<MainPage />} />
            <Route path={`/startSpongeCoin`} element={<StartSpongeCoin />} />
            <Route path={`/connectChain`} element={<ConnectChain />} />
            <Route path={`/createSideChain`} element={<CreateSideChain />} />
            <Route path={`/*`} element={<div>Error from client</div>} />
        </Routes>
    )
}
