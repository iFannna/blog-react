---
title: "CheckTag 可勾选标签"
description: "可勾选的标签，用于快速切换选中状态。"
group: 数据展示
order: 260
---

# CheckTag 可勾选标签

可勾选的标签，用于快速切换选中状态。

## 基础用法

:::demo 点击标签切换选中状态。

check-tag/basic

:::

## 不同类型

:::demo 通过 `type` 设置标签类型。

check-tag/types

:::

## 禁用状态

:::demo 设置 `disabled` 后点击不再切换。

check-tag/disabled

:::

## CheckTag API

### CheckTag Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked | 是否选中 | ^[boolean] | false |
| type | 标签类型 | ^[enum]`'primary' \| 'success' \| 'info' \| 'warning' \| 'danger'` | primary |
| disabled | 是否禁用 | ^[boolean] | false |

### CheckTag Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onCheckedChange | 选中态变化 | ^[Function]`(checked: boolean) => void` |

### CheckTag Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 标签内容 | `children` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model:checked` | `checked` + `onCheckedChange` | React 惯用写法 |

**实现说明**：官方点击时同时派发 `change` 与 `update:checked` 两个事件，
React 侧合并为一个 `onCheckedChange`。禁用时组件不派发任何事件。
