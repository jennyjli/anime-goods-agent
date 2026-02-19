import { useState } from 'react'
import { SearchResult } from '@/lib/types'

export interface SearchStats {
  totalResults: number
  availableCount: number
  unavailableCount: number
  priceRange: {
    min: number
    max: number
    average: number
  }
}

interface UseSearchResult {
  isLoading: boolean
  error: string | null
  results: SearchResult[]
  stats: SearchStats | null
  search: (jpKeywords: string, filters?: any) => Promise<void>
  reset: () => void
}

export function useSearch(): UseSearchResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<SearchResult[]>([])
  const [stats, setStats] = useState<SearchStats | null>(null)

  const search = async (jpKeywords: string, filters?: any): Promise<void> => {
    setIsLoading(true)
    setError(null)
    setResults([])
    setStats(null)

    try {
      // Validate input
      if (!jpKeywords || jpKeywords.trim().length === 0) {
        throw new Error('Search keywords cannot be empty')
      }

      // Call API
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          jpKeywords: jpKeywords.trim(),
          ...filters,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Search failed')
      }

      setResults(data.results || [])
      setStats(data.stats || null)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Search error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setIsLoading(false)
    setError(null)
    setResults([])
    setStats(null)
  }

  return {
    isLoading,
    error,
    results,
    stats,
    search,
    reset,
  }
}
