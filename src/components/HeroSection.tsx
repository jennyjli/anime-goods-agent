'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { ImageUploadZone } from './ImageUploadZone'
import { AnalysisResults } from './AnalysisResults'
import { useAnalyzeImage } from '@/lib/useAnalyzeImage'
import { Sparkles } from 'lucide-react'

export const HeroSection: React.FC = () => {
  const { isLoading, error, result, analyzeImage, reset } = useAnalyzeImage()
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null)

  const handleImageSelect = (file: File) => {
    setSelectedFile(file)
    console.log('Image selected:', file.name)
  }

  const handleAnalyze = async () => {
    if (selectedFile) {
      await analyzeImage(selectedFile)
    }
  }

  const handleReset = () => {
    reset()
    setSelectedFile(null)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut',
      },
    },
  }

  return (
    <motion.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative min-h-screen flex items-center justify-center bg-dark-bg overflow-hidden px-4 sm:px-6 lg:px-8"
    >
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl opacity-20" />
        <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl opacity-10" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-4xl mx-auto">
        <motion.div variants={itemVariants} className="text-center mb-12">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-dark-border bg-dark-surface/80 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-gray-300">
              AI-Powered Anime Merchandise Discovery
            </span>
          </motion.div>

          {/* Main title */}
          <motion.h1
            variants={itemVariants}
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6"
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-100 to-gray-400">
              Anime Goods
            </span>
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500">
              Agent
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            variants={itemVariants}
            className="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-12"
          >
            Upload an image of your favorite anime character or merchandise, and let our AI agent
            help you discover similar products, pricing, and recommendations across the web.
          </motion.p>
        </motion.div>

        {/* Image upload zone */}
        <motion.div variants={itemVariants} className="mb-8">
          <ImageUploadZone onImageSelect={handleImageSelect} />
        </motion.div>

        {/* Analysis Results */}
        <AnalysisResults
          result={result}
          isLoading={isLoading}
          error={error}
          onReset={handleReset}
        />

        {/* CTA buttons - Only show when no result/error */}
        {!result && !error && (
          <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(59, 130, 246, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={handleAnalyze}
              disabled={!selectedFile || isLoading}
              className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Analyzing...' : 'Analyze Image'}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 rounded-lg border border-gray-600 hover:border-gray-400 text-white font-semibold transition-all duration-300 hover:bg-white/5 cursor-pointer"
            >
              Learn More
            </motion.button>
          </motion.div>
        )}

        {/* Features row */}
        {!result && !error && (
          <motion.div
            variants={itemVariants}
            className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-6 text-center"
          >
            {[
              { label: 'Instant Analysis', desc: 'Get results in seconds' },
              { label: 'Smart Matching', desc: 'Find similar products' },
              { label: 'Verified Sources', desc: 'Trusted retailers only' },
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                className="p-4 rounded-lg border border-dark-border/50 bg-dark-surface/30 backdrop-blur-sm"
              >
                <p className="font-semibold text-white mb-1">{feature.label}</p>
                <p className="text-sm text-gray-500">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.section>
  )
}
