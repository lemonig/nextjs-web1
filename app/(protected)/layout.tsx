/*
 * @Author: Jonny
 * @Date: 2025-12-18 16:21:34
 * @LastEditors: Jonny
 * @LastEditTime: 2025-12-18 17:17:09
 * @FilePath: \park-web\app\(protected)\layout.tsx
 */
export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      {/* 侧边栏 */}
      <aside className="w-64 bg-gray-800 text-white">
        <div className="p-4 font-bold">Admin System</div>
      </aside>

      {/* 主内容 */}
      <main className="flex-1 bg-gray-100 p-6">{children}</main>
    </div>
  );
}
