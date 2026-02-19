/**
 * Type definitions for the application
 */

export interface AnalysisResult {
  series: string
  character: string
  jpKeywords: string
  searchKeyword: string
  reasoning: string
}

export interface SearchResult {
  platform: 'Mercari' | 'Suruga-Ya'
  title: string
  price: string | null
  condition: string | null
  link: string
  isAvailable: boolean
}

export interface SerperSearchResponse {
  searchParameters: {
    q: string
    type: string
    engine: string
  }
  organic: Array<{
    position: number
    title: string
    link: string
    snippet: string
    date?: string
  }>
}
