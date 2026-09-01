export const setCookie = (name: string, value: string, maxAge: number) => {
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Strict`
}

export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  if (!match) return null
  // decodeURIComponent can throw if the cookie value is malformed, and cookies can be hand-edited
  try { return decodeURIComponent(match[2]) } catch { return match[2] }
}

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`
}
