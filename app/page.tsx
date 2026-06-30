import Image from 'next/image'
import Link  from 'next/link'
import type { Metadata } from 'next'
import {
  getPosts,
  getCategoryBySlug,
  PLACEHOLDER_POSTS,
  PLACEHOLDER_VENDAS_POSTS,
} from '@/lib/wordpress'
import {
  CardFeatured,
  CardOverlay,
  CardPlain,
  CardVendasLarge,
  CardVendasSmall,
  CardList,
} from '@/components/Cards'
import LeadMagnet from '@/components/LeadMagnet'
import HomeFAQ    from '@/components/HomeFAQ'

export const metadata: Metadata = {
  title: 'Dubai Imóveis — Investimento Imobiliário em Dubai para Brasileiros',
  description:
    'Guias completos, análises de mercado e estratégias reais para brasileiros que querem investir em imóveis em Dubai. ROI de 8–12% ao ano, isenção total de IR e segurança jurídica.',
  alternates: { canonical: '/' },
}

export const revalidate = 3600

const jsonLdHome = {
  '@context':  'https://schema.org',
  '@type':     'WebPage',
  name:        'Dubai Imóveis — Investimento Imobiliário em Dubai para Brasileiros',
  description: 'Blog especializado em mercado imobiliário de Dubai para investidores brasileiros.',
  url:         'https://dubaimoveis.com',
}

// ── Bolt icon (seções de notícias) ───────────────────────────────────────────
const Bolt = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M13 2L4 13.5H11L10.5 22L21 10.5H14L13 2Z" fill="var(--dark)" />
  </svg>
)

// ── Dados estáticos ───────────────────────────────────────────────────────────
const STATS = [
  { number: '8–12%',     label: 'ROI ao ano em aluguel' },
  { number: '0%',        label: 'Imposto de renda local' },
  { number: 'US$ 130bi', label: 'Volume do mercado/ano'  },
  { number: '+5.000',    label: 'Brasileiros investindo' },
]

const BENEFITS = [
  { title: 'ROI de 8–12% ao ano',       text: 'Retorno com aluguel superior aos de Londres, Miami e Lisboa — sem abrir mão de um mercado sólido e regulado.' },
  { title: 'Isenção fiscal total',       text: 'Zero imposto de renda pessoal e zero imposto sobre ganhos de capital. Seus rendimentos ficam integralmente com você.' },
  { title: 'Moeda dolarizada',           text: 'O Dirham é indexado ao dólar americano desde 1997. Seu patrimônio fica protegido da desvalorização cambial do real.' },
  { title: 'Propriedade plena (freehold)', text: 'Estrangeiros têm título definitivo de propriedade em áreas designadas. Sem cotas, sem restrições de nacionalidade.' },
  { title: 'Mercado 100% regulado',      text: 'RERA e contas escrow obrigatórias protegem o comprador internacional. Um dos mercados imobiliários mais seguros do mundo.' },
  { title: 'Visto de residência possível', text: 'Imóveis acima de AED 750.000 (≈ US$ 204.000) qualificam o comprador para o visto de residência nos Emirados.' },
]

const STEPS = [
  { num: '01', title: 'Pesquise o mercado',          text: 'Nossos guias, análises e comparativos de regiões te dão o contexto que nenhuma corretora vai contar.',      href: '/categoria/investimento' },
  { num: '02', title: 'Escolha seu imóvel',          text: 'Entenda ROI por distrito, tipo de imóvel e perfil de locatário antes de tomar qualquer decisão.',           href: '/categoria/regioes'      },
  { num: '03', title: 'Processo jurídico seguro',    text: 'Due diligence, registro no RERA, conta escrow e contrato bilíngue. Documentado e verificável.',              href: '/categoria/juridico'     },
  { num: '04', title: 'Receba seu retorno',           text: 'Administração de aluguel por gestoras certificadas ou valorização para revenda — você define a estratégia.', href: '/categoria/investimento' },
]

const TESTIMONIALS = [
  { quote: 'Investi em um apartamento no JVC com ROI de 9,2% ao ano. Me guiaram em cada etapa — do câmbio ao RERA. Processo muito mais simples do que eu imaginava.',   name: 'Rodrigo Mendes',   role: 'Empresário • São Paulo'       },
  { quote: 'Queria diversificar em dólar. Dubai foi a escolha certa: 8,5% de yield líquido, moeda forte e zero IR. Desejaria ter feito antes.',                           name: 'Dra. Fernanda Lima', role: 'Médica investidora • Rio de Janeiro' },
  { quote: 'O Dubai Imóveis foi minha principal fonte de pesquisa antes de fechar negócio. Os artigos são profundos e honestos — inclusive sobre os riscos.',              name: 'Marco Vilela',     role: 'CEO de Startup • Florianópolis' },
]

export default async function HomePage() {
  let posts       = PLACEHOLDER_POSTS
  let vendasPosts = PLACEHOLDER_VENDAS_POSTS

  try {
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL
    if (wpUrl) {
      const [mainData, vendasCat] = await Promise.all([
        getPosts({ perPage: 14 }),
        getCategoryBySlug('vendas'),
      ])
      if (mainData.posts.length) posts = mainData.posts
      if (vendasCat) {
        const vd = await getPosts({ category: vendasCat.id, perPage: 4 })
        if (vd.posts.length) vendasPosts = vd.posts
      }
    }
  } catch { /* use fallbacks */ }

  const latestPosts = posts.slice(0, 14)
  const [featured, ...rest] = latestPosts
  const overlayPosts = rest.slice(0, 2)
  const plainPosts   = rest.slice(2, 6)   // 4 cards agora
  const listPosts    = rest.slice(6)

  const [vendasFeatured, ...vendasRest] = vendasPosts
  const vendasSmall = vendasRest.slice(0, 3)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHome) }} />

      {/* ══ HERO ══════════════════════════════════════════════════════════════ */}
      <section className="hero" aria-label="Hero principal">
        <div className="hero-bg" aria-hidden="true">
          <Image src="/imagens/bg2.webp" alt="" fill sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center bottom', filter: 'blur(3.5px)' }} priority />
        </div>
        <div className="hero-fade" aria-hidden="true" />
        <div className="hero-statue" aria-hidden="true">
          <Image src="/imagens/estatu3.webp" alt="" width={2780} height={4528}
            sizes="(min-width:1440px) 851px, 47vw" quality={100}
            style={{ width: '100%', height: 'auto' }} priority />
        </div>
        <div className="hero-content">
          <div className="hero-text-block">
            <div className="hero-text">
              <div className="hero-title-group animate-in">
                <span className="eyebrow">Blog de investimento para brasileiros</span>
                <h1 className="heading-xl">
                  Seu patrimônio em dólares, no mercado mais rentável do mundo.
                </h1>
              </div>
              <p className="body-lg animate-in delay-1" style={{ maxWidth: 486 }}>
                Guias completos, análises de mercado e estratégias reais para quem quer investir em Dubai com segurança jurídica e máximo retorno.
              </p>
            </div>
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer"
              className="btn btn-gold animate-in delay-2" style={{ alignSelf: 'flex-start' }}
              aria-label="Fale com um especialista via WhatsApp">
              Fale com Especialista
            </a>
          </div>
        </div>
      </section>

      {/* ══ STATS BAR ═════════════════════════════════════════════════════════ */}
      <section className="stats-bar" aria-label="Dubai em números" data-animate>
        <div className="container stats-inner">
          {STATS.map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-number">{s.number}</span>
              <span className="stat-label">{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ══ LEAD MAGNET ═══════════════════════════════════════════════════════ */}
      <div data-animate><LeadMagnet /></div>

      {/* ══ ÚLTIMAS NOTÍCIAS ══════════════════════════════════════════════════ */}
      <section className="section" aria-labelledby="noticias-heading">
        <div className="container">
          <div className="section-header" data-animate style={{ marginBottom: 32, gap: 12 }}>
            <Bolt />
            <h2 id="noticias-heading" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-.03em', color: 'var(--dark)' }}>
              Últimas notícias
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
            {featured && <div data-animate><CardFeatured post={featured} /></div>}
            {overlayPosts.length > 0 && (
              <div className="grid-2" data-animate style={{ gap: 48 }}>
                {overlayPosts.map(p => <CardOverlay key={p.id} post={p} />)}
              </div>
            )}
            {plainPosts.length > 0 && (
              <div className="grid-4" data-animate>
                {plainPosts.map(p => <CardPlain key={p.id} post={p} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ══ POR QUE DUBAI ═════════════════════════════════════════════════════ */}
      <section className="section benefits-section" aria-labelledby="benefits-heading">
        <div className="container">
          <div className="section-header" data-animate style={{ marginBottom: 48, gap: 12 }}>
            <Bolt />
            <div>
              <h2 id="benefits-heading" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-.03em', color: 'var(--dark)' }}>
                Por que Dubai?
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 8, maxWidth: 480 }}>
                Uma combinação única de retorno, isenção fiscal e segurança jurídica disponível para qualquer brasileiro.
              </p>
            </div>
          </div>
          <div className="benefits-grid" data-animate>
            {BENEFITS.map((b, i) => (
              <div key={i} className="benefit-item">
                <svg className="benefit-check" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                  <circle cx="9" cy="9" r="8" stroke="var(--gold)" strokeWidth="1.5"/>
                  <path d="M5.5 9l2.5 2.5 4-4" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <div>
                  <h3 className="benefit-title">{b.title}</h3>
                  <p className="benefit-text">{b.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider">
        <a href="/categoria/investimento" aria-label="Ver mais artigos">
          <svg width="14" height="14" viewBox="0 0 14 14">
            <path d="M7 1v12M1 7l6 6 6-6" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round"/>
          </svg>
        </a>
      </div>

      {/* ══ VENDAS ════════════════════════════════════════════════════════════ */}
      {vendasPosts.length > 0 && (
        <section className="section" style={{ borderTop: 'none' }} aria-labelledby="vendas-heading">
          <div className="container">
            <div data-animate style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, marginBottom: 56, textAlign: 'center' }}>
              <span className="eyebrow">Vendas</span>
              <h2 id="vendas-heading" style={{ fontSize: 'clamp(24px, 2.67vw, 32px)', fontWeight: 600, color: 'var(--dark)', letterSpacing: '-.01em', maxWidth: 508, lineHeight: 1.3 }}>
                Os assuntos mais importantes para quem quer comprar lá fora.
              </h2>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
              <div data-animate><CardVendasLarge post={vendasFeatured} /></div>
              {vendasSmall.length > 0 && (
                <div className="grid-3" data-animate style={{ gap: 48 }}>
                  {vendasSmall.map(p => <CardVendasSmall key={p.id} post={p} />)}
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ══ COMO FUNCIONA ═════════════════════════════════════════════════════ */}
      <section className="section how-section" aria-labelledby="how-heading">
        <div className="container">
          <div className="section-header" data-animate style={{ marginBottom: 56, gap: 12 }}>
            <Bolt />
            <div>
              <h2 id="how-heading" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-.03em', color: 'var(--dark)' }}>
                Como investir em Dubai do Brasil
              </h2>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 8 }}>
                Um processo estruturado em quatro etapas que qualquer brasileiro pode seguir com segurança.
              </p>
            </div>
          </div>
          <div className="how-grid" data-animate>
            {STEPS.map((s, i) => (
              <div key={i} className="how-step">
                <span className="how-num">{s.num}</span>
                <h3 className="how-title">{s.title}</h3>
                <p className="how-text">{s.text}</p>
                <Link href={s.href} className="how-link">
                  Ver artigos
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                    <path d="M2 6h8M6 2l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ DEPOIMENTOS ═══════════════════════════════════════════════════════ */}
      <section className="section testimonials-section" aria-labelledby="testimonials-heading">
        <div className="container">
          <div className="section-header" data-animate style={{ marginBottom: 48, gap: 12 }}>
            <Bolt />
            <h2 id="testimonials-heading" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-.03em', color: 'var(--dark)' }}>
              O que dizem os investidores
            </h2>
          </div>
          <div className="testimonials-grid" data-animate>
            {TESTIMONIALS.map((t, i) => (
              <figure key={i} className="testimonial-card">
                <p className="testimonial-text">"{t.quote}"</p>
                <figcaption className="testimonial-author">
                  <div className="testimonial-avatar" aria-hidden="true">{t.name[0]}</div>
                  <div>
                    <p className="testimonial-name">{t.name}</p>
                    <p className="testimonial-role">{t.role}</p>
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FAQ ═══════════════════════════════════════════════════════════════ */}
      <section className="section faq-section" aria-labelledby="faq-heading">
        <div className="container">
          <div className="faq-inner">
            <div className="faq-header" data-animate>
              <div className="section-header" style={{ gap: 12, marginBottom: 12 }}>
                <Bolt />
                <h2 id="faq-heading" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-.03em', color: 'var(--dark)' }}>
                  Perguntas frequentes
                </h2>
              </div>
              <p style={{ fontSize: 15, color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Respondemos as dúvidas mais comuns de investidores brasileiros sobre o mercado de Dubai.
              </p>
              <Link href="/sobre" className="btn btn-outline" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
                Conhecer a equipe
              </Link>
            </div>
            <div data-animate>
              <HomeFAQ />
            </div>
          </div>
        </div>
      </section>

      {/* ══ MAIS ARTIGOS ══════════════════════════════════════════════════════ */}
      {listPosts.length > 0 && (
        <section className="section" style={{ paddingBottom: 120 }} aria-labelledby="mais-heading">
          <div className="container">
            <h2 id="mais-heading" data-animate
              style={{ fontSize: 24, fontWeight: 600, color: 'var(--dark)', letterSpacing: '-.03em', marginBottom: 56 }}>
              Mais sobre o mundo imobiliário de Dubai
            </h2>
            <div>
              {listPosts.reduce<Array<[typeof listPosts[0], typeof listPosts[0] | null]>>((acc, p, i) => {
                if (i % 2 === 0) acc.push([p, listPosts[i + 1] ?? null])
                return acc
              }, []).map(([a, b], i) => (
                <div key={i} data-animate className="list-row"
                  style={{ padding: '36px 0', borderTop: '1px solid var(--border)' }}>
                  <CardList post={a} />
                  {b && <CardList post={b} />}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
