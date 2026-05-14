import { useQuery } from '@apollo/client'
import { GET_USERS } from './home.queries'
import { User } from '@/types/user'
import { SearchMap } from '@/components/map/searchMap'
import { useAuth } from '@/context/auth'
import { useState } from 'react'
import { DEMO_USERS } from '@/constants/demoUsers'
import 'mapbox-gl/dist/mapbox-gl.css'
import './home.scss'

export function Home() {
  const { data, loading, error, refetch } = useQuery<{ users: User[] }>(GET_USERS)
  const { user } = useAuth()

  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [searchValue, setSearchValue] = useState('')

  if (loading) return <p>Loading…</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="home">
      <SearchMap
        users={DEMO_USERS}
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        onUserSelect={setSelectedUser}
      />
      <button onClick={() => refetch()}>REFRESH</button>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {data?.users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
