'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NAV = [
  {
    label: 'Principal',
    items: [
      { href: '/admin/dashboard',   label: 'Dashboard',   icon: '⊞' },
    ],
  },
  {
    label: 'Conteúdo',
    items: [
      { href: '/admin/home',        label: 'Home',        icon: '◈' },
      { href: '/admin/posts',       label: 'Posts',       icon: '✦' },
      { href: '/admin/categorias',  label: 'Categorias',  icon: '◉' },
      { href: '/admin/midia',       label: 'Mídia',       icon: '⬡' },
    ],
  },
  {
    label: 'Negócios',
    items: [
      { href: '/admin/leads',       label: 'Leads',       icon: '◎' },
    ],
  },
]

export default function AdminSidebar() {
  const path = usePathname()

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    window.location.href = '/admin/login'
  }

  return (
    <aside className="adm-sidebar">
      <div className="adm-logo">
        <div className="adm-logo-mark">GAP Capital</div>
        <div className="adm-logo-sub">Painel de Gestão</div>
      </div>

      <nav className="adm-nav">
        {NAV.map(({ label, items }) => (
          <div key={label}>
            <div className="adm-nav-label" style={{ color: 'rgba(234,200,172,0.55)' }}>{label}</div>
            {items.map(({ href, label: lbl, icon }) => {
              const isActive = path.startsWith(href)
              return (
                <Link
                  key={href}
                  href={href}
                  className={`adm-nav-link${isActive ? ' active' : ''}`}
                  style={{
                    color: isActive ? '#EAC8AC' : 'rgba(234,200,172,0.88)',
                  }}
                >
                  <span style={{ fontSize: 14 }}>{icon}</span>
                  {lbl}
                </Link>
              )
            })}
          </div>
        ))}
      </nav>

      <div className="adm-sidebar-footer">
        <button
          onClick={logout}
          className="adm-nav-link"
          style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left', color: 'rgba(234,200,172,0.75)' }}
        >
          <span style={{ fontSize: 14 }}>↪</span>
          Sair
        </button>
        <div style={{ fontSize: 11, color: 'rgba(234,200,172,.25)', marginTop: 12, paddingLeft: 12 }}>
          gapcapitalrealestate.com.br
        </div>
      </div>
    </aside>
  )
}
