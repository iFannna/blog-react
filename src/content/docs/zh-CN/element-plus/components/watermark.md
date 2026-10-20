---
title: "Watermark 水印"
description: "在页面上添加特定的文字或图案。"
group: 其他
order: 20
---

# Watermark 水印

在页面上添加特定的文字或图案。

## 基础用法

:::demo 最简单的用法。

watermark/basic

:::

## 多行水印

:::demo 通过 `content` 设置一个字符串数组来指定多行文本水印内容。

watermark/multi-line

:::

## 图片水印

:::demo 通过 `image` 指定图片地址。为保证图片高清且不被拉伸，请设置 width 和 height，并上传至少两倍的宽高。

watermark/image

:::

## 自定义配置

:::demo 通过配置自定义参数预览水印效果。

watermark/custom

:::

## Watermark API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 水印宽度，省略时取 content 自身宽度 | ^[number] | 120 |
| height | 水印高度，省略时取 content 自身高度 | ^[number] | 64 |
| rotate | 绘制时的旋转角度，单位 ° | ^[number] | -22 |
| z-index | 水印元素的 z-index | ^[number] | 9 |
| image | 图片地址，优先级高于 content，建议导出 2x/3x | ^[string] | — |
| content | 水印文字，传数组表示多行 | ^[string] / ^[array]`string[]` | Element Plus |
| font | 文字样式 | [Font](#font) | [Font](#font) |
| gap | 水印之间的间距 | ^[array]`[number, number]` | [100, 100] |
| offset | 水印相对容器左上角的偏移，默认为 gap/2 | ^[array]`[number, number]` | [gap[0]/2, gap[1]/2] |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

> 说明：官方 `offset` 语义是「未传该元素则回退到 gap/2」。React 没有可选数组元素的写法，
> 这里用 `(number | undefined)[]`，`undefined` 等价于官方未传：`offset={[undefined, 20]}`
> 表示水平方向取 gap[0]/2、垂直方向取 20。

### Font

| 字段 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| color | 字体颜色 | ^[string] | rgba(0,0,0,.15) |
| fontSize | 字体大小 | ^[number] / ^[string] | 16 |
| fontWeight | 字体粗细 | ^[enum]`'normal' \| 'bold' \| 'lighter' \| 'bolder' \| number` | normal |
| fontFamily | 字体族 | ^[string] | sans-serif |
| fontGap ^(2.11.5) | 多行文字的行间距 | ^[number] | 3 |
| fontStyle | 字体风格 | ^[enum]`'none' \| 'normal' \| 'italic' \| 'oblique'` | normal |
| textAlign | 文字水平对齐 | ^[enum]`'left' \| 'right' \| 'center' \| 'start' \| 'end'` | center |
| textBaseline | 文字基线 | ^[enum]`'top' \| 'hanging' \| 'middle' \| 'alphabetic' \| 'ideographic' \| 'bottom'` | hanging |

### Slots

| 名称 | 说明 |
| --- | --- |
| default | 承载水印的容器内容，React 里直接用 `children` |

### 实现说明

水印由 canvas 绘制：先在按 align/baseline 对齐的小画布上画出文字或图片，旋转后取外接矩形，
再按 gap 平铺出可 `background-repeat` 的单元，最后把 `toDataURL()` 的结果设为绝对定位覆盖层的背景图。
容器上挂 `MutationObserver`，一旦水印节点被删除或被改样式就立即重绘，与官方 `reRendering` 逻辑一致。
绘制用 `devicePixelRatio` 放大画布，保证高分屏下不模糊。

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model`（无） | 无 | 组件无双向绑定，纯受控 props |
| `<slot />` | `children` | default 插槽即 React children |
| `gap` 元组 | `gap: [number, number]` | 一致 |
| `offset` 可选元组 | `offset: (number \| undefined)[]` | 元素为 `undefined` 即按官方未传处理，回退 gap/2 |
| `font` 对象 | `font: WatermarkFont` | 字段同名同默认值 |
| `z-index` | `zIndex` | kebab-case 转 camelCase |

## 未实现的官方能力

- 无。官方的全部 props（`width` / `height` / `rotate` / `z-index` / `image` / `content` /
  `font` / `gap` / `offset`）与 default 插槽均已实现，DOM 结构与绘制算法与官方源码逐行对应。
- 文档站的「Custom configuration」示例中，官方用 `el-color-picker` 的 `show-alpha` 取色，
  本项目同样使用 `ElColorPicker` 并开启 `showAlpha`。
