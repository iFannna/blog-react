---
title: "Text 文本"
description: "文本的常见操作，包括类型、尺寸、混排与溢出省略。"
group: 基础组件
order: 80
---

# Text 文本

文本的常见操作，包括类型、尺寸、混排与溢出省略。

## 基础用法

:::demo 通过 type 设置文本类型。

text/basic

:::

## 尺寸

:::demo 通过 size 设置文本尺寸。

text/sizes

:::

## 溢出省略

:::demo `truncated` 用于单行省略，`lineClamp` 用于多行省略； 宽度可由自身或父元素约束。

text/truncated

:::

## 混合使用

:::demo 文本可与图标、评分、按钮等组件混排。

text/mixed

:::

## 覆盖标签

:::demo 通过 `tag` 渲染为 p / b / i / sub / sup / ins / del / mark 等语义标签。

text/override

:::

## Text API

### Text Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 文本类型 | ^[enum]`'primary' \| 'success' \| 'info' \| 'warning' \| 'danger' \| ''` | — |
| size | 文本尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| truncated | 是否单行溢出省略 | ^[boolean] | false |
| lineClamp | 最大行数，传入即启用多行省略 | ^[number] / ^[string] | — |
| tag | 渲染的标签名，如 p / b / i / sub / sup / ins / del / mark | ^[string] | span |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |
| title | 原生 title，传入后不再自动计算 | ^[string] | — |

### Text Events

无。

### Text Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 文本或混排内容（文本、图标、组件） | `children` |

### Exposes

无。
