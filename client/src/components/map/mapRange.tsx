import { Source, Layer } from 'react-map-gl/mapbox'
import { getCircleStops } from '@/lib/maps'
import { MapPoint } from '@/components/map/mapPoint'
import { User } from '@/types/user'

type Props = {
  user: User
  latitude: number
  longitude: number
  radiusMiles: number
}

export function MapRange({ user, latitude, longitude, radiusMiles }: Props) {
  const geoJSON = {
    type: 'Feature' as const,
    geometry: {
      type: 'Point' as const,
      coordinates: [longitude, latitude],
    },
    properties: {},
  }

  const stops = getCircleStops(radiusMiles, latitude)
  const stringId = user.id.toString()

  return (
    <>
      <MapPoint user={user} latitude={latitude} longitude={longitude} />
      <Source id={stringId} type="geojson" data={geoJSON}>
        <Layer
          id={`${stringId}-fill`}
          type="circle"
          paint={{
            'circle-radius': { stops, base: 2 },
            'circle-color': '#0066cc',
            'circle-opacity': 0.2,
            'circle-stroke-color': '#0066cc',
            'circle-stroke-width': 1,
            'circle-stroke-opacity': 0.8,
          }}
        />
      </Source>
    </>
  )
}