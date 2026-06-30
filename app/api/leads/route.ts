import { NextRequest, NextResponse } from 'next/server'
import { createLead } from '@/lib/wp-admin'

export async function POST(req: NextRequest) {
  try {
    const { email, name, message } = await req.json()
    if (!email) return NextResponse.json({ message: 'Email obrigatório.' }, { status: 400 })
    await createLead(email, name ?? '', message ?? '')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 })
  }
}
