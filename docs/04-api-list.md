# 04 · 接口 API / API List

> 后端代理：所有 `/api/*` 请求经 `proxy.conf.json` 转发至 `http://192.168.188.110:8080`。
> 统一约定：请求头注入 `token`；响应含 `success`/`code`/`data`/`message` 字段。免鉴权：`api/sso/getSsoAuthUrl`、`api/sso/doLoginByTicket`、`assets/*`。

---

## 1. SSO / 单点登录

| 方法 | 路径                      | 所在文件:行                                             | 用途                     |
| ---- | ------------------------- | ------------------------------------------------------- | ------------------------ |
| POST | `api/sso/doLoginByTicket` | `core/startup/startup.service.ts:145`                   | ticket 换取 access_token |
| POST | `api/sso/getSsoAuthUrl`   | `core/canActivate/can-activate.service.ts:44`           | 获取 SSO 授权地址        |
| POST | `api/sso/logout`          | `layout/default/header/components/user.component.ts:48` | 退出登录                 |

## 2. User / 用户

| 方法 | 路径                    | 所在文件:行                                               | 用途                                           |
| ---- | ----------------------- | --------------------------------------------------------- | ---------------------------------------------- |
| GET  | `/api/user/owner`       | `core/startup/startup.service.ts:108`                     | 获取当前登录用户信息与角色                     |
| GET  | `/api/user/list`        | `ticket-list.component.ts:61`；`salesman.component.ts:75` | 用户列表                                       |
| GET  | `/api/user/ehr`         | `salesman.component.ts:51`                                | 拉取 EHR 员工列表（可选人）                    |
| POST | `/api/user/add`         | `salesman.component.ts:143`                               | 新增系统用户                                   |
| POST | `/api/user/update`      | `salesman.component.ts:155`                               | 更新用户（角色）                               |
| POST | `/api/user/delete`      | `salesman.component.ts:290`                               | 删除用户                                       |
| POST | `api/user/updatepwd`    | `user.component.ts:90`                                    | 修改密码                                       |
| POST | `api/user/profile/save` | `user.component.ts:141`                                   | 保存个人信息                                   |
| POST | `api/user/${id}`        | `user.component.ts:117`                                   | 获取个人信息（注：模板字符串未插值，疑似 bug） |

## 3. Quotation / 报价单

| 方法 | 路径                    | 所在文件:行                                   | 用途                       |
| ---- | ----------------------- | --------------------------------------------- | -------------------------- |
| POST | `/api/quotation/list`   | `ticket-list.component.ts:164`                | 报价单列表（keyword 查询） |
| POST | `api/quotation/detail`  | `ticket-list.component.ts:249`                | 报价单详情                 |
| POST | `/api/quotation/insert` | `ticket-list.component.ts:301`                | 新增报价单                 |
| POST | `/api/quotation/update` | `ticket-list.component.ts:314`                | 更新报价单                 |
| POST | `/api/quotation/delete` | `ticket-list.component.ts:334`                | 删除报价单                 |
| POST | `/api/quotation/copy`   | `ticket-list.component.ts:89`                 | 复制报价单                 |
| POST | `/api/quotation/export` | `ticket-list.component.ts:356` (ExcelService) | 导出报价清单 Excel         |

## 4. Quotation Detail / 报价单明细

| 方法 | 路径                                      | 所在文件:行                          | 用途                 |
| ---- | ----------------------------------------- | ------------------------------------ | -------------------- |
| POST | `/api/quotation/detail/list`              | `ticket-list.component.ts:432`       | 报价单明细行列表     |
| POST | `/api/quotation/detail/insert`            | `ticket-list.component.ts:469`,`628` | 新增明细行           |
| POST | `/api/quotation/detail/update`            | `ticket-list.component.ts:481`,`641` | 更新明细行           |
| POST | `/api/quotation/detail/delete`            | `ticket-list.component.ts:520`       | 删除明细行           |
| POST | `/api/quotation/detail/list/price/update` | `ticket-list.component.ts:708`       | 批量更新明细产品价格 |

## 5. Product / 产品

| 方法 | 路径                    | 所在文件:行                                                      | 用途               |
| ---- | ----------------------- | ---------------------------------------------------------------- | ------------------ |
| POST | `/api/product/list`     | `device-factory.component.ts:69`；`ticket-list.component.ts:561` | 产品列表           |
| POST | `/api/product/detail`   | `device-factory.component.ts:211`                                | 产品详情           |
| POST | `/api/product/insert`   | `device-factory.component.ts:136`                                | 新增产品           |
| POST | `/api/product/update`   | `device-factory.component.ts:148`                                | 更新产品           |
| POST | `/api/product/delete`   | `device-factory.component.ts:166`                                | 删除产品           |
| POST | `/api/product/import`   | `device-factory.component.ts:194`                                | Excel 导入产品     |
| POST | `/api/product/export`   | `device-factory.component.ts:185` (ExcelService)                 | 导出产品模板 Excel |
| POST | `/api/product/category` | `device-tree.component.ts:41`                                    | 产品分类树         |

## 6. 其他 / Others

| 方法 | 路径                            | 所在文件:行                    | 用途                     |
| ---- | ------------------------------- | ------------------------------ | ------------------------ |
| POST | `/api/oa/project/load`          | `ticket-list.component.ts:116` | 加载 OA 项目（工单关联） |
| POST | `api/station/camera/decrypt`    | `ticket-list.component.ts:502` | 设备解密                 |
| POST | `api/upload/evidence`           | `ticket-list.component.ts:662` | 上传附件/图片            |
| POST | `api/CompanyAfterSale/update`   | `salesman.component.ts:191`    | 更新售后信息             |
| POST | `api/setting/list`              | `header.component.ts:46`       | 系统 Logo/名称（已注释） |
| GET  | `api/setting/system/base/logos` | `passport.component.ts:24`     | 登录页页脚信息（已注释） |
| GET  | `assets/tmp/app-data.json`      | `startup.service.ts:50`        | 应用基础配置（本地静态） |
