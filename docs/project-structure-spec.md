# HK Quotation Next 项目结构规范（Project Structure Specification）

> 本规范作为整个项目唯一的目录组织规范。
>
> 后续所有 AI Agent（OpenCode、Cursor、Codex 等）生成代码时必须遵守本规范。
>
> 技术栈：
>
> * Next.js 16（App Router）
> * React 19
> * TypeScript
> * Ant Design 6
> * Redux Toolkit
> * Axios
> * Java Spring Boot Backend

---

# 一、设计原则

项目遵循以下原则：

* Feature First
* App Router First
* Server Component 优先
* Client Component 按需使用
* 业务逻辑与页面分离
* 强类型（禁止 any）
* 高内聚、低耦合
* 易于 AI Agent 持续开发

---

# 二、推荐目录结构

```text
app/
components/
features/
services/
store/
hooks/
lib/
types/
utils/
public/
docs/
```

说明：

| 目录         | 职责                         |
| ---------- | -------------------------- |
| app        | Next.js App Router，仅负责路由入口 |
| components | 公共组件                       |
| features   | 业务模块                       |
| services   | 接口调用                       |
| store      | Redux Toolkit              |
| hooks      | 公共 Hooks                   |
| lib        | 基础设施                       |
| types      | TypeScript 类型              |
| utils      | 工具函数                       |
| public     | 静态资源                       |
| docs       | 项目文档                       |

---

# 三、App Router

采用 Route Group。

```text
app/

    (public)/

        login/

        page.tsx

    (protected)/

        users/

        orders/

        products/

    api/

    layout.tsx

    providers.tsx

    globals.css
```

说明：

## (public)

无需登录即可访问。

例如：

* Login
* SSO
* 403
* 404

## (protected)

所有需要登录的页面。

统一经过 middleware 鉴权。

---

# 四、Layout

Root Layout：

负责：

* html
* body
* 全局 CSS
* Providers

(public)/layout：

负责：

* 登录布局

(protected)/layout：

负责：

* AdminLayout

禁止：

* 编写业务逻辑
* 请求接口

---

# 五、Page

page.tsx 仅作为页面入口。

例如：

```tsx
export default function Page() {
    return <UserPage />;
}
```

禁止：

* 编写大量 JSX
* 编写复杂业务逻辑
* 请求多个接口

---

# 六、Feature First

每一个业务对应一个 Feature。

例如：

```text
features/

    users/

        UserPage.tsx

        components/

        hooks/

        utils/

    products/

    quotation/
```

Feature 内包含：

* 页面组件
* 局部组件
* hooks
* 工具函数

禁止：

Feature 之间互相依赖。

---

# 七、Components

components 仅存放公共组件。

推荐：

```text
components/

    common/

    layout/

    form/

    table/
```

例如：

* DataTable
* SearchForm
* ConfirmButton
* Upload
* DeviceTree

禁止：

将业务组件放入 components。

---

# 八、Services

所有 HTTP 请求统一放入 services。

例如：

```text
services/

    auth.ts

    user.ts

    quotation.ts

    product.ts
```

要求：

* 一个业务一个 Service
* 使用 Axios
* 不使用 Angular 风格 *.service.ts 命名

禁止：

在页面中直接调用 axios。

---

# 九、Store

统一使用 Redux Toolkit。

目录：

```text
store/

    index.ts

    hooks.ts

    provider.tsx

    slices/

        authSlice.ts

        userSlice.ts

        permissionSlice.ts

        appSlice.ts
```

Redux 仅保存：

* Token
* 用户信息
* 权限
* 菜单
* 系统配置

页面状态：

统一使用 useState。

禁止：

将分页、表单、弹窗状态放入 Redux。

---

# 十、Hooks

公共 Hook 放入：

```text
hooks/

    useRequest.ts

    useTableHeight.ts

    useTableScroll.ts
```

Feature 内部 Hook：

放入：

```text
features/users/hooks/
```

禁止：

跨 Feature 引用 Hook。

---

# 十一、Types

所有类型统一管理。

例如：

```text
types/

    user.ts

    quotation.ts

    product.ts
```

要求：

所有接口返回值必须声明 TypeScript 类型。

禁止：

使用 any。

---

# 十二、Utils

工具函数统一放入：

```text
utils/

    date.ts

    download.ts

    tree.ts

    number.ts
```

禁止：

Utils 中依赖 React。

---

# 十三、Lib

lib 仅存放基础设施。

推荐：

```text
lib/

    auth/

    http/
```

例如：

* request.ts
* interceptor.ts
* token.ts

禁止：

放业务代码。

---

# 十四、Middleware

middleware 仅负责：

* Token 校验
* 登录跳转
* 白名单
* 路由保护

禁止：

* 查询接口
* 获取菜单
* 获取权限数据

---

# 十五、开发规范

所有 AI Agent 必须遵守：

1. App Router 下 page.tsx 不编写业务逻辑。
2. 一个页面对应一个 Feature。
3. 所有接口统一放入 services。
4. 所有公共组件放 components。
5. Redux 仅保存全局状态。
6. 页面状态优先使用 useState。
7. 禁止使用 any。
8. 禁止跨 Feature 直接依赖。
9. 所有代码使用 TypeScript。
10. 所有新增代码必须符合本规范。

---

# 十六、迁移原则

Angular → Next.js 迁移时：

* 保留业务逻辑。
* 保留接口协议。
* 不保留 Angular 的目录结构。
* 不保留 Angular 的命名习惯。
* 使用符合 React 社区最佳实践的组织方式。
* 优先复用公共组件。
* 每迁移一个页面必须保证可以独立运行。
