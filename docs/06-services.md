# 06 · Service 服务 / Services

> 关联文档：认证与权限见 `08-auth.md`、`09-permission.md`；数据流见 `10-data-flow.md`。

---

## Service 服务 / Services

| Service              | 文件 File                                  | 注册位置 Provided In             | 职责 Responsibility                                                                                          |
| -------------------- | ------------------------------------------ | -------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `StartupService`     | `core/startup/startup.service.ts`          | `APP_INITIALIZER` (app.module)   | 应用启动初始化：SSO ticket 换 token、加载用户信息、按 role 生成 menuList、加载 app-data.json、设置标题与图标 |
| `ExcelService`       | `core/excel/excel.service.ts`              | `AppModule` providers            | 通过 POST + `arraybuffer` 下载 Excel/Doc，自动附带 token 与时间戳文件名                                      |
| `CanActivateService` | `core/canActivate/can-activate.service.ts` | `providedIn: 'root'` + providers | 路由守卫：校验 token 有效性与 menuList 白名单，无效时触发 SSO 登录                                           |
| `DefaultInterceptor` | `core/net/default.interceptor.ts`          | `HTTP_INTERCEPTORS`              | HTTP 拦截器：注入 token 头、统一处理 401/403                                                                 |
| `I18NService`        | `core/i18n/i18n.service.ts`                | `ALAIN_I18N_TOKEN`               | 国际化服务（当前多语言逻辑基本被注释）                                                                       |

> 另有 @delon/theme 内置的 `_HttpClient`、`SettingsService`、`TitleService`、`MenuService`，及 @delon/auth 的 `ITokenService`（`DA_SERVICE_TOKEN`）被广泛使用。
