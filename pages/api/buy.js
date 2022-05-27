import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import { clusterApiUrl, Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction } from '@solana/web3.js'
import BigNumber from 'bignumber.js'


const sellerAddress = 'GtBKiJfnhc7UBsAc8mLdzHVr3zLnA9ywVVS3D8FzNNTa'
const sellerPK = new PublicKey(sellerAddress)
/**
 * 
 * @param {import('next').NextApiRequest} req 
 * @param {import('next').NextApiResponse} res 
 */
export default async function buyHandler(req, res){
  switch(req.method){
    case 'POST':{
      const { success, errorMesage, errors, transaction } = await createTransaction(req.body)
      console.log('createTransaction result', { success, transaction, errorMesage })
      return res.status(success ? 201 : 400).json({
        transaction,
        errorMesage,
        errors
      })
    }
    default: {
      res.status(405).json({ errorMessge: 'Method Not Allowed' })
    }
  }
}

async function createTransaction({ buyer, orderId, itemId }){
  console.debug('createTransaction', {buyer, orderId, itemId})
  const errors = {
    buyer: typeof buyer !== 'string' ? 'Buyer missing' : null,
    orderId: typeof orderId !== 'string' ? 'Order required' : null,
    itemId: typeof itemId !== 'number' ? 'Item missing': null
  }
  if(Object.values(errors).some(x => !!x)){
    return {
      success: false,
      errorMessage: 'MISSING_DATA',
      errors
    }
  }
  try {
    const bigPrice = BigNumber(0.1)
    const buyerPublicKey = new PublicKey(buyer)
    const network = WalletAdapterNetwork.Devnet
    const endpoint = clusterApiUrl(network)
    const connection = new Connection(endpoint)
    const { blockhash } = await connection.getLatestBlockhash('finalized')
    const tx = new Transaction()
    tx.recentBlockhash = blockhash
    tx.feePayer = buyerPublicKey

    const transferInstruction = SystemProgram.transfer({
      fromPubkey: buyerPublicKey,
      lamports: bigPrice.multipliedBy(LAMPORTS_PER_SOL).toNumber(),
      toPubkey: sellerPK
    })
    transferInstruction.keys.push({
      // We'll use our OrderId to find this transaction later
      pubkey: new PublicKey(orderId), 
      isSigner: false,
      isWritable: false,
    })
    tx.add(transferInstruction);
     // Formatting our transaction
     const serializedTransaction = tx.serialize({
      requireAllSignatures: false,
    });
    const base64 = serializedTransaction.toString("base64");
    return {
      success: true,
      transaction: base64
    }
  }
  catch(err){
    console.error('Error in buy', err)
    return {
      success: false,
      errorMessage: err.message
    }
  }
}