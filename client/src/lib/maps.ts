import { User } from '@/types/user'
import { getCssVar } from './cssVars'
import mapboxgl from 'mapbox-gl'

// At zoom 0, 1 pixel represents this many meters at the equator
const EARTH_CIRCUMFERENCE_CONSTANT = 156543.03392

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

// Creates an array mapping zoom level to miles/px for the particular latitude and mile range
export const getCircleStops = (miles: number, latitude: number): [number, number][] =>
  Array.from({ length: 20 }, (_, i) => [i, milesToPixels(miles, latitude, i)])

export const createMarkerElement = (user: User, onClick: () => void) => {
  const wrapper = document.createElement('div')
  wrapper.className = 'map-view__marker-avatar'
  const inner = document.createElement('div')
  inner.className = 'avatar__marker map-view__marker-avatar-inner'
  if (user.profileImageUrl) inner.style.backgroundImage = `url(${user.profileImageUrl})`
  wrapper.appendChild(inner)
  wrapper.addEventListener('click', onClick)
  return wrapper
}

export const addUserMarker = (map: mapboxgl.Map, user: User, onClick: () => void) =>
  new mapboxgl.Marker({ element: createMarkerElement(user, onClick) })
    .setLngLat([user.longitude!, user.latitude!])
    .addTo(map)

export const addUserRange = (map: mapboxgl.Map, user: User) => {
  const sourceId = `range-${user.id}`
  const color = getCssVar('color-primary')
  map.addSource(sourceId, {
    type: 'geojson',
    data: {
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [user.longitude!, user.latitude!] },
      properties: {},
    },
  })
  map.addLayer({
    id: `${sourceId}-fill`,
    type: 'circle',
    source: sourceId,
    paint: {
      'circle-radius': { stops: getCircleStops(user.radiusMiles!, user.latitude!), base: 2 },
      'circle-color': color,
      'circle-opacity': 0.2,
      'circle-stroke-color': color,
      'circle-stroke-width': 1,
      'circle-stroke-opacity': 0.8,
    },
  })
  return sourceId
}

export const removeUserRange = (map: mapboxgl.Map, sourceId: string) => {
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
