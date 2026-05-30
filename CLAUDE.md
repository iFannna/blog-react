# Blog React — 开发规范

<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## 技术栈

- **框架**: Next.js 16 (App Router)
- **语言**: TypeScript (strict)
- **样式**: Tailwind CSS v4 + CSS 自定义属性 (globals.css)
- **组件**: 纯 React，不使用 UI 组件库
- **数据**: 暂用 mock-data，后端对接时替换

## 命名规范

- **文件**: PascalCase — `ArticleCard.tsx`, `SiteLayout.tsx`
- **目录**: kebab-case — `article-editor/`, `ui-components/`
- **CSS class**: kebab-case — `site-header`, `nav-link`, `widget-icon`
- **CSS 变量**: `--color-*`, `--radius-*`, `--transition-*`, `--shadow-*`
- **常量/类型**: PascalCase — `NAV_ITEMS`, `Article`
- **禁止**: 任何 vendor 前缀 (bloglo-*, wp-*)

## 项目架构

```
src/
├── app/              # Next.js App Router (页面 + layout)
├── components/
│   ├── layout/       # Header, Footer, Sidebar, SiteLayout
│   └── ui/           # ArticleCard, Pagination, WavesBackground...
├── lib/              # 工具函数、mock 数据
└── app/globals.css   # 设计 Token + 组件 CSS
```

## CSS 架构

### 设计 Token 体系
- 所有颜色、间距、圆角、阴影通过 CSS 变量定义在 `globals.css` 的 `:root` 中
- CSS 变量 → Tailwind `@theme inline` → Tailwind 工具类
- 暗色模式通过 `[data-theme="dark"]` 覆盖 CSS 变量，不使用 class 切换

### 样式编写规则
- 组件布局/结构用 Tailwind 工具类
- 复杂组件样式写在 `globals.css` 中（带注释标注来源）
- **禁止在组件内使用 `<style>` 标签或内联 style 对象**
- **禁止硬编码颜色值**，统一使用 `var(--color-*)` 或 Tailwind 颜色工具类
- **禁止硬编码间距/圆角**，统一使用 CSS 变量或 Tailwind 工具类

### rem 基准
- `html { font-size: 62.5% }` → 1rem = 10px
- 源自 Bloglo 主题，所有 rem 值基于此换算

### 容器宽度
- 全局 max-width: `1420px`
- 使用 `mx-auto max-w-[1420px] px-[5rem]` 统一内边距

## 开发约束

- 参考 Vue 源码还原 UI 时，只从 CSS/HTML 源码提取值，不猜测
- 新页面先确认布局结构再写代码，避免返工
- 组件保持单一职责，一个文件一个组件
- 图片资源优先使用 OSS 链接，本地图片放 `public/`
- 保持 TypeScript 类型完整，禁止 `any`（必要时用 `unknown`）

## 端口

- 开发服务器默认 3000，如被占用会自动递增
- Vue 项目运行在 3000 时，本项目使用 3001+

## 编译验证规范

- **禁止启动或关闭用户已运行的开发服务器**（不执行 `npx next dev`、`taskkill`、`kill-port` 等进程操作）
- 开发服务器完全由用户手动管理（启动、重启、关闭）
- 每次修改 CSS/组件代码后，必须清除缓存（`rm -rf .next`）再验证
- Turbopack 会缓存 CSS，不清除 `.next` 会导致改动不生效
- 验证方式：等待用户确认或用 `curl` 检查已运行的服务器
