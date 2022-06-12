import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainPage from './MainPage';
import Start from './Start';
import MyMinedBlocks from './MyMinedBlocks';

export default function Index() {
    return (
        <Routes >
            <Route path={`/`} element={<Start />} />
            <Route path={`/my_mined_blocks`} element={<MyMinedBlocks />} />
            <Route path={`/*`} element={<div>Error from client</div>} />
        </Routes>
    )
}
