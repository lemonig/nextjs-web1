'use client'

import { useCallback, useEffect, useRef } from 'react'

export function useThrottle<A extends unknown[]>(
  callback: (...args: A) => void,
  delay = 300,
): (...args: A) => void {
  const lastRun = useRef(0)
  const callbackRef = useRef(callback)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  return useCallback(
    (...args: A) => {
      const now = Date.now()
      if (now - lastRun.current >= delay) {
        lastRun.current = now
        callbackRef.current(...args)
      }
    },
    [delay],
  )
}
