'use client'

import { useState, useEffect } from 'react'

interface Category { id: number; name: string; slug: string; count: number }

export default function CategoriasPage() {
  const [cats,    setCats]    = useState<Category[]>([])
  const [name,    setName]    = useState('')
  const [slug,    setSlug]    = useState('')
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [toast,   setToast]   = useState('')
  const [toastType, setToastType] = useState<'success'|'error'>('success')

  function showToast(msg: string, type: 'success'|'error' = 'success') {
    setToast(msg); setToastType(type)
    setTimeout(() => setToast(''), 3000)
  }

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/categorias')
    if (res.ok) setCats(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  function handleNameChange(v: string) {
    setName(v)
    setSlug(
      v.toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim().replace(/\s+/g, '-')
    )
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    setSaving(true)
    const res = await fetch('/api/admin/categorias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, slug }),
    })
    setSaving(false)
    if (res.ok) {
      showToast('Categoria criada!')
      setName(''); setSlug('')
      load()
    } else {
      const err = await res.json().catch(() => ({ message: 'Erro' }))
      showToast(err.message ?? 'Erro ao criar.', 'error')
    }
  }

  async function handleDelete(id: number, name: string) {
    if (!confirm(`Excluir a categoria "${name}"? Posts não serão excluídos.`)) return
    const res = await fetch(`/api/admin/categorias/${id}`, { method: 'DELETE' })
    if (res.ok) { showToast('Categoria excluída.'); load() }
    else showToast('Erro ao excluir.', 'error')
  }

  const visible = cats.filter(c => c.id !== 1) // hide Uncategorized

  return (
    <>
      {toast && <div className={`adm-toast ${toastType}`}>{toast}</div>}

      <div className="adm-topbar">
        <div className="adm-topbar-title">Categorias</div>
      </div>

      <div className="adm-content">
        <div className="adm-grid-2">
          {/* Form nova categoria */}
          <div className="adm-card adm-card-body">
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 20 }}>Nova categoria</div>
            <form onSubmit={handleCreate} className="adm-form">
              <div className="adm-field">
                <label className="adm-label">Nome *</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="ex: Investimento"
                  value={name}
                  onChange={e => handleNameChange(e.target.value)}
                  required
                />
              </div>
              <div className="adm-field">
                <label className="adm-label">Slug</label>
                <input
                  type="text"
                  className="adm-input"
                  placeholder="investimento"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                />
                <div className="adm-input-hint">/categoria/{slug}</div>
              </div>
              <button
                type="submit"
                className="adm-btn adm-btn-primary"
                disabled={saving}
                style={{ alignSelf: 'flex-start' }}
              >
                {saving ? 'Criando…' : 'Criar categoria'}
              </button>
            </form>
          </div>

          {/* Lista de categorias */}
          <div className="adm-card">
            <div className="adm-card-body" style={{ paddingBottom: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 16 }}>
                Categorias existentes
              </div>
            </div>
            {loading ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--adm-muted)', fontSize: 14 }}>Carregando…</div>
            ) : visible.length === 0 ? (
              <div className="adm-empty">
                <div className="adm-empty-icon">◉</div>
                <div className="adm-empty-title">Nenhuma categoria</div>
              </div>
            ) : (
              <div className="adm-table-wrap">
                <table className="adm-table">
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Slug</th>
                      <th>Posts</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {visible.map(c => (
                      <tr key={c.id}>
                        <td style={{ fontWeight: 600 }}>{c.name}</td>
                        <td style={{ fontSize: 13, color: 'var(--adm-muted)' }}>{c.slug}</td>
                        <td>
                          <span className="adm-badge adm-badge-gray">{c.count}</span>
                        </td>
                        <td>
                          <button
                            onClick={() => handleDelete(c.id, c.name)}
                            className="adm-btn adm-btn-sm"
                            style={{ background: 'rgba(220,53,69,.1)', color: '#dc3545' }}
                          >
                            Excluir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
