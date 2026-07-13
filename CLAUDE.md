<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Blog React

Next.js 16 (App Router) 博客前端。TypeScript strict，样式用 CSS 自定义属性，纯 React 不依赖 UI 组件库。

## 技术栈

- 框架: Next.js 16 (App Router)
- 语言: TypeScript (strict)
- 样式: CSS 自定义属性，集中维护在 `src/app/globals.css`
- HTTP: axios，在 Server Components 内直接请求后端
- 组件: 纯 React，不使用 UI 组件库

## 常用命令

```bash
npm run dev     # 开发服务器（脚本内含 rimraf .next，每次启动自动清缓存）
npm run build   # 生产构建
npm run start   # 启动构建产物
npm run lint    # ESLint
```

类型检查（未配独立 script）：`node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json`

## 架构

```
src/
├── app/                # App Router 页面与布局（globals.css 也在此）
│   ├── archive/        # 归档：索引 + 日期浏览 ([[...slug]]) + 文章详情 ([year]/[month]/[day]/[id])
│   └── ...             # category / tag / author / search / about / contact / typography
├── components/
│   ├── layout/         # 站点结构（Header / Footer / Sidebar / SiteLayout）
│   └── ui/             # 可复用 UI 组件
├── lib/
│   ├── api/            # 后端 API 客户端（article / category / tag / search / site / comment / client）
│   ├── utils.ts        # 工具函数
│   ├── useTheme.ts     # 主题切换
│   └── mock-data.ts    # 本地兜底数据
└── types/              # api = 后端 VO（snake_case），ui = 前端模型（camelCase）
```

默认 Server Components，需要交互的组件加 `"use client"`。API 层（`lib/api/`）负责把后端 snake_case VO 映射为前端 camelCase 模型（定义在 `types/ui.ts`），组件只消费 ui 模型。

## 样式约定

- 设计 token（颜色/间距/圆角/阴影）用 CSS 变量定义在 `globals.css` 的 `:root`；暗色模式用 `[data-theme="dark"]` 覆盖变量，不用 class 切换
- 布局用自定义 CSS class，复杂组件样式写在 `globals.css`
- 禁止 `<style>` 标签或内联 style 对象
- 禁止硬编码颜色/间距/圆角，统一用 `var(--color-*)` 等 CSS 变量
- 尽量不用 `!important`，优先提高选择器特异性（加 class 层级、用 `:not()`）
- `html { font-size: 62.5% }` → 1rem = 10px，所有 rem 基于此换算

## 注释约定

- 只注释「为什么」，不注释「是什么」(代码自身能表达的不写)
- JSX 注释用中文（与沟通语言一致），CSS 注释用英文
- 禁止冗余注释（复述代码结构）、过时注释（行号引用、已删除的布局变体名）
- 解释设计意图、业务逻辑、非显而易见技术决策的注释保留

## 编译验证

- 开发服务器完全由用户手动管理（启动/重启/关闭）
- 改 CSS 或组件后必须 `rm -rf .next` 再验证（Turbopack 会缓存 CSS，不清则改动不生效）
- 验证方式：等用户确认，或用 `curl` 检查已运行的服务
