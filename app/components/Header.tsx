import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { login, logout, autoReconnect, type AuthUser } from '~/lib/auth'

export function Header() {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isConnecting, setIsConnecting] = useState(false)

  useEffect(() => {
    // Auto-reconnect on mount
    autoReconnect().then(setUser).catch(console.error)
  }, [])

  const handleConnect = async () => {
    try {
      setIsConnecting(true)
      const authUser = await login()
      setUser(authUser)
    } catch (error) {
      console.error('Connection failed:', error)
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async () => {
    try {
      await logout()
      setUser(null)
    } catch (error) {
      console.error('Disconnect failed:', error)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-darker border-b border-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold">
              <span className="text-primary">Algo</span>
              <span className="text-white">Fans</span>
            </div>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Home
            </Link>
            <Link
              to="/explore"
              className="text-gray-300 hover:text-white transition-colors"
            >
              Explore
            </Link>
            {user && (
              <Link
                to="/messages"
                className="text-gray-300 hover:text-white transition-colors"
              >
                Messages
              </Link>
            )}
          </nav>

          {/* Auth Button */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to={`/profile/${user.walletAddress}`}
                  className="flex items-center space-x-2"
                >
                  {user.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt={user.displayName || 'Profile'}
                      className="w-8 h-8 rounded-full"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-sm font-semibold">
                        {(user.displayName || user.walletAddress).charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium">
                    {user.displayName || `${user.walletAddress.slice(0, 6)}...`}
                  </span>
                </Link>
                <button onClick={handleDisconnect} className="btn-secondary text-sm">
                  Disconnect
                </button>
              </>
            ) : (
              <button
                onClick={handleConnect}
                disabled={isConnecting}
                className="btn-primary"
              >
                {isConnecting ? 'Connecting...' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
