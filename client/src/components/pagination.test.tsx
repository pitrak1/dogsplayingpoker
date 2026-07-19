import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/wrapper'
import { Pagination } from './pagination'

describe('Pagination', () => {
  it('shows no results when no entries are given', () => {
    const { container } = renderWithProviders(<Pagination pageNumber={1} pageSize={25} totalCount={0} onPageChange={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows no results when total count is less than or equal to page size', () => {
    const { container } = renderWithProviders(<Pagination pageNumber={1} pageSize={25} totalCount={25} onPageChange={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('previous button is disabled on first page', () => {
    renderWithProviders(<Pagination pageNumber={1} pageSize={25} totalCount={50} onPageChange={vi.fn()} />)
    expect(screen.getByLabelText('previous page')).toBeDisabled()
  })

  it('previous button calls onPageChange with previous page number', async () => {
    const onPageChange = vi.fn()
    renderWithProviders(<Pagination pageNumber={3} pageSize={25} totalCount={250} onPageChange={onPageChange} />)
    await screen.getByLabelText('previous page').click()
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('next button is disabled on last page', () => {
    renderWithProviders(<Pagination pageNumber={2} pageSize={25} totalCount={50} onPageChange={vi.fn()} />)
    expect(screen.getByLabelText('next page')).toBeDisabled()
  })

  it('next button calls onPageChange with next page number', async () => {
    const onPageChange = vi.fn()
    renderWithProviders(<Pagination pageNumber={3} pageSize={25} totalCount={250} onPageChange={onPageChange} />)
    await screen.getByLabelText('next page').click()
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('shows all page number butons if 5 pages or less', () => {
    renderWithProviders(<Pagination pageNumber={1} pageSize={25} totalCount={125} onPageChange={vi.fn()} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows page numbers 1 through 5 if page is 3 or less', () => {
    renderWithProviders(<Pagination pageNumber={3} pageSize={25} totalCount={250} onPageChange={vi.fn()} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows last 5 pages if page is last page or previous two pages', () => {
    // 10 pages, should show pages 6-10 on page 8
    renderWithProviders(<Pagination pageNumber={8} pageSize={25} totalCount={250} onPageChange={vi.fn()} />)
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('shows nearby pages if not near first or last pages', () => {
    // 10 pages, page 7 should show 5-9
    renderWithProviders(<Pagination pageNumber={7} pageSize={25} totalCount={250} onPageChange={vi.fn()} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()
  })

  it('clicking on a page number calls onPageChange with that page number', async () => {
    const onPageChange = vi.fn()
    renderWithProviders(<Pagination pageNumber={7} pageSize={25} totalCount={250} onPageChange={onPageChange} />)
    await screen.getByText('5').click()
    expect(onPageChange).toHaveBeenCalledWith(5)
  })
})