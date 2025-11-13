import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { PostCard } from '~/components/PostCard'

export const Route = createFileRoute('/profile/$walletAddress')({
  component: Profile,
})

function Profile() {
  const { walletAddress } = Route.useParams()
  const [isSubscribed, setIsSubscribed] = useState(false)
  const [isSubscribing, setIsSubscribing] = useState(false)

  // Mock profile data
  const profile = {
    walletAddress,
    displayName: 'Sarah Johnson',
    username: 'sarahj',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=1200',
    bio: 'Artist & Content Creator 🎨\nSharing my creative journey with you!',
    isCreator: true,
    subscriptionPrice: 9.99,
    subscriberCount: 1234,
    postCount: 156,
  }

  const posts = [
    {
      id: '1',
      user: profile,
      content: 'Just launched my new exclusive content series! 🎨✨',
      mediaUrls: ['https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800'],
      mediaType: 'image',
      isLocked: false,
      createdAt: new Date().toISOString(),
      likes: 234,
      comments: 45,
    },
    {
      id: '2',
      user: profile,
      content: 'Behind the scenes content for subscribers only! 💎',
      mediaUrls: ['https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800'],
      mediaType: 'image',
      isLocked: true,
      createdAt: new Date(Date.now() - 86400000).toISOString(),
      likes: 567,
      comments: 89,
    },
  ]

  // Check subscription status on mount
  useEffect(() => {
    async function checkSubscription() {
      try {
        const response = await fetch(`/api/subscriptions/check/${profile.walletAddress}`)
        if (response.ok) {
          const data = await response.json()
          setIsSubscribed(data.isSubscribed)
        }
      } catch (error) {
        console.error('Failed to check subscription:', error)
      }
    }
    checkSubscription()
  }, [walletAddress])

  const handleSubscribe = async () => {
    if (isSubscribed) {
      // Unsubscribe
      try {
        setIsSubscribing(true)
        const response = await fetch('/api/subscriptions/unsubscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ creatorId: profile.walletAddress }),
        })

        if (response.ok) {
          setIsSubscribed(false)
        } else {
          const data = await response.json()
          alert(data.error || 'Failed to unsubscribe')
        }
      } catch (error) {
        console.error('Unsubscribe failed:', error)
        alert('Failed to unsubscribe')
      } finally {
        setIsSubscribing(false)
      }
    } else {
      // Subscribe
      try {
        setIsSubscribing(true)
        const response = await fetch('/api/subscriptions/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ creatorId: profile.walletAddress }),
        })

        if (response.ok) {
          setIsSubscribed(true)
        } else if (response.status === 401) {
          alert('Please connect your wallet to subscribe')
        } else {
          const data = await response.json()
          alert(data.error || 'Failed to subscribe')
        }
      } catch (error) {
        console.error('Subscribe failed:', error)
        alert('Failed to subscribe')
      } finally {
        setIsSubscribing(false)
      }
    }
  }

  return (
    <div className="min-h-screen bg-darker">
      {/* Cover Image */}
      <div className="h-64 bg-gradient-to-r from-primary to-blue-600 relative">
        {profile.coverImage && (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="container mx-auto px-4">
        <div className="relative">
          {/* Profile Image */}
          <div className="absolute -top-20">
            {profile.profileImage ? (
              <img
                src={profile.profileImage}
                alt={profile.displayName}
                className="w-32 h-32 rounded-full border-4 border-darker"
              />
            ) : (
              <div className="w-32 h-32 rounded-full border-4 border-darker bg-primary flex items-center justify-center">
                <span className="text-4xl font-bold">
                  {profile.displayName.charAt(0)}
                </span>
              </div>
            )}
          </div>

          {/* Subscribe Button */}
          {profile.isCreator && (
            <div className="flex justify-end pt-4">
              <button
                onClick={handleSubscribe}
                disabled={isSubscribing}
                className={isSubscribed ? 'btn-secondary' : 'btn-primary'}
              >
                {isSubscribing
                  ? 'Processing...'
                  : isSubscribed
                    ? 'Subscribed ✓'
                    : `Subscribe - $${profile.subscriptionPrice}/mo`}
              </button>
            </div>
          )}
        </div>

        {/* Profile Details */}
        <div className="mt-16 mb-8">
          <h1 className="text-2xl font-bold">{profile.displayName}</h1>
          {profile.username && (
            <p className="text-gray-400">@{profile.username}</p>
          )}
          <p className="text-gray-400 text-sm mt-1">
            {walletAddress.slice(0, 8)}...{walletAddress.slice(-8)}
          </p>
          {profile.bio && (
            <p className="mt-4 whitespace-pre-line">{profile.bio}</p>
          )}

          {/* Stats */}
          <div className="flex items-center space-x-8 mt-6">
            <div>
              <p className="text-2xl font-bold">{profile.postCount}</p>
              <p className="text-sm text-gray-400">Posts</p>
            </div>
            <div>
              <p className="text-2xl font-bold">
                {profile.subscriberCount.toLocaleString()}
              </p>
              <p className="text-sm text-gray-400">Subscribers</p>
            </div>
          </div>
        </div>

        {/* Only show content if subscribed */}
        {isSubscribed ? (
          <>
            {/* Tabs */}
            <div className="border-b border-gray-800 mb-8">
              <div className="flex space-x-8">
                <button className="pb-4 border-b-2 border-primary text-primary font-semibold">
                  Posts
                </button>
                <button className="pb-4 text-gray-400 hover:text-white transition-colors">
                  Media
                </button>
                <button className="pb-4 text-gray-400 hover:text-white transition-colors">
                  About
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="max-w-2xl mx-auto pb-8">
              <div className="space-y-6">
                {posts.map((post) => (
                  <PostCard key={post.id} post={post} isSubscribed={isSubscribed} />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Locked Content Message */}
            <div className="max-w-2xl mx-auto pb-8">
              <div className="card p-12 text-center">
                <svg
                  className="w-20 h-20 text-primary mb-6 mx-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
                <h3 className="text-2xl font-bold mb-3">Exclusive Content</h3>
                <p className="text-gray-400 mb-6 max-w-md mx-auto">
                  Subscribe to {profile.displayName || 'this creator'} to unlock their exclusive posts, photos, and videos
                </p>
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{profile.postCount}</p>
                    <p className="text-sm text-gray-400">Posts</p>
                  </div>
                  <div className="h-12 w-px bg-gray-700"></div>
                  <div className="text-center">
                    <p className="text-3xl font-bold text-primary">{profile.subscriberCount.toLocaleString()}</p>
                    <p className="text-sm text-gray-400">Subscribers</p>
                  </div>
                </div>
                <button
                  onClick={handleSubscribe}
                  disabled={isSubscribing}
                  className="btn-primary text-lg px-8"
                >
                  {isSubscribing ? 'Processing...' : `Subscribe for $${profile.subscriptionPrice}/month`}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
