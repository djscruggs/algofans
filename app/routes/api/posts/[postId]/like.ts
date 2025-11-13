import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { requireAuth } from '~/utils/session.server'
import { db } from '~/utils/db.server'

export const Route = createAPIFileRoute('/api/posts/$postId/like')({
  POST: async ({ params }) => {
    try {
      const session = await requireAuth()
      const { postId } = params

      // Check if already liked
      const existingLike = await db.like.findUnique({
        where: {
          userId_postId: {
            userId: session.userId,
            postId,
          },
        },
      })

      if (existingLike) {
        // Unlike
        await db.like.delete({
          where: { id: existingLike.id },
        })

        return json({ liked: false })
      } else {
        // Like
        await db.like.create({
          data: {
            userId: session.userId,
            postId,
          },
        })

        return json({ liked: true })
      }
    } catch (error) {
      console.error('Like post error:', error)
      if (error instanceof Error && error.message === 'Unauthorized') {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }
      return json({ error: 'Failed to like post' }, { status: 500 })
    }
  },
})
