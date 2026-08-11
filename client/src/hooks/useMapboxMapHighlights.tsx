import { useEffect, useState, useRef } from 'react'
import { FullUser } from 'dogsplayingpoker-shared/user'
import type { Root } from 'react-dom/client'
import { renderUserMarker, addUserRange, removeUserRange } from '@/lib/maps'

type Props = {
  mapRef: React.RefObject<mapboxgl.Map | null>
  markerRootsRef: React.RefObject<Map<number, Root>>
  users: FullUser[] | FullUser
  onClickMarker?: (user: FullUser) => void
  onHoverMarker?: (user: FullUser | null) => void
}

export const useMapboxMapHighlights = ({
  mapRef,
  markerRootsRef,
  onClickMarker
}: Props) => {
  const [highlightedUser, setHighlightedUser] = useState<FullUser | null>(null)
  const previousHighlightedUserRef = useRef<FullUser | null>(null)

  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current

    // Recall previous highlighted user and update stored value
    const previous = previousHighlightedUserRef.current
    previousHighlightedUserRef.current = highlightedUser ?? null

    // Rerender avatar at increased size for highlighted user
    if (highlightedUser) {
      const root = markerRootsRef.current.get(highlightedUser.id)
      if (root) renderUserMarker(root, highlightedUser, 48, () => onClickMarker?.(highlightedUser))
    }
      
    // Rerender avatar at normal size for previous user
    if (previous) {
      const root = markerRootsRef.current.get(previous.id)
      if (root) renderUserMarker(root, previous, 32, () => onClickMarker?.(previous))
    }
    
    // Add the range for the highlighted user
    let sourceId: string | undefined
    if (highlightedUser) {
      sourceId = addUserRange(map, highlightedUser)
    }

    return () => {
      try {
        removeUserRange(map, sourceId)
      } catch {
        // Map is already town down, no cleanup necessary
      }
    }
  }, [mapRef, markerRootsRef, highlightedUser, onClickMarker])

  return { highlightedUser, onHoverMarker: setHighlightedUser }
}
