import { PeraWalletConnect } from '@perawallet/connect'
import algosdk from 'algosdk'

// Initialize Pera Wallet
export const peraWallet = new PeraWalletConnect({
  shouldShowSignTxnToast: true,
})

// Algorand client setup
const algodClient = new algosdk.Algodv2(
  '',
  process.env.ALGORAND_API_URL || 'https://testnet-api.algonode.cloud',
  ''
)

export { algodClient }

// Connect wallet and get accounts
export async function connectWallet(): Promise<string[]> {
  try {
    const accounts = await peraWallet.connect()
    return accounts
  } catch (error) {
    console.error('Failed to connect wallet:', error)
    throw error
  }
}

// Disconnect wallet
export async function disconnectWallet() {
  try {
    await peraWallet.disconnect()
  } catch (error) {
    console.error('Failed to disconnect wallet:', error)
    throw error
  }
}

// Sign authentication message
export async function signAuthMessage(
  walletAddress: string,
  message: string
): Promise<Uint8Array> {
  try {
    const encoder = new TextEncoder()
    const messageBytes = encoder.encode(message)

    // Create a zero-amount payment transaction with the auth message in the note field
    // This is a standard way to sign arbitrary data in Algorand
    const suggestedParams = await algodClient.getTransactionParams().do()

    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: walletAddress,
      to: walletAddress,
      amount: 0,
      suggestedParams,
      note: messageBytes,
    })

    const txnGroup = [{ txn }]
    const signedTxn = await peraWallet.signTransaction([txnGroup])

    return signedTxn[0]
  } catch (error) {
    console.error('Failed to sign message:', error)
    throw error
  }
}

// Verify signature (server-side)
export function verifySignature(
  walletAddress: string,
  signature: Uint8Array,
  message: Uint8Array
): boolean {
  try {
    const isValid = algosdk.verifyBytes(message, signature, walletAddress)
    return isValid
  } catch (error) {
    console.error('Failed to verify signature:', error)
    return false
  }
}
