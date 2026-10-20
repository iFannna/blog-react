---
title: "Progress 进度条"
description: "用于展示操作进度，告知用户当前状态和预期。"
group: 数据展示
order: 120
---

# Progress 进度条

用于展示操作进度，告知用户当前状态和预期。

## 线形进度条

:::demo Progress 组件设置 `percentage` 属性即可，表示进度条对应的百分比。

progress/linear-progress-bar

:::

## 百分比内显

:::demo 通过 `textInside` 属性将进度条内的百分比显示在内部， 配合 `strokeWidth` 设置更粗的进度条。

progress/internal-percentage

:::

## 自定义颜色

:::demo 通过 `color` 属性自定义进度条颜色， 支持单色、分段数组与函数三种形式。

progress/custom-color

:::

## 环形进度条

:::demo 设置 `type="circle"` 展示环形进度条， `width` 控制圆环画布尺寸。

progress/circular-progress-bar

:::

## 仪表盘形进度条

:::demo 设置 `type="dashboard"` 展示仪表盘形进度条。

progress/dashboard-progress-bar

:::

## 自定义文字

:::demo 通过 `format` 属性自定义进度条文字内容。

progress/customized-content

:::

## 不确定进度

:::demo 设置 `indeterminate` 展示不确定进度，适合无法获知具体进度的场景。

progress/indeterminate-progress

:::

## 条纹进度条

:::demo 通过 `striped` 显示条纹，`stripedFlow` 让条纹流动。

progress/striped-progress

:::

## Progress API

### Progress Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 进度类型 | ^[enum]`'line' \| 'circle' \| 'dashboard'` | line |
| percentage | 百分比，0-100 | ^[number] | 0 |
| status | 当前状态 | ^[enum]`'' \| 'success' \| 'exception' \| 'warning'` | — |
| stroke-width | 线宽，仅 line 类型有效 | ^[number] | 6 |
| stroke-linecap | 线帽 | ^[enum]`'butt' \| 'round' \| 'square'` | round |
| text-inside | 文字是否显示在进度条内部 | ^[boolean] | false |
| width | 环形进度条画布宽度 | ^[number] | 126 |
| show-text | 是否显示文字 | ^[boolean] | true |
| color | 进度条颜色，支持单色、分段、函数 | ^[string] / ^[array] / ^[Function]`(p: number) => string` | — |
| duration | 条纹动画周期（秒） | ^[number] | 3 |
| striped | 是否应用条纹动画 | ^[boolean] | false |
| striped-flow | 是否应用流动效果 | ^[boolean] | false |
| indeterminate | 是否为不确定进度 | ^[boolean] | false |
| format | 文字格式化函数 | ^[Function]`(percentage: number) => string` | `(p) => p + '%'` |

### Progress Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义文字内容，参数为百分比 | `children` 函数 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `<slot :percentage="percentage">` | `children(percentage)` | 函数形式接收百分比 |

**实现说明**：官方 `color` 支持三种形态，React 侧全部保留：
单色字符串、`{ color, percentage }` 分段数组、`(percentage) => string` 函数。
分段数组的简写（纯字符串数组）会按官方逻辑自动补全为等分区间。

环形与仪表盘用 SVG 的 `stroke-dasharray` 绘制，路径与官方逐字符一致
（含 `rate = 0.75` 的仪表盘缺口）。
