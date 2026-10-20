---
title: "Container 布局容器"
description: "用于布局的容器组件，方便快速搭建页面的基本结构。"
group: 基础组件
order: 40
---

# Container 布局容器

用于布局的容器组件，方便快速搭建页面的基本结构：

`<el-container>`：外层容器。当子元素中包含 `<el-header>` 或 `<el-footer>` 时，全部子元素会垂直上下排列，否则会水平左右排列。

`<el-header>`：顶栏容器。

`<el-aside>`：侧边栏容器。

`<el-main>`：主要区域容器。

`<el-footer>`：底栏容器。

:::tip

以上组件采用了 flex 布局，使用前请确定目标浏览器是否兼容。此外， `<el-container>`的直接子元素必须是后四个组件中的一个或多个。后四个组件的父元素必须是一个 `<el-container>`

:::

## 常见页面布局

:::demo

container/layout-hm

:::

:::demo

container/layout-hmf

:::

:::demo

container/layout-am

:::

:::demo

container/layout-ham

:::

:::demo

container/layout-hamf

:::

:::demo

container/layout-ahm

:::

:::demo

container/layout-ahmf

:::

## 例子

:::demo

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
