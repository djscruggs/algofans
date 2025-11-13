import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { requireAuth } from '~/utils/session.server'
import { db } from '~/utils/db.server'
import { saveUploadedFile, validateFileType, validateFileSize } from '~/utils/uploads.server'

export const Route = createFileRoute('/api/posts/create')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        try {
          const session = await requireAuth()

          const formData = await request.formData()
          const content = formData.get('content') as string
          const isLocked = formData.get('isLocked') === 'true'
          const price = formData.get('price') ? parseFloat(formData.get('price') as string) : null
          const files = formData.getAll('files') as File[]

      // Validate and upload files
          const mediaUrls: string[] = []
          let mediaType: string | null = null

          for (const file of files) {
            if (!(file instanceof File) || !file.size) continue

            if (!validateFileType(file)) {
              return json({ error: 'Invalid file type' }, { status: 400 })
            }

            if (!validateFileSize(file)) {
              return json({ error: 'File too large (max 50MB)' }, { status: 400 })
            }

            const url = await saveUploadedFile(file, session.userId)
            mediaUrls.push(url)

        // Determine media type from first file
            if (!mediaType) {
              mediaType = file.type.startsWith('video/') ? 'video' : 'image'
            }
          }

      // Create post
          const post = await db.post.create({
            data: {
              userId: session.userId,
              content: content || null,
              mediaUrls,
              mediaType,
              isLocked,
              price: price ? parseFloat(price.toFixed(2)) : null,
      },
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
        },
      })

      return json({
        id: post.id,
        content: post.content,
        mediaUrls: post.mediaUrls,
        mediaType: post.mediaType,
        isLocked: post.isLocked,
        price: post.price,
        createdAt: post.createdAt.toISOString(),
        user: post.user,
      })
    } catch (error) {
      console.error('Create post error:', error)
      if (error instanceof Error && error.message === 'Unauthorized') {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }
      return json({ error: 'Failed to create post' }, { status: 500 })
    }
      },
    },
  },
})
