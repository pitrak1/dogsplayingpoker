import { gql, useQuery } from '@apollo/client'
import { Header } from '@/components/header/header'
import { BrowserRouter, Routes, Route } from 'react-router'
import { Home } from '@/pages/home'
import { About } from '@/pages/about'
import { Login } from '@/pages/login'
import { Signup } from '@/pages/signup'
import '@/styles/global.scss'

const GET_PLAYERS = gql`
  query GetPlayers {
    players {
      id
      name
      chips
    }
  }
`

type Player = { id: number; name: string; chips: number }

export function App() {
  const { data, loading, error } = useQuery<{ players: Player[] }>(GET_PLAYERS)

  if (loading) return <p>Loading…</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}
