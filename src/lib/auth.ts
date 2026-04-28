// ─── Auth Business Logic ─────────────────────────────────────────────────────

import { nanoid } from 'nanoid'
import type { User, Session } from '@/types/auth'
import { AUTH_ERRORS } from './constants'
import { getUsers, saveUsers, saveSession, clearSession } from './storage'

export type AuthResult =
  | { ok: true; session: Session }
  | { ok: false; error: string }

// ─── Sign Up ─────────────────────────────────────────────────────────────────

export function signUp(email: string, password: string): AuthResult {
  const trimmedEmail = email.trim().toLowerCase()
  const users = getUsers()

  if (!trimmedEmail) return { ok: false, error: AUTH_ERRORS.EMAIL_REQUIRED }
  if (!password)      return { ok: false, error: AUTH_ERRORS.PASSWORD_REQUIRED }

  const duplicate = users.find((u) => u.email === trimmedEmail)
  if (duplicate) return { ok: false, error: AUTH_ERRORS.DUPLICATE_EMAIL }

  const newUser: User = {
    id:        nanoid(),
    email:     trimmedEmail,
    password,
    createdAt: new Date().toISOString(),
  }

  saveUsers([...users, newUser])

  const session: Session = { userId: newUser.id, email: newUser.email }
  saveSession(session)

  return { ok: true, session }
}

// ─── Log In ──────────────────────────────────────────────────────────────────

export function logIn(email: string, password: string): AuthResult {
  const trimmedEmail = email.trim().toLowerCase()
  const users = getUsers()

  const user = users.find(
    (u) => u.email === trimmedEmail && u.password === password
  )

  if (!user) return { ok: false, error: AUTH_ERRORS.INVALID_LOGIN }

  const session: Session = { userId: user.id, email: user.email }
  saveSession(session)

  return { ok: true, session }
}

// ─── Log Out ─────────────────────────────────────────────────────────────────

export function logOut(): void {
  clearSession()
}
