'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function FooterWrapper() {
  const path = usePathname()
  if (path.startsWith('/admin')) return null
  return <Footer />
}
