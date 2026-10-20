---
title: "Image 图片"
description: "除原生 img 特性外，支持懒加载、自定义占位、加载失败占位等。"
group: 数据展示
order: 90
---

# Image 图片

除原生 img 特性外，支持懒加载、自定义占位、加载失败占位等。

## 基础用法

:::demo 通过 `fit` 指示图片应如何适应容器，同原生  `object-fit`。

image/basic-usage

:::

## 占位内容

:::demo 图片未加载完成时，通过 `renderPlaceholder` 自定义占位内容。

image/placeholder

:::

## 加载失败

:::demo 图片加载失败时，通过 `renderError` 自定义失败内容； 预览查看器内加载失败用 `renderViewerError`。

image/load-failed

:::

## 懒加载

:::demo 设置 `lazy` 开启懒加载。若浏览器支持原生懒加载则优先使用原生， 否则通过 `IntersectionObserver` 实现。可用  `scrollContainer` 指定滚动容器，缺省为最近的 overflow 为 auto 或 scroll 的父容器。

image/lazy-load

:::

## 大图预览

:::demo 设置 `previewSrcList` 允许大图预览，可用 `initialIndex`  指定初始预览位置，默认 0。

image/image-preview

:::

## 手动开启预览

:::demo 通过 ref 调用 `showPreview` 手动开启预览，也可受控地直接渲染  `ElImageViewer`。

image/manually-preview

:::

## 自定义工具栏

:::demo 通过 `renderToolbar` 自定义工具栏内容，作用域含  `actions`、`prev`、`next`、`reset`、 `activeIndex`、`setActiveItem`。

image/custom-toolbar

:::

## 自定义进度

:::demo 通过 `renderProgress` 自定义进度内容，也可用  `showProgress` 显示默认进度。

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
