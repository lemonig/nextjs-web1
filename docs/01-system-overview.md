# 01 · 系统功能介绍 / System Overview

> 项目名称 / Project：**杭开环境报价系统（报价系统平台）** · HK Environment Quotation System
> 技术栈 / Stack：Angular 8.2 + ng-alain 8.8.0 + ng-zorro-antd 8.5 + @delon 8.8
> 说明 / Note：本文档为源码静态分析结果，未修改任何代码。Static analysis only; no code was modified.

---

## 1. 系统功能介绍 / System Overview

**中文**

本系统是基于 ng-alain（ng-zorro-antd）脚手架的后台管理系统，核心业务为**产品报价单管理**。系统面向内部销售/管理人员，通过企业统一身份（SSO / EHR）登录，提供三大功能模块：

- **报价管理（Quotation）**：创建、编辑、复制、删除报价单；管理报价单明细（产品明细行）；导出报价清单 Excel；批量更新报价单内产品价格。
- **产品管理（Product）**：按产品分类维护产品库；产品增删改查、Excel 模板导入导出；按分类动态渲染扩展字段。
- **用户管理（User）**：从 EHR 拉取员工列表，添加/编辑系统用户并分配角色，删除用户。

系统启动时通过 URL `ticket` 参数完成 SSO 换 token，随后拉取当前用户信息（`/api/user/owner`）并根据角色 `role` 生成可访问菜单白名单。

**English**

An ng-alain (ng-zorro-antd) based admin system whose core business is **product quotation management**. It targets internal sales/admin staff, authenticates via enterprise SSO (EHR), and provides three main modules:

- **Quotation**: create / edit / copy / delete quotations; manage quotation detail lines; export quotation Excel; batch-update product prices.
- **Product**: maintain a product catalog by category with CRUD, Excel import/export, and category-driven dynamic fields.
- **User**: pull staff from EHR, create/update system users with role assignment, delete users.

On startup the app exchanges the URL `ticket` for a token via SSO, then loads the current user (`/api/user/owner`) and builds a route whitelist based on `role`.

---

## 附录：技术栈 / Tech Stack

| 类别                              | 依赖                                                                                         | 是否实际使用（源码验证）                                  |
| --------------------------------- | -------------------------------------------------------------------------------------------- | --------------------------------------------------------- |
| 框架 Framework                    | Angular 8.2.11                                                                               | 是                                                        |
| 脚手架 Scaffold                   | ng-alain 8.8.0                                                                               | 是                                                        |
| UI 组件库                         | ng-zorro-antd 8.5.2                                                                          | 是（`NgZorroAntdModule`）                                 |
| @delon/theme                      | `_HttpClient`/`SettingsService`/`TitleService`/`MenuService`/`AlainThemeModule`              | 是（核心）                                                |
| @delon/auth                       | `ITokenService`/`DA_SERVICE_TOKEN`/`TokenService`                                            | 是（token 存储）                                          |
| @delon/acl                        | `DelonACLModule`（`delon.module.ts` forRoot）；`ACLGuard`（import 但**未挂载路由**，死引用） | 部分（模块加载，Guard 未用）                              |
| @delon/mock                       | `DelonMockModule`，非生产环境加载 `_mock/*`（脚手架示例数据）                                | 是（仅 dev）                                              |
| @angular/cdk                      | `DragDropModule`（`SharedModule` 导入，模板中**无 cdkDrag 使用**）                           | 否（仅导入未用）                                          |
| screenfull                        | `HeaderFullScreenComponent` 网页全屏                                                         | 是                                                        |
| moment                            | 日期格式化（报价/Excel 文件名）                                                              | 是                                                        |
| rxjs 6.4                          | Observable/operators                                                                         | 是                                                        |
| @ngx-translate/core + http-loader | `I18NService`/`TranslateModule`                                                              | 加载但业务多语言逻辑基本注释                              |
| file-saver                        | package.json 声明                                                                            | **否（源码无 import）**                                   |
| xlsx                              | package.json 声明                                                                            | **否（导出走 ExcelService arraybuffer，无 xlsx import）** |
| ngx-tinymce / ngx-ueditor         | package.json 声明                                                                            | **否（源码无 import）**                                   |

> 迁移提示：`file-saver`、`xlsx`、`ngx-tinymce`、`ngx-ueditor`、`@delon/cache`、`@delon/chart`、`@delon/form`、`@delon/abc` 均在 package.json 中，但业务源码 **未实际 import 使用**，迁移时可忽略。`@angular/cdk/drag-drop` 与 `ACLGuard` 为无效引用。

---

## 附录：目录结构 / Directory Structure

```
src/app/
├── app.module.ts / app.component.ts / delon.module.ts
├── core/                     核心服务（单例）
│   ├── canActivate/          路由守卫
│   ├── excel/                Excel 下载
│   ├── i18n/                 国际化
│   ├── net/                  HTTP 拦截器
│   └── startup/              启动初始化
├── layout/                   布局层
│   ├── default/ (header/)    主布局 + 头部
│   ├── fullscreen/           全屏布局
│   └── passport/             登录布局
├── routes/                   业务路由页
│   ├── ticket/               报价管理 /order
│   ├── device/               产品管理 /device
│   ├── salesman/             用户管理 /user
│   ├── passport/login/       登录页
│   └── error-page/           403 页
└── shared/                   公共组件/指令/模块
    ├── device-tree/          产品分类树
    └── setting-menu/         设置菜单
```

---

## 附录：环境与代理 / Environment & Proxy

- `environment.ts`：`useHash: true`，`production: false`，`SERVER_URL: './'`。
- `proxy.conf.json`：`/api/*` -> `http://192.168.188.110:8080`（`secure: false`）。
- 启动命令：`npm start`（端口 4249，带 proxy）。

---

## 附录：已知问题 / Known Issues（静态观察）

- `user.component.ts:117` `api/user/${id}` 使用普通字符串未插值，`${id}` 为字面量，疑似 bug。
- `header.component.ts` 中 `getUserMsg` 依赖 localStorage `user`，而 startup 写入的是 `SettingsService.setUser`，键名一致性需注意。
- 多处业务代码含大量注释掉的历史逻辑（i18n、setting、menu 等）。
- 全项目无强类型 Model，维护性与类型安全性较弱。
