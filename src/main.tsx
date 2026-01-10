import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Client, Provider, cacheExchange, fetchExchange } from 'urql'
import './index.css'
import App from './App.tsx'
import { getAuthToken } from './utils/auth'

// Custom fetch with authentication
const authenticatedFetch = async (url: RequestInfo | URL, options?: RequestInit) => {
  const token = await getAuthToken()
  
  const headers = new Headers(options?.headers)
  headers.set('content-type', 'application/json')
  headers.set('authorization', `Bearer ${token}`)
  
  return fetch(url, {
    ...options,
    headers,
  })
}

const client = new Client({
  url: 'https://0kadddxyh3.execute-api.us-east-1.amazonaws.com/graphql',
  exchanges: [cacheExchange, fetchExchange],
  fetch: authenticatedFetch,
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider value={client}>
      <App />
    </Provider>
  </StrictMode>,
)
