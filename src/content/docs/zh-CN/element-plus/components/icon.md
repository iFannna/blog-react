---
title: "Icon 图标"
description: "提供了一套常用的图标集合。"
group: 基础组件
order: 50
---

# Icon 图标

Element Plus 提供了一套常用的图标集合。

## 基础用法

:::warning

由于 HTML 标准已经定义了一个名为 [menu](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/menu) 的标签，如果你注册的 `Menu` 无法正常工作，则需要使用别名来渲染图标。

:::

:::demo

icon/simple

:::

## 结合 el-icon 使用

`el-icon` 为原始的 SVG 图标提供额外的属性，细节如下。

通过添加额外的类名 is-loading，你的图标就可以在 2 秒内旋转 360 度，当然你也可以自己改写想要的动画。

:::demo

icon/combined

:::

## 直接使用 SVG 图标

:::demo

icon/direct

:::

## 图标集合

:::tip

只要你安装了 @element-plus/icons-vue，**就可以在任意版本里使用 SVG 图标**。

**您可以点击图标复制代码**

:::

:::demo

icon/collection

:::

## Icon API

### Icon Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| size | 图标尺寸，数字补 px | ^[number] / ^[string] | — |
| color | 图标颜色，落到 --color 变量 | ^[string] | — |
