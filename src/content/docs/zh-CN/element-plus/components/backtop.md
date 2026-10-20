---
title: "Backtop 回到顶部"
description: "返回页面顶部的操作按钮。"
group: 导航
order: 30
---

# Backtop 回到顶部

返回页面顶部的操作按钮。

## 基础用法

:::demo 向下滚动页面即可看到右下角的按钮。

backtop/basic

:::

## 自定义

:::demo 显示区域是 40px * 40px，通过 `right`、`bottom` 调整位置。

backtop/custom

:::

## Backtop API

### Backtop Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| target | 触发滚动的容器选择器，省略时为文档 | ^[string] | — |
| visibility-height | 滚动距离达到该值后显示按钮 | ^[number] | 200 |
| right | 距右侧距离 | ^[number] / ^[string] | 40 |
| bottom | 距底部距离 | ^[number] / ^[string] | 40 |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Backtop Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onClick | 点击时触发 | ^[Function]`(event: MouseEvent) => void` |

### Backtop Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义内容 | `children` |
