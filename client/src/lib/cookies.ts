export const setCookie = (name: string, value: string, maxAge: number) => {
  document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict`
}

export const getCookie = (name: string): string | null => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`))
  return match ? match[2] : null
}

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; path=/; max-age=0`
}