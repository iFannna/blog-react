# AGENTS.md

This project references Vue source at:
`D:\develop\code\project\blog-vue-springboot\vue-blog-project`

## Context

We are rebuilding a Vue blog frontend in React (Next.js 16 + Tailwind CSS v4). The goal is pixel-level UI restoration from the Vue source.

## Source Code Reference

When restoring UI from the Vue project:

1. **CSS values** — always extract from source files:
   - `src/assets/styles/vendors/bloglo/core.scss` (10,000+ lines, main theme)
   - `src/assets/styles/vendors/bloglo/dynamic.scss` (dark mode + responsive)
   - `src/assets/styles/app/overrides/theme-overrides.scss` (custom overrides)
   - `src/assets/styles/app/base.scss` (minimal utilities)
   - Component `<style scoped>` blocks

2. **Component structure** — match DOM hierarchy from `.vue` templates

3. **Naming** — strip all vendor prefixes (bloglo-*, wp-*) when translating class names

## Key Design Decisions

- **Dark mode**: `[data-theme="dark"]` attribute on `<html>`, CSS variable overrides
- **Font base**: `html { font-size: 62.5% }` → 1rem = 10px (same as Vue project)
- **Container**: max-width 1420px, horizontal padding 5rem
- **Header**: layout-2 (Logo | Nav flex:1 | Widgets), squarebox nav animation, no separators
- **Body classes** that affect layout:
  - `bloglo-header-layout-2` — header structure
  - `bloglo-menu-animation-squarebox` — nav hover style (background fill + shadow)
  - `bloglo-header__separators-none` — no widget divider lines
  - `bloglo-has-sidebar` + `bloglo-sidebar-position__right-sidebar`

## What NOT to do

- Do NOT use screenshots or visual analysis to determine CSS values
- Do NOT invent CSS values — find them in source code
- Do NOT add features beyond what exists in the Vue project
- Do NOT use UI component libraries (MUI, Ant Design, etc.)
- Do NOT use vendor-prefixed class names (bloglo-*, wp-*)

## Development Workflow

### 编译验证

- 每次修改 CSS/组件代码后，必须清除缓存再验证
- **清除缓存**: `rm -rf .next`（Turbopack 会缓存 CSS，不清除改动不生效）
- **验证方式**: 等待 Turbopack 自动编译，用 `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000` 确认页面正常
- 禁止跳过缓存清除步骤

### 端口和进程管理

- **禁止启动开发服务器**（`npx next dev`）
- **禁止关闭用户已启动的开发服务器进程**（不要 `taskkill`、`kill-port`、或任何杀进程操作）
- 开发服务器完全由用户手动启动、重启、关闭
- 需要验证时只使用 `curl` 检查已运行的服务器
- 如果需要重启服务器，告知用户操作
