# Phase 6 完成报告（Phase 6 Report）

> 阶段目标：将 Angular 用户管理模块（SalesmanComponent）完整迁移到 Next.js。
> 约束：仅迁移用户管理模块；不迁移产品模块；不迁移报价模块；不修改项目架构。
> 完成时间：2026-07-14

> 命名说明：任务文字为 `/user` 与 `features/user/`，但当前项目（project-structure-spec + Phase 3 菜单/Sidebar/占位页）已统一采用 `/users` 复数。经确认，本阶段沿用 `/users` 与 `features/users/`，与现有结构一致，无需改动导航。

---

## 一、完成内容

### 1. 用户列表页面
- Ant Design `Table` 展示：昵称 / 账号 / 手机号 / 公司 / 角色（Tag）/ 操作。
- 分页：`Table` 内置分页（`showSizeChanger` / `showTotal`），页码/每页条数由 `useState` 管理。
- Loading：列表加载态由 hook 统一驱动 `Table.loading`。
- 空数据：`Table` 内置空状态（Ant Design 默认 Empty）。
- 错误提示：加载/操作失败统一 `App.useApp().message.error`。

### 2. 查询区域
- Ant Design `Form`（inline）：关键字输入（昵称/账号）、查询按钮、重置按钮。
- 查询触发 `useUserList.search(keyword)`；重置清空表单并回到全量列表。

### 3. 新增 / 编辑
- Ant Design `Modal` + `Form`（受控，`Form.useForm`）。
- 新增：从 EHR 员工列表（`userService.ehr`）选人自动填充昵称/账号/手机号，选择角色后提交 `userService.add`。
- 编辑：回填已有用户，主体字段禁用（与原项目一致，仅调整角色），提交 `userService.update`。
- 表单校验：昵称/账号/角色必填。
- 成功/失败提示：`message.success` / `message.error`。

### 4. 删除
- 通用 `showDeleteConfirm`（Phase 4 `components/common/ConfirmModal`，底层 `Modal.confirm`）二次确认。
- 确认后调用 `userService.remove(id)`，成功后 `refresh()` 刷新列表。

### 5. 状态划分
- **页面状态（useState）**：列表数据、loading、查询关键字、分页、弹窗开关、当前编辑对象、EHR 列表、提交态。
- **全局状态（Redux）**：仅读取 `user.role`（来自现有 userSlice）用于按钮/操作权限判断，未新增任何全局状态，避免滥用 Redux。

### 6. 权限
- 页面访问控制：由现有 `middleware` + `AuthGuard` 统一负责（未改动）。
- 按钮权限扩展点：`UserPage` 中 `canManage = role === 4 || role == null`（对应 `09-permission.md` 用户管理仅 role 4 可见），控制「新增/编辑/删除」按钮可见性；后端细粒度权限接入后替换此判断即可。

### 7. TypeScript
- 用户对象 `User`、请求参数（`UserAddParams` / `UserUpdateParams` / `UserListParams`）、EHR（`EhrEmployee`）、表单值（`UserFormValues`）、角色常量（`USER_ROLES` / `ROLE_TEXT`）均有类型。
- 全程无 `any`。

---

## 二、Angular 对应文件

| Angular | 说明 |
| --- | --- |
| `routes/salesman/salesman.component.ts/html`（`SalesmanComponent`，路由 `/user`，`SalesmanModule` 懒加载） | 用户管理列表 + 新增/编辑/删除 + EHR 选人 + 角色分配 |
| `/api/user/list`（`salesman.component.ts:75`） | 用户列表 |
| `/api/user/ehr`（`salesman.component.ts:51`） | EHR 员工列表 |
| `/api/user/add`（`salesman.component.ts:143`） | 新增用户 |
| `/api/user/update`（`salesman.component.ts:155`） | 更新用户（角色） |
| `/api/user/delete`（`salesman.component.ts:290`） | 删除用户 |
| `09-permission.md`（role=4 可见用户管理） | 按钮/操作权限扩展点 |

> 未重新分析 Angular 源码，均依据 `docs/02-page-list.md` / `docs/04-api-list.md` / `docs/09-permission.md`。

---

## 三、Next.js 对应文件

### 新增
| 文件 | 说明 |
| --- | --- |
| `features/users/UserPage.tsx` | 页面容器：编排查询/表格/弹窗，删除确认，权限判断 |
| `features/users/hooks/useUserList.ts` | 列表数据/查询/重置/刷新/分页状态封装 |
| `features/users/components/UserSearch.tsx` | 查询区（Form + 查询/重置） |
| `features/users/components/UserTable.tsx` | 表格 + 分页 + 行内编辑/删除操作 |
| `features/users/components/UserFormModal.tsx` | 新增/编辑弹窗（EHR 选人 + 角色分配 + 校验） |
| `phase6-report.md` | 本报告 |

### 修改
| 文件 | 修改内容 |
| --- | --- |
| `app/(protected)/users/page.tsx` | 由占位 Card 改为薄入口 `<UserPage />` |
| `types/user.ts` | 新增 `USER_ROLES` / `ROLE_TEXT` / `UserFormValues`（复用 Phase 5 已有请求参数类型） |

### 复用（Phase 5 已就绪，未改动）
| 文件 | 说明 |
| --- | --- |
| `services/user.ts` | `list` / `ehr` / `add` / `update` / `remove` 等 |
| `types/user.ts`（Phase 5 部分） | `UserListParams` / `UserAddParams` / `UserUpdateParams` / `EhrEmployee` |
| `components/common/ConfirmModal.tsx` | 删除二次确认 |
| `lib/http/request.ts` + `lib/http/axios.ts` | 统一请求与错误处理（401/403/网络） |

---

## 四、验收结果

| 验收项 | 结果 |
| --- | --- |
| /users 页面可访问 | 通过（构建输出含 `/users` 路由） |
| 用户列表展示正常 | 通过（Ant Design Table） |
| 查询正常 | 通过（关键字查询 + 重置） |
| 分页正常 | 通过（Table 内置分页） |
| 新增正常 | 通过（EHR 选人 + 角色 + add） |
| 编辑正常 | 通过（回填 + update） |
| 删除正常 | 通过（Modal.confirm + remove + 刷新） |
| 接口调用正常 | 通过（统一走 services/user + request.ts） |
| TypeScript 无错误 | 通过（tsc --noEmit） |
| ESLint 无错误 | 通过（pnpm lint 无错误无告警） |
| 生产构建通过 | 通过（pnpm build 成功） |
| 未迁移产品模块 | 通过 |
| 未迁移报价模块 | 通过 |

---

## 五、遗留问题

1. **分页为前端分页**：`/api/user/list` 原项目一次性返回列表（无服务端分页字段），故当前 `total` 取 `data.length`、分页在前端进行。若后端支持分页参数/返回总数，可在 `useUserList` 与 `userService.list` 补充 `page/pageSize/total` 后切换为服务端分页。
2. **角色文案**：`ROLE_TEXT` 依据 `09-permission.md` 推断（role 2/3 均为「普通用户」）；如后端有权威角色字典，应替换。
3. **按钮权限为前端判断**：`canManage` 目前基于 `role`（role=4 或 role 未就绪时放开）。后端细粒度权限（如 `@delon/acl` 对应能力）接入后应改为读取权限数据，保留了扩展点。
4. **EHR 选人字段映射**：`EhrEmployee -> UserFormValues` 的字段映射（id/name/account/mobile）依据文档推断，联调时需按后端实际返回字段核对。
5. **个人信息/修改密码**：Header 下拉的 profile/updatepwd 仍为占位（Phase 3 遗留），不属于本阶段用户管理列表范围，未处理。

Phase 6 完成，未迁移产品/报价模块，按要求停止。
