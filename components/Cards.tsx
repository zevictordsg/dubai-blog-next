import Image from 'next/image'
import Link  from 'next/link'
import {
  type WPPost,
  stripHtml,
  formatDate,
  getFeaturedImage,
  getPrimaryCategory,
} from '@/lib/wordpress'

// Fallback image when post has no featured media — cycles through dubai1-10
function fallbackImg(postId: number) {
  const n = (Math.abs(postId) % 10) + 1
  return { source_url: `/imagens/dubai${n}.webp`, alt_text: 'Dubai' }
}

// ── Shared icons ──────────────────────────────────────────────────────────────
const ArrowCircle = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="11" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M9 12h6M13 10l2 2-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
)

const Dot = ({ light = false }: { light?: boolean }) => (
  <span style={{
    display: 'inline-block', width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
    background: light ? 'rgba(255,255,255,.7)' : 'rgba(22,22,22,.7)',
  }} />
)

// ── CardFeatured — dark horizontal, 493px, Últimas notícias ──────────────────
export function CardFeatured({ post }: { post: WPPost }) {
  const img     = getFeaturedImage(post) ?? fallbackImg(post.id)
  const cat     = getPrimaryCategory(post)
  const title   = stripHtml(post.title.rendered)
  const excerpt = stripHtml(post.excerpt.rendered)

  return (
    <Link href={`/${post.slug}`} className="card-featured">
      {/* Left image */}
      <div className="card-featured-img">
        <Image src={img.source_url} alt={img.alt_text} fill sizes="(max-width:768px) 100vw, 50vw" style={{ objectFit: 'cover' }} priority />
      </div>

      {/* Right body */}
      <div className="card-featured-body">
        {/* Figma 59:42: category + text-group com gap-48 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 48 }}>
          <p className="card-featured-cat">{cat?.name ?? 'Blog'}</p>
          <div className="card-featured-text">
            <h2 className="card-featured-title">{title}</h2>
            <p className="card-featured-excerpt">{excerpt.slice(0, 120)}</p>
          </div>
        </div>
        {/* Bottom: CTA */}
        <span className="btn btn-white card-featured-btn">
          Ler artigo completo <ArrowCircle />
        </span>
      </div>
    </Link>
  )
}

// ── CardOverlay — 493px, gradient, Últimas notícias 2-col ────────────────────
export function CardOverlay({ post }: { post: WPPost }) {
  const img     = getFeaturedImage(post) ?? fallbackImg(post.id)
  const title   = stripHtml(post.title.rendered)
  const excerpt = stripHtml(post.excerpt.rendered)

  return (
    <Link href={`/${post.slug}`} className="card-overlay">
      <div className="card-overlay-img">
        <Image src={img.source_url} alt={img.alt_text} fill sizes="(max-width:768px) 100vw, 45vw" style={{ objectFit: 'cover' }} />
      </div>

      <div className="card-overlay-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 className="card-overlay-title">{title}</h2>
          <p className="card-overlay-excerpt">{excerpt.slice(0, 100)}</p>
        </div>
        <span className="btn btn-white card-overlay-btn">
          Ler artigo completo <ArrowCircle />
        </span>
      </div>
    </Link>
  )
}

// ── CardPlain — image top + text bottom, Últimas notícias 3-col ─────────────
export function CardPlain({ post }: { post: WPPost }) {
  const img   = getFeaturedImage(post) ?? fallbackImg(post.id)
  const cat   = getPrimaryCategory(post)
  const title = stripHtml(post.title.rendered)

  return (
    <Link href={`/${post.slug}`} className="card-plain">
      {/* Imagem com fill — container tem height: 240px definida no CSS */}
      <div className="card-plain-img">
        <Image src={img.source_url} alt={img.alt_text} fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit: 'cover' }} />
      </div>
      <div className="card-plain-body">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <p className="card-plain-cat">{cat?.name ?? 'Blog'}</p>
          <h3 className="card-plain-title">{title}</h3>
        </div>
        <p className="card-plain-date">{formatDate(post.date)}</p>
      </div>
    </Link>
  )
}

// ── CardVendasLarge — 580px full-width overlay (Vendas featured) ─────────────
export function CardVendasLarge({ post }: { post: WPPost }) {
  const img   = getFeaturedImage(post) ?? fallbackImg(post.id)
  const cat   = getPrimaryCategory(post)
  const title = stripHtml(post.title.rendered)

  return (
    <Link href={`/${post.slug}`} className="card-vendas-lg">
      <div className="card-vendas-img">
        <Image src={img.source_url} alt={img.alt_text} fill sizes="100vw" style={{ objectFit: 'cover', objectPosition: 'center' }} />
      </div>
      <div className="card-vendas-lg-gradient" />
      <div className="card-vendas-lg-body">
        {cat && <span className="badge">{cat.name}</span>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h2 className="card-vendas-lg-title">{title}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Dot light />
            <span className="card-vendas-date">{formatDate(post.date)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── CardVendasSmall — 493px overlay (Vendas 3-col) ───────────────────────────
export function CardVendasSmall({ post }: { post: WPPost }) {
  const img   = getFeaturedImage(post) ?? fallbackImg(post.id)
  const cat   = getPrimaryCategory(post)
  const title = stripHtml(post.title.rendered)

  return (
    <Link href={`/${post.slug}`} className="card-vendas-sm">
      <div className="card-vendas-img">
        <Image src={img.source_url} alt={img.alt_text} fill sizes="(max-width:768px) 100vw, 33vw" style={{ objectFit: 'cover', objectPosition: 'center bottom' }} />
      </div>
      <div className="card-vendas-sm-gradient" />
      <div className="card-vendas-sm-body">
        {cat && <span className="badge">{cat.name}</span>}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 className="card-vendas-sm-title">{title}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Dot light />
            <span className="card-vendas-date">{formatDate(post.date)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── CardList — 192×192 thumb + text, "Mais artigos" ──────────────────────────
export function CardList({ post }: { post: WPPost }) {
  const img   = getFeaturedImage(post) ?? fallbackImg(post.id)
  const cat   = getPrimaryCategory(post)
  const title = stripHtml(post.title.rendered)

  return (
    <Link href={`/${post.slug}`} className="card-list">
      <div className="card-list-thumb">
        <Image src={img.source_url} alt={img.alt_text} fill sizes="192px" style={{ objectFit: 'cover' }} />
      </div>
      <div className="card-list-body">
        <p className="card-list-cat">{cat?.name ?? 'Blog'}</p>
        {/* Figma 59:156: title + date com gap-12 */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <h3 className="card-list-title">{title}</h3>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Dot />
            <span className="card-list-date-text">{formatDate(post.date)}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
