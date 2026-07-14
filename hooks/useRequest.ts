'use client'

import { useCallback, useState } from 'react'

interface UseRequestState<T> {
  data: T | undefined
  loading: boolean
  error: Error | null
}

interface UseRequestResult<T, A extends unknown[]> extends UseRequestState<T> {
  run: (...args: A) => Promise<T | undefined>
  reset: () => void
}

export function useRequest<T, A extends unknown[] = []>(
  service: (...args: A) => Promise<T>,
): UseRequestResult<T, A> {
  const [state, setState] = useState<UseRequestState<T>>({
    data: undefined,
    loading: false,
    error: null,
  })

  const run = useCallback(
    async (...args: A) => {
      setState((s) => ({ ...s, loading: true, error: null }))
      try {
        const data = await service(...args)
        setState({ data, loading: false, error: null })
        return data
      } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        setState((s) => ({ ...s, loading: false, error }))
        return undefined
      }
    },
    [service],
  )

  const reset = useCallback(() => {
    setState({ data: undefined, loading: false, error: null })
  }, [])

  return { ...state, run, reset }
}
