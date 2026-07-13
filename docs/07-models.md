# 07 · Model 数据模型 / Models

> 关联文档：接口参数见 `04-api-list.md`。

---

## Model 数据模型 / Models

> **重要发现 / Key Finding**：项目**没有定义任何 TypeScript interface / class 数据模型**。所有 HTTP 响应、表单数据、列表数据均使用 `any` 类型。以下为根据 API 请求参数与表单逆向整理出的**隐式数据结构**，仅供参考，非代码中真实定义。

### 1. User / 用户（推断 inferred）

```ts
{
  id, openId, nickname, account, mobile, company,
  avatar, wechat_url,
  role: 1 | 2 | 3 | 4,        // 角色
  is_admin, is_assistant, deal_notify, status
}
```

来源：`/api/user/owner`、`salesman.component.ts` 表单、`header.component.ts` localStorage `user`。

### 2. Quotation / 报价单（推断）

```ts
{
  id, project, organization, expiryDate,
  contractDetail, description, playerId,
  attachment: { filePath, originalFilename }
}
```

来源：`ticket-list.component.ts` `operateForm`。

### 3. Quotation Detail / 报价单明细（推断）

```ts
{
  id,
    quotationId,
    productId,
    number,
    community,
    remarks,
    serial,
    verificationCode;
}
```

来源：`ticket-list.component.ts` `operateForm2` / `cameraForm`。

### 4. Product / 产品（推断）

```ts
{
  id, categoryId, name, brand, price,
  ...categoryFieldList   // 分类动态扩展字段
}
```

来源：`device-factory.component.ts` 动态 `operateForm`。

### 5. Product Category / 产品分类（推断）

```ts
{
  id, name,
  brandList: [],
  categoryFieldList: [{ field, name, value }]
}
```

来源：`/api/product/category`、`device-tree.component.ts`。

### 6. 工具常量 / Util Constants

- `txtStatus(status)`（`utils/public.js`）：状态码 1-6 -> 中文文案（未受理/已受理/已接单/转派/完工/已评价）。
