import { User } from '@/types/user'

// At zoom 0, 1 pixel represents this many meters at the equator
const EARTH_CIRCUMFERENCE_CONSTANT = 156543.03392

const MILES_TO_METERS = 1609.34

// This is the correction to the "1 pixel = x meters" number from above
// Because we're using a Mercator projection, the number of meters per pixel will get lower further from equator
// This is because the circumference away from the poles decreases but our map width stay the same
const getLatitudeCoefficient = (latitude: number) => {
  return Math.cos(latitude * Math.PI / 180)
}

// Every zoom level doubles the number of pixels
// With higher zoom, every pixel is covering fewer meters, m/px goes down
const getZoomCoefficient = (zoom: number) => {
  return Math.pow(2, zoom)
}

export const milesToPixels = (miles: number, latitude: number, zoom: number) => {
  const metersPerPixel = EARTH_CIRCUMFERENCE_CONSTANT * getLatitudeCoefficient(latitude) / getZoomCoefficient(zoom)
  const meters = miles * MILES_TO_METERS
  return meters / metersPerPixel
}

// Creates an array mapping zoom level to miles/px for the particular latitude and mile range
export const getCircleStops = (miles: number, latitude: number): [number, number][] =>
  Array.from({ length: 20 }, (_, i) => [i, milesToPixels(miles, latitude, i)])