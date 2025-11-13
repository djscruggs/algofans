import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'

export const Route = createFileRoute('/explore')({
  component: Explore,
})

// Mock creators data
const mockCreators = [
  {
    walletAddress: 'ALGO1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    displayName: 'Sarah Johnson',
    username: 'sarahj',
    profileImage: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300',
    coverImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?w=800',
    bio: 'Artist & Content Creator 🎨',
    subscriptionPrice: 9.99,
    subscriberCount: 1234,
  },
  {
    walletAddress: 'ALGO9876543210ZYXWVUTSRQPONMLKJIHGFEDCBA',
    displayName: 'Alex Rivera',
    username: 'alexr',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    coverImage: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800',
    bio: 'Photographer & Filmmaker 📸',
    subscriptionPrice: 14.99,
    subscriberCount: 2567,
  },
  {
    walletAddress: 'ALGO5555555555MNOPQRSTUVWXYZABCDEFGHIJKL',
    displayName: 'Emma Watson',
    username: 'emmaw',
    profileImage: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300',
    coverImage: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800',
    bio: 'Fitness Coach & Wellness Expert 💪',
    subscriptionPrice: 12.99,
    subscriberCount: 3456,
  },
  {
    walletAddress: 'ALGO7777777777PQRSTUVWXYZABCDEFGHIJKLMNO',
    displayName: 'Michael Chen',
    username: 'michaelc',
    profileImage: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300',
    coverImage: 'https://images.unsplash.com/photo-1511367461989-f85a21fda167?w=800',
    bio: 'Music Producer & DJ 🎵',
    subscriptionPrice: 19.99,
    subscriberCount: 4321,
  },
]

function Explore() {
  const [creators] = useState(mockCreators)
  const [searchQuery, setSearchQuery] = useState('')

  const filteredCreators = creators.filter(
    (creator) =>
      creator.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      creator.bio?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-darker py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Explore Creators</h1>
          <div className="max-w-xl">
            <input
              type="text"
              placeholder="Search creators..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input w-full"
            />
          </div>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator) => (
            <Link
              key={creator.walletAddress}
              to={`/profile/${creator.walletAddress}`}
              className="card overflow-hidden hover:border-primary transition-colors"
            >
              {/* Cover Image */}
              <div className="h-32 bg-gradient-to-r from-primary to-blue-600 relative">
                {creator.coverImage && (
                  <img
                    src={creator.coverImage}
                    alt="Cover"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              {/* Profile Info */}
              <div className="p-4 relative">
                {/* Profile Image */}
                <div className="absolute -top-12 left-4">
                  {creator.profileImage ? (
                    <img
                      src={creator.profileImage}
                      alt={creator.displayName}
                      className="w-20 h-20 rounded-full border-4 border-dark"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full border-4 border-dark bg-primary flex items-center justify-center">
                      <span className="text-2xl font-bold">
                        {creator.displayName.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="mt-10">
                  <h3 className="text-lg font-bold">{creator.displayName}</h3>
                  {creator.username && (
                    <p className="text-sm text-gray-400">@{creator.username}</p>
                  )}
                  {creator.bio && (
                    <p className="text-sm text-gray-300 mt-2">{creator.bio}</p>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-800">
                    <div>
                      <p className="text-xs text-gray-400">Subscribers</p>
                      <p className="font-semibold">
                        {creator.subscriberCount.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Per Month</p>
                      <p className="font-semibold text-primary">
                        ${creator.subscriptionPrice}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Empty State */}
        {filteredCreators.length === 0 && (
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold mb-2">No creators found</h3>
            <p className="text-gray-400">Try adjusting your search</p>
          </div>
        )}
      </div>
    </div>
  )
}
