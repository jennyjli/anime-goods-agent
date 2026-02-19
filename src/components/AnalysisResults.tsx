'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, AlertCircle, Loader, Copy } from 'lucide-react'
import { AnalysisResult } from '@/lib/useAnalyzeImage'

interface AnalysisResultsProps {
  result: AnalysisResult | null
  isLoading: boolean
  error: string | null
  onReset: () => void
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  result,
  isLoading,
  error,
  onReset,
}) => {
  const [copiedField, setCopiedField] = React.useState<string | null>(null)

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text)
    setCopiedField(field)
    setTimeout(() => setCopiedField(null), 2000)
  }

  if (!isLoading && !result && !error) {
    return null
  }

  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto mt-8"
      >
        <div className="rounded-2xl border border-dark-border bg-dark-surface/50 backdrop-blur-sm p-8">
          <div className="flex items-center justify-center gap-4">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <Loader className="w-6 h-6 text-blue-400" />
            </motion.div>
            <span className="text-lg text-gray-300">Analyzing your anime image...</span>
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
        className="w-full max-w-2xl mx-auto mt-8"
      >
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm p-8">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-300 mb-2">Analysis Failed</h3>
              <p className="text-red-200 mb-4">{error}</p>
              <button
                onClick={onReset}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                Try Another Image
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )
  }

  if (!result) {
    return null
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto mt-8"
    >
      <div className="rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/10 to-emerald-500/10 backdrop-blur-sm p-8">
        {/* Success header */}
        <div className="flex items-center gap-3 mb-6">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <Check className="w-6 h-6 text-green-400" />
          </motion.div>
          <h3 className="text-xl font-bold text-white">Analysis Complete</h3>
        </div>

        {/* Results grid */}
        <div className="space-y-4 mb-6">
          {/* Series */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="p-4 rounded-lg bg-dark-surface/50 border border-dark-border"
          >
            <p className="text-sm text-gray-400 mb-1">Anime Series</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-lg font-semibold text-white">{result.series}</p>
              <button
                onClick={() => copyToClipboard(result.series, 'series')}
                className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                title="Copy series name"
              >
                <Copy className="w-4 h-4 text-gray-400 hover:text-gray-200" />
              </button>
            </div>
            {copiedField === 'series' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-green-400 mt-2"
              >
                Copied!
              </motion.p>
            )}
          </motion.div>

          {/* Character */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.35 }}
            className="p-4 rounded-lg bg-dark-surface/50 border border-dark-border"
          >
            <p className="text-sm text-gray-400 mb-1">Character</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-lg font-semibold text-white">{result.character}</p>
              <button
                onClick={() => copyToClipboard(result.character, 'character')}
                className="p-2 hover:bg-dark-border rounded-lg transition-colors"
                title="Copy character name"
              >
                <Copy className="w-4 h-4 text-gray-400 hover:text-gray-200" />
              </button>
            </div>
            {copiedField === 'character' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-green-400 mt-2"
              >
                Copied!
              </motion.p>
            )}
          </motion.div>

          {/* Japanese Keywords */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="p-4 rounded-lg bg-dark-surface/50 border border-dark-border"
          >
            <p className="text-sm text-gray-400 mb-1">Mercari Search Keywords (日本語)</p>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-cyan-300 break-words">
                  {result.jpKeywords}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Use these terms to search Japanese auction sites
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(result.jpKeywords, 'keywords')}
                className="p-2 hover:bg-dark-border rounded-lg transition-colors flex-shrink-0"
                title="Copy keywords"
              >
                <Copy className="w-4 h-4 text-gray-400 hover:text-gray-200" />
              </button>
            </div>
            {copiedField === 'keywords' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-green-400 mt-2"
              >
                Copied!
              </motion.p>
            )}
          </motion.div>

          {/* Optimized Search Keyword */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.42 }}
            className="p-4 rounded-lg bg-dark-surface/50 border border-blue-500/30"
          >
            <p className="text-sm text-gray-400 mb-1">Optimized Search Keyword</p>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-base font-semibold text-blue-300 break-words">
                  {result.searchKeyword}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Concise phrase used for web search
                </p>
              </div>
              <button
                onClick={() => copyToClipboard(result.searchKeyword, 'searchKeyword')}
                className="p-2 hover:bg-dark-border rounded-lg transition-colors flex-shrink-0"
                title="Copy search keyword"
              >
                <Copy className="w-4 h-4 text-gray-400 hover:text-gray-200" />
              </button>
            </div>
            {copiedField === 'searchKeyword' && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-green-400 mt-2"
              >
                Copied!
              </motion.p>
            )}
          </motion.div>

          {/* Reasoning */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45 }}
            className="p-4 rounded-lg bg-dark-surface/50 border border-dark-border"
          >
            <p className="text-sm text-gray-400 mb-1">Analysis Reasoning</p>
            <p className="text-sm text-gray-300 leading-relaxed">{result.reasoning}</p>
          </motion.div>
        </div>

        {/* Action buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <button
            onClick={onReset}
            className="flex-1 px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors"
          >
            Analyze Another Image
          </button>
          <button
            onClick={() => {
              const text = `Series: ${result.series}\nCharacter: ${result.character}\nKeywords: ${result.jpKeywords}\nSearch Keyword: ${result.searchKeyword}\nReasoning: ${result.reasoning}`
              copyToClipboard(text, 'all')
            }}
            className="flex-1 px-4 py-3 rounded-lg border border-gray-600 hover:border-gray-400 text-white font-semibold transition-colors hover:bg-white/5"
          >
            Copy All Results
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
