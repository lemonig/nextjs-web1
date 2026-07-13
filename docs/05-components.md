# 05 · 公共组件 / Components

> 关联文档：Service 见 `06-services.md`；页面见 `02-page-list.md`。

---

## 公共组件 / Shared Components

`SharedModule`（`shared/shared.module.ts`）声明并导出以下公共组件与指令，供各特性模块复用。

### 1. 组件 / Components

| 组件 Component | 选择器 Selector    | 文件 File                                       | 说明 Description                                                                                             |
| -------------- | ------------------ | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 产品分类树     | `app-device-tree`  | `shared/device-tree/device-tree.component.ts`   | 左侧分类树，请求 `/api/product/category`，选中节点通过 `stationCheckEmitter` 输出，`switchTree` 输出折叠事件 |
| 设置菜单       | `app-setting-menu` | `shared/setting-menu/setting-menu.component.ts` | 通用菜单跳转组件，`@Input() order`，`goUrl()` 路由跳转                                                       |

### 2. 指令 / Directives

| 指令 Directive              | 文件 File                                | 说明 Description         |
| --------------------------- | ---------------------------------------- | ------------------------ |
| `TableScrollDirective`      | `shared/table-scroll.directive.ts`       | 表格滚动处理             |
| `TableHeightDirective`      | `shared/table-height.directive.ts`       | 根据容器计算表格滚动高度 |
| `MultiTitleScrollDirective` | `shared/multi-title-scroll.directive.ts` | 多级表头滚动同步         |
| `InputTrimDirective`        | `shared/input-trim.directive.ts`         | 输入框自动去除首尾空格   |

### 3. 头部组件 / Header Components（`LayoutModule`）

| 组件 Component              | 选择器 Selector     | 说明                                                                |
| --------------------------- | ------------------- | ------------------------------------------------------------------- |
| `HeaderComponent`           | `layout-header`     | 顶部菜单栏                                                          |
| `HeaderUserComponent`       | `header-user`       | 用户下拉（退出/改密/个人信息）                                      |
| `HeaderFullScreenComponent` | `header-fullscreen` | 全屏切换（依赖 `screenfull`，模板内联，`click` 触发 `sf.toggle()`） |

### 4. 其他组件 / Other Components（补充）

| 组件 Component              | 选择器 Selector     | 文件 File                                   | 说明                                             |
| --------------------------- | ------------------- | ------------------------------------------- | ------------------------------------------------ |
| `LayoutFullScreenComponent` | `layout-fullscreen` | `layout/fullscreen/fullscreen.component.ts` | 空壳布局，仅 `<router-outlet>`，当前路由表未挂载 |
| `ErrorPageComponent`        | `app-error-page`    | `routes/error-page/error-page.component.ts` | 403 无权限页                                     |
| `AppComponent`              | `app-root`          | `app.component.ts`                          | 根组件（详见 `02-page-list.md`）                 |

> 组件清单核对：源码共 18 个 `@Component`/`@Directive` 选择器（4 业务页 + 4 布局 + 3 头部 + 2 shared 组件 + 4 指令 + `app-root`），本套文档已全部覆盖。

### 5. 迁移映射建议 / Migration Mapping

| Angular                                                      | Next.js + React                                                            |
| ------------------------------------------------------------ | -------------------------------------------------------------------------- |
| 指令 `appTableScroll`/`appTableHeight`/`appMultiTitleScroll` | 自定义 hook（`useEffect` + ref）或表格库配置                               |
| 指令 `appInputTrim`                                          | 受控 `<input onChange>` 中 trim，或封装 `<TrimInput>`                      |
| `app-device-tree`                                            | React 树组件（antd `Tree`），`@Output` -> props 回调 `onSelect`/`onToggle` |
| `header-fullscreen`                                          | 复用同名 `screenfull` npm 包                                               |
| ng-zorro `nz-modal`/`nz-table`/`nz-upload`                   | antd `Modal`/`Table`/`Upload`（React 版）                                  |
