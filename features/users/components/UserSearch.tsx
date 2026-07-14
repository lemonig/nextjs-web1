'use client'

import { Form, Input, Button, Space } from 'antd'
import { SearchOutlined, ReloadOutlined } from '@ant-design/icons'

interface SearchValues {
  keyword?: string
}

interface UserSearchProps {
  loading?: boolean
  onSearch: (keyword: string) => void
  onReset: () => void
}

export default function UserSearch({
  loading,
  onSearch,
  onReset,
}: UserSearchProps) {
  const [form] = Form.useForm<SearchValues>()

  const handleSearch = (values: SearchValues) => {
    onSearch((values.keyword ?? '').trim())
  }

  const handleReset = () => {
    form.resetFields()
    onReset()
  }

  return (
    <Form form={form} layout="inline" onFinish={handleSearch}>
      <Form.Item name="keyword" label="关键字">
        <Input allowClear placeholder="昵称 / 账号" style={{ width: 220 }} />
      </Form.Item>
      <Form.Item>
        <Space>
          <Button
            type="primary"
            htmlType="submit"
            icon={<SearchOutlined />}
            loading={loading}
          >
            查询
          </Button>
          <Button icon={<ReloadOutlined />} onClick={handleReset}>
            重置
          </Button>
        </Space>
      </Form.Item>
    </Form>
  )
}
