export type AuthRole = 'ADMIN' | 'MODERATOR' | 'USER'

function base64UrlDecode(value: string): string {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  if (typeof window === 'undefined') {
    return Buffer.from(base64, 'base64').toString('utf-8')
  }
  return atob(base64)
}

function parseJwtPayload<T>(token: string): T | null {
  const parts = token.split('.')
  if (parts.length !== 3) {
    return null
  }

  try {
    const decoded = base64UrlDecode(parts[1])
    return JSON.parse(decoded) as T
  } catch {
    return null
  }
}

function normalizeRole(value: unknown): AuthRole | undefined {
  if (typeof value === 'string') {
    const normalized = value.toUpperCase().replace(/^ROLE_/, '')
    if (normalized === 'ADMIN' || normalized === 'MODERATOR' || normalized === 'USER') {
      return normalized as AuthRole
    }
    return undefined
  }

  if (Array.isArray(value) && value.length > 0) {
    const candidate = value.find((item) => typeof item === 'string')
    return normalizeRole(candidate)
  }

  return undefined
}

export function getRoleFromJwt(token: string): AuthRole | undefined {
  const payload = parseJwtPayload<{
    role?: unknown
    roles?: unknown
    authority?: unknown
    authorities?: unknown
    scope?: unknown
  }>(token)

  if (!payload) {
    return undefined
  }

  return (
    normalizeRole(payload.role) ||
    normalizeRole(payload.roles) ||
    normalizeRole(payload.authority) ||
    normalizeRole(payload.authorities) ||
    normalizeRole(payload.scope)
  )
}
