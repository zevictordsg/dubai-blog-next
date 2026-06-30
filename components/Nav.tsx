'use client'

import Link  from 'next/link'
import { useState, useEffect, useRef } from 'react'
import type { WPCategory } from '@/lib/wordpress'

interface NavProps {
  categories:  WPCategory[]
  currentPath?: string
}

export default function Nav({ categories, currentPath = '' }: NavProps) {
  const [open, setOpen]  = useState(false)
  const drawerRef        = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) setOpen(false)
    }
    if (open) document.addEventListener('mousedown', h)
    return () => document.removeEventListener('mousedown', h)
  }, [open])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const topCats = categories.slice(0, 6)

  return (
    <>
      <nav className="nav-wrap">
        <div className="nav-inner">
          {/* Logo — SVG vetorial, nítido em qualquer DPI */}
          <Link href="/" className="nav-logo" onClick={() => setOpen(false)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/imagens/logo.svg"
              alt="Dubai Imóveis"
              height={26}
              style={{ height: 26, width: 'auto', display: 'block' }}
            />
          </Link>

          {/* Desktop links */}
          <div className="nav-links">
            {topCats.map((cat) => (
              <Link
                key={cat.id}
                href={`/categoria/${cat.slug}`}
                className={currentPath.includes(cat.slug) ? 'active' : ''}
              >
                {cat.name}
              </Link>
            ))}
            <Link href="/sobre" className={currentPath === '/sobre' ? 'active' : ''}>
              Sobre
            </Link>
          </div>

          {/* CTA */}
          <Link href="/#lead" className="btn btn-white nav-cta" style={{ fontSize: 14, padding: '8px 18px', opacity: .7 }}>
            Fale com Especialista
          </Link>

          {/* Mobile hamburger */}
          <button
            className="nav-toggle"
            aria-label={open ? 'Fechar menu' : 'Abrir menu'}
            aria-expanded={open}
            onMouseDown={(e) => e.stopPropagation()}
            onClick={() => setOpen(v => !v)}
          >
            <span style={open ? { transform: 'rotate(45deg) translate(5px,5px)' }  : undefined} />
            <span style={open ? { opacity: 0 }                                      : undefined} />
            <span style={open ? { transform: 'rotate(-45deg) translate(5px,-5px)' } : undefined} />
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div ref={drawerRef} className={`nav-drawer${open ? ' open' : ''}`}>
        {topCats.map((cat) => (
          <Link key={cat.id} href={`/categoria/${cat.slug}`} onClick={() => setOpen(false)}>
            {cat.name}
          </Link>
        ))}
        <Link href="/sobre" onClick={() => setOpen(false)}>
          Sobre
        </Link>
        <Link
          href="/#lead"
          className="btn btn-white"
          style={{ textAlign: 'center', marginTop: 8, opacity: .7 }}
          onClick={() => setOpen(false)}
        >
          Fale com Especialista
        </Link>
      </div>
    </>
  )
}
