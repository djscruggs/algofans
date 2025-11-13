import algosdk from 'algosdk'

// Initialize Algod client
const algodClient = new algosdk.Algodv2(
  '',
  process.env.ALGORAND_API_URL || 'https://testnet-api.algonode.cloud',
  ''
)

export { algodClient }

/**
 * Verify an Algorand signature
 * This is used for authentication - users sign a message with their wallet
 * and we verify it server-side to prove they own the private key
 */
export function verifyAlgorandSignature(
  address: string,
  message: Uint8Array,
  signature: Uint8Array
): boolean {
  try {
    return algosdk.verifyBytes(message, signature, address)
  } catch (error) {
    console.error('Signature verification error:', error)
    return false
  }
}

/**
 * Verify auth message format and timestamp
 * Prevents replay attacks by checking message age
 */
export function verifyAuthMessage(message: string): { valid: boolean; timestamp?: number } {
  try {
    const match = message.match(/Timestamp: (\d+)/)
    if (!match) {
      return { valid: false }
    }

    const timestamp = parseInt(match[1])
    const now = Date.now()
    const age = now - timestamp

    // Message must be less than 5 minutes old
    if (age > 5 * 60 * 1000) {
      return { valid: false }
    }

    return { valid: true, timestamp }
  } catch {
    return { valid: false }
  }
}
