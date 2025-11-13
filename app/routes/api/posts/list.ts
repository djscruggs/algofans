import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tantml:start/api'
import { db } from '~/utils/db.server'
import { getSession } from '~/utils/session.server'

export const Route = createAPIFileRoute('/api/posts/list')({
  GET: async ({ request }) => {
    try {
      const url = new URL(request.url)
      const userId = url.searchParams.get('userId')
      const limit = parseInt(url.searchParams.get('limit') || '20')
      const offset = parseInt(url.searchParams.get('offset') || '0')

      const session = await getSession()

      const posts = await db.post.findMany({
        where: userId ? { userId } : undefined,
        include: {
          user: {
            select: {
              id: true,
              walletAddress: true,
              username: true,
              displayName: true,
              profileImage: true,
            },
          },
          _count: {
            select: {
              likes: true,
              comments: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
        take: limit,
        skip: offset,
      })

      // Check if current user has liked each post
      let userLikes: string[] = []
      if (session) {
        const likes = await db.like.findMany({
          where: {
            userId: session.userId,
            postId: { in: posts.map((p) => p.id) },
          },
          select: { postId: true },
        })
        userLikes = likes.map((l) => l.postId)
      }

      return json(
        posts.map((post) => ({
          id: post.id,
          content: post.content,
          mediaUrls: post.mediaUrls,
          mediaType: post.mediaType,
          isLocked: post.isLocked,
          price: post.price,
          createdAt: post.createdAt.toISOString(),
          user: post.user,
          likes: post._count.likes,
          comments: post._count.comments,
          isLiked: userLikes.includes(post.id),
        }))
      )
    } catch (error) {
      console.error('List posts error:', error)
      return json({ error: 'Failed to list posts' }, { status: 500 })
    }
  },
})
