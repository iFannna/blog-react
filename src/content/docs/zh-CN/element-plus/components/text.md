---
title: "Text 文本"
description: "文本的常见操作，包括类型、尺寸、混排与溢出省略。"
group: 基础组件
order: 80
---

# Text

文本的常见操作

## 基础用法

由 `type` 属性来选择 Text 的类型。

:::demo

text/basic

:::

## 尺寸

使用 `size` 属性配置尺寸，可选的尺寸大小有: `large`, `default` 或 `small`

:::demo

text/sizes

:::

## 省略

通过 `truncated` 属性，在文本超过视图或最大宽度设置时展示省略符。通过 `line-clamp` 属性控制多行的样式 Starting from version ^(2.14.6), `isTruncated` is exposed to indicate whether the text is truncated. You can use it to show a tooltip only when truncation occurs.

:::demo

text/truncated

:::

## 覆盖

使用属性 `tag` 覆盖元素

:::demo

text/override

:::

## 混合使用

混合使用 Text 组件

:::demo

text/mixed

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
