import React, { useEffect, Fragment } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "./index.scss";

export default function Index({ style, content }) {
    const [loggedIn, setLoggedIn] = React.useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        let pub_key = window.localStorage.getItem('sponge_coin_public_key');
        if (pub_key) {
            setLoggedIn(true);
        } else {
            setLoggedIn(false);
        }
    }, [setLoggedIn]);

    return (
        <div style={{ height: "100%", width: "100%" }}>
            <div className="header">
                <div className="linklist">
                    <div className="title" onClick={() => {
                        navigate('/');
                    }}>SPONGE COIN</div>
                    <ul className="nav-links">
                        {loggedIn ?
                            <></>
                            : <NavLink to="/create_account" className="listitem hover-underline-animation">Create Account</NavLink>
                        }
                        <NavLink to="/explorer" className="listitem hover-underline-animation">Explorer</NavLink>
                        {loggedIn ?
                            <Fragment>
                                <NavLink to="/transaction" className="listitem hover-underline-animation">Account</NavLink>
                                <div className="listitem hover-underline-animation" onClick={() => {
                                    setLoggedIn(false);
                                    window.localStorage.removeItem('sponge_coin_public_key');
                                    navigate('/');
                                }}>Logout</div>
                            </Fragment>
                            : <NavLink to="/login" className="listitem hover-underline-animation">Login</NavLink>
                        }
                        <NavLink to="/miner" className="listitem hover-underline-animation">Miner</NavLink>
                    </ul>
                </div>
            </div>
            <div style={{ height: "calc(100% - 75px)", width: "100%", ...style }}>
                {content}
            </div>
        </div >
    )
}
