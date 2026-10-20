---
title: "Watermark 水印"
description: "在页面上添加特定的文字或图案。"
group: 其他
order: 20
---

# Watermark 水印

在页面上添加文本或图片等水印信息

## 基础用法

:::demo 最简单的用法。

watermark/basic

:::

## 多行水印

:::demo 使用 `content`设置一个字符串数组来指定多行文本水印内容

watermark/multi-line

:::

## 图片水印

:::demo 通过 `image` 指定图像地址。为了确保图像清晰展示而不是被拉伸，请设置宽度和高度，建议使用至少两倍的宽度和高度的图片来保证显示效果。

watermark/image

:::

## 自定义配置

:::demo 配置自定义参数预览水印效果。

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
