---
title: "Tag 标签"
description: "用于标记和选择。"
group: 数据展示
order: 170
---

# Tag 标签

用于标记和选择。

## 基础用法

:::demo 由 `type` 属性来选择 tag 的类型。也可以通过 `color` 属性来自定义背景色。

tag/basic

:::

## 可移除标签

:::demo 设置 `closable` 属性可以定义一个标签是否可移除。它接受一个 `Boolean`。默认的标签移除时会附带渐变动画。如果不想使用，可以设置 `disable-transitions` 属性，它接受一个 `Boolean`，`true` 为关闭。当 Tag 被移除时会触发 `close` 事件。

tag/removable

:::

## 动态编辑标签

动态编辑标签可以通过点击标签关闭按钮后触发的 `close` 事件来实现。

:::demo

tag/editable

:::

## 不同尺寸

Tag 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的按钮尺寸。

:::demo 使用 `size` 属性来设置额外尺寸, 可选值包括 `large`, `default` 或 `small`.

tag/sizes

:::

## 主题

Tag 组件提供了三个不同的主题：`dark`、`light` 和 `plain`。

:::demo 通过设置 `effect` 属性来改变主题，默认为 `light`。

tag/theme

:::

## 圆角标签

Tag 可以像按钮组件一样变为圆角。

:::demo

tag/rounded

:::

## 可选中的标签

有时候因为业务需求，我们可能会需要用到类似复选框的标签，但是**按钮式的复选框**的样式又不满足需求，此时我们就可以用到 `check-tag`组件。您可以在^(2.5.4)中使用 `type` 属性。

:::demo check-tag 的基础使用方法，check-tag 提供的 API 非常简单。

tag/checkable

:::

## Tag API

### Tag Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 主题类型 | ^[enum]`'primary' \| 'success' \| 'info' \| 'warning' \| 'danger'` | primary |
| closable | 是否可关闭 | ^[boolean] | false |
| disable-transitions | 是否禁用关闭动画 | ^[boolean] | false |
| hit | 是否高亮边框 | ^[boolean] | false |
| color | 自定义背景色 | ^[string] | — |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| effect | 主题 | ^[enum]`'dark' \| 'light' \| 'plain'` | light |
| round | 是否圆角 | ^[boolean] | false |
| close-label | 关闭按钮的无障碍标签 | ^[string] | 取 locale 的 el.tag.close |

### Tag Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onClose | 关闭时触发 | ^[Function]`(event: MouseEvent) => void` |
| onClick | 点击时触发 | ^[Function]`(event: MouseEvent) => void` |

### Tag Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 标签内容 | `children` |
