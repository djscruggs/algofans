import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { requireAuth } from '~/utils/session.server'
import { db } from '~/utils/db.server'

export const Route = createFileRoute('/api/subscriptions/subscribe')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const session = await requireAuth()
          const body = await request.json()
          const { creatorId } = body

          if (!creatorId) {
            return json({ error: 'Creator ID is required' }, { status: 400 })
          }

      // Check if creator exists
          const creator = await db.user.findUnique({
            where: { id: creatorId },
          })

          if (!creator) {
            return json({ error: 'Creator not found' }, { status: 404 })
          }

          if (!creator.isCreator) {
            return json({ error: 'User is not a creator' }, { status: 400 })
          }

      // Can't subscribe to yourself
          if (session.userId === creatorId) {
            return json({ error: 'Cannot subscribe to yourself' }, { status: 400 })
          }

      // Check if already subscribed
          const existingSub = await db.subscription.findUnique({
            where: {
              userId_creatorId: {
                userId: session.userId,
                creatorId,
      },
        },
      })

      if (existingSub && existingSub.isActive) {
        return json({ error: 'Already subscribed' }, { status: 400 })
      }

      // Create or reactivate subscription
      const subscription = existingSub
        ? await db.subscription.update({
            where: { id: existingSub.id },
            data: {
              isActive: true,
              startDate: new Date(),
              endDate: null,
            },
          })
        : await db.subscription.create({
            data: {
              userId: session.userId,
              creatorId,
              isActive: true,
            },
          })

      return json({
        id: subscription.id,
        creatorId: subscription.creatorId,
        isActive: subscription.isActive,
      })
    } catch (error) {
      console.error('Subscribe error:', error)
      if (error instanceof Error && error.message === 'Unauthorized') {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }
      return json({ error: 'Failed to subscribe' }, { status: 500 })
    }
      },
    },
  },
})
