---
title: "Steps 步骤条"
description: "引导用户按照流程完成任务的导航条。"
group: 导航
order: 80
---

# Steps 步骤条

引导用户按照流程完成任务的分步导航条，可根据实际应用场景设定步骤，步骤不得少于 2 步。

## 基础用法

简单的步骤条。

:::demo 设置 `active` 属性，接受一个 `Number`，表明步骤的 index，从 0 开始。需要定宽的步骤条时，设置 `space` 属性即可，它接受 `Number`，单位为 `px`，如果不设置，则为自适应。设置 `finish-status` 属性可以改变已经完成的步骤的状态。

steps/basic

:::

## 含状态的步骤条

每一步骤显示出该步骤的状态。

:::demo 也可以使用 `title` 具名插槽，可以用 `slot` 的方式来取代属性的设置，在本文档最后的列表中有所有的插槽可供参考。

steps/with-status

:::

## 居中的步骤条

标题和描述可以居中。

:::demo

steps/centered

:::

## 带描述的步骤栏

每一步都有描述。

:::demo

steps/with-description

:::

## 带图标的步骤条

可以在步骤栏中使用各种自定义图标。

:::demo 通过 `icon` 属性来设置图标，图标的类型可以参考 Icon 组件的文档，除此以外，还能通过具名 `slot` 来使用自定义的图标。

steps/with-icon

:::

## 垂直的步骤条

垂直方向的步骤条。

:::demo 只需要在 `el-steps` 元素中设置 `direction` 属性为 `vertical` 即可。

steps/vertical

:::

## 简洁风格的步骤条

设置 `simple` 可应用简洁风格，该条件下 `align-center` / `description` / `direction` / `space` 都将失效。

:::demo

steps/simple

:::

## Steps API

### Steps Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| active | 当前激活步骤的下标 | ^[number] | 0 |
| space | 每个步骤的间距，省略时自适应，支持百分比 | ^[number] / ^[string] | — |
| direction | 显示方向 | ^[enum]`'horizontal' \| 'vertical'` | horizontal |
| alignCenter | 是否居中对齐（横向有效） | ^[boolean] | false |
| simple | 是否简洁模式 | ^[boolean] | false |
| processStatus | 当前步骤的状态 | ^[enum]`'wait' \| 'process' \| 'finish' \| 'error' \| 'success'` | process |
| finishStatus | 已完成步骤的状态 | ^[enum]`同上` | finish |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Steps Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 当前激活步骤变化，等价官方 `change` | ^[Function]`(newActive, oldActive) => void` |

### Steps Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 步骤子项 | children |

### Step Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | ^[ReactNode] | — |
| description | 描述 | ^[ReactNode] | — |
| icon | 自定义图标 | ^[ReactNode] | — |
| status | 当前步骤状态，传入后覆盖自动推导 | ^[enum]`'wait' \| 'process' \| 'finish' \| 'error' \| 'success'` | — |
| className | 自定义类名 | ^[string] | — |

### Step Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| icon | 自定义图标 | `icon` 属性 |
| title | 自定义标题 | `title` 属性 |
| description | 自定义描述 | `description` 属性 |
