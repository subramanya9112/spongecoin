import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import Client from './components/Client';
import Miner from './components/Miner';

import './App.scss';

function App() {
  const location = useLocation();
  // useEffect(() => {
  //   var rsa = new RSA();
  //   rsa.generateKeyPair((key) => {
  //     const publicKey = key.publicKey;
  //     const privateKey = key.privateKey;
  //     console.log(publicKey);
  //     console.log(privateKey);

  //     var crypt = new Crypt({
  //       md: 'sha512',
  //     });

  //     var message = 'Hello world!';
  //     var signature = crypt.signature(privateKey, message);
  //     console.log(signature)
  //     var verified = crypt.verify(
  //       publicKey,
  //       signature,
  //       message,
  //     );
  //     console.log(verified);
  //   });
  // }, []);

  // console.log(process.env.REACT_APP_SOMETHING)

  return (
    <div className="App">
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
