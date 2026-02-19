import { NextRequest, NextResponse } from 'next/server'
import { searchMerchandise, getSearchStats } from '@/lib/SearchService'
import { SearchResult } from '@/lib/types'

interface SearchRequest {
  jpKeywords: string
  maxPrice?: number
  condition?: string
  platform?: 'Mercari' | 'Suruga-Ya'
}

interface SearchResponse {
  results: SearchResult[]
  stats: {
    totalResults: number
    availableCount: number
    unavailableCount: number
    priceRange: {
      min: number
      max: number
      average: number
    }
  }
  query: string
}

interface ErrorResponse {
  error: string
  details?: string
}

/**
 * Simplify keywords to a single focused phrase
 * Removes redundancy and condition info, keeping only essential product identifiers
 * Example: "Hatsune Miku; TV Anime; Excellent condition" → "Hatsune Miku"
 */
function simplifyKeywords(jpKeywords: string): string {
  // Split by common delimiters (semicolon, comma, newline)
  const parts = jpKeywords.split(/[;,\n]/).map(p => p.trim()).filter(p => p.length > 0)

  if (parts.length === 0) return jpKeywords

  // Filter out condition-related and generic terms
  const conditionPatterns = [
    'excellent',
    'good',
    'fair',
    'poor',
    'condition',
    '状態',
    '美品',
    '良好',
    '傷あり',
    'new',
    'used',
    'like new',
    'figure',
    'doll',
    'toy',
    'merchandise',
    'goods',
    'item',
  ]

  const meaningfulParts = parts.filter(part => {
    const lower = part.toLowerCase()
    return !conditionPatterns.some(pattern => lower.includes(pattern))
  })

  // If we filtered everything out, use first part only
  if (meaningfulParts.length === 0) {
    return parts[0]
  }

  // Take first 1-2 meaningful parts (usually character + series or character name)
  const simplified = meaningfulParts.slice(0, 2).join(' ')
  
  return simplified || parts[0]
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<SearchResponse | ErrorResponse>> {
  try {
    const body: SearchRequest = await request.json()
    const { jpKeywords } = body

    // Validate input
    if (!jpKeywords || typeof jpKeywords !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request', details: 'jpKeywords is required and must be a string' },
        { status: 400 }
      )
    }

    // Check for Tavily API key
    if (!process.env.TAVILY_API_KEY) {
      return NextResponse.json(
        {
          error: 'Search service not configured',
          details: 'Tavily API key is not set',
        },
        { status: 500 }
      )
    }

    // Simplify keywords to a focused search phrase
    // Removes redundancy and condition info, keeping only essential identifiers
    const simplifiedKeywords = simplifyKeywords(jpKeywords)

    // Perform search with simplified keywords for better results
    const results = await searchMerchandise(simplifiedKeywords)

    // Get search statistics
    const stats = getSearchStats(results)

    return NextResponse.json(
      {
        results,
        stats,
        query: simplifiedKeywords, // Return the simplified query that was actually used
        originalKeywords: jpKeywords, // Keep original for reference
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error in search endpoint:', error)

    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return NextResponse.json(
      {
        error: 'Search failed',
        details: errorMessage,
      },
      { status: 500 }
    )
  }
}
