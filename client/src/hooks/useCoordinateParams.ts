import { useSearchParams } from 'react-router'
import type { MapPosition } from 'dogsplayingpoker-shared/common'
import { boundsFromMap } from '@/lib/maps'

export function useCoordinateParams(initial: MapPosition) {
  const [searchUrlParams, setSearchUrlParams] = useSearchParams()

  const latitude = parseFloat(searchUrlParams.get('lat') ?? initial.lat.toString())
  const longitude = parseFloat(searchUrlParams.get('lng') ?? initial.lng.toString())
  const zoom = parseFloat(searchUrlParams.get('zoom') ?? initial.zoom.toString())
  const mapPosition = { lat: latitude, lng: longitude, zoom } as MapPosition

  const setParamsFromMap = (map: mapboxgl.Map) => {
    const bounds = boundsFromMap(map)
    const zoom = map.getZoom()

    setSearchUrlParams(
      {
        lat: Number(bounds.centerLat).toFixed(6),
        lng: Number(bounds.centerLng).toFixed(6),
        zoom: zoom.toFixed(2),
      },
      { replace: true },
    )
  }

  return { 
    mapPosition,
    setParamsFromMap
  }
}