import { useActivityStore } from '../store/userActivity'
import { OPENAI } from '../utils/constants'

interface OpenAIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

interface OpenAIResponse {
  choices: Array<{
    message: {
      content: string
    }
  }>
}

// Get movie recommendations from OpenAI based on user activity
// Returns an array of movie titles to search for
export async function getAIRecommendations(): Promise<string[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY

  if (!apiKey) {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env file.')
  }

  // Get user activity data
  const activityData = useActivityStore.getState().getActivityForAI()

  // Build the prompt
  const systemPrompt = `You are a movie recommendation assistant. Based on user activity data, recommend 5 movie titles that the user might enjoy. 

IMPORTANT RULES:
- Return ONLY movie titles, one per line
- No numbers, bullets, or extra text
- Use well-known movie titles that are likely in a movie database
- Consider the user's genre preferences and viewing history
- If the user has limited activity, recommend popular classics
- Do not explain your choices, just list the titles`

  const userPrompt = `User Activity Summary:
${activityData.activitySummary}

Recent Searches: ${activityData.recentSearches.join(', ') || 'None yet'}
Top Genres: ${activityData.topGenres.map(g => `${g.genre} (${g.count})`).join(', ') || 'None yet'}
Recently Viewed: ${activityData.recentlyViewed.map(m => m.title).join(', ') || 'None yet'}

Based on this activity, recommend 5 movies.`

  const messages: OpenAIMessage[] = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt }
  ]

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
    body: JSON.stringify({
      model: OPENAI.MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 200,
    }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(`OpenAI API error: ${error.error?.message || response.statusText}`)
    }

    const data: OpenAIResponse = await response.json()
    const content = data.choices[0]?.message?.content || ''

    // Parse the response - expect one title per line
    const titles = content
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .map(line => {
        // Remove common prefixes like "1. " or "- "
        return line.replace(/^[\d\-\*\•]+\.?\s*/, '')
      })
      .filter(title => title.length > 0)

    return titles.slice(0, 5) // Ensure max 5 recommendations
  } catch (error) {
    console.error('AI Recommendations error:', error)
    throw error
  }
}
