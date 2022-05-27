import { useConnection, useWallet } from '@solana/wallet-adapter-react'
import { Keypair, Transaction } from '@solana/web3.js'
import React, { useState, useMemo } from 'react'
import { InfinitySpin } from 'react-loader-spinner'

export const Buy = ({ itemId, price }) => {
  const { connection } = useConnection()
  const { publicKey, sendTransaction } = useWallet()

  const orderId = useMemo(() => Keypair.generate().publicKey, [])
  const [isPaid, setIsPaid] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

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
    const txData = await fetch('/api/buy', {
      method: 'POST',
      body: JSON.stringify(order),
      headers: {
        'Content-type': 'application/json'
      }
    }).then(resp => resp.json())
    console.log('tx data', txData)
    const tx = Transaction.from(Buffer.from(txData.transaction, 'base64'))
    console.log('tx is', tx)

    try {
      const txHash = await sendTransaction(tx, connection)
      console.log(`Transaction sent: https://solscan.io/tx/${txHash}?cluster=devnet`);
      setIsPaid(true)
    }
    catch(err){
      console.error('Transaction failed', err)
    }
    finally {
      setIsLoading(false)
    }
  }, [])

  if (!publicKey) {
    return (
      <div>
        <p>You need to connect your wallet to make transactions</p>
      </div>
    );
  }

  if(isLoading){
    return <InfinitySpin color='gray' />
  }

  return (
    <div>
      {isPaid ? (
        <p>You own this track</p>
      ) : (
        <button disabled={isLoading} className="buy-button" onClick={processTransaction}>
          Buy for ${price} SOL
        </button>
      )}
    </div>
  );
}
