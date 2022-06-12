import React from 'react';
import Header from './../Header';
import './index.scss';

// create main chain
//      public key
//      difficulty target
//      seconds for each block

export default function Index() {
    return (
        <Header
            content={<div>Start</div>}
        />
    );
}
