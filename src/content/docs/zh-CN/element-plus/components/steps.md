---
title: "Steps 步骤条"
description: "引导用户按照流程完成任务的导航条。"
group: 导航
order: 80
---

# Steps 步骤条

引导用户按照流程完成任务的导航条。

## 基础用法

:::demo 通过按钮推进当前步骤，完成后以 success 状态展示。

steps/basic

:::

## 状态

:::demo `finishStatus` 与 `processStatus` 控制已完成与进行中步骤的状态， 支持 success 与 error。

steps/with-status

:::

## 居中对齐

:::demo 设置 `alignCenter` 让标题与描述居中。

steps/centered

:::

## 带描述

:::demo 通过 description 为每个步骤补充说明。

steps/with-description

:::

## 带图标

:::demo 通过 icon 替换默认的序号。

steps/with-icon

:::

## 纵向步骤条

:::demo 设置 `direction="vertical"` 纵向排列，容器需有确定高度。

steps/vertical

:::

## 简洁风格

:::demo 设置 `simple` 应用简洁样式，可通过 `space` 指定间距。

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `<slot name="icon">` | `icon` 属性 | 传节点 |
| 子项经 provide/inject 回写状态 | 由父组件 cloneElement 注入 index | 行为等价 |
| `@change` | `onChange` | 仅在 active 值变化后触发，不回调初始值 |
| 根元素透传 class/style | 显式 `className` / `style` | React 侧不展开任意 HTML 属性 |

**实现说明**：

- 子项状态推导与官方 updateStatus 一致：下标小于 `active` 取 `finishStatus`，等于取 `processStatus`，其余为 `wait`；显式传 `status` 时以它为准
- flex 布局与官方一致：非居中横向步骤按 `100 / (stepCount - 1)%` 计算 `flexBasis`，最后一项限宽 `100 / stepCount%`；传入 `space` 时改用固定间距
- 步骤根节点按方向输出 `is-horizontal` / `is-vertical` / `is-simple`，最后一项在无 space 且非居中时带 `is-flex`，与 theme-chalk 选择器对齐
- 连接线进度与官方 calcProgress 一致：`wait` / `process` 宽度为 0，其余状态铺满并补 1px 边框；纵向时改用高度
- success / error 状态分别渲染对勾与叉号图标，带 `is-status` 类；简洁模式下不渲染序号
