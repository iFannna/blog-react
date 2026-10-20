---
title: "Progress 进度条"
description: "用于展示操作进度，告知用户当前状态和预期。"
group: 数据展示
order: 120
---

# Progress 进度条

用于展示操作进度，告知用户当前状态和预期。

## 直线进度条

:::demo Progress 组件设置 `percentage` 属性即可，表示进度条对应的百分比。该属性**必填**，并且必须在 `0-100` 的范围内。你可以通过设置 `format` 来自定义文字显示的格式。

progress/linear-progress-bar

:::

## 进度条内显示百分比标识

百分比不占用额外空间，适用于文件上传等场景。

:::demo Progress 组件可通过 `stroke-width` 属性更改进度条的高度，并可通过 `text-inside` 属性来改变进度条内部的文字。

progress/internal-percentage

:::

## 自定义进度条的颜色

可以通过 `color` 属性来设置进度条的颜色。该属性可以接受十六进制颜色值，函数和数组。

:::demo

progress/custom-color

:::

## 环形进度条

:::demo Progress 组件可通过 `type` 属性来指定使用环形进度条，在环形进度条中，还可以通过 `width` 属性来设置其大小。

progress/circular-progress-bar

:::

## 仪表盘形进度条

您也可以指定 `type` 属性到 `dashboard` 使用控制面板进度栏。

:::demo

progress/dashboard-progress-bar

:::

## 自定义内容

:::demo 通过默认插槽添加自定义内容。

progress/customized-content

:::

## 动画进度条

:::demo 使用 `indeterminate` 属性来设置不确定的进度， `duration` 来控制动画持续时间。

progress/indeterminate-progress

:::

## 条纹进度条

:::demo 通过设置 `striped` 属性获取条纹进度条。也可以使用 `striped-flow` 属性来使条纹流动起来。 使用`duration` 属性来控制条纹流动的速度。

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
