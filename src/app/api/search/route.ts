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

    // Perform search with EXACT keywords (no modification)
    // Keywords are preserved from analysis step to ensure sync
    const results = await searchMerchandise(jpKeywords)

    // Get search statistics
    const stats = getSearchStats(results)

    return NextResponse.json(
      {
        results,
        stats,
        query: jpKeywords,
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
