import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { getSession } from '~/utils/session.server'
import { db } from '~/utils/db.server'

export const Route = createFileRoute('/api/auth/me')({
  server: {
    handlers: {
      GET: async () => {
        try {
          const session = await getSession()

          if (!session) {
            return json({ error: 'Not authenticated' }, { status: 401 })
          }

          const user = await db.user.findUnique({
            where: { id: session.userId },
          })

          if (!user) {
            return json({ error: 'User not found' }, { status: 404 })
          }

          return json({
            id: user.id,
            walletAddress: user.walletAddress,
            username: user.username,
            displayName: user.displayName,
            profileImage: user.profileImage,
            isCreator: user.isCreator,
          })
        } catch (error) {
          console.error('Get user error:', error)
          return json({ error: 'Failed to get user' }, { status: 500 })
        }
      },
    },
  },
})
