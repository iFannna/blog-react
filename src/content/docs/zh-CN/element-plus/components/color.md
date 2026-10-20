---
title: "Color 色彩"
description: "Element Plus 使用一组特定的色板，为构建的产品提供一致的外观与观感。"
group: 基础组件
order: 30
---

# Color 色彩

Element Plus 使用一组特定的色板，为构建的产品提供一致的外观与观感。

## 主色

Element Plus 的主色是明亮且友好的蓝色。

:::demo

color/main

:::

## 场景色

除主色外，不同场景需要使用不同的颜色（例如危险色表示危险操作）。

:::demo

color/secondary

:::

## 中性色

中性色用于文字、背景与边框，可以用不同的中性色来表达层次结构。

:::demo

color/neutral

:::

## Color 规范

这不是一个可实例化的组件，官方也没有导出任何 `<el-color>`。它是一组命名规范：
Element Plus 把所有颜色收敛成 `--el-color-*` / `--el-text-color-*` /
`--el-border-color-*` / `--el-fill-color-*` / `--el-bg-color-*` CSS 变量，
任何组件都只引用变量，因此换主题只需改写变量。所以本节没有 Attributes / Events，
只有变量表与色板。全部变量已在本项目
`src/styles/element-plus/index.css` 的 `:root` 中定义，暗色覆盖在 `dark.css`。

### 主色与场景色

| 变量名 | 说明 | 浅色默认值 |
| --- | --- | --- |
| --el-color-primary | 主色 | #409eff |
| --el-color-primary-light-3 | 主色浅色 3 档 | rgb(121, 187, 255) |
| --el-color-primary-light-5 | 主色浅色 5 档 | rgb(160, 207, 255) |
| --el-color-primary-light-7 | 主色浅色 7 档 | rgb(198, 226, 255) |
| --el-color-primary-light-8 | 主色浅色 8 档 | rgb(217, 236, 255) |
| --el-color-primary-light-9 | 主色浅色 9 档 | rgb(236, 245, 255) |
| --el-color-primary-dark-2 | 主色深色 2 档 | rgb(51, 126, 204) |
| --el-color-success | 成功色 | #67c23a |
| --el-color-warning | 警告色 | #e6a23c |
| --el-color-danger | 危险色 | #f56c6c |
| --el-color-error | 错误色（同 danger） | #f56c6c |
| --el-color-info | 信息色 | #909399 |

`success` / `warning` / `danger` / `error` / `info` 各自还有
`light-3`、`light-5`、`light-7`、`light-8`、`light-9`、`dark-2` 六个派生档位，
命名规则同上。

### 中性色

| 变量名 | 说明 | 浅色默认值 |
| --- | --- | --- |
| --el-text-color-primary | 主要文字 | #303133 |
| --el-text-color-regular | 常规文字 | #606266 |
| --el-text-color-secondary | 次要文字 | #909399 |
| --el-text-color-placeholder | 占位文字 | #a8abb2 |
| --el-text-color-disabled | 禁用文字 | #c0c4cc |
| --el-border-color-darker | 更深边框 | #cdd0d6 |
| --el-border-color-dark | 深边框 | #d4d7de |
| --el-border-color | 基础边框 | #dcdfe6 |
| --el-border-color-light | 浅边框 | #e4e7ed |
| --el-border-color-lighter | 更浅边框 | #ebeef5 |
| --el-border-color-extra-light | 极浅边框 | #f2f6fc |
| --el-fill-color-darker | 更深填充 | #e6e8eb |
| --el-fill-color-dark | 深填充 | #ebedf0 |
| --el-fill-color | 基础填充 | #f0f2f5 |
| --el-fill-color-light | 浅填充 | #f5f7fa |
| --el-fill-color-lighter | 更浅填充 | #fafafa |
| --el-fill-color-extra-light | 极浅填充 | #fafcff |
| --el-fill-color-blank | 空白填充 | #ffffff |
| --el-bg-color | 基础背景 | #ffffff |
| --el-bg-color-page | 页面背景 | #f2f3f5 |
| --el-bg-color-overlay | 浮层背景 | #ffffff |

另外 `--el-color-white`（#ffffff）与 `--el-color-black`（#000000）是无派生档位的
纯色常量。

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| 无组件，纯 CSS 变量 | 无组件，纯 CSS 变量 | 完全一致，本节只演示变量效果 |
| 示例用 `:style="{ background: var(--el-*) }"` 内联上色 | 改用 `demo-color-box--*` 修饰类 | 项目禁止内联 style 对象，类名逐一映射同名变量 |
| `useCssVar` / `getCssVarValue` 运行时读取变量值显示 | 常量表列出默认值 | 见下方「未实现的官方能力」 |
| 官方 md 用 `<ClientOnly><MainColor /></ClientOnly>` 挂全局组件 | 三条 `:::demo` 展示 | 官方 md 无 `:::demo`，示例目录为空，故按展示块组织 |

**实现说明**：三个色板的 DOM 结构与类名（`demo-color-box`、`demo-color-box-lite`、
`bg-color-sub`、`bg-blue-sub-item`、`bg-secondary-sub-item`）与官方
`docs/.vitepress/vitepress/components/globals/{main,secondary,neutral}-color.vue` 对齐；
布局复用 `ElRow` / `ElCol`。色块的尺寸、圆角、字体、子色条高度取自官方文档构建产物
里编译后的 CSS。

**未实现的官方能力**：

- 官方用 `getCssVarValue()` 在运行时读取 `--el-*` 的实际值（含暗色主题切换后的值）
  显示在 `.value` 里，React 侧用常量表写死浅色默认值。
- 官方点击子色条复制的是 `useClipboard` + `ElMessage` 提示；本页复制逻辑一致，
  但复制失败时的提示文案为项目自定义中文。
- 官方色彩页顶部有一个「显示源码」式的 Source 链接区块，本页未复刻。
