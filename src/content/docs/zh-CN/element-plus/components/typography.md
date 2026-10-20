---
title: "Typography 排版"
description: "我们对字体进行统一规范，力求在各个操作系统下都有最佳展示效果。"
group: 基础组件
order: 130
---

# Typography 排版

我们对字体进行统一规范，力求在各个操作系统下都有最佳展示效果。

## 字体

:::demo

typography/font

:::

## 字号

:::demo

typography/convention

:::

## 行高

:::demo

typography/line-height

:::

## Font-family

```css
font-family:
  Inter, 'Helvetica Neue', Helvetica, 'PingFang SC', 'Hiragino Sans GB',
  'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
```

## 与 Vue 版 API 的差异

官方 Typography 不是组件：`packages/components` 下没有 typography 目录，
它是一页设计约定，正文只由 3 个 Vue 示例加一段 CSS 组成。
React 侧因此也没有 `ui/` 目录，本页即全部实现。

| 官方 Vue 示例 | React 实现 | 说明 |
| --- | --- | --- |
| `font.vue` 五个终端字体截图 | 本地 `TypographyFont` 组件 | 暗色切换由 CSS 完成，不再依赖 `isDark` |
| `convention.vue` 字号对照表 | 本地 `TypographyConvention` 组件 | 字号值取自 `--el-font-size-*` 的最终 px 值 |
| `line-height.vue` 行高示意 | 本地 `TypographyLineHeight` 组件 | 明暗两套图，同上 |
| `useCssVar` 读字体变量 | 写死同名字号 | 纯 React 无运行时变量读取 |
| `<style scoped>` 里的 img 尺寸 | `docs.css` 的 `.demo-term-box__img` | 项目禁止内联 style 与 `<style>` |
| 逐行 `style="font-size: …"` | `.demo-typo-size__row--*` 修饰类 | 同一组 `--el-font-size-*` 变量 |

**实现说明**：官方示例的 `<style scoped>` 只给字体截图设了 220x174 的尺寸
（第 3 张 `nth-of-type(3)` 去掉右边距），行高示例按原始尺寸 474x114 渲染。
