'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SeedButton() {
  const router  = useRouter()
  const [state, setState] = useState<'idle' | 'loading' | 'done' | 'error'>('idle')
  const [msg,   setMsg]   = useState('')

  async function handleSeed() {
    if (!confirm('Importar os 18 artigos de exemplo para o WordPress? Isso criará categorias e posts automaticamente.')) return
    setState('loading')
    try {
      const res  = await fetch('/api/admin/seed', { method: 'POST' })
      const data = await res.json()
      if (res.ok) {
        setState('done')
        setMsg(`✓ ${data.created} posts importados${data.failed > 0 ? `, ${data.failed} falharam` : ''}.`)
        router.refresh()
      } else {
        setState('error')
        setMsg(`Erro: ${data.message}`)
      }
    } catch (e) {
      setState('error')
      setMsg('Falha na conexão com o servidor.')
    }
  }

  if (state === 'done')  return <span style={{ fontSize: 13, color: '#198754' }}>{msg}</span>
  if (state === 'error') return <span style={{ fontSize: 13, color: '#dc3545' }}>{msg}</span>

  return (
    <button
      onClick={handleSeed}
      disabled={state === 'loading'}
      className="adm-btn adm-btn-ghost adm-btn-sm"
      style={{ borderColor: 'var(--adm-amber)', color: 'var(--adm-amber)' }}
    >
      {state === 'loading' ? 'Importando…' : '↓ Importar artigos de exemplo'}
    </button>
  )
}
