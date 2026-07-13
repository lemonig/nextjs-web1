'use client'

import { Layout } from 'antd'
import type { ReactNode } from 'react'

const { Content } = Layout

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content style={{ padding: 16 }}>{children}</Content>
    </Layout>
  )
}
