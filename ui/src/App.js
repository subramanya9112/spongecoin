import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Client from './components/Client';
import Miner from './components/Miner';
import './App.scss';

function App() {
  const location = useLocation();

  return (
    <div className="app">
      <Routes location={location}>
        <Route path="*" element={<Client />} />
        <Route path="miner/*" element={<Miner />} />
      </Routes>
    </div>
  );
}

export default App;
