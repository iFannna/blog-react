---
title: "Breadcrumb 面包屑"
description: "显示当前页面的路径，快速返回之前的页面。"
group: 导航
order: 40
---

# Breadcrumb 面包屑

显示当前页面的路径，快速返回之前的任意页面。

## 基础用法

:::demo 在 `el-breadcrumb` 中使用 `el-breadcrumb-item` 标签表示从首页开始的每一级。该组件接受一个 `String` 类型的参数 `separator`来作为分隔符。默认值为 '/'。

breadcrumb/basic

:::

## 图标分隔符

:::demo 通过设置 `separator-class` 可使用相应的 `iconfont` 作为分隔符，注意这将使 `separator` 失效。

breadcrumb/icon

:::

## Breadcrumb API

### Breadcrumb Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| separator | 分隔符 | ^[string] | / |
| separator-icon | 图标分隔符，传入后忽略 separator | ^[Component] | — |

### BreadcrumbItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| to | 路由跳转目标，传入后 inner 显示为链接样式 | ^[string] | — |
| replace | to 模式下是否 replace | ^[boolean] | false |
