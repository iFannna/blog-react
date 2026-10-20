---
title: "Skeleton 骨架屏"
description: "在需要等待加载内容的位置提供一个占位图形组合。"
group: 数据展示
order: 140
---

# Skeleton 骨架屏

在需要等待加载内容的位置提供一个占位图形组合。

## 基础用法

:::demo 默认渲染段落骨架；也可通过自定义 template 渲染圆形占位。

skeleton/basic-usage

:::

## 配置行数

:::demo 通过 `rows` 属性配置段落行数。

skeleton/configurable-rows

:::

## 动画效果

:::demo `animated` 开启闪烁动画。

skeleton/animation

:::

## 自定义模板

:::demo 通过 `template` 传入自定义骨架结构，配合 `ElSkeletonItem` 组合出贴近真实布局的占位。

skeleton/customized-template

:::

## 加载状态

:::demo 开关切换 `loading`，为 `false` 时渲染真实内容。

skeleton/loading-state

:::

## 渲染列表数据

:::demo `count` 控制骨架重复单元数量；加载完成后渲染真实卡片列表。

skeleton/rendering-with-data

:::

## 避免渲染抖动

:::demo `throttle` 为数字时，切换加载态会等待指定时间后再渲染，避免骨架闪烁。

skeleton/avoiding-rendering-bouncing

:::

## 初始渲染加载态

:::demo 对象形态的 `initVal` 可指定首次渲染的加载态， `leading` 控制进入延时。

skeleton/initial-rendering-loading

:::

## 首尾节流

:::demo `trailing` 控制退出加载态的延时，与 `leading` 配合使用。

skeleton/leading-trailing-without-bouncing

:::

## Skeleton API

### Skeleton Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| animated | 是否显示动画 | ^[boolean] | false |
| count | 渲染多少个骨架重复单元 | ^[number] | 1 |
| rows | 段落行数，仅在未传 template 时生效 | ^[number] | 3 |
| loading | 是否处于加载中，false 时渲染真实内容 | ^[boolean] | true |
| throttle | 渲染节流，避免加载态闪烁 | ^[number] / ^[object]`{ leading?, trailing?, initVal? }` | 0 |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### Skeleton Events

无。

### Skeleton Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 加载完成后展示的真实内容 | `children` |
| template | 自定义骨架结构 | `template` 属性 |

### SkeletonItem Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| variant | 骨架屏元素类型 | ^[enum]`'circle' \| 'rect' \| 'h1' \| 'h3' \| 'text' \| 'caption' \| 'p' \| 'image' \| 'button'` | text |
| className / style | 根节点类名与样式 | ^[string] / ^[CSSProperties] | — |

### SkeletonItem Events

无。

### SkeletonItem Slots

无。

### Exposes

Skeleton / SkeletonItem 均无 expose。

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `<slot name="template">` | `template` 属性 | 传节点而非插槽 |
| 自定义 CSS 变量写在 style 字符串 | `style` 对象（自定义属性需断言） | 如 `--el-skeleton-circle-size` |

**实现说明**：

- 官方 `useThrottleRender` 的三种形态全部保留：`0` 直接透传 loading；数字形态在进入加载态时延时显示；对象形态由 `leading` / `trailing` 分别控制进入与退出延时，`initVal` 指定首次渲染的初始值
- 未传 template 时生成官方默认结构：首行 `is-first`（宽 33%），最后一行且行数大于 1 时加 `is-last`（宽 61%）
- `count` 会重复渲染 template 或默认结构；传入真实内容时内容整体渲染一次
- 基础用法中的圆形骨架通过 CSS 变量 `--el-skeleton-circle-size` 控制尺寸，与官方一致
