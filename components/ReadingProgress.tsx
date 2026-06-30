'use client'
import { useEffect, useState } from 'react'

export default function ReadingProgress() {
  const [pct, setPct] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el    = document.documentElement
      const scrolled = el.scrollTop
      const total = el.scrollHeight - el.clientHeight
      setPct(total > 0 ? Math.min(100, (scrolled / total) * 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      style={{
        position:       'fixed',
        top:            0,
        left:           0,
        width:          `${pct}%`,
        height:         3,
        background:     'var(--gold)',
        zIndex:         200,
        transition:     'width .1s linear',
        pointerEvents:  'none',
      }}
      aria-hidden="true"
    />
  )
}
