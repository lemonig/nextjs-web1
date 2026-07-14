'use client'

import { useEffect, useRef, useState } from 'react'

export function useTableScroll<T extends HTMLElement = HTMLDivElement>() {
  const containerRef = useRef<T>(null)
  const [scrollX, setScrollX] = useState<number>()

  useEffect(() => {
    const el = containerRef.current
    if (!el || typeof ResizeObserver === 'undefined') return

    const compute = () => {
      setScrollX(el.scrollWidth > el.clientWidth ? el.scrollWidth : undefined)
    }

    compute()
    const observer = new ResizeObserver(compute)
    observer.observe(el)

    return () => observer.disconnect()
  }, [])

  return { containerRef, scrollX }
}
