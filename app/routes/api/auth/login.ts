import { json } from '@tanstack/start'
import { createAPIFileRoute } from '@tanstack/start/api'
import { db } from '~/utils/db.server'
import { createSession } from '~/utils/session.server'
import { verifyAlgorandSignature, verifyAuthMessage } from '~/utils/algorand.server'

export const Route = createAPIFileRoute('/api/auth/login')({
  POST: async ({ request }) => {
    try {
      const body = await request.json()
      const { walletAddress, message, signature } = body

      if (!walletAddress || !message || !signature) {
        return json({ error: 'Missing required fields' }, { status: 400 })
      }

      // Verify message format and timestamp
      const messageCheck = verifyAuthMessage(message)
      if (!messageCheck.valid) {
        return json({ error: 'Invalid or expired message' }, { status: 400 })
      }

      // Convert signature to Uint8Array
      const signatureBytes = new Uint8Array(
        signature.split(',').map((s: string) => parseInt(s))
      )
      const messageBytes = new TextEncoder().encode(message)

      // Verify the signature
      const isValid = verifyAlgorandSignature(
        walletAddress,
        messageBytes,
        signatureBytes
      )

      if (!isValid) {
        return json({ error: 'Invalid signature' }, { status: 401 })
      }

      // Find or create user
      let user = await db.user.findUnique({
        where: { walletAddress },
      })

      if (!user) {
        user = await db.user.create({
          data: {
            walletAddress,
            isCreator: false,
          },
        })
      }

      // Create session
      await createSession({
        walletAddress: user.walletAddress,
        userId: user.id,
      })

      return json({
        id: user.id,
        walletAddress: user.walletAddress,
        username: user.username,
        displayName: user.displayName,
        profileImage: user.profileImage,
        isCreator: user.isCreator,
      })
    } catch (error) {
      console.error('Login error:', error)
      return json({ error: 'Authentication failed' }, { status: 500 })
    }
  },
})
