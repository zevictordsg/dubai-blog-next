import type { Metadata }  from 'next'
import { notFound }       from 'next/navigation'
import Link               from 'next/link'
import {
  getCategoryBySlug,
  getAllCategorySlugs,
  getPosts,
  PLACEHOLDER_CATEGORIES,
  PLACEHOLDER_POSTS,
} from '@/lib/wordpress'
import { CardPlain } from '@/components/Cards'
import LeadMagnet    from '@/components/LeadMagnet'

interface Props {
  params:      { slug: string }
  searchParams: { page?: string }
}

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const slugs = await getAllCategorySlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return PLACEHOLDER_CATEGORIES.map((c) => ({ slug: c.slug }))
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let name = ''
  try {
    const cat = await getCategoryBySlug(params.slug)
    name = cat?.name ?? ''
  } catch { /* fallback */ }
  if (!name) name = PLACEHOLDER_CATEGORIES.find((c) => c.slug === params.slug)?.name ?? params.slug

  return {
    title:       `${name} — Dubai Imóveis`,
    description: `Artigos sobre ${name} no mercado imobiliário de Dubai.`,
    alternates:  { canonical: `/categoria/${params.slug}` },
  }
}

const PER_PAGE = 12

export default async function CategoryPage({ params, searchParams }: Props) {
  const page = parseInt(searchParams.page ?? '1', 10)

  let cat   = PLACEHOLDER_CATEGORIES.find((c) => c.slug === params.slug) ?? null
  let posts = PLACEHOLDER_POSTS
  let totalPages = 1

  try {
    if (process.env.NEXT_PUBLIC_WP_URL) {
      const wpCat = await getCategoryBySlug(params.slug)
      if (!wpCat) { notFound(); return null }
      cat = wpCat

      const data = await getPosts({ category: wpCat.id, perPage: PER_PAGE, page })
      posts      = data.posts
      totalPages = data.totalPages
    }
  } catch { /* use fallback */ }

  if (!cat) { notFound(); return null }

  return (
    <>
      {/* Archive hero */}
      <section className="archive-hero">
        <div className="container">
          <div data-animate style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <span className="eyebrow">{cat.name}</span>
            <h1 className="heading-xl" style={{ maxWidth: 700 }}>Artigos sobre {cat.name}</h1>
            <p className="body-lg" style={{ marginTop: 8, maxWidth: 500 }}>
              {cat.count} publicação{cat.count !== 1 ? 'ões' : ''} sobre investimento imobiliário em Dubai
            </p>
          </div>
        </div>
      </section>

      {/* Lead Magnet between hero and grid */}
      <LeadMagnet />

      {/* Grid */}
      <section className="archive-grid">
        <div className="container">
          {posts.length > 0 ? (
            <div className="grid-3" data-animate>
              {posts.map((p) => <CardPlain key={p.id} post={p} />)}
            </div>
          ) : (
            <p style={{ textAlign: 'center', opacity: .5, padding: '60px 0' }}>
              Nenhum artigo publicado ainda.
            </p>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <nav className="pagination" aria-label="Páginas">
              {page > 1 && (
                <Link href={`/categoria/${params.slug}?page=${page - 1}`}>←</Link>
              )}
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={`/categoria/${params.slug}?page=${p}`}
                  className={p === page ? 'current-page' : ''}
                >
                  {p}
                </Link>
              ))}
              {page < totalPages && (
                <Link href={`/categoria/${params.slug}?page=${page + 1}`}>→</Link>
              )}
            </nav>
          )}
        </div>
      </section>
    </>
  )
}
