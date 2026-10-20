---
title: "Space 间距"
description: "设置组件之间的间距。"
group: 基础组件
order: 100
---

# Space 间距

设置组件之间的间距。

## 基础用法

:::demo 相邻组件间增加间距。默认方向为水平，间距为 small（8px）。

space/basic

:::

## 垂直布局

:::demo 使用 `direction="vertical"` 让组件纵向排列。

space/vertical-layout

:::

## 控制间距大小

:::demo 通过单选组切换 small / default / large 三档预设间距。

space/control-size

:::

## 自定义间距大小

:::demo 通过滑块设置任意数字间距。

space/customized-size

:::

## 对齐方式

:::demo 通过 `alignment` 设置交叉轴对齐方式。

space/alignment

:::

## 自动换行

:::demo 设置 `wrap` 后超出容器宽度会自动换行。

space/auto-wrapping

:::

## 填满整行

:::demo `fill` 让子项拉伸填满整行。

space/fill

:::

## 填充比例

:::demo `fillRatio` 控制每个子项的最小宽度百分比，并可切换排列方向。

space/fill-ratio

:::

## 字符串分隔符

:::demo 通过 `spacer` 传入字符串作为间隔元素。

space/literal-type-spacer

:::

## 节点分隔符

:::demo `spacer` 也可传入任意节点，例如垂直分割线。

space/vnode-type-spacer

:::

## Space API

### Space Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| direction | 排列方向 | ^[enum]`'horizontal' \| 'vertical'` | horizontal |
| size | 间距，可传尺寸名、数字或 [横向, 纵向] 元组 | ^[enum]`'small' \| 'default' \| 'large'` / ^[number] / ^[array]`[number, number]` | small |
| alignment | 交叉轴对齐方式 | ^[string]`CSS align-items 取值` | center |
| wrap | 是否自动换行 | ^[boolean] | false |
| fill | 是否让子项填满整行 | ^[boolean] | false |
| fillRatio | 填满时单个子项的最小宽度百分比 | ^[number] | 100 |
| spacer | 自定义间隔元素，可传字符串或节点 | ^[ReactNode] | — |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Space Events

无。

### Space Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 需要设置间距的内容 | `children` |

### Exposes

无。
