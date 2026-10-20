---
title: "Page Header 页头"
description: "如果页面的路径比较简单，推荐使用页头组件而不是面包屑。"
group: 导航
order: 70
---

# Page Header 页头

如果页面的路径比较简单，推荐使用页头组件而不是面包屑。

## 完整示例

:::demo 页头包含面包屑、图标、标题、内容、右侧操作区与下方主内容。

page-header/complete

:::

## 基础用法

:::demo 标准页头，适用于简单场景。通过 `onBack` 监听返回区点击。

page-header/basic

:::

## 自定义图标

:::demo 默认图标可能不满足需求，可通过 `icon` 传入自定义图标。

page-header/custom-icon

:::

## 无图标

:::demo 有时页面元素很多，不想显示图标时，将 `icon` 设为 `""` 即可。

page-header/no-icon

:::

## 面包屑

:::demo 通过 `breadcrumb` 为页头添加面包屑，向用户提供路由信息。

page-header/breadcrumb

:::

## 附加操作区

:::demo 页头可以按需扩展，通过 `extra` 添加额外的操作区，实现更丰富的交互。

page-header/additional-sections

:::

## 主体内容

:::demo 有时希望页头下方展示相应内容，可使用 `children`（对应官方 default 插槽）。

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
