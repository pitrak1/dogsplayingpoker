import type { FullUser } from 'dogsplayingpoker-shared/user'
import { getCssVar } from './cssVars'
import { createRoot } from 'react-dom/client'
import type { Root } from 'react-dom/client'
import { theme } from '@/styles/theme'
import { MantineProvider } from '@mantine/core'
import { UserAvatar } from '@/components/userAvatar'
import mapboxgl from 'mapbox-gl'

// At zoom 0, 1 pixel represents this many meters at the equator
const EARTH_CIRCUMFERENCE_CONSTANT = 78271.51696

const MILES_TO_METERS = 1609.34

// This is the correction to the "1 pixel = x meters" number from above
// Because we're using a Mercator projection, the number of meters per pixel will get lower further from equator
// This is because the circumference away from the poles decreases but our map width stay the same
const getLatitudeCoefficient = (latitude: number) => {
  return Math.cos((latitude * Math.PI) / 180)
}

// Every zoom level doubles the number of pixels
// With higher zoom, every pixel is covering fewer meters, m/px goes down
const getZoomCoefficient = (zoom: number) => {
  return Math.pow(2, zoom)
}

export const milesToPixels = (miles: number, latitude: number, zoom: number) => {
  const metersPerPixel =
    (EARTH_CIRCUMFERENCE_CONSTANT * getLatitudeCoefficient(latitude)) / getZoomCoefficient(zoom)
  const meters = miles * MILES_TO_METERS
  return meters / metersPerPixel
}

export const renderUserMarker = (root: Root, user: FullUser, size: number, onClick: () => void) => {
  root.render(
    <MantineProvider theme={theme}>
      <UserAvatar user={user} size={size} onClick={onClick} />
    </MantineProvider>
  )
}

export const addUserMarker = (
  map: mapboxgl.Map,
  user: FullUser,
  onClick: () => void
): { marker: mapboxgl.Marker, root: Root } => {
  const container = document.createElement('div')
  const root = createRoot(container)
  renderUserMarker(root, user, 36, onClick)

  const marker = new mapboxgl.Marker({ element: container })
    .setLngLat([user.location!.x, user.location!.y])
    .addTo(map)

  return { marker, root }
}

// Creates an array mapping zoom level to miles/px for the particular latitude and mile range
export const getCircleStops = (miles: number, latitude: number): [number, number][] =>
  Array.from({ length: 20 }, (_, i) => [i, milesToPixels(miles, latitude, i)])

export const addUserRange = (map: mapboxgl.Map, user: FullUser) => {
  if (!user.radiusMiles || user.radiusMiles === 0 || !user.location) return
  
  const lat = user.location.y
  const lng = user.location.x
  const radius = user.radiusMiles

  const sourceId = `range-${lat}+${lng}+${radius}`
  const color = getCssVar('color-primary')
  map.addSource(sourceId, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [lng, lat] },
      properties: {},
    },
  })
  map.addLayer({
    id: `${sourceId}-fill`,
    type: 'circle',
    source: sourceId,
    paint: {
      'circle-radius': { stops: getCircleStops(radius, lat), base: 2 },
      'circle-color': color,
      'circle-opacity': 0.2,
      'circle-stroke-color': color,
      'circle-stroke-width': 1,
      'circle-stroke-opacity': 0.8,
    },
  })
  return sourceId
}

export const removeUserRange = (map: mapboxgl.Map, sourceId?: string | null) => {
  if (!sourceId) return
  if (map.getLayer(`${sourceId}-fill`)) map.removeLayer(`${sourceId}-fill`)
  if (map.getSource(sourceId)) map.removeSource(sourceId)
}

export const metersToMiles = (meters: number) => {
  return meters * 0.000621371
}

export const boundsFromMap = (map: mapboxgl.Map) => {
  const bounds = map.getBounds()!
  const center = map.getCenter()
  return {
    swLat: bounds.getSouth(),
    swLng: bounds.getWest(),
    neLat: bounds.getNorth(),
    neLng: bounds.getEast(),
    centerLat: center.lat,
    centerLng: center.lng,
  }
}

const EARTH_RADIUS_MILES = 3958.8

export const randomPointWithin = (
  lat: number,
  lng: number,
  radiusMiles: number,
) => {
  // random angle in radians
  const angle = Math.random() * 2 * Math.PI

  // random distance — sqrt for uniform area distribution
  const distance = Math.sqrt(Math.random()) * radiusMiles

  // convert distance to lat/lng offset
  const latOffset = (distance / EARTH_RADIUS_MILES) * (180 / Math.PI)
  const lngOffset =
    (distance / EARTH_RADIUS_MILES) * (180 / Math.PI) /
    Math.cos(lat * Math.PI / 180)

  return {
    lat: lat + latOffset * Math.cos(angle),
    lng: lng + lngOffset * Math.sin(angle),
  }
}