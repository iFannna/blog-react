---
title: "Border 边框"
description: "我们对组件中使用的边框、圆角与阴影做了统一规范。"
group: 基础组件
order: 20
---

# Border 边框

我们对边框进行统一规范，可用于按钮、卡片、弹窗等组件里。

## 边框样式

:::demo 我们提供了以下几种边框样式，以供选择。

border/border

:::

## 圆角

:::demo 我们提供了以下几种圆角样式，以供选择。

border/radius

:::

## 阴影

:::demo 我们提供了以下几种投影样式，以供选择。

border/shadow

:::

## 源代码

[文档](https://github.com/element-plus/element-plus/blob/dev/docs/en-US/component/border.md)

## Border 规范

### Border 变量

| 变量名 | 说明 | 默认值 |
| --- | --- | --- |
| --el-border-width | 边框宽度 | 1px |
| --el-border-style | 边框线型 | solid |
| --el-border-color-hover | 悬停态边框色 | var(--el-text-color-disabled) |
| --el-border | 边框简写 | var(--el-border-width) var(--el-border-style) var(--el-border-color) |
| --el-border-color | 基础边框色 | #dcdfe6 |
| --el-border-color-light | 浅色边框色 | #e4e7ed |
| --el-border-color-lighter | 更浅边框色 | #ebeef5 |
| --el-border-color-extra-light | 极浅边框色 | #f2f6fc |
| --el-border-color-dark | 深色边框色 | #d4d7de |
| --el-border-color-darker | 更深边框色 | #cdd0d6 |

### Radius 变量

| 变量名 | 说明 | 默认值 |
| --- | --- | --- |
| --el-border-radius-base | 基础圆角 | 4px |
| --el-border-radius-small | 小圆角 | 2px |
| --el-border-radius-round | 全圆角 | 20px |
| --el-border-radius-circle | 圆形 | 100% |

### Shadow 变量

| 变量名 | 说明 | 默认值 |
| --- | --- | --- |
| --el-box-shadow | 基础阴影 | 0px 12px 32px 4px rgba(0, 0, 0, 0.04), 0px 8px 20px rgba(0, 0, 0, 0.08) |
| --el-box-shadow-light | 浅阴影 | 0px 0px 12px rgba(0, 0, 0, 0.12) |
| --el-box-shadow-lighter | 更浅阴影 | 0px 0px 6px rgba(0, 0, 0, 0.12) |
| --el-box-shadow-dark | 深阴影 | 0px 16px 48px 16px rgba(0, 0, 0, 0.08), 0px 12px 32px rgba(0, 0, 0, 0.12), 0px 8px 16px -8px rgba(0, 0, 0, 0.16) |
