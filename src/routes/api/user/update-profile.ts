import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { requireAuth } from '~/utils/session.server'
import { db } from '~/utils/db.server'

export const Route = createFileRoute('/api/user/update-profile')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const session = await requireAuth()
          const body = await request.json()
          const { username, displayName, email, bio, profileImage, coverImage, isCreator, subscriptionPrice } = body

      // Validate username if provided
          if (username !== undefined) {
            if (typeof username !== 'string' || !username.trim()) {
              return json({ error: 'Username is required' }, { status: 400 })
            }

        // Validate username format
            if (!/^[a-zA-Z0-9_]+$/.test(username)) {
              return json({
                error: 'Username can only contain letters, numbers, and underscores'
              }, { status: 400 })
            }

            if (username.length < 3 || username.length > 30) {
              return json({
                error: 'Username must be between 3 and 30 characters'
              }, { status: 400 })
            }

        // Check if username is already taken (by someone else)
            const existingUser = await db.user.findUnique({
              where: { username },
            })

            if (existingUser && existingUser.id !== session.userId) {
              return json({ error: 'Username is already taken' }, { status: 400 })
            }
          }

      // Validate email if provided
          if (email !== undefined && email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            if (!emailRegex.test(email)) {
              return json({ error: 'Invalid email address' }, { status: 400 })
            }
          }

      // Build update data
          const updateData: any = {}

          if (username !== undefined) updateData.username = username.trim()
          if (displayName !== undefined) updateData.displayName = displayName?.trim() || null
          if (email !== undefined) updateData.email = email?.trim() || null
          if (bio !== undefined) updateData.bio = bio?.trim() || null
          if (profileImage !== undefined) updateData.profileImage = profileImage || null
          if (coverImage !== undefined) updateData.coverImage = coverImage || null
          if (isCreator !== undefined) updateData.isCreator = isCreator
          if (subscriptionPrice !== undefined) {
            updateData.subscriptionPrice = subscriptionPrice ? parseFloat(subscriptionPrice) : null
          }

      // Update user
          const user = await db.user.update({
            where: { id: session.userId },
            data: updateData,
          })

          return json({
            id: user.id,
            walletAddress: user.walletAddress,
            username: user.username,
            displayName: user.displayName,
            email: user.email,
            bio: user.bio,
            profileImage: user.profileImage,
            coverImage: user.coverImage,
            isCreator: user.isCreator,
            subscriptionPrice: user.subscriptionPrice,
          })
        } catch (error) {
          console.error('Update profile error:', error)
          if (error instanceof Error && error.message === 'Unauthorized') {
            return json({ error: 'Unauthorized' }, { status: 401 })
          }
          return json({ error: 'Failed to update profile' }, { status: 500 })
        }
      },
    },
  },
})
