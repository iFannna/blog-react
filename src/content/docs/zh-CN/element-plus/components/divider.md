---
title: "Divider 分割线"
description: "区隔内容的分割线。"
group: 其他
order: 10
---

# Divider 分割线

区隔内容的分割线。

## 基础用法

:::demo 对不同章节的文本段落进行分割。

divider/basic-usage

:::

## 设置文案

:::demo 可以在分割线上自定义文案和位置，通过 `contentPosition` 设置位置。

divider/custom-content

:::

## 自定义样式

:::demo 通过 `borderStyle` 属性设置分割线的样式。

divider/line-dashed

:::

## 垂直分割

:::demo 设置 `direction="vertical"` 可以设置为垂直分割线， 常用于行内元素之间。

divider/vertical-divider

:::

## Divider API

### Divider Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 方向 | ^[enum]`'horizontal' \| 'vertical'` | horizontal |
| content-position | 内容位置，仅水平方向有效 | ^[enum]`'left' \| 'center' \| 'right'` | center |
| border-style | 分隔线样式 | ^[enum]`'solid' \| 'dashed' \| 'dotted' \| 'double' \| 其它 CSS border-style 值` | solid |

### Divider Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 分割线中间的文字 | `children` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `border-style` | `borderStyle` | JSX 里用驼峰 |

**实现说明**：官方通过 `ns.cssVar` 把 `border-style` 写成 `--el-border-style` 变量，
由 scss 里的 `border-top: 1px var(--el-border-color) var(--el-border-style)` 消费。
React 侧沿用同一机制，变量名与消费方式完全一致。

竖线形态下不渲染文字区，与官方模板的判断一致。
