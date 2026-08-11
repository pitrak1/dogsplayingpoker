import { describe, it, expect, vi, beforeEach } from 'vitest'
import { screen, act } from '@testing-library/react'
import { renderWithProviders } from '@/test/wrapper'
import { PetDisplay } from './petDisplay'
import { makePet } from '@/test/factories'
import { mockAuthContext } from '@/test/mocks'
import { getAvatarFallback } from '@/lib/avatar'

describe('PetDisplay', () => {
  beforeEach(() => {
    vi.restoreAllMocks()
  })

  it('displays age correctly if 0', async () => {
    mockAuthContext()
    const pet = makePet({ age: 0 })
    renderWithProviders(<PetDisplay pet={pet} />)

    const ageElement = await screen.findByText(/less than a year old/i)
    expect(ageElement).toBeInTheDocument()
  })

  it('displays age correctly if 1', async () => {
    mockAuthContext()
    const pet = makePet({ age: 1 })
    renderWithProviders(<PetDisplay pet={pet} />)

    const ageElement = await screen.findByText(/1 year old/i)
    expect(ageElement).toBeInTheDocument()
  })

  it('displays age correctly if greater than 1', async () => {
    mockAuthContext()
    const pet = makePet({ age: 5 })
    renderWithProviders(<PetDisplay pet={pet} />)

    const ageElement = await screen.findByText(/5 years old/i)
    expect(ageElement).toBeInTheDocument()
  })

  it('displays size with user friendly text', async () => {
    mockAuthContext()
    const pet = makePet({ size: 'medium' })
    renderWithProviders(<PetDisplay pet={pet} />)

    const sizeElement = await screen.findByText(/Medium \(35 - 55 lbs\)/i)
    expect(sizeElement).toBeInTheDocument()
  })

  it('renders the pet picture if present', async () => {
    const pet = makePet({ pictureUrl: 'https://example.com/dog.jpg' })
    renderWithProviders(<PetDisplay pet={pet} />)

    const img = await screen.findByRole('img', { name: /picture of/i })
    expect(img).toHaveAttribute('src', 'https://example.com/dog.jpg')
  })

  it('renders a fallback avatar if no picture', async () => {
    const pet = makePet({ pictureUrl: null })
    renderWithProviders(<PetDisplay pet={pet} />)

    const img = await screen.findByRole('img', { name: /picture of/i })
    expect(img).toHaveAttribute('src', getAvatarFallback(pet.name, 128))
  })

  it('does not display notes toggle button for reactivity if no notes are available', async () => {
    mockAuthContext()
    const pet = makePet()
    renderWithProviders(<PetDisplay pet={pet} />)

    const notesToggleButton = await screen.queryByRole('button', { name: /toggle dogs reactivity notes/i })
    expect(notesToggleButton).not.toBeInTheDocument()
  })

  it('displays notes toggle button for reactivity if notes are available', async () => {
    mockAuthContext()
    const pet = makePet({ dogReactivityNotes: 'Some notes about dog reactivity' })
    renderWithProviders(<PetDisplay pet={pet} />)

    const notesToggleButton = await screen.findByRole('button', { name: /toggle dogs reactivity notes/i })
    expect(notesToggleButton).toBeInTheDocument()

    expect(screen.queryByRole('button', { name: /toggle cats reactivity notes/i })).not.toBeInTheDocument()
  })

  it('displays notes when toggle button is clicked', async () => {
    mockAuthContext()
    const pet = makePet({ dogReactivityNotes: 'Some notes about dog reactivity' })
    renderWithProviders(<PetDisplay pet={pet} />)

    const notesToggleButton = await screen.findByRole('button', { name: /toggle dogs reactivity notes/i })
    act(() => notesToggleButton.click())

    expect(await screen.findByText('Some notes about dog reactivity')).toBeInTheDocument()
  })

  it('hides notes when toggle button is clicked again', async () => {
    mockAuthContext()
    const pet = makePet({ catReactivityNotes: 'Some notes about cat reactivity' })
    renderWithProviders(<PetDisplay pet={pet} />)

    const notesToggleButton = await screen.findByRole('button', { name: /toggle cats reactivity notes/i })
    act(() => notesToggleButton.click())
    act(() => notesToggleButton.click())

    expect(await screen.queryByText('Some notes about cat reactivity')).not.toBeInTheDocument()
  })
})