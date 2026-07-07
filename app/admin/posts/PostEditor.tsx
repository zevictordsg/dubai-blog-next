'use client'

import { useState, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { WPAdminPost, WPAdminCategory } from '@/lib/wp-admin'

interface Props {
  post?:       WPAdminPost
  categories:  WPAdminCategory[]
}

export default function PostEditor({ post, categories }: Props) {
  const router  = useRouter()
  const edRef   = useRef<HTMLDivElement>(null)

  const [title,     setTitle]     = useState(post?.title.raw     ?? '')
  const [excerpt,   setExcerpt]   = useState(post?.excerpt.raw   ?? '')
  const [slug,      setSlug]      = useState(post?.slug          ?? '')
  const [status,    setStatus]    = useState<string>(post?.status ?? 'draft')
  const [catIds,    setCatIds]    = useState<number[]>(post?.categories ?? [])
  const [featMedia, setFeatMedia] = useState(post?.featured_media ?? 0)
  const [featUrl,   setFeatUrl]   = useState(
    post?._embedded?.['wp:featuredmedia']?.[0]?.source_url ?? ''
  )
  const [sticky,         setSticky]         = useState(post?.sticky ?? false)
  const [audioUrl,       setAudioUrl]       = useState(post?.meta?.dubai_audio_file ?? '')
  const [audioUploading, setAudioUploading] = useState(false)
  const [saving,         setSaving]         = useState(false)
  const [toast,          setToast]          = useState('')
  const [toastType,      setToastType]      = useState<'success'|'error'>('success')

  // Toast helper
  function showToast(msg: string, type: 'success'|'error' = 'success') {
    setToast(msg)
    setToastType(type)
    setTimeout(() => setToast(''), 3000)
  }

  // Auto-slug from title
  function handleTitleChange(v: string) {
    setTitle(v)
    if (!post) {
      setSlug(
        v.toLowerCase()
          .normalize('NFD').replace(/[̀-ͯ]/g, '')
          .replace(/[^a-z0-9\s-]/g, '')
          .trim().replace(/\s+/g, '-')
      )
    }
  }

  // Toolbar formatting (execCommand)
  const fmt = useCallback((cmd: string, val?: string) => {
    edRef.current?.focus()
    document.execCommand(cmd, false, val ?? undefined)
  }, [])

  // Imagem no body via URL
  function insertImage() {
    const url = prompt('URL da imagem:')
    if (url) fmt('insertHTML', `<img src="${url}" alt="" style="max-width:100%;border-radius:8px;margin:8px 0;" />`)
  }

  // Link
  function insertLink() {
    const url = prompt('URL do link:')
    if (url) fmt('createLink', url)
  }

  // Upload MP3 de áudio
  async function handleAudioUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setAudioUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
    const data = await res.json()
    setAudioUploading(false)
    if (res.ok) {
      setAudioUrl(data.source_url)
      showToast('Áudio enviado!')
    } else {
      showToast(`Erro no upload: ${data.message ?? res.status}`, 'error')
    }
    e.target.value = ''
  }

  // Upload imagem destacada
  async function handleFeaturedUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
    const data = await res.json()
    if (res.ok) {
      setFeatMedia(data.id)
      setFeatUrl(data.source_url)
    } else {
      showToast(`Erro no upload: ${data.message ?? res.status}`, 'error')
    }
  }

  // Salvar
  async function handleSave(publishNow = false) {
    setSaving(true)
    const content = edRef.current?.innerHTML ?? ''
    const body = {
      title:          title,
      content:        content,
      excerpt:        excerpt,
      slug:           slug || undefined,
      status:         publishNow ? 'publish' : status,
      categories:     catIds,
      featured_media: featMedia || undefined,
      sticky:         sticky,
      meta: {
        dubai_audio_file:  audioUrl || '',
        dubai_audio_title: title    || '',
      },
    }

    const url    = post ? `/api/admin/posts/${post.id}` : '/api/admin/posts'
    const method = post ? 'PUT' : 'POST'
    const res    = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body),
    })

    setSaving(false)
    if (res.ok) {
      const saved = await res.json()
      showToast(publishNow ? 'Post publicado!' : 'Rascunho salvo.')
      if (!post) router.replace(`/admin/posts/${saved.id}/editar`)
      if (publishNow) setStatus('publish')
    } else {
      const err = await res.json().catch(() => ({ message: 'Erro desconhecido' }))
      showToast(err.message ?? 'Erro ao salvar.', 'error')
    }
  }

  const isEdit = !!post

  return (
    <>
      {toast && <div className={`adm-toast ${toastType}`}>{toast}</div>}

      <div className="adm-grid-sidebar">
        {/* Editor principal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Título */}
          <div className="adm-field">
            <label className="adm-label">Título do post *</label>
            <input
              type="text"
              className="adm-input"
              placeholder="Escreva um título chamativo…"
              value={title}
              onChange={e => handleTitleChange(e.target.value)}
              style={{ fontSize: 18, fontWeight: 600 }}
            />
          </div>

          {/* Slug */}
          <div className="adm-field">
            <label className="adm-label">Slug (URL)</label>
            <input
              type="text"
              className="adm-input"
              placeholder="url-do-post"
              value={slug}
              onChange={e => setSlug(e.target.value)}
            />
            <div className="adm-input-hint">gapcapitalrealestate.com.br/{slug}</div>
          </div>

          {/* Editor rico */}
          <div className="adm-field">
            <label className="adm-label">Conteúdo</label>
            <div className="adm-editor-wrap">
              {/* Toolbar */}
              <div className="adm-toolbar">
                <button className="adm-toolbar-btn" title="Negrito" onClick={() => fmt('bold')}><b>B</b></button>
                <button className="adm-toolbar-btn" title="Itálico" onClick={() => fmt('italic')}><i>I</i></button>
                <button className="adm-toolbar-btn" title="Sublinhado" onClick={() => fmt('underline')}><u>U</u></button>
                <div className="adm-toolbar-sep" />
                <button className="adm-toolbar-btn" title="Título H2" onClick={() => fmt('formatBlock', 'H2')}>H2</button>
                <button className="adm-toolbar-btn" title="Título H3" onClick={() => fmt('formatBlock', 'H3')}>H3</button>
                <button className="adm-toolbar-btn" title="Parágrafo" onClick={() => fmt('formatBlock', 'P')}>¶</button>
                <div className="adm-toolbar-sep" />
                <button className="adm-toolbar-btn" title="Lista com marcadores" onClick={() => fmt('insertUnorderedList')}>• —</button>
                <button className="adm-toolbar-btn" title="Lista numerada" onClick={() => fmt('insertOrderedList')}>1.</button>
                <button className="adm-toolbar-btn" title="Citação" onClick={() => fmt('formatBlock', 'BLOCKQUOTE')}>❝</button>
                <div className="adm-toolbar-sep" />
                <button className="adm-toolbar-btn" title="Link" onClick={insertLink}>🔗</button>
                <button className="adm-toolbar-btn" title="Imagem" onClick={insertImage}>🖼</button>
                <div className="adm-toolbar-sep" />
                <button className="adm-toolbar-btn" title="Desfazer" onClick={() => fmt('undo')}>↩</button>
                <button className="adm-toolbar-btn" title="Refazer" onClick={() => fmt('redo')}>↪</button>
              </div>
              {/* Área de texto */}
              <div
                ref={edRef}
                className="adm-editor"
                contentEditable
                suppressContentEditableWarning
                dangerouslySetInnerHTML={{ __html: post?.content.raw ?? '' }}
              />
            </div>
          </div>

          {/* Resumo */}
          <div className="adm-field">
            <label className="adm-label">Resumo / Excerpt</label>
            <textarea
              className="adm-textarea"
              placeholder="Breve descrição do post (usado em cards e SEO)…"
              value={excerpt}
              onChange={e => setExcerpt(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        {/* Sidebar direita */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Publicar */}
          <div className="adm-card adm-card-body">
            <div style={{ fontWeight: 700, marginBottom: 16, fontSize: 15 }}>Publicar</div>
            <div className="adm-field" style={{ marginBottom: 16 }}>
              <label className="adm-label">Status</label>
              <select
                className="adm-select"
                value={status}
                onChange={e => setStatus(e.target.value)}
              >
                <option value="draft">Rascunho</option>
                <option value="publish">Publicado</option>
                <option value="private">Privado</option>
                <option value="pending">Aguardando revisão</option>
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <button
                onClick={() => handleSave(false)}
                disabled={saving}
                className="adm-btn adm-btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                {saving ? 'Salvando…' : isEdit ? 'Salvar alterações' : 'Salvar rascunho'}
              </button>
              {status !== 'publish' && (
                <button
                  onClick={() => handleSave(true)}
                  disabled={saving}
                  className="adm-btn adm-btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Publicar agora
                </button>
              )}
            </div>
          </div>

          {/* Categorias */}
          <div className="adm-card adm-card-body">
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Categorias</div>
            {categories.filter(c => c.id !== 1).length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--adm-muted)' }}>
                Crie categorias em <a href="/admin/categorias" style={{ color: 'var(--adm-amber)' }}>Categorias</a>.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {categories.filter(c => c.id !== 1).map(c => (
                  <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 14 }}>
                    <input
                      type="checkbox"
                      checked={catIds.includes(c.id)}
                      onChange={e => {
                        if (e.target.checked) setCatIds(prev => [...prev, c.id])
                        else setCatIds(prev => prev.filter(id => id !== c.id))
                      }}
                    />
                    {c.name}
                    <span style={{ fontSize: 11, color: 'var(--adm-muted)' }}>({c.count})</span>
                  </label>
                ))}
              </div>
            )}
          </div>

          {/* Posição na home */}
          <div className="adm-card adm-card-body">
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Posição na Home</div>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={sticky}
                onChange={e => setSticky(e.target.checked)}
                style={{ marginTop: 3, accentColor: 'var(--adm-amber)', width: 16, height: 16 }}
              />
              <div>
                <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--adm-text)' }}>
                  Fixar como destaque principal
                </div>
                <div style={{ fontSize: 12, color: 'var(--adm-muted)', marginTop: 3, lineHeight: 1.5 }}>
                  Aparece no card grande no topo da home. Só um post pode ser destaque por vez.
                </div>
              </div>
            </label>
            <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--adm-bg)', borderRadius: 8, fontSize: 12, color: 'var(--adm-muted)', lineHeight: 1.7 }}>
              <strong style={{ color: 'var(--adm-text)', display: 'block', marginBottom: 4 }}>Como os posts aparecem:</strong>
              ◈ <strong>Destaque</strong> — marcado acima (1 post)<br/>
              ◉ <strong>Overlay</strong> — 2 posts mais recentes<br/>
              ✦ <strong>Cards</strong> — próximos 4 posts<br/>
              ⬡ <strong>Lista</strong> — demais posts<br/>
              ◎ <strong>Vendas</strong> — categoria "Vendas"
            </div>
          </div>

          {/* Áudio */}
          <div className="adm-card adm-card-body">
            <div style={{ fontWeight: 700, marginBottom: 6, fontSize: 15 }}>Áudio do Artigo</div>
            <div style={{ fontSize: 12, color: 'var(--adm-muted)', marginBottom: 10, lineHeight: 1.5 }}>
              Faça upload de um arquivo MP3. Aparece como player no início do artigo.
            </div>

            {audioUrl ? (
              /* Arquivo já enviado — mostra player + botão remover */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <audio controls src={audioUrl} style={{ width: '100%', height: 36 }} />
                <div style={{ fontSize: 11, color: 'var(--adm-muted)', wordBreak: 'break-all' }}>{audioUrl}</div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <label style={{ flex: 1, cursor: 'pointer' }}>
                    <div className="adm-btn adm-btn-ghost adm-btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                      {audioUploading ? 'Enviando…' : 'Substituir MP3'}
                    </div>
                    <input
                      type="file"
                      accept="audio/mpeg,audio/mp3,.mp3"
                      style={{ display: 'none' }}
                      onChange={handleAudioUpload}
                      disabled={audioUploading}
                    />
                  </label>
                  <button
                    className="adm-btn adm-btn-ghost adm-btn-sm"
                    onClick={() => setAudioUrl('')}
                    style={{ color: '#e05252' }}
                  >
                    Remover
                  </button>
                </div>
              </div>
            ) : (
              /* Sem áudio — upload zone */
              <label style={{ cursor: audioUploading ? 'wait' : 'pointer' }}>
                <div
                  className="adm-upload-zone"
                  style={{ padding: '24px 16px' }}
                  onClick={() => !audioUploading && document.getElementById('audio-upload')?.click()}
                >
                  <div className="adm-upload-icon">🎵</div>
                  <div style={{ fontSize: 13, color: 'var(--adm-muted)' }}>
                    {audioUploading ? 'Enviando áudio…' : 'Clique para selecionar o MP3'}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--adm-muted)', marginTop: 4 }}>MP3 · até 50 MB</div>
                </div>
                <input
                  id="audio-upload"
                  type="file"
                  accept="audio/mpeg,audio/mp3,.mp3"
                  style={{ display: 'none' }}
                  onChange={handleAudioUpload}
                  disabled={audioUploading}
                />
              </label>
            )}
          </div>

          {/* Imagem destacada */}
          <div className="adm-card adm-card-body">
            <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 15 }}>Imagem destacada</div>
            {featUrl ? (
              <div>
                <img src={featUrl} alt="" style={{ width: '100%', borderRadius: 8, marginBottom: 10, objectFit: 'cover', aspectRatio: '16/9' }} />
                <button
                  onClick={() => { setFeatMedia(0); setFeatUrl('') }}
                  className="adm-btn adm-btn-ghost adm-btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Remover imagem
                </button>
              </div>
            ) : (
              <label style={{ cursor: 'pointer' }}>
                <div
                  className="adm-upload-zone"
                  style={{ padding: '28px 16px' }}
                  onClick={() => document.getElementById('feat-upload')?.click()}
                >
                  <div className="adm-upload-icon">🖼</div>
                  <div style={{ fontSize: 13, color: 'var(--adm-muted)' }}>Clique para selecionar</div>
                </div>
                <input
                  id="feat-upload"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleFeaturedUpload}
                />
              </label>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
