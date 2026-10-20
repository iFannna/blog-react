---
title: "Result 结果"
description: "用于反馈一系列操作任务的处理结果。"
group: 数据展示
order: 130
---

# Result 结果

用于对用户的操作结果或者异常状态做反馈。

## 基础用法

:::demo `primary` 已被添加到^(2.9.11)。

result/basic-usage

:::

## 自定义内容

:::demo

result/customized-content

:::

## Result API

### Result Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| icon | 图标类型 | ^[enum]`'primary' \| 'success' \| 'warning' \| 'info' \| 'error'` | info |
| title | 标题 | ^[string] / ^[ReactNode] | — |
| sub-title | 副标题 | ^[string] / ^[ReactNode] | — |

### Result Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| icon | 自定义图标 | `customIcon` |
| title | 自定义标题 | `title` |
| sub-title | 自定义副标题 | `subTitle` |
| extra | 操作区 | `extra` |
