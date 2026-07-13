# 项目结构检查报告（Structure Review）

> 检查依据：`docs/project-structure-spec.md`
> 检查对象：当前 `park-web` 项目根目录（排除 `node_modules`、`.next`）
> 检查时间：2026-07-13

---

## 一、检查结论概览

| 维度 | 结果 |
| --- | --- |
| 顶层目录完整性 | 不合规（缺失 7 个规范目录） |
| App Router 路由组 | 部分合规（存在路由冲突与命名问题） |
| 基础设施分层（services/store/lib/types 等） | 缺失 |
| 公共组件分层 | 不完整 |
| 中间件鉴权 | 不合规（依赖目录名，非白名单） |
| Providers 聚合 | 不合规（缺 Store/AntdRegistry） |
| 架构文档一致性 | 不一致（文档用 `src/`，实际在根目录） |

---

## 二、顶层目录对照

规范要求顶层目录：`app / components / features / services / store / hooks / lib / types / utils / public / docs`

| 规范目录 | 现状 | 结论 |
| --- | --- | --- |
| `app` | 存在 | 合规 |
| `components` | 存在（仅 `layout/`） | 分层不完整 |
| `features` | 缺失 | 需新增 |
| `services` | 缺失 | 需新增 |
| `store` | 缺失 | 需新增 |
| `hooks` | 缺失 | 需新增 |
| `lib` | 缺失 | 需新增 |
| `types` | 缺失 | 需新增 |
| `utils` | 缺失 | 需新增 |
| `public` | 存在 | 合规 |
| `docs` | 存在 | 合规 |

---

## 三、需要调整的目录与原因

### 1. 缺失核心分层目录（必须新增）

| 目录 | 原因（规范条款） |
| --- | --- |
| `services/` | 规范第八章：所有 HTTP 请求统一放入 services，禁止页面直接调用 axios。 |
| `store/` | 规范第九章：统一使用 Redux Toolkit，需 `index.ts`/`hooks.ts`/`provider.tsx`/`slices/`。 |
| `lib/` | 规范第十三章：基础设施（http/auth）需独立存放。 |
| `types/` | 规范第十一章：所有类型统一管理，禁止 any。 |
| `hooks/` | 规范第十章：公共 Hooks 目录。 |
| `utils/` | 规范第十二章：工具函数目录。 |
| `features/` | 规范第六章：Feature First，业务模块承载目录。 |

### 2. `components/` 分层不完整

- 现状：仅有 `components/layout/AdminLayout.tsx`。
- 规范第七章要求：`common/`、`layout/`、`form/`、`table/`。
- 结论：补齐 `common/`、`form/`、`table/` 子目录。

### 3. App Router 路由冲突与命名（必须修复）

- **根路由冲突**：`app/page.tsx`（默认模板）与 `app/(public)/page.tsx` 同时映射到 `/`，会导致 Next.js 路由冲突。规范第五章要求 `page.tsx` 仅作入口。
  - 处理：保留单一根入口 `app/page.tsx` 做重定向，移除 `(public)/page.tsx` 重复入口。
- **API 路由文件名错误**：`app/api/auth/route.tsx`、`app/api/posts/route.tsx` 使用 `.tsx`，且 `auth/route.tsx` 内返回了 `AdminLayout`（布局代码放进了 API 路由）。API Route 应为 `route.ts` 且导出 HTTP 方法处理器。
  - 处理：改为 `route.ts` 基础骨架，移除错误的布局引用。
- **业务域命名**：规范第三章示例为 `(protected)/users|orders|products`。本次不迁移业务页，仅保留既有 `(protected)/users` 占位，架构文档同步为实际命名。

### 4. `middleware.ts` 鉴权方式不合规

- 现状：基于 `/protected` 路径前缀判断，并跳转到 `/public/login`。
- 问题：Next.js 路由组 `(public)`/`(protected)` 不出现在 URL 中，该匹配永远失效；且违背规范第十四章「白名单 + 路由保护」。
- 处理：改为公开白名单（`/login`、`/403`、`/api`、`/_next` 等）+ token 校验的服务端鉴权。

### 5. `app/providers.tsx` Provider 聚合不完整

- 现状：仅 `ConfigProvider`。
- 规范第九章：需聚合 `AntdRegistry` + `StoreProvider`（Redux）+ `AntdApp`。
- 处理：补齐 Provider 聚合骨架。

### 6. 架构文档 `nextjs-architecture.md` 与实际不一致

- 文档使用 `src/app`、`src/components` 等 `src/` 前缀；实际项目目录位于根目录（与规范第二章一致）。
- 处理：更新架构文档，去除 `src/` 前缀，使其与实际结构与规范一致。

---

## 四、本次自动调整清单（仅目录与基础文件）

> 严格遵循「不迁移业务页面、不实现业务逻辑」。以下均为目录骨架与基础空壳文件。

### 新增目录与占位文件

```text
services/          # user.ts / .gitkeep（骨架注释，无业务逻辑）
store/
  index.ts         # configureStore 骨架
  hooks.ts         # typed hooks 骨架
  provider.tsx     # StoreProvider 骨架
  slices/          # authSlice.ts 等（空骨架）
lib/
  http/            # request.ts 骨架
  auth/            # token.ts 骨架
types/
  index.ts         # 类型统一出口
utils/
  index.ts         # 工具函数出口
hooks/
  index.ts         # 公共 hooks 出口
features/
  .gitkeep         # 业务域承载目录（暂空，待迁移）
components/
  common/.gitkeep
  form/.gitkeep
  table/.gitkeep
```

### 修正文件

- `middleware.ts`：改为白名单 + token 校验骨架。
- `app/providers.tsx`：聚合 AntdRegistry + StoreProvider + AntdApp。
- `app/api/auth/route.ts`、`app/api/posts/route.ts`：改为标准 Route Handler 骨架（删除 `.tsx` 版本）。
- 移除 `app/(public)/page.tsx` 与 `app/page.tsx` 的路由冲突（保留根入口重定向）。

---

## 五、遵循承诺

后续所有生成代码将严格遵守 `docs/project-structure-spec.md`：

1. `app/` 仅做路由入口，不写业务逻辑。
2. 一个页面对应一个 Feature。
3. HTTP 请求统一放入 `services/`。
4. 公共组件放 `components/`，业务组件放 `features/<域>/`。
5. 全局状态仅放 Redux Toolkit，局部状态用 `useState`。
6. 禁止 `any`，所有类型放 `types/`。
7. 禁止跨 Feature 依赖。
