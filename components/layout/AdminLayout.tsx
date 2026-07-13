'use client'

import { Layout, Menu } from 'antd'
import type { ReactNode } from 'react'
import {
  DashboardOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { usePathname, useRouter } from 'next/navigation'

const { Header, Sider, Content } = Layout

export default function AdminLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible>
        <div style={styles.logo}>后台管理</div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[pathname]}
          onClick={({ key }) => router.push(key)}
          items={[
            {
              key: '/dashboard',
              icon: <DashboardOutlined />,
              label: '仪表盘',
            },
            {
              key: '/user',
              icon: <UserOutlined />,
              label: '用户管理',
            },
          ]}
        />
      </Sider>

      <Layout>
        <Header style={styles.header}>
          <span>欢迎你，Admin</span>
        </Header>

        <Content style={styles.content}>
          {children}
        </Content>
      </Layout>
    </Layout>
  )
}

const styles: Record<string, React.CSSProperties> = {
  logo: {
    height: 48,
    margin: 16,
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
    lineHeight: '48px',
  },
  header: {
    background: '#fff',
    padding: '0 16px',
  },
  content: {
    margin: 16,
    padding: 16,
    background: '#fff',
  },
}
