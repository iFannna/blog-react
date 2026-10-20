---
title: "Switch 开关"
description: "表示两种相互对立的状态间的切换，多用于触发「开/关」。"
group: 表单组件
order: 200
---

# Switch 开关

表示两种相互对立的状态间的切换，多用于触发「开/关」。

## 基础用法

:::demo 绑定 `v-model` 到一个 `Boolean` 类型的变量。可以使用 `--el-switch-on-color` 属性与 `--el-switch-off-color` 属性来设置开关的背景色。

switch/basic

:::

## 尺寸

:::demo

switch/sizes

:::

## 文字描述

使用`active-text`属性与`inactive-text`属性来设置开关的文字描述。使用 `inline-prompt` 属性来控制文本是否显示在点内。

:::demo 使用`active-text`属性与`inactive-text`属性来设置开关的文字描述。

switch/text-description

:::

## 显示自定义图标

:::tip

使用 `inactive-icon` 和 `active-icon` 属性来添加图标。您可以传递组件名称的字符串（提前注册）或组件本身是一个 SVG Vue 组件。 Element Plus 提供了一套图标，你可以在 [icon](./icon) 找到它们。

:::

:::demo 使用 `inactive-icon` 和 `active-icon` 属性来添加图标。使用 `inline-prompt` 属性来控制图标显示在点内。

switch/custom-icons

:::

## 扩展的 value 类型

:::demo 你可以设置 `active-value` 和 `inactive-value` 属性，它们接受 `Boolean`、`String` 或 `Number` 类型的值。

switch/extended-value-types

:::

## 禁用状态

:::demo 设置`disabled`属性，接受一个`Boolean`，设置`true`即可禁用。

switch/disabled

:::

## 加载状态

:::demo 设置`loading`属性，接受一个`Boolean`，设置`true`即加载中状态。

switch/loading

:::

## 阻止切换

:::demo 设置`beforeChange`属性，若返回 false 或者返回 Promise 且被 reject，则停止切换。

switch/prevent-switching

:::

## 自定义动作图标 ^(2.3.9)

:::demo 使用 `inactive-action-icon` 和 `active-action-icon` 属性来添加图标。

switch/custom-action-icon

:::

## 自定义操作图标 ^(2.4.4)

:::demo 使用 `active-action` 和 `inactive-action` 属性来添加图标。

switch/custom-action-slot

:::

## Switch API

### Switch Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| checked | 布尔模式下的选中态 | ^[boolean] | false |
| value | 自定义值模式下的当前值 | ^[boolean] / ^[string] / ^[number] | — |
| active-value | 开启时的值，传入即启用自定义值模式 | ^[boolean] / ^[string] / ^[number] | true |
| inactive-value | 关闭时的值 | ^[boolean] / ^[string] / ^[number] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| loading | 是否处于加载中 | ^[boolean] | false |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| width | 开关宽度 | ^[string] / ^[number] | — |
| inline-prompt | 文字或图标是否显示在圆点内部 | ^[boolean] | false |
| active-text | 开启时的文字 | ^[string] | — |
| inactive-text | 关闭时的文字 | ^[string] | — |
| active-icon | 开启时的图标，优先于 active-text | ^[Component] | — |
| inactive-icon | 关闭时的图标，优先于 inactive-text | ^[Component] | — |
| active-action-icon | 圆点上开启态的动作图标 | ^[Component] | — |
| inactive-action-icon | 圆点上关闭态的动作图标 | ^[Component] | — |
| active-action-content | 圆点上开启态的动作内容，优先于 active-action-icon | ^[ReactNode] | — |
| inactive-action-content | 圆点上关闭态的动作内容，优先于 inactive-action-icon | ^[ReactNode] | — |
| name | 原生 name 属性 | ^[string] | — |
| id | 原生 id 属性 | ^[string] | — |
| tabindex | 原生 tabindex 属性 | ^[string] / ^[number] | — |
| aria-label | 无障碍标签 | ^[string] | — |
| before-change | 切换前钩子，返回 false 或 reject 的 Promise 阻止切换 | ^[Function]`() => boolean \| Promise<boolean>` | — |

### Switch Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onCheckedChange | 布尔模式下选中态变化 | ^[Function]`(checked: boolean) => void` |
| onChange | 自定义值模式下值变化 | ^[Function]`(value: SwitchValue) => void` |

### Switch Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| active | 开启态文字/图标内容 | `activeContent` |
| inactive | 关闭态文字/图标内容 | `inactiveContent` |
| active-action | 开启态动作区内容 | `activeActionContent` |
| inactive-action | 关闭态动作区内容 | `inactiveActionContent` |

### Switch Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 手动聚焦开关 | ^[Function]`() => void` |
| checked | 当前是否开启 | ^[boolean] |
