---
title: "Popconfirm 气泡确认框"
description: "点击元素，弹出气泡样式的确认框。"
group: 反馈组件
order: 80
---

# Popconfirm 气泡确认框

点击某个元素弹出一个简单的气泡确认框

## 展示位置

Popconfirm 提供 9 种展示位置。

:::demo 使用 `title` 属性来设置点击参考元素时显示的信息。由 `placement` 属性决定 Popconfirm 的位置。该属性值格式为：`[方向]-[对齐位置]`，可供选择的四个方向分别是`top`、`left`、`right`、`bottom`，可供选择的三种对齐方式分别是`start`、`end`、`null`，默认的对齐方式为null。以 `placement="left-end"` 为例，气泡确认框会显示在悬停元素的左侧，且提示信息的底部与悬停元素的底部对齐。

popconfirm/placement

:::

## 基础用法

Popconfirm 的属性与 Popover 很类似，因此对于重复属性，请参考 Popover 的文档，在此文档中不做详尽解释。

:::demo 在 Popconfirm 中，只有 `title` 属性可用，`content` 属性会被忽略。

popconfirm/basic-usage

:::

## 自定义弹出框的内容

可以在 Popconfirm 中自定义内容。

:::demo

popconfirm/customize

:::

## 多种让 Popconfirm 出现的方法

点击按钮触发事件

:::demo

popconfirm/trigger-event

:::

## API

### Attributes

| 属性名 | 说明 | 类型 | 默认 |
| --- | --- | --- | --- |
| title | 标题 | ^[string] | — |
| effect <span class="docs-version-tag">2.11.2</span> | Tooltip 主题，内置了 dark / light 两种 | ^[enum] / ^[string] | light |
| confirm-button-text | 确认按钮文字 | ^[string] | — |
| cancel-button-text | 取消按钮文字 | ^[string] | — |
| confirm-button-type | 确认按钮类型 | ^[enum] | primary |
| cancel-button-type | 取消按钮类型 | ^[enum] | text |
| icon | 自定义图标 | ^[string] / ^[Component] | QuestionFilled |
| icon-color | Icon 颜色 | ^[string] | #f90 |
| hide-icon | 是否隐藏 Icon | ^[boolean] | false |
| hide-after | 关闭时的延迟 | ^[number] | 200 |
| teleported | 是否将 popover 的下拉列表插入至 body 元素 | ^[boolean] | true |
| persistent | 当 popover 组件长时间不触发且 persistent 属性设置为 false 时，popover 将会被删除 | ^[boolean] | false |
| width | 弹层宽度，最小宽度 150px | ^[string] / ^[number] | 150 |
| tooltip | 继承自 Tooltip 的所有属性，但不包括：popper-class、popper-style、fallback-placements | — | — |

### Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| confirm | 点击确认按钮时触发 | ^[Function] |
| cancel | 点击取消按钮时触发 | ^[Function] |

### Slots

| 插槽名 | 说明 | 类型 |
| --- | --- | --- |
| reference | 触发 Popconfirm 显示的 HTML 元素 | — |
| actions <span class="docs-version-tag">2.8.1</span> | 页脚的内容 | ^[object] |

### 暴露

| 方法名 | 详情 | Type |
| --- | --- | --- |
| popperRef <span class="docs-version-tag">2.10.7</span> | el-popper 组件实例 | ^[object] |
| hide <span class="docs-version-tag">2.10.7</span> | hide popconfirm | ^[Function] |
