---
title: "Breadcrumb 面包屑"
description: "显示当前页面的路径，快速返回之前的页面。"
group: 导航
order: 40
---

# Breadcrumb 面包屑

显示当前页面的路径，快速返回之前的页面。

## 基础用法

:::demo 通过 `separator` 设置分隔符，默认 `/`。

breadcrumb/basic

:::

## 图标分隔符

:::demo 通过 `separatorIcon` 设置图标分隔符； 传入 `to` 的项会显示为链接样式。

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
