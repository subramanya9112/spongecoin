import React, { useEffect } from 'react';
import Header from './../Header';
import './index.scss';

export default function Index() {
    return (
        <div className='mainPage'>
            <Header />
            <div style={{ height: "calc(100% - 75px)", width: "100%" }}>
            </div>
        </div >
    )
}
