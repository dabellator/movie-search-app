import { useState, useEffect } from 'react'
import { API_ENDPOINTS, OPENAI } from '../utils/constants'

interface AIStatus {
  configured: boolean
  operational: boolean | null
  error: string | null
  model: string | null
}

// Hook to check OpenAI API status
// Tests connection and configuration on mount
export function useAIStatus() {
  const [status, setStatus] = useState<AIStatus>({
    configured: false,
    operational: null,
    error: null,
    model: null,
  })

  useEffect(() => {
    const checkAIStatus = async () => {
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY

      if (!apiKey) {
        setStatus({
          configured: false,
          operational: false,
          error: 'API key not configured',
          model: null,
        })
        return
      }

      setStatus(prev => ({ ...prev, configured: true }))

      try {
        // Test with a minimal request
        const response = await fetch(API_ENDPOINTS.OPENAI_API, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: OPENAI.MODEL,
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: OPENAI.TEST_MAX_TOKENS,
          }),
        })

        if (response.ok) {
          setStatus({
            configured: true,
            operational: true,
            error: null,
            model: OPENAI.MODEL,
          })
        } else {
          const error = await response.json()
          setStatus({
            configured: true,
            operational: false,
            error: error.error?.message || 'API request failed',
            model: null,
          })
        }
      } catch (err) {
        setStatus({
          configured: true,
          operational: false,
          error: err instanceof Error ? err.message : 'Connection failed',
          model: null,
        })
      }
    }

    checkAIStatus()
  }, [])

  return status
}
