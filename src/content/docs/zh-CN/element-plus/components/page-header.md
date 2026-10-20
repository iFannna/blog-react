---
title: "Page Header 页头"
description: "如果页面的路径比较简单，推荐使用页头组件而不是面包屑。"
group: 导航
order: 70
---

# Page Header 页头

如果页面的路径比较简单，推荐使用页头组件而非面包屑组件。

## 完整示例

:::demo

page-header/complete

:::

## 基础用法

简单场景下的标准页头。

:::demo

page-header/basic

:::

## 自定义图标

默认图标可能无法满足您的需求，您可以通过设置`icon`属性来自定义图标，示例如下。

:::demo

page-header/custom-icon

:::

## 无图标

有时，页面全是元素，您可能不想展示页面上方的图标，您可以设置`icon`属性值为`""`来去除它。

:::demo

page-header/no-icon

:::

## 面包屑导航

使用页头组件，您可以通过添加插槽 `breadcrumb` 来设置面包屑路由导航。

:::demo

page-header/breadcrumb

:::

## 额外操作部分

头部可能会变得很复杂，您可以在头部添加更多的区块，以允许丰富的交互。

:::demo

page-header/additional-sections

:::

## 主要内容

有时我们想让页头显示一些协同响应内容，我们可以使用 `default` 插槽。

:::demo

page-header/main-content

:::

## PageHeader API

### PageHeader Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | 页头图标，传 `""` 可隐藏图标 | ^[ReactNode] | 内置 Back 箭头 |
| title | 主标题；省略时回退到内置返回文案 | ^[string] | `''` |
| content | 标题右侧内容 | ^[string] | `''` |
| className / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### PageHeader Slot Props（对应官方 Slots）

React 无具名插槽，官方每个插槽对应一个同义 prop：

| Prop | 对应官方插槽 | 说明 |
| --- | --- | --- |
| breadcrumb | `#breadcrumb` | 第一行面包屑，渲染 `.el-page-header__breadcrumb` 并加 `.el-page-header--has-breadcrumb` |
| iconSlot | `#icon` | 自定义图标内容，替换默认图标（不再额外包 `.el-icon`） |
| titleSlot | `#title` | 主标题内容 |
| contentSlot | `#content` | 标题右侧内容 |
| extra | `#extra` | 右侧操作区，加 `.el-page-header--has-extra` |
| children | `#default` | 头部下方主内容，加 `.is-contentful` 与 `.el-page-header__main` |

### PageHeader Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onBack | 点击左侧返回区时触发 | ^[Function]`() => void` |
