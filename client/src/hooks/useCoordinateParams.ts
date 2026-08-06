import { useSearchParams } from 'react-router'
import type { MapPosition } from 'dogsplayingpoker-shared/common'

export function useCoordinateParams(initial: MapPosition) {
  const [searchUrlParams, setSearchUrlParams] = useSearchParams()

  const latitude = parseFloat(searchUrlParams.get('lat') ?? initial.lat.toString())
  const longitude = parseFloat(searchUrlParams.get('lng') ?? initial.lng.toString())
  const zoom = parseFloat(searchUrlParams.get('zoom') ?? initial.zoom.toString())
  const mapPosition = { lat: latitude, lng: longitude, zoom } as MapPosition

  const setParams = (lat: number, lng: number, z: number) => {
    setSearchUrlParams(
      {
        lat: Number(lat).toFixed(6),
        lng: Number(lng).toFixed(6),
        zoom: z.toFixed(2),
      },
      { replace: true },
    )
  }

  return { 
    mapPosition,
    setParams
  }
}