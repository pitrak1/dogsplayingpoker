import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithProviders } from '@/test/wrapper'
import { SearchPagination } from './searchPagination'

describe('SearchPagination', () => {
  it('shows no results when given null totalCount', () => {
    const { container } = renderWithProviders(<SearchPagination pageNumber={1} totalCount={null} onPageChange={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows no results when no entries are given', () => {
    const { container } = renderWithProviders(<SearchPagination pageNumber={1} totalCount={0} onPageChange={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('shows no results when total count is less than or equal to page size', () => {
    const { container } = renderWithProviders(<SearchPagination pageNumber={1} totalCount={25} onPageChange={vi.fn()} />)
    expect(container.firstChild).toBeNull()
  })

  it('previous button is disabled on first page', () => {
    renderWithProviders(<SearchPagination pageNumber={1} totalCount={50} onPageChange={vi.fn()} />)
    expect(screen.getByText('Prev')).toBeDisabled()
  })

  it('previous button calls onPageChange with previous page number', async () => {
    const onPageChange = vi.fn()
    renderWithProviders(<SearchPagination pageNumber={3} totalCount={250} onPageChange={onPageChange} />)
    await screen.getByText('Prev').click()
    expect(onPageChange).toHaveBeenCalledWith(2)
  })

  it('next button is disabled on last page', () => {
    renderWithProviders(<SearchPagination pageNumber={2} totalCount={50} onPageChange={vi.fn()} />)
    expect(screen.getByText('Next')).toBeDisabled()
  })

  it('next button calls onPageChange with next page number', async () => {
    const onPageChange = vi.fn()
    renderWithProviders(<SearchPagination pageNumber={3} totalCount={250} onPageChange={onPageChange} />)
    await screen.getByText('Next').click()
    expect(onPageChange).toHaveBeenCalledWith(4)
  })

  it('shows all page number butons if 5 pages or less', () => {
    renderWithProviders(<SearchPagination pageNumber={1} totalCount={125} onPageChange={vi.fn()} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows page numbers 1 through 5 if page is 3 or less', () => {
    renderWithProviders(<SearchPagination pageNumber={3} totalCount={250} onPageChange={vi.fn()} />)
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
    expect(screen.getByText('4')).toBeInTheDocument()
    expect(screen.getByText('5')).toBeInTheDocument()
  })

  it('shows last 5 pages if page is last page or previous two pages', () => {
    // 10 pages, should show pages 6-10 on page 8
    renderWithProviders(<SearchPagination pageNumber={8} totalCount={250} onPageChange={vi.fn()} />)
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()
    expect(screen.getByText('10')).toBeInTheDocument()
  })

  it('shows nearby pages if not near first or last pages', () => {
    // 10 pages, page 7 should show 5-9
    renderWithProviders(<SearchPagination pageNumber={7} totalCount={250} onPageChange={vi.fn()} />)
    expect(screen.getByText('5')).toBeInTheDocument()
    expect(screen.getByText('6')).toBeInTheDocument()
    expect(screen.getByText('7')).toBeInTheDocument()
    expect(screen.getByText('8')).toBeInTheDocument()
    expect(screen.getByText('9')).toBeInTheDocument()
  })

  it('clicking on a page number calls onPageChange with that page number', async () => {
    const onPageChange = vi.fn()
    renderWithProviders(<SearchPagination pageNumber={7} totalCount={250} onPageChange={onPageChange} />)
    await screen.getByText('5').click()
    expect(onPageChange).toHaveBeenCalledWith(5)
  })
})