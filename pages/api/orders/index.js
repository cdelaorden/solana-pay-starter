import { addOrder, getBuyerOrders } from '../../../server/ordersDb'

/**
 * POST - creates a new order
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
  if (req.method === 'GET') {
    const { buyer } = req.query
    const orders = await getBuyerOrders({ buyer })
    res.status(200).json(orders)
  }
  if (req.method === 'POST') {
    const { orderId, itemId, price, token, buyer } = req.body
    if (!orderId || !itemId || !buyer) {
      return res
        .status(400)
        .json({ success: false, errorCode: 'MISSING_PARAMS' })
    }
    await addOrder({
      orderId,
      itemId,
      buyer,
      price,
      token,
    })
      .then(() => res.status(201).json({ success: true }))
      .catch((err) => {
        console.error('Error adding order', req.body, err)
        res.status(400).json({ success: false })
      })
  }
}
