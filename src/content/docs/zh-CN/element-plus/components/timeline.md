---
title: "Timeline 时间线"
description: "可视化地呈现时间流信息。"
group: 数据展示
order: 180
---

# Timeline 时间线

可视化地呈现时间流信息。

## 基础用法

:::demo Timeline 可拆分成多个按照时间戳排列的活动，时间戳是其区分于其他控件的重要特征，使用时注意与 Steps 步骤条等区分。

timeline/basic

:::

## 模式

使用 `mode` 来控制时间线与内容的相对位置。

:::tip

在 `2.13.1` 之后，`el-timeline` 显式设置了内边距样式。如果您在项目中覆盖了 `ul` 标签的填充样式，请检查以确保布局正确。

:::

:::demo

timeline/mode

:::

## 自定义节点样式

:::demo 可根据实际场景自定义节点尺寸、颜色，或直接使用图标。

timeline/custom-node

:::

## 自定义时间戳

:::demo 当内容在垂直方向上过高时，可将时间戳置于内容之上。

timeline/custom-timestamp

:::

## 垂直居中

:::demo 垂直居中样式的 Timeline-Item

timeline/center

:::

## 反向

:::demo 使用 `reverse` 属性来控制节点的顺序。

timeline/reverse

:::

## Timeline API

### Timeline Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| mode | 时间线与内容的相对位置 | ^[enum]`'start' \| 'alternate' \| 'alternate-reverse' \| 'end'` | start |
| reverse | 是否反向排列子项 | ^[boolean] | false |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Timeline Events

无。

### Timeline Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 时间线子项 | `children`（ElTimelineItem 集合） |

### Exposes

无。

## Timeline-Item API

### Timeline-Item Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| timestamp | 时间戳内容 | ^[ReactNode] | '' |
| hideTimestamp | 是否隐藏时间戳 | ^[boolean] | false |
| center | 内容是否居中 | ^[boolean] | false |
| placement | 时间戳相对内容的位置 | ^[enum]`'top' \| 'bottom'` | bottom |
| type | 节点类型 | ^[enum]`'primary' \| 'success' \| 'warning' \| 'danger' \| 'info'` | '' |
| color | 节点颜色，传入后覆盖 type 的配色 | ^[string] | '' |
| size | 节点尺寸 | ^[enum]`'normal' \| 'large'` | normal |
| icon | 自定义节点图标（渲染在 node 内） | ^[ReactNode] | — |
| dot | 完全自定义节点内容，等价官方 dot 插槽 | ^[ReactNode] | — |
| hollow | 是否空心节点 | ^[boolean] | false |
| className | 自定义类名 | ^[string] | — |

### Timeline-Item Events

无。

### Timeline-Item Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义内容 | `children` |
| dot | 自定义节点 | `dot` 属性 |

### Exposes

无。
