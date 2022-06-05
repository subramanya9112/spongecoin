import React, { useEffect, Fragment } from 'react';
import { NavLink } from 'react-router-dom';
import "./index.scss";

export default function Index() {
  const [loggedIn, setLoggedIn] = React.useState(false);

  useEffect(() => {
    let pub_key = window.localStorage.getItem('sponge_coin_public_key');
    if (pub_key == null) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
  }, [setLoggedIn]);

  return (
    <div className="header">
      <div className="linklist">
        <div className="title">SPONGE COIN</div>
        <ul className="nav-links">
          <NavLink to="/create_account" className="listitem hover-underline-animation">Create Account</NavLink>
          <NavLink to="/get_public_key" className="listitem hover-underline-animation">Get public key</NavLink>
          <NavLink to="/explorer" className="listitem hover-underline-animation">Explorer</NavLink>
          {loggedIn ?
            <Fragment>
              <NavLink to="/transact" className="listitem hover-underline-animation">Transact</NavLink>
              <NavLink to="/transaction" className="listitem hover-underline-animation">Transactions</NavLink>
              <div className="listitem hover-underline-animation" onClick={() => {
                setLoggedIn(false);
                window.localStorage.removeItem('sponge_coin_public_key');
              }}>Logout</div>
            </Fragment>
            : <NavLink to="/login" className="listitem hover-underline-animation">Login</NavLink>
          }
          <NavLink to="/miner" className="listitem hover-underline-animation">Miner</NavLink>
        </ul>
      </div>
    </div>
  )
}
