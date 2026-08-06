import { useEffect, useRef } from 'react'
import { FullUser } from 'dogsplayingpoker-shared/user'
import type { Root } from 'react-dom/client'
import { addUserMarker } from '@/lib/maps'

type Props = {
  mapRef: React.RefObject<mapboxgl.Map | null>
  users: FullUser[] | FullUser
  onClickMarker?: (user: FullUser) => void
  onHoverMarker?: (user: FullUser | null) => void
}

export const useMapboxMapMarkers = ({
  mapRef,
  users,
  onClickMarker,
  onHoverMarker
}: Props) => {
  const markersRef = useRef(new Map<number, mapboxgl.Marker>())
  const markerRootsRef = useRef<Map<number, Root>>(new Map())

  // Handle adding and compiling user markers
  useEffect(() => {
    if (!mapRef.current) return
    const map = mapRef.current!
    const markers = markersRef.current
    const roots = markerRootsRef.current

    const registerUserMarker = (user: FullUser) => {
      if (!user.location) return

      // Render the UserAvatar component and attach the onClick handler
      const onClick = () => onClickMarker?.(user)
      const { marker, root } = addUserMarker(map, user, onClick)

      // Attach onHover handler
      if (onHoverMarker) {
        const el = marker.getElement()
        el.addEventListener('mouseenter', () => onHoverMarker(user))
        el.addEventListener('mouseleave', () => onHoverMarker(null))
      }

      // Register both the map marker and the react root for the marker
      roots.set(user.id, root)
      markers.set(user.id, marker)
    }

    if (Array.isArray(users)) {
      users.forEach(registerUserMarker)
    } else {
      registerUserMarker(users)
    }

    return () => {
      markers.forEach((m) => m.remove())
      markers.clear()
      roots.clear()
    }
  }, [mapRef, users, onClickMarker, onHoverMarker])

  return { markerRootsRef }
}
