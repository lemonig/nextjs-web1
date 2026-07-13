# Phase 1 完成报告（Phase 1 Report）

> 阶段目标：根据 `docs/project-structure-spec.md` 与 `nextjs-architecture.md`，完成 Next.js 项目**基础设施初始化**。
> 约束：不开发业务页面、不迁移 Angular 页面、不实现业务功能。
> 完成时间：2026-07-13

---

## 一、已完成内容

### 1. Redux Toolkit
- `store/index.ts`：`makeStore()`（`configureStore` 工厂）、`RootState`、`AppDispatch`、`AppStore` 类型；`devTools` 按环境开关。
- `store/hooks.ts`：typed hooks `useAppDispatch` / `useAppSelector`。
- `store/provider.tsx`：`StoreProvider`（`'use client'`，`useState(makeStore)` 惰性单例，避免服务端状态串扰）。
- 基础 Slice（仅初始 state，无业务逻辑）：
  - `authSlice`：`token / isAuthenticated / status`
  - `userSlice`：`info / role`
  - `permissionSlice`：`menuList / visibleMenus`
  - `appSlice`：`appName / systemBelong / footerMessage`
- 清理了各 slice 中无意义的 `export const {} = xxx.actions` 空解构。

### 2. HTTP 请求层（统一使用 Axios）
- `lib/http/types.ts`：统一响应类型 `ApiResponse<T>`（`success / code / data / message`）。
- `lib/http/axios.ts`：
  - axios 实例（`baseURL` 取 `NEXT_PUBLIC_API_BASE`，默认 `/api`，`timeout` 15s）。
  - **请求拦截器**：自动携带 `token` 头（从 cookie 读取）。
  - **响应拦截器**：统一处理 `401`（清 token + 跳 `/login`）、`403`（跳 `/403`）、`success === false`（reject 错误信息），以及网络层错误归一化。
- `lib/http/request.ts`：`http.get/post/put/delete` 泛型封装，直接返回 `Promise<T>`（解包 `data.data`）。
- `lib/auth/token.ts`：基于 cookie 的 `getToken / setToken / clearToken`（SSR 安全）。
- **未编写任何业务 API**（原 `services/user.ts` 业务调用已删除）。

### 3. Providers
- `app/providers.tsx`：整合 `StoreProvider`（Redux）+ Ant Design `ConfigProvider`（`zh_CN` 语言包）+ `AntdApp`。挂载于根 `app/layout.tsx`。

### 4. Middleware
- `middleware.ts`：仅实现登录状态判断、公开白名单（`/login`、`/403`、`/sso`、`/api`、`/_next`、静态资源）、无 token 跳转 `/login`（带 `redirect` 回跳参数）。
- **未请求后端接口、未实现权限菜单**。

### 5. Layout
- Root Layout（`app/layout.tsx`）：`html` / `body` / 全局 CSS / Providers；`metadata` 使用 `NEXT_PUBLIC_APP_NAME`；`lang="zh-CN"`。
- Public Layout（`app/(public)/layout.tsx`）：极简公开页外壳（新增）。
- Protected Layout（`app/(protected)/layout.tsx`）：使用占位 `AdminLayout`。
- `components/layout/AdminLayout.tsx`：简化为 antd `Layout + Content` 占位，**移除了业务 Header/Sidebar/菜单**。

### 6. 基础目录
- 已完善并确认存在：`features/`、`services/`、`store/`、`hooks/`、`types/`、`utils/`、`lib/`。
- 占位/出口文件：`services/index.ts`、`hooks/index.ts`、`utils/index.ts`、`types/index.ts`、`features/README.md`、`components/{common,form,table}/.gitkeep`。

### 7. 环境变量
- 新增 `.env.example`：定义 `NEXT_PUBLIC_API_BASE=`、`NEXT_PUBLIC_APP_NAME=`（均留空，无真实地址）。
- `.gitignore` 增加 `!.env.example` 例外，确保示例文件可被纳入版本管理。

### 8. TypeScript
- `tsconfig.json` 路径别名 `@/*` 正常；`strict: true`。
- `npx tsc --noEmit` 全量类型检查通过，无错误。

### 9. ESLint
- `pnpm lint` 通过，无错误无告警（import / 类型 / React Hooks 均通过）。

---

## 二、新增文件列表

| 文件 | 说明 |
| --- | --- |
| `lib/http/axios.ts` | axios 实例 + 请求/响应拦截器 |
| `app/(public)/layout.tsx` | Public Layout（公开页外壳） |
| `services/index.ts` | services 目录占位出口 |
| `.env.example` | 环境变量示例 |
| `phase1-report.md` | 本报告 |

## 三、修改文件列表

| 文件 | 修改内容 |
| --- | --- |
| `lib/http/request.ts` | 由 throw 骨架改为基于 axios 的 `http.get/post/put/delete` 泛型封装 |
| `lib/auth/token.ts` | 由空桩改为基于 cookie 的 token 读写 |
| `app/layout.tsx` | 清理 create-next-app 模板，metadata/lang 规范化，去除 Geist 字体样板 |
| `app/(protected)/layout.tsx` | 改为使用占位 `AdminLayout` |
| `components/layout/AdminLayout.tsx` | 移除业务 Header/Sidebar/菜单，简化为 Layout+Content 占位 |
| `middleware.ts` | 登录跳转追加 `redirect` 回跳参数 |
| `store/slices/authSlice.ts` | 移除空 actions 解构 |
| `store/slices/userSlice.ts` | 移除空 actions 解构 |
| `store/slices/permissionSlice.ts` | 移除空 actions 解构 |
| `store/slices/appSlice.ts` | 移除空 actions 解构 |
| `.gitignore` | 增加 `!.env.example` 例外 |
| `package.json` | 新增依赖 `axios@^1.18.1` |

### 删除文件

| 文件 | 原因 |
| --- | --- |
| `services/user.ts` | 含业务 API 调用，违反 Phase 1「不编写业务接口」 |
| `app/api/auth/route.ts` | 遗留 demo 路由，Phase 1 不含业务接口 |
| `app/api/posts/route.ts` | 遗留 demo 路由（`posts` 非本系统业务域） |

---

## 四、后续建议

1. **Phase 2（登录模块）**：实现 SSO/表单登录流程，在 `services/` 新增 `auth`/`sso` 领域 API，登录成功后 `setToken` 并 `dispatch(setToken/setUser)`。届时为各 slice 补充 reducers/actions。
2. **权限与菜单**：`lib/auth/permission.ts` 目前为空映射，Phase 3 再补 `ROLE_MENUS` 与 `Header` 菜单渲染；middleware 可在有 role 后增加 `canAccess` 校验。
3. **AntdRegistry（SSR 样式）**：如需消除 antd 首屏样式闪烁，可 `pnpm add @ant-design/nextjs-registry` 并在 `providers.tsx` 外层包裹 `AntdRegistry`。
4. **middleware 弃用提示**：Next.js 16 提示 `middleware` 约定将由 `proxy` 取代，后续可评估迁移到 `proxy.ts`。
5. **next.config 代理**：真实联调阶段可在 `next.config.ts` 增加 `rewrites`，将 `/api/*` 代理到后端，配合 `NEXT_PUBLIC_API_BASE`。
6. **token 存储**：当前为普通 cookie（客户端可读，便于 axios 注入）；若需更强安全性，Phase 2 可评估 httpOnly cookie + 服务端注入方案。

---

## 五、验收结果

| 验收项 | 结果 |
| --- | --- |
| `pnpm install` 成功 | ✅ |
| `pnpm dev` 可启动 | ✅（Ready in ~1.9s，http://localhost:3000） |
| TypeScript 编译通过 | ✅（`tsc --noEmit` 无错误；`pnpm build` 类型检查通过） |
| ESLint 无错误 | ✅（`pnpm lint` 无错误无告警） |
| Redux 已初始化 | ✅ |
| Axios 已初始化 | ✅ |
| Middleware 已生效 | ✅（build 输出显示 Middleware 激活） |
| Providers 已接入 | ✅ |
| Layout 已完成 | ✅（Root / Public / Protected） |
| 不含业务页面 | ✅ |
| 不含业务接口 | ✅ |
| 未迁移 Angular 页面 | ✅ |

生产构建路由输出：`/`、`/login`、`/users`（占位）、`/_not-found` + Middleware。

---

## 六、是否满足进入 Phase 2 的条件

**满足。** ✅

基础设施（Redux / Axios / Providers / Middleware / Layout / 目录 / 环境变量 / TS / ESLint）已全部就绪，构建与类型检查通过，且不含任何业务代码。可以进入 Phase 2（登录模块）开发。
