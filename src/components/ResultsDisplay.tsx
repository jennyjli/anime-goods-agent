'use client'

import React, { useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ExternalLink,
  CheckCircle,
  XCircle,
  Shield,
  Terminal,
  ChevronDown,
} from 'lucide-react'
import { SearchResult, AnalysisResult } from '@/lib/types'
import { ReasoningTrace } from '@/lib/useReasoningTrace'

interface ResultsDisplayProps {
  results: SearchResult[]
  analysisData?: AnalysisResult
  reasoning: ReasoningTrace[]
  isLoading: boolean
  onViewMore?: () => void
}

/**
 * Bento Grid card component
 */
const BentoCard: React.FC<{
  result: SearchResult
  index: number
  isFeatured?: boolean
}> = ({ result, index, isFeatured = false }) => {
  const isMercari = result.platform === 'Mercari'
  const isSurugaya = result.platform === 'Suruga-Ya'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
      className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
        result.isAvailable
          ? 'border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5 hover:border-green-500/60'
          : 'border-red-500/30 bg-gradient-to-br from-red-500/5 to-pink-500/5 hover:border-red-500/60'
      } ${isFeatured ? 'md:col-span-2 md:row-span-2' : ''} p-5 backdrop-blur-sm`}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Header badges */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-500/30 text-blue-200 border border-blue-500/50">
            {result.platform}
          </span>

          {result.isAvailable ? (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-500/30 text-green-200 border border-green-500/50 flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              In Stock
            </span>
          ) : (
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-500/30 text-red-200 border border-red-500/50 flex items-center gap-1">
              <XCircle className="w-3 h-3" />
              Sold Out
            </span>
          )}

          {/* Trusted Shop Badge for Suruga-Ya */}
          {isSurugaya && result.isAvailable && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-xs font-bold px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/30 to-orange-500/30 text-amber-200 border border-amber-500/50 flex items-center gap-1"
            >
              <Shield className="w-3 h-3" />
              Trusted Shop
            </motion.span>
          )}

          {result.condition && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-gray-500/20 text-gray-300">
              {result.condition}
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="font-bold text-white mb-2 line-clamp-2 text-sm sm:text-base group-hover:text-cyan-300 transition-colors">
          {result.title}
        </h3>

        {/* Spacer for flex layout */}
        <div className="flex-1" />

        {/* Price */}
        <div className="mb-4">
          {result.price ? (
            <p className="text-2xl sm:text-3xl font-bold text-cyan-300 mb-1">
              {result.price}
            </p>
          ) : (
            <p className="text-sm text-gray-500">Price unavailable</p>
          )}
        </div>

        {/* View button */}
        <motion.a
          href={result.link}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 group/btn"
        >
          View on Japanese Site
          <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </motion.a>
      </div>
    </motion.div>
  )
}

/**
 * Terminal-style reasoning trace sidebar
 */
const ReasoningTerminal: React.FC<{ traces: ReasoningTrace[] }> = ({ traces }) => {
  const [isExpanded, setIsExpanded] = React.useState(true)
  const terminalRef = React.useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new traces are added
  React.useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [traces])

  const getTraceColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'text-green-400'
      case 'error':
        return 'text-red-400'
      case 'warning':
        return 'text-yellow-400'
      default:
        return 'text-cyan-400'
    }
  }

  const getTraceIcon = (type: string) => {
    switch (type) {
      case 'success':
        return '✓'
      case 'error':
        return '✗'
      case 'warning':
        return '⚠'
      default:
        return '>'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="fixed bottom-0 right-0 z-50"
    >
      <motion.div
        animate={{
          width: isExpanded ? 400 : 50,
          height: isExpanded ? 400 : 50,
        }}
        className="rounded-tl-2xl border-l border-t border-cyan-500/30 bg-gray-950/80 backdrop-blur-sm shadow-2xl overflow-hidden"
      >
        {/* Terminal header */}
        <div className="border-b border-cyan-500/30 p-3 flex items-center justify-between bg-gray-900/50">
          {isExpanded && (
            <>
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-mono text-cyan-400">Agent Trace</span>
              </div>
            </>
          )}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-cyan-500/20 rounded transition-colors"
          >
            <ChevronDown
              className="w-4 h-4 text-cyan-400"
              style={{
                transform: isExpanded ? 'rotate(0deg)' : 'rotate(180deg)',
              }}
            />
          </motion.button>
        </div>

        {/* Terminal output */}
        {isExpanded && (
          <div
            ref={terminalRef}
            className="h-96 overflow-y-auto p-4 font-mono text-xs space-y-1 bg-gray-950"
          >
            <div className="text-cyan-400 mb-2">$ anime-agent --verbose</div>

            <AnimatePresence>
              {traces.length === 0 ? (
                <div className="text-gray-600">Waiting for operations...</div>
              ) : (
                traces.map((trace, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0 }}
                    className={`${getTraceColor(trace.type)} flex gap-2`}
                  >
                    <span className="flex-shrink-0 w-4">{getTraceIcon(trace.type)}</span>
                    <span className="flex-1">{trace.message}</span>
                    <span className="text-gray-700 flex-shrink-0 text-xs">
                      {new Date(trace.timestamp).toLocaleTimeString()}
                    </span>
                  </motion.div>
                ))
              )}
            </AnimatePresence>

            {traces.length > 0 && (
              <motion.div
                animate={{ opacity: [0.3, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="text-cyan-400"
              >
                _
              </motion.div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

/**
 * Main ResultsDisplay component with Bento Grid
 */
export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({
  results,
  analysisData,
  reasoning,
  isLoading,
  onViewMore,
}) => {
  // Sort results: in-stock first, then by price
  const sortedResults = useMemo(() => {
    return [...results].sort((a, b) => {
      // In-stock items first
      if (a.isAvailable !== b.isAvailable) {
        return a.isAvailable ? -1 : 1
      }
      // Then by price (lowest first)
      if (a.price && b.price) {
        const priceA = parseInt(a.price.replace(/[^\d]/g, ''), 10)
        const priceB = parseInt(b.price.replace(/[^\d]/g, ''), 10)
        return priceA - priceB
      }
      return 0
    })
  }, [results])

  // Determine featured item (first available in-stock item with price)
  const featuredIndex = useMemo(() => {
    return sortedResults.findIndex((r) => r.isAvailable && r.price)
  }, [sortedResults])

  if (!isLoading && !results.length) {
    return null
  }

  return (
    <>
      {/* Reasoning terminal sidebar */}
      <ReasoningTerminal traces={reasoning} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-6xl mx-auto mt-8 pr-4 sm:pr-0"
      >
        {/* Header */}
        {analysisData && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 rounded-2xl border border-blue-500/30 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 backdrop-blur-sm p-6"
          >
            <div className="flex items-center gap-3 mb-2">
              <Terminal className="w-5 h-5 text-cyan-400" />
              <h2 className="text-2xl font-bold text-white">
                Search Results for {analysisData.character}
              </h2>
            </div>
            <p className="text-sm text-cyan-300">
              Series: <span className="font-semibold">{analysisData.series}</span> |
              Keywords: <span className="font-semibold">{analysisData.jpKeywords}</span>
            </p>
          </motion.div>
        )}

        {/* Bento Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-max"
        >
          {sortedResults.map((result, idx) => (
            <BentoCard
              key={idx}
              result={result}
              index={idx}
              isFeatured={idx === featuredIndex && featuredIndex >= 0}
            />
          ))}
        </motion.div>

        {/* Summary */}
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 p-4 rounded-lg border border-dark-border bg-dark-surface/50"
          >
            <p className="text-sm text-gray-400">
              Showing{' '}
              <span className="font-semibold text-white">{results.length}</span> items on{' '}
              <span className="font-semibold text-cyan-300">Mercari & Suruga-Ya</span>
            </p>
          </motion.div>
        )}
      </motion.div>
    </>
  )
}
