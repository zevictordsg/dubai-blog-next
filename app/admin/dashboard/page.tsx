import Link from 'next/link'
import { getAdminPosts, getAdminCategories, getLeads } from '@/lib/wp-admin'
import SeedButton from './SeedButton'

export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const [posts, cats, leads] = await Promise.allSettled([
    getAdminPosts('any'),
    getAdminCategories(),
    getLeads(),
  ])

  const postList = posts.status   === 'fulfilled' ? posts.value   : []
  const catList  = cats.status    === 'fulfilled' ? cats.value    : []
  const leadList = leads.status   === 'fulfilled' ? leads.value   : []

  const published = postList.filter(p => p.status === 'publish').length
  const drafts    = postList.filter(p => p.status === 'draft').length
  const recent    = postList.slice(0, 5)

  function statusBadge(status: string) {
    if (status === 'publish') return <span className="adm-badge adm-badge-green">Publicado</span>
    if (status === 'draft')   return <span className="adm-badge adm-badge-amber">Rascunho</span>
    if (status === 'private') return <span className="adm-badge adm-badge-gray">Privado</span>
    return <span className="adm-badge adm-badge-gray">{status}</span>
  }

  return (
    <>
      {/* Topbar */}
      <div className="adm-topbar">
        <div>
          <div className="adm-topbar-title">Dashboard</div>
        </div>
        <div className="adm-topbar-actions">
          <SeedButton />
          <Link href="/admin/posts/novo" className="adm-btn adm-btn-primary adm-btn-sm">
            + Novo post
          </Link>
        </div>
      </div>

      <div className="adm-content">
        {/* Stats */}
        <div className="adm-stats-grid">
          <div className="adm-stat-card">
            <div className="adm-stat-value adm-stat-accent">{published}</div>
            <div className="adm-stat-label">Posts publicados</div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-value">{drafts}</div>
            <div className="adm-stat-label">Rascunhos</div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-value">{catList.length}</div>
            <div className="adm-stat-label">Categorias</div>
          </div>
          <div className="adm-stat-card">
            <div className="adm-stat-value adm-stat-accent">{leadList.length}</div>
            <div className="adm-stat-label">Leads capturados</div>
          </div>
        </div>

        {/* Posts recentes */}
        <div className="adm-card" style={{ marginBottom: 24 }}>
          <div className="adm-card-body" style={{ padding: '20px 24px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>Posts recentes</div>
              <Link href="/admin/posts" className="adm-btn adm-btn-ghost adm-btn-sm">Ver todos</Link>
            </div>
          </div>
          <div className="adm-table-wrap">
            {recent.length === 0 ? (
              <div className="adm-empty">
                <div className="adm-empty-icon">✦</div>
                <div className="adm-empty-title">Nenhum post ainda</div>
                <div style={{ marginTop: 12, display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link href="/admin/posts/novo" className="adm-btn adm-btn-primary adm-btn-sm">Criar primeiro post</Link>
                  <SeedButton />
                </div>
              </div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {recent.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div className="adm-table-title"
                          dangerouslySetInnerHTML={{ __html: p.title.rendered || 'Sem título' }}
                        />
                      </td>
                      <td>{statusBadge(p.status)}</td>
                      <td style={{ fontSize: 13, color: 'var(--adm-muted)' }}>
                        {new Date(p.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td>
                        <Link
                          href={`/admin/posts/${p.id}/editar`}
                          className="adm-btn adm-btn-ghost adm-btn-sm"
                        >
                          Editar
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Leads recentes */}
        {leadList.length > 0 && (
          <div className="adm-card">
            <div className="adm-card-body" style={{ padding: '20px 24px 0' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <div style={{ fontWeight: 700, fontSize: 16 }}>Últimos leads</div>
                <Link href="/admin/leads" className="adm-btn adm-btn-ghost adm-btn-sm">Ver todos</Link>
              </div>
            </div>
            <div style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', gap: 10 }}>
              {leadList.slice(0, 3).map(l => {
                let data: { name?: string; message?: string; date?: string } = {}
                try { data = JSON.parse(l.content.rendered.replace(/<[^>]+>/g, '')) } catch { /**/ }
                return (
                  <div className="adm-lead-card" key={l.id}>
                    <div>
                      <div className="adm-lead-email"
                        dangerouslySetInnerHTML={{ __html: l.title.rendered }}
                      />
                      {data.name && <div className="adm-lead-msg">{data.name}</div>}
                    </div>
                    <div className="adm-lead-date">
                      {new Date(l.date).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </>
  )
}
