import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { destroySession } from '~/utils/session.server'

export const Route = createAPIFileRoute('/api/auth/logout')({
  POST: async () => {
    await destroySession()
    return json({ success: true })
  },
})
