import AdminLayout from '@/components/layout/AdminLayout'

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayout>{children}</AdminLayout>
}
