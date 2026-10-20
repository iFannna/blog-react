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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model:size` | `size` + `onSizeChange` | React 惯用写法 |
| `layout` | 同名 prop | 一致 |
| `resize-start` / `resize` / `resize-end` / `collapse` 事件 | `onResizeStart` / `onResize` / `onResizeEnd` / `onCollapse` | 命名转为 React 的 on 前缀 |
| `start-collapsible` / `end-collapsible` 插槽 | `startCollapsible` / `endCollapsible` prop | 插槽内容作为 prop 传入 |
| `splitterPanelRef` expose | 未实现 | 面板根 div 可通过原生 `ref` / `id` 拿到 |
| Splitter 事件第一次 emit 的 sizes | 取拖拽快照 | 与官方 useResize 的 cachePxSizes 语义一致 |

**未实现的官方能力**：

- 未实现 `collapsible` 的对象形态：官方支持 `{ start?: boolean, end?: boolean }` 按方向分别开关收起按钮，这里只支持布尔整体开关。
- 未实现 `splitterPanelRef` 的组件级 expose（官方 panel 暴露 `splitterPanelRef`）；需要拿到面板 DOM 时直接用普通 DOM 手段获取。
- 面板的排序在官方依赖子组件渲染顺序，这里按面板首次挂载的顺序还原（同一次渲染内的并列面板顺序按挂载先后）。
