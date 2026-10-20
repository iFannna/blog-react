---
title: "Container 布局容器"
description: "用于布局的容器组件，方便快速搭建页面的基本结构。"
group: 基础组件
order: 40
---

# Container 布局容器

用于布局的容器组件，方便快速搭建页面的基本结构。

## 上中

:::demo `ElHeader` 与 `ElMain` 组合，容器自动纵向排列。

container/layout-hm

:::

## 上中下

:::demo 再加入 `ElFooter`。

container/layout-hmf

:::

## 左右

:::demo 容器直接包含 `ElAside` 时自动横向排列，可同时放置两侧边栏。

container/layout-am

:::

## 左侧边栏 + 上中

:::demo 外层横向，内层再嵌套上下结构。

container/layout-ham

:::

## 左侧边栏 + 上中下

:::demo

container/layout-hamf

:::

## 上 + 左侧边栏 + 中

:::demo

container/layout-ahm

:::

## 上 + 左侧边栏 + 中下

:::demo

container/layout-ahmf

:::

## 完整布局

:::demo 侧边菜单、顶栏与内容区组合的完整应用布局，内容区可滚动。

container/example

:::

## Container API

### Container Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 布局方向。不传时根据是否含 Aside 自动判断 | ^[enum]`'horizontal' \| 'vertical'` | — |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Container Events

无。

### Container Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 容器内容 | `children` |

### Header Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| height | 顶栏高度 | ^[string] | 60px |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Aside Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 侧边栏宽度 | ^[string] | 300px |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Main Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Footer Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| height | 底栏高度 | ^[string] | 60px |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Slots

Header / Aside / Main / Footer 均只有默认插槽，React 侧对应 `children`。

### Exposes

无。

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| 遍历子 vnode 类名检测 Aside | Aside 通过 context 主动注册 | 行为一致，React 侧更可靠 |
| 任意 HTML 属性透传 | 仅 `className` / `style` | React 组件显式声明 props |
| 根标签 `section / header / aside / main / footer` | 相同 | 结构一致 |

**实现说明**：官方通过遍历子 vnode 的类名判断是否存在 `el-aside`，
从而决定默认布局方向。React 里函数组件的 `props.className` 拿不到组件内部
拼好的类名，因此改为由 `ElAside` 挂载时通过 context **主动注册**：

- 显式传 `direction` 时以它为准
- 未传且直接子级含 Aside 时横向布局（Aside 在左、Main 在右）
- 未传且不含 Aside 时纵向堆叠
- 嵌套容器各自独立判断方向，与官方示例的七种布局一致
