const jsonHeaders = {
  'Content-type': 'application/json',
}

export const getJSON = (url) =>
  fetch(url, {
    method: 'GET',
    headers: jsonHeaders,
  }).then((resp) => resp.json())

export const postJSON = (url, data) =>
  fetch(url, {
    method: 'POST',
    headers: jsonHeaders,
    body: data ? JSON.stringify(data) : undefined,
  }).then((resp) => resp.json())
