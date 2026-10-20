---
title: "Tag 标签"
description: "用于标记和选择。"
group: 数据展示
order: 170
---

# Tag 标签

用于标记和选择。

## 基础用法

:::demo 由 `type` 属性来选择 Tag 的类型。

tag/basic

:::

## 可关闭标签

:::demo 设置 `closable` 属性可以定义一个标签是否可移除， 移除时触发 `onClose` 事件。

tag/removable

:::

## 动态编辑标签

:::demo 动态编辑标签可以通过点击标签关闭按钮后触发的 `onClose` 事件来实现。

tag/editable

:::

## 尺寸

:::demo Tag 组件提供除了默认值以外的三种尺寸，可以在不同场景下选择合适的尺寸。

tag/sizes

:::

## 主题

:::demo Tag 组件提供了三种主题，`dark`、`light`、 `plain`，通过 `effect` 属性来设置。

tag/theme

:::

## 圆角

:::demo Tag 组件可以设置 `round` 属性来让标签变成圆角。

tag/rounded

:::

## 可选中标签

:::demo 使用 `ElCheckTag` 可以实现可切换选中状态的标签。

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
