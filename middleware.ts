import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Computa o token HMAC esperado (Edge Runtime usa Web Crypto)
async function computeToken(secret: string): Promise<string> {
  const enc  = new TextEncoder()
  const key  = await globalThis.crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  )
  const sig  = await globalThis.crypto.subtle.sign('HMAC', key, enc.encode('gap:admin:authenticated'))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Rotas públicas dentro do /admin
  if (pathname === '/admin/login') return NextResponse.next()

  const secret   = process.env.ADMIN_SESSION_SECRET ?? 'change-me-please'
  const expected = await computeToken(secret)
  const token    = request.cookies.get('gap_admin')?.value

  if (!token || token !== expected) {
    const loginUrl = new URL('/admin/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/admin/:path*',
}
