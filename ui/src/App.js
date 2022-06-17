import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
// import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Client from './components/Client';
import Miner from './components/Miner';
import './App.scss';

function App() {
  const location = useLocation();

  return (
    <div className="app">
      {/* <SwitchTransition className="transition" mode="out-in">
        <CSSTransition
          key={location.key}
          timeout={450}
          classNames="fade"
        > */}
      <Routes location={location}>
        <Route path="*" element={<Client />} />
        <Route path="miner/*" element={<Miner />} />
      </Routes>
      {/* </CSSTransition>
      </SwitchTransition> */}
    </div>
  );
}

export default App;
