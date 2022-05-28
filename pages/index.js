import { useWallet } from '@solana/wallet-adapter-react';
import {
  WalletConnectButton,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui';
import React from 'react';
import HeadComponent from '../components/Head';
import TrackList from '../components/TrackList';

// Constants
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App = () => {
  return (
    <div className="App">
      <HeadComponent />
      <div className="container">
        <div className="topbar">
          <WalletMultiButton className="cta-button connect-wallet-button" />
        </div>

        <header className="header-container">
          <p className="header"> SOL 💽 Tracks</p>
          <p className="sub-text">Music market for content creators</p>
        </header>

        <main>
          <TrackList />
        </main>

        <div className="footer-container">
          <img src="gradient.svg" alt="Solana Pay" />
          <img
            alt="Twitter Logo"
            className="twitter-logo"
            src="twitter-logo.svg"
          />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
