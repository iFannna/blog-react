---
title: "Empty 空状态"
description: "空状态时的展示占位图。"
group: 数据展示
order: 80
---

# Empty 空状态

空状态时的展示占位图。

## 基础用法

:::demo 通过 `description` 属性设置描述文字。

empty/basic-usage

:::

## 自定义图片

:::demo 通过设置 `image` 属性传入图片 URL。

empty/custom-image

:::

## 图片尺寸

:::demo 通过使用 `image-size` 属性来控制图片大小。

empty/image-size

:::

## 底部内容

:::demo 使用默认插槽可在底部插入内容。

empty/bottom-content

:::

## 自定义样式

您可以为 empty 组件设置自定义样式。使用 css/scss 语言来更改全局或局部颜色。我们设置了一些全局颜色变量：
`--el-empty-fill-color-0`、`--el-empty-fill-color-1`、`--el-empty-fill-color-2`、……、`--el-empty-fill-color-9`。
您可以使用类似 `:root { --el-empty-fill-color-0: red; --el-empty-fill-color-1: blue; }` 等变量。
但通常，如果你想要更改样式，你需要更改所有颜色，因为这些颜色是一个组合。

### 默认变量

| 变量 | 颜色 |
| --- | --- |
| --el-empty-fill-color-0 | var(--el-color-white) |
| --el-empty-fill-color-1 | #fcfcfd |
| --el-empty-fill-color-2 | #f8f9fb |
| --el-empty-fill-color-3 | #f7f8fc |
| --el-empty-fill-color-4 | #eeeff3 |
| --el-empty-fill-color-5 | #edeef2 |
| --el-empty-fill-color-6 | #e9ebef |
| --el-empty-fill-color-7 | #e5e7e9 |
| --el-empty-fill-color-8 | #e0e3e9 |
| --el-empty-fill-color-9 | #d5d7de |

## Empty API

### Empty Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| image | 自定义插图地址，不传时使用内置空状态图 | ^[string] | — |
| image-size | 插图宽度 | ^[number] / ^[string] | — |
| description | 描述文字 | ^[string] / ^[ReactNode] | 暂无数据 |

### Empty Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 底部内容，通常放操作按钮 | `children` |
| image | 自定义插图 | `image` 属性 |
| description | 自定义描述 | `description` 属性 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `<slot name="image">` | `image` 属性 | 传地址字符串 |
| 默认描述取自 `useLocale` | 固定「暂无数据」 | 未引入多语言，可用 `description` 覆盖 |

**实现说明**：内置插图复刻自官方 `img-empty.vue`，路径坐标逐值一致，
配色走 `--el-empty-fill-color-1` 到 `--el-empty-fill-color-9` 九个变量，
因此自动跟随明暗主题。渐变与 rect 的 `id` 用 `useId` 生成，
避免同页多个 Empty 的 `id` 冲突导致配色错乱。
