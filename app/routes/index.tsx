import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { PostCard } from '~/components/PostCard'

export const Route = createFileRoute('/')({
  component: Home,
})

// Mock data for demonstration
const mockPosts = [
  {
    id: '1',
    user: {
      walletAddress: 'ALGO1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      displayName: 'Sarah Johnson',
      username: 'sarahj',
      profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    },
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
    user: {
      walletAddress: 'ALGO9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA',
      displayName: 'Alex Rivera',
      username: 'alexr',
      profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    },
    content: 'Behind the scenes of my latest photoshoot 📸',
    mediaUrls: ['https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800'],
    mediaType: 'image',
    isLocked: true,
    createdAt: new Date(Date.now() - 3600000).toISOString(),
    likes: 567,
    comments: 89,
  },
  {
    id: '3',
    user: {
      walletAddress: 'ALGO5555555555MNOPQRSTUVWXYZABCDEFGHIJKL',
      displayName: 'Emma Watson',
      username: 'emmaw',
      profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150',
    },
    content: 'New workout routine dropping soon! Stay tuned 💪',
    mediaUrls: ['https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800'],
    mediaType: 'image',
    isLocked: false,
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    likes: 892,
    comments: 134,
  },
]

function Home() {
  const [posts] = useState(mockPosts)

  return (
    <div className="min-h-screen bg-darker py-8">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Welcome Section */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Welcome to <span className="text-primary">Algo</span>Fans
          </h1>
          <p className="text-gray-400 text-lg">
            Decentralized content platform powered by Algorand
          </p>
        </div>

        {/* Feed */}
        <div className="space-y-6">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} isSubscribed={false} />
          ))}
        </div>

        {/* Empty State */}
        {posts.length === 0 && (
          <div className="text-center py-16">
            <svg
              className="w-24 h-24 mx-auto text-gray-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
            <p className="text-gray-400">Follow creators to see their content here</p>
          </div>
        )}
      </div>
    </div>
  )
}
