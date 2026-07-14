'use client'

import { useState } from 'react'
import { Layout } from 'antd'
import type { ReactNode } from 'react'
import Header from './Header'
import Sidebar from './Sidebar'
import AppBreadcrumb from './Breadcrumb'
import Footer from './Footer'

const { Sider, Content } = Layout

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth={64}
        theme="dark"
      >
        <div style={styles.logo}>{collapsed ? 'HK' : 'HK 报价系统'}</div>
        <Sidebar />
      </Sider>

      <Layout>
        <Header />
        <Content style={styles.content}>
          <AppBreadcrumb />
          <div style={styles.inner}>{children}</div>
        </Content>
        <Footer />
      </Layout>
    </Layout>
  )
}

const styles: Record<string, React.CSSProperties> = {
  logo: {
    height: 48,
    margin: 16,
    color: '#fff',
    fontSize: 16,
    fontWeight: 600,
    textAlign: 'center',
    lineHeight: '48px',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  content: {
    margin: '0 16px',
  },
  inner: {
    padding: 16,
    background: '#fff',
    borderRadius: 8,
    minHeight: 'calc(100vh - 64px - 69px - 48px)',
  },
}
