'use client'

import React from 'react'
import { motion } from 'framer-motion'
import {
  AlertCircle,
  Loader,
  ExternalLink,
  CheckCircle,
  XCircle,
  ShoppingBag,
} from 'lucide-react'
import { SearchResult, AnalysisResult } from '@/lib/types'
import { SearchStats } from '@/lib/useSearch'

interface SearchResultsProps {
  results: SearchResult[]
  stats: SearchStats | null
  isLoading: boolean
  error: string | null
  analysisData?: AnalysisResult
  onSearchAgain: () => void
}

export const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  stats,
  isLoading,
  error,
  analysisData,
  onSearchAgain,
}) => {
  if (!isLoading && !results.length && !error) {
    return null
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto mt-8"
      >
        <div className="rounded-2xl border border-dark-border bg-dark-surface/50 backdrop-blur-sm p-8">
          <div className="flex items-center justify-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader className="w-6 h-6 text-blue-400" />
            </motion.div>
            <span className="text-lg text-gray-300">Searching Japanese merchandise sites...</span>
          </div>
        </div>
      </motion.div>
    )
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto mt-8"
      >
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm p-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-300 mb-2">Search Error</h3>
              <p className="text-red-200 mb-4">{error}</p>
              <button
                onClick={onSearchAgain}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                Retry Search
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!results.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-4xl mx-auto mt-8"
      >
        <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 backdrop-blur-sm p-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">No Results Found</h3>
              <p className="text-yellow-200 mb-4">
                No matching items found on Mercari or Suruga-Ya for the given keywords.
              </p>
              <button
                onClick={onSearchAgain}
                className="px-4 py-2 rounded-lg bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium transition-colors"
              >
                Try Different Keywords
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  const availableResults = results.filter((r) => r.isAvailable)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto mt-8"
    >
      {/* Header with analysis data */}
      {analysisData && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm p-6"
        >
          <h3 className="text-xl font-bold text-white mb-2">
            Searching for: {analysisData.character} from {analysisData.series}
          </h3>
          <p className="text-sm text-cyan-300">
            Keywords: <span className="font-semibold">{analysisData.jpKeywords}</span>
          </p>
        </motion.div>
      )}

      {/* Statistics */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 grid grid-cols-1 sm:grid-cols-4 gap-4"
        >
          {[
            {
              label: 'Total Found',
              value: stats.totalResults,
              icon: ShoppingBag,
              color: 'from-blue-500 to-cyan-500',
            },
            {
              label: 'Available',
              value: stats.availableCount,
              icon: CheckCircle,
              color: 'from-green-500 to-emerald-500',
            },
            {
              label: 'Sold Out',
              value: stats.unavailableCount,
              icon: XCircle,
              color: 'from-red-500 to-pink-500',
            },
            {
              label: 'Avg Price',
              value: `¥${stats.priceRange.average.toLocaleString('ja-JP')}`,
              icon: ShoppingBag,
              color: 'from-purple-500 to-pink-500',
            },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
              className={`p-4 rounded-lg bg-gradient-to-br ${stat.color}/20 border border-dark-border`}
            >
              <p className="text-xs text-gray-400 mb-1">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Results list */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white mb-4">
          Available Items ({availableResults.length})
        </h3>

        {results.map((result, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 + idx * 0.05 }}
            className={`rounded-xl border ${
              result.isAvailable ? 'border-green-500/30 bg-green-500/5' : 'border-red-500/30 bg-red-500/5'
            } backdrop-blur-sm p-5 hover:border-opacity-100 transition-all`}
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-semibold text-blue-400 px-2 py-1 bg-blue-500/20 rounded">
                    {result.platform}
                  </span>
                  {result.isAvailable ? (
                    <span className="text-xs font-semibold text-green-400 px-2 py-1 bg-green-500/20 rounded flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      In Stock
                    </span>
                  ) : (
                    <span className="text-xs font-semibold text-red-400 px-2 py-1 bg-red-500/20 rounded flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Sold Out
                    </span>
                  )}
                  {result.condition && (
                    <span className="text-xs font-semibold text-gray-300 px-2 py-1 bg-gray-500/20 rounded">
                      {result.condition}
                    </span>
                  )}
                </div>

                <h4 className="font-semibold text-white text-base line-clamp-2 mb-2">
                  {result.title}
                </h4>
              </div>
            </div>

            {/* Price and link */}
            <div className="flex items-center justify-between">
              <div>
                {result.price ? (
                  <p className="text-2xl font-bold text-cyan-300">{result.price}</p>
                ) : (
                  <p className="text-sm text-gray-500">Price not available</p>
                )}
              </div>

              <motion.a
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                href={result.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold transition-colors"
              >
                View
                <ExternalLink className="w-4 h-4" />
              </motion.a>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Price range info */}
      {stats && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 p-4 rounded-lg border border-dark-border bg-dark-surface/50"
        >
          <p className="text-sm text-gray-400">
            <span className="font-semibold text-white">Price Range: </span>
            <span className="text-cyan-300">
              ¥{stats.priceRange.min.toLocaleString('ja-JP')} - ¥
              {stats.priceRange.max.toLocaleString('ja-JP')}
            </span>
          </p>
        </motion.div>
      )}
    </motion.div>
  )
}
