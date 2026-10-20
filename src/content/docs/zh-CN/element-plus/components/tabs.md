---
title: "Tabs 标签页"
description: "分隔内容上有关联的部分。"
group: 导航
order: 90
---

# Tabs 标签页

分隔内容上有关联的部分。

## 基础用法

:::demo 基础的、简洁的标签页，点击标签切换内容。

tabs/basic

:::

## 卡片风格

:::demo 设置 `type="card"` 显示卡片风格的标签页。

tabs/card-style

:::

## 带边框卡片

:::demo 设置 `type="border-card"` 显示带边框的卡片标签页。

tabs/border-card

:::

## 自定义标签

:::demo 通过 `label` 传入自定义节点，可以在标签中加入图标等内容。

tabs/custom-tab

:::

## 自定义新增按钮图标

:::demo 通过 `addIcon` 替换默认的加号图标，等价于官方 `add-icon` 插槽。

tabs/customized-add-button-icon

:::

## 自定义触发按钮

:::demo 使用 `closable` 显示关闭按钮，并在外部按钮中触发新增。

tabs/customized-trigger

:::

## 默认值

:::demo 未传 `value` 时，可通过 `defaultValue` 指定初始选中的面板。

tabs/default-value

:::

## 动态增减标签

:::demo `editable` 同时启用新增与关闭；`onEdit` 统一接收增删事件。

tabs/dynamic-tabs

:::

## 标签位置

:::demo 通过 `tabPosition` 设置标签位置，支持 top / right / bottom / left。

tabs/tab-position

:::

## Tabs API

### Tabs Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 选中面板的 name，受控 | ^[string] / ^[number] | — |
| defaultValue | 非受控时的初始选中 name | ^[string] / ^[number] | 第一个面板 |
| type | 风格类型 | ^[enum]`'' \| 'card' \| 'border-card'` | — |
| tabPosition | 选项卡位置 | ^[enum]`'top' \| 'right' \| 'bottom' \| 'left'` | top |
| closable | 标签是否可关闭 | ^[boolean] | false |
| addable | 是否显示加号 | ^[boolean] | false |
| editable | 是否可增删 | ^[boolean] | false |
| addIcon | 自定义新增按钮图标，等价官方 `add-icon` 插槽 | ^[ReactNode] | Plus 图标 |
| stretch | 标签宽度是否自撑开 | ^[boolean] | false |
| beforeLeave | 切换前钩子，返回 false 阻止 | ^[Function]`(newName, oldName) => boolean \| Promise<boolean>` | — |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Tabs Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中面板变化（受控值更新） | ^[Function]`(name) => void` |
| onTabClick | 点击标签（含已选中） | ^[Function]`(name) => void` |
| onTabRemove | 点击关闭按钮或按 Delete / Backspace | ^[Function]`(name) => void` |
| onTabAdd | 点击新增按钮 | ^[Function]`() => void` |
| onEdit | 增删统一回调，等价官方 `edit` | ^[Function]`(name \| undefined, 'remove' \| 'add') => void` |

### Tabs Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 面板集合 | children |
| add-icon | 自定义新增按钮图标 | `addIcon` 属性 |

### TabPane Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 面板标识，省略时用下标字符串 | ^[string] / ^[number] | — |
| label | 标签标题，可传节点 | ^[ReactNode] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| closable | 是否可关闭，优先于 Tabs 的 closable | ^[boolean] | — |
| lazy | 是否懒渲染（首次激活后保留） | ^[boolean] | false |

### TabPane Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 面板内容 | children |
| label | 自定义标签内容 | `label` 属性 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | 受控写法；不传 value 时可用 `defaultValue` |
| `@tab-change` | `onChange` | React 侧合并为值变化回调 |
| `@edit` | `onEdit` | 参数与触发时机一致 |
| `<slot name="add-icon">` | `addIcon` 属性 | 传节点 |
| `<template #label>` | `label` 属性 | 传节点 |
| `expose: currentName / tabNavRef` | 暂未提供 | 可通过受控 value 获取当前项 |

**实现说明**：

- 激活条定位与官方 `getBarStyle` 一致：量激活项 `offsetLeft` 与扣除左右 padding 后的宽度，用 `transform: translateX` 定位；card / border-card 不渲染激活条
- 键盘交互与官方一致：方向键循环切换可用 tab（左/上向前、右/下向后），聚焦后立即选中；Delete / Backspace 关闭当前可关闭 tab；新增按钮支持 Enter 触发
- ARIA：`role="tablist" / "tab" / "tabpanel"`，并由 `useId` 生成稳定的 `aria-controls`、`aria-labelledby` 关联；`aria-orientation` 随 `tabPosition` 变化
- `lazy` 面板首次激活后保持挂载（仅 `display: none`），等价于官方面板的 keep-alive 行为
- 官方面板切换的 fade 过渡与超出宽度时的 nav 滚动按钮尚未实现，结构与类名保持一致
- 未受控时若移除当前面板，需由使用方像官方 demo 一样在 `onEdit` / `onTabRemove` 中切换 `value`
