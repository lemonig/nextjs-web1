# features

业务模块目录（Feature First）。

每个业务对应一个子目录，例如 `features/users/`，内部包含：

- `XxxPage.tsx` 页面容器
- `components/` 局部组件
- `hooks/` 局部 hooks
- `utils/` 局部工具函数

约束：Feature 之间禁止互相依赖。业务页面迁移时在此新增，暂为空。
