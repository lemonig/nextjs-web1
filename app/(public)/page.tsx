/*
 * @Author: Jonny
 * @Date: 2025-12-18 15:02:42
 * @LastEditors: Jonny
 * @LastEditTime: 2025-12-18 17:12:07
 * @FilePath: \park-web\app\(public)\page.tsx
 */
import { redirect } from "next/navigation";

export default function PublicIndexPage() {
  /**
   * 🚧 这里以后可以加登录判断
   * const isLogin = ...
   */

  // 当前阶段：默认跳转到登录页
  redirect("/login");
}
