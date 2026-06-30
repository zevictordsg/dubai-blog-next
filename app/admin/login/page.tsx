'use client'

import { useState, FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function LoginForm() {
  const router      = useRouter()
  const params      = useSearchParams()
  const from        = params.get('from') ?? '/admin/dashboard'

  const [password, setPassword] = useState('')
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ password }),
    })

    if (res.ok) {
      router.replace(from)
    } else {
      const { message } = await res.json().catch(() => ({ message: 'Erro desconhecido' }))
      setError(message ?? 'Senha incorreta')
      setLoading(false)
    }
  }

  return (
    <div className="adm-login-wrap">
      <div className="adm-login-box">
        <div className="adm-login-logo">GAP Capital Real Estate</div>
        <div className="adm-login-title">Bem-vindo de volta</div>
        <div className="adm-login-sub">Entre com sua senha para acessar o painel.</div>

        {error && <div className="adm-error-msg">{error}</div>}

        <form onSubmit={handleSubmit} className="adm-form">
          <div className="adm-field">
            <label className="adm-label" htmlFor="password">Senha</label>
            <input
              id="password"
              type="password"
              className="adm-input"
              placeholder="••••••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoFocus
            />
          </div>

          <button
            type="submit"
            className="adm-btn adm-btn-primary"
            disabled={loading}
            style={{ width: '100%', justifyContent: 'center', padding: '12px' }}
          >
            {loading ? 'Entrando…' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
