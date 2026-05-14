import { ApolloClient, HttpLink, InMemoryCache, ApolloLink, Observable } from '@apollo/client'
import { getAuthToken, setAuthToken, clearAuth } from '@/context/auth'
import { onError } from '@apollo/client/link/error'

const errorLink = onError(({ networkError, operation, forward }) => {
  if (networkError && 'statusCode' in networkError && networkError?.statusCode === 401) {
    return new Observable((observer) => {
      fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: 'mutation RefreshToken { refreshToken { authToken } }' }),
        credentials: 'include',
      })
        .then((res) => res.json())
        .then(({ data }) => {
          setAuthToken(data.refreshToken.authToken)
          forward(operation).subscribe(observer)
        })
        .catch(() => {
          clearAuth()
          observer.error(networkError)
        })
    })
  }
})

const authLink = new ApolloLink((operation, forward) => {
  const token = getAuthToken()
  operation.setContext({
    headers: {
      authorization: token ? `Bearer ${token}` : '',
    },
  })
  return forward(operation)
})

export const client = new ApolloClient({
  link: errorLink.concat(authLink.concat(new HttpLink({ uri: '/graphql' }))),
  cache: new InMemoryCache(),
})
