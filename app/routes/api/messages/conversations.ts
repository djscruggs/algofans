import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { requireAuth } from '~/utils/session.server'
import { db } from '~/utils/db.server'

export const Route = createAPIFileRoute('/api/messages/conversations')({
  GET: async () => {
    try {
      const session = await requireAuth()

      // Get all unique conversations
      const messages = await db.message.findMany({
        where: {
          OR: [
            { senderId: session.userId },
            { receiverId: session.userId },
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
        orderBy: {
          createdAt: 'desc',
        },
      })

      // Group by conversation partner
      const conversationsMap = new Map()

      for (const message of messages) {
        const partnerId =
          message.senderId === session.userId
            ? message.receiverId
            : message.senderId

        if (!conversationsMap.has(partnerId)) {
          const partner =
            message.senderId === session.userId
              ? message.receiver
              : message.sender

          conversationsMap.set(partnerId, {
            partner,
            lastMessage: message,
            unreadCount: 0,
          })
        }

        // Count unread messages
        if (
          message.receiverId === session.userId &&
          !message.isRead
        ) {
          const conv = conversationsMap.get(partnerId)
          conv.unreadCount++
        }
      }

      const conversations = Array.from(conversationsMap.values()).map((conv) => ({
        partner: conv.partner,
        lastMessage: {
          id: conv.lastMessage.id,
          content: conv.lastMessage.content,
          createdAt: conv.lastMessage.createdAt.toISOString(),
          isRead: conv.lastMessage.isRead,
        },
        unreadCount: conv.unreadCount,
      }))

      return json(conversations)
    } catch (error) {
      console.error('Get conversations error:', error)
      if (error instanceof Error && error.message === 'Unauthorized') {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }
      return json({ error: 'Failed to get conversations' }, { status: 500 })
    }
  },
})
