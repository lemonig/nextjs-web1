# 08 · 认证 / Auth

> 关联文档：权限（角色/白名单/守卫）见 `09-permission.md`；数据流见 `10-data-flow.md`；接口见 `04-api-list.md`。

---

## 认证流程 / Authentication

1. 应用启动 `StartupService.getTicket()`：解析 URL `ticket` 参数，`POST api/sso/doLoginByTicket` 换取 `access_token`，存入 `@delon/auth` 的 `TokenService`。
2. `getUserMsg()`：`GET /api/user/owner` 获取用户信息，写入 `SettingsService` 与 localStorage。
3. Token 通过 `DefaultInterceptor` 注入到每个请求的 `token` 头。
4. 未登录/失效：`CanActivateService.ssoLogin()` -> `POST api/sso/getSsoAuthUrl` -> 跳转 `serverAuthUrl`。

---

## HTTP 层拦截 / Interceptor

`DefaultInterceptor`：

- 免鉴权白名单：`api/sso/getSsoAuthUrl`、`api/sso/doLoginByTicket`、`assets/*`。
- 其余请求无 token 时直接 `of()` 中断。
- 响应 `body.code == 401` -> 清 token/localStorage -> 跳 `/passport/login`。
- 响应 `body.code == 403` -> 跳 `/403`。

---

## 相关接口 / Related APIs

| 方法 | 路径                      | 所在文件:行                                             | 用途                     |
| ---- | ------------------------- | ------------------------------------------------------- | ------------------------ |
| POST | `api/sso/doLoginByTicket` | `core/startup/startup.service.ts:145`                   | ticket 换取 access_token |
| POST | `api/sso/getSsoAuthUrl`   | `core/canActivate/can-activate.service.ts:44`           | 获取 SSO 授权地址        |
| POST | `api/sso/logout`          | `layout/default/header/components/user.component.ts:48` | 退出登录                 |
