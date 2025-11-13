import { getWebRequest } from 'vinxi/http'
import { getCookie, setCookie, deleteCookie } from 'vinxi/http'

export interface SessionData {
  walletAddress: string
  userId: string
}

const SESSION_COOKIE_NAME = 'algofans_session'
const SESSION_SECRET = process.env.SESSION_SECRET || 'dev-secret-change-in-production'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

// Simple session encoding/decoding (in production, use proper encryption)
function encodeSession(data: SessionData): string {
  return Buffer.from(JSON.stringify(data)).toString('base64')
}

function decodeSession(encoded: string): SessionData | null {
  try {
    const decoded = Buffer.from(encoded, 'base64').toString('utf-8')
    return JSON.parse(decoded)
  } catch {
    return null
  }
}

export async function createSession(data: SessionData) {
  const encoded = encodeSession(data)

  setCookie(SESSION_COOKIE_NAME, encoded, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  })

  return encoded
}

export async function getSession(): Promise<SessionData | null> {
  const cookie = getCookie(SESSION_COOKIE_NAME)

  if (!cookie) {
    return null
  }

  return decodeSession(cookie)
}

export async function destroySession() {
  deleteCookie(SESSION_COOKIE_NAME)
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession()

  if (!session) {
    throw new Error('Unauthorized')
  }

  return session
}
