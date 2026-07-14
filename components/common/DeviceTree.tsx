'use client'

import { Tree, Empty, Spin, Button } from 'antd'
import type { TreeProps, TreeDataNode } from 'antd'
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons'
import { useState } from 'react'

export interface DeviceTreeProps {
  treeData: TreeDataNode[]
  loading?: boolean
  collapsible?: boolean
  defaultExpandAll?: boolean
  onSelect?: (node: TreeDataNode | null) => void
  onToggle?: (collapsed: boolean) => void
}

export default function DeviceTree({
  treeData,
  loading = false,
  collapsible = false,
  defaultExpandAll = true,
  onSelect,
  onToggle,
}: DeviceTreeProps) {
  const [collapsed, setCollapsed] = useState(false)

  const handleSelect: TreeProps['onSelect'] = (_keys, info) => {
    onSelect?.(info.selected ? (info.node as TreeDataNode) : null)
  }

  const toggle = () => {
    const next = !collapsed
    setCollapsed(next)
    onToggle?.(next)
  }

  return (
    <div>
      {collapsible && (
        <Button
          type="text"
          icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          onClick={toggle}
        />
      )}
      {loading ? (
        <Spin />
      ) : treeData.length === 0 ? (
        <Empty description="暂无分类" />
      ) : (
        !collapsed && (
          <Tree
            treeData={treeData}
            defaultExpandAll={defaultExpandAll}
            onSelect={handleSelect}
          />
        )
      )}
    </div>
  )
}
