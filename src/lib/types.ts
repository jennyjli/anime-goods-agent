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

export interface TavilySearchResponse {
  results: Array<{
    title: string
    url: string
    snippet: string
    content?: string
  }>
  answer?: string
  query: string
}
