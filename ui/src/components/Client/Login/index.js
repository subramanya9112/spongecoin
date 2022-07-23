import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GetAppIcon from '@mui/icons-material/GetApp';
import Header from '../Header';
import './index.scss';

export default function Index() {
    const [publicPem, setPublicPem] = useState("");
    const [privatePem, setPrivatePem] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (publicPem !== "" && privatePem !== "") {
            window.localStorage.setItem('sponge_coin_public_key', publicPem);
            window.localStorage.setItem('sponge_coin_private_key', privatePem);
            navigate('/');
        }
    }, [publicPem, privatePem]);

    const loadKey = (fileName, setFunction) => {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            let key = event.target.result;
            setFunction(key);
        });
        reader.readAsText(fileName);
    };

    const onDrop = (e, setFunction) => {
        e.preventDefault();

        if (e.dataTransfer && e.dataTransfer.items) {
            for (var i = 0; i < e.dataTransfer.items.length; i++) {
                if (e.dataTransfer.items[i].kind === 'file') {
                    var file = e.dataTransfer.items[i].getAsFile();
                    if (file.name.endsWith('.pem')) {
                        loadKey(file, setFunction);
                        return;
                    }
                }
            }
        }

        if (e.target && e.target.files) {
            for (var i = 0; i < e.target.files.length; i++) {
                var file = e.target.files[i];
                if (file.name.endsWith('.pem')) {
                    loadKey(file, setFunction);
                    return;
                }
            }
        }
    }

    return (
        <Header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            content={
                <div style={{
                    width: "100%",
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                }}>
                    <div className="loginDiv" onDrop={(e) => onDrop(e, setPublicPem)}>
                        <input
                            type="file"
                            className="loginDivInput"
                            name="file"
                            accept=".pem"
                            onChange={(e) => onDrop(e, setPublicPem)}
                        />
                        <div className="loginDivDiv">
                            <GetAppIcon className="appIcon" />
                            <p>Choose Public file or Drop here</p>
                        </div>
                    </div>
                    <div className="loginDiv" onDrop={(e) => onDrop(e, setPrivatePem)}>
                        <input
                            type="file"
                            className="loginDivInput"
                            name="file"
                            accept=".pem"
                            onChange={(e) => onDrop(e, setPrivatePem)}
                        />
                        <div className="loginDivDiv">
                            <GetAppIcon className="appIcon" />
                            <p>Choose Private file or Drop here</p>
                        </div>
                    </div>
                </div>
            } />
    )
}
