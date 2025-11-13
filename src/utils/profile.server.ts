import { getSession } from './session.server'
import { db } from './db.server'

/**
 * Check if user has completed their profile (has a username)
 * Returns user data if profile is complete, throws error otherwise
 */
export async function requireCompleteProfile() {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
  })

  if (!user) {
    throw new Error('User not found')
  }

  if (!user.username) {
    throw new Error('Profile incomplete')
  }

  return user
}

/**
 * Check if user has a username set
 */
export async function hasCompleteProfile(): Promise<boolean> {
  try {
    const session = await getSession()
    if (!session) return false

    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { username: true },
    })

    return !!user?.username
  } catch {
    return false
  }
}
