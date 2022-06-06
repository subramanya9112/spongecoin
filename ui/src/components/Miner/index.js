import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';

export default function Index() {
    return (
        <Routes >
            <Route path={`/`} element={<MainPage />} />
            {/* <Route path={`/my_mined_blocks`} element={<MyMinedBlocks />} /> */}
            <Route path={`/*`} element={<div>Error from client</div>} />
        </Routes>
    )
}
