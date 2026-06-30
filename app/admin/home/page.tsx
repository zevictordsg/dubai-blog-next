import Link from 'next/link'
import { getAdminPosts, getAdminCategories } from '@/lib/wp-admin'
import StickyToggle from './StickyToggle'

export const dynamic = 'force-dynamic'

function Thumb({ url, title }: { url?: string; title: string }) {
  if (!url) return (
    <div style={{
      width: 64, height: 48, borderRadius: 6, background: 'var(--adm-bg)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontSize: 20, flexShrink: 0,
    }}>🖼</div>
  )
  return (
    <img src={url} alt={title} style={{
      width: 64, height: 48, objectFit: 'cover', borderRadius: 6, flexShrink: 0,
    }} />
  )
}

function SlotBadge({ label, color }: { label: string; color: string }) {
  return (
    <span style={{
      fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
      padding: '2px 7px', borderRadius: 4, background: color + '22', color,
    }}>{label}</span>
  )
}

export default async function HomeManagerPage() {
  const [allPosts, cats] = await Promise.all([
    getAdminPosts('publish', 1),
    getAdminCategories(),
  ])

  // Descobrir ID da categoria Vendas
  const vendasCat = cats.find(c => c.slug === 'vendas' || c.name.toLowerCase() === 'vendas')
  const vendasCatId = vendasCat?.id

  // Separar sticky
  const stickyPost  = allPosts.find(p => p.sticky)
  const vendasPosts = vendasCatId ? allPosts.filter(p => p.categories.includes(vendasCatId)) : []
  const others      = allPosts.filter(p => !p.sticky && (!vendasCatId || !p.categories.includes(vendasCatId)))

  const overlay = others.slice(0, 2)
  const plain   = others.slice(2, 6)
  const lista   = others.slice(6)

  function postTitle(p: typeof allPosts[0]) {
    return p.title.rendered.replace(/<[^>]+>/g, '') || 'Sem título'
  }

  function featImg(p: typeof allPosts[0]) {
    return p._embedded?.['wp:featuredmedia']?.[0]?.source_url
  }

  return (
    <>
      <div className="adm-topbar">
        <div className="adm-topbar-title">Estrutura da Home</div>
        <div className="adm-topbar-actions">
          <a href="/" target="_blank" rel="noopener" className="adm-btn adm-btn-ghost adm-btn-sm">
            Ver site →
          </a>
          <Link href="/admin/posts/novo" className="adm-btn adm-btn-primary adm-btn-sm">
            + Novo post
          </Link>
        </div>
      </div>

      <div className="adm-content">
        {/* Legenda */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 24 }}>
          {[
            { label: 'Destaque', color: '#C27C36' },
            { label: 'Overlay ×2', color: '#7C5AC2' },
            { label: 'Cards ×4', color: '#2E7D9B' },
            { label: 'Vendas', color: '#198754' },
            { label: 'Lista', color: '#7a6f65' },
          ].map(b => <SlotBadge key={b.label} {...b} />)}
          <span style={{ fontSize: 12, color: 'var(--adm-muted)', marginLeft: 4 }}>
            — as seções são preenchidas nessa ordem; "Vendas" usa posts da categoria Vendas
          </span>
        </div>

        {/* ── DESTAQUE PRINCIPAL ────────────────────────────────── */}
        <div className="adm-card" style={{ marginBottom: 20 }}>
          <div className="adm-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <SlotBadge label="Destaque principal" color="#C27C36" />
              <span style={{ fontSize: 12, color: 'var(--adm-muted)' }}>
                CardFeatured — card grande com imagem de fundo no topo da home
              </span>
            </div>
            {stickyPost ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <Thumb url={featImg(stickyPost)} title={postTitle(stickyPost)} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{postTitle(stickyPost)}</div>
                  <div style={{ fontSize: 12, color: 'var(--adm-muted)' }}>
                    {new Date(stickyPost.date).toLocaleDateString('pt-BR')}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                  <StickyToggle id={stickyPost.id} sticky={true} />
                  <Link href={`/admin/posts/${stickyPost.id}/editar`} className="adm-btn adm-btn-ghost adm-btn-sm">
                    Editar
                  </Link>
                </div>
              </div>
            ) : (
              <div style={{ padding: '16px 0', color: 'var(--adm-muted)', fontSize: 14 }}>
                Nenhum post fixado — o post mais recente (abaixo) ocupa este slot automaticamente.
              </div>
            )}
          </div>
        </div>

        {/* ── OVERLAY ×2 ───────────────────────────────────────── */}
        <div className="adm-card" style={{ marginBottom: 20 }}>
          <div className="adm-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <SlotBadge label="Overlay ×2" color="#7C5AC2" />
              <span style={{ fontSize: 12, color: 'var(--adm-muted)' }}>
                CardOverlay — 2 cards grandes com imagem e texto sobrepostos
              </span>
            </div>
            {overlay.length === 0 ? (
              <div style={{ fontSize: 14, color: 'var(--adm-muted)' }}>Nenhum post disponível para este slot.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {overlay.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Thumb url={featImg(p)} title={postTitle(p)} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{postTitle(p)}</div>
                      <div style={{ fontSize: 12, color: 'var(--adm-muted)' }}>
                        {new Date(p.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <StickyToggle id={p.id} sticky={false} />
                      <Link href={`/admin/posts/${p.id}/editar`} className="adm-btn adm-btn-ghost adm-btn-sm">
                        Editar
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── CARDS ×4 ─────────────────────────────────────────── */}
        <div className="adm-card" style={{ marginBottom: 20 }}>
          <div className="adm-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <SlotBadge label="Cards ×4" color="#2E7D9B" />
              <span style={{ fontSize: 12, color: 'var(--adm-muted)' }}>
                CardPlain — 4 cards menores em grid horizontal
              </span>
            </div>
            {plain.length === 0 ? (
              <div style={{ fontSize: 14, color: 'var(--adm-muted)' }}>Nenhum post disponível para este slot.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plain.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Thumb url={featImg(p)} title={postTitle(p)} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{postTitle(p)}</div>
                      <div style={{ fontSize: 12, color: 'var(--adm-muted)' }}>
                        {new Date(p.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <StickyToggle id={p.id} sticky={false} />
                      <Link href={`/admin/posts/${p.id}/editar`} className="adm-btn adm-btn-ghost adm-btn-sm">
                        Editar
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── VENDAS ───────────────────────────────────────────── */}
        <div className="adm-card" style={{ marginBottom: 20 }}>
          <div className="adm-card-body">
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <SlotBadge label="Vendas" color="#198754" />
              <span style={{ fontSize: 12, color: 'var(--adm-muted)' }}>
                CardVendasLarge + CardVendasSmall — seção dedicada de imóveis/vendas
                {vendasCat && <> · Categoria: <strong>{vendasCat.name}</strong></>}
              </span>
            </div>
            {vendasPosts.length === 0 ? (
              <div style={{ fontSize: 14, color: 'var(--adm-muted)' }}>
                {vendasCat
                  ? `Nenhum post publicado na categoria "${vendasCat.name}".`
                  : 'Crie uma categoria chamada "Vendas" e atribua posts a ela.'}
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {vendasPosts.slice(0, 4).map((p, i) => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Thumb url={featImg(p)} title={postTitle(p)} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{postTitle(p)}</div>
                      <div style={{ fontSize: 12, color: 'var(--adm-muted)' }}>
                        {i === 0 ? 'Card grande · ' : `Card pequeno ${i} · `}
                        {new Date(p.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <Link href={`/admin/posts/${p.id}/editar`} className="adm-btn adm-btn-ghost adm-btn-sm">
                      Editar
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── LISTA ────────────────────────────────────────────── */}
        {lista.length > 0 && (
          <div className="adm-card">
            <div className="adm-card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                <SlotBadge label="Lista" color="#7a6f65" />
                <span style={{ fontSize: 12, color: 'var(--adm-muted)' }}>
                  CardList — posts restantes em lista na parte inferior da home
                </span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {lista.map(p => (
                  <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <Thumb url={featImg(p)} title={postTitle(p)} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontWeight: 500, fontSize: 13 }}>{postTitle(p)}</div>
                      <div style={{ fontSize: 12, color: 'var(--adm-muted)' }}>
                        {new Date(p.date).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
                      <StickyToggle id={p.id} sticky={false} />
                      <Link href={`/admin/posts/${p.id}/editar`} className="adm-btn adm-btn-ghost adm-btn-sm">
                        Editar
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {allPosts.length === 0 && (
          <div className="adm-card">
            <div className="adm-empty">
              <div className="adm-empty-icon">◈</div>
              <div className="adm-empty-title">Nenhum post publicado</div>
              <p style={{ fontSize: 14, color: 'var(--adm-muted)', marginTop: 8 }}>
                Crie e publique posts para vê-los aqui organizados por seção.
              </p>
              <div style={{ marginTop: 16 }}>
                <Link href="/admin/posts/novo" className="adm-btn adm-btn-primary adm-btn-sm">
                  Criar post
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
