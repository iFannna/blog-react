---
title: "Splitter 分隔面板"
description: "自由切分区域，可以水平或垂直方向分隔并拖拽调整各区域的大小。"
group: 基础组件
order: 110
---

# Splitter 分隔面板

自由切分区域，可以水平或垂直方向分隔并拖拽调整各区域的大小。

## 基础用法

:::demo 最基础的用法，不传默认尺寸时各面板自动均分。这里的  `size="30%"` 表示首个面板占 30%，第二个面板设了  `min=200`，拖拽时不会被压到 200px 以下。

splitter/basic

:::

## 垂直布局

:::demo 通过 `layout="vertical"` 改成垂直方向。

splitter/vertical

:::

## 可折叠

:::demo 配置 `collapsible` 提供快捷收起能力。可以用  `min` 阻止收起后通过拖拽再展开。

splitter/collapsible

:::

## 禁用拖拽

:::demo 任一面板的 `resizable` 为 false 时，相邻分隔条都会禁用拖拽。

splitter/disableDrag

:::

## 面板尺寸

:::demo `size` 配合 `onSizeChange` 即官方的  `v-model:size`，可以读取面板当前尺寸。

splitter/size

:::

## 懒更新

:::demo 开启 `lazy` 后，拖拽过程中不实时更新面板尺寸，只在拖拽结束 后一次性更新。

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
