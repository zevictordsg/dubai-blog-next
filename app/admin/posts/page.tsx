import Link from 'next/link'
import { getAdminPosts } from '@/lib/wp-admin'
import PostActions from './PostActions'

export default async function PostsPage() {
  let posts = await getAdminPosts('any').catch(() => [])

  function statusBadge(status: string) {
    if (status === 'publish') return <span className="adm-badge adm-badge-green">Publicado</span>
    if (status === 'draft')   return <span className="adm-badge adm-badge-amber">Rascunho</span>
    if (status === 'private') return <span className="adm-badge adm-badge-gray">Privado</span>
    if (status === 'trash')   return <span className="adm-badge adm-badge-red">Lixeira</span>
    return <span className="adm-badge adm-badge-gray">{status}</span>
  }

  return (
    <>
      <div className="adm-topbar">
        <div className="adm-topbar-title">Posts</div>
        <div className="adm-topbar-actions">
          <Link href="/admin/posts/novo" className="adm-btn adm-btn-primary adm-btn-sm">
            + Novo post
          </Link>
        </div>
      </div>

      <div className="adm-content">
        <div className="adm-card">
          <div className="adm-table-wrap">
            {posts.length === 0 ? (
              <div className="adm-empty">
                <div className="adm-empty-icon">✦</div>
                <div className="adm-empty-title">Nenhum post cadastrado</div>
                <p style={{ fontSize: 14, color: 'var(--adm-muted)', marginTop: 8 }}>
                  Crie o primeiro artigo do blog.
                </p>
                <div style={{ marginTop: 16 }}>
                  <Link href="/admin/posts/novo" className="adm-btn adm-btn-primary adm-btn-sm">
                    Criar post
                  </Link>
                </div>
              </div>
            ) : (
              <table className="adm-table">
                <thead>
                  <tr>
                    <th>Título</th>
                    <th>Status</th>
                    <th>Data</th>
                    <th style={{ width: 130 }}>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {posts.map(p => (
                    <tr key={p.id}>
                      <td>
                        <div
                          className="adm-table-title"
                          dangerouslySetInnerHTML={{ __html: p.title.rendered || 'Sem título' }}
                        />
                        <div style={{ fontSize: 12, color: 'var(--adm-muted)', marginTop: 2 }}>
                          /{p.slug}
                        </div>
                      </td>
                      <td>{statusBadge(p.status)}</td>
                      <td style={{ fontSize: 13, color: 'var(--adm-muted)', whiteSpace: 'nowrap' }}>
                        {new Date(p.date).toLocaleDateString('pt-BR')}
                      </td>
                      <td>
                        <PostActions id={p.id} status={p.status} slug={p.slug} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
