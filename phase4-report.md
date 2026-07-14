# Phase 4 完成报告（Phase 4 Report）

> 阶段目标：迁移 Angular `SharedModule` 公共组件/指令/工具，为后续业务页面迁移做准备。
> 约束：只迁移公共组件；不迁移任何业务页面（User / Product / Quotation）；不实现业务 CRUD；不修改架构与目录结构。
> 完成时间：2026-07-14

---

## 一、Angular 公共资产 → React 迁移映射

依据 `docs/05-components.md`（未重新分析 Angular 源码）：

| Angular（SharedModule / 指令） | React（Next.js） | 类型 |
| --- | --- | --- |
| `app-device-tree`（`@Output stationCheckEmitter/switchTree`） | `components/common/DeviceTree.tsx`（纯受控，`onSelect`/`onToggle` 走 props） | 组件 |
| `appInputTrim` 指令 | `components/form/TrimInput.tsx` | 组件 |
| `appTableHeight` 指令 | `hooks/useTableHeight.ts` | Hook |
| `appTableScroll` / `appMultiTitleScroll` 指令 | `hooks/useTableScroll.ts` | Hook |
| `header-fullscreen`（screenfull） | `components/layout/HeaderFullScreen.tsx` | 组件 |
| `nz-table` | `components/table/DataTable.tsx` | 组件 |
| `nz-upload` | `components/common/UploadButton.tsx` | 组件 |
| `nz-modal.confirm` | `components/common/ConfirmModal.tsx`（`showConfirm`/`showDeleteConfirm`） | 组件 |
| `ExcelService`（arraybuffer 下载） | `lib/excel/download.ts` | 基础设施 |

> 忽略项：`app-setting-menu`（与业务菜单强绑定，不属于跨域公共组件）；`SearchForm/Empty/Loading/Pagination`（Ant Design 已内置 `Form`/`Empty`/`Spin`/`Table.pagination`，直接复用，不重复造轮子）。

---

## 二、公共组件（`components/`）

| 文件 | 说明 | 关键 Props |
| --- | --- | --- |
| `components/table/DataTable.tsx` | 泛型列表封装（分页/loading/滚动），包 antd `Table` | `columns` / `dataSource` / `rowKey` / `loading` / `pagination` / `scroll` |
| `components/form/TrimInput.tsx` | 首尾去空格输入框（`forwardRef` 兼容 antd `Form`） | 继承 antd `InputProps` |
| `components/common/ConfirmModal.tsx` | 二次确认封装 | `showConfirm(opts)` / `showDeleteConfirm(opts)` |
| `components/common/UploadButton.tsx` | 上传按钮封装（不写死业务地址） | `action` / `onDone` / `onError` |
| `components/common/DeviceTree.tsx` | **纯受控**分类树（数据由父组件传入，不发请求） | `treeData` / `loading` / `collapsible` / `onSelect` / `onToggle` |
| `components/layout/HeaderFullScreen.tsx` | 网页全屏切换（`screenfull`），已接入 `Header` | - |

---

## 三、公共 Hooks（`hooks/`）

| 文件 | 说明 | 对应 Angular |
| --- | --- | --- |
| `hooks/useRequest.ts` | 异步请求 `loading/data/error/run/reset` 封装（不含具体接口） | - |
| `hooks/useTableHeight.ts` | `ResizeObserver` 计算 antd Table `scroll.y` | `appTableHeight` |
| `hooks/useTableScroll.ts` | `ref` 计算横向 `scroll.x`（含多级表头场景） | `appTableScroll` / `appMultiTitleScroll` |
| `hooks/useDebounce.ts` | 值防抖 | - |
| `hooks/useThrottle.ts` | 回调节流 | - |
| `hooks/index.ts` | 统一导出（替换原 `export {}` 占位） | - |

---

## 四、公共工具（`utils/`，与框架无关，不依赖 React）

| 文件 | 说明 |
| --- | --- |
| `utils/date.ts` | dayjs 日期/时间格式化 + 导出文件名时间戳 `YYYY_MM_DD` |
| `utils/download.ts` | `downloadBlob` / `downloadFromUrl` 通用文件下载 |
| `utils/tree.ts` | `listToTree` / `findTreeNode` / `flattenTree` 树形结构处理 |
| `utils/number.ts` | `toNumber` / `formatMoney` / `round` / `clamp` 数值处理 |
| `utils/index.ts` | 统一导出（替换原 `export {}` 占位） |

---

## 五、基础设施与类型

| 文件 | 说明 |
| --- | --- |
| `lib/excel/download.ts` | 复刻 `ExcelService`：基于现有 axios 实例 `responseType:'arraybuffer'` → Blob → 下载（复用 token 注入），不含业务导出 URL |
| `types/common.ts` | 公共类型 `TreeNode` / `FlatTreeItem` / `UploadResult` / `PaginationState`（禁止 `any`） |
| `types/index.ts` | 增加 `export * from './common'` |

---

## 六、新增文件列表

| 文件 | 说明 |
| --- | --- |
| `components/table/DataTable.tsx` | 列表通用封装 |
| `components/form/TrimInput.tsx` | 去空格输入框 |
| `components/common/ConfirmModal.tsx` | 确认弹窗 |
| `components/common/UploadButton.tsx` | 上传按钮 |
| `components/common/DeviceTree.tsx` | 受控分类树 |
| `components/layout/HeaderFullScreen.tsx` | 全屏切换 |
| `hooks/useRequest.ts` | 请求封装 |
| `hooks/useTableHeight.ts` | 表格高度 |
| `hooks/useTableScroll.ts` | 表格滚动 |
| `hooks/useDebounce.ts` | 防抖 |
| `hooks/useThrottle.ts` | 节流 |
| `utils/date.ts` / `utils/download.ts` / `utils/tree.ts` / `utils/number.ts` | 工具函数 |
| `lib/excel/download.ts` | Excel 下载 |
| `types/common.ts` | 公共类型 |
| `phase4-report.md` | 本报告 |

## 七、修改文件列表

| 文件 | 修改内容 |
| --- | --- |
| `hooks/index.ts` | 由 `export {}` 改为统一导出 5 个 hooks |
| `utils/index.ts` | 由 `export {}` 改为统一导出 4 个工具模块 |
| `types/index.ts` | 增加 `export * from './common'` |
| `components/layout/Header.tsx` | 接入 `HeaderFullScreen`（用户下拉左侧全屏按钮） |
| `features/dashboard/DashboardPage.tsx` | 新增「公共组件示例」区块（DataTable/TrimInput/ConfirmModal），仅编译级引用验证，无业务接口 |
| `package.json` | 新增依赖 `screenfull@^6.0.2` |

---

## 八、规范符合性自检（`project-structure-spec.md`）

| 规范 | 结果 |
| --- | --- |
| 公共组件放 `components/`（common/form/table/layout） | ✅ |
| 公共 Hook 放 `hooks/`，Feature 无关 | ✅ |
| 工具放 `utils/`，不依赖 React | ✅ |
| 类型集中 `types/`，禁止 `any` | ✅ |
| 组件不依赖业务模块/页面/接口（DeviceTree 数据走 props） | ✅ |
| 组件不发请求（Excel 下载归 `lib/`） | ✅ |
| 未跨 Feature 依赖 | ✅ |

---

## 九、验收结果

| 验收项 | 结果 |
| --- | --- |
| 公共组件完成 | ✅（DataTable / TrimInput / ConfirmModal / UploadButton / DeviceTree / HeaderFullScreen） |
| 公共 Hooks 完成 | ✅（useRequest / useTableHeight / useTableScroll / useDebounce / useThrottle） |
| 公共工具完成 | ✅（date / download / tree / number） |
| 组件可独立使用、不依赖业务 | ✅ |
| TypeScript 编译通过 | ✅（`tsc --noEmit` 无错误） |
| ESLint 无错误 | ✅（`pnpm lint` 无错误无告警） |
| 生产构建通过 | ✅（`pnpm build` 成功） |
| 示例页面可正常引用组件 | ✅（Dashboard 引用 DataTable/TrimInput/ConfirmModal） |
| 未迁移 User 页面 | ✅ |
| 未迁移 Product 页面 | ✅ |
| 未迁移 Quotation 页面 | ✅ |
| 未实现业务 CRUD | ✅ |

生产构建路由：`/`、`/403`、`/dashboard`、`/login`、`/users`（占位）+ Proxy（Middleware）。

---

## 十、后续说明

- **DeviceTree** 本阶段为纯展示受控组件；`/api/product/category` 数据获取留待产品管理阶段（在 `features/products/` 中通过 `services/product` 拉取后以 `treeData` 传入）。
- **useRequest** 为轻量请求封装；如后续需要缓存/失效/重试，可评估引入 TanStack Query。
- **Excel 下载**：`lib/excel/download.ts` 已就绪，业务导出接口 URL 在各业务 Feature 阶段传入。
- 未引入 `file-saver` / `xlsx`（架构标记为死引用）。

Phase 4 完成，未迁移任何业务模块，按要求停止。
