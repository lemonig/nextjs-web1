# Next.js 架构设计 / Next.js Architecture

> 迁移源 / Source：杭开环境报价系统（Angular 8.2 + ng-alain + ng-zorro-antd）
> 目标技术栈 / Target：**Next.js 16 · App Router · TypeScript · Ant Design 6 · React Hooks · Redux Toolkit（React Redux）**
> 依据文档：`docs/01~10`（系统概览 / 页面 / 路由 / API / 组件 / Service / Model / 认证 / 权限 / 数据流）
> 说明：本文为架构设计蓝本，与 Angular 原系统三大业务模块（报价 / 产品 / 用户）一一对应。

---

## 目录 / Contents

1. [项目目录结构](#1-项目目录结构)
   - [1.1 目录结构设计说明](#11-目录结构设计说明)
2. [路由设计](#2-路由设计)
3. [页面对应关系](#3-页面对应关系)
4. [Angular Component 对应 React Component](#4-angular-component-对应-react-component)
5. [Angular Service 对应 React service](#5-angular-service-对应-react-service)
6. [公共组件设计](#6-公共组件设计)
7. [API 请求封装方案](#7-api-请求封装方案)
8. [状态管理方案](#8-状态管理方案)
9. [权限方案](#9-权限方案)
10. [登录方案](#10-登录方案)
11. [开发规范](#11-开发规范)

---

## 1. 项目目录结构

采用 App Router + 功能域（feature-based）分层。业务代码位于**项目根目录**（无 `src/` 层），与 Angular 的 `core / layout / routes / shared` 分层一一映射。

```
park-web/
├── next.config.ts                  # rewrites 代理 /api 到后端 8080
├── tsconfig.json                   # paths 别名 @/*
├── .env.local                      # NEXT_PUBLIC_API_BASE / SSO 相关环境变量
├── middleware.ts                   # 边缘中间件：基于公开白名单判断，其余统一鉴权（= CanActivateService）
│
├── public/                         # 静态资源
│   └── tmp/app-data.json           # = assets/tmp/app-data.json 应用基础配置
│
├── docs/                           # 项目文档（01~10 + 结构规范/架构蓝本）
│
├── app/                            # App Router 路由层（仅做路由与入口，薄壳）
│   ├── layout.tsx                  # 根布局：html/body + 全局 Provider（= AppComponent）
│   ├── page.tsx                    # '/' 重定向到默认首页（= redirectTo）
│   ├── globals.css
│   ├── providers.tsx               # 客户端 Provider 聚合（AntdRegistry / Redux Provider）
│   │
│   ├── (protected)/                # 需鉴权路由组（= LayoutDefaultComponent 业务区）
│   │   ├── layout.tsx              # Header + Sidebar? + Breadcrumb + Footer + 权限布局
│   │   ├── users/page.tsx          # 用户管理 /users（入口，调用 features/users）
│   │   ├── orders/page.tsx         # 报价管理 /orders（入口，调用 features/orders）
│   │   └── products/page.tsx       # 产品管理 /products（入口，调用 features/products）
│   │
│   └── (public)/                   # 免鉴权路由组（= LayoutPassportComponent + 错误页）
│       ├── layout.tsx              # 登录/公开页布局
│       ├── login/page.tsx          # 登录/SSO 回跳落地页（= UserLoginComponent）
│       ├── sso/page.tsx            # SSO 回调落地页（可选，处理 ?ticket 换 token）
│       └── 403/page.tsx            # 无权限页（= ErrorPageComponent）
│
├── components/                     # 公共组件（= SharedModule）
│   ├── common/                     # 通用组件（DataTable / ConfirmButton 等）
│   ├── layout/
│   │   ├── AdminLayout.tsx         # 后台整体布局（Header + 内容区）
│   │   ├── Header.tsx              # 顶部菜单（= HeaderComponent）
│   │   ├── HeaderUser.tsx          # 用户下拉（= HeaderUserComponent）
│   │   ├── HeaderFullScreen.tsx    # 全屏切换（= HeaderFullScreenComponent）
│   │   ├── Breadcrumb.tsx          # 面包屑（按路由生成）
│   │   └── PageFooter.tsx          # 页脚（systemBelong）
│   ├── form/                       # 表单类公共组件（SearchForm / TrimInput 等）
│   └── table/                      # 表格类公共组件（DataTable 等）
│
├── features/                       # 业务域（Feature First：页面业务全部在此）
│   ├── users/
│   │   ├── UserPage.tsx            # 用户管理页容器（被 app 入口调用）
│   │   ├── components/             # UserList / UserFormModal
│   │   ├── hooks/                  # useUserList 等
│   │   └── utils/                  # 该域内的纯函数/常量
│   ├── orders/
│   │   ├── OrderPage.tsx           # 报价管理页容器
│   │   ├── components/             # OrderList / OrderFormDrawer / OrderDetailPanel / ProductPicker
│   │   ├── hooks/                  # useOrderList / useOrderDetail 等
│   │   └── utils/
│   └── products/
│       ├── ProductPage.tsx         # 产品管理页容器
│       ├── components/             # ProductList / ProductFormModal / DeviceTree
│       ├── hooks/
│       └── utils/
│
├── services/                       # 领域 API（= 各组件里的 http 调用汇总，去 .service 后缀）
│   ├── sso.ts                      # doLoginByTicket / getSsoAuthUrl / logout
│   ├── user.ts                     # owner / list / ehr / add / update / delete / pwd
│   ├── quotation.ts                # list / detail / insert / update / delete / copy / export
│   ├── quotationDetail.ts          # 报价明细行
│   ├── product.ts                  # list / detail / crud / import / export / category
│   └── common.ts                   # oa/project/load、upload/evidence 等
│
├── lib/                            # 基础设施（= Angular core）
│   ├── http/
│   │   ├── request.ts              # fetch 封装 + 拦截逻辑（= DefaultInterceptor）
│   │   └── types.ts                # ApiResponse<T> 统一响应类型
│   ├── auth/
│   │   ├── token.ts                # token 读写（= @delon/auth TokenService）
│   │   └── permission.ts           # role 到 menuList 白名单映射
│   ├── excel/download.ts           # arraybuffer 下载（= ExcelService）
│   ├── startup.ts                  # 启动初始化（= StartupService）
│   └── constants.ts                # txtStatus 等工具常量
│
├── store/                          # 全局状态（Redux Toolkit）
│   ├── index.ts                    # configureStore + RootState/AppDispatch 类型 + DevTools
│   ├── hooks.ts                    # typed hooks：useAppDispatch / useAppSelector
│   ├── provider.tsx                # React Redux <Provider>（'use client'，每请求新建 store）
│   └── slices/
│       ├── authSlice.ts            # 登录状态：token / user / role / menuList
│       ├── userSlice.ts            # 当前用户信息（profile 等）
│       ├── permissionSlice.ts      # 权限状态：menuList 白名单 / 可见菜单
│       └── appSlice.ts             # app 名称 / systemBelong / footer
│
├── hooks/                          # 通用 hooks（= Angular 指令）
│   ├── useTableHeight.ts           # = appTableHeight
│   ├── useTableScroll.ts           # = appTableScroll / appMultiTitleScroll
│   └── useRequest.ts               # 请求 loading/data 封装
│
├── utils/                          # 与框架无关的工具函数
│   ├── date.ts                     # 日期格式化
│   ├── download.ts                 # 文件下载
│   ├── tree.ts                     # 树形结构处理
│   └── number.ts                   # 数值处理
│
└── types/                          # TypeScript 数据模型（补齐 Angular 缺失的强类型）
    ├── user.ts
    ├── quotation.ts
    ├── product.ts
    └── index.ts
```

> 关键改进：Angular 原项目**全 `any` 无 Model**（见 `07-models.md`）。本架构在 `types/` 中补齐所有强类型接口，是本次迁移的核心质量提升点。

### 1.1 目录结构设计说明

解释每个目录为什么这样设计，以及它对应 Angular 的哪个模块。

| 目录 / 文件 | 设计意图 | 对应 Angular 模块 |
| --- | --- | --- |
| `middleware.ts` | 边缘统一鉴权，基于**公开白名单**判断，不依赖目录名；替代路由守卫，服务端更易维护 | `core/canActivate`（`CanActivateService`） |
| `next.config.ts` | `rewrites` 代理 `/api`、`redirects` 兼容旧链接 | `proxy.conf.json` + `environment.ts` |
| `app/` | **仅路由与入口的薄壳**：`page.tsx` 只做取参、调用 Feature；布局只搭框架 | `routes/` + `*-routing.module.ts` |
| `app/layout.tsx` | 根布局：`html`/`body` + 全局 Provider，全站唯一 | `app.component.ts`（`AppComponent`） |
| `app/providers.tsx` | 客户端 Provider 聚合（AntdRegistry / Redux Provider） | `app.module.ts` 的 `imports/providers` |
| `app/(public)/` | **免鉴权路由组**：登录、SSO 回跳、403，共享公开布局 | `layout/passport` + `routes/error-page` |
| `app/(protected)/` | **需鉴权路由组**：三大业务页，共享带 Header/Footer 的权限布局 | `layout/default`（`LayoutDefaultComponent`） |
| `components/` | 跨业务复用的公共组件与布局片段 | `shared/` + `layout/default/header`（`SharedModule`） |
| `features/` | **Feature First 业务域**：页面业务（容器/组件/hooks/utils）全部内聚在此 | `routes/ticket`、`routes/device`、`routes/salesman` 各特性模块 |
| `services/` | 领域 API 层，按业务域收敛 HTTP 调用（去 `.service` 后缀，更贴近 React 生态） | 原散落在各组件的 `_HttpClient` 调用 |
| `lib/` | 与框架无关的基础设施：http/auth/excel/startup/常量 | `core/`（net / excel / startup / i18n） |
| `store/` | 全局状态（Redux Toolkit）：登录/用户/权限/应用配置 | `SettingsService` + `TokenService` + `localStorage` 会话 |
| `hooks/` | 通用 React hooks（复刻 Angular 指令的 DOM 行为） | `shared/*.directive.ts` |
| `utils/` | 与框架无关的纯工具函数（date/download/tree/number） | 原散落工具方法 |
| `types/` | 全量 TypeScript 数据模型（补齐原项目缺失的强类型） | 原项目无（`07-models.md` 逆向推断） |

**分层三原则**：

1. **薄路由层（app）**：`app/` 内不写业务逻辑，`page.tsx` 只做「取参 -> 调用 `features/<域>/XxxPage`」；布局只负责框架结构。
2. **Feature First（features）**：一个业务域的页面容器、子组件、hooks、utils 全部内聚在 `features/<域>/` 下，跨域复用才上提到 `components/` 或 `lib/`。
3. **鉴权靠白名单不靠目录名（middleware）**：`(public)`/`(protected)` 仅用于**共享布局**；实际准入由 `middleware.ts` 的公开白名单决定，二者解耦。

**为什么用 `(public)` / `(protected)` 而非 `(passport)` / `(main)`**：

- 更符合 Next.js App Router 社区习惯。
- 名称直接表达「是否需要鉴权」，语义自解释。
- 与 `middleware` 的公开/受保护语义一致，后续维护更直观。
- 摆脱 Angular Layout（passport/default）的历史命名。

---

## 2. 路由设计

App Router 使用**路由组（Route Group）**共享布局，路由组仅分「公开 / 受保护」两类；用 `middleware.ts`（公开白名单）替代 `CanActivate` 守卫。

| Next.js 路径 | 文件 | Angular 对应 | 布局 | 准入 |
| --- | --- | --- | --- | --- |
| `/` | `app/page.tsx` | `redirectTo '/order'` | - | `redirect('/orders')` |
| `/orders` | `app/(protected)/orders/page.tsx` | `TicketModule` `/order` | protected | 全员 |
| `/products` | `app/(protected)/products/page.tsx` | `DeviceModule` `/device` | protected | role 1/4 |
| `/users` | `app/(protected)/users/page.tsx` | `SalesmanModule` `/user` | protected | role 4 |
| `/login` | `app/(public)/login/page.tsx` | `/passport/login` | public | 公开 |
| `/sso` | `app/(public)/sso/page.tsx` | -（SSO 回跳落地，可选） | public | 公开 |
| `/403` | `app/(public)/403/page.tsx` | `/403` | public | 公开 |

设计要点：
- **移除 Hash 模式**：Angular 用 `useHash: true`（`#/order`），Next.js App Router 使用标准 history 路由（`/orders`）。
- **路由组不影响 URL**：`(public)`、`(protected)` 只用于共享布局，不出现在路径中。为兼容原 `/passport/login` 深链，可在 `next.config.ts` 加 `redirects` 将 `/passport/login` 转到 `/login`。
- **准入与目录名解耦**：路由组仅表达布局归属；实际鉴权由 `middleware.ts` 的**公开白名单**判断（见第 9 节）。
- **懒加载**：App Router 天然按路由代码分割，无需手写 `loadChildren`；重组件用 `next/dynamic`。
- **页内切换非路由**：报价页「列表 - 抽屉 - 明细页 - 产品选择弹层」沿用组件内 `useState` 状态切换（`*ngIf` 改为条件渲染），不引入子路由。

跳转流程（对应 `03-routing.md`）：

```
入口 -> middleware
  ├─ 命中公开白名单(/login,/403,/sso,/api,/_next) -> 直接放行
  ├─ 非公开且无 token           -> 重定向 SSO 授权地址（getSsoAuthUrl）
  ├─ role 不匹配（canAccess=false）-> 重定向 /403
  └─ 通过                        -> 渲染目标页
'/' -> redirect('/orders')
Header 菜单点击 -> useRouter().push('/orders' | '/products' | '/users')
```

---

## 3. 页面对应关系

| 业务页面 | Angular 组件 / 路由 | Next.js 页面 | 主要子组件（features/） |
| --- | --- | --- | --- |
| 报价管理 | `TicketListComponent` `/order` | `app/(protected)/orders/page.tsx` -> `features/orders/OrderPage` | `OrderList` / `OrderFormDrawer` / `OrderDetailPanel` / `ProductPicker` |
| 产品管理 | `DeviceFactoryComponent` `/device` | `app/(protected)/products/page.tsx` -> `features/products/ProductPage` | `ProductList` / `ProductFormModal` / `DeviceTree` |
| 用户管理 | `SalesmanComponent` `/user` | `app/(protected)/users/page.tsx` -> `features/users/UserPage` | `UserList` / `UserFormModal` |
| 登录 | `UserLoginComponent` `/passport/login` | `app/(public)/login/page.tsx` | SSO 回跳落地 |
| 无权限 403 | `ErrorPageComponent` `/403` | `app/(public)/403/page.tsx` | - |
| 根壳 | `AppComponent` | `app/layout.tsx` | 全局 Provider |

页内交互对应（对应 `10-data-flow.md` 第 2 节，均为组件内状态切换，非路由跳转）：

- **报价页 `/orders`**：`OrderList` 通过 `useState` 控制 `OrderFormDrawer`（新增/编辑）、`OrderDetailPanel`（明细，= `showCameraPage`）、`ProductPicker`（产品选择弹层）的显隐。
- **产品页 `/products`**：左侧 `DeviceTree` 选择分类 -> `onSelect` 回调回传 `categoryId` -> 右侧 `ProductList` 刷新 -> `ProductFormModal` 按分类动态渲染扩展字段。
- **用户页 `/users`**：`UserList` 打开 `UserFormModal`，内含 EHR 员工选择与角色分配。

> `AppComponent` 中「路由切换关闭所有弹窗 + 刷新标题」的逻辑，在 App Router 中用 `usePathname()` 的 effect + antd `App.useApp()` / `Modal.destroyAll()` 重建（放在 `providers.tsx` 或根 layout 的客户端组件里）。

### 3.1 页面入口约定（Feature First）

`app/(protected)/<域>/page.tsx` 是**薄入口**，只负责：取路由参数（`params`/`searchParams`）、调用对应 `features/<域>/XxxPage`、作为路由挂载点。所有业务逻辑（列表、表单、弹层、请求编排）下沉到 `features/<域>/`（`components/` + `hooks/` + `utils/`）。

```
app/(protected)/orders/page.tsx     // export default () => <OrderPage />
features/orders/OrderPage.tsx        // 页面容器：编排 components + hooks
features/orders/components/*         // OrderList / OrderFormDrawer / OrderDetailPanel / ProductPicker
features/orders/hooks/*              // useOrderList / useOrderDetail
features/orders/utils/*              // 该域纯函数/常量
```

### 3.2 Layout 分层职责

| Layout | 职责 | 对应 Angular |
| --- | --- | --- |
| `app/layout.tsx`（根） | `html` / `body` / 全局 Provider（AntdRegistry + Redux Provider），全站唯一 | `AppComponent` |
| `app/(public)/layout.tsx` | 登录/公开页布局（极简外壳，无 Header/鉴权） | `LayoutPassportComponent` |
| `app/(protected)/layout.tsx` | Header + Sidebar（如有）+ Breadcrumb + Footer + 权限布局（客户端校验兜底） | `LayoutDefaultComponent` |

---

## 4. Angular Component 对应 React Component

| 分层 | Angular Component | React Component | 迁移要点 |
| --- | --- | --- | --- |
| 根 | `AppComponent` (`app-root`) | `app/layout.tsx` + `providers.tsx` | `<router-outlet>` 改为 `{children}`；导航副作用用 `usePathname` effect |
| 布局 | `LayoutDefaultComponent` (`layout-default`) | `app/(protected)/layout.tsx` | Header + Sidebar? + Breadcrumb + `{children}` + Footer |
| 布局 | `LayoutPassportComponent` (`layout-passport`) | `app/(public)/layout.tsx` | 登录外壳 |
| 布局 | `LayoutFullScreenComponent` (`layout-fullscreen`) | 暂不迁移（原路由未挂载，死引用） | 需要时再新增路由组 |
| 头部 | `HeaderComponent` (`layout-header`) | `components/layout/Header.tsx` | 硬编码菜单改为按 role 过滤渲染 antd `Menu` |
| 头部 | `HeaderUserComponent` (`header-user`) | `components/layout/HeaderUser.tsx` | antd `Dropdown`；退出走 `sso.logout` |
| 头部 | `HeaderFullScreenComponent` (`header-fullscreen`) | `components/layout/HeaderFullScreen.tsx` | 复用 `screenfull` npm 包 |
| 业务 | `TicketListComponent` | `features/orders/`（`OrderPage` + `components/`） | 拆分原巨型组件；`this.xxx` 字段改为 `useState`/`useReducer` |
| 业务 | `DeviceFactoryComponent` | `features/products/`（`ProductPage` + `components/`） | 动态字段用受控表单渲染 |
| 业务 | `SalesmanComponent` | `features/users/`（`UserPage` + `components/`） | - |
| 业务 | `UserLoginComponent` | `app/(public)/login/page.tsx` | 占位/SSO 回跳落地页 |
| 业务 | `ErrorPageComponent` | `app/(public)/403/page.tsx` | antd `Result status="403"` |
| 共享 | `DeviceTreeComponent` (`app-device-tree`) | `components/DeviceTree.tsx` | `@Output stationCheckEmitter/switchTree` -> props `onSelect`/`onToggle` |
| 共享 | `SettingMenuComponent` (`app-setting-menu`) | `components/SettingMenu.tsx` | `@Input order` -> props |

指令 -> Hook / 组件（对应 `05-components.md` 第 2 节）：

| Angular 指令 | React 实现 |
| --- | --- |
| `appTableScroll` / `appMultiTitleScroll` | `hooks/useTableScroll.ts`（`useEffect` + `ref`） |
| `appTableHeight` | `hooks/useTableHeight.ts`（`ResizeObserver` 计算 antd Table `scroll.y`） |
| `appInputTrim` | `components/TrimInput.tsx`（受控 `onChange` 中 trim） |

组件设计原则：
- **Server / Client 组件划分**：`page.tsx`、`layout.tsx` 尽量保持 Server Component 做壳；含交互/状态/antd 的业务组件加 `'use client'`。
- **拆分原则**：Angular 的巨型 `TicketListComponent`（含列表、抽屉、明细、产品选择）拆成多个受控子组件，放 `features/orders/components/`，状态由父容器 `OrderPage` 统一持有。

---

## 5. Angular Service 对应 React service

Angular DI 单例 Service 在 React 中拆为两类：**纯函数模块**（API 调用、工具）与 **hooks/Provider**（有状态/依赖 React 上下文）。

| Angular Service | React 实现 | 类型 | 说明 |
| --- | --- | --- | --- |
| `StartupService` | `lib/startup.ts` + `StoreProvider`（`store/provider.tsx`） | 函数 + Provider | ticket 换 token、拉 owner、生成 menuList、载 app-data.json |
| `DefaultInterceptor` | `lib/http/request.ts` | 函数封装 | fetch 包装器统一注入 token 头、处理 401/403 |
| `CanActivateService` | `middleware.ts` + `lib/auth/permission.ts` | 中间件 | 服务端边缘校验 token 与白名单 |
| `ExcelService` | `lib/excel/download.ts` | 函数 | fetch `arraybuffer` -> Blob -> `<a download>` |
| `I18NService` | 暂略（原逻辑基本注释） | - | 需要时用 `next-intl` |
| `_HttpClient`（@delon） | `lib/http/request.ts` 的 `http.get/post` | 函数 | - |
| `TokenService`（@delon/auth） | `lib/auth/token.ts` | 函数 | 建议 token 存 httpOnly cookie（见第 10 节） |
| `SettingsService`（@delon） | `store/slices/{authSlice,userSlice,appSlice}.ts`（Redux Toolkit） | Redux slice | user / app / layout 拆入对应 slice |
| `TitleService`（@delon） | `layout.tsx` 的 `metadata` / `usePathname` effect | Next 元数据 | - |
| `MenuService`（@delon） | 未使用（原菜单硬编码），对应 `Header.tsx` 按 role 渲染 | - | - |

领域 API 层（`services/*`，去 `.service` 后缀）：将原本散落在各组件里的 HTTP 调用（见 `04-api-list.md`）按领域收敛为函数，全部返回强类型 `Promise<T>`：

```
sso.ts             -> doLoginByTicket / getSsoAuthUrl / logout
user.ts            -> getOwner / list / ehr / add / update / remove / updatePwd / profileSave
quotation.ts       -> list / detail / insert / update / remove / copy / export
quotationDetail.ts -> list / insert / update / remove / batchUpdatePrice
product.ts         -> list / detail / insert / update / remove / import / export / category
common.ts          -> loadOaProject / decryptCamera / uploadEvidence / afterSaleUpdate
```

---

## 6. 公共组件设计

对应 Angular `SharedModule`（`05-components.md`）。全部基于 Ant Design 6。

| 组件 | 职责 | Props（关键） | 对应 ng-zorro |
| --- | --- | --- | --- |
| `DataTable` | 列表通用封装：分页、loading、滚动高度 | `columns` / `dataSource` / `loading` / `pagination` / `rowKey` | `nz-table` |
| `DeviceTree` | 产品分类树，拉 `/api/product/category` | `onSelect(node)` / `onToggle(collapsed)` | 自定义树 |
| `SettingMenu` | 通用菜单跳转 | `order` | - |
| `TrimInput` | 首尾去空格输入框 | 继承 antd `InputProps` | `appInputTrim` |
| `Header` | 顶部菜单，按 role 显隐 | `activeKey` | `layout-header` |
| `HeaderUser` | 用户下拉：退出（改密/个人信息占位） | - | `header-user` |
| `HeaderFullScreen` | 网页全屏（`screenfull`） | - | `header-fullscreen` |
| `PageFooter` | 页脚，`systemBelong` 存在时显示 | - | - |
| `UploadButton` | 附件/图片上传封装 | `action` / `onDone` | `nz-upload` |
| `ConfirmModal` | 删除等二次确认封装 | - | `nz-modal.confirm` |

ng-zorro 到 antd 组件映射：`nz-modal`->`Modal`、`nz-drawer`->`Drawer`、`nz-table`->`Table`、`nz-upload`->`Upload`、`nz-tree`->`Tree`、`nz-form`->`Form`、`nz-select`->`Select`、`nz-message`->`message`。
表单统一用 antd `Form` + `Form.useForm()`（受控），替代 Angular 响应式表单 `FormGroup`。

---

## 7. API 请求封装方案

核心文件 `lib/http/request.ts`，用原生 `fetch` 封装，复刻 `DefaultInterceptor` + 后端统一响应约定（`04-api-list.md` / `10-data-flow.md`）。

统一响应类型（`lib/http/types.ts`）：

```ts
export interface ApiResponse<T = unknown> {
  success: boolean;
  code: number;       // 401 / 403 特殊处理
  data: T;
  message: string;
}
```

封装职责（复刻拦截器）：
1. **baseURL / 代理**：请求走 `/api/*`，由 `next.config.ts` 的 `rewrites` 转发到 `http://192.168.188.110:8080`。
2. **注入 token**：非白名单请求自动带 `token` 头（白名单：`api/sso/getSsoAuthUrl`、`api/sso/doLoginByTicket`、`assets/*`）。
3. **无 token 中断**：非白名单且无 token 时直接 reject，避免无效请求。
4. **统一响应处理**：
   - `code == 401` -> 清 token -> 跳 `/login`。
   - `code == 403` -> 跳 `/403`。
   - `success === false` -> `message.error(res.message)` 并 reject。
   - 成功 -> resolve `res.data`（泛型 `T`）。
5. **导出方法**：`http.get<T>`、`http.post<T>`、`http.download(url, body, filename)`。

```ts
export const http = {
  get:  <T>(url: string, params?: Record<string, unknown>) => request<T>('GET', url, params),
  post: <T>(url: string, body?: unknown)                   => request<T>('POST', url, body),
  download: (url: string, body: unknown, filename: string) => downloadFile(url, body, filename),
};
```

数据获取策略：
- 交互型 CRUD（本系统主体）在 Client Component 中用 `services/*` + `useRequest` hook 调用。
- 可选：引入 **TanStack Query** 做缓存/失效/重试；`useRequest` 作为轻量替代（管理 `loading/data/error`）。
- Excel 导出（`/api/quotation/export`、`/api/product/export`）走 `http.download`，复刻 `ExcelService` 的 arraybuffer -> Blob 下载。

---

## 8. 状态管理方案

对应 `10-data-flow.md` 第 6 节：原项目无全局状态库，状态分三层。迁移后采用 **Redux Toolkit（React Redux 官方方案）** 管理应用级全局状态：

| 层级 | 原载体 | Next.js 方案 |
| --- | --- | --- |
| 组件级 | 组件类字段 `this.xxx` | `useState` / `useReducer`（表单可见性、分页、列表数据） |
| 应用级会话 | `localStorage` + TokenService | **Redux Toolkit** slices（`auth` / `user` / `permission` / `app`）+ token cookie |
| delon 单例 | `SettingsService` | Redux Toolkit slices（同上） |

### 8.1 技术选型

- **Redux Toolkit（`@reduxjs/toolkit`）** + **React Redux（`react-redux`）** 官方方案。
- 用 **`createSlice`** 定义各领域状态与 reducer/action。
- 用 **`configureStore`** 组装 store，默认集成 **Redux DevTools** 与 `redux-thunk`。
- 用 **typed hooks**（`useAppDispatch` / `useAppSelector`）替代原生 hooks，保证类型安全。

### 8.2 Store 组装（`store/index.ts`）

```ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import permissionReducer from './slices/permissionSlice';
import appReducer from './slices/appSlice';

export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authReducer,
      user: userReducer,
      permission: permissionReducer,
      app: appReducer,
    },
    devTools: process.env.NODE_ENV !== 'production', // Redux DevTools
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
```

> 采用 `makeStore()` 工厂函数（而非单例），配合 App Router 每请求新建 store，避免服务端多请求间状态串扰。

### 8.3 Typed Hooks（`store/hooks.ts`）

```ts
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
```

全项目**禁止**直接使用 `useDispatch` / `useSelector`，统一使用上述 typed hooks。

### 8.4 各 Slice 设计

**登录状态 `authSlice`**（对应原 token + SSO 会话）：

```ts
interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'authenticating' | 'authenticated' | 'failed';
}
// reducers: setToken / clearAuth / setStatus
// 由登录流程（doLoginByTicket 成功后）dispatch setToken
```

**用户状态 `userSlice`**（对应 `/api/user/owner` 与 `SettingsService.user`）：

```ts
interface UserState {
  info: User | null;        // id / nickname / account / role ...
  role: 1 | 2 | 3 | 4 | null;
}
// reducers: setUser / clearUser
// 可用 createAsyncThunk 封装 fetchOwner（GET /api/user/owner）
```

**权限状态 `permissionSlice`**（对应 `menuList` 白名单）：

```ts
interface PermissionState {
  menuList: string[];        // role 生成的路由白名单
  visibleMenus: MenuItem[];  // Header 可见菜单
}
// reducers: setPermission(role) -> 依据 lib/auth/permission.ts 计算 menuList/visibleMenus
```

**应用状态 `appSlice`**（对应 `app-data.json` 与页脚信息）：

```ts
interface AppState {
  appName: string;
  systemBelong: string;
  footerMessage: string;
}
// reducers: setAppConfig
```

### 8.5 其它约定

- **组件间通信**：原 `@Input/@Output` 一律改为 props/回调（如 `DeviceTree` 的 `onSelect`），不进 Redux。
- **服务器状态**：列表/详情等远端数据不放 Redux，交给 `useRequest` / TanStack Query 管理，仅将「会话/用户/权限/应用配置」放全局 store。
- **持久化**：token 存 cookie（见第 10 节）；刷新后由 `StoreProvider` 初始化时重新 dispatch（读 cookie + 拉 owner）恢复 auth/user/permission。
- **初始化时机**：见第 8.6 与第 10 节。

### 8.6 Provider 初始化方式

React Redux 的 `<Provider>` 封装为客户端组件 `store/provider.tsx`，在 `app/providers.tsx` 中与 AntdRegistry 一起挂载到根 `app/layout.tsx`：

```tsx
// store/provider.tsx
'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, type AppStore } from './index';

export default function StoreProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore(); // 每个客户端实例只建一次
    // 可在此 dispatch 初始 startup 数据（app-data.json / 恢复会话）
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}
```

```tsx
// app/providers.tsx（客户端 Provider 聚合）
'use client';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { App as AntdApp } from 'antd';
import StoreProvider from '@/store/provider';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AntdRegistry>
      <StoreProvider>
        <AntdApp>{children}</AntdApp>
      </StoreProvider>
    </AntdRegistry>
  );
}
```

- **启动初始化**（复刻 `StartupService`）：在 `StoreProvider` 首次挂载时（`useRef` 初始化块或客户端 `useEffect`）触发——读取 cookie token、`dispatch(fetchOwner())`、`dispatch(setPermission(role))`、加载 `app-data.json` `dispatch(setAppConfig())`。token 校验与路由准入仍由 `middleware`（服务端）负责。
- 用 `useRef` 保证同一客户端实例只创建一次 store；服务端每次请求经 `makeStore()` 得到独立 store，避免状态串扰。

---

## 9. 权限方案

对应 `09-permission.md`：role 驱动的**菜单白名单**双控（菜单可见性 + 路由准入）。

角色白名单规则集中到 `lib/auth/permission.ts`：

```ts
export const ROLE_MENUS: Record<number, string[]> = {
  1: ['/orders', '/products'],
  2: ['/orders'],
  3: ['/orders'],
  4: ['/orders', '/products', '/users'],
};
export const getMenuList = (role: number) => ROLE_MENUS[role] ?? ['/orders'];
export const canAccess = (role: number, path: string) =>
  getMenuList(role).some((m) => path.startsWith(m));
```

两道防线（与 Angular 保持一致的双控）：
1. **路由准入（服务端）** — `middleware.ts`（= `CanActivateService`），**基于公开白名单判断，不依赖路由组目录名**：
   - 公开白名单直接放行：`/login`、`/403`、`/sso`、`/api/*`、`/_next/*`、静态资源。
   - 其余路径统一鉴权：读 cookie 中 token；无效 -> 重定向 SSO 授权地址。
   - 读 role（cookie/解码 token）-> `canAccess(role, pathname)`；不在白名单 -> 重定向 `/403`。

```ts
// middleware.ts 思路
const PUBLIC_PATHS = ['/login', '/403', '/sso'];
const isPublic = (p: string) =>
  PUBLIC_PATHS.some((x) => p === x || p.startsWith(x + '/')) ||
  p.startsWith('/api') || p.startsWith('/_next') || p === '/favicon.ico';

// matcher 排除静态资源，其余交由 middleware 判断
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
```

2. **菜单可见性（客户端）** — `Header.tsx` 通过 `useAppSelector` 读取 `permission`/`user` slice 的 role 过滤菜单项：
   - 报价管理：全员；产品管理：role 1/4；用户管理：role 4（对应 `03-routing.md` 菜单表）。

> 保证「菜单可见」与「路由准入」两套逻辑数据源一致（都来自 `permission.ts` 与同一 role），修复原系统两套独立控制易不一致的问题。
> **关键**：`(public)`/`(protected)` 仅决定布局，鉴权只认 `PUBLIC_PATHS` 白名单——即使某页放错路由组，鉴权行为也不受影响，二者彻底解耦。
> 可选增强：细粒度按钮权限用 `<Access role={...}>` 包装组件（对应未启用的 `@delon/acl`）。

---

## 10. 登录方案

对应 `08-auth.md`：**SSO（EHR）单点登录**，非表单登录。登录页仅为 SSO 回跳落地占位。

认证流程（App Router 版）：

```
1. 访问受保护路由 -> middleware 检查 token cookie
2. 无 token:
     -> POST api/sso/getSsoAuthUrl 取授权地址 -> 302 跳转到 SSO
3. SSO 认证成功后带 ?ticket=xxx 回跳应用（`/sso` 或 `/login`）
     -> 登录落地页 POST api/sso/doLoginByTicket 用 ticket 换 access_token
     -> 写入 token（cookie）
4. GET /api/user/owner 拉当前用户与 role
     -> dispatch(setUser) + dispatch(setPermission(role)) 生成 menuList
5. 重定向到 /orders（默认首页）
6. 退出：HeaderUser -> POST api/sso/logout -> 清 cookie + dispatch(clearAuth/clearUser) -> location.href = origin
```

关键实现点：
- **token 存储**：建议改用 **httpOnly cookie**（而非原 localStorage），使 `middleware` 能在服务端读取校验，且更安全。若后端要求 `token` 头，则在 `request.ts` 从 cookie 读出注入 header。
- **ticket 换 token**：在登录落地页（`/login` 或 `/sso`）或 `StoreProvider` 首次挂载时解析 URL `ticket` 参数并调用 `doLoginByTicket`，成功后 `dispatch(setToken)`（复刻 `StartupService.getTicket`）。
- **免鉴权白名单**：`middleware` 公开白名单 `/login`、`/403`、`/sso`、`/api/*`、`/_next/*`；HTTP 层白名单 `api/sso/getSsoAuthUrl`、`api/sso/doLoginByTicket`、`assets/*`，二者语义一致但作用层不同。
- **登录页**：`/login` 保留占位（原 `login.component.html` 仅 `<h1>登录ing</h1>`），实际登录靠 SSO 重定向；可在此页做「正在登录…」loading 与失败提示。
- **401 处理**：`request.ts` 收到 `code == 401` 时清 token 并跳 `/login`（再由 middleware 触发 SSO），与拦截器行为一致。

---

## 11. 开发规范

本章为本项目**强制约束**，是分层架构（第 1 章）与 Feature First（第 3 章）的落地规则。**后续所有开发者与 AI Agent 生成代码时必须严格遵守。**

### 11.1 核心规范

| # | 规范 | 说明 | 违规示例 |
| --- | --- | --- | --- |
| 1 | **一个页面对应一个 Feature** | 每个路由页 `app/(protected)/<域>/page.tsx` 对应且仅对应一个 `features/<域>/`，命名一一对应（users/orders/products） | 一个 page 混合多个域逻辑 |
| 2 | **`app/` 目录禁止编写业务逻辑** | `app/**/page.tsx`/`layout.tsx` 只做路由入口、取参、调用 Feature、搭布局；不写请求、状态、表单、DOM 逻辑 | 在 `page.tsx` 里 `fetch`/`useState` 业务数据 |
| 3 | **所有业务逻辑放到 `features/`** | 页面容器、组件、hooks、utils 全部在 `features/<域>/`（`XxxPage.tsx` + `components/` + `hooks/` + `utils/`） | 业务组件散落在 `app/` 或 `components/` |
| 4 | **所有 HTTP 请求放到 `services/`** | 一切 `/api/*` 调用只能出现在 `services/*.ts`；Feature 通过 import service 函数使用，不直接 `fetch`/`http.get` | 组件/hook 内直接发请求 |
| 5 | **所有全局状态放到 Redux Toolkit** | 跨页面/会话级状态（登录、用户、权限、应用配置）只放 `store/slices/*`，用 `createSlice`；组件用 typed hooks 读写 | 用 Context/单例/模块变量存全局状态 |
| 6 | **页面局部状态优先 `useState`** | 弹层显隐、表单临时值、分页、loading 等局部状态优先 `useState`/`useReducer`，不放 Redux | 局部 UI 状态塞进全局 store |
| 7 | **公共组件放 `components/`** | 跨 Feature 复用的组件/布局片段放 `components/`；仅单 Feature 使用的组件放该 `features/<域>/components/` | 通用组件写死在某个 Feature 内 |
| 8 | **一个 Feature 不允许依赖其它 Feature** | `features/orders` 不得 import `features/products`/`features/users`。共享需求上提到 `components/`、`services/`、`lib/`、`types/` | `features/orders` 直接引用 `features/products/...` |
| 9 | **所有 TypeScript 类型放 `types/`** | 领域数据模型、API 请求/响应类型集中在 `types/*`；禁止使用 `any`（原项目痛点） | 组件内散定义 interface / 用 `any` |
| 10 | **AI Agent 必须遵守以上规范** | 后续任何 AI Agent 生成/修改代码，必须符合 1~9；不确定时按本章就近分层，不得破坏依赖方向 | 生成代码违反分层或引入跨 Feature 依赖 |

### 11.2 依赖方向（单向，禁止反向/环形）

```
app/ (路由入口)
  └─> features/ (业务域)
        ├─> components/ (公共组件)
        ├─> services/   (HTTP)
        ├─> store/      (全局状态)
        ├─> hooks/      (通用 hooks)
        ├─> lib/        (基础设施)
        └─> types/      (类型)

约束：
- features 之间：禁止互相依赖（横向隔离）。
- components / lib / services / types：不得反向依赖 features 与 app。
- store slices：只依赖 services / types / lib，不依赖 features / components。
```

### 11.3 各层职责边界速查

| 层 | 只能做 | 禁止做 |
| --- | --- | --- |
| `app/` | 路由、取参、调用 Feature、搭布局 | 业务逻辑、请求、全局状态定义 |
| `features/<域>/` | 该域全部业务（容器/组件/hooks/utils） | 依赖其它 Feature、直接 `fetch` |
| `components/` | 跨域通用 UI | 绑定具体业务域、发请求 |
| `services/` | 封装 HTTP、返回强类型 `Promise<T>` | 持有状态、依赖组件/Feature |
| `store/` | 全局状态（slice/typed hooks） | 存放局部 UI 状态、放业务组件 |
| `hooks/` | 通用可复用 hook | 绑定单一业务域 |
| `lib/` | 与框架无关基础设施 | 依赖 features/app/store |
| `types/` | 全量类型定义 | 运行时逻辑 |

### 11.4 命名与写法约定

- **Feature 目录/入口**：`features/orders/OrderPage.tsx`、`features/products/ProductPage.tsx`、`features/users/UserPage.tsx`。
- **Service 文件**：领域名，无后缀，如 `services/user.ts`（禁止 `.service.ts`）。
- **Slice 文件**：`store/slices/<域>Slice.ts`，导出 reducer 与 actions。
- **全局状态读写**：只用 `useAppSelector` / `useAppDispatch`（禁止裸 `useSelector`/`useDispatch`）。
- **类型引用**：统一从 `@/types` 引入；跨层传参使用显式类型，禁止 `any`。

---

## 附录：依赖与配置建议

- **核心依赖**：`next@16`、`react`、`antd@6`、`@ant-design/nextjs-registry`（SSR 样式）、`@reduxjs/toolkit`、`react-redux`、`screenfull`、`dayjs`（替代 moment）。可选 `@tanstack/react-query`。
- **忽略依赖**：原 package.json 中 `file-saver`、`xlsx`、`ngx-tinymce`、`ngx-ueditor`、`@delon/cache|chart|form|abc`、`@angular/cdk` 均为未使用/死引用（见 `01-system-overview.md`），迁移时不引入。
- **代理配置**（`next.config.ts`）：

```ts
async rewrites() {
  return [{ source: '/api/:path*', destination: 'http://192.168.188.110:8080/api/:path*' }];
}
```

- **质量提升**：全量补齐 `types/` 强类型（原项目全 `any`）；统一错误处理与 loading；服务端权限校验前移到 middleware。

