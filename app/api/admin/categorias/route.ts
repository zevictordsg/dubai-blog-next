import { NextRequest, NextResponse } from 'next/server'
import { getAdminCategories, createCategory } from '@/lib/wp-admin'

export async function GET() {
  try {
    const cats = await getAdminCategories()
    return NextResponse.json(cats)
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, slug, parent } = await req.json()
    const cat = await createCategory(name, slug, parent)
    return NextResponse.json(cat, { status: 201 })
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 })
  }
}
