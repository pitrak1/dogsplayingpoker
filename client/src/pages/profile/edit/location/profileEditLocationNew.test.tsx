import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen } from '@testing-library/react'
import { ProfileEditLocationNew } from './profileEditLocationNew'
import { renderWithProviders } from '@/test/wrapper'
import { mockAuthContext } from '@/test/mocks'
import mapboxgl from 'mapbox-gl'

describe('profileEditLocationNew', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
    mockAuthContext()
  })

  it('map is blocked if no search coordinates are given', async () => {
    renderWithProviders(<ProfileEditLocationNew coordinates={null} onSearchSubmit={vi.fn()} />)
    expect(screen.getByText(/select a location/i)).toBeInTheDocument()
  })

  it('map is not blocked if search coordinates are given', async () => {
    renderWithProviders(<ProfileEditLocationNew coordinates={new mapboxgl.LngLat(1, 2)} onSearchSubmit={vi.fn()} />)
    expect(screen.queryByText(/select a location/i)).not.toBeInTheDocument()
  })
})