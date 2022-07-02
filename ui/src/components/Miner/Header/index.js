import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import "./index.scss";

export default function Index({ style, content }) {
  const navigate = useNavigate();

  return (
    <div style={{ height: "100%", width: "100%" }}>
      <div className="header">
        <div className="linklist">
          <div className="title" onClick={() => {
            navigate('/miner');
          }}>SPONGE COIN</div>
          <ul className="nav-links">
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
