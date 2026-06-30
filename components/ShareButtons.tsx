'use client'
import { useState } from 'react'

interface ShareButtonsProps {
  title: string
  url:   string
}

export default function ShareButtons({ title, url }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const waHref = `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`
  const twHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback: select text manually
    }
  }

  const btnBase: React.CSSProperties = {
    display:        'inline-flex',
    alignItems:     'center',
    gap:            8,
    padding:        '10px 18px',
    borderRadius:   48,
    fontSize:       14,
    fontWeight:     600,
    cursor:         'pointer',
    transition:     'all .2s',
    textDecoration: 'none',
    border:         'none',
  }

  return (
    <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
      {/* WhatsApp */}
      <a
        href={waHref}
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...btnBase, background: '#25d366', color: '#fff' }}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.55 4.103 1.514 5.83L.057 23.214a.5.5 0 0 0 .62.62l5.463-1.426A11.935 11.935 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
        </svg>
        WhatsApp
      </a>

      {/* Twitter/X */}
      <a
        href={twHref}
        target="_blank"
        rel="noopener noreferrer"
        style={{ ...btnBase, background: '#000', color: '#fff' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
        X / Twitter
      </a>

      {/* Copy link */}
      <button
        onClick={handleCopy}
        style={{
          ...btnBase,
          background:   'var(--bg)',
          border:       '1.5px solid var(--border)',
          color:        'var(--dark)',
          fontFamily:   'inherit',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
        </svg>
        {copied ? 'Copiado!' : 'Copiar link'}
      </button>
    </div>
  )
}
