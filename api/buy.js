/**
 *
 * @param {object} order
 * @returns {Promise<{ success: boolean, errorMessage?: string, transaction?: string }>}
 */
export const createBuyTransaction = async (order) => {
  return fetch('/api/buy', {
    method: 'POST',
    body: JSON.stringify(order),
    headers: {
      'Content-type': 'application/json',
    },
  }).then((resp) => resp.json())
}
