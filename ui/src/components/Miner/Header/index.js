import React, { Fragment, useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import axios from 'axios';
import GetURL from '../GetURL';
import "./index.scss";

export default function Index({ style, content }) {
  const navigate = useNavigate();
  const [start, setStart] = useState(false);

  useEffect(() => {
    axios.get(GetURL() + "/status")
      .then((response) => {
        let s = response.data.status;
        setStart(s);
        if (!s) {
          navigate("/miner/start");
        }
      })
  }, [setStart]);

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="header">
        <div className="linklist">
          <div className="title" onClick={() => {
            navigate('/miner');
          }}>SPONGE COIN</div>
          <ul className="nav-links">
            {start ?
              <Fragment>
                <NavLink to="/miner/chain_change" className="listitem hover-underline-animation">Chain Change</NavLink>
                <NavLink to="/miner/my_mined_blocks" className="listitem hover-underline-animation">Mined blocks</NavLink>
              </Fragment>
              : <></>}
            <NavLink to="/" className="listitem hover-underline-animation">Client</NavLink>
          </ul>
        </div>
      </div>
      <div style={{ height: "calc(100% - 75px)", width: "100%", ...style }}>
        {content}
      </div>
    </div >
  )
}
