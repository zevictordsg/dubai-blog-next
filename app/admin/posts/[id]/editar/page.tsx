import { getAdminPost, getAdminCategories } from '@/lib/wp-admin'
import PostEditor from '../../PostEditor'
import { notFound } from 'next/navigation'

export default async function EditarPostPage({ params }: { params: { id: string } }) {
  const id = parseInt(params.id, 10)
  if (isNaN(id)) notFound()

  const [post, categories] = await Promise.all([
    getAdminPost(id).catch(() => null),
    getAdminCategories().catch(() => []),
  ])

  if (!post) notFound()

  return (
    <>
      <div className="adm-topbar">
        <div>
          <div className="adm-topbar-title">Editar post</div>
          <div style={{ fontSize: 13, color: 'var(--adm-muted)', marginTop: 2 }}>ID #{id}</div>
        </div>
      </div>
      <div className="adm-content">
        <PostEditor post={post} categories={categories} />
      </div>
    </>
  )
}
