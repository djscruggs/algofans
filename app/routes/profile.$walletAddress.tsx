import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PostCard } from '~/components/PostCard'

export const Route = createFileRoute('/profile/$walletAddress')({
  component: Profile,
})

function Profile() {
  const { walletAddress } = Route.useParams()
  const [isSubscribed, setIsSubscribed] = useState(false)

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

  const handleSubscribe = async () => {
    // TODO: Implement subscription logic
    setIsSubscribed(!isSubscribed)
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
                className={isSubscribed ? 'btn-secondary' : 'btn-primary'}
              >
                {isSubscribed ? 'Subscribed ✓' : `Subscribe - $${profile.subscriptionPrice}/mo`}
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
      </div>
    </div>
  )
}
