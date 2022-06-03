import { RSA, Crypt } from 'hybrid-crypto-js';
import logo from './logo.svg';
import './App.css';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    var rsa = new RSA();
    rsa.generateKeyPair((key) => {
      const publicKey = key.publicKey;
      const privateKey = key.privateKey;
      console.log(publicKey);
      console.log(privateKey);

      var crypt = new Crypt({
        md: 'sha512',
      });

      var message = 'Hello world!';
      var signature = crypt.signature(privateKey, message);
      console.log(signature)
      var verified = crypt.verify(
        publicKey,
        signature,
        message,
      );
      console.log(verified);
    });
  }, []);

  console.log(process.env.REACT_APP_SOMETHING)
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
