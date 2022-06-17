import React from 'react';
import { useNavigate } from 'react-router-dom';
import GetAppIcon from '@mui/icons-material/GetApp';
import Header from '../Header';
import './index.scss';

export default function Index() {
    const navigate = useNavigate();

    const loadPublicKey = (fileName) => {
        const reader = new FileReader();
        reader.addEventListener('load', (event) => {
            let publicKey = event.target.result;
            window.localStorage.setItem('sponge_coin_public_key', publicKey);
            navigate('/');
        });
        reader.readAsText(fileName);
    };

    return (
        <Header
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
            content={
                <div className="loginDiv" onDrop={(e) => {
                    e.preventDefault();

                    if (e.dataTransfer.items) {
                        for (var i = 0; i < e.dataTransfer.items.length; i++) {
                            if (e.dataTransfer.items[i].kind === 'file') {
                                var file = e.dataTransfer.items[i].getAsFile();
                                if (file.name.endsWith('.pem')) {
                                    loadPublicKey(file);
                                    break;
                                }
                            }
                        }
                    }
                }}>
                    <input
                        type="file"
                        className="loginDivInput"
                        name="file"
                        accept=".pem"
                        onChange={(e) => {
                            e.preventDefault();

                            if (e.target.files) {
                                for (var i = 0; i < e.target.files.length; i++) {
                                    var file = e.target.files[i];
                                    if (file.name.endsWith('.pem')) {
                                        loadPublicKey(file);
                                        break;
                                    }
                                }
                            }
                        }}
                    />
                    <div className="loginDivDiv">
                        <GetAppIcon className="appIcon" />
                        <p>Choose file or Drop here</p>
                    </div>
                </div>
            } />
    )
}
