import { NextRequest, NextResponse } from 'next/server'
import { createPost } from '@/lib/wp-admin'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const post = await createPost(body)
    return NextResponse.json(post, { status: 201 })
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 })
  }
}
