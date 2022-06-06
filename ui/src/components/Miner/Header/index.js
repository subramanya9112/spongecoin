import React, { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { parseDomain, ParseResultType } from 'parse-domain';
import "./index.scss";

export default function Index() {
  const navigate = useNavigate();
  const start = false;

  useEffect(() => {
    const parseResult = parseDomain(
      'others.localtest.me',
    );

    if (parseResult.type === ParseResultType.Listed) {
      const { subDomains, domain, topLevelDomains } = parseResult;

      console.log(subDomains);
      console.log(domain);
      console.log(topLevelDomains);
    } else {
      console.log(parseResult)
      console.log("Got here");
    }
  })

  return (
    <div className="header">
      <div className="linklist">
        <div className="title" onClick={() => {
          navigate('/miner');
        }}>SPONGE COIN</div>
        {start ?
          <></> :
          <ul className="nav-links">
            <NavLink to="/miner/my_mined_blocks" className="listitem hover-underline-animation">Mined blocks</NavLink>
            <NavLink to="/client" className="listitem hover-underline-animation">Client</NavLink>
          </ul>}
      </div>
    </div>
  )
}
