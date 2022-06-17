import React, { useEffect } from 'react';
import axios from 'axios';
import Header from './../Header';
import './index.scss';

export default function Index() {
    useEffect(() => {
    }, []);

    return (
        <Header
            content={<div>MainPage</div>}
        />
    );
}
