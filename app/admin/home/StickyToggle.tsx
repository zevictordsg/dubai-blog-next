'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function StickyToggle({ id, sticky }: { id: number; sticky: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    await fetch(`/api/admin/posts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sticky: !sticky }),
    })
    setLoading(false)
    router.refresh()
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`adm-btn adm-btn-sm ${sticky ? 'adm-btn-primary' : 'adm-btn-ghost'}`}
      style={{ fontSize: 12, padding: '4px 10px' }}
    >
      {loading ? '…' : sticky ? '★ Destaque ativo' : '☆ Fixar destaque'}
    </button>
  )
}
