import type { Metadata } from 'next'
import { notFound }      from 'next/navigation'
import Image             from 'next/image'
import Link              from 'next/link'
import {
  getPostBySlug,
  getAllPostSlugs,
  getPosts,
  stripHtml,
  formatDate,
  getFeaturedImage,
  getPrimaryCategory,
  estimateReadingTime,
  PLACEHOLDER_POSTS,
  PLACEHOLDER_VENDAS_POSTS,
} from '@/lib/wordpress'

// Todos os posts placeholder (artigos + vendas)
const ALL_PLACEHOLDERS = [...PLACEHOLDER_POSTS, ...PLACEHOLDER_VENDAS_POSTS]
import AudioPlayer       from '@/components/AudioPlayer'
import { CardList }      from '@/components/Cards'
import LeadMagnet        from '@/components/LeadMagnet'
import ReadingProgress   from '@/components/ReadingProgress'
import ShareButtons      from '@/components/ShareButtons'
import Breadcrumb        from '@/components/Breadcrumb'
import BackToTop         from '@/components/BackToTop'
import ArticleAuthor     from '@/components/ArticleAuthor'

// ──────────────────────────────────────────────────────────────────────────────
interface Props { params: { slug: string } }

export const revalidate = 3600

export async function generateStaticParams() {
  try {
    const slugs = await getAllPostSlugs()
    return slugs.map((slug) => ({ slug }))
  } catch {
    return ALL_PLACEHOLDERS.map((p) => ({ slug: p.slug }))
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  let post = ALL_PLACEHOLDERS.find((p) => p.slug === params.slug) ?? null
  try {
    const wp = await getPostBySlug(params.slug)
    if (wp) post = wp
  } catch { /* use placeholder */ }

  if (!post) return {}

  const img   = getFeaturedImage(post)
  const title = stripHtml(post.title.rendered)
  const desc  = post.meta._meta_description || stripHtml(post.excerpt.rendered)

  return {
    title,
    description:  desc.slice(0, 160),
    openGraph: {
      title,
      description: desc.slice(0, 160),
      type:        'article',
      publishedTime: post.date,
      modifiedTime:  post.modified,
      images: img ? [{ url: img.source_url, width: img.width, height: img.height, alt: img.alt_text }] : [],
    },
    alternates: { canonical: `/${params.slug}` },
  }
}

// ──────────────────────────────────────────────────────────────────────────────
export default async function ArticlePage({ params }: Props) {
  let post = ALL_PLACEHOLDERS.find((p) => p.slug === params.slug) ?? null
  try {
    const wp = await getPostBySlug(params.slug)
    if (wp) post = wp
  } catch { /* use placeholder */ }

  if (!post) notFound()

  const img        = getFeaturedImage(post)
  const cat        = getPrimaryCategory(post)
  const title      = stripHtml(post.title.rendered)
  const excerpt    = stripHtml(post.excerpt.rendered)
  const audioSrc   = post.meta.dubai_audio_file ?? ''
  const audioTitle = post.meta.dubai_audio_title ?? title
  const readMin    = estimateReadingTime(post.content.rendered)

  // Related posts (same category, exclude current)
  let relatedPosts = PLACEHOLDER_POSTS.filter((p) => p.id !== post!.id).slice(0, 4)
  try {
    if (process.env.NEXT_PUBLIC_WP_URL && cat) {
      const data = await getPosts({ category: cat.id, perPage: 5 })
      const filtered = data.posts.filter((p) => p.id !== post!.id).slice(0, 4)
      if (filtered.length) relatedPosts = filtered
    }
  } catch { /* use fallback */ }

  // Schema.org JSON-LD
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: title,
    description: excerpt,
    datePublished: post.date,
    dateModified:  post.modified,
    image: img?.source_url ?? '',
    author: { '@type': 'Organization', name: 'Dubai Imóveis', url: 'https://dubaimoveis.com' },
    publisher: {
      '@type': 'Organization',
      name: 'Dubai Imóveis',
      logo: { '@type': 'ImageObject', url: 'https://dubaimoveis.com/logo.svg' },
    },
  }

  // Group related posts into pairs
  const relatedPairs = relatedPosts.reduce<Array<[typeof relatedPosts[0], typeof relatedPosts[0] | null]>>(
    (acc, p, i) => {
      if (i % 2 === 0) acc.push([p, relatedPosts[i + 1] ?? null])
      return acc
    },
    []
  )

  return (
    <>
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── ARTICLE HERO ─────────────────────────────────────────── */}
      <article itemScope itemType="https://schema.org/NewsArticle">
        <section className="article-hero">
          <div className="container article-hero-inner">
            <header className="article-header" data-animate>
              {/* Breadcrumb */}
              <Breadcrumb
                items={[
                  { label: 'Início', href: '/' },
                  { label: cat?.name ?? 'Blog', href: cat ? `/categoria/${cat.slug}` : '/' },
                  { label: title },
                ]}
              />

              <div className="article-meta">
                {cat && (
                  <Link href={`/categoria/${cat.slug}`} className="article-cat">
                    {cat.name}
                  </Link>
                )}
                <time className="article-date" dateTime={post.date} itemProp="datePublished">
                  {formatDate(post.date)}
                </time>
              </div>

              <h1 className="article-title" itemProp="headline">{title}</h1>
              <p className="article-excerpt" itemProp="description">{excerpt}</p>

              {/* Reading time */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--text-muted)', fontWeight: 500 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <circle cx="12" cy="12" r="10"/>
                  <path d="M12 6v6l4 2"/>
                </svg>
                {readMin} min de leitura
              </div>
            </header>

            {img && (
              <div className="article-cover" data-animate data-delay="1">
                <Image
                  src={img.source_url}
                  alt={img.alt_text}
                  fill
                  sizes="(max-width:768px) 100vw, 1120px"
                  style={{ objectFit: 'cover' }}
                  priority
                  itemProp="image"
                />
              </div>
            )}
          </div>
        </section>

        {/* ── AUDIO PLAYER ─────────────────────────────────────────── */}
        <section className="audio-section" data-animate>
          <div className="container">
            <div className="audio-header">
              <h2 className="audio-header-title">{audioTitle}</h2>
              <div className="audio-header-brand" style={{ fontFamily: 'var(--font-serif)' }}>
                <svg width="16" height="19" viewBox="0 0 22 26" fill="none">
                  <path d="M11 0C11 0 14 6 14 10C14 12.2 12.8 14 11 15.2C11.8 13.5 12 11.8 11.3 10.3C10.4 12.5 8.5 14 6 14C3 14 0 11.5 0 8C0 4 3.5 1 6 0C6 3 7.5 5 9 6C9 3 9.5 1.5 11 0Z" fill="#E5AF00"/>
                  <path d="M11 14C13.5 15.5 15 18 15 21C15 23.8 13.2 26 11 26C8.8 26 7 23.8 7 21C7 18.5 8.5 16.5 11 14Z" fill="#E5AF00"/>
                </svg>
                Dubai Imóveis
              </div>
            </div>
            <AudioPlayer src={audioSrc} title={audioTitle} />
          </div>
        </section>

        {/* ── ARTICLE CONTENT ──────────────────────────────────────── */}
        <section className="article-body" data-animate>
          <div className="container">
            <div
              className="article-content"
              dangerouslySetInnerHTML={{ __html: post.content.rendered }}
              itemProp="articleBody"
            />
            <ArticleAuthor />
          </div>
        </section>
      </article>

      {/* ── LEAD MAGNET ──────────────────────────────────────────── */}
      <LeadMagnet />

      {/* ── SHARE BUTTONS ────────────────────────────────────────── */}
      <section className="share-section">
        <div className="container share-container">
          <p className="share-label">Compartilhar artigo</p>
          <ShareButtons title={title} url={`https://dubaimoveis.com/${post.slug}`} />
        </div>
      </section>

      {/* ── RELATED POSTS ────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="related" data-animate>
          <div className="container">
            <div className="related-header" style={{ marginBottom: 48 }}>
              <h2 className="related-title">Continue lendo</h2>
              <p className="related-subtitle">Mais artigos sobre {cat?.name ?? 'Dubai'}</p>
            </div>
            <div>
              {relatedPairs.map(([a, b], i) => (
                <div key={i} className="related-row">
                  <CardList post={a} />
                  {b && <CardList post={b} />}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <BackToTop />
    </>
  )
}
