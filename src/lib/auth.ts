import crypto from 'crypto'

/** SHA-256 hash — demo only. Use bcrypt in production. */
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex')
}

/** Read userId from the session cookie value (plain userId for demo). */
export function getUserIdFromCookie(cookieValue: string | undefined): string | null {
  return cookieValue ?? null
}
