import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { getSession } from '~/utils/session.server'
import { db } from '~/utils/db.server'

export const Route = createAPIFileRoute('/api/subscriptions/check/$creatorId')({
  GET: async ({ params }) => {
    try {
      const { creatorId } = params
      const session = await getSession()

      if (!session) {
        return json({ isSubscribed: false })
      }

      const subscription = await db.subscription.findUnique({
        where: {
          userId_creatorId: {
            userId: session.userId,
            creatorId,
          },
        },
      })

      return json({
        isSubscribed: subscription?.isActive || false,
      })
    } catch (error) {
      console.error('Check subscription error:', error)
      return json({ error: 'Failed to check subscription' }, { status: 500 })
    }
  },
})
