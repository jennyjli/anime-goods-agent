import { NextRequest, NextResponse } from 'next/server'
import { searchMerchandise, getSearchStats } from '@/lib/SearchService'
import { SearchResult } from '@/lib/types'

interface SearchRequest {
  searchKeyword: string
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
    const { searchKeyword } = body

    // Validate input
    if (!searchKeyword || typeof searchKeyword !== 'string') {
      return NextResponse.json(
        { error: 'Invalid request', details: 'searchKeyword is required and must be a string' },
        { status: 400 }
      )
    }

    // Check for Serper API key
    if (!process.env.SERPER_API_KEY) {
      return NextResponse.json(
        {
          error: 'Search service not configured',
          details: 'Serper API key is not set',
        },
        { status: 500 }
      )
    }

    // Use searchKeyword directly as provided by Gemini analysis
    // No modification to the keyword
    const results = await searchMerchandise(searchKeyword)

    // Get search statistics
    const stats = getSearchStats(results)

    return NextResponse.json(
      {
        results,
        stats,
        query: searchKeyword,
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
