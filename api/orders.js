import { getJSON, postJSON } from './common'

export const saveOrder = ({ orderId, itemId, price, token, buyer }) => {
  return postJSON('/api/orders', {
    orderId,
    itemId,
    buyer,
    price,
    token,
  })
}

export const confirmOrder = ({ orderId, tx }) => {
  return postjSON(`/api/orders/${orderId}`, {
    tx,
    status: 'confirmed',
  })
}

export const cancelOrder = ({ orderId }) => {
  return postJSON(`/api/orders/${orderId}`, {
    status: 'canceled',
  })
}

export const getOrdersOfBuyer = ({ buyer }) => {
  return getJSON(`/api/orders?buyer=${buyer.toString()}`)
}
