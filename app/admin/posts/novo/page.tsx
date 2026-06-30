import { getAdminCategories } from '@/lib/wp-admin'
import PostEditor from '../PostEditor'

export default async function NovoPostPage() {
  const categories = await getAdminCategories().catch(() => [])
  return (
    <>
      <div className="adm-topbar">
        <div className="adm-topbar-title">Novo post</div>
      </div>
      <div className="adm-content">
        <PostEditor categories={categories} />
      </div>
    </>
  )
}
