import { useEffect } from 'react'
import { useLocation } from 'react-router'

export function ScrollToHash() {
  // hash is the part of the URL after the #, including the # itself
  const { pathname, hash, key, search } = useLocation()

  // key is a unique string that changes every time the location changes, i.e. every visit
  // If the user navigates to a page like `/privacy#communication` and then scrolls up to click that link again,
  // the pathname and hash would be the same, but because it's a new "visit", a new key will be generated
  // In that circumstance, we want to scroll back to the right part of the page, so we include key here
  // Technically, pathname and hash aren't even necessary here, but it's better practice
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname, hash, key, search])

  return null
}