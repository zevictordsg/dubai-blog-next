/**
 * WordPress REST API — operações de escrita para o painel admin.
 * Usa Application Password armazenado em variáveis de ambiente.
 * Só deve ser importado em Server Components / API Routes (Node.js runtime).
 */

const WP_BASE = (process.env.WORDPRESS_API_URL ?? 'https://cms.gapcapitalrealestate.com.br/wp-json/wp/v2')

function authHeader(): string {
  const user = process.env.WP_APP_USER     ?? ''
  const pass = process.env.WP_APP_PASSWORD ?? ''
  return 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64')
}

async function wpFetchAdmin<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${WP_BASE}${path}`, {
    ...init,
    headers: {
      'Authorization': authHeader(),
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
    cache: 'no-store',
  })

  if (!res.ok) {
    let msg = `WP API ${res.status}`
    try { msg = (await res.json()).message ?? msg } catch { /* noop */ }
    throw new Error(msg)
  }

  if (res.status === 204) return {} as T
  return res.json()
}

/* ── POSTS ──────────────────────────────────────────────────────────────── */

export interface WPAdminPost {
  id:            number
  title:         { rendered: string; raw?: string }
  content:       { rendered: string; raw?: string }
  excerpt:       { rendered: string; raw?: string }
  status:        'publish' | 'draft' | 'private' | 'pending' | 'trash'
  slug:          string
  date:          string
  modified:      string
  featured_media: number
  categories:    number[]
  tags:          number[]
  sticky:        boolean
  meta?:         { dubai_audio_file?: string; dubai_audio_title?: string }
  _embedded?:    { 'wp:featuredmedia'?: { source_url: string; alt_text: string }[] }
}

export async function getAdminPosts(status = 'any', page = 1): Promise<WPAdminPost[]> {
  return wpFetchAdmin<WPAdminPost[]>(
    `/posts?per_page=20&page=${page}&status=${encodeURIComponent(status)}&context=edit&_embed=1`
  )
}

export async function getAdminPost(id: number): Promise<WPAdminPost> {
  return wpFetchAdmin<WPAdminPost>(`/posts/${id}?context=edit&_embed=1`)
}

export async function createPost(data: Partial<WPAdminPost>): Promise<WPAdminPost> {
  return wpFetchAdmin<WPAdminPost>('/posts', { method: 'POST', body: JSON.stringify(data) })
}

export async function updatePost(id: number, data: Partial<WPAdminPost>): Promise<WPAdminPost> {
  return wpFetchAdmin<WPAdminPost>(`/posts/${id}`, { method: 'POST', body: JSON.stringify(data) })
}

export async function deletePost(id: number): Promise<void> {
  await wpFetchAdmin<void>(`/posts/${id}?force=true`, { method: 'DELETE' })
}

/* ── CATEGORIES ─────────────────────────────────────────────────────────── */

export interface WPAdminCategory {
  id:     number
  name:   string
  slug:   string
  count:  number
  parent: number
}

export async function getAdminCategories(): Promise<WPAdminCategory[]> {
  return wpFetchAdmin<WPAdminCategory[]>('/categories?per_page=100&hide_empty=false')
}

export async function createCategory(name: string, slug: string, parent = 0): Promise<WPAdminCategory> {
  return wpFetchAdmin<WPAdminCategory>('/categories', {
    method: 'POST',
    body: JSON.stringify({ name, slug, parent }),
  })
}

export async function deleteCategory(id: number): Promise<void> {
  await wpFetchAdmin<void>(`/categories/${id}?force=true`, { method: 'DELETE' })
}

/* ── MEDIA ──────────────────────────────────────────────────────────────── */

export interface WPMedia {
  id:         number
  date:       string
  title:      { rendered: string }
  source_url: string
  alt_text:   string
  mime_type:  string
  media_details: { width: number; height: number }
}

export async function getAdminMedia(page = 1): Promise<WPMedia[]> {
  return wpFetchAdmin<WPMedia[]>(`/media?per_page=20&page=${page}`)
}

export async function uploadMedia(buffer: ArrayBuffer, filename: string, mimeType: string): Promise<WPMedia> {
  const user = process.env.WP_APP_USER     ?? ''
  const pass = process.env.WP_APP_PASSWORD ?? ''
  const auth = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64')

  // Node.js fetch precisa de Buffer, não ArrayBuffer
  const nodeBuffer = Buffer.from(buffer)

  const res = await fetch(`${WP_BASE}/media`, {
    method: 'POST',
    headers: {
      'Authorization':        auth,
      'Content-Type':         mimeType,
      'Content-Disposition':  `attachment; filename="${encodeURIComponent(filename)}"`,
    },
    body: nodeBuffer,
    cache: 'no-store',
  })

  if (!res.ok) {
    let msg = `Upload ${res.status}`
    try { msg = (await res.json()).message ?? msg } catch { /* noop */ }
    throw new Error(msg)
  }

  return res.json()
}

/* ── LEADS (armazenados como posts privados com tag "lead") ──────────────── */

export interface LeadPost {
  id:       number
  date:     string
  title:    { rendered: string }  // email
  content:  { rendered: string }  // JSON com dados do lead
  status:   string
}

let leadsTagId: number | null = null

async function getOrCreateLeadsTag(): Promise<number> {
  if (leadsTagId) return leadsTagId

  // Tenta encontrar a tag
  const tags = await wpFetchAdmin<{ id: number; slug: string }[]>('/tags?search=lead&per_page=10')
  const existing = tags.find(t => t.slug === 'lead')
  if (existing) {
    leadsTagId = existing.id
    return existing.id
  }

  // Cria a tag
  const created = await wpFetchAdmin<{ id: number }>('/tags', {
    method: 'POST',
    body: JSON.stringify({ name: 'Lead', slug: 'lead' }),
  })
  leadsTagId = created.id
  return created.id
}

export async function createLead(email: string, name: string, message: string): Promise<void> {
  const tagId = await getOrCreateLeadsTag()
  await wpFetchAdmin('/posts', {
    method: 'POST',
    body: JSON.stringify({
      title:   email,
      content: JSON.stringify({ email, name, message, date: new Date().toISOString() }),
      status:  'private',
      tags:    [tagId],
    }),
  })
}

export async function getLeads(page = 1): Promise<LeadPost[]> {
  const tagId = await getOrCreateLeadsTag()
  return wpFetchAdmin<LeadPost[]>(
    `/posts?per_page=50&page=${page}&status=private&tags=${tagId}&context=edit`
  )
}
