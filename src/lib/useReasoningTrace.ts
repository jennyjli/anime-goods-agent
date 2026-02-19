import { useState, useEffect } from 'react'

/**
 * Terminal-style reasoning trace for showing agent actions
 */
export interface ReasoningTrace {
  timestamp: number
  message: string
  type: 'info' | 'success' | 'warning' | 'error'
}

/**
 * Create a reasoning trace message
 */
export function createTrace(
  message: string,
  type: 'info' | 'success' | 'warning' | 'error' = 'info'
): ReasoningTrace {
  return {
    timestamp: Date.now(),
    message,
    type,
  }
}

/**
 * Hook to manage reasoning trace state
 */
export function useReasoningTrace() {
  const [traces, setTraces] = useState<ReasoningTrace[]>([])

  const addTrace = (message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info') => {
    const trace = createTrace(message, type)
    setTraces((prev) => [...prev, trace])
  }

  const clearTraces = () => {
    setTraces([])
  }

  const reset = () => {
    clearTraces()
  }

  return {
    traces,
    addTrace,
    clearTraces,
    reset,
  }
}
