import type { MetadataRoute } from 'next'
import {
  getAllPostSlugs,
  getAllCategorySlugs,
  PLACEHOLDER_POSTS,
  PLACEHOLDER_VENDAS_POSTS,
  PLACEHOLDER_CATEGORIES,
} from '@/lib/wordpress'

const BASE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://dubaimoveis.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const placeholderSlugs = [...PLACEHOLDER_POSTS, ...PLACEHOLDER_VENDAS_POSTS].map((p) => p.slug)
  let postSlugs  = placeholderSlugs
  let catSlugs   = PLACEHOLDER_CATEGORIES.map((c) => c.slug)

  try {
    if (process.env.NEXT_PUBLIC_WP_URL) {
      const [ps, cs] = await Promise.all([getAllPostSlugs(), getAllCategorySlugs()])
      if (ps.length) postSlugs = [...ps, ...PLACEHOLDER_VENDAS_POSTS.map(p => p.slug)]
      if (cs.length) catSlugs  = cs
    }
  } catch { /* use fallbacks */ }

  const staticPages = [
    { url: `${BASE}/sobre`,                         priority: 0.7, changeFrequency: 'monthly'  as const },
    { url: `${BASE}/contato`,                        priority: 0.6, changeFrequency: 'monthly'  as const },
    { url: `${BASE}/politica-de-privacidade`,        priority: 0.3, changeFrequency: 'yearly'   as const },
    { url: `${BASE}/termos-de-uso`,                  priority: 0.3, changeFrequency: 'yearly'   as const },
    { url: `${BASE}/aviso-de-cookies`,               priority: 0.3, changeFrequency: 'yearly'   as const },
    { url: `${BASE}/isencao-de-responsabilidade`,    priority: 0.3, changeFrequency: 'yearly'   as const },
  ]

  return [
    { url: BASE, changeFrequency: 'daily' as const, priority: 1 },
    ...staticPages,
    ...catSlugs.map((slug) => ({
      url:             `${BASE}/categoria/${slug}`,
      changeFrequency: 'daily'  as const,
      priority:        0.7,
    })),
    ...postSlugs.map((slug) => ({
      url:             `${BASE}/${slug}`,
      changeFrequency: 'weekly' as const,
      priority:        0.8,
    })),
  ]
}
