import { useEffect, useState } from 'react';
import twitterLogo from './assets/twitter-logo.svg';
import './App.css';

const TEST_GIFS = [
	'https://lh3.googleusercontent.com/HOXT4FC1kp6pWQOcqlC-Sz3VeVO7SpPrU8djdxZG0IoEAs3ilt1YwJTp3aNIchpo_qfwKycr9yMGzxLdRZ_dmk11=w600',
  'https://lh3.googleusercontent.com/RDY2WDaiPEi0RSZqmBRD6-YrSp2c9gnOefiaDL3QvgiVkGHkdae6K77o-0YLAAu95h4fqUrKss84aafZmpEeD5Y8ng=s0',
  'https://lh3.googleusercontent.com/-6Ws-Lm-uWbdeyA_rpPPpnJGfCOTdjlADylfSZYoArJiJ2MdL4pZ_cEoAa6uWW6klKAHAdtOSfXFWjMnlpUvqA=w600',
  'https://lh3.googleusercontent.com/cPvVA8sV0Al0lpyrNdFAfXIQrJkz2W-V6huZ9V9RdyPmVVP7JNnrqyAmnrvo4ppAJBwxJEfuWRc0iNwb6tud1DGaOA=w600'
]

const App = () => {
  // State
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
  
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
    } else {
      console.log('Empty input. Try again.');
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      {/* Go ahead and add this input and button to start */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          sendGif();
        }}
      >
        <input
          type="text"
          placeholder="Enter gif link!"
          value={inputValue}
          onChange={onInputChange}
        />
        <button type="submit" className="cta-button submit-gif-button">Submit</button>
      </form>
      <div className="gif-grid">
        {gifList.map((gif)=> (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>
    </div>
  );

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      
      // Call Solana program here.
  
      // Set state
      setGifList(TEST_GIFS);
    }
  }, [walletAddress]);
  return (
    <div className="App">
			{/* This was solely added for some styling fanciness */}
			<div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">My first dApp ✨</p>
          {/* <p className="sub-text">
            View your GIF collection in the metaverse 
          </p> */}
          {/* Add the condition to show this only if we don't have a wallet address */}
          {!walletAddress && renderNotConnectedContainer()}
          {/* opp of above*/}
          {walletAddress && renderConnectedContainer()}
        </div>
        {/* <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div> */}
      </div>
    </div>
  );
};


export default App;