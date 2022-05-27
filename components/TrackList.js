import React from 'react'
import { useQuery } from 'react-query'
import { fetchTracks } from '../api/tracks'
import { Track } from './Track'
import styles from './tracks.module.css'

export default function TrackList({ tracks = [] }){
  const tracksQuery = useQuery('tracks', () => fetchTracks())

  if(tracksQuery.isLoading) return <p>Loading...</p>
  console.log(tracksQuery.data)
  return (    
    <div className={styles.trackList}>
    {
      (tracksQuery.data || []).map(t => <Track key={t.id} track={t} />)
    }
    </div>
  )
}