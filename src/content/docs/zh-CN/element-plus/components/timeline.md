---
title: "Timeline 时间线"
description: "可视化地呈现时间流信息。"
group: 数据展示
order: 180
---

# Timeline 时间线

可视化地呈现时间流信息。

## 基础用法

:::demo 时间线可以拆解为多个活动，时间戳是区别于其他组件的重要特征。

timeline/basic

:::

## 垂直居中

:::demo `center` 让内容在轴线两侧居中显示。

timeline/center

:::

## 自定义节点

:::demo 节点可以自定义尺寸、颜色、图标与空心样式。

timeline/custom-node

:::

## 自定义时间戳

:::demo 内容过高时，可以把时间戳放在内容上方（`placement="top"`）。

timeline/custom-timestamp

:::

## 模式

:::demo 通过 `mode` 设置时间线与内容的相对位置，支持 start / alternate / alternate-reverse / end。

timeline/mode

:::

## 反向

:::demo 通过 `reverse` 反转节点顺序。

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `<slot name="dot">` | `dot` 属性 | 传节点，渲染在 `.el-timeline-item__dot` |
| `icon` 接受图标组件 | `icon` 接受 ReactNode | 与官方一致，渲染在 node 内 |
| `reverse` 在 Timeline 内 reverse 子节点 | 对 children 数组 reverse | 行为一致 |

**实现说明**：

- `mode` 会同时输出到 `ul.el-timeline.is-{mode}` 与每个 `li.el-timeline-item.is-{mode}`，与 theme-chalk 的选择器对齐
- `reverse` 反转 children 顺序，时间戳与内容结构不变
- 节点结构与官方一致：默认节点为 `el-timeline-item__node`（带 size / type / is-hollow 类），自定义图标渲染在该节点内部；`dot` 则替换为 `el-timeline-item__dot`
- 时间戳在 `placement="top"` 时渲染在内容上方，否则在下方；`hideTimestamp` 可完全隐藏
