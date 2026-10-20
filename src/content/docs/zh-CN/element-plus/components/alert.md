---
title: "Alert 提示"
description: "用于页面中展示重要的提示信息。"
group: 反馈组件
order: 10
---

# Alert 提示

用于页面中展示重要的提示信息。

## 基础用法

:::demo 页面中的非浮层元素，不会自动消失。设置 `type` 属性指定主题。

alert/basic

:::

## 主题

:::demo Alert 组件提供了两种主题，通过 `effect` 属性来设置。

alert/theme

:::

## 自定义关闭按钮

:::demo 通过 `closeText` 属性自定义关闭按钮为文字。

alert/close-button

:::

## 带有辅助性文字介绍

:::demo 通过 `description` 属性设置辅助性文字。传入后标题会变为大字号。

alert/description

:::

## 带有图标

:::demo 设置 `showIcon` 属性显示对应类型的图标。

alert/icon

:::

## 文字居中

:::demo 使用 `center` 属性让文字水平居中。

alert/center

:::

## 可关闭的提示

:::demo 设置 `closable` 属性（默认开启）可以关闭提示， `onClose` 回调中决定是否从列表中移除。

alert/icon-description

:::

## Alert API

### Alert Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | ^[string] / ^[ReactNode] | — |
| type | 主题类型 | ^[enum]`'primary' \| 'success' \| 'warning' \| 'error' \| 'info'` | info |
| description | 描述文字，传入后标题与描述纵向排列 | ^[string] / ^[ReactNode] | — |
| closable | 是否可关闭 | ^[boolean] | true |
| close-text | 自定义关闭按钮文案，传入后替换 × 图标 | ^[string] | — |
| show-icon | 是否显示图标 | ^[boolean] | false |
| center | 内容是否居中 | ^[boolean] | false |
| effect | 主题 | ^[enum]`'light' \| 'dark'` | light |

### Alert Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onClose | 关闭时触发 | ^[Function]`(event: MouseEvent) => void` |

### Alert Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 描述文字 | `description` |
| title | 标题内容 | `title` |
| icon | 自定义图标 | `icon` |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `type` | 同 | 官方含 `primary`，无 `default` |

**实现说明**：官方用 `v-show` 控制显隐并在组件内维护 `visible`，
React 侧沿用该职责：`onClose` 触发时先卸载自身，使用方无需额外维护显隐状态。
