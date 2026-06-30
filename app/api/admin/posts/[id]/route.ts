import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { updatePost, deletePost } from '@/lib/wp-admin'

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10)
  try {
    const body = await req.json()
    const post = await updatePost(id, body)

    // Revalida a home e o slug do post imediatamente
    revalidatePath('/', 'page')
    revalidatePath('/categoria/[slug]', 'page')
    if (post.slug) revalidatePath(`/${post.slug}`, 'page')

    return NextResponse.json(post)
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10)
  try {
    await deletePost(id)
    revalidatePath('/', 'page')
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 })
  }
}
