'use client'

import { Layout, Dropdown, Avatar, Space, App } from 'antd'
import type { MenuProps } from 'antd'
import { UserOutlined, DownOutlined } from '@ant-design/icons'
import { useAppSelector } from '@/store/hooks'
import { useLogout } from '@/features/auth/hooks/useLogout'
import HeaderFullScreen from './HeaderFullScreen'

const { Header: AntdHeader } = Layout

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || '后台管理系统'

export default function Header() {
  const user = useAppSelector((s) => s.user.info)
  const logout = useLogout()
  const { message } = App.useApp()

  const items: MenuProps['items'] = [
    { key: 'profile', label: '个人信息' },
    { key: 'password', label: '修改密码' },
    { type: 'divider' },
    { key: 'logout', label: '退出登录' },
  ]

  const onClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      logout()
    } else {
      message.info('功能待实现')
    }
  }

  return (
    <AntdHeader style={styles.header}>
      <div style={styles.title}>{APP_NAME}</div>
      <Space size="middle">
        <HeaderFullScreen />
        <Dropdown menu={{ items, onClick }} placement="bottomRight">
          <Space style={styles.user}>
            <Avatar
              size="small"
              src={user?.avatar || undefined}
              icon={<UserOutlined />}
            />
            <span>{user?.nickname || '未登录'}</span>
            <DownOutlined style={{ fontSize: 10 }} />
          </Space>
        </Dropdown>
      </Space>
    </AntdHeader>
  )
}

const styles: Record<string, React.CSSProperties> = {
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    background: '#fff',
    padding: '0 16px',
    borderBottom: '1px solid #f0f0f0',
  },
  title: {
    fontSize: 18,
    fontWeight: 600,
  },
  user: {
    cursor: 'pointer',
  },
}
