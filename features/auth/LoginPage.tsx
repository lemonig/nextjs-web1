'use client'

import { Result, Spin } from 'antd'
import { useSsoLogin } from './hooks/useSsoLogin'

export default function LoginPage() {
  const { error } = useSsoLogin()

  if (error) {
    return (
      <div style={styles.container}>
        <Result status="error" title="登录失败" subTitle={error} />
      </div>
    )
  }

  return (
    <div style={styles.container}>
      <Spin size="large" tip="登录中...">
        <div style={styles.placeholder} />
      </Spin>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholder: {
    width: 120,
    height: 120,
  },
}
