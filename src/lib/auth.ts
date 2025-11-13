import { connectWallet, disconnectWallet, signAuthMessage } from './peraWallet'

export interface AuthUser {
  walletAddress: string
  username?: string
  displayName?: string
  profileImage?: string
  isCreator: boolean
}

// Authentication state management
let currentUser: AuthUser | null = null

export function getCurrentUser(): AuthUser | null {
  return currentUser
}

export async function login(): Promise<AuthUser> {
  try {
    // Connect to Pera Wallet
    const accounts = await connectWallet()
    const walletAddress = accounts[0]

    // Generate authentication message
    const timestamp = Date.now()
    const message = `Sign this message to authenticate with Algofans.\nTimestamp: ${timestamp}`

    // Sign the message with the wallet
    const signature = await signAuthMessage(walletAddress, message)

    // Convert signature to array for JSON serialization
    const signatureArray = Array.from(signature)

    // Call API to verify and create/get user session
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        walletAddress,
        message,
        signature: signatureArray,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Authentication failed')
    }

    const user = await response.json()
    currentUser = user

    // Store in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('walletAddress', walletAddress)
    }

    return user
  } catch (error) {
    console.error('Login failed:', error)
    throw error
  }
}

export async function logout(): Promise<void> {
  try {
    await disconnectWallet()
    currentUser = null

    if (typeof window !== 'undefined') {
      localStorage.removeItem('walletAddress')
    }

    await fetch('/api/auth/logout', {
      method: 'POST',
    })
  } catch (error) {
    console.error('Logout failed:', error)
    throw error
  }
}

// Auto-reconnect on page load
export async function autoReconnect(): Promise<AuthUser | null> {
  if (typeof window === 'undefined') return null

  try {
    const walletAddress = localStorage.getItem('walletAddress')
    if (!walletAddress) return null

    // Reconnect to Pera Wallet
    await connectWallet()

    // Verify session with API
    const response = await fetch('/api/auth/me')
    if (!response.ok) {
      localStorage.removeItem('walletAddress')
      return null
    }

    const user = await response.json()
    currentUser = user
    return user
  } catch (error) {
    console.error('Auto-reconnect failed:', error)
    localStorage.removeItem('walletAddress')
    return null
  }
}
