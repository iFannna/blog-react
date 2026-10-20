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
npm run dev     # 开发服务器
npm run build   # 生产构建
npm run lint    # ESLint
```

生产预览未配置 npm script，直接运行 `npx next start`。

类型检查（未配独立 script）：`node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json`

## 架构

```
src/
├── app/                # App Router 页面与布局（globals.css 也在此）
│   ├── (blog)/         # 博客路由：archive / category / tag / author / search / ...
│   └── (docs)/         # 文档站路由
│       ├── _components/                   # 文档站基建（DemoBlock / 侧边栏 / 目录等，不参与路由）
│       └── docs/element-plus/components/  # 组件文档页，URL /docs/element-plus/components/<slug>
├── components/
│   ├── blog/           # 博客自有组件（layout / article / common / auth / site）
│   └── element-plus/   # Element Plus 复刻组件；examples/ 为文档示例
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
- `html { font-size: 100% }` → 1rem = 16px，所有 rem 基于此换算

### 单位约定

- 布局尺寸、间距 → rem（1rem = 16px）；超大（接近视口）→ vw/vh
- 跟字号成比例的内边距 → em
- 全屏/视口 → vh/vw（移动端优先 dvh/svh）
- 像素精确的细节（边框、细线、图标、阴影）→ px
- 小数一位优先；两位及以上需判断（0.667 、0.375、1.25 等数学正常可留）；由旧 10px 基准精确换算的 rem 保留原精度（最多 6 位小数），禁止四舍五入改变像素

## 注释约定

- 只注释「为什么」，不注释「是什么」
- JSX 注释用中文，CSS 注释用英文且只用来划分组件块
- 禁止冗余注释、过时注释

## Git 提交约定

- 格式：conventional commits，`type: subject`
- type 取 feat / fix / style / refactor / chore / docs 
- subject 英文、祈使句、小写开头、不加句号
- 不带 scope
- 不带 body

## 编译验证

- 前端开发服务器完全由用户手动管理，不占用端口
- 改完需要验证服务是否正常运行，若无法正常运行则修改只能正常运行
