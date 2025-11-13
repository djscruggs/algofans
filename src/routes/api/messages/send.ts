import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { requireCompleteProfile } from '~/utils/profile.server'
import { db } from '~/utils/db.server'

export const Route = createFileRoute('/api/messages/send')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const user = await requireCompleteProfile()
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
              senderId: user.id,
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
      if (error instanceof Error && error.message === 'Profile incomplete') {
        return json({ error: 'Profile incomplete', requiresProfile: true }, { status: 403 })
      }
      return json({ error: 'Failed to send message' }, { status: 500 })
    }
      },
    },
  },
})
