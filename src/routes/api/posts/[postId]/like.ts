import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { requireCompleteProfile } from '~/utils/profile.server'
import { db } from '~/utils/db.server'

export const Route = createFileRoute('/api/posts/postId/like')({
  server: {
    handlers: {
      POST: async ({ params }) => {
        try {
          const user = await requireCompleteProfile()
          const { postId } = params

      // Check if already liked
          const existingLike = await db.like.findUnique({
            where: {
              userId_postId: {
                userId: user.id,
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
            userId: user.id,
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
      if (error instanceof Error && error.message === 'Profile incomplete') {
        return json({ error: 'Profile incomplete', requiresProfile: true }, { status: 403 })
      }
      return json({ error: 'Failed to like post' }, { status: 500 })
    }
    },
    },
  },
})
