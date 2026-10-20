---
title: "Splitter 分隔面板"
description: "自由切分区域，可以水平或垂直方向分隔并拖拽调整各区域的大小。"
group: 基础组件
order: 110
---

# Splitter 分隔面板 <span class="docs-version-tag docs-version-tag--beta">beta</span>

可将区域水平或垂直分隔，并可自由拖动以调整各个区域的大小。

## 基础用法

:::demo 最基本的用法，如果未传入默认尺寸，将自动平均分配。

splitter/basic

:::

## 垂直布局

:::demo 使用垂直方向。

splitter/vertical

:::

## 可折叠

:::demo 配置 `collapsible` 可提供快速收缩功能。你可以使用 `min` 属性来防止折叠后通过拖拽进行扩展。

splitter/collapsible

:::

## 禁用拖动

:::demo 当任一面板禁用 `resizable` 时，拖拽功能将被禁用。

splitter/disableDrag

:::

## 面板大小

:::demo `v-model:size` 可以获取面板的大小。

splitter/size

:::

## 延迟^(2.11.0)

:::demo 当启用`lazy`时，面板大小将不会在拖动时实时更新，只能在拖动结束后更新。

splitter/lazy

:::

## Splitter API

### Splitter Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| layout | 布局方向 | ^[enum]`'horizontal' \| 'vertical'` | horizontal |
| lazy | 是否开启懒更新 | ^[boolean] | false |
| class-name | 根元素类名 | ^[string] | — |

### Splitter Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onResizeStart | 开始拖拽某条分隔条 | ^[Function]`(index: number, sizes: number[]) => void` |
| onResize | 拖拽过程中持续触发（lazy 模式不触发） | ^[Function]`(index: number, sizes: number[]) => void` |
| onResizeEnd | 拖拽结束 | ^[Function]`(index: number, sizes: number[]) => void` |
| onCollapse | 折叠/展开某面板 | ^[Function]`(index: number, type: 'start' \| 'end', sizes: number[]) => void` |

## SplitterPanel API

### SplitterPanel Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 面板尺寸（像素或百分比）。配合 onSizeChange 即 `v-model:size` | ^[string] / ^[number] | — |
| min | 面板最小尺寸 | ^[string] / ^[number] | — |
| max | 面板最大尺寸 | ^[string] / ^[number] | — |
| resizable | 是否可拖拽调整 | ^[boolean] | true |
| collapsible | 是否显示收起按钮 | ^[boolean] | false |
| start-collapsible | 起始侧收起按钮的自定义内容，对应 start-collapsible 插槽 | ^[ReactNode] | — |
| end-collapsible | 结束侧收起按钮的自定义内容，对应 end-collapsible 插槽 | ^[ReactNode] | — |

### SplitterPanel Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onSizeChange | 面板尺寸变化 | ^[Function]`(size: number) => void` |
