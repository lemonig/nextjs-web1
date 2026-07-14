'use client'

import { Card, Descriptions, Tag, Space } from 'antd'
import { useAppSelector } from '@/store/hooks'

const STATUS_TEXT: Record<string, string> = {
  idle: '未登录',
  authenticating: '登录中',
  authenticated: '已登录',
  failed: '登录失败',
}

export default function DashboardPage() {
  const user = useAppSelector((s) => s.user.info)
  const role = useAppSelector((s) => s.user.role)
  const loginStatus = useAppSelector((s) => s.auth.loginStatus)

  return (
    <Space direction="vertical" size="middle" style={{ width: '100%' }}>
      <Card title="仪表盘">
        <Descriptions column={1} bordered>
          <Descriptions.Item label="当前用户">
            {user?.nickname || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="账号">
            {user?.account || '-'}
          </Descriptions.Item>
          <Descriptions.Item label="当前角色">
            {role != null ? <Tag color="blue">role: {role}</Tag> : '-'}
          </Descriptions.Item>
          <Descriptions.Item label="登录状态">
            <Tag color={loginStatus === 'authenticated' ? 'green' : 'default'}>
              {STATUS_TEXT[loginStatus] ?? loginStatus}
            </Tag>
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </Space>
  )
}
