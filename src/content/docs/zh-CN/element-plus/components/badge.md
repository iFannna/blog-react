---
title: "Badge 徽章"
description: "按钮和图标上的数字或状态标记。"
group: 数据展示
order: 20
---

# Badge 徽章

按钮和图标上的数字或状态标记。

## 基础用法

:::demo 通过 `value` 设置显示值，`type` 设置徽章类型， `color` 可自定义背景色。

badge/basic

:::

## 最大值

:::demo 通过 `max` 属性设置最大值，超出时显示  `{max}+`。仅在 `value` 为数字时生效。

badge/max

:::

## 自定义内容

:::demo `value` 为字符串时可直接显示文本；也可以通过  `content` 渲染函数自定义徽章内容。

badge/customize

:::

## 小圆点

:::demo 通过 `isDot` 属性设置为小圆点，不显示具体数值。

badge/dot

:::

## 偏移量

:::demo 通过 `offset` 属性设置徽标相对于默认位置的偏移， 格式为 `[left, top]`。

badge/offset

:::

## Badge API

### Badge Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 显示值 | ^[string] / ^[number] | — |
| max | 最大值，超出显示 {max}+ 形式，仅 value 为数字时生效 | ^[number] | 99 |
| is-dot | 是否显示为小圆点 | ^[boolean] | false |
| hidden | 是否隐藏徽章 | ^[boolean] | false |
| type | 徽章类型 | ^[enum]`'primary' \| 'success' \| 'warning' \| 'info' \| 'danger'` | danger |
| show-zero | value 为 0 时是否显示 | ^[boolean] | true |
| color | 自定义圆点背景色 | ^[string] | — |
| badge-style | 徽章样式 | ^[object]`CSSProperties` | — |
| badge-class | 徽章类名 | ^[string] | — |
| offset | 徽章偏移量 [x, y] | ^[array]`[number, number]` | [0, 0] |

### Badge Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 徽章包裹的内容 | `children` |
| content | 自定义徽章内容，参数为计算后的值 | `content` |
