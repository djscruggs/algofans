import { useState } from 'react'

interface ProfileSetupModalProps {
  isOpen: boolean
  onClose: () => void
  onComplete: () => void
}

export function ProfileSetupModal({ isOpen, onClose, onComplete }: ProfileSetupModalProps) {
  const [username, setUsername] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!username.trim()) {
      setError('Username is required')
      return
    }

    // Validate username format (alphanumeric and underscores only)
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores')
      return
    }

    if (username.length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    // Validate email if provided
    if (email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(email)) {
        setError('Please enter a valid email address')
        return
      }
    }

    try {
      setIsSubmitting(true)

      const response = await fetch('/api/user/update-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username.trim(),
          displayName: displayName.trim() || null,
          email: email.trim() || null,
          bio: bio.trim() || null,
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to update profile')
      }

      onComplete()
    } catch (error) {
      console.error('Profile update error:', error)
      setError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-75"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-dark rounded-lg p-6 max-w-md w-full mx-4 border border-gray-800">
        <div className="mb-4">
          <h2 className="text-2xl font-bold mb-2">Complete Your Profile</h2>
          <p className="text-gray-400 text-sm">
            Please set up your username to continue using Algofans
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Username - Required */}
          <div className="mb-4">
            <label htmlFor="username" className="block text-sm font-medium mb-2">
              Username <span className="text-red-500">*</span>
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="your_username"
              className="input w-full"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Letters, numbers, and underscores only
            </p>
          </div>

          {/* Display Name - Optional */}
          <div className="mb-4">
            <label htmlFor="displayName" className="block text-sm font-medium mb-2">
              Display Name
            </label>
            <input
              id="displayName"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="John Doe"
              className="input w-full"
            />
          </div>

          {/* Email - Optional */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="input w-full"
            />
            <p className="text-xs text-gray-500 mt-1">
              Optional - for account recovery and notifications
            </p>
          </div>

          {/* Bio - Optional */}
          <div className="mb-6">
            <label htmlFor="bio" className="block text-sm font-medium mb-2">
              Bio
            </label>
            <textarea
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell us about yourself..."
              className="input w-full min-h-[80px] resize-none"
              maxLength={160}
            />
            <p className="text-xs text-gray-500 mt-1">
              {bio.length}/160 characters
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500 bg-opacity-10 border border-red-500 rounded-lg text-red-500 text-sm">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
