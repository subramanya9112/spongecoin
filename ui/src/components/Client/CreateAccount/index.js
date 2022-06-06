import React, { useEffect } from 'react';
import { RSA, Crypt } from 'hybrid-crypto-js';
import Header from './../Header';
import LoadingScreen from './../../LoadingScreen';
import './index.scss';

export default function Index() {
    const [publicKey, setPublicKey] = React.useState('');
    const [privateKey, setPrivateKey] = React.useState('');
    const [loaded, setLoaded] = React.useState(false);

    useEffect(() => {
        var rsa = new RSA();
        rsa.generateKeyPair((key) => {
            const publicKey = key.publicKey;
            const privateKey = key.privateKey;
            setPublicKey(publicKey);
            setPrivateKey(privateKey);
            setLoaded(true);
        });
    }, []);

    return (
        <div className='createAccount'>
            <Header />
            <div style={{ height: "calc(100% - 75px)", width: "100%" }}>
                {loaded ?
                    <div className="createAccountContent">
                        <div className="createAccountBtns">
                            <a
                                className="createAccountBtn"
                                href={"data:text/plain;charset=utf-8," + encodeURIComponent(publicKey)}
                                download="public.pem"
                            >Public key</a>
                            <a
                                className="createAccountBtn"
                                href={"data:text/plain;charset=utf-8," + encodeURIComponent(privateKey)}
                                download="private.pem"
                            >Private key</a>
                        </div>
                        <div className="createAccountNote">Don't lose the private key</div>
                    </div>
                    :
                    <LoadingScreen />}
            </div>
        </div >
    )
}
