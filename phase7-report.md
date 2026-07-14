# Phase 7 完成报告（Phase 7 Report）

> 阶段目标：将 Angular 产品管理模块（DeviceFactoryComponent）迁移到 Next.js。
> 约束：保持与用户管理模块一致的开发模式；不重新设计架构；不迁移报价模块。
> 完成时间：2026-07-14

> 命名说明：任务文字为 `/product` 与 `features/product/`，但当前项目（project-structure-spec + Phase 3 Sidebar 菜单 + Phase 6 `/users`）已统一采用复数。经确认，本阶段沿用 `/products` 与 `features/products/`，与现有结构一致，无需改动导航。

---

## 一、完成内容

### 1. 产品列表
- Ant Design `Table` 展示：产品名称 / 品牌 / 价格 / 操作（编辑、删除）。
- Loading、空数据（Table 内置）、错误提示（`message.error`）。

### 2. 查询
- Ant Design `Form`（inline）：关键字（产品名称/品牌）+ 查询 + 重置。

### 3. 分页
- Table 内置分页（`showSizeChanger` / `showTotal`），页码由 `useState` 管理。

### 4. CRUD
- 新增/编辑：`ProductFormModal`（Modal + Form），提交 `productService.insert` / `productService.update`。
- 删除：`showDeleteConfirm`（复用 Phase 4 ConfirmModal，底层 `Modal.confirm`）→ `productService.remove` → 刷新。
- 成功/失败提示统一 `message`。

### 5. 产品分类
- 左侧复用公共组件 `DeviceTree`（Phase 4，纯受控）渲染分类树。
- 分类数据由 `useProductCategory` 调 `productService.category()` 加载并转换为 antd `TreeDataNode`。
- 选择分类 → `useProductList.selectCategory` → 右侧列表按 `categoryId` 刷新（分类联动，对应 Angular `device-tree` 的 `stationCheckEmitter`）。

### 6. 动态字段
- `ProductFormModal` 根据当前分类的 `categoryFieldList` 动态渲染扩展字段（对应 Angular `device-factory` 动态 `operateForm`）。
- 品牌字段：分类含 `brandList` 时渲染 `Select`，否则渲染 `Input`。

### 7. 导入 / 导出
- 导入：复用公共组件 `UploadButton`，`action` 指向 `/api/product/import`，附带当前 `categoryId`，成功后刷新（对应 `/api/product/import`）。
- 导出：`productService.export`（Phase 5，走 `http.download` → `lib/excel/download.ts`，arraybuffer → Blob），按当前分类导出（对应 `/api/product/export`）。

### 8. 状态划分
- **页面状态（useState）**：列表数据、loading、关键字、选中分类、分页、弹窗开关、编辑对象、导出态。
- **全局状态（Redux）**：仅读取 `user.role` 做权限判断，未新增任何全局状态。

### 9. 权限
- 按钮权限扩展点：`canManage = role === 1 || role === 4 || role == null`（对应 `09-permission.md` 产品管理 role 1/4 可见），控制新增/导入/导出/编辑/删除按钮可见性；保留后端权限接入扩展点。
- 页面访问控制仍由现有 `middleware` + `AuthGuard` 负责（未改动）。

### 10. TypeScript
- `Product` / `ProductCategory` / `CategoryField` / 请求参数（`ProductListParams` / `ProductInsertParams` / `ProductUpdateParams`）/ 新增 `ProductFormValues` / `ProductImportParams` 均有类型。
- 全程无 `any`（动态字段用 `Record<string, unknown>` / 索引签名兜底）。

---

## 二、Angular 对应文件

| Angular | 说明 |
| --- | --- |
| `routes/device/device-factory.component.ts/html`（`DeviceFactoryComponent`，路由 `/device`，`DeviceModule` 懒加载） | 产品管理列表 + 分类联动 + 动态字段 CRUD + 导入导出 |
| `shared/device-tree/device-tree.component.ts`（`app-device-tree`） | 左侧产品分类树 |
| `/api/product/list`（device-factory:69） | 产品列表 |
| `/api/product/detail`（device-factory:211） | 产品详情 |
| `/api/product/insert`（device-factory:136） | 新增产品 |
| `/api/product/update`（device-factory:148） | 更新产品 |
| `/api/product/delete`（device-factory:166） | 删除产品 |
| `/api/product/import`（device-factory:194） | Excel 导入 |
| `/api/product/export`（device-factory:185, ExcelService） | Excel 导出 |
| `/api/product/category`（device-tree:41） | 产品分类树 |
| `09-permission.md`（role 1/4 可见产品管理） | 按钮权限扩展点 |

> 未重新分析 Angular 源码，均依据 `docs/02` / `docs/03` / `docs/04` / `docs/07` / `docs/09` / `docs/10`。

---

## 三、Next.js 对应文件

### 新增
| 文件 | 说明 |
| --- | --- |
| `features/products/ProductPage.tsx` | 页面容器：DeviceTree + 查询/表格/弹窗，导入/导出/删除，权限判断 |
| `features/products/hooks/useProductCategory.ts` | 分类树加载 + antd TreeData 转换 + 分类查找 |
| `features/products/hooks/useProductList.ts` | 列表数据/分类联动/查询/重置/刷新/分页状态 |
| `features/products/components/ProductSearch.tsx` | 查询区（Form + 查询/重置） |
| `features/products/components/ProductTable.tsx` | 表格 + 分页 + 行内编辑/删除 |
| `features/products/components/ProductFormModal.tsx` | 新增/编辑弹窗（动态字段 + 品牌 Select/Input + 校验） |
| `app/(protected)/products/page.tsx` | 薄入口 `<ProductPage />` |
| `phase7-report.md` | 本报告 |

### 修改
| 文件 | 修改内容 |
| --- | --- |
| `types/product.ts` | 新增 `ProductFormValues` / `ProductImportParams`（复用 Phase 5 已有类型） |

### 复用（未改动）
| 文件 | 说明 |
| --- | --- |
| `services/product.ts` | list / detail / insert / update / remove / import / export / category（Phase 5） |
| `components/common/DeviceTree.tsx` | 产品分类树（Phase 4） |
| `components/common/UploadButton.tsx` | 导入上传（Phase 4） |
| `components/common/ConfirmModal.tsx` | 删除二次确认（Phase 4） |
| `lib/excel/download.ts` | Excel 导出（Phase 4/5） |
| `lib/http/request.ts` + `axios.ts` | 统一请求与错误处理 |

---

## 四、验收结果

| 验收项 | 结果 |
| --- | --- |
| 产品列表正常 | 通过（Ant Design Table） |
| 查询正常 | 通过（关键字 + 重置） |
| 分页正常 | 通过（Table 内置分页） |
| CRUD 正常 | 通过（insert/update/remove + 弹窗校验） |
| 分类正常 | 通过（DeviceTree + 分类联动刷新） |
| 导入导出正常 | 通过（UploadButton 导入 + http.download 导出） |
| TypeScript 无错误 | 通过（tsc --noEmit） |
| ESLint 无错误 | 通过（pnpm lint 无错误无告警） |
| 生产构建通过 | 通过（pnpm build，含 /products 路由） |
| 未迁移报价模块 | 通过 |

---

## 五、遗留问题

1. **分页为前端分页**：与用户模块一致，`/api/product/list` 原项目一次性返回，故 `total` 取 `data.length`、前端分页。后端支持分页参数后可在 `useProductList` + `productService.list` 切换为服务端分页。
2. **动态字段值类型**：`ProductFormModal` 动态字段统一按文本 `Input` 渲染并以 `Record<string, unknown>` 提交；若后端字段有类型/枚举约束（数字、下拉），联调时需按 `CategoryField` 实际结构细化渲染。
3. **导入返回结构**：`UploadButton` 通过原生 `Upload.action` 直传 `/api/product/import`，未经过 `request.ts` 拦截器（因需 multipart 表单）；其响应成功/失败判断依赖 HTTP 状态与 `file.status`，联调时需按后端返回结构核对是否需自定义 `beforeUpload`/`customRequest`。
4. **导出文件类型**：`lib/excel/download.ts` 固定 `application/vnd.ms-excel`（.xls）；若后端返回 xlsx，可在导出调用处传入 `ext` 参数调整。
5. **品牌/分类字段映射**：`ProductCategory.brandList` / `categoryFieldList` 依据 `docs/07-models.md` 推断，联调时按后端实际返回核对。
6. **报价模块的产品选择弹层（ProductPicker）**：属于报价模块范畴，本阶段未实现，留待报价模块阶段（可复用本模块的 `productService.list`）。

Phase 7 完成，未迁移报价模块，按要求停止。
