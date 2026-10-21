<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know
This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Blog React

Next.js 16 (App Router) 博客 + 文档前端。TypeScript strict；UI 全部用 React 手写，Element Plus 为源码级复刻而非第三方依赖；样式用 CSS 自定义属性。

## 技术栈

- 框架: Next.js 16 (App Router)
- 语言: TypeScript (strict)
- 样式: 博客 `src/app/globals.css`；文档 `src/components/docs/docs.css`；Element Plus 主题产物 `src/styles/element-plus/`
- HTTP: axios，Server Components 内通过 `src/services/` 直连后端，客户端走 `/api` 反向代理
- 组件: Element Plus React 复刻 + 站点自有组件，不引入第三方 UI 库

## 常用命令

```bash
npm run dev     # 开发服务器
npm run build   # 生产构建
npm run lint    # ESLint
```

生产预览未配置 npm script，直接运行 `npx next start`。

类型检查（未配独立 script）：`node node_modules/typescript/bin/tsc --noEmit -p tsconfig.json`

## 版本号约定

- `package.json` 的 `version` 使用改动日期，格式为 `YY.MM.DD`，例如 2026-10-21 写为 `26.10.21`。
- 每次准备提交改动时，将版本号更新为改动当天日期；同一天多次改动保持同一版本。
- 不使用语义化版本递增，也不预估版本跨度。
- 使用 `npm version YY.MM.DD --no-git-tag-version` 更新，确保 `package.json` 与 `package-lock.json` 同步。

## 架构

```
src/
├── app/                      # 只放路由与根布局
│   ├── (blog)/[locale]/      # 博客路由，URL /<locale>/...
│   ├── (docs)/[locale]/docs/ # 文档路由，URL /<locale>/docs/<section>/...
│   └── (root)/               # 无语言前缀的入口，识别语言后跳转
├── components/
│   ├── blog/                 # 博客组件（layout / article / common / auth / site）
│   ├── docs/                 # 文档站基建（Layout / Header / Sidebar / DemoBlock / docs.css）
│   └── element-plus/         # Element Plus 复刻，examples/ 为文档示例，icons/ 为图标
├── content/
│   ├── docs/<locale>/        # Markdown 文档（element-plus/components、notes）
│   └── demos/                # 示例清单（registry.generated.ts 为生成文件）
├── services/                 # 后端请求，以及 VO → UI 模型映射
├── lib/                      # 文档管线、locale、Shiki 高亮
├── hooks/  stores/  utils/  types/  styles/
```

默认 Server Components，需要交互的组件加 `"use client"`。`src/services/` 负责请求后端，并把 `types/api.ts` 的 snake_case VO 映射为 `types/models.ts` 的 camelCase 模型，组件只消费 UI 模型。

## 文件命名约定

- 站点自有组件（`src/components/blog/**`、`src/components/docs/**`）用 PascalCase，且与主导出同名（默认导出或主要命名导出），如 `Layout.tsx`、`CommentsPanel.tsx`
- 其余 TS/TSX 模块用 kebab-case：`src/lib/**`、`src/hooks/**`、`src/services/**`、`src/stores/**`、`src/utils/**`、`src/content/**`
- 样式文件用 kebab-case：`docs.css`、`*.module.css`
- `src/app/**` 只放 Next.js 路由文件（`page.tsx`、`layout.tsx`、`route.ts` 等），组件放到 `src/components/**`
- `src/components/element-plus/**` 是官方实现的 React 迁移，保留上游命名：组件 `ElXxx.tsx`，工具与 hook 用 `use-xxx.ts` / `xxx-utils.ts`，examples 与上游一致

## 样式约定

- 设计 token（颜色/间距/圆角/阴影）用 CSS 变量定义在 `globals.css` 的 `:root`；暗色模式用 `[data-theme="dark"]` 覆盖变量，不用 class 切换
- 布局用自定义 CSS class，博客样式写在 `globals.css`，文档样式写在 `docs.css`
- 禁止 `<style>` 标签；内联 style 仅用于 Shiki token 配色等无法用 class 表达的场景
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
