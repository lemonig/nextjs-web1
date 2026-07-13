# 项目结构调整进度记录（Progress Log）

> 依据：`docs/project-structure-spec.md`
> 目标：对照规范检查并调整项目结构（仅目录与基础文件，不实现业务逻辑）

---

## 一、总体任务清单与状态

| # | 任务 | 状态 |
| --- | --- | --- |
| 1 | 对照规范检查整个项目 | ✅ 已完成 |
| 2 | 输出检查报告 `structure-review.md` | ✅ 已完成 |
| 3 | 给出需要调整的目录和原因 | ✅ 已完成（见 structure-review.md 第三节） |
| 4 | 自动调整项目结构（仅目录与基础文件） | ✅ 基本完成（见下方明细） |
| 5 | 更新 `nextjs-architecture.md` 与实际结构一致 | ✅ 已完成 |
| 6 | 后续代码严格遵守 spec | ✅ 已在报告中承诺，持续执行 |

---

## 二、已完成的调整明细

### 新增目录与基础文件（均为骨架，无业务逻辑）

- `store/index.ts` — configureStore + RootState/AppDispatch 类型
- `store/hooks.ts` — typed hooks（useAppDispatch / useAppSelector）
- `store/provider.tsx` — StoreProvider（'use client'，useRef 单例）
- `store/slices/authSlice.ts` — 空 slice 骨架
- `store/slices/userSlice.ts` — 空 slice 骨架
- `store/slices/permissionSlice.ts` — 空 slice 骨架
- `store/slices/appSlice.ts` — 空 slice 骨架
- `lib/http/types.ts` — ApiResponse<T> 类型
- `lib/http/request.ts` — http.get/post 骨架（未实现，throw）
- `lib/auth/token.ts` — token 读写骨架
- `lib/auth/permission.ts` — 角色白名单 canAccess/getMenuList 骨架
- `types/index.ts` — User 类型（示例）
- `utils/index.ts` — 空导出占位
- `hooks/index.ts` — 空导出占位
- `services/user.ts` — 用户领域 API 骨架
- `features/README.md` — Feature First 说明
- `components/common/.gitkeep`
- `components/form/.gitkeep`
- `components/table/.gitkeep`

### 修正的文件

- `middleware.ts` — 改为「公开白名单 + token 校验」服务端鉴权（原来错误地匹配 `/protected` 前缀）
- `app/providers.tsx` — 聚合 StoreProvider + ConfigProvider + AntdApp
- `app/api/auth/route.ts` — 由错误的 `.tsx`（返回 AdminLayout）改为标准 Route Handler（GET）
- `app/api/posts/route.ts` — 由空 `.tsx` 改为标准 Route Handler（GET）
- `app/(protected)/users/page.tsx` — 空文件补最小薄壳入口
- `app/(protected)/error.tsx` — 空文件补错误边界骨架
- `app/(protected)/loading.tsx` — 空文件补加载态骨架

### 删除的文件

- `app/page.tsx` — 删除（与 `app/(public)/page.tsx` 存在根路由 `/` 冲突，保留 public 版重定向到 /login）
- `app/api/auth/route.tsx` — 删除（改为 route.ts）
- `app/api/posts/route.tsx` — 删除（改为 route.ts）

---

## 三、遗留问题 / 已知事项

1. **`@ant-design/nextjs-registry` 未安装**：
   - 规范/架构建议用 `AntdRegistry` 做 SSR 样式注入，但 `node_modules` 中未安装该包。
   - 当前 `providers.tsx` 暂用 `ConfigProvider + AntdApp` 代替，避免构建报错。
   - 后续如需 SSR 样式，需 `pnpm add @ant-design/nextjs-registry` 后在 providers 中补回。

2. **业务命名差异**：
   - spec 第三章示例为 `(protected)/users|orders|products`。
   - 旧 `nextjs-architecture.md` 用 `order/device/user`。
   - 当前仅保留既有 `(protected)/users` 占位，未迁移业务页。架构文档需同步命名（见待办）。

3. **尚未验证 lint/build**：结构调整后未运行 `pnpm lint` / `pnpm build`，下次应验证。

---

## 四、下次待办（重点）

1. **更新 `nextjs-architecture.md`（任务 5）— ✅ 已完成**：
   - 目录树去掉 `src/`，根名改为 `park-web/`，补齐 `docs/`、`utils/`、`components/{common,form,table}`。
   - 全文 `src/app`、`src/components` 等路径统一去掉 `src/` 前缀。
   - `store/StoreProvider.tsx` 引用改为实际文件名 `store/provider.tsx`（组件名仍为 `StoreProvider`）。
   - 业务域/路由命名统一为 spec 第三章的 `users/orders/products`（路由 `/orders`、`/products`、`/users`）；Angular 源列与后端 API 路径（如 `/api/user/owner`）保持不变。

2. **lint 验证：✅ 已通过**：
   - 根因一：`typescript@7.0.2`（Go 版预览编译器 tsgo）不满足 `@typescript-eslint/typescript-estree` 的 peer（`>=4.8.4 <6.1.0`）。已将 `typescript` 降级为 `^5.9.0`（实装 5.9.3）。
   - 根因二：`eslint@10.6.0` 移除了 `context.getFilename()` 等旧 API，`eslint-config-next@16` 依赖的 `eslint-plugin-react@7.37.5` 仅支持 `eslint <=^9.7`。已将 `eslint` 降级为 `^9.37.0`（实装 9.39.5）。
   - 附带修复的源代码 lint 报错：`login/page.tsx` 的 `any` 改为 `LoginFormValues` 接口；`store/provider.tsx` 用 `useState(makeStore)` 惰性初始化替代 `useRef`（消除 `react-hooks/refs` 渲染期访问 ref 报错）。
   - 当前 `pnpm lint` 无错误无告警。

3. 生成的临时脚本 `gen-tree.ps1` 已自删除；`project-structure.txt` 可按需重新生成。

---

## 五、参考：本项目强制规范速记（供后续生成代码遵守）

- `app/` 只做路由入口，禁止业务逻辑。
- 一个页面 = 一个 Feature（`features/<域>/`）。
- 所有 HTTP 请求放 `services/`，禁止组件内直接 fetch/axios。
- 公共组件放 `components/{common,layout,form,table}`；业务组件放 `features/<域>/components/`。
- 全局状态只放 Redux Toolkit（`store/slices/*`）；局部状态用 useState。
- 禁止 `any`，类型集中 `types/`。
- 禁止跨 Feature 依赖。
- 依赖方向单向：app → features → (components/services/store/hooks/lib/types)。
