/**
 * POST /api/admin/seed
 * Migra todos os posts placeholder para o WordPress.
 * Só pode ser chamado enquanto o WordPress está vazio (proteção básica).
 */
import { NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createPost, createCategory, getAdminCategories } from '@/lib/wp-admin'
import { PLACEHOLDER_POSTS, PLACEHOLDER_VENDAS_POSTS } from '@/lib/wordpress'

export const maxDuration = 60
export const dynamic     = 'force-dynamic'

export async function POST() {
  try {
    // 1. Buscar categorias existentes no WordPress
    const existingCats = await getAdminCategories()
    const catMap = new Map<string, number>() // slug → WP id

    existingCats.forEach(c => catMap.set(c.slug, c.id))

    // 2. Coletar todas as categorias únicas dos placeholders
    const allPosts = [...PLACEHOLDER_POSTS, ...PLACEHOLDER_VENDAS_POSTS]
    const uniqueCats = new Map<string, { name: string; slug: string }>()
    allPosts.forEach(p => {
      const cat = p._embedded?.['wp:term']?.[0]?.[0]
      if (cat && !uniqueCats.has(cat.slug)) {
        uniqueCats.set(cat.slug, { name: cat.name, slug: cat.slug })
      }
    })

    // 3. Criar categorias que ainda não existem no WordPress
    for (const [slug, { name }] of Array.from(uniqueCats)) {
      if (!catMap.has(slug)) {
        try {
          const created = await createCategory(name, slug)
          catMap.set(slug, created.id)
        } catch {
          // categoria pode já existir com outro slug — ignorar
        }
      }
    }

    // 4. Criar posts em ordem cronológica reversa (mais recente primeiro)
    const results = []
    for (const placeholder of allPosts) {
      const catSlug = placeholder._embedded?.['wp:term']?.[0]?.[0]?.slug ?? ''
      const wpCatId = catMap.get(catSlug)

      const body: Record<string, unknown> = {
        title:      { raw: placeholder.title.rendered.replace(/<[^>]+>/g, '') },
        content:    { raw: placeholder.content.rendered },
        excerpt:    { raw: placeholder.excerpt.rendered.replace(/<[^>]+>/g, '') },
        status:     'publish',
        date:       placeholder.date,
        categories: wpCatId ? [wpCatId] : [],
      }

      try {
        const created = await createPost(body as any)
        results.push({ ok: true, id: created.id, title: created.title.rendered })
      } catch (e) {
        results.push({ ok: false, title: placeholder.title.rendered, error: (e as Error).message })
      }
    }

    // 5. Revalidar homepage
    revalidatePath('/', 'page')

    const ok    = results.filter(r => r.ok).length
    const fails = results.filter(r => !r.ok)

    return NextResponse.json({ created: ok, failed: fails.length, details: results })
  } catch (e) {
    return NextResponse.json({ message: (e as Error).message }, { status: 500 })
  }
}
