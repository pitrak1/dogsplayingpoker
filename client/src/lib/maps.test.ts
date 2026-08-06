import { describe, it, expect } from 'vitest'
import {
  milesToPixels,
  getCircleStops,
  metersToMiles,
} from './maps'

describe('milesToPixels', () => {
  it('returns more pixels at higher zoom levels', () => {
    const lowZoom = milesToPixels(5, 41.88, 5)
    const highZoom = milesToPixels(5, 41.88, 15)
    expect(highZoom).toBeGreaterThan(lowZoom)
  })

  it('adjusts for latitude (Mercator)', () => {
    const equator = milesToPixels(5, 0, 10)
    const polar = milesToPixels(5, 60, 10)
    expect(polar).toBeGreaterThan(equator)
  })
})

describe('getCircleStops', () => {
  it('produces an array of 20 stops', () => {
    expect(getCircleStops(5, 41.88)).toHaveLength(20)
  })

  it('contains the expected pixel value for a given zoom level', () => {
    const stops = getCircleStops(5, 41.88)
    const [zoom, pixels] = stops[10]
    expect(zoom).toBe(10)
    expect(pixels).toBeCloseTo(milesToPixels(5, 41.88, 10))
  })

  it('increases pixel size as zoom increases', () => {
    const stops = getCircleStops(5, 41.88)
    expect(stops[10][1]).toBeGreaterThan(stops[0][1])
  })
})

describe('metersToMiles', () => {
  it('converts 1609.34 meters to ~1 mile', () => {
    expect(metersToMiles(1609.34)).toBeCloseTo(1)
  })
})