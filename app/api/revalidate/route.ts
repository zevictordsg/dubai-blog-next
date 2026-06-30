import { revalidatePath, revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  try {
    // Revalida todas as páginas principais
    revalidatePath('/', 'layout')
    revalidateTag('posts')
    revalidateTag('categories')

    // Revalida o slug específico se enviado pelo webhook
    const body = await req.json().catch(() => null)
    if (body?.post_name) {
      revalidatePath(`/${body.post_name}`)
    }

    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    return NextResponse.json({ message: 'Error revalidating', err }, { status: 500 })
  }
}

// GET para testes manuais no browser
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')

  if (secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 })
  }

  revalidatePath('/', 'layout')
  return NextResponse.json({ revalidated: true, now: Date.now() })
}
