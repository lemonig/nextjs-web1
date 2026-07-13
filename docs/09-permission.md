# 09 · 权限体系 / Permission

> 关联文档：认证流程见 `08-auth.md`；菜单见 `03-routing.md`。

---

## 角色与菜单白名单 / Roles & Menu Whitelist

`StartupService.getUserMsg()` 根据 `res.data.role` 生成 `menuList` 白名单并存入 localStorage：

| role | 角色含义（推断）  | 生成的 menuList 白名单                          | 可见顶部菜单                 |
| ---- | ----------------- | ----------------------------------------------- | ---------------------------- |
| 1    | 管理员/产品管理者 | `/passport/login`, `/device`, `/order`          | 报价管理、产品管理           |
| 2    | 普通用户          | `/passport/login`, `/order`                     | 报价管理                     |
| 3    | 普通用户          | `/passport/login`, `/order`                     | 报价管理                     |
| 4    | 超级管理员        | `/passport/login`, `/order`, `/user`, `/device` | 报价管理、产品管理、用户管理 |

> 注：菜单可见性（Header）与路由准入（Guard）两套逻辑分别独立控制，需保持一致。

---

## 路由准入 / Route Guard

`CanActivateService.canActivate()`（挂载于每个特性页与 `/passport`）：

1. 若 token 为对象（异常态）-> 判定登录失效 -> `ssoLogin()`。
2. 读取 localStorage `menuList`。
3. 若 `state.url` 在白名单中 -> 放行 `return true`。
4. 否则弹出 `菜单访问受限!` -> `return false`。
