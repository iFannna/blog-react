# Blog React — 开发规范

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript (strict)
- **样式**: CSS 自定义属性 (globals.css)
- **组件**: 纯 React，不使用 UI 组件库
## CSS 架构

### 设计 Token 体系
- 所有颜色、间距、圆角、阴影通过 CSS 变量定义在 `globals.css` 的 `:root` 中
- 暗色模式通过 `[data-theme="dark"]` 覆盖 CSS 变量，不使用 class 切换

### 样式编写规则
- 组件布局/结构用自定义 CSS class
- 复杂组件样式写在 `globals.css` 中（带注释标注来源）
- **禁止在组件内使用 `<style>` 标签或内联 style 对象**
- **禁止硬编码颜色值**，统一使用 `var(--color-*)`
- **禁止硬编码间距/圆角**，统一使用 CSS 变量
- **尽量避免使用 `!important`** — 优先通过提高选择器优先级（增加 class 层级、使用 `:not()` 排除）解决样式覆盖问题

### rem 基准
- `html { font-size: 62.5% }` → 1rem = 10px
- 所有 rem 值基于此换算


## 注释规范

- **只注释"为什么"，不注释"是什么"** — 代码本身能表达的不需要注释
- **禁止冗余注释** — 复述代码结构的注释禁止添加（如 `/* Close button */` 在 `.search-close { ... }` 上方）
- **禁止过时注释** — 行号引用、已删除的布局变体名、Vue 残留引用等禁止保留
- **JSX 注释用中文** — 与用户沟通语言一致
- **CSS 注释用英文** — globals.css 中的所有注释使用英文
- **保留有价值的注释** — 解释设计意图、业务逻辑、非显而易见的技术决策的注释保留



## 编译验证规范

- 开发服务器完全由用户手动管理（启动、重启、关闭）
- 每次修改 CSS/组件代码后，必须清除缓存（`rm -rf .next`）再验证
- Turbopack 会缓存 CSS，不清除 `.next` 会导致改动不生效
- 验证方式：等待用户确认或用 `curl` 检查已运行的服务器
