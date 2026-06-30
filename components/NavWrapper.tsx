'use client'

import { usePathname } from 'next/navigation'
import Nav from './Nav'
import type { WPCategory } from '@/lib/wordpress'

export default function NavWrapper({ categories }: { categories: WPCategory[] }) {
  const path = usePathname()
  if (path.startsWith('/admin')) return null
  return <Nav categories={categories} />
}
