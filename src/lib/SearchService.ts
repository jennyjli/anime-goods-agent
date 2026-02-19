import { SearchResult, SerperSearchResponse } from './types'

/**
 * SearchService - Search Japanese merchandise sites using Serper API
 * Supports: Mercari (jp.mercari.com) and Suruga-Ya (suruga-ya.jp)
 */

const SERPER_API_KEY = process.env.SERPER_API_KEY || ''
const SERPER_API_URL = 'https://google.serper.dev/search'

const SITE_RESTRICTIONS = [
  'site:jp.mercari.com',
  'site:suruga-ya.jp',
]

/**
 * Check if URL is a valid product page (not a search/listing page)
 */
function isValidProductUrl(url: string): boolean {
  // Mercari: must match jp.mercari.com/item/m...
  if (url.includes('mercari.com')) {
    const isValid = /jp\.mercari\.com\/item\/m[a-zA-Z0-9]+/.test(url)
    if (!isValid) console.log('   Invalid Mercari URL:', url)
    return isValid
  }
  // Suruga-Ya: must match suruga-ya.jp/product/detail/...
  if (url.includes('suruga-ya.jp')) {
    const isValid = /suruga-ya\.jp\/product\/detail\/[0-9]+/.test(url)
    if (!isValid) console.log('   Invalid Suruga-Ya URL:', url)
    return isValid
  }
  console.log('   Not from Mercari or Suruga-Ya:', url)
  return false
}

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
 * Returns null if URL is not a valid product page
 */
function parseSearchResult(
  item: {
    title: string
    url: string
    snippet: string
    content?: string
  }
): SearchResult | null {
  // Only accept valid product page URLs
  if (!isValidProductUrl(item.url)) {
    return null
  }

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
 * Uses exact keyword with site restrictions for Serper API
 */
function buildSearchQuery(keyword: string): string {
  // Use keyword exactly as provided
  const trimmedKeyword = keyword.trim()

  // Combine with site restrictions using OR operator for Serper format
  const siteQuery = SITE_RESTRICTIONS.join(' OR ')

  // Build final query for Serper with proper syntax
  return `${trimmedKeyword} (${siteQuery})`
}

/**
 * Search for anime goods on Japanese sites using Serper API
 */
export async function searchMerchandise(keyword: string): Promise<SearchResult[]> {
  try {
    // Validate API key
    if (!SERPER_API_KEY) {
      console.error('❌ Serper API key is not configured')
      return []
    }

    const query = buildSearchQuery(keyword)
    console.log('🔍 Search Query:', query)

    const response = await fetch(SERPER_API_URL, {
      method: 'POST',
      headers: {
        'X-API-KEY': SERPER_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        q: query,
        num: 10,
      }),
    })

    console.log('📡 Serper API Response Status:', response.status)

    if (!response.ok) {
      const errorText = await response.text()
      console.error('❌ Serper API error:', response.statusText, errorText)
      return []
    }

    const data: SerperSearchResponse = await response.json()
    console.log('📊 Raw Serper Results:', data.organic?.length || 0, 'items')
    console.log('📋 Raw Results:', JSON.stringify(data.organic?.slice(0, 3), null, 2))

    // Parse and clean results from Serper, filtering out null values (invalid URLs)
    const results = (data.organic || [])
      .map((item, idx) => {
        const parsed = parseSearchResult({
          title: item.title,
          url: item.link,
          snippet: item.snippet,
        })
        console.log(`  [${idx + 1}] ${item.title.substring(0, 50)}...`)
        console.log(`      URL: ${item.link}`)
        console.log(`      Valid: ${parsed !== null ? '✓' : '✗'}`)
        return parsed
      })
      .filter((result): result is SearchResult => result !== null)

    console.log('✅ Filtered Results:', results.length, 'valid products')

    // Sort by:
    // 1. Availability (in-stock first)
    // 2. For in-stock items: price available first, then by price (lowest first)
    // 3. For sold-out items: just by price
    return results.sort((a, b) => {
      if (a.isAvailable !== b.isAvailable) {
        return a.isAvailable ? -1 : 1
      }
      
      // For in-stock items, rank price-available items above price-unavailable
      if (a.isAvailable && b.isAvailable) {
        const aHasPrice = a.price !== null
        const bHasPrice = b.price !== null
        if (aHasPrice !== bHasPrice) {
          return aHasPrice ? -1 : 1
        }
      }
      
      // Sort by price if both have prices
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
