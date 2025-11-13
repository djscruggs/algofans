import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { requireAuth } from '~/utils/session.server'
import { db } from '~/utils/db.server'

export const Route = createAPIFileRoute('/api/messages/send')({
  POST: async ({ request }) => {
    try {
      const session = await requireAuth()
      const body = await request.json()
      const { receiverId, content } = body

      if (!receiverId || !content) {
        return json({ error: 'Missing required fields' }, { status: 400 })
      }

      // Verify receiver exists
      const receiver = await db.user.findUnique({
        where: { id: receiverId },
      })

      if (!receiver) {
        return json({ error: 'Receiver not found' }, { status: 404 })
      }

      // Create message
      const message = await db.message.create({
        data: {
          senderId: session.userId,
          receiverId,
          content,
        },
        include: {
          sender: {
            select: {
              id: true,
              walletAddress: true,
              username: true,
              displayName: true,
              profileImage: true,
            },
          },
          receiver: {
            select: {
              id: true,
              walletAddress: true,
              username: true,
              displayName: true,
              profileImage: true,
            },
          },
        },
      })

      return json({
        id: message.id,
        content: message.content,
        isRead: message.isRead,
        createdAt: message.createdAt.toISOString(),
        sender: message.sender,
        receiver: message.receiver,
      })
    } catch (error) {
      console.error('Send message error:', error)
      if (error instanceof Error && error.message === 'Unauthorized') {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }
      return json({ error: 'Failed to send message' }, { status: 500 })
    }
  },
})
