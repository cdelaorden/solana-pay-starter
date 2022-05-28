import fs from 'fs/promises'

const OrderStatus = {
  PENDING: 'pending',
  CANCELED: 'canceled',
  CONFIRMED: 'confirmed',
}

const getDbPath = () => './pages/api/orders.json'

export const isValidStatus = (status) =>
  Object.values(OrderStatus).some((s) => s === status)

const readOrders = async () =>
  fs
    .readFile(getDbPath(), { encoding: 'utf-8' })
    .then((json) => JSON.parse(json))

const saveOrders = async (orders) =>
  fs.writeFile(getDbPath(), JSON.stringify(orders), { encoding: 'utf-8' })

export const addOrder = async ({ orderId, itemId, buyer, price, token }) => {
  const orders = await readOrders()
  orders.push({
    orderId,
    itemId,
    buyer,
    price: Number(price),
    token,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    status: OrderStatus.PENDING,
  })
  saveOrders(orders)
}

export const updateOrder = async ({ orderId, tx, status }) =>
  readOrders()
    .then((orders) => {
      const orderIndex = orders.findIndex((o) => o.orderId === orderId)
      if (orderIndex === -1) throw new Error(`Order ${orderId} not found`)
      orders[orderIndex].status = status
      orders[orderIndex].tx = tx
      orders[orderIndex].updatedAt = Date.now()
      return orders
    })
    .then(saveOrders)

export const getBuyerOrders = async ({ buyer }) =>
  readOrders().then((orders = []) => {
    return orders.filter(
      (o) => o.buyer === buyer && o.status === OrderStatus.CONFIRMED
    )
  })
