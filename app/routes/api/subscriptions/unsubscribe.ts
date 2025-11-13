import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { requireAuth } from '~/utils/session.server'
import { db } from '~/utils/db.server'

export const Route = createAPIFileRoute('/api/subscriptions/unsubscribe')({
  POST: async ({ request }) => {
    try {
      const session = await requireAuth()
      const body = await request.json()
      const { creatorId } = body

      if (!creatorId) {
        return json({ error: 'Creator ID is required' }, { status: 400 })
      }

      // Find subscription
      const subscription = await db.subscription.findUnique({
        where: {
          userId_creatorId: {
            userId: session.userId,
            creatorId,
          },
        },
      })

      if (!subscription) {
        return json({ error: 'Not subscribed' }, { status: 404 })
      }

      // Deactivate subscription
      await db.subscription.update({
        where: { id: subscription.id },
        data: {
          isActive: false,
          endDate: new Date(),
        },
      })

      return json({ success: true })
    } catch (error) {
      console.error('Unsubscribe error:', error)
      if (error instanceof Error && error.message === 'Unauthorized') {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }
      return json({ error: 'Failed to unsubscribe' }, { status: 500 })
    }
  },
})
