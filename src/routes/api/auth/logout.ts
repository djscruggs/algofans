import { createFileRoute } from '@tanstack/react-router'
import { json } from '@tanstack/react-start'
import { destroySession } from '~/utils/session.server'

export const Route = createFileRoute('/api/auth/logout')({
  server: {
    handlers: {
      POST: async () => {
            await destroySession()
            return json({ success: true })
      },
    },
  },
})
