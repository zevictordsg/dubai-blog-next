import { getLeads } from '@/lib/wp-admin'

export default async function LeadsPage() {
  const leads = await getLeads().catch(() => [])

  return (
    <>
      <div className="adm-topbar">
        <div>
          <div className="adm-topbar-title">Leads capturados</div>
          <div style={{ fontSize: 13, color: 'var(--adm-muted)', marginTop: 2 }}>
            {leads.length} lead{leads.length !== 1 ? 's' : ''} no total
          </div>
        </div>
      </div>

      <div className="adm-content">
        {leads.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">◎</div>
            <div className="adm-empty-title">Nenhum lead ainda</div>
            <p style={{ fontSize: 14, color: 'var(--adm-muted)', marginTop: 8 }}>
              Quando visitantes preencherem o formulário no site, os contatos aparecerão aqui.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {leads.map(l => {
              let data: { name?: string; message?: string; date?: string; email?: string } = {}
              try {
                // O conteúdo é HTML-encoded JSON; decodificamos
                const raw = l.content.rendered.replace(/<[^>]+>/g, '').trim()
                data = JSON.parse(raw)
              } catch { /**/ }

              return (
                <div className="adm-lead-card" key={l.id}>
                  <div style={{ flex: 1 }}>
                    <div className="adm-lead-email"
                      dangerouslySetInnerHTML={{ __html: l.title.rendered }}
                    />
                    {data.name && (
                      <div className="adm-lead-msg">👤 {data.name}</div>
                    )}
                    {data.message && (
                      <div className="adm-lead-msg" style={{ marginTop: 4 }}>
                        💬 {data.message}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, flexShrink: 0 }}>
                    <div className="adm-lead-date">
                      {new Date(data.date ?? l.date).toLocaleString('pt-BR', {
                        dateStyle: 'short',
                        timeStyle: 'short',
                      })}
                    </div>
                    <a
                      href={`mailto:${data.email ?? l.title.rendered.replace(/<[^>]+>/g, '')}`}
                      className="adm-btn adm-btn-primary adm-btn-sm"
                    >
                      Responder
                    </a>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}
