import type { ReactNode } from 'react'
import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthProvider } from '@/context/auth'
import { renderHook } from '@testing-library/react'

const makeQueryClient = () =>
  new QueryClient({
    defaultOptions: { queries: { retry: false } },
  })

export const AppTestWrapper = (pathname: string | null | undefined) =>
  ({ children }: { children: ReactNode }) => (
    <MemoryRouter initialEntries={[pathname || '/']}>
      <QueryClientProvider client={makeQueryClient()}>
        <AuthProvider>{children}</AuthProvider>
      </QueryClientProvider>
    </MemoryRouter>
  )

export const renderWithProviders = (ui: React.ReactElement, pathname?: string | null | undefined) =>
  render(ui, { wrapper: AppTestWrapper(pathname) })

export const renderHookWithProviders = <Result, Props>(
  callback: (props: Props) => Result,
  options?: Parameters<typeof renderHook<Result, Props>>[1],
  pathname?: string | null
) => renderHook(callback, { wrapper: AppTestWrapper(pathname), ...options })

