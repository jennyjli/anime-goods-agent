import { useState } from 'react'

export interface AnalysisResult {
  series: string
  character: string
  jpKeywords: string
  reasoning: string
}

interface UseAnalyzeImageResult {
  isLoading: boolean
  error: string | null
  result: AnalysisResult | null
  analyzeImage: (file: File) => Promise<void>
  reset: () => void
}

export function useAnalyzeImage(): UseAnalyzeImageResult {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<AnalysisResult | null>(null)

  const analyzeImage = async (file: File): Promise<void> => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Validate file
      if (!file.type.startsWith('image/')) {
        throw new Error('File must be an image')
      }

      const maxSizeMB = 10
      const maxSizeBytes = maxSizeMB * 1024 * 1024
      if (file.size > maxSizeBytes) {
        throw new Error(`File size must be less than ${maxSizeMB}MB`)
      }

      // Convert file to base64
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string
          const base64 = result.split(',')[1]
          resolve(base64)
        }
        reader.onerror = () => reject(new Error('Failed to read file'))
      })

      reader.readAsDataURL(file)
      const base64 = await base64Promise

      // Call API
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
          mimeType: file.type,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Analysis failed')
      }

      setResult(data as AnalysisResult)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      setError(errorMessage)
      console.error('Analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setIsLoading(false)
    setError(null)
    setResult(null)
  }

  return {
    isLoading,
    error,
    result,
    analyzeImage,
    reset,
  }
}
