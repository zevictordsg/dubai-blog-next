import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createPost } from '@/lib/wp-admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const post = await createPost(body)

    // Revalida a home e páginas de categoria imediatamente após criar post
    if (body.status === 'publish') {
      revalidatePath('/', 'page')
      revalidatePath('/categoria/[slug]', 'page')
      if (post.slug) revalidatePath(`/${post.slug}`, 'page')
    }

    return NextResponse.json(post, { status: 201 })
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 })
  }
}
