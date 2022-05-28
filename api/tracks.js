import { getJSON } from './common'

export async function fetchTracks() {
  return getJSON('/api/tracks')
}
