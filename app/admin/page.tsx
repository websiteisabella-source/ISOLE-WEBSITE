import type { Metadata } from 'next'

import { AdminCatalogApp } from '@/components/admin/admin-catalog-app'

export const metadata: Metadata = {
  title: 'Admin catalogo',
  robots: {
    index: false,
    follow: false,
  },
}

export default function AdminPage() {
  return <AdminCatalogApp />
}
