# 迁移前文档核查报告 / Migration Check Report

> 目标 / Goal：Angular 8 -> Next.js 16 + React + TypeScript 迁移前的文档完整性核查
> 范围 / Scope：核对 `docs/` 下 10 个分析文档与 `src/` 源码的一致性
> 方法 / Method：源码静态扫描（selector / 路由 / HTTP 调用 / @Injectable / @Directive / import），未修改任何源码。

---

## 一、总体结论 / Summary

`docs/` 十份文档整体**覆盖完整、准确**，核心页面、路由、API、Service、组件、权限逻辑均无遗漏。核查中发现 **8 处需补充/修正的细节**，均已回填到对应文档，并在下文逐项说明。

| 核查项              | 结论           | 遗漏数 | 处理                                                     |
| ------------------- | -------------- | ------ | -------------------------------------------------------- |
| 1. Angular 页面覆盖 | 通过（有补充） | 2      | 已补充 `AppComponent`、登录页占位说明                    |
| 2. 路由             | 通过           | 0      | 全部路由已覆盖                                           |
| 3. API              | 通过           | 0      | 全部 30 个接口已覆盖                                     |
| 4. Service          | 通过           | 0      | 5 个 Service 全覆盖                                      |
| 5. 公共组件         | 通过（有补充） | 2      | 已补充 `LayoutFullScreenComponent`、`ErrorPageComponent` |
| 6. 权限逻辑         | 通过（有修正） | 1      | 已标注 `ACLGuard` 死引用                                 |
| 7. 状态管理         | 之前缺失       | 1      | 已在 `10-data-flow.md` 新增状态管理章节                  |
| 8. 第三方依赖       | 通过（有修正） | 2      | 已在 `01` 标注声明但未使用的依赖                         |

---

## 二、逐项核查 / Item-by-item

### 1. 是否覆盖所有 Angular 页面？ ✅（已补充）

源码 `@Component` selector 全量（18 个）：

```
业务页：app-ticket-list, app-device-factory, app-salesman, app-error-page
布局：layout-default, layout-passport, layout-fullscreen, layout-header
头部：header-user, header-fullscreen
shared 组件：app-device-tree, app-setting-menu
指令：[appInputTrim] [appMultiTitleScroll] [appTableHeight] [appTableScroll]
根：app-root
```

- **原文档已覆盖**：4 个业务页 + 布局 + 头部 + shared 组件 + 指令。
- **补充 1**：`AppComponent`（`app-root`）此前未单列。已加入 `02-page-list.md` 第 3 节（含 `TitleService.setTitle()` + `NzModalService.closeAll()` 逻辑及 Next.js 映射）。
- **补充 2**：登录页 `login.component.html` 实为占位（仅 `<h1>登录ing</h1>`），`loginForm` 定义但未渲染、无提交。已在 `02-page-list.md` 第 4 节说明。

### 2. 是否遗漏路由？ ✅

核对 `routes-routing.module.ts` + 3 个特性路由模块，全部路由：

```
'' -> redirect /order | order(懒加载) | device(懒加载) | user(懒加载)
403 | passport/login | (注释掉的 ** 通配兜底)
```

- 无遗漏。补充说明：`routes-routing.module.ts:70` 存在**被注释的通配路由** `{ path: '**', redirectTo: 'passport/login' }`，当前未启用；迁移时若需 404 兜底需自行在 Next.js `not-found.tsx` 实现（已在本报告备注）。

### 3. 是否遗漏 API？ ✅

源码 HTTP 调用全量扫描（`.get/.post/.request`）共 **30 个业务端点** + 2 个本地静态资源（`assets/tmp/app-data.json`、i18n json），与 `04-api-list.md` **完全一致**，无遗漏。

- 已注释的接口（`api/setting/list`、`api/setting/system/base/logos`）文档已标注"已注释"。
- `ExcelService` 内的 `POST` 请求为通用下载通道，实际业务地址为 `/api/quotation/export`、`/api/product/export`，均已在文档记录。

### 4. 是否遗漏 Service？ ✅

`@Injectable` 全量（5 个）：`StartupService`、`ExcelService`、`CanActivateService`、`DefaultInterceptor`、`I18NService` —— `06-services.md` 全覆盖。delon/zorro 内置服务（`_HttpClient`、`SettingsService`、`TitleService`、`ITokenService`、`NzMessageService`、`NzModalService`）文档亦有提及。

### 5. 是否遗漏公共组件？ ✅（已补充）

- `SharedModule` 声明的 2 组件 + 4 指令：已覆盖。
- **补充**：`LayoutFullScreenComponent`（空壳布局，未挂载路由）与 `ErrorPageComponent`（403 页）此前未在组件清单单列，已加入 `05-components.md` 第 4 节，并新增第 5 节「迁移映射建议」。

### 6. 是否遗漏权限逻辑？ ✅（已修正）

`08-auth.md` + `09-permission.md` 已完整描述：SSO 换 token、拦截器 401/403、`CanActivateService` 白名单守卫、role(1/2/3/4) -> menuList 映射、Header 菜单 role 可见性。

- **修正**：`routes-routing.module.ts` 中 `import { ACLGuard } from '@delon/acl'` 属**死引用**（导入但未挂载到任何路由的 `canActivate`）。`@delon/acl` 的 `DelonACLModule` 虽在 `delon.module.ts` 加载，但项目**未使用 ACL 能力**，真正的权限控制完全靠 `CanActivateService` + localStorage 白名单。已在 `01` 依赖表标注，避免迁移时误引入 ACL 体系。

### 7. 是否遗漏状态管理？ ⚠️ -> ✅（已补充）

- 原 10 份文档**未设独立的状态管理主题**。经核查：项目**无任何全局状态库**（无 NgRx/NGXS/Akita）。
- 已在 `10-data-flow.md` 新增第 6 节「状态管理」，明确三层状态载体（组件字段 / localStorage+TokenService / delon SettingsService）及对应的 Next.js 迁移映射（useState、Context/Zustand、httpOnly cookie）。

### 8. 是否遗漏第三方依赖？ ✅（已修正）

对 `package.json` 声明依赖逐一验证源码 `import`：

**实际使用**：`@angular/*`、`ng-zorro-antd`、`@delon/theme`、`@delon/auth`、`@delon/acl`(仅模块)、`@delon/mock`(仅 dev)、`screenfull`、`moment`、`rxjs`、`@ngx-translate/*`(基本停用)、`@angular/cdk`(仅导入未用)。

**声明但源码未使用（迁移可忽略）**：`file-saver`、`xlsx`、`ngx-tinymce`、`ngx-ueditor`、`@delon/abc`、`@delon/cache`、`@delon/chart`、`@delon/form`、`@delon/util`(仅 `updateHostClass`)。

- 已在 `01-system-overview.md` 技术栈表新增「是否实际使用」列并附迁移提示。

---

## 三、迁移重点提醒 / Migration Notes

1. **认证是 SSO 跳转式**，非表单登录：Next.js 需实现 `ticket` -> `doLoginByTicket` 换 token 的回跳落地逻辑（建议 middleware / route handler），token 建议存 httpOnly cookie 而非 localStorage。
2. **权限双轨**：菜单可见性（Header, role 判断）与路由准入（menuList 白名单）分别独立，迁移时应统一到一处（如 middleware + 布局条件渲染），避免不一致。
3. **无强类型 Model**：全部 `any`。迁移是补充 TypeScript interface 的最佳时机，可参考 `07-models.md` 的推断结构。
4. **Excel 导出**用 `arraybuffer` + Blob 下载，非 `xlsx` 库：React 端可用 `fetch` + `blob()` + `URL.createObjectURL` 直接复刻。
5. **HTTP 统一约定**：响应体 `{ success, code, data, message }`，`code===401/403` 触发跳转。建议在 Next.js 封装统一 fetch wrapper / axios interceptor 复刻。
6. **组件内大量 `*ngIf` 弹层/抽屉状态**：迁移为 React `useState` 控制的 `Modal`/`Drawer` 显隐。
7. **注释掉的通配路由**（`**` -> login）与被注释的多语言/setting 逻辑：迁移时按需决定是否恢复。

---

## 四、文档改动清单 / Changed Docs

| 文档                        | 改动                                                               |
| --------------------------- | ------------------------------------------------------------------ |
| `01-system-overview.md`     | 技术栈表重写，新增"是否实际使用"列 + 未使用依赖迁移提示            |
| `02-page-list.md`           | 新增第 3 节 `AppComponent` 根组件、第 4 节 登录页占位说明          |
| `05-components.md`          | 头部组件补充 screenfull 细节；新增第 4 节其他组件、第 5 节迁移映射 |
| `10-data-flow.md`           | 新增第 6 节 状态管理（含 Next.js 映射）                            |
| `migration-check-report.md` | 本报告（新增）                                                     |

> 未改动源码；未改动 `03/04/06/07/08/09` 文档（核查后确认无遗漏）。
