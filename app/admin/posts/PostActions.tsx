'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function PostActions({ id, status, slug }: { id: number; status: string; slug: string }) {
  const router = useRouter()

  async function handleDelete() {
    if (!confirm('Excluir este post permanentemente?')) return
    const res = await fetch(`/api/admin/posts/${id}`, { method: 'DELETE' })
    if (res.ok) router.refresh()
    else alert('Erro ao excluir post.')
  }

  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <Link href={`/admin/posts/${id}/editar`} className="adm-btn adm-btn-ghost adm-btn-sm">
        Editar
      </Link>
      {status === 'publish' && (
        <a
          href={`/${slug}`}
          target="_blank"
          rel="noopener"
          className="adm-btn adm-btn-ghost adm-btn-sm"
        >
          Ver
        </a>
      )}
      <button onClick={handleDelete} className="adm-btn adm-btn-sm" style={{ background: 'rgba(220,53,69,.1)', color: '#dc3545' }}>
        ✕
      </button>
    </div>
  )
}
