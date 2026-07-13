# 迁移计划 / Migration Plan

> 源系统 / Source：杭开环境报价系统（Angular 8.2 + ng-alain + ng-zorro-antd）
> 目标 / Target：**Next.js 16 · App Router · TypeScript · Ant Design 6 · React Hooks**
> 依据：`docs/01~10` 分析文档 + `nextjs-architecture.md` 架构设计
> 说明：按 Phase 分阶段、按模块拆分任务。每个任务标注**输入文件 / 输出文件 / 依赖关系 / 是否可独立完成 / 是否建议 AI 自动完成**。

---

## 图例 / Legend

- **输入文件**：迁移该任务需参考的 Angular 源码或本套文档。
- **输出文件**：本任务在 Next.js 项目中产出的文件。
- **依赖**：需先完成的前置任务编号。
- **独立**：是否可脱离其它任务单独完成（Y/N）。
- **AI 自动**：是否建议交由 AI 自动完成（✅ 建议 / ⚠️ 需人工确认 / ❌ 需人工主导）。

---

## Phase 1 · 项目基建 / Foundation

| # | 任务 | 输入文件 | 输出文件 | 依赖 | 独立 | AI 自动 |
| --- | --- | --- | --- | --- | --- | --- |
| 1.1 | 初始化 Next.js 16 项目（App Router + TS） | `nextjs-architecture.md` §1 | `package.json` `tsconfig.json` `next.config.ts` `src/app/layout.tsx` `src/app/page.tsx` | - | Y | ✅ |
| 1.2 | 配置 Ant Design 6 + SSR Registry + 主题 | 架构 §6；`docs/01` 技术栈 | `src/app/providers.tsx` `src/app/globals.css` | 1.1 | N | ✅ |
| 1.3 | 配置 ESLint + Prettier + 路径别名 `@/*` | - | `.eslintrc` `.prettierrc` `tsconfig.json`(paths) | 1.1 | Y | ✅ |
| 1.4 | 配置 API 代理（rewrites 到 8080） | `docs/01`(proxy) `docs/04` | `next.config.ts` `.env.local` | 1.1 | Y | ✅ |
| 1.5 | 数据模型 types | `docs/07-models.md` `docs/04` | `src/types/{user,quotation,product,index}.ts` | 1.1 | Y | ✅ |
| 1.6 | HTTP 请求封装（复刻 DefaultInterceptor） | `docs/08` `docs/10`(§3)；架构 §7 | `src/lib/http/{request,types}.ts` | 1.4,1.5 | N | ✅ |
| 1.7 | token 存储 + 权限白名单规则 | `docs/09-permission.md`；架构 §9 | `src/lib/auth/{token,permission}.ts` | 1.5 | Y | ✅ |
| 1.8 | 登录/SSO 服务 + startup 初始化 | `docs/08-auth.md` `docs/10`(§1)；架构 §10 | `src/services/sso.service.ts` `src/lib/startup.ts` | 1.6,1.7 | N | ⚠️ |
| 1.9 | 权限中间件（复刻 CanActivateService） | `docs/03`(§2) `docs/09`；架构 §9 | `middleware.ts` | 1.7,1.8 | N | ⚠️ |
| 1.10 | 全局状态 store（Redux Toolkit + React Redux） | `docs/10`(§6)；架构 §8 | `src/store/{index,hooks,StoreProvider}.ts(x)` `src/store/slices/{auth,user,permission,app}Slice.ts` | 1.5 | Y | ✅ |
| 1.11 | 通用 hooks（请求/表格） | `docs/05`(指令) `docs/06`；架构 §6 | `src/hooks/{useRequest,useTableHeight,useTableScroll}.ts` | 1.6 | N | ✅ |
| 1.12 | Excel 下载封装（复刻 ExcelService） | `docs/10`(§4)；架构 §5 | `src/lib/excel/download.ts` | 1.6 | N | ✅ |

> Phase 1 备注：1.8 / 1.9 涉及 SSO 换 token、cookie 与重定向策略（架构建议 httpOnly cookie），需人工确认后端字段与安全方案。

---

## Phase 2 · 布局与框架 / Layout

| # | 任务 | 输入文件 | 输出文件 | 依赖 | 独立 | AI 自动 |
| --- | --- | --- | --- | --- | --- | --- |
| 2.1 | 主布局（登录后框架） | `layout/default/default.component.*`；`docs/02`；架构 §3 | `src/app/(main)/layout.tsx` | 1.2,1.10 | N | ✅ |
| 2.2 | 登录布局壳 | `layout/passport/passport.component.*` | `src/app/(passport)/layout.tsx` | 1.2 | Y | ✅ |
| 2.3 | Header 顶部菜单（按 role 显隐） | `layout/default/header/header.component.*`；`docs/03`(菜单) `docs/09` | `src/components/layout/Header.tsx` | 1.10,1.7,2.1 | N | ✅ |
| 2.4 | HeaderUser 用户下拉（退出登录） | `.../components/user.component.*`；`docs/03`(§77) `docs/04`(logout) | `src/components/layout/HeaderUser.tsx` | 1.8,2.3 | N | ⚠️ |
| 2.5 | HeaderFullScreen 全屏切换 | `.../components/fullscreen.component.*` | `src/components/layout/HeaderFullScreen.tsx` | 2.3 | Y | ✅ |
| 2.6 | PageFooter 页脚 | `default.component.html`(footer)；`docs/10`(systemBelong) | `src/components/layout/PageFooter.tsx` | 1.10 | Y | ✅ |
| 2.7 | 根布局导航副作用（切页关弹窗/改标题） | `app.component.ts`；`docs/02`(§43) | `src/app/layout.tsx` `providers.tsx` | 2.1 | N | ✅ |

> 说明：Angular 顶部菜单为硬编码 + role 控制（`docs/03`），本系统无独立 Sidebar，导航集中在 Header。示例中的 "Sidebar" 在本系统对应 Header 菜单（后续若需侧栏可基于 antd `Layout.Sider` 扩展）。

---

## Phase 3 · 首页与骨架页 / Home & Skeleton

| # | 任务 | 输入文件 | 输出文件 | 依赖 | 独立 | AI 自动 |
| --- | --- | --- | --- | --- | --- | --- |
| 3.1 | 根重定向 `/` -> `/order` | `routes-routing.module.ts`；`docs/03`(§13) | `src/app/page.tsx` | 1.1 | Y | ✅ |
| 3.2 | 403 无权限页 | `routes/error-page/*`；`docs/02` `docs/03` | `src/app/403/page.tsx` | 1.2 | Y | ✅ |
| 3.3 | 登录/SSO 回跳落地页 | `routes/passport/login/*`；`docs/02`(§51) `docs/08` | `src/app/(passport)/login/page.tsx` | 1.8,2.2 | N | ⚠️ |
| 3.4 | 三个业务页占位（order/device/user） | `docs/02`(页面表) | `src/app/(main)/{order,device,user}/page.tsx` | 2.1 | N | ✅ |
| 3.5 | 通用组件 DataTable/TrimInput/ConfirmModal | `docs/05`(shared/指令)；架构 §6 | `src/components/{DataTable,TrimInput,ConfirmModal}.tsx` | 1.11 | N | ✅ |
| 3.6 | UploadButton 上传封装 | `docs/04`(upload/evidence)；架构 §6 | `src/components/UploadButton.tsx` | 1.6 | N | ✅ |

> 首页即报价管理（`/order`），完整实现在 Phase 5；3.4 先出占位页保证路由与权限链路可跑通。

---

## Phase 4 · 产品管理 / Product（/device）

| # | 任务 | 输入文件 | 输出文件 | 依赖 | 独立 | AI 自动 |
| --- | --- | --- | --- | --- | --- | --- |
| 4.1 | 产品 API service | `docs/04`(§5)；`device-factory.component.ts` | `src/services/product.service.ts` | 1.6,1.5 | N | ✅ |
| 4.2 | DeviceTree 产品分类树 | `shared/device-tree/*`；`docs/05` `docs/10`(§2) `docs/04`(category) | `src/components/DeviceTree.tsx` | 4.1 | N | ✅ |
| 4.3 | DeviceList 产品列表（分类联动） | `device-factory.component.*`；`docs/03`(§56) `docs/10`(§2) | `src/features/device/DeviceList.tsx` + `hooks/` | 4.1,4.2,3.5 | N | ⚠️ |
| 4.4 | DeviceFormModal 增改（分类动态字段） | `device-factory.component.*`；`docs/07`(§4,5) | `src/features/device/DeviceFormModal.tsx` | 4.3 | N | ⚠️ |
| 4.5 | 产品 Excel 导入/导出 | `docs/04`(import/export) `docs/10`(§4) | 复用 `lib/excel/download.ts` + `UploadButton` | 4.1,1.12,3.6 | N | ⚠️ |
| 4.6 | 挂载 `/device` 页面 | `docs/02`；架构 §3 | `src/app/(main)/device/page.tsx` | 4.3,4.4,4.5 | N | ✅ |

---

## Phase 5 · 报价管理 / Quotation（/order）

| # | 任务 | 输入文件 | 输出文件 | 依赖 | 独立 | AI 自动 |
| --- | --- | --- | --- | --- | --- | --- |
| 5.1 | 报价单 API service | `docs/04`(§3)；`ticket-list.component.ts` | `src/services/quotation.service.ts` | 1.6,1.5 | N | ✅ |
| 5.2 | 报价明细 API service | `docs/04`(§4) | `src/services/quotationDetail.service.ts` | 1.6,1.5 | N | ✅ |
| 5.3 | 其它接口 service（OA/解密/上传/售后） | `docs/04`(§6) | `src/services/common.service.ts` | 1.6 | N | ✅ |
| 5.4 | OrderList 列表+查询+分页+复制/删除 | `ticket-list.component.*`；`docs/04`(§3) | `src/features/order/OrderList.tsx` + `hooks/` | 5.1,3.5 | N | ⚠️ |
| 5.5 | OrderFormDrawer 新增/编辑抽屉 | `ticket-list.component.*`(operateForm)；`docs/07`(§2) | `src/features/order/OrderFormDrawer.tsx` | 5.1,5.4 | N | ⚠️ |
| 5.6 | OrderDetailPanel 明细页（showCameraPage） | `ticket-list.component.*`；`docs/04`(§4) `docs/10`(§2) | `src/features/order/OrderDetailPanel.tsx` | 5.2,5.4 | N | ❌ |
| 5.7 | ProductPicker 产品选择弹层 | `ticket-list.component.ts`(product/list)；`docs/04`(§5) | `src/features/order/ProductPicker.tsx` | 4.1,5.6 | N | ⚠️ |
| 5.8 | 明细批量改价+附件上传+设备解密 | `docs/04`(§4,§6) | 复用 5.2/5.3 + `UploadButton` | 5.6,5.3,3.6 | N | ❌ |
| 5.9 | 报价清单 Excel 导出 | `docs/04`(export) `docs/10`(§4) | 复用 `lib/excel/download.ts` | 5.1,1.12 | N | ✅ |
| 5.10 | 挂载 `/order` 页面 | `docs/02`；架构 §3 | `src/app/(main)/order/page.tsx` | 5.4-5.9 | N | ✅ |

> Phase 5 最复杂：原 `TicketListComponent` 为巨型组件（列表/抽屉/明细/产品选择/批量改价）。5.6/5.8 业务逻辑密集（设备解密、验证码、批量价格），建议人工主导 + AI 辅助。

---

## Phase 6 · 用户管理 / User（/user）

| # | 任务 | 输入文件 | 输出文件 | 依赖 | 独立 | AI 自动 |
| --- | --- | --- | --- | --- | --- | --- |
| 6.1 | 用户 API service（owner/list/ehr/crud/pwd） | `docs/04`(§2)；`salesman.component.ts` `user.component.ts` | `src/services/user.service.ts` | 1.6,1.5 | N | ✅ |
| 6.2 | UserList 用户列表 + 删除 | `salesman.component.*`；`docs/04`(list/delete) | `src/features/user/UserList.tsx` + `hooks/` | 6.1,3.5 | N | ⚠️ |
| 6.3 | UserFormModal（EHR 选人 + 角色分配） | `salesman.component.*`(ehr/add/update)；`docs/07`(§1) | `src/features/user/UserFormModal.tsx` | 6.1,6.2 | N | ⚠️ |
| 6.4 | 售后信息更新（可选） | `docs/04`(§6 CompanyAfterSale) | 复用 6.1 | 6.3 | N | ⚠️ |
| 6.5 | 挂载 `/user` 页面（role 4 准入） | `docs/02` `docs/09`；架构 §9 | `src/app/(main)/user/page.tsx` | 6.2,6.3 | N | ✅ |

> 注意 `docs/04`(§28) 记录的 `api/user/${id}` 未插值疑似 bug；迁移时按正确插值实现并复核。

---

## Phase 7 · 收尾优化 / Polish

| # | 任务 | 输入文件 | 输出文件 | 依赖 | 独立 | AI 自动 |
| --- | --- | --- | --- | --- | --- | --- |
| 7.1 | 表格滚动/高度自适应完善 | `docs/05`(指令)；架构 §6 | `src/hooks/{useTableHeight,useTableScroll}.ts` | Phase4-6 | N | ✅ |
| 7.2 | 401/403 全局错误与提示统一 | `docs/08` `docs/10`(§3) | `lib/http/request.ts` `app/403` | Phase1 | N | ✅ |
| 7.3 | 加载态/空态/骨架屏统一 | 架构 §6 | 各 `features/*` | Phase4-6 | N | ✅ |
| 7.4 | 权限与菜单一致性回归测试 | `docs/09` `docs/03` | - | Phase1-6 | N | ⚠️ |
| 7.5 | 类型全量收敛（消除 any） | `docs/07`；架构 §1 | `src/types/*` 各组件 | Phase4-6 | N | ✅ |
| 7.6 | 生产构建/环境变量/代理核对 | `docs/01`(环境) | `next.config.ts` `.env.production` | Phase1 | Y | ⚠️ |
| 7.7 | Lint/Typecheck/e2e 冒烟 | - | CI 脚本 | 全部 | N | ⚠️ |

---

## 推荐执行顺序 / Recommended Order

**总体串行 Phase，Phase 内并行任务。**

```
Phase 1（基建）— 必须最先，且严格按内部依赖顺序：
  1.1 -> 1.3 ┐
  1.1 -> 1.4 ┤
  1.1 -> 1.5 ┼─> 1.6 -> 1.11 / 1.12
  1.5 -> 1.7 ┘         1.7 ┐
  1.6 + 1.7 -> 1.8 -> 1.9  │
  1.5 -> 1.10              ┘
  可并行组：{1.3, 1.4, 1.5, 1.10}；随后 {1.6}；随后 {1.7, 1.11, 1.12}；最后 {1.8 -> 1.9}

Phase 2（布局）：2.1/2.2 先行 -> 2.3 -> {2.4, 2.5} 并行；2.6/2.7 可与 2.3 并行

Phase 3（骨架）：{3.1, 3.2, 3.5, 3.6} 可并行；3.3 依赖 1.8/2.2；3.4 依赖 2.1

Phase 4（产品，先做，业务较简单）：4.1 -> 4.2 -> 4.3 -> 4.4；4.5 与 4.4 并行 -> 4.6

Phase 5（报价，最复杂，放产品之后）：
  {5.1, 5.2, 5.3} 并行 -> 5.4 -> 5.5 -> 5.6 -> {5.7, 5.8} -> 5.9 -> 5.10
  （5.7 复用 Phase 4 的 product.service）

Phase 6（用户）：6.1 -> 6.2 -> 6.3 -> 6.4 -> 6.5

Phase 7（收尾）：在 Phase 4-6 完成后统一进行；7.7 最后
```

顺序理由：
1. **Phase 1 基建先行**：HTTP/权限/登录/store 是所有页面的公共依赖，必须最先稳定。
2. **Phase 2/3 打通骨架**：布局 + 占位页 + 权限链路先跑通，可尽早联调 SSO 与路由准入。
3. **先产品（Phase 4）后报价（Phase 5）**：产品模块（列表 + 分类树 + 动态表单）相对独立且简单，先完成可沉淀 `DataTable`/`DeviceTree`/表单模式；报价模块最复杂且**复用产品的 `ProductPicker`**，故排其后。
4. **用户（Phase 6）最后**：仅 role 4 可见，依赖面最小，可独立收尾。
5. **AI 自动化建议**：✅ 类（service/types/http/布局/占位/导出）优先交 AI 批量生成；⚠️ 类（含表单校验、EHR 选人、SSO）AI 生成后人工复核；❌ 类（报价明细、设备解密/验证码/批量改价）人工主导、AI 辅助。
