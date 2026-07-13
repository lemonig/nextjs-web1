# 03 · 页面跳转关系 / Routing

> 关联文档：菜单见本文件与 `05-components.md`；数据流见 `10-data-flow.md`；权限见 `09-permission.md`。

---

## 页面跳转关系 / Navigation Flow

### 1. 根路由表 / Root Routes（`routes-routing.module.ts`）

```
''  (LayoutDefaultComponent)
 ├── ''        → redirectTo '/order'          默认跳转到报价管理
 ├── 'order'   → TicketModule   (懒加载)       报价管理
 ├── 'device'  → DeviceModule   (懒加载)       产品管理
 └── 'user'    → SalesmanModule (懒加载)       用户管理
'403'          → ErrorPageComponent           无权限页
'passport'     (LayoutPassportComponent) [CanActivate]
 └── 'login'   → UserLoginComponent           登录页
```

路由配置：`useHash: true`（Hash 模式），`scrollPositionRestoration: 'top'`。

### 2. 跳转关系图 / Flow Diagram

```
                     进入应用 App entry
                          |
            startup.getTicket()  URL 带 ticket?
                          | 是 -> SSO 换 token -> 保存 token
                          v
              startup.getUserMsg()  GET /api/user/owner
                          | 按 role 生成 menuList 白名单
                          v
                  重定向 -> /order (报价管理)
                          |
      +-------------------+-------------------+
   Header 菜单点击 goUrl() -> router.navigateByUrl
      v                   v                   v
   /order             /device              /user
  报价管理             产品管理             用户管理
  (全员)             (role 1/4)          (role 4)

 HTTP 拦截器 DefaultInterceptor 统一处理：
   body.code == 401 -> 清 token -> 跳 /passport/login
   body.code == 403 -> 跳 /403

 路由守卫 CanActivateService（每个特性页 canActivate）：
   token 无效 -> SSO 授权地址重定向 (getSsoAuthUrl -> serverAuthUrl)
   state.url 不在 menuList 白名单 -> 提示"菜单访问受限!" 拒绝进入
```

### 3. 页内跳转 / In-page Navigation

- **报价页 `/order`**：列表 <-> 新增/编辑抽屉 <-> 报价明细页（`showCameraPage`）<-> 产品选择弹层，均为组件内 `*ngIf` 状态切换，非路由跳转。
- **产品页 `/device`**：左侧 `app-device-tree` 选择分类 -> 右侧列表刷新 -> 新增/编辑弹层。
- **退出登录**：`header-user` -> `POST api/sso/logout` -> 清空缓存 -> `location.href = origin`。

---

## 菜单 / Menus

> 重要说明：本系统**未使用** ng-alain 的 `MenuService`（`startup.service.ts` 中相关代码已注释）。顶部菜单在 `header.component.html` 中**硬编码**，可见性由用户 `role` 控制。

### 1. 顶部主菜单 / Top Menu（`header.component.html`）

| 菜单项 Menu            | 图标 Icon   | 目标路由 Route | 可见条件 Visible When              |
| ---------------------- | ----------- | -------------- | ---------------------------------- |
| 报价管理 Quotation     | `list`      | `/order`       | 所有用户 all users                 |
| 产品管理 Product       | `manage`    | `/device`      | `userType == 1 \|\| userType == 4` |
| 用户管理 User          | `operation` | `/user`        | `userType == 4`                    |
| 全屏 Fullscreen        | -           | -              | 所有用户                           |
| 用户菜单 User Dropdown | -           | -              | 所有用户                           |

菜单高亮：`activeUrl.split('/')[1]` 与模块名比较（`order` / `device` / `user`）。

### 2. 用户下拉菜单 / User Dropdown（`user.component.html`）

| 菜单项              | 动作 Action    | 状态 State           |
| ------------------- | -------------- | -------------------- |
| 退出 Logout         | `logout()`     | 启用 enabled         |
| 个人信息 Profile    | `modifyInfo()` | 已注释 commented out |
| 修改密码 Change Pwd | `modifyPwd()`  | 已注释 commented out |
