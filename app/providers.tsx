'use client'

import { ConfigProvider, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import StoreProvider from '@/store/provider'
import AuthBootstrap from '@/features/auth/AuthBootstrap'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ConfigProvider locale={zhCN}>
        <AntdApp>
          <AuthBootstrap>{children}</AuthBootstrap>
        </AntdApp>
      </ConfigProvider>
    </StoreProvider>
  )
}
