import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { requireAuth } from '~/utils/session.server'
import { db } from '~/utils/db.server'

export const Route = createAPIFileRoute('/api/messages/$userId')({
  GET: async ({ params }) => {
    try {
      const session = await requireAuth()
      const { userId: otherUserId } = params

      // Get messages between current user and other user
      const messages = await db.message.findMany({
        where: {
          OR: [
            { senderId: session.userId, receiverId: otherUserId },
            { senderId: otherUserId, receiverId: session.userId },
          ],
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
        },
        orderBy: {
          createdAt: 'asc',
        },
      })

      // Mark received messages as read
      await db.message.updateMany({
        where: {
          senderId: otherUserId,
          receiverId: session.userId,
          isRead: false,
        },
        data: {
          isRead: true,
        },
      })

      return json(
        messages.map((message) => ({
          id: message.id,
          content: message.content,
          isRead: message.isRead,
          createdAt: message.createdAt.toISOString(),
          sender: message.sender,
          isMine: message.senderId === session.userId,
        }))
      )
    } catch (error) {
      console.error('Get messages error:', error)
      if (error instanceof Error && error.message === 'Unauthorized') {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }
      return json({ error: 'Failed to get messages' }, { status: 500 })
    }
  },
})
