export async function fetchTracks(){
  return fetch('/api/tracks', {
    headers: {
      'Content-type': 'application/json'
    }
  })
  .then(resp => resp.json())
}