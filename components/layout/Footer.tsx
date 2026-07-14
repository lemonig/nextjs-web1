'use client'

import { Layout } from 'antd'

const { Footer: AntdFooter } = Layout

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || '后台管理系统'
const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION || '0.1.0'
const YEAR = new Date().getFullYear()

export default function Footer() {
  return (
    <AntdFooter style={{ textAlign: 'center', color: 'rgba(0,0,0,0.45)' }}>
      {APP_NAME} v{APP_VERSION} · Copyright © {YEAR}
    </AntdFooter>
  )
}
