---
title: "Collapse 折叠面板"
description: "通过折叠面板收纳内容区域。"
group: 数据展示
order: 60
---

# Collapse 折叠面板

通过折叠面板收纳内容区域。

## 基础用法

可同时展开多个面板，面板之间不影响。

:::demo

collapse/basic

:::

## 手风琴效果

每次只能展开一个面板。

:::demo 通过 `accordion` 属性来设置是否以手风琴模式显示。

collapse/accordion

:::

## 自定义面板标题

除了可以通过 `title` 属性以外，还可以通过具名 `slot` 来实现自定义面板的标题内容，以实现增加图标等效果。

:::tip

从版本 `2.9.10` 开始， `title` 插槽提供一个 `isActive` 属性，显示当前折叠项是否活跃。

:::

:::demo

collapse/customization

:::

## 自定义图标

除了使用 `icon` 属性外，您还可以自定义面板项目图标，从而添加自定义内容。

:::demo

collapse/custom-icon

:::

## 自定义图标位置

使用 `expand-icon-position` 属性，您可以自定义图标位置。

:::demo

collapse/custom-icon-position

:::

## 阻止折叠

设置 `beforeChange` 属性，若返回 `false` 或者返回 `Promise` 且被 reject ，则停止切换。

:::demo

collapse/prevent-collapsing

:::

## Collapse API

### Collapse Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 当前展开的面板。手风琴模式为单值，否则为数组 | ^[array] / ^[string] / ^[number] | [] |
| accordion | 是否手风琴模式 | ^[boolean] | false |
| expandIconPosition | 展开图标位置 | ^[enum]`'left' \| 'right'` | right |
| beforeCollapse | 切换前钩子，返回 false 或 reject 的 Promise 阻止切换 | ^[Function]`(name) => boolean \| Promise<boolean>` | — |
| className | 根节点类名 | ^[string] | — |

### Collapse Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 展开面板变化，等价官方 `change` | ^[Function]`(value) => void`，手风琴为单值，否则为数组 |

### Collapse Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 折叠面板子项 | children |

### CollapseItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| name | 面板标识，省略时用自动生成的 id | ^[string] / ^[number] | — |
| title | 标题；传函数可获取 `{ isActive }` | ^[ReactNode] / ^[Function] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| icon | 自定义图标；传节点包在官方 arrow 容器内，传函数完全接管渲染 | ^[ReactNode] / ^[Function]`({ isActive }) => ReactNode` | ArrowRight |
| className | 自定义类名 | ^[string] | — |

### CollapseItem Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 面板内容 | children |
| title | 自定义标题，参数 `{ isActive }` | `title` 函数属性 |
| icon | 自定义图标，参数 `{ isActive }` | `icon` 函数属性 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | React 惯用写法 |
| `<template #title="{ isActive }">` | `title` 函数属性 | 参数结构一致 |
| `<template #icon="{ isActive }">` | `icon` 函数属性 | 函数返回值直接渲染，不再包 arrow 容器 |
| `expose: activeNames / setActiveNames` | 暂未提供 | 受控 value 已可完全控制展开项 |
| 根元素透传 class | 显式 `className` | React 侧不展开任意 HTML 属性 |

**实现说明**：

- 手风琴模式收起当前面板时值变为 `''`（与官方 setActiveNames 行为一致）
- 头部为 `role="button"`，带 `aria-expanded` / `aria-controls` / `aria-labelledby`，支持 Space / Enter 切换
- 内容区与官方 `v-show` 一致：收起时仅 `display: none`，面板内部状态得以保留
- `beforeCollapse` 返回 Promise 时等待结果，reject 视为阻止切换
- 官方用 `el-collapse-transition` 做高度动画，React 侧当前为直接显隐（未复刻过渡动画，类名与结构一致）
