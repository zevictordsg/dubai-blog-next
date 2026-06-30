import type { Metadata } from 'next'
import './globals.css'
import Nav               from '@/components/Nav'
import Footer            from '@/components/Footer'
import AnimationObserver from '@/components/AnimationObserver'
import BackToTop         from '@/components/BackToTop'
import {
  getCategories,
  PLACEHOLDER_CATEGORIES,
} from '@/lib/wordpress'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubaimoveis.com'

export const metadata: Metadata = {
  title: {
    default:  'GAP Capital Real Estate — Investimento Imobiliário em Dubai para Brasileiros',
    template: '%s | GAP Capital Real Estate',
  },
  description:
    'Guias completos, análises de mercado e estratégias reais para brasileiros investirem em imóveis em Dubai. ROI de 8–12% ao ano, isenção de IR e processo 100% seguro. O capital que transcende.',
  keywords: [
    'GAP Capital Real Estate', 'imóveis dubai', 'investimento imobiliário dubai',
    'comprar imóvel dubai', 'roi dubai', 'brasileiros investindo dubai',
    'mercado imobiliário dubai', 'dubai investimento', 'apartamento dubai', 'freehold dubai',
  ],
  metadataBase: new URL(BASE),
  openGraph: {
    siteName:  'GAP Capital Real Estate',
    locale:    'pt_BR',
    type:      'website',
    url:       BASE,
    images: [{
      url:    '/imagens/og-default.webp',
      width:  1200,
      height: 630,
      alt:    'GAP Capital Real Estate — Investimento imobiliário em Dubai para brasileiros',
    }],
  },
  twitter: {
    card:        'summary_large_image',
    site:        '@gapcapitalre',
    creator:     '@gapcapitalre',
  },
  robots: {
    index:              true,
    follow:             true,
    googleBot: {
      index:              true,
      follow:             true,
      'max-image-preview':  'large',
      'max-snippet':        -1,
      'max-video-preview':  -1,
    },
  },
  alternates: {
    canonical:  BASE,
    languages: { 'pt-BR': BASE },
  },
  authors:   [{ name: 'Equipe GAP Capital Real Estate', url: `${BASE}/sobre` }],
  category:  'Investimento imobiliário',
  verification: {
    // google: 'SEU_GOOGLE_SEARCH_CONSOLE_TOKEN',
  },
}

// JSON-LD: WebSite + Organization
const jsonLdOrg = {
  '@context':    'https://schema.org',
  '@graph': [
    {
      '@type':       'Organization',
      '@id':         `${BASE}/#organization`,
      name:          'GAP Capital Real Estate',
      url:           BASE,
      logo: {
        '@type':     'ImageObject',
        url:         `${BASE}/imagens/logo.svg`,
      },
      sameAs: [],
    },
    {
      '@type':         'WebSite',
      '@id':           `${BASE}/#website`,
      url:             BASE,
      name:            'GAP Capital Real Estate',
      description:     'O capital que transcende. Guia completo para brasileiros investirem no mercado imobiliário de Dubai.',
      publisher:       { '@id': `${BASE}/#organization` },
      inLanguage:      'pt-BR',
      potentialAction: {
        '@type':       'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: `${BASE}/?s={search_term_string}`,
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  let categories = PLACEHOLDER_CATEGORIES
  try {
    const cats = await getCategories()
    if (cats.length) categories = cats
  } catch { /* use fallback */ }

  return (
    <html lang="pt-BR">
      <head>
        {/* Preconnect para Google Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* JSON-LD Global */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
      </head>
      <body>
        {/* Skip to content — acessibilidade */}
        <a href="#main-content" className="skip-link">Pular para o conteúdo</a>
        <AnimationObserver />
        <Nav categories={categories} />
        <main id="main-content">{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  )
}
