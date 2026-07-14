import AdminLayout from '@/components/layout/AdminLayout'
import AuthGuard from '@/features/auth/AuthGuard'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AuthGuard>
      <AdminLayout>{children}</AdminLayout>
    </AuthGuard>
  )
}
