import { NextRequest, NextResponse } from 'next/server'
import { updatePost, deletePost } from '@/lib/wp-admin'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10)
  try {
    const body = await req.json()
    const post = await updatePost(id, body)
    return NextResponse.json(post)
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10)
  try {
    await deletePost(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 })
  }
}
