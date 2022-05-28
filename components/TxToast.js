import React from 'react';
import styles from './txtoast.module.css';

const shortenTx = (tx = '') =>
  `${tx.substring(0, 4)}...${tx.substring(tx.length - 4)}`;

export default function TxToast({ tx, closeToast, toastProps }) {
  return (
    <div>
      Transaction{' '}
      <a
        target="_blank"
        className={styles.link}
        href={`https://solscan.io/tx/${tx}?cluster=devnet`}
      >
        {shortenTx(tx)}
      </a>{' '}
      confirmed!
    </div>
  );
}
