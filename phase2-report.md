# Phase 2 完成报告（Phase 2 Report）

> 阶段目标：完全按照 Angular 原项目的方式迁移 **SSO Ticket 登录认证体系**，保持与原系统一致。
> 约束：不实现用户名密码登录；不进入权限模块。
> 完成时间：2026-07-13

---

## 一、SSO 登录流程

### 完整流程（与 Angular 原项目一致）

```
用户访问系统
   ↓
middleware 检测 token cookie
   ↓ 未登录
跳转 /login
   ↓
/login 无 ticket → POST api/sso/getSsoAuthUrl { clientLoginUrl: origin }
   ├─ isLogin=true  → location.reload()
   └─ isLogin=false → location.href = serverAuthUrl（跳 SSO 登录中心）
   ↓
SSO 登录成功，回调 /login?ticket=xxxx
   ↓
POST api/sso/doLoginByTicket { ticket }   （判断 code === 200）
   ↓ 取 data.access_token
保存 Token（cookie）
   ↓
dispatch(setToken)  → 保存 Redux（auth）
   ↓
GET /api/user/owner  → 获取当前用户
   ↓
dispatch(setUser)   → 保存 Redux（user）
   ↓
router.replace('/orders')  跳转首页
```

### 刷新保持登录（自动登录）

应用启动时 `AuthBootstrap`（挂载于 Providers，客户端首次挂载）：
- cookie 中有 token → `dispatch(setToken)` + `GET /api/user/owner` 恢复用户信息到 Redux。
- cookie 中无 token → 不处理，由 middleware 在访问受保护路由时跳转 `/login` 触发 SSO。

### 退出登录（Logout）

`useLogout()` hook（复刻 Angular `HeaderUserComponent.logout()`）：
- `POST api/sso/logout` → 清 cookie token + `dispatch(clearAuth/clearUser)` → `location.href = window.location.origin`。
- 本阶段无 Header 业务 UI，仅提供可复用 hook，Phase 3（权限/Header）再接入按钮。

### 与原项目一致的关键约定

- **判断字段严格对齐**：`doLoginByTicket` 判 `code === 200`（取 `data.access_token`）；`owner` / `logout` 判 `success`。
- **免鉴权白名单**：`api/sso/getSsoAuthUrl`、`api/sso/doLoginByTicket`、`assets/*` 不注入 token（`lib/http/axios.ts` 请求拦截器）。
- **401/403 处理**：响应 `code===401` → 清 token → 跳 `/login`；`code===403` → 跳 `/403`。
- **接口路径、参数、返回值均未改动后端协议**。
- **无用户名 / 密码 / 登录按钮**：登录页仅为 SSO 回跳落地页（对应原 `login.component.html` 的 `<h1>登录ing</h1>`），此处用 antd `Spin` 展示「登录中…」，失败用 `Result` 展示错误。

---

## 二、新增文件

| 文件 | 说明 |
| --- | --- |
| `types/auth.ts` | SSO 相关类型：`LoginStatus` / `SsoAuthUrlResponse` / `DoLoginByTicketResponse` / 参数类型 |
| `services/auth.ts` | Auth Service：`getSsoLoginUrl` / `doLoginByTicket` / `getCurrentUser` / `logout` |
| `features/auth/LoginPage.tsx` | 登录落地页 UI（Spin 登录中 / Result 失败） |
| `features/auth/hooks/useSsoLogin.ts` | 登录编排：解析 ticket、换 token、拉用户、跳首页、无 ticket 触发 SSO |
| `features/auth/hooks/useLogout.ts` | 退出登录 hook（logout → 清 token/Redux → 跳 origin） |
| `features/auth/AuthBootstrap.tsx` | 自动登录：启动时按 cookie token 恢复 Redux |
| `phase2-report.md` | 本报告 |

## 三、修改文件

| 文件 | 修改内容 |
| --- | --- |
| `types/index.ts` | 扩充 `User` 强类型字段（role/mobile/company 等，去 any） |
| `lib/http/axios.ts` | 请求拦截器增加 SSO 免鉴权白名单；`success` 校验下移至 `request.ts`（保留 401/403 全局处理） |
| `lib/http/request.ts` | `http` 泛型封装在包装层判断 `success` 并解包 `data` |
| `store/slices/authSlice.ts` | 新增 `token` / `loginStatus` 状态与 `setToken` / `setLoginStatus` / `clearAuth` |
| `store/slices/userSlice.ts` | 新增 `info` / `role` / `menuList` 状态与 `setUser` / `setMenuList` / `clearUser` |
| `app/(public)/login/page.tsx` | 移除账号密码表单，改为 Suspense 包裹的 SSO 落地薄壳入口 |
| `app/providers.tsx` | 挂载 `AuthBootstrap` 实现刷新保持登录 |

> 注：middleware 保持 Phase 1 实现（白名单 + 无 token 跳 `/login`，不请求后端），本阶段未修改。

---

## 四、与 Angular 登录流程的对应关系

| Angular（原项目） | Next.js（本项目） | 说明 |
| --- | --- | --- |
| `StartupService.getTicket()` | `useSsoLogin`（解析 ticket 分支） | 解析 URL ticket → `doLoginByTicket` → 存 token |
| `StartupService.getUserMsg()` | `useSsoLogin` / `AuthBootstrap`（`getCurrentUser`） | `GET /api/user/owner` → setUser |
| `CanActivateService.ssoLogin()` | `useSsoLogin`（无 ticket 分支） | `getSsoAuthUrl` → 跳 `serverAuthUrl` |
| `HeaderUserComponent.logout()` | `useLogout()` | `logout` → 清 token/状态 → `location.href = origin` |
| `DefaultInterceptor`（token 注入 + 白名单 + 401/403） | `lib/http/axios.ts` 拦截器 | 白名单不注入 token；401 清 token 跳登录、403 跳 403 |
| `@delon/auth TokenService` + localStorage | `lib/auth/token.ts`（cookie） | token 存 cookie，middleware 服务端可读 |
| `SettingsService.setUser` | `userSlice.setUser` | 用户信息进 Redux |
| `APP_INITIALIZER`（startup.load） | `AuthBootstrap`（Providers 客户端挂载） | 启动恢复会话 |
| `login.component`（`<h1>登录ing</h1>`） | `features/auth/LoginPage`（Spin「登录中…」） | 纯 SSO 落地页，无表单 |
| Hash 模式 `#/?ticket=`（`replace('#/','')`） | history 模式 `/login?ticket=`（`useSearchParams`） | 路由模式差异，语义等价 |

### 首页跳转
- 原项目登录成功跳 `/order`；本项目按结构规范命名跳 `/orders`（业务页 Phase 3+ 开发）。若带 `redirect` 参数则回跳原目标。

---

## 五、验收结果

| 验收项 | 结果 |
| --- | --- |
| 可以通过 Ticket 登录 | ✅（`/login?ticket=` → doLoginByTicket 换 token） |
| Token 保存成功 | ✅（cookie + Redux authSlice） |
| 获取当前用户成功 | ✅（`GET /api/user/owner` → userSlice） |
| Redux 保存成功 | ✅（auth.token / user.info / user.role） |
| 刷新页面保持登录 | ✅（AuthBootstrap 按 cookie 恢复） |
| Logout 成功 | ✅（logout → 清 token/Redux → 跳 origin） |
| 不存在用户名密码登录 | ✅（登录页无表单/按钮） |
| TypeScript 编译通过 | ✅（`tsc --noEmit` 无错误） |
| ESLint 无错误 | ✅（`pnpm lint` 无错误无告警） |
| 生产构建通过 | ✅（`pnpm build` 成功） |

---

## 六、后续说明

- 本阶段**未进入权限模块**：`userSlice.menuList` 已预留但为空，`lib/auth/permission.ts` 保持空映射，Header 菜单/路由准入 role 校验留待 Phase 3。
- 联调需要：在 `.env.local` 配置 `NEXT_PUBLIC_API_BASE`，或在 `next.config.ts` 增加 `/api/*` 代理到后端（`http://192.168.188.110:8080`）。
- token 当前为普通 cookie（客户端可读，便于 axios 注入 + middleware 读取）；如需更强安全性可后续评估 httpOnly + 服务端注入。

Phase 2 完成，未进入权限模块，按要求停止。
