'use client'

import { ConfigProvider, App as AntdApp } from 'antd'
import zhCN from 'antd/locale/zh_CN'
import StoreProvider from '@/store/provider'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StoreProvider>
      <ConfigProvider locale={zhCN}>
        <AntdApp>{children}</AntdApp>
      </ConfigProvider>
    </StoreProvider>
  )
}
