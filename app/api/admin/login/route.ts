import { NextRequest, NextResponse } from 'next/server'

async function computeToken(secret: string): Promise<string> {
  const enc = new TextEncoder()
  const key = await globalThis.crypto.subtle.importKey(
    'raw', enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false, ['sign']
  )
  const sig = await globalThis.crypto.subtle.sign('HMAC', key, enc.encode('gap:admin:authenticated'))
  return Array.from(new Uint8Array(sig)).map(b => b.toString(16).padStart(2, '0')).join('')
}

export async function POST(req: NextRequest) {
  const { password } = await req.json().catch(() => ({ password: '' }))

  const expected = process.env.ADMIN_PASSWORD ?? ''
  if (!password || password !== expected) {
    return NextResponse.json({ message: 'Senha incorreta.' }, { status: 401 })
  }

  const secret = process.env.ADMIN_SESSION_SECRET ?? 'change-me-please'
  const token  = await computeToken(secret)

  const res = NextResponse.json({ ok: true })
  res.cookies.set('gap_admin', token, {
    httpOnly: true,
    secure:   process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path:     '/',
    maxAge:   60 * 60 * 24 * 30, // 30 dias
  })

  return res
}
