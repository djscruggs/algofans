import { useSession } from '@tanstack/react-start/server'

export interface SessionData {
  walletAddress?: string
  userId?: string
}

const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production-min-32-chars!'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export function useAppSession() {
  return useSession<SessionData>({
    name: 'algofans_session',
    password: SESSION_SECRET,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      httpOnly: true,
      maxAge: SESSION_MAX_AGE,
    },
  })
}

export async function createSession(data: SessionData) {
  const session = await useAppSession()
  await session.update(data)
  return session
}

export async function getSession(): Promise<SessionData | null> {
  const session = await useAppSession()
  return session.data || null
}

export async function destroySession() {
  const session = await useAppSession()
  await session.clear()
}

export async function requireAuth(): Promise<SessionData> {
  const session = await useAppSession()

  if (!session.data?.walletAddress || !session.data?.userId) {
    throw new Error('Unauthorized')
  }

  return session.data
}
