import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import MainPage from './MainPage';

export default function Index() {
    const location = useLocation();

    return (
        <SwitchTransition className="transition" mode="out-in">
            <CSSTransition
                key={location.key}
                timeout={450}
                classNames="fade"
            >
                <Routes >
                    {/* <Route path="/singleAnalysis" component={SingleAnalysis} />
                <Route path="/fileAnalysis" component={FileAnalysis} />
                <Route path="/info" component={Info} />
                <Route path="/developer" component={Developer} />*/}
                    <Route path={`/`} element={<MainPage />} />
                    <Route path={`/*`} element={<div>Error from client</div>} />
                </Routes>
            </CSSTransition>
        </SwitchTransition>
    )
}
