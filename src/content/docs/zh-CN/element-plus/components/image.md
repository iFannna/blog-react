---
title: "Image 图片"
description: "除原生 img 特性外，支持懒加载、自定义占位、加载失败占位等。"
group: 数据展示
order: 90
---

# Image 图片

图片容器，在保留所有原生 img 的特性下，支持懒加载，自定义占位、加载失败等

## 基础用法

:::demo 可通过`fit`确定图片如何适应到容器框，同原生 [object-fit](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)。

image/basic-usage

:::

## 占位内容

:::demo 可通过`slot = placeholder`可自定义占位内容

image/placeholder

:::

## 加载失败

:::demo 通过 `slot = error` and `slot = viewer-error`自定义图像加载错误时的内容。

image/load-failed

:::

## 懒加载

:::tip

浏览器原生支持的 `loading`属性在 ^(2.2.3)版本加入。 您可以使用 `loading="lazy"` 替换之前的`lazy= true`。

如果当前浏览器支持原生图片延迟加载，则先使用原生能力，否则将使用滚动监听实现相同效果。

:::

:::demo 可通过`lazy`开启懒加载功能，当图片滚动到可视范围内才会加载。可通过 `scroll-container` 来设置滚动容器，若未定义，则为最近一个 overflow 值为 auto 或 scroll 的父元素。

image/lazy-load

:::

## 图片预览

:::demo 可通过 `previewSrcList` 开启预览大图的功能。你可以通过 `initial-index` 初始化第一张预览图片的位置。默认初始位置为 0。

image/image-preview

:::

## 手动打开预览 ^(2.9.4)

:::demo

image/manually-preview

:::

## 自定义工具栏^(2.9.4)

:::demo 可通过 `toolbar` 插槽自定义工具栏内容，自版本 ^(2.9.7) 起，插槽中添加了 `setActiveItem` 方法，用于根据索引切换图片。

image/custom-toolbar

:::

## 自定义进度条 ^(2.9.4)

:::demo 可通过 `show-progress` 控制是否在预览图片时显示进度条。自版本 ^(2.9.8) 起，进度条会在使用 `progress` 插槽时显示。

image/custom-progress

:::

## Image API

### Image Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| src | 图片地址，同原生 | ^[string] | '' |
| fit | 图片填充方式，同原生 object-fit | ^[enum]`'' \| 'fill' \| 'contain' \| 'cover' \| 'none' \| 'scale-down'` | '' |
| hide-on-click-modal | 开启预览时，点击遮罩是否关闭预览 | ^[boolean] | false |
| loading | 浏览器加载方式，同原生 loading | ^[enum]`'eager' \| 'lazy'` | — |
| lazy | 是否使用懒加载 | ^[boolean] | false |
| scroll-container | 懒加载时监听滚动的容器 | ^[string] / ^[HTMLElement] | — |
| alt | 原生 alt | ^[string] | — |
| referrer-policy | 原生 referrerPolicy | ^[string] | — |
| cross-origin | 原生 crossorigin | ^[enum]`'' \| 'anonymous' \| 'use-credentials'` | — |
| preview-src-list | 允许大图预览的链接列表 | ^[array]`string[]` | [] |
| z-index | 预览层级 | ^[number] | — |
| initial-index | 初始预览下标 | ^[number] | 0 |
| close-on-press-escape | 预览时按 ESC 是否关闭 | ^[boolean] | true |
| preview-teleported | 是否把预览查看器传送到 body | ^[boolean] | false |
| infinite | 预览是否循环 | ^[boolean] | true |
| zoom-rate | 缩放比例基数 | ^[number] | 1.2 |
| scale | 预览图片缩放值 | ^[number] | 1 |
| min-scale | 最小缩放值 | ^[number] | 0.2 |
| max-scale | 最大缩放值 | ^[number] | 7 |
| show-progress | 是否显示预览进度 | ^[boolean] | false |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Image Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onLoad | 同原生 load | ^[Function]`(e: Event) => void` |
| onError | 同原生 error | ^[Function]`(e: Event) => void` |
| onSwitch | 切换预览图片时触发 | ^[Function]`(index: number) => void` |
| onClose | 关闭预览时触发 | ^[Function]`() => void` |
| onShow | 打开预览时触发 | ^[Function]`() => void` |

### Image Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| placeholder | 图片未加载完成时的占位内容 | `renderPlaceholder` |
| error | 图片加载失败时的内容 | `renderError` |
| viewer | 预览查看器自定义内容 | `viewer` |
| progress | 预览进度自定义内容 | `renderProgress` |
| toolbar | 预览工具栏自定义内容 | `renderToolbar` |
| viewer-error | 预览图片加载失败时的内容 | `renderViewerError` |

### Image Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| showPreview | 手动打开大图预览 | ^[Function]`() => void` |

> 通过 `ref` 拿到 expose：`const ref = useRef<ImageExpose>(null)`，再调用 `ref.current?.showPreview()`。

## Image Viewer API

### Image Viewer Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| url-list | 预览链接列表 | ^[array]`string[]` | [] |
| z-index | 预览遮罩层级 | ^[number] | — |
| initial-index | 初始预览下标 | ^[number] | 0 |
| infinite | 预览是否循环 | ^[boolean] | true |
| hide-on-click-modal | 点击遮罩是否关闭 | ^[boolean] | false |
| teleported | 是否把查看器传送到 body | ^[boolean] | false |
| close-on-press-escape | 按 ESC 是否关闭 | ^[boolean] | true |
| zoom-rate | 缩放比例基数 | ^[number] | 1.2 |
| scale | 预览图片缩放值 | ^[number] | 1 |
| min-scale | 最小缩放值 | ^[number] | 0.2 |
| max-scale | 最大缩放值 | ^[number] | 7 |
| show-progress | 是否显示进度 | ^[boolean] | false |
| crossorigin | 原生 crossorigin | ^[enum]`'' \| 'anonymous' \| 'use-credentials'` | — |

### Image Viewer Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onClose | 关闭时触发 | ^[Function]`() => void` |
| onError | 图片加载失败时触发 | ^[Function]`(e: Event) => void` |
| onSwitch | 切换图片时触发 | ^[Function]`(index: number) => void` |
| onRotate | 旋转时触发 | ^[Function]`(deg: number) => void` |

### Image Viewer Slots

| 插槽名 | 说明 | React 写法 / 作用域 |
| --- | --- | --- |
| viewer | 自定义内容 | `children` |
| progress | 自定义进度内容 | `renderProgress({ activeIndex, total })` |
| toolbar | 自定义工具栏内容 | `renderToolbar({ actions, prev, next, reset, activeIndex, setActiveItem })` |
| viewer-error | 自定义加载失败内容 | `renderViewerError({ activeIndex, src })` |

### Image Viewer Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| setActiveItem | 手动切换图片 | ^[Function]`(index: number) => void` |
