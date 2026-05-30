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
