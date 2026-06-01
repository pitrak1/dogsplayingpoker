import '@testing-library/jest-dom/vitest'

// Cookies are weird because when setting document.cookie, you're actually appending
// each cookie can only be removed with max-age=0 or expires=<past date>
export const clearAllCookies = () => {
  document.cookie.split(';').forEach((c) => {
    const name = c.split('=')[0].trim()
    document.cookie = `${name}=; path=/; max-age=0`
  })
}