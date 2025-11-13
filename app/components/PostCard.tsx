import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { ProfileSetupModal } from './ProfileSetupModal'

interface PostCardProps {
  post: {
    id: string
    user: {
      walletAddress: string
      displayName?: string
      username?: string
      profileImage?: string
    }
    content?: string
    mediaUrls: string[]
    mediaType?: string
    isLocked: boolean
    price?: number
    createdAt: string
    likes: number
    comments: number
  }
  isSubscribed?: boolean
}

export function PostCard({ post, isSubscribed = false }: PostCardProps) {
  const [liked, setLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(post.likes)
  const [showProfileModal, setShowProfileModal] = useState(false)

  const handleLike = async () => {
    try {
      const response = await fetch(`/api/posts/${post.id}/like`, {
        method: 'POST',
      })

      if (response.ok) {
        const data = await response.json()
        setLiked(!liked)
        setLikesCount(liked ? likesCount - 1 : likesCount + 1)
      } else if (response.status === 403) {
        const data = await response.json()
        if (data.requiresProfile) {
          setShowProfileModal(true)
        }
      } else if (response.status === 401) {
        alert('Please connect your wallet to like posts')
      }
    } catch (error) {
      console.error('Failed to like post:', error)
    }
  }

  const handleProfileComplete = () => {
    setShowProfileModal(false)
    // Retry the like action
    handleLike()
  }

  // All media is locked unless you're subscribed to the creator
  const isMediaVisible = isSubscribed

  return (
    <div className="card overflow-hidden">
      {/* User Info */}
      <div className="p-4 flex items-center space-x-3">
        <Link to={`/profile/${post.user.walletAddress}`}>
          {post.user.profileImage ? (
            <img
              src={post.user.profileImage}
              alt={post.user.displayName || 'Profile'}
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
              <span className="font-semibold">
                {(post.user.displayName || post.user.walletAddress).charAt(0).toUpperCase()}
              </span>
            </div>
          )}
        </Link>
        <div className="flex-1">
          <Link
            to={`/profile/${post.user.walletAddress}`}
            className="font-semibold hover:underline"
          >
            {post.user.displayName || `${post.user.walletAddress.slice(0, 8)}...`}
          </Link>
          {post.user.username && (
            <p className="text-sm text-gray-400">@{post.user.username}</p>
          )}
        </div>
        <span className="text-sm text-gray-400">
          {new Date(post.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Content */}
      {post.content && <div className="px-4 pb-3">{post.content}</div>}

      {/* Media */}
      {post.mediaUrls.length > 0 && (
        <div className="relative">
          {isMediaVisible ? (
            <div className="bg-gray-900">
              {post.mediaType === 'video' ? (
                <video
                  src={post.mediaUrls[0]}
                  controls
                  className="w-full max-h-96 object-contain"
                />
              ) : (
                <img
                  src={post.mediaUrls[0]}
                  alt="Post media"
                  className="w-full max-h-96 object-contain"
                />
              )}
            </div>
          ) : (
            <div className="relative">
              <div className="w-full h-96 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
                <div className="text-center">
                  <svg
                    className="w-16 h-16 text-primary mb-4 mx-auto"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-lg font-semibold mb-2">Subscribe to View</p>
                  <p className="text-sm text-gray-400 mb-4">
                    This creator's content is for subscribers only
                  </p>
                  <Link
                    to={`/profile/${post.user.walletAddress}`}
                    className="btn-primary inline-block"
                  >
                    View Profile & Subscribe
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="p-4 flex items-center space-x-6 border-t border-gray-800">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 transition-colors ${
            liked ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
          }`}
        >
          <svg className="w-6 h-6" fill={liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>{likesCount}</span>
        </button>

        <button className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <span>{post.comments}</span>
        </button>

        <button className="flex items-center space-x-2 text-gray-400 hover:text-primary transition-colors ml-auto">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
            />
          </svg>
        </button>
      </div>

      {/* Profile Setup Modal */}
      <ProfileSetupModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onComplete={handleProfileComplete}
      />
    </div>
  )
}
