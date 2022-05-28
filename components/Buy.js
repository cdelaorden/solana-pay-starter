import { findReference, FindReferenceError } from '@solana/pay'
import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Keypair, Transaction } from '@solana/web3.js'
import React, { useState, useMemo } from 'react'
import { InfinitySpin } from 'react-loader-spinner'
import { toast } from 'react-toastify'
import { createBuyTransaction } from '../api/buy'
import { cancelOrder, confirmOrder, saveOrder } from '../api/orders'
import TxToast from './TxToast'

const delay = (ms = 1000) => new Promise((res) => setTimeout(res, ms))

export const Buy = ({ itemId, price, token, isOwned }) => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const orderId = useMemo(() => Keypair.generate().publicKey, [])
  const [isPaid, setIsPaid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  React.useEffect(() => setIsPaid(isOwned), [isOwned])

  const verifyTransaction = React.useCallback(() => {
    return delay(1000)
      .then(() =>
        findReference(connection, orderId, {
          finality: 'finalized',
        })
      )
      .catch((err) => {
        if (err instanceof FindReferenceError) {
          return verifyTransaction()
        }
        console.error('Error verifying Transaction', err)
        throw err
      })
  }, [connection, orderId])

  const order = useMemo(
    () => ({
      buyer: publicKey.toString(),
      orderId: orderId.toString(),
      itemId: itemId,
    }),
    [publicKey, orderId, itemId]
  )

  const processTransaction = React.useCallback(async () => {
    setIsLoading(true)
    const txData = await createBuyTransaction(order)
    try {
      const tx = Transaction.from(Buffer.from(txData.transaction, 'base64'))
      const txHash = await sendTransaction(tx, connection)
      console.log('Tx?', txHash)
      await saveOrder({
        orderId: order.orderId,
        itemId: order.itemId,
        price: price,
        token: token,
        buyer: order.buyer,
      })
      console.log('Order saved')
      await toast
        .promise(verifyTransaction(), {
          pending: 'Verifying transaction...',
          success: {
            render() {
              return <TxToast tx={txHash} />
            },
          },
          error: 'Transaction failed',
        })
        .then(async () => {
          await confirmOrder({ orderId: order.orderId, tx: txHash })
        })
      setIsPaid(true)
    } catch (err) {
      console.error('Transaction failed', err)
      await cancelOrder({ orderId: order.orderId })
      if (err?.code === 4001) {
        toast('You rejected the transaction', { type: 'error' })
      } else {
        toast('Transaction failed :(', { type: 'error' })
      }
    } finally {
      setIsLoading(false)
    }
  }, [order])

  if (!publicKey) {
    return (
      <div>
        <p>You need to connect your wallet to make transactions</p>
      </div>
    )
  }

  if (isLoading) {
    return <InfinitySpin color="gray" />
  }

  return (
    <div>
      {isPaid ? (
        <p>You own this track</p>
      ) : (
        <button
          disabled={isLoading}
          className="buy-button"
          onClick={processTransaction}
        >
          Buy for {price} {token}
        </button>
      )}
    </div>
  )
}
