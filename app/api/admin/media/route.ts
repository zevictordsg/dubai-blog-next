import { NextRequest, NextResponse } from 'next/server'
import { getAdminMedia, uploadMedia } from '@/lib/wp-admin'

export async function GET() {
  try {
    const media = await getAdminMedia()
    return NextResponse.json(media)
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const form     = await req.formData()
    const file     = form.get('file') as File
    if (!file) return NextResponse.json({ message: 'Nenhum arquivo enviado.' }, { status: 400 })

    const buffer   = await file.arrayBuffer()
    const media    = await uploadMedia(buffer, file.name, file.type)
    return NextResponse.json(media, { status: 201 })
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 })
  }
}
