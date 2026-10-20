---
title: "Icon 图标"
description: "提供了一套常用的图标集合。"
group: 基础组件
order: 50
---

# Icon 图标

提供了一套常用的图标集合。

## 基础用法

`ElIcon` 会为内部的 SVG 图标提供尺寸与颜色，图标本身也可以脱离 `ElIcon` 独立使用。

:::demo

icon/simple

:::

## 配合 ElIcon 使用

`ElIcon` 为原始 SVG 图标提供额外属性：`size` 控制尺寸，`color` 控制颜色，
加上 `is-loading` 类名可以让图标旋转。

:::demo

icon/combined

:::

## 直接使用 SVG 图标

图标组件默认不携带尺寸等属性，直接使用时应通过 `width` / `height` 或类名指定大小。

:::demo

icon/direct

:::

## 图标集合

以下为官方全部 293 个图标，来自 `@element-plus/icons-vue`，SVG 数据逐字节一致。

:::demo

icon/collection

:::

## Icon API

### Icon Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 图标尺寸，数字补 px | ^[number] / ^[string] | — |
| color | 图标颜色，落到 --color 变量 | ^[string] | — |
