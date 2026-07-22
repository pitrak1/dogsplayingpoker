
import { describe, it, expect, vi } from 'vitest'
import { screen, within, waitFor } from '@testing-library/react'
import { AddEditPetForm } from './addEditPetForm'
import { renderWithProviders } from '@/test/wrapper'
import { mockAuthContext } from '@/test/mocks'
import { makePet } from '@/test/factories'
import * as petsApi from '@/api/pets'
import userEvent from '@testing-library/user-event'

const dutchess = makePet({
  name: 'Dutchess',
  age: 5,
  breed: 'Beagle',
  size: 'small',
  dogReactivity: 'unknown',
  catReactivity: 'strong',
  kidReactivity: 'unknown',
  peopleReactivity: 'unknown',
})

describe('addEditPetForm', () => {
  // it('sets field values to match pet if given', async () => {
  //   mockAuthContext()
  //   renderWithProviders(<AddEditPetForm pet={dutchess} />)
  //   expect(screen.getByLabelText(/name/i)).toHaveValue(dutchess.name)
    
  //   const sizeRadioGroup = screen.getByRole('radiogroup', { name: /size/i })
  //   expect(within(sizeRadioGroup).getByRole('radio', { name: /small/i })).toBeChecked()
  //   expect(within(sizeRadioGroup).getByRole('radio', { name: /medium/i })).not.toBeChecked()

  //   const catReactivityRadioGroup = screen.getByRole('radiogroup', { name: /cats/i })
  //   expect(within(catReactivityRadioGroup).getByRole('radio', { name: /strong/i })).toBeChecked()
  //   expect(within(catReactivityRadioGroup).getByRole('radio', { name: /unknown/i })).not.toBeChecked()
  // })

  it('submits create with valid data and calls onClose if not provided pet', async () => {
    const mockCreatePet = vi.fn().mockResolvedValue(dutchess)
    vi.spyOn(petsApi, 'useCreatePet').mockReturnValue({
      mutateAsync: mockCreatePet,
      isPending: false,
      error: null
    } as any)
    const mockOnClose = vi.fn()
    mockAuthContext()
    renderWithProviders(<AddEditPetForm onClose={mockOnClose} />)
    await userEvent.type(screen.getByLabelText(/name/i), dutchess.name)
    await userEvent.type(screen.getByLabelText(/age/i), String(dutchess.age))
    await userEvent.type(screen.getByLabelText(/breed/i), dutchess.breed)

    const sizeRadioGroup = screen.getByRole('radiogroup', { name: /size/i })
    await userEvent.click(within(sizeRadioGroup).getByRole('radio', { name: /small/i }))

    const catReactivityRadioGroup = screen.getByRole('radiogroup', { name: /cats/i })
    await userEvent.click(within(catReactivityRadioGroup).getByRole('radio', { name: /strong/i }))

    await userEvent.click(screen.getByRole('button', { name: /save/i }))

    await waitFor(() => {
      expect(mockCreatePet).toHaveBeenCalledWith(expect.objectContaining({ name: 'Dutchess' }))
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  // it('submits edit with valid data and calls onClose if pet is given', async () => {
  //   const mockEditPet = vi.fn().mockResolvedValue(dutchess)
  //   vi.spyOn(petsApi, 'useEditPet').mockReturnValue({
  //     mutateAsync: mockEditPet,
  //     isPending: false,
  //     error: null
  //   } as any)
  //   const mockOnClose = vi.fn()
  //   renderWithProviders(<AddEditPetForm pet={dutchess} onClose={mockOnClose} />)

  //   const ageInput = screen.getByLabelText(/age/i)
  //   await userEvent.clear(ageInput)
  //   await userEvent.type(ageInput, '8')

  //   await userEvent.click(screen.getByRole('button', { name: /save/i }))

  //   await waitFor(() => {
  //     expect(mockEditPet).toHaveBeenCalledWith({ id: 1, input: expect.objectContaining({ name: 'Dutchess', age: 8 }) })
  //     expect(mockOnClose).toHaveBeenCalled()
  //   })
  // })
})