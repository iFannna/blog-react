---
title: "Divider 分割线"
description: "区隔内容的分割线。"
group: 其他
order: 10
---

# Divider 分割线

区隔内容的分割线。

## 基础用法

:::demo 对不同段落的文本进行分割。

divider/basic-usage

:::

## 设置文案

:::demo 可以在分割线上自定义文本内容。

divider/custom-content

:::

## 虚线

:::demo 您可以设置分隔符的样式。

divider/line-dashed

:::

## 垂直分隔线

:::demo

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
