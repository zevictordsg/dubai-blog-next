import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = { title: '404 — Página não encontrada | Dubai Imóveis' }

export default function NotFound() {
  return (
    <div className="not-found">
      <div className="not-found-content">
        <p className="not-found-code">404</p>
        <h1 className="heading-lg">Página não encontrada</h1>
        <p className="body-lg" style={{ fontSize: 18 }}>
          Este conteúdo pode ter sido movido ou removido. Explore nossos artigos mais recentes.
        </p>
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', justifyContent: 'center' }}>
          <Link href="/" className="btn btn-gold">Ir para o início</Link>
          <Link href="/categoria/investimento" className="btn btn-outline">Ver artigos</Link>
        </div>
      </div>
    </div>
  )
}
