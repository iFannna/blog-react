---
title: "Layout 布局"
description: "通过基础的 24 分栏，迅速简便地创建布局。"
group: 基础组件
order: 60
---

# Layout 布局

通过基础的 24 分栏，迅速简便地创建布局。

## 基础布局

:::demo 通过 `ElRow` 与 `ElCol` 组合，`span` 表示占位格数。

layout/basic-layout

:::

## 分栏间隔

:::demo `gutter` 设置栅格间隔，Row 会自动用负 margin 抵消两端的空白。

layout/column-spacing

:::

## 偏移

:::demo 通过 `offset` 设置列左侧的间隔格数。

layout/column-offset

:::

## 对齐方式

:::demo 通过 `justify` 设置水平排列方式，支持 start / center / end / space-between / space-around / space-evenly。

layout/alignment

:::

## 混合布局

:::demo 通过不同 span 组合出比例不等的列。

layout/hybrid-layout

:::

## 响应式布局

:::demo 参照 Bootstrap 的响应式设计，预设了 xs / sm / md / lg / xl 五个断点。

layout/responsive-layout

:::

## Row API

### Row Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| gutter | 栅格间隔，同时作为 Col 的左右内边距 | ^[number] | 0 |
| justify | 水平排列方式 | ^[enum]`'start' \| 'end' \| 'center' \| 'space-around' \| 'space-between' \| 'space-evenly'` | start |
| align | 垂直对齐方式 | ^[enum]`'top' \| 'middle' \| 'bottom'` | — |
| tag | 渲染的标签名 | ^[string] | div |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Row Events

无。

### Row Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 列内容 | `children` |

## Col API

### Col Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| span | 栅格占位格数，共 24 格 | ^[number] | 24 |
| offset | 左侧间隔格数 | ^[number] | — |
| pull | 向右移动格数 | ^[number] | — |
| push | 向左移动格数 | ^[number] | — |
| xs / sm / md / lg / xl | 响应式断点，值为格数或 `{ span, offset, pull, push }` | ^[number] / ^[object] | — |
| tag | 渲染的标签名 | ^[string] | div |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Col Events

无。

### Col Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 列内容 | `children` |

### Exposes

Row / Col 均无 expose。

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| 任意 HTML 属性透传 | 仅 `className` / `style` / `tag` | React 组件显式声明 props |
| Row / Col 均为 Vue 组件 | 同构，类名一致 | 可直接复用 theme-chalk |

**实现说明**：间距用「Row 负 margin + Col 左右 padding（各 gutter/2）」抵消实现，
因此最左最右两列也能贴齐容器边缘。

- `justify` 为 `start` 时不加类名（与官方一致，靠 flex 默认值生效）
- `offset` / `pull` / `push` 仅在大于 0 时输出类名，与官方的 `isNumber && > 0` 判断一致
- `span` 默认 24，与官方 col.ts 默认值一致
