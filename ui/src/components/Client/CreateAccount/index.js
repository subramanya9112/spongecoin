import React, { useEffect } from 'react';
import { RSA, Crypt } from 'hybrid-crypto-js';
import Header from './../Header';

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
        <div>
            <Header />
            {loaded ?
                <div>
                    <a
                        href={"data:text/plain;charset=utf-8," + encodeURIComponent(publicKey)}
                        download="public.pem"
                    >Public key</a>
                    <a
                        href={"data:text/plain;charset=utf-8," + encodeURIComponent(privateKey)}
                        download="private.pem"
                    >Private key</a>
                    <div>Don't lose the private key</div>
                 </div>
                : <div>Generating public and private key</div>}
        </div>
    )
}
