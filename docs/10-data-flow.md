# 10 · 数据流 / Data Flow

> 关联文档：认证见 `08-auth.md`；权限见 `09-permission.md`；接口见 `04-api-list.md`；服务见 `06-services.md`。

---

## 1. 应用启动数据流 / Startup Data Flow

```
                     进入应用 App entry
                          |
            startup.getTicket()  URL 带 ticket?
                          | 是 -> POST api/sso/doLoginByTicket
                          |     -> SSO 换 token -> TokenService.set()
                          v
              startup.getUserMsg()  GET /api/user/owner
                          | 写入 SettingsService.setUser
                          | 按 role 生成 menuList -> localStorage
                          v
              加载 assets/tmp/app-data.json
                          | 设置 app 名称/标题/图标
                          v
                  重定向 -> /order (报价管理)
```

## 2. 页面级数据流 / In-page Data Flow

- **报价页 `/order`**：列表 <-> 新增/编辑抽屉 <-> 报价明细页（`showCameraPage`）<-> 产品选择弹层，均为组件内 `*ngIf` 状态切换，非路由跳转。
- **产品页 `/device`**：左侧 `app-device-tree` 选择分类 -> 右侧列表刷新 -> 新增/编辑弹层。
  - `device-tree` 请求 `/api/product/category`，选中节点通过 `stationCheckEmitter` 输出给父组件，`switchTree` 输出折叠事件。
- **退出登录**：`header-user` -> `POST api/sso/logout` -> 清空缓存 -> `location.href = origin`。

## 3. HTTP 请求/响应处理流 / HTTP Request-Response Flow

```
组件 _HttpClient.get/post(url, params)
        |
        v
DefaultInterceptor.intercept()
   - 免鉴权白名单？(sso/getSsoAuthUrl, sso/doLoginByTicket, assets/*)
   - 否则从 TokenService 取 token 注入到 header.token
   - 无 token -> of() 中断
        |
        v
   后端（proxy -> http://192.168.188.110:8080）
        |
        v
   响应统一约定字段 success / code / data / message
   - body.code == 401 -> 清 token/localStorage -> 跳 /passport/login
   - body.code == 403 -> 跳 /403
        |
        v
组件 subscribe：res.success ? 使用 res.data : msg.error(res.message)
```

## 4. Excel 下载数据流 / Excel Download Flow

`ExcelService.download(webApi, params, filename)`（`core/excel/excel.service.ts`）：

```
POST webApi (body=params, responseType='arraybuffer', header 附带 token)
        |
        v
Blob(xlsx) -> URL.createObjectURL -> <a download=filename_YYYY_MM_DD.xls> -> click
```

- 使用位置：报价导出 `/api/quotation/export`、产品导出 `/api/product/export`。

## 5. 本地缓存 / Local Storage Keys

| 键 Key                           | 写入位置                   | 说明                                                          |
| -------------------------------- | -------------------------- | ------------------------------------------------------------- |
| `menuList`                       | `startup.service.ts`       | 按 role 生成的路由白名单（Guard 读取）                        |
| `user`                           | 用户信息                   | `header.component.ts`/`ticket-list.component.ts` 读取 role 等 |
| `systemBelong` / `footerMessage` | 页脚信息                   | `default.component.ts`、`device-tree`、`setting-menu` 读取    |
| token                            | `@delon/auth` TokenService | 拦截器与 ExcelService 读取注入 header                         |

## 6. 状态管理 / State Management（补充）

> 关键发现：项目**没有使用任何全局状态库**（无 NgRx / NGXS / Akita / RxJS Store）。状态分散在三处：

| 层级         | 载体                                                                  | 内容                                                            | 迁移映射 Next.js/React                                                    |
| ------------ | --------------------------------------------------------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------- |
| 组件级 State | 各组件类字段（`this.xxx`）                                            | 列表数据、loading、表单可见性（`showOperatePage` 等）、分页 `q` | `useState`/`useReducer` + React Hook Form                                 |
| 应用级会话   | `localStorage` + `@delon/auth TokenService`                           | `menuList`、`user`、`systemBelong`/`footerMessage`、token       | React Context / Zustand + cookie/localStorage；token 建议 httpOnly cookie |
| delon 单例   | `SettingsService`（`settings.user`/`settings.app`/`settings.layout`） | 当前用户、应用信息、布局配置                                    | 全局 Context 或 Zustand store                                             |

- 组件间通信：仅 `@Input`/`@Output`（如 `app-device-tree` 的 `stationCheckEmitter`），迁移为 props/回调。
- 无跨页面共享的响应式 store；页面刷新后依赖 `localStorage` 与 `StartupService` 重新拉取。
- 迁移提示：Next.js 中 `StartupService.load()` 的初始化逻辑应放在根 `layout.tsx` 的 Server Component / middleware，或客户端 Provider 的首次挂载 effect 中。
