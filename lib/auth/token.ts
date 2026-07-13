const TOKEN_KEY = 'token'

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(
    new RegExp('(?:^|; )' + name + '=([^;]*)'),
  )
  return match ? decodeURIComponent(match[1]) : null
}

export function getToken(): string | null {
  return readCookie(TOKEN_KEY)
}

export function setToken(token: string): void {
  if (typeof document === 'undefined') return
  document.cookie = `${TOKEN_KEY}=${encodeURIComponent(token)}; path=/; SameSite=Lax`
}

export function clearToken(): void {
  if (typeof document === 'undefined') return
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`
}
