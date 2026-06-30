'use client'

import { useState, useEffect, useRef } from 'react'

interface MediaItem { id: number; source_url: string; title: { rendered: string }; date: string }

export default function MidiaPage() {
  const [media,    setMedia]    = useState<MediaItem[]>([])
  const [loading,  setLoading]  = useState(true)
  const [uploading,setUploading]= useState(false)
  const [selected, setSelected] = useState<MediaItem | null>(null)
  const [toast,    setToast]    = useState('')
  const [toastType,setToastType]= useState<'success'|'error'>('success')
  const inputRef = useRef<HTMLInputElement>(null)

  function showToast(msg: string, type: 'success'|'error' = 'success') {
    setToast(msg); setToastType(type)
    setTimeout(() => setToast(''), 3000)
  }

  async function load() {
    setLoading(true)
    const res = await fetch('/api/admin/media')
    if (res.ok) setMedia(await res.json())
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  async function handleUpload(files: FileList | null) {
    if (!files?.length) return
    setUploading(true)
    for (const file of Array.from(files)) {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/admin/media', { method: 'POST', body: fd })
      if (!res.ok) showToast(`Erro ao enviar ${file.name}`, 'error')
    }
    setUploading(false)
    showToast('Upload concluído!')
    load()
  }

  function copyUrl(url: string) {
    navigator.clipboard.writeText(url)
    showToast('URL copiada!')
  }

  return (
    <>
      {toast && <div className={`adm-toast ${toastType}`}>{toast}</div>}

      <div className="adm-topbar">
        <div className="adm-topbar-title">Mídia</div>
        <div className="adm-topbar-actions">
          <button
            className="adm-btn adm-btn-primary adm-btn-sm"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
          >
            {uploading ? 'Enviando…' : '+ Upload'}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*,.pdf"
            multiple
            style={{ display: 'none' }}
            onChange={e => handleUpload(e.target.files)}
          />
        </div>
      </div>

      <div className="adm-content">
        {/* Drop zone */}
        <div
          className="adm-upload-zone"
          style={{ marginBottom: 24 }}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); e.currentTarget.classList.add('drag') }}
          onDragLeave={e => e.currentTarget.classList.remove('drag')}
          onDrop={e => {
            e.preventDefault()
            e.currentTarget.classList.remove('drag')
            handleUpload(e.dataTransfer.files)
          }}
        >
          <div className="adm-upload-icon">⬡</div>
          <div style={{ fontWeight: 600, color: 'var(--adm-text)', marginBottom: 6 }}>
            Arraste arquivos ou clique para selecionar
          </div>
          <div style={{ fontSize: 13, color: 'var(--adm-muted)' }}>
            Imagens, PDFs — múltiplos arquivos permitidos
          </div>
        </div>

        {/* Grid de mídia */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 48, color: 'var(--adm-muted)' }}>Carregando…</div>
        ) : media.length === 0 ? (
          <div className="adm-empty">
            <div className="adm-empty-icon">⬡</div>
            <div className="adm-empty-title">Nenhuma mídia ainda</div>
            <p style={{ fontSize: 14, color: 'var(--adm-muted)', marginTop: 8 }}>Faça o upload de imagens para usar nos posts.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
            <div className="adm-media-grid" style={{ flex: 1 }}>
              {media.map(m => (
                <div
                  key={m.id}
                  className={`adm-media-item${selected?.id === m.id ? ' selected' : ''}`}
                  onClick={() => setSelected(selected?.id === m.id ? null : m)}
                >
                  <img
                    src={m.source_url}
                    alt={m.title.rendered}
                    loading="lazy"
                  />
                  <div className="adm-media-item-overlay">
                    {m.title.rendered || m.source_url.split('/').pop()}
                  </div>
                </div>
              ))}
            </div>

            {/* Painel de detalhes */}
            {selected && (
              <div className="adm-card adm-card-body" style={{ width: 260, flexShrink: 0 }}>
                <img
                  src={selected.source_url}
                  alt=""
                  style={{ width: '100%', borderRadius: 8, marginBottom: 16, objectFit: 'cover', aspectRatio: '16/9' }}
                />
                <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4, wordBreak: 'break-word' }}>
                  {selected.title.rendered || 'Sem nome'}
                </div>
                <div style={{ fontSize: 12, color: 'var(--adm-muted)', marginBottom: 16 }}>
                  {new Date(selected.date).toLocaleDateString('pt-BR')}
                </div>
                <div style={{ fontSize: 12, wordBreak: 'break-all', color: 'var(--adm-muted)', marginBottom: 12, background: 'var(--adm-bg)', padding: '8px 10px', borderRadius: 6 }}>
                  {selected.source_url}
                </div>
                <button
                  onClick={() => copyUrl(selected.source_url)}
                  className="adm-btn adm-btn-primary adm-btn-sm"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Copiar URL
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  )
}
