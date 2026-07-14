'use client'

import { useEffect, useRef, useState } from 'react'

interface UseTableHeightOptions {
  offset?: number
  minHeight?: number
}

export function useTableHeight<T extends HTMLElement = HTMLDivElement>(
  options: UseTableHeightOptions = {},
) {
  const { offset = 0, minHeight = 120 } = options
  const containerRef = useRef<T>(null)
  const [scrollY, setScrollY] = useState<number>()

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const compute = () => {
      const height = el.clientHeight - offset
      setScrollY(Math.max(height, minHeight))
    }

    compute()
    const observer = new ResizeObserver(compute)
    observer.observe(el)
    window.addEventListener('resize', compute)

    return () => {
      observer.disconnect()
      window.removeEventListener('resize', compute)
    }
  }, [offset, minHeight])

  return { containerRef, scrollY }
}
