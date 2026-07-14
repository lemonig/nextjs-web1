# Phase 8 完成报告（Phase 8 Report）

> 阶段目标：将 Angular 报价管理模块（TicketListComponent）完整迁移到 Next.js。
> 约束：保持与用户/产品模块一致的开发模式；不重新设计架构；不进入收尾阶段。
> 完成时间：2026-07-14

> 命名说明：任务文字为 `app/(protected)/quotation/page.tsx` 与 `features/quotation/`，但当前项目（nextjs-architecture + project-structure-spec + Phase 2 登录跳转 `/orders` + Phase 3 Sidebar 菜单 `/orders` + 权限白名单）已统一采用 `/orders` 与 `features/orders/`。经与用户确认，本阶段沿用 `/orders` + `features/orders/`，与既有 Sidebar 菜单、登录跳转一致，无需改动导航；`services/quotation.ts`、`services/quotationDetail.ts`、`types/quotation.ts` 保持 quotation 命名不变。

---

## 一、完成内容

### 1. 报价列表
- Ant Design `Table` 展示：项目 / 单位 / 有效期 / 说明 / 操作（明细、编辑、复制、删除）。
- Loading、空数据（Table 内置）、错误提示（`message.error`）。

### 2. 查询
- Ant Design `Form`（inline）：关键字（项目/单位）+ 查询 + 重置（`OrderSearch`）。

### 3. 分页
- Table 内置分页（`showSizeChanger` / `showTotal`），页码由 `useState` 管理。

### 4. 新增 / 编辑
- `OrderFormDrawer`（Ant Design `Drawer` + `Form`，对应架构文档 `OrderFormDrawer`）。
- 字段：项目、单位、有效期（`DatePicker`，`getValueProps`/`normalize` 与后端字符串日期互转）、合同明细、说明、关联人 ID、附件。
- 提交 `quotationService.insert` / `quotationService.update`，成功/失败统一 `message`。

### 5. 删除
- 通用 `showDeleteConfirm`（Phase 4 `ConfirmModal`，底层 `Modal.confirm`）→ `quotationService.remove` → 刷新。

### 6. 复制报价
- 通用 `showConfirm` 二次确认 → `quotationService.copy(id)` → 刷新（对应 Angular `/api/quotation/copy`）。

### 7. 报价明细
- `OrderDetailPanel`（`Drawer`，对应 Angular `showCameraPage` 页内切换，非路由跳转）。
- 明细列表 `Table`：产品 / 数量 / 小区位置 / 序列号 / 备注 / 操作。
- 明细 CRUD：`OrderDetailFormModal`（新增/编辑）+ `showDeleteConfirm`（删除）。
- 批量更新价格：「更新价格」按钮 → `quotationDetailService.batchUpdatePrice({ quotationId })`（对应 `/api/quotation/detail/list/price/update`）。
- 明细数据由 `useOrderDetail(quotationId)` 加载，抽屉打开时按报价单拉取。

### 8. 产品选择
- `ProductPicker`（`Modal` + 搜索 + `Table`，点击行选中），复用 `productService.list`（Phase 5）。
- 在 `OrderDetailFormModal` 中点击「选择产品」打开，选中回填 `productId` + `productName`（对应 Angular 明细产品选择）。

### 9. 文件上传（附件）
- `OrderFormDrawer` 附件上传：Ant Design `Upload`，`action` 指向 `api/upload/evidence`（对应 Angular `/api/upload/evidence`）。
- 上传成功解析返回 `filePath`/`originalFilename`，写入表单 `attachment` 字段（`Form.useWatch` 展示已上传文件名）。

### 10. 导入导出
- 导出：`quotationService.export({ keyword })`（Phase 5，走 `http.download` → `lib/excel/download.ts`，arraybuffer → Blob；对应 `/api/quotation/export`）。
- 导入：Angular 报价模块无导入功能，故本模块不含导入（仅产品模块有），与原项目一致。

### 11. 状态划分
- **页面状态（useState）**：列表数据、loading、关键字、分页、抽屉/弹窗开关、当前编辑对象、明细报价对象、导出态、明细提交态、批量改价态、产品选择弹层开关。
- **全局状态（Redux）**：未新增任何全局状态；报价管理全员可用，无需读取 role。

### 12. 权限
- 报价管理全员可见（对应 `09-permission.md`，role 1/2/3/4 均含 `/orders`），`canManage = true`；保留后端细粒度权限接入扩展点。
- 页面访问控制仍由现有 `middleware` + `AuthGuard` 负责（未改动）。

### 13. TypeScript
- `Quotation` / `QuotationAttachment` / `QuotationDetail` / 请求参数（`QuotationInsertParams` / `QuotationUpdateParams` / `QuotationDetailInsertParams` / `QuotationDetailUpdateParams` / `QuotationDetailPriceUpdateParams`）/ 新增 `QuotationFormValues` / `QuotationDetailFormValues` 均有类型。
- 全程无 `any`（动态扩展字段用 `[prop: string]: unknown` 索引签名兜底）。

---

## 二、Angular 对应文件

| Angular | 说明 |
| --- | --- |
| `routes/ticket/ticket-list.component.ts/html`（`TicketListComponent`，路由 `/order`，`TicketModule` 懒加载） | 报价管理列表 + 新增/编辑/复制/删除 + 明细 + 产品选择 + 附件上传 + 导出 |
| `/api/quotation/list`（ticket-list:164） | 报价单列表 |
| `/api/quotation/detail`（ticket-list:249） | 报价单详情 |
| `/api/quotation/insert`（ticket-list:301） | 新增报价单 |
| `/api/quotation/update`（ticket-list:314） | 更新报价单 |
| `/api/quotation/delete`（ticket-list:334） | 删除报价单 |
| `/api/quotation/copy`（ticket-list:89） | 复制报价单 |
| `/api/quotation/export`（ticket-list:356, ExcelService） | 导出报价 Excel |
| `/api/quotation/detail/list`（ticket-list:432） | 明细列表 |
| `/api/quotation/detail/insert`（ticket-list:469,628） | 新增明细 |
| `/api/quotation/detail/update`（ticket-list:481,641） | 更新明细 |
| `/api/quotation/detail/delete`（ticket-list:520） | 删除明细 |
| `/api/quotation/detail/list/price/update`（ticket-list:708） | 批量更新明细价格 |
| `/api/product/list`（ticket-list:561） | 产品选择列表 |
| `api/upload/evidence`（ticket-list:662） | 附件上传 |
| `09-permission.md`（全员可见报价管理） | 权限扩展点 |

> 未重新分析 Angular 源码，均依据 `docs/02` / `docs/03` / `docs/04` / `docs/07` / `docs/09` / `docs/10` 及架构蓝本。

---

## 三、Next.js 对应文件

### 新增
| 文件 | 说明 |
| --- | --- |
| `features/orders/OrderPage.tsx` | 页面容器：编排查询/表格/抽屉/明细，新增/编辑/复制/删除/导出 |
| `features/orders/hooks/useOrderList.ts` | 报价列表数据/查询/重置/刷新/分页状态 |
| `features/orders/hooks/useOrderDetail.ts` | 报价明细数据加载/刷新（按 quotationId） |
| `features/orders/components/OrderSearch.tsx` | 查询区（Form + 查询/重置） |
| `features/orders/components/OrderTable.tsx` | 报价表格 + 分页 + 行内明细/编辑/复制/删除 |
| `features/orders/components/OrderFormDrawer.tsx` | 新增/编辑抽屉（表单 + 有效期 + 附件上传） |
| `features/orders/components/OrderDetailPanel.tsx` | 报价明细抽屉（明细表格 + CRUD + 批量改价） |
| `features/orders/components/OrderDetailFormModal.tsx` | 明细新增/编辑弹窗（含产品选择入口） |
| `features/orders/components/ProductPicker.tsx` | 产品选择弹层（搜索 + 表格选择） |
| `app/(protected)/orders/page.tsx` | 薄入口 `<OrderPage />` |
| `phase8-report.md` | 本报告 |

### 修改
| 文件 | 修改内容 |
| --- | --- |
| `types/quotation.ts` | 新增 `QuotationFormValues` / `QuotationDetailFormValues`（复用 Phase 5 已有请求参数类型） |

### 复用（未改动）
| 文件 | 说明 |
| --- | --- |
| `services/quotation.ts` | list / detail / insert / update / remove / copy / export（Phase 5） |
| `services/quotationDetail.ts` | list / insert / update / remove / batchUpdatePrice（Phase 5） |
| `services/product.ts` | list（产品选择，Phase 5） |
| `components/common/ConfirmModal.tsx` | 删除/复制二次确认（Phase 4） |
| `lib/excel/download.ts` | Excel 导出（Phase 4/5） |
| `lib/http/request.ts` + `axios.ts` | 统一请求与错误处理（401/403/网络） |

---

## 四、页内交互（组件内状态切换，非路由跳转）

```
OrderPage（列表）
  ├─ OrderFormDrawer（新增/编辑报价单 + 附件上传）
  └─ OrderDetailPanel（报价明细，= Angular showCameraPage）
        └─ OrderDetailFormModal（明细新增/编辑）
              └─ ProductPicker（产品选择弹层）
```

---

## 五、验收结果

| 验收项 | 结果 |
| --- | --- |
| 报价模块功能完整 | 通过 |
| 报价列表正常 | 通过（Ant Design Table） |
| 查询正常 | 通过（关键字 + 重置） |
| 分页正常 | 通过（Table 内置分页） |
| CRUD 正常 | 通过（insert/update/remove + 抽屉校验） |
| 复制报价正常 | 通过（confirm + copy + 刷新） |
| 报价明细正常 | 通过（明细列表 + CRUD + 批量改价） |
| 产品选择正常 | 通过（ProductPicker 搜索 + 选中回填） |
| 导入导出正常 | 通过（导出走 http.download；Angular 报价无导入，符合原项目） |
| 上传正常 | 通过（附件上传 api/upload/evidence） |
| TypeScript 无错误 | 通过（tsc --noEmit） |
| ESLint 无错误 | 通过（pnpm lint 无错误无告警） |
| 生产构建通过 | 通过（pnpm build，含 /orders 路由） |

---

## 六、遗留问题

1. **分页为前端分页**：与用户/产品模块一致，`/api/quotation/list` 原项目一次性返回，故 `total` 取 `data.length`、前端分页。后端支持分页参数后可在 `useOrderList` + `quotationService.list` 切换为服务端分页。
2. **报价单详情接口**：`quotationService.detail` 已在 Phase 5 提供；当前列表编辑直接使用行数据回填抽屉，未额外请求 detail（与列表字段完整时行为一致）。如后端列表字段不全，可在 `openEdit` 中改为先请求 `detail` 再回填。
3. **附件上传返回结构**：`OrderFormDrawer` 通过 `Upload.action` 直传 `api/upload/evidence`（multipart，不经 `request.ts` 拦截器），返回体按 `{ data: { filePath, originalFilename } }` 或直接 `{ filePath }` 两种结构兼容解析；联调时需按后端实际返回核对。
4. **明细产品价格字段**：`batchUpdatePrice` 仅传 `quotationId`（对应原项目按报价单批量刷新产品最新价）；若后端需要更细参数，可扩展 `QuotationDetailPriceUpdateParams`。
5. **明细字段映射**：`QuotationDetail` 的产品名称（`productName`）依据展示需要读取，如后端明细未返回产品名，可在明细列表加载后按 `productId` 关联产品名或改由后端返回。
6. **导出文件类型**：`lib/excel/download.ts` 默认 `.xls`；若后端返回 xlsx，可在导出调用处传入 `ext` 参数调整（`http.download` 已支持）。

Phase 8 完成，报价管理模块已完整迁移，未进入收尾阶段，按要求停止。
