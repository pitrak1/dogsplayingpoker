import { useQuery } from '@apollo/client'
import { GET_USERS } from './home.queries'
import { User } from '@/types/user'
import './home.scss'

export function Home() {
  const { data, loading, error, refetch } = useQuery<{ users: User[] }>(GET_USERS)

  if (loading) return <p>Loading…</p>
  if (error) return <p>Error: {error.message}</p>

  return (
    <div className="home">
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
