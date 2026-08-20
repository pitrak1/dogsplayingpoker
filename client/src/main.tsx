import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { z, ZodError } from 'zod'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { AuthProvider } from './context/auth'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { theme } from './styles/theme'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => !(error instanceof ZodError) && failureCount < 3,
    },
  },
  queryCache: new QueryCache({
    onError: (error, query) => {
      if (error instanceof ZodError) {
        console.error(
          `Schema mismatch on ${JSON.stringify(query.queryKey)}\n${z.prettifyError(error)}`,
        )
      }
    },
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
