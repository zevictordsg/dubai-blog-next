import './admin.css'
import AdminSidebar from './Sidebar'

export const metadata = { title: 'Admin — GAP Capital Real Estate' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="adm-root">
      <AdminSidebar />
      <main className="adm-main">{children}</main>
    </div>
  )
}
