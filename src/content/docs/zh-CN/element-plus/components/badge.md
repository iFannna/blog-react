---
title: "Badge 徽章"
description: "按钮和图标上的数字或状态标记。"
group: 数据展示
order: 20
---

# Badge 徽章

按钮和图标上的数字或状态标记。

## 基础用法

可以用来展示新消息的数量。

:::demo 数量值可接受 Number 或 String。

badge/basic

:::

## 最大值

你还可以自定义最大值

:::demo 由 max 属性定义，接受 Number 值。请注意，仅在值也是 Number 时起作用。

badge/max

:::

## 自定义显示内容

你也可以展示除数字以外你想要展示的任何值。或者您可以使用 `content` 栏位自定义内容。

:::demo 当 value 是 String 时，可以显示自定义文字。或者使用 `content` 插槽。

badge/customize

:::

## 小红点

通过一个小红点标记来告知用户有新内容。

:::demo 使用 `is-dot` 属性。是个布尔值。

badge/dot

:::

## 偏移量 ^(2.7.0)

:::demo 设置徽章点的偏移，格式是[左，顶部]， 代表状态点从左侧和默认位置顶部的偏移。

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
