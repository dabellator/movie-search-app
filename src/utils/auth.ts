const BASE_URL = 'https://0kadddxyh3.execute-api.us-east-1.amazonaws.com'
const TOKEN_STORAGE_KEY = 'movies_api_token'

export async function getAuthToken(): Promise<string> {
  // Check if we have a cached token
  const cachedToken = localStorage.getItem(TOKEN_STORAGE_KEY)
  if (cachedToken) {
    return cachedToken
  }

  // Fetch a new token
  try {
    const response = await fetch(`${BASE_URL}/auth/token`)
    if (!response.ok) {
      throw new Error('Failed to fetch auth token')
    }
    const data = await response.json()
    const token = data.token || data.access_token || data
    
    // Cache the token
    localStorage.setItem(TOKEN_STORAGE_KEY, token)
    
    return token
  } catch (error) {
    console.error('Error fetching auth token:', error)
    throw error
  }
}

export function clearAuthToken(): void {
  localStorage.removeItem(TOKEN_STORAGE_KEY)
}
