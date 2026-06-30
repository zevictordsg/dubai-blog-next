import { NextRequest, NextResponse } from 'next/server'
import { deleteCategory } from '@/lib/wp-admin'

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await deleteCategory(parseInt(params.id, 10))
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 })
  }
}
