# 02 · 页面结构 / Page List

> 关联文档：路由跳转见 `03-routing.md`，组件见 `05-components.md`。

---

## 页面结构 / Page Structure

系统采用 ng-alain 经典分层：**布局层（Layout）** + **业务路由页（Routes）**。

### 1. 布局组件 / Layout Components

| 布局 Layout | 选择器 Selector     | 文件 File                                                  | 用途 Purpose                                |
| ----------- | ------------------- | ---------------------------------------------------------- | ------------------------------------------- |
| 默认主布局  | `layout-default`    | `layout/default/default.component.ts`                      | 登录后主框架：头部 + `router-outlet` + 页脚 |
| 登录布局    | `layout-passport`   | `layout/passport/passport.component.ts`                    | passport 页面外壳                           |
| 全屏布局    | _(fullscreen)_      | `layout/fullscreen/fullscreen.component.ts`                | 全屏页面外壳（当前路由未挂载）              |
| 头部        | `layout-header`     | `layout/default/header/header.component.ts`                | 顶部 Logo + 菜单栏                          |
| 用户菜单    | `header-user`       | `layout/default/header/components/user.component.ts`       | 头像/退出/改密/个人信息                     |
| 全屏按钮    | `header-fullscreen` | `layout/default/header/components/fullscreen.component.ts` | 网页全屏切换                                |

主布局模板（`default.component.html`）：

```
<layout-header>            顶部头部（菜单）
<section .content>
  <router-outlet>          业务页面出口
<div .content_footer>      页脚（systemBelong 存在时显示）
```

### 2. 业务页面 / Feature Pages

| 页面 Page    | 组件 Component           | 路径 Route        | 所属模块 Module            |
| ------------ | ------------------------ | ----------------- | -------------------------- |
| 报价管理列表 | `TicketListComponent`    | `/order`          | `TicketModule`（懒加载）   |
| 产品管理     | `DeviceFactoryComponent` | `/device`         | `DeviceModule`（懒加载）   |
| 用户管理     | `SalesmanComponent`      | `/user`           | `SalesmanModule`（懒加载） |
| 登录         | `UserLoginComponent`     | `/passport/login` | `RoutesModule`             |
| 无权限 403   | `ErrorPageComponent`     | `/403`            | `RoutesModule`             |

> 说明：`/order`、`/device`、`/user` 三个特性模块均为**懒加载（loadChildren）**，各自只含一个默认路由组件。

### 3. 根组件 / Root Component（补充）

| 组件 Component | 选择器 Selector | 文件 File          | 说明 Description                                                                                             |
| -------------- | --------------- | ------------------ | ------------------------------------------------------------------------------------------------------------ |
| `AppComponent` | `app-root`      | `app.component.ts` | 应用根，模板仅 `<router-outlet>`；`NavigationEnd` 时 `TitleService.setTitle()` + `NzModalService.closeAll()` |

> 迁移映射：Next.js 中对应根 `app/layout.tsx`（全局壳）。路由切换时关闭所有弹窗、刷新标题的逻辑需在 App Router 的导航事件（如 `usePathname` effect）中重建。

### 4. 登录页说明 / Login Page Note（补充）

- `UserLoginComponent`（`/passport/login`）模板当前**仅为占位**：`login.component.html` 只有 `<h1>登录ing</h1>`，登录表单（`loginForm`：account/password）在 TS 中定义但模板未渲染、无提交逻辑。
- 实际登录走 **SSO 跳转**（见 `08-auth.md`），此页面仅作为 SSO 回跳/失效落地占位。
- 迁移提示：Next.js 中可保留一个 `/passport/login` 占位页或直接实现 SSO 重定向落地页。
