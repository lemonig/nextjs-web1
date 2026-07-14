'use client'

import { Card, Descriptions, Tag, Space, Button, Form } from 'antd'
import { useAppSelector } from '@/store/hooks'
import DataTable from '@/components/table/DataTable'
import TrimInput from '@/components/form/TrimInput'
import { showConfirm } from '@/components/common/ConfirmModal'

const STATUS_TEXT: Record<string, string> = {
  idle: '未登录',
  authenticating: '登录中',
  authenticated: '已登录',
  failed: '登录失败',
}

interface DemoRow {
  id: number
  name: string
}

const DEMO_COLUMNS = [
  { title: '名称', dataIndex: 'name', key: 'name' },
]

const DEMO_DATA: DemoRow[] = [
  { id: 1, name: '公共组件示例 A' },
  { id: 2, name: '公共组件示例 B' },
]

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

      <Card title="公共组件示例（Phase 4）">
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Form layout="inline">
            <Form.Item label="TrimInput">
              <TrimInput placeholder="首尾空格自动去除" />
            </Form.Item>
            <Form.Item>
              <Button
                onClick={() =>
                  showConfirm({ content: '这是一个公共确认弹窗示例' })
                }
              >
                ConfirmModal
              </Button>
            </Form.Item>
          </Form>
          <DataTable<DemoRow>
            columns={DEMO_COLUMNS}
            dataSource={DEMO_DATA}
            rowKey="id"
            pagination={false}
            size="small"
          />
        </Space>
      </Card>
    </Space>
  )
}
