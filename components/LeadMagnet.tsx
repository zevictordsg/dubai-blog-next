'use client'

import { useState } from 'react'

export default function LeadMagnet() {
  const [email,   setEmail]   = useState('')
  const [status,  setStatus]  = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')
  const [message, setMessage] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const body = new FormData()
      body.append('email', email)
      const res  = await fetch('/api/lead', { method: 'POST', body })
      const data = await res.json() as { success: boolean; message?: string }
      if (data.success) { setStatus('ok');  setMessage(data.message ?? 'Guia enviado!'); setEmail('') }
      else              { setStatus('err'); setMessage(data.message ?? 'Erro ao enviar.') }
    } catch {
      setStatus('err'); setMessage('Erro de conexão. Tente novamente.')
    }
  }

  return (
    <section className="lead-section" id="lead">
      <div className="container lead-inner">
        {/* Copy */}
        <div className="lead-copy">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="eyebrow">Material gratuito</span>
            <h2 className="heading-md" style={{ maxWidth: 508 }}>
              Guia Completo: Como Investir em Imóveis em Dubai Sendo Brasileiro
            </h2>
          </div>
          <p className="body-lg" style={{ fontSize: 20, maxWidth: 486 }}>
            PDF com 40 páginas — jurídico, tributário, ROI por região e checklist de compra
          </p>
        </div>

        {/* Form */}
        {status === 'ok' ? (
          <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--green)', maxWidth: 400 }}>
            ✓ {message}
          </p>
        ) : (
          <form className="lead-form" onSubmit={submit} style={{ maxWidth: 583 }}>
            <input
              type="email"
              className="lead-input"
              placeholder="Seu melhor e-mail"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              disabled={status === 'loading'}
            />
            <button type="submit" className="btn btn-gold" disabled={status === 'loading'} style={{ flexShrink: 0, gap: 10 }}>
              {status === 'loading' ? 'Enviando…' : (
                <>
                  Baixar
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                    <path d="M10 3v10M6 9l4 4 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 16h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  </svg>
                </>
              )}
            </button>
          </form>
        )}
        {status === 'err' && <p style={{ fontSize: 14, color: '#c00', marginTop: 4 }}>{message}</p>}
      </div>
    </section>
  )
}
