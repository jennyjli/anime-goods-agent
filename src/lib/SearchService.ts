import { SearchResult, TavilySearchResponse } from './types'

/**
 * SearchService - Search Japanese merchandise sites using Tavily API
 * Supports: Mercari (jp.mercari.com) and Suruga-Ya (suruga-ya.jp)
 */

const TAVILY_API_KEY = process.env.TAVILY_API_KEY || ''
const TAVILY_API_URL = 'https://api.tavily.com/search'

const SITE_RESTRICTIONS = [
  'site:jp.mercari.com',
  'site:suruga-ya.jp',
]

/**
 * Extract platform name from URL
 */
function getPlatformFromUrl(url: string): 'Mercari' | 'Suruga-Ya' {
  if (url.includes('mercari.com')) {
    return 'Mercari'
  }
  if (url.includes('suruga-ya.jp')) {
    return 'Suruga-Ya'
  }
  return 'Mercari' // Default fallback
}

/**
 * Extract price from text (Japanese format: ¥1,000 or 1000円)
 */
function extractPrice(text: string): string | null {
  // Match ¥ with numbers and optional commas
  const yenMatch = text.match(/¥([\d,]+)/)
  if (yenMatch) {
    return `¥${yenMatch[1]}`
  }

  // Match numbers followed by 円
  const enMatch = text.match(/([\d,]+)\s*円/)
  if (enMatch) {
    return `${enMatch[1]}円`
  }

  // Match price format with commas
  const commaMatch = text.match(/[\d,]+(?=[\s円¥]|$)/g)
  if (commaMatch && commaMatch.length > 0) {
    // Get the first reasonable price (avoid very large numbers)
    for (const match of commaMatch) {
      const num = parseInt(match.replace(/,/g, ''), 10)
      if (num > 100 && num < 10000000) {
        // Likely price range for anime goods
        return `¥${match}`
      }
    }
  }

  return null
}

/**
 * Extract condition/status from text
 */
function extractCondition(text: string): string | null {
  const conditionPatterns: Record<string, string> = {
    '未使用': 'New',
    'あたらしい': 'New',
    '新品': 'New',
    '新しい': 'New',
    '未開封': 'Unopened',
    '開封': 'Opened',
    'ほぼ未使用': 'Like New',
    'ほぼ新品': 'Like New',
    '美品': 'Good',
    '中古': 'Used',
    '傷あり': 'Used - With Damage',
    'ジャンク': 'Junk',
    'USED': 'Used',
    'NEW': 'New',
  }

  for (const [jpTerm, enTerm] of Object.entries(conditionPatterns)) {
    if (text.includes(jpTerm)) {
      return enTerm
    }
  }

  return null
}

/**
 * Check if item is available (not sold out)
 */
function checkAvailability(text: string): boolean {
  const soldOutPatterns = [
    '売り切れ',
    '売切れ',
    '終了',
    '完売',
    'SOLD OUT',
    '在庫なし',
    'このアイテムは削除されました',
  ]

  for (const pattern of soldOutPatterns) {
    if (text.includes(pattern)) {
      return false
    }
  }

  return true
}

/**
 * Clean and parse a single search result
 */
function parseSearchResult(
  item: {
    title: string
    url: string
    snippet: string
    content?: string
  }
): SearchResult {
  const combinedText = `${item.title} ${item.snippet} ${item.content || ''}`
  const platform = getPlatformFromUrl(item.url)
  const price = extractPrice(combinedText)
  const condition = extractCondition(combinedText)
  const isAvailable = checkAvailability(combinedText)

  return {
    platform,
    title: item.title,
    price,
    condition,
    link: item.url,
    isAvailable,
  }
}

/**
 * Build search query with site restrictions
 */
function buildSearchQuery(jpKeywords: string): string {
  // jpKeywords is comma-separated
  const keywords = jpKeywords.split(',').map((k) => k.trim())

  // Use the first keyword or all concatenated
  const mainKeyword = keywords[0] || jpKeywords

  // Combine with site restrictions
  const siteQuery = SITE_RESTRICTIONS.join(' OR ')

  // Build final query: keywords with site restrictions
  return `(${mainKeyword}) (${siteQuery})`
}

/**
 * Search for anime goods on Japanese sites using Tavily API
 */
export async function searchMerchandise(jpKeywords: string): Promise<SearchResult[]> {
  try {
    // Validate API key
    if (!TAVILY_API_KEY) {
      console.error('Tavily API key is not configured')
      return []
    }

    const query = buildSearchQuery(jpKeywords)

    const response = await fetch(TAVILY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: TAVILY_API_KEY,
        query: query,
        search_depth: 'basic',
        max_results: 10,
        include_answer: false,
      }),
    })

    if (!response.ok) {
      console.error('Tavily API error:', response.statusText)
      return []
    }

    const data: TavilySearchResponse = await response.json()

    // Parse and clean results
    const results = data.results.map(parseSearchResult)

    // Sort by availability (available first) then by price if available
    return results.sort((a, b) => {
      if (a.isAvailable !== b.isAvailable) {
        return a.isAvailable ? -1 : 1
      }
      if (a.price && b.price) {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ''), 10)
        const priceB = parseInt(b.price.replace(/[^\d]/g, ''), 10)
        return priceA - priceB
      }
      return 0
    })
  } catch (error) {
    console.error('Error searching merchandise:', error)
    return []
  }
}

/**
 * Search for a specific item with keyword and optional filters
 */
export async function searchWithFilters(
  jpKeywords: string,
  filters?: {
    maxPrice?: number
    condition?: string
    platformOnly?: 'Mercari' | 'Suruga-Ya'
  }
): Promise<SearchResult[]> {
  let results = await searchMerchandise(jpKeywords)

  // Apply filters
  if (filters) {
    if (filters.maxPrice) {
      results = results.filter((r) => {
        if (!r.price) return true
        const price = parseInt(r.price.replace(/[^\d]/g, ''), 10)
        return price <= filters.maxPrice!
      })
    }

    if (filters.condition) {
      results = results.filter(
        (r) => r.condition && r.condition.toLowerCase().includes(filters.condition!.toLowerCase())
      )
    }

    if (filters.platformOnly) {
      results = results.filter((r) => r.platform === filters.platformOnly)
    }
  }

  return results
}

/**
 * Get summary statistics of search results
 */
export function getSearchStats(results: SearchResult[]) {
  const available = results.filter((r) => r.isAvailable).length
  const prices = results
    .filter((r) => r.price)
    .map((r) => parseInt(r.price!.replace(/[^\d]/g, ''), 10))
    .sort((a, b) => a - b)

  const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b) / prices.length) : 0
  const minPrice = prices.length > 0 ? prices[0] : 0
  const maxPrice = prices.length > 0 ? prices[prices.length - 1] : 0

  return {
    totalResults: results.length,
    availableCount: available,
    unavailableCount: results.length - available,
    priceRange: {
      min: minPrice,
      max: maxPrice,
      average: avgPrice,
    },
  }
}
