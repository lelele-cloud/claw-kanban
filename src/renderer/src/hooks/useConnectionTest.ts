import { useState, useCallback } from 'react'

export type ConnectionStatus = 'idle' | 'testing' | 'success' | 'error'

interface ConnectionTestResult {
  status: ConnectionStatus
  message: string
  latency: number | undefined
  test: (type: string, config: Record<string, unknown>) => Promise<void>
  reset: () => void
}

export function useConnectionTest(): ConnectionTestResult {
  const [status, setStatus] = useState<ConnectionStatus>('idle')
  const [message, setMessage] = useState('')
  const [latency, setLatency] = useState<number>()

  const test = useCallback(async (type: string, config: Record<string, unknown>) => {
    setStatus('testing')
    setMessage('')
    setLatency(undefined)
    try {
      const result = await window.api.connection.test(type, config)
      setStatus(result.success ? 'success' : 'error')
      setMessage(result.message)
      setLatency(result.latencyMs)
    } catch (err) {
      setStatus('error')
      setMessage(err instanceof Error ? err.message : '测试失败')
    }
  }, [])

  const reset = useCallback(() => {
    setStatus('idle')
    setMessage('')
    setLatency(undefined)
  }, [])

  return { status, message, latency, test, reset }
}
