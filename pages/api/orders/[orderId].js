import { isValidStatus, updateOrder } from '../../../server/ordersDb'

/**
 * Allows updating order status
 * @param {import('next').NextApiRequest} req
 * @param {import('next').NextApiResponse} res
 */
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405)
  }
  const orderId = req.query.orderId
  const { status, tx } = req.body
  if (!orderId || !isValidStatus(status)) {
    return res.status(400).json({ success: false, errorCode: 'INVALID_PARAMS' })
  }
  await updateOrder({ orderId, status, tx })
    .then(() => {
      res.status(200).json({ success: true })
    })
    .catch((err) => {
      console.error('Error updating order', orderId, err)
      res.status(400).json({ success: false })
    })
}
