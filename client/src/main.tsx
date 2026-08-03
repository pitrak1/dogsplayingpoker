import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from './App'
import { AuthProvider } from './context/auth'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <MantineProvider theme={{
          colors: {
            brand: [
              "#ecefff",
              "#d5dafb",
              "#a9b1f1",
              "#7a87e9",
              "#5362e1",
              "#3a4bdd",
              "#2c40dc",
              "#1f32c4",
              "#182cb0",
              "#0a259c"
            ]
          },
          primaryColor: 'brand',
          primaryShade: 5,  // which shade is the "default"
        }}>
          <App />
        </MantineProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
