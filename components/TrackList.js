import { useWallet } from '@solana/wallet-adapter-react'
import React from 'react'
import { useQuery } from 'react-query'
import { getOrdersOfBuyer } from '../api/orders'
import { fetchTracks } from '../api/tracks'
import { Track } from './Track'
import styles from './tracks.module.css'

export default function TrackList() {
  const { publicKey } = useWallet()
  const tracksQuery = useQuery('tracks', () => fetchTracks())
  const ordersQuery = useQuery(
    ['orders', publicKey],
    () => getOrdersOfBuyer({ buyer: publicKey }),
    {
      enabled: !!publicKey,
    }
  )

  const isOwned = React.useMemo(
    () => (itemId) => {
      const orders = ordersQuery.data
      return (orders || []).some((o) => o.itemId === itemId)
    },
    [ordersQuery.data]
  )
  if (tracksQuery.isLoading || ordersQuery.isLoading) return <p>Loading...</p>
  return (
    <div className={styles.trackList}>
      {(tracksQuery.data || []).map((t) => (
        <Track key={t.id} track={t} isOwned={isOwned(t.id)} />
      ))}
    </div>
  )
}
