import Image from 'next/image'
import Link  from 'next/link'
import type { Metadata } from 'next'
import {
  getPosts,
  getCategories,
  PLACEHOLDER_POSTS,
} from '@/lib/wordpress'
import {
  CardFeatured,
  CardOverlay,
  CardPlain,
  CardList,
} from '@/components/Cards'
import LeadMagnet     from '@/components/LeadMagnet'
import HomeNewsletter from '@/components/HomeNewsletter'

export const metadata: Metadata = {
  title: 'Dubai Imóveis — Investimento Imobiliário em Dubai para Brasileiros',
  description:
    'Guias, análises e conteúdos estratégicos sobre o mercado imobiliário de Dubai para brasileiros que querem entender as oportunidades, os riscos e as regras antes de tomar uma decisão patrimonial.',
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

// ── Dados estáticos ───────────────────────────────────────────────────────────
const STATS = [
  { number: '8–12%',     label: 'ROI ao ano em aluguel' },
  { number: '0%',        label: 'Imposto de renda local' },
  { number: 'US$ 130bi', label: 'Volume do mercado/ano'  },
  { number: '+5.000',    label: 'Brasileiros investindo' },
]

// Por onde começar — guias essenciais (atualize os hrefs quando os posts forem publicados)
const GUIAS = [
  {
    title: 'Vale a pena investir em imóveis em Dubai?',
    desc:  'Uma análise equilibrada sobre oportunidades, riscos e perfil de investidor.',
    href:  '/vale-a-pena-investir-em-imoveis-em-dubai',
    icon:  '◎',
  },
  {
    title: 'Como brasileiro pode comprar imóvel em Dubai?',
    desc:  'Entenda o processo de compra, documentos, etapas e cuidados básicos.',
    href:  '/como-brasileiro-pode-comprar-imovel-em-dubai',
    icon:  '◈',
  },
  {
    title: 'Comprar imóvel na planta em Dubai vale a pena?',
    desc:  'Veja como funciona o modelo off-plan, os planos de pagamento e os principais pontos de atenção.',
    href:  '/comprar-imovel-na-planta-em-dubai',
    icon:  '⬡',
  },
  {
    title: 'Golden Visa em Dubai: o que o investidor precisa saber',
    desc:  'Entenda como o investimento imobiliário pode se relacionar com visto e residência, sempre validando as regras atuais.',
    href:  '/golden-visa-em-dubai',
    icon:  '✦',
  },
]

const METODOLOGIA = [
  {
    num:   '01',
    title: 'Dados com contexto',
    text:  'Números de mercado, taxas, regras e informações recentes devem ser analisados dentro do momento econômico, da região, do tipo de imóvel e do perfil do investidor.',
  },
  {
    num:   '02',
    title: 'Oportunidades sem promessas',
    text:  'Dubai pode ser uma estratégia interessante para diversificação internacional, mas nenhum investimento deve ser apresentado como garantido, sem risco ou adequado para todos.',
  },
  {
    num:   '03',
    title: 'Decisão personalizada',
    text:  'O melhor imóvel depende do objetivo: proteção patrimonial, renda, valorização, residência, Golden Visa, uso familiar ou diversificação em moeda forte.',
  },
]

const WA_HREF = `https://wa.me/5511999999999?text=${encodeURIComponent('Olá! Gostaria de solicitar uma análise personalizada sobre investimento imobiliário em Dubai.')}`

export default async function HomePage() {
  let posts = PLACEHOLDER_POSTS

  let stickyPost: typeof posts[0] | null = null
  let wpCategories: { id: number; name: string; slug: string; count: number }[] = []

  try {
    const wpUrl = process.env.NEXT_PUBLIC_WP_URL
    if (wpUrl) {
      const [stickyData, mainData, cats] = await Promise.all([
        getPosts({ perPage: 1, sticky: true }),
        getPosts({ perPage: 14 }),
        getCategories(),
      ])
      if (stickyData.posts.length) stickyPost = stickyData.posts[0]
      if (mainData.posts.length) posts = mainData.posts
      wpCategories = cats.filter(c => c.slug !== 'uncategorized' && c.count > 0)
    }
  } catch { /* use fallbacks */ }

  const latestPosts = stickyPost
    ? [stickyPost, ...posts.filter(p => p.id !== stickyPost!.id)].slice(0, 14)
    : posts.slice(0, 14)

  const [featured, ...rest] = latestPosts
  const overlayPosts = rest.slice(0, 2)
  const plainPosts   = rest.slice(2, 6)
  const listPosts    = rest.slice(6)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHome) }} />

      {/* ══ 1. HERO ═══════════════════════════════════════════════════════════ */}
      <section className="hero" aria-label="Hero principal">
        <div className="hero-bg" aria-hidden="true">
          <Image src="/imagens/bg2.webp" alt="" fill sizes="100vw"
            style={{ objectFit: 'cover', objectPosition: 'center bottom', filter: 'blur(3.5px)' }} priority />
        </div>
        <div className="hero-fade" aria-hidden="true" />

        {/* Bento grid de imagens — lado direito do hero */}
        <div className="hero-bento" aria-hidden="true">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="hero-bento-cell hero-bento-tall">
            <img src="/imagens/dubai4.webp" alt="" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="hero-bento-cell">
            <img src="/imagens/dubai2.webp" alt="" />
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="hero-bento-cell">
            <img src="/imagens/dubai8.webp" alt="" />
          </div>
        </div>

        <div className="hero-content">
          <div className="hero-text-block">
            <div className="hero-text">
              <div className="hero-title-group animate-in">
                <span className="eyebrow">Blog de investimento para brasileiros</span>
                <h1 className="heading-xl">
                  Investir em Dubai, explicado com dados e não com promessas.
                </h1>
              </div>
              <p className="body-lg animate-in delay-1" style={{ maxWidth: 520 }}>
                Guias, análises e conteúdos estratégicos sobre o mercado imobiliário de Dubai, criados para brasileiros que querem entender as oportunidades, os riscos e as regras antes de tomar uma decisão patrimonial.
              </p>
              <p className="animate-in delay-1" style={{ fontSize: 14, color: 'var(--text-muted)', maxWidth: 480 }}>
                Conteúdo por Guilherme Lemos, especialista em investimento imobiliário internacional há mais de 15 anos.
              </p>
            </div>
            <div className="animate-in delay-2" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Link href="/categoria/investimento" className="btn btn-gold">
                Começar pelos guias
              </Link>
              <a href="#newsletter" className="btn btn-outline" style={{ borderColor: 'rgba(25,16,7,.25)', color: 'var(--dark)' }}>
                Receber análises por e-mail
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ 2. STATS BAR ══════════════════════════════════════════════════════ */}
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

      {/* ══ 3. INTRODUÇÃO CURTA ═══════════════════════════════════════════════ */}
      <section className="section intro-section" aria-label="Introdução">
        <div className="container" data-animate>
          <div className="intro-text">
            <p>
              Dubai se tornou um dos mercados internacionais mais observados por investidores que buscam diversificação, patrimônio em moeda forte, segurança e exposição a uma economia global.
            </p>
            <p>
              Mas junto com o crescimento do mercado, também cresceu o ruído: promessas de retorno, comparações superficiais, urgência artificial e informações sem contexto.
            </p>
            <p className="intro-highlight">
              Este blog existe para seguir outro caminho.
            </p>
            <p>
              Aqui, o objetivo é explicar o mercado imobiliário de Dubai com clareza, dados, fontes e visão estratégica — mostrando não apenas as oportunidades, mas também os pontos de atenção que um investidor brasileiro precisa considerar antes de comprar.
            </p>
            <p>
              Porque uma decisão patrimonial internacional não deve ser tomada com pressa. Deve ser tomada com informação.
            </p>
          </div>
        </div>
      </section>

      {/* ══ 4. POR ONDE COMEÇAR ═══════════════════════════════════════════════ */}
      {/* Para adicionar ou trocar artigos desta seção: edite o array GUIAS no topo deste arquivo (app/page.tsx) com o título, descrição e slug do post publicado no WordPress. */}
      <section className="section por-onde-section" aria-labelledby="por-onde-heading">
        <div className="container">
          <div className="por-onde-header" data-animate>
            <span className="eyebrow">Por onde começar</span>
            <h2 id="por-onde-heading">Novo no mercado de Dubai?</h2>
            <p>
              Comece pelos guias essenciais para entender como brasileiros podem comprar imóveis em Dubai, quais são os custos envolvidos, quais regiões fazem sentido para cada perfil e como analisar um projeto antes de investir.
            </p>
          </div>
          <div className="por-onde-grid" data-animate>
            {GUIAS.map((g, i) => (
              <Link key={i} href={g.href} className="por-onde-card">
                <span className="por-onde-icon" aria-hidden="true">{g.icon}</span>
                <div>
                  <h3 className="por-onde-title">{g.title}</h3>
                  <p className="por-onde-desc">{g.desc}</p>
                </div>
                <span className="por-onde-arrow" aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ══ 5. CATEGORIAS PRINCIPAIS ══════════════════════════════════════════ */}
      {/* Para que uma categoria apareça aqui, basta publicar posts nela no WordPress. */}
      {wpCategories.length > 0 && (
        <section className="section cats-section" aria-labelledby="cats-heading">
          <div className="container">
            <div className="cats-header" data-animate>
              <span className="eyebrow">Categorias</span>
              <h2 id="cats-heading">Explore por tema</h2>
            </div>
            <div className="cats-grid" data-animate>
              {wpCategories.map(cat => (
                <Link key={cat.id} href={`/categoria/${cat.slug}`} className="cat-card">
                  <span className="cat-name">{cat.name}</span>
                  <span className="cat-count">{cat.count} {cat.count === 1 ? 'artigo' : 'artigos'}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ══ 6. ARTIGOS MAIS RECENTES ══════════════════════════════════════════ */}
      <section className="section" aria-labelledby="artigos-heading">
        <div className="container">
          <div className="section-header" data-animate style={{ marginBottom: 32, gap: 12 }}>
            <h2 id="artigos-heading" style={{ fontSize: 24, fontWeight: 600, letterSpacing: '-.03em', color: 'var(--dark)' }}>
              Artigos mais recentes
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
          {listPosts.length > 0 && (
            <div style={{ marginTop: 48 }}>
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
          )}
        </div>
      </section>

      {/* ══ 7. NEWSLETTER ═════════════════════════════════════════════════════ */}
      <HomeNewsletter />

      {/* Material gratuito — oculto até ter isca digital pronta */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <LeadMagnet />
      </div>

      {/* ══ 8. METODOLOGIA EDITORIAL ══════════════════════════════════════════ */}
      <section className="section metodologia-section" aria-labelledby="metodologia-heading">
        <div className="container">
          <div className="metodologia-header" data-animate>
            <span className="eyebrow">Metodologia editorial</span>
            <h2 id="metodologia-heading">Como produzimos nossas análises</h2>
            <p>O mercado imobiliário internacional exige cuidado. Por isso, nossos conteúdos seguem três princípios:</p>
          </div>
          <div className="metodologia-grid" data-animate>
            {METODOLOGIA.map((m, i) => (
              <div key={i} className="metodologia-item">
                <span className="metodologia-num">{m.num}</span>
                <h3 className="metodologia-title">{m.title}</h3>
                <p className="metodologia-text">{m.text}</p>
              </div>
            ))}
          </div>
          <p className="metodologia-disclaimer" data-animate>
            Este blog não substitui uma análise jurídica, fiscal, migratória ou financeira individual. Ele existe para ajudar você a chegar mais preparado a essa conversa.
          </p>
        </div>
      </section>

      {/* ══ 9. CTA CONSULTIVO ═════════════════════════════════════════════════ */}
      <section className="section cta-consultivo-section" aria-labelledby="cta-consultivo-heading">
        <div className="container cta-consultivo-inner" data-animate>
          <div className="cta-consultivo-copy">
            <h2 id="cta-consultivo-heading">Está avaliando Dubai como investimento?</h2>
            <p>
              Antes de escolher um imóvel, é importante entender seu perfil, sua faixa de investimento, seu objetivo patrimonial e o tipo de projeto mais adequado para sua estratégia.
            </p>
            <p>
              Dubai pode fazer sentido para quem busca diversificação internacional, exposição a uma economia global, patrimônio em moeda forte, renda, valorização ou residência. Mas a escolha certa depende de análise.
            </p>
            <p style={{ fontWeight: 500 }}>
              Fale com um especialista para receber uma curadoria de projetos alinhada ao seu objetivo.
            </p>
          </div>
          <div className="cta-consultivo-action">
            <a href={WA_HREF} target="_blank" rel="noopener noreferrer" className="btn btn-gold" style={{ fontSize: 16, padding: '16px 32px' }}>
              Solicitar análise personalizada
            </a>
          </div>
        </div>
      </section>

      {/* ══ 10. AUTOR ═════════════════════════════════════════════════════════ */}
      <section className="section autor-section" aria-labelledby="autor-heading">
        <div className="container autor-inner" data-animate>
          <div className="autor-avatar" aria-hidden="true">GL</div>
          <div className="autor-bio">
            <span className="eyebrow">Sobre o autor</span>
            <h2 id="autor-heading" className="autor-name">Guilherme Lemos</h2>
            <p>
              Guilherme Lemos é especialista em dolarização de patrimônio por meio de imóveis, com mais de 15 anos de experiência ajudando investidores brasileiros a construir renda e patrimônio em moeda forte.
            </p>
            <p>
              Sua trajetória foi construída no mercado de Orlando, nos Estados Unidos, assessorando investidores, famílias e compradores internacionais. Hoje, também atua no mercado de Dubai à frente da Gap Capital, com foco em curadoria de projetos, análise estratégica e educação para investidores brasileiros de alta renda.
            </p>
            <p>
              Nos conteúdos deste blog, o objetivo é traduzir o mercado imobiliário de Dubai para o investidor brasileiro: explicando regras, custos, oportunidades, riscos e diferenças em relação a outros mercados internacionais.
            </p>
            <Link href="/sobre" className="btn btn-outline" style={{ alignSelf: 'flex-start', marginTop: 8 }}>
              Conheça o Guilherme →
            </Link>
          </div>
        </div>
      </section>

      {/* ══ 11. DISCLAIMER EDITORIAL ══════════════════════════════════════════ */}
      <section className="disclaimer-section" aria-label="Aviso legal editorial">
        <div className="container">
          <p>
            Os conteúdos deste blog têm caráter educativo e informativo. Eles não constituem recomendação individual de investimento, aconselhamento jurídico, fiscal, financeiro ou migratório.
          </p>
          <p>
            Regras de visto, impostos, taxas, condições de financiamento, custos de compra e dados de mercado podem mudar. Antes de tomar uma decisão, valide as informações em fontes oficiais e com nossos especialistas qualificados.
          </p>
        </div>
      </section>
    </>
  )
}
