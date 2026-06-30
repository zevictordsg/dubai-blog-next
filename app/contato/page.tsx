'use client'

import { useState } from 'react'

const WA_NUMBER = '5511999999999'
const WA_MSG    = encodeURIComponent('Olá! Vi o Dubai Imóveis e quero saber mais sobre como investir em Dubai.')
const WA_HREF   = `https://wa.me/${WA_NUMBER}?text=${WA_MSG}`

export default function ContatoPage() {
  const [form, setForm]       = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate a short delay (no backend needed)
    await new Promise(r => setTimeout(r, 800))
    setLoading(false)
    setSubmitted(true)
  }

  return (
    <div className="legal-page">
      <div className="container">
        <header className="legal-header">
          <h1 className="legal-title">Contato</h1>
          <p className="legal-updated">Fale com a equipe Dubai Imóveis</p>
        </header>

        <div className="legal-body" style={{ maxWidth: 780 }}>

          {/* WhatsApp CTA */}
          <section className="legal-section">
            <h2>Fale direto pelo WhatsApp</h2>
            <p>
              Para dúvidas rápidas, indicação de especialistas ou qualquer assunto relacionado a investimentos em Dubai, o caminho mais rápido é o WhatsApp. Nossa equipe responde em horário comercial de segunda a sexta (Brasília).
            </p>
            <div style={{ marginTop: 24 }}>
              <a
                href={WA_HREF}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-green"
                style={{ fontSize: 15, padding: '14px 28px', gap: 10 }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.55 4.103 1.514 5.83L.057 23.214a.5.5 0 0 0 .62.62l5.463-1.426A11.935 11.935 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
                Abrir WhatsApp
              </a>
            </div>
          </section>

          {/* Email */}
          <section className="legal-section">
            <h2>E-mail</h2>
            <p>
              Para assuntos editoriais, parcerias e imprensa, escreva para{' '}
              <a href="mailto:contato@dubaimoveis.com" style={{ color: 'var(--gold)', fontWeight: 600 }}>
                contato@dubaimoveis.com
              </a>
              . O prazo de resposta é de até 2 dias úteis.
            </p>
          </section>

          {/* Contact form */}
          <section className="legal-section">
            <h2>Envie uma mensagem</h2>
            <p>Preencha o formulário abaixo e entraremos em contato.</p>

            {submitted ? (
              <div
                style={{
                  marginTop: 32,
                  padding: '32px',
                  background: 'rgba(58, 167, 73, .08)',
                  border: '1.5px solid rgba(58, 167, 73, .3)',
                  borderRadius: 16,
                  textAlign: 'center',
                }}
              >
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" style={{ margin: '0 auto 16px' }} aria-hidden="true">
                  <circle cx="12" cy="12" r="10" stroke="var(--green)" strokeWidth="2"/>
                  <path d="M8 12l3 3 5-5" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <p style={{ fontSize: 18, fontWeight: 600, color: 'var(--dark)', marginBottom: 8 }}>
                  Mensagem enviada com sucesso!
                </p>
                <p style={{ fontSize: 15, color: 'var(--text-muted)' }}>
                  Recebemos sua mensagem e entraremos em contato em até 2 dias úteis.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 20, marginTop: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label htmlFor="name" style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>
                    Nome completo
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    placeholder="Seu nome"
                    value={form.name}
                    onChange={handleChange}
                    className="lead-input"
                    style={{ maxWidth: 480 }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label htmlFor="email" style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>
                    E-mail
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="seu@email.com"
                    value={form.email}
                    onChange={handleChange}
                    className="lead-input"
                    style={{ maxWidth: 480 }}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <label htmlFor="message" style={{ fontSize: 14, fontWeight: 600, color: 'var(--dark)' }}>
                    Mensagem
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    required
                    rows={6}
                    placeholder="Como podemos ajudar?"
                    value={form.message}
                    onChange={handleChange}
                    className="lead-input"
                    style={{ resize: 'vertical', maxWidth: 600, fontFamily: 'inherit' }}
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-gold"
                    style={{ fontSize: 15, padding: '14px 32px', opacity: loading ? .7 : 1 }}
                  >
                    {loading ? 'Enviando...' : 'Enviar mensagem'}
                  </button>
                </div>
              </form>
            )}
          </section>

        </div>
      </div>
    </div>
  )
}
