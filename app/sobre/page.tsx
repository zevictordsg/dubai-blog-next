import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Guilherme Lemos — GAP Capital Real Estate',
  description:
    'Conheça Guilherme Lemos, especialista em dolarização de patrimônio e investimento imobiliário em Dubai para brasileiros, com mais de 15 anos de experiência.',
}

const WA_HREF = `https://wa.me/5511999999999?text=${encodeURIComponent('Olá Guilherme! Encontrei o blog da GAP Capital e gostaria de agendar uma análise personalizada.')}`

const STATS = [
  { num: '15+', label: 'anos de experiência' },
  { num: '2',   label: 'mercados internacionais' },
  { num: '100+', label: 'investidores assessorados' },
]

export default function SobrePage() {
  return (
    <>
      {/* ── Hero do autor ─────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--dark)',
          padding: '100px 0 80px',
          position: 'relative',
          overflow: 'hidden',
        }}
        aria-label="Sobre Guilherme Lemos"
      >
        <div
          className="container"
          style={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            gap: 48,
            alignItems: 'center',
          }}
        >
          {/* Avatar */}
          <div
            aria-hidden="true"
            style={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'rgba(255,255,255,.06)',
              border: '2px solid var(--gold)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 40,
              fontWeight: 300,
              color: 'var(--gold)',
              letterSpacing: '.04em',
              flexShrink: 0,
            }}
          >
            GL
          </div>

          {/* Texto */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="eyebrow">Sobre o autor</span>
            <h1
              style={{
                fontSize: 'clamp(28px, 3.5vw, 48px)',
                fontWeight: 300,
                color: '#fff',
                letterSpacing: '-.03em',
                lineHeight: 1.15,
              }}
            >
              Guilherme Lemos
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(255,255,255,.55)', maxWidth: 520 }}>
              Especialista em Investimento Imobiliário Internacional · GAP Capital Real Estate
            </p>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section
        style={{
          background: 'var(--dark)',
          borderTop: '1px solid rgba(255,255,255,.07)',
          padding: '40px 0',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            gap: 48,
            flexWrap: 'wrap',
          }}
        >
          {STATS.map((s, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: 32, fontWeight: 300, color: 'var(--gold)' }}>{s.num}</span>
              <span style={{ fontSize: 14, color: 'rgba(255,255,255,.45)', textTransform: 'uppercase', letterSpacing: '.08em' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Bio ───────────────────────────────────────────────────────────── */}
      <section className="section" aria-labelledby="sobre-bio">
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 80,
              alignItems: 'start',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <h2
                id="sobre-bio"
                style={{
                  fontSize: 'clamp(22px, 2.2vw, 32px)',
                  fontWeight: 300,
                  letterSpacing: '-.03em',
                  color: 'var(--dark)',
                }}
              >
                Sobre Guilherme
              </h2>
              <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--text)', opacity: .8 }}>
                Guilherme Lemos é especialista em dolarização de patrimônio por meio de imóveis, com mais de 15 anos de experiência ajudando investidores brasileiros a construir renda e patrimônio em moeda forte.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--text)', opacity: .8 }}>
                Sua trajetória foi construída no mercado de Orlando, nos Estados Unidos, assessorando investidores, famílias e compradores internacionais ao longo de mais de uma década. Hoje, também atua no mercado de Dubai à frente da GAP Capital Real Estate, com foco em curadoria de projetos, análise estratégica e educação para investidores brasileiros de alta renda.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--text)', opacity: .8 }}>
                Nos conteúdos deste blog, o objetivo é traduzir o mercado imobiliário de Dubai para o investidor brasileiro: explicando regras, custos, oportunidades, riscos e diferenças em relação a outros mercados internacionais.
              </p>
              <p style={{ fontSize: 17, lineHeight: 1.8, color: 'var(--text)', opacity: .8 }}>
                {/* Texto complementar — a ser preenchido pelo cliente */}
                [Espaço para texto adicional sobre trajetória e diferenciais — a ser preenchido pelo cliente.]
              </p>
            </div>

            {/* Sidebar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              <div
                style={{
                  background: 'var(--dark)',
                  borderRadius: 24,
                  padding: '40px 36px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 20,
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 500, color: '#fff' }}>
                  Fale com Guilherme
                </h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,.55)' }}>
                  Agende uma análise personalizada do seu perfil de investimento. Sem compromisso, sem promessa de retorno.
                </p>
                <a
                  href={WA_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-gold"
                  style={{ justifyContent: 'center' }}
                >
                  Solicitar análise personalizada
                </a>
              </div>

              <div
                id="valores"
                style={{
                  border: '1px solid var(--border)',
                  borderRadius: 24,
                  padding: '36px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 16,
                }}
              >
                <h3 style={{ fontSize: 18, fontWeight: 500, color: 'var(--dark)' }}>
                  Valores editoriais
                </h3>
                {[
                  ['Dados sem promessas', 'Análises baseadas em dados reais de mercado, não em argumentos de venda.'],
                  ['Transparência sobre riscos', 'Investimento internacional envolve riscos reais. Nunca os minimizamos.'],
                  ['Decisão informada', 'O conteúdo existe para preparar o investidor — não para substituir uma análise personalizada.'],
                ].map(([title, desc], i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    <p style={{ fontSize: 15, fontWeight: 500, color: 'var(--dark)' }}>{title}</p>
                    <p style={{ fontSize: 14, lineHeight: 1.6, color: 'var(--text-muted)' }}>{desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Metodologia ───────────────────────────────────────────────────── */}
      <section
        className="section"
        style={{ background: 'var(--dark)' }}
        aria-labelledby="metodologia-heading"
      >
        <div className="container" style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="eyebrow">Abordagem</span>
            <h2
              id="metodologia-heading"
              style={{ fontSize: 'clamp(22px, 2.2vw, 32px)', fontWeight: 300, color: '#fff', letterSpacing: '-.03em' }}
            >
              Como Guilherme analisa o mercado
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }}>
            {[
              { num: '01', title: 'Dados com contexto', text: 'Números de mercado, taxas e regras analisados dentro do momento econômico, da região, do tipo de imóvel e do perfil do investidor.' },
              { num: '02', title: 'Oportunidades sem promessas', text: 'Dubai pode ser uma estratégia interessante, mas nenhum investimento é apresentado como garantido, sem risco ou adequado para todos.' },
              { num: '03', title: 'Decisão personalizada', text: 'O melhor imóvel depende do objetivo: proteção patrimonial, renda, valorização, residência, Golden Visa ou diversificação em moeda forte.' },
            ].map((m, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <span style={{ fontSize: 32, fontWeight: 100, color: 'var(--gold)', letterSpacing: '.04em' }}>{m.num}</span>
                <h3 style={{ fontSize: 17, fontWeight: 500, color: '#fff' }}>{m.title}</h3>
                <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(255,255,255,.5)' }}>{m.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA final ─────────────────────────────────────────────────────── */}
      <section className="section" style={{ textAlign: 'center' }}>
        <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24, maxWidth: 600, margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(22px, 2.2vw, 32px)', fontWeight: 300, letterSpacing: '-.03em', color: 'var(--dark)' }}>
            Quer conversar com Guilherme?
          </h2>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'var(--text)', opacity: .7 }}>
            Agende uma análise personalizada do seu perfil de investimento em Dubai.
          </p>
          <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="btn btn-gold">
            Solicitar análise personalizada
          </a>
          <Link href="/" style={{ fontSize: 14, color: 'var(--text-muted)' }}>
            ← Voltar para o blog
          </Link>
        </div>
      </section>

      {/* ── Disclaimer ────────────────────────────────────────────────────── */}
      <section className="disclaimer-section" aria-label="Aviso legal">
        <div className="container">
          <p>
            Os conteúdos deste blog têm caráter educativo e informativo. Não constituem recomendação individual de investimento, aconselhamento jurídico, fiscal, financeiro ou migratório. Consulte profissionais qualificados antes de tomar decisões patrimoniais.
          </p>
        </div>
      </section>
    </>
  )
}
