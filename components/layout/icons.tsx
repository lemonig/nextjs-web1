'use client'

import {
  DashboardOutlined,
  AppstoreOutlined,
  UserOutlined,
  FileTextOutlined,
  ShoppingOutlined,
} from '@ant-design/icons'
import type { ReactNode } from 'react'

const ICONS: Record<string, ReactNode> = {
  DashboardOutlined: <DashboardOutlined />,
  AppstoreOutlined: <AppstoreOutlined />,
  UserOutlined: <UserOutlined />,
  FileTextOutlined: <FileTextOutlined />,
  ShoppingOutlined: <ShoppingOutlined />,
}

export function renderIcon(name?: string): ReactNode {
  if (!name) return undefined
  return ICONS[name]
}
