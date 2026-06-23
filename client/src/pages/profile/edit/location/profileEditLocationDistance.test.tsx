import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { ProfileEditLocationDistance } from './profileEditLocationDistance'
import { renderWithProviders } from '@/test/wrapper'
import { mockAuthContext } from '@/test/mocks'
import mapboxgl from 'mapbox-gl'

describe('profileEditLocationDistance', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockAuthContext()
  })

  it('map is blocked if no generated coordinates are given', async () => {
    renderWithProviders(<ProfileEditLocationDistance 
      generatedCoordinates={null}
      distance={3} 
      onDistanceChange={vi.fn()} 
    />)
    expect(screen.getByText(/generate a location/i)).toBeInTheDocument()
  })

  it('map is not blocked if generated coordinates are given', async () => {
    renderWithProviders(<ProfileEditLocationDistance 
      generatedCoordinates={new mapboxgl.LngLat(1, 2)}
      distance={3} 
      onDistanceChange={vi.fn()} 
    />)    
    expect(screen.queryByText(/generate a location/i)).not.toBeInTheDocument()
  })
})