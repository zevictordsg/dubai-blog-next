'use client'

import { useState } from 'react'

export default function HomeNewsletter() {
  const [email,  setEmail]  = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'ok' | 'err'>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const body = new FormData()
      body.append('email', email)
      const res  = await fetch('/api/lead', { method: 'POST', body })
      const data = await res.json() as { success: boolean }
      setStatus(data.success ? 'ok' : 'err')
    } catch {
      setStatus('err')
    }
  }

  return (
    <section className="newsletter-section" id="newsletter" aria-labelledby="newsletter-heading">
      <div className="container newsletter-inner">
        <div className="newsletter-copy" data-animate>
          <h2 id="newsletter-heading" className="heading-md" style={{ color: '#fff', maxWidth: 520 }}>
            Receba análises sobre o mercado imobiliário de Dubai no seu e-mail.
          </h2>
          <p style={{ fontSize: 16, lineHeight: 1.7, color: 'rgba(255,255,255,.72)', maxWidth: 520 }}>
            A cada quinzena, enviamos uma leitura objetiva sobre o que realmente importa para quem está avaliando Dubai: dados de mercado, mudanças de regra, regiões em destaque, custos, riscos e respostas às principais dúvidas dos investidores brasileiros.
          </p>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', marginTop: 4 }}>
            Sem spam, sem urgência artificial e sem promessas de retorno.
          </p>
        </div>

        <div className="newsletter-form-wrap" data-animate>
          {status === 'ok' ? (
            <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--gold)', maxWidth: 400 }}>
              ✓ Ótimo! Você receberá nossas análises em breve.
            </p>
          ) : (
            <form className="newsletter-form" onSubmit={submit}>
              <input
                type="email"
                className="newsletter-input"
                placeholder="Seu melhor e-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={status === 'loading'}
                aria-label="Seu e-mail"
              />
              <button
                type="submit"
                className="btn btn-gold"
                disabled={status === 'loading'}
                style={{ flexShrink: 0 }}
              >
                {status === 'loading' ? 'Enviando…' : 'Quero receber as análises'}
              </button>
              {status === 'err' && (
                <p style={{ fontSize: 13, color: '#f87171', marginTop: 4, gridColumn: '1/-1' }}>
                  Erro ao enviar. Tente novamente.
                </p>
              )}
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,.35)', marginTop: 4, gridColumn: '1/-1' }}>
                Você pode cancelar quando quiser. Seus dados são tratados conforme a LGPD.
              </p>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
