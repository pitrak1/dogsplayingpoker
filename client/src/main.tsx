import { QueryCache, QueryClient, QueryClientProvider, MutationCache } from '@tanstack/react-query'
import { z, ZodError } from 'zod'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { AuthProvider } from './context/auth'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { theme } from './styles/theme'

const logSchemaMismatch = (error: unknown, label: string) => {
  if (error instanceof ZodError) {
    console.error(`Schema mismatch on ${label}\n${z.prettifyError(error)}`)
  }
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => !(error instanceof ZodError) && failureCount < 3,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => logSchemaMismatch(error, JSON.stringify(query.queryKey)),
  }),
  mutationCache: new MutationCache({
    onError: (error, _vars, _ctx, mutation) =>
      logSchemaMismatch(error, mutation.options.mutationKey?.join('/') ?? 'mutation'),
  }),
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MantineProvider theme={theme}>
          <App />
        </MantineProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
