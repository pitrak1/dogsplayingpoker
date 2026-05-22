const COLORS = ['0066cc', 'e8a87c', '85c1e9', '82e0aa', 'bb8fce', 'f1948a', 'f7dc6f', '76d7c4']

// This just generates a hash of the username by using the character codes of the characters in username,
// multiplying by 31 (a prime number), and then truncating back to a 32-bit integer
const hashString = (str: string): number => {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0 // Javascript numbers are 64-bit floating point, and this just forces type conversion
  }
  return Math.abs(hash)
}

export const getAvatarFallback = (username: string | null, size: number) => {
  if (!username) return
  const color = COLORS[hashString(username) % COLORS.length]
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=${color}&color=fff&size=${size}`
}

export const convertImageUrlToSize = (url: string | null, size: number) => {
  if (!url) return
  return url.replace('/upload/', `/upload/w_${size},h_${size},c_fill/`)
}
