# Phase 5 完成报告（Phase 5 Report）

> 阶段目标：迁移 Angular 项目中所有 Service，完成 API 层。
> 约束：仅完成 API 层；不迁移任何业务页面；不实现 CRUD 页面；不修改后端协议与项目架构。
> 完成时间：2026-07-14

---

## 一、Service 迁移清单

依据 `docs/04-api-list.md`（未重新分析源码），全部 Service 迁移到 `services/`，统一通过 `lib/http/request.ts` 调用，返回强类型 `Promise<T>`。

| Service 文件 | 领域 | 方法 |
| --- | --- | --- |
| `services/auth.ts` | SSO / 认证 | getSsoLoginUrl / doLoginByTicket / getCurrentUser / logout |
| `services/user.ts` | 用户 | getOwner / list / ehr / add / update / remove / updatePwd / profileSave / getProfile |
| `services/quotation.ts` | 报价单 | list / detail / insert / update / remove / copy / export |
| `services/quotationDetail.ts` | 报价明细 | list / insert / update / remove / batchUpdatePrice |
| `services/product.ts` | 产品 | list / detail / insert / update / remove / import / export / category |
| `services/common.ts` | 其他 | loadOaProject / decryptCamera / uploadEvidence / afterSaleUpdate |

---

## 二、接口兼容对照（URL / 方法 / 参数不变）

| 领域 | Angular 路径 | 方法 | Next.js 调用 |
| --- | --- | --- | --- |
| SSO | api/sso/doLoginByTicket | POST | authService.doLoginByTicket（判 code === 200 取 access_token） |
| SSO | api/sso/getSsoAuthUrl | POST | authService.getSsoLoginUrl |
| SSO | api/sso/logout | POST | authService.logout |
| User | /api/user/owner | GET | userService.getOwner / authService.getCurrentUser |
| User | /api/user/list | GET | userService.list |
| User | /api/user/ehr | GET | userService.ehr |
| User | /api/user/add | POST | userService.add |
| User | /api/user/update | POST | userService.update |
| User | /api/user/delete | POST | userService.remove |
| User | api/user/updatepwd | POST | userService.updatePwd |
| User | api/user/profile/save | POST | userService.profileSave |
| User | api/user/${id} | POST | userService.getProfile（原模板未插值疑似 bug，按正确插值实现，见 docs/04 §28） |
| Quotation | /api/quotation/list | POST | quotationService.list |
| Quotation | api/quotation/detail | POST | quotationService.detail |
| Quotation | /api/quotation/insert | POST | quotationService.insert |
| Quotation | /api/quotation/update | POST | quotationService.update |
| Quotation | /api/quotation/delete | POST | quotationService.remove |
| Quotation | /api/quotation/copy | POST | quotationService.copy |
| Quotation | /api/quotation/export | POST | quotationService.export（Excel 下载） |
| QuotationDetail | /api/quotation/detail/list | POST | quotationDetailService.list |
| QuotationDetail | /api/quotation/detail/insert | POST | quotationDetailService.insert |
| QuotationDetail | /api/quotation/detail/update | POST | quotationDetailService.update |
| QuotationDetail | /api/quotation/detail/delete | POST | quotationDetailService.remove |
| QuotationDetail | /api/quotation/detail/list/price/update | POST | quotationDetailService.batchUpdatePrice |
| Product | /api/product/list | POST | productService.list |
| Product | /api/product/detail | POST | productService.detail |
| Product | /api/product/insert | POST | productService.insert |
| Product | /api/product/update | POST | productService.update |
| Product | /api/product/delete | POST | productService.remove |
| Product | /api/product/import | POST | productService.import（Excel 导入） |
| Product | /api/product/export | POST | productService.export（Excel 导出） |
| Product | /api/product/category | POST | productService.category |
| Other | /api/oa/project/load | POST | commonService.loadOaProject |
| Other | api/station/camera/decrypt | POST | commonService.decryptCamera |
| Other | api/upload/evidence | POST | commonService.uploadEvidence |
| Other | api/CompanyAfterSale/update | POST | commonService.afterSaleUpdate |

> 未迁移项（原项目已注释/静态资源，非业务 Service）：`api/setting/list`、`api/setting/system/base/logos`（均已注释）；`assets/tmp/app-data.json` 属静态配置，非 HTTP Service。

---

## 三、统一调用方式（不直接使用 axios）

- 所有 Service 只 import `@/lib/http/request` 的 `http`，无任何 Service 直接 import axios（已用 grep 验证）。
- `lib/http/request.ts` 本阶段扩展：
  - `http.get/post/put/delete<T>`：解包 `data.data`，`success===false` 自动 reject。
  - `http.postRaw/getRaw<T>`：返回完整 `ApiResponse<T>`，用于 `doLoginByTicket` 的 `code === 200` 特判（与原项目一致）。
  - `http.download(url, body, filename)`：Excel 导出，委托 `lib/excel/download.ts`（arraybuffer -> Blob，复刻 ExcelService）。
- `services/auth.ts` 由原先直接 import axios 实例改为使用 `http.postRaw`，消除重复 axios 引用。

---

## 四、错误处理（不在 Service 中重复处理）

- 401 / 403 / 网络错误：统一由 `lib/http/axios.ts` 响应拦截器处理（清 token 跳 `/login`、跳 `/403`、错误归一化）。
- `success === false`：统一在 `lib/http/request.ts` 包装层 reject。
- Service 层不含 try/catch 或错误提示逻辑，仅做 URL/参数/返回类型声明。

---

## 五、导入 / 导出 / 上传 / 下载

| 能力 | 实现 |
| --- | --- |
| Excel 导出（报价/产品） | quotationService.export / productService.export -> http.download -> lib/excel/download.ts |
| Excel 导入（产品） | productService.import（POST /api/product/import） |
| 文件上传（附件/图片） | commonService.uploadEvidence（POST api/upload/evidence） |
| 文件下载 | 复用 Phase 4 utils/download.ts 的 downloadBlob |

---

## 六、TypeScript 类型补充（`types/`）

| 文件 | 内容 |
| --- | --- |
| `types/api.ts` | 通用 PageQuery / PageResult<T> / IdParams |
| `types/user.ts` | EhrEmployee / UserListParams / UserAddParams / UserUpdateParams / UpdatePwdParams / ProfileSaveParams / UserProfile |
| `types/quotation.ts` | Quotation / QuotationAttachment / 报价明细类型 / 各请求参数类型 |
| `types/product.ts` | Product / ProductCategory / CategoryField / 各请求参数类型 |
| `types/common-api.ts` | OaProject / CameraDecryptParams/Result / UploadEvidenceResult / AfterSaleUpdateParams |
| `types/index.ts` | 统一 export * 汇总所有类型 |

> 类型依据 `docs/07-models.md` 逆向推断（原项目全 any）。动态扩展字段用 `[prop: string]: unknown` 兜底，未使用 any。

---

## 七、新增 / 修改文件

### 新增
| 文件 | 说明 |
| --- | --- |
| `services/user.ts` | 用户 Service |
| `services/quotation.ts` | 报价单 Service |
| `services/quotationDetail.ts` | 报价明细 Service |
| `services/product.ts` | 产品 Service |
| `services/common.ts` | 其他 Service |
| `types/api.ts` | 通用分页/响应类型 |
| `types/user.ts` | 用户领域类型 |
| `types/quotation.ts` | 报价领域类型 |
| `types/product.ts` | 产品领域类型 |
| `types/common-api.ts` | 其他接口类型 |
| `phase5-report.md` | 本报告 |

### 修改
| 文件 | 修改内容 |
| --- | --- |
| `lib/http/request.ts` | 新增 postRaw/getRaw（原样响应）与 download（Excel），供 Service 统一调用 |
| `services/auth.ts` | 去除直接 axios 引用，改用 http.postRaw 处理 doLoginByTicket |
| `services/index.ts` | 汇总导出全部 Service |
| `types/index.ts` | 汇总导出全部领域类型 |

---

## 八、验收结果

| 验收项 | 结果 |
| --- | --- |
| 所有 Service 已迁移 | 通过（auth/user/quotation/quotationDetail/product/common） |
| TypeScript 编译通过 | 通过（tsc --noEmit 无错误） |
| ESLint 无错误 | 通过（pnpm lint 无错误无告警） |
| 无重复 axios | 通过（services/ 无直接 import axios，grep 验证） |
| 所有接口统一走 request.ts | 通过 |
| URL / 方法 / 参数 / 返回值兼容 | 通过（见第二节对照表） |
| 错误处理统一在拦截器 | 通过（Service 无重复错误处理） |
| 导入/导出/上传/下载已迁移 | 通过 |
| 生产构建通过 | 通过（pnpm build 成功） |
| 未开发业务页面 | 通过 |
| 未实现 CRUD 页面 | 通过 |

---

## 九、后续说明

- 本阶段仅提供 API 层函数，业务页面（User/Product/Quotation）在后续阶段调用这些 Service。
- `doLoginByTicket` 保留 `code === 200` 特判以兼容原项目登录协议。
- 动态扩展字段（产品分类字段、报价表单）用索引签名兜底；后续业务阶段可按分类返回结构进一步收敛类型。

Phase 5 完成，未迁移任何业务模块，按要求停止。
