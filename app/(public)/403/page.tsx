'use client'

import { Result, Button } from 'antd'
import { useRouter } from 'next/navigation'

export default function ForbiddenPage() {
  const router = useRouter()

  return (
    <div style={styles.container}>
      <Result
        status="403"
        title="403"
        subTitle="抱歉，您没有权限访问该页面。"
        extra={
          <Button type="primary" onClick={() => router.push('/dashboard')}>
            返回首页
          </Button>
        }
      />
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
}
