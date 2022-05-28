import { useWallet } from '@solana/wallet-adapter-react'
import React from 'react'
import { Buy } from './Buy'
import styles from './track.module.css'

export const Track = ({
  track: { id, name, genre, filename, duration, author, price, token },
  isOwned = false,
}) => {
  const { connected } = useWallet()
  return (
    <div className={styles.trackItem}>
      <h3 className={styles.name}>🔊 {name}</h3>
      <div className={styles.infoBlock}>
        <p className={styles.genre}># {genre}</p>
        <p className={styles.duration}>Duration: {duration}</p>
        <p className={styles.author}>Author: {author}</p>
      </div>
      {connected ? (
        <Buy itemId={id} price={price} token={token} isOwned={isOwned} />
      ) : (
        <p>Connect your wallet!</p>
      )}
    </div>
  )
}
