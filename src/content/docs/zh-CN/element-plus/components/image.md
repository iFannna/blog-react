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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `<slot name="placeholder">` | `renderPlaceholder` | 无 children 语义的命名插槽改渲染函数 |
| `<slot name="error">` | `renderError` | 同上 |
| `<slot name="toolbar" v-bind="toolbar">` | `renderToolbar(scope)` | 作用域对象以参数传入 |
| `<slot name="progress" v-bind="progress">` | `renderProgress(scope)` | 同上 |
| `<slot name="viewer-error" v-bind>` | `renderViewerError(scope)` | 同上 |
| `<slot name="viewer">` | `viewer` | 单一默认内容，直接传节点 |
| `defineExpose({ showPreview })` | `ref` + `ImageExpose` | `useImperativeHandle` 暴露同名方法 |
| 事件 `load` / `error` / `switch` / `close` / `show` | `onLoad` / `onError` / `onSwitch` / `onClose` / `onShow` | React 事件命名 |
| 事件 `rotate`（Viewer） | `onRotate` | 同上 |
| `<teleport :disabled="!teleported">` | `teleported` + `createPortal` | 传送目标固定为 body |

**实现说明**：DOM 与官方一致 —— `.el-image` 内为 `.el-image__inner`（加 `is-loading`
时透明）与 `.el-image__wrapper` / `.el-image__placeholder` / `.el-image__error`；
预览为 `.el-image-viewer__wrapper` 内的 `__mask` / `__close` / `__prev` / `__next` /
`__actions` / `__progress` / `__canvas`。
缩放 / 旋转 / 拖拽用与官方 `imgStyle` 完全相同的换算
（`scale(s) rotate(deg) translate(x, y)`，translate 先按角度旋转坐标系再除以 scale），
滚轮缩放、方向键、空格切换缩放模式、ESC 关闭、拖拽平移均已实现。
懒加载优先使用浏览器原生 `loading`，不支持时用 `IntersectionObserver` 观察视口。
打开预览时按官方 `useLockscreen` 移除 `el-image-viewer-parent--hidden` 锁滚动。

## 未实现的官方能力

- 未实现 `<transition name="viewer-fade" appear>`：React 无过渡封装，改为挂载时直接加
  `viewer-fade-enter-active` 类播放一次进入动画；关闭时无淡出动画，直接卸载。
- 未实现官方的键盘/滚轮 `throttle` 节流（`lodash-unified` 的 throttle）：直接响应事件，
  高频场景下可能略多于官方一次滚动触发多次更新。
- 未实现 `useLockscreen` 的滚动条宽度补偿：官方会在锁定 body 时用
  `calc(100% - Npx)` 抵消滚动条宽度避免页面抖动，React 侧只加
  `el-image-viewer-parent--hidden`，不补偿宽度。
- 未实现 ElFocusTrap 的 `focusout-prevented` / `release-requested` 两个自定义事件
  （官方用来处理鼠标点击导致失焦时阻止释放、以及 ESC 释放焦点）：React 侧由
  `ElImageViewer` 自行的 keydown 监听处理 ESC，未复刻这两个事件的语义。
- 未实现官方的初始焦点转移：官方 `focus-start-el="container"` 把焦点落到带
  `tabindex="-1"` 的 `.el-image-viewer__wrapper` 上。React 侧 FocusTrap 只提供一层
  `display: contents` 的容器（避免多出一层盒子破坏 `.el-image-viewer__canvas` 的
  `height: 100%`），该元素不可聚焦，故打开时不会主动转移焦点；Tab 循环与焦点回收仍正常。

**额外说明**：ElImageViewer 默认工具栏需要 5 个图标（`ZoomOut`、`RefreshLeft`、
`RefreshRight`、`FullScreen`、`ScaleToOriginal`），其中 `ZoomOut` / `RefreshLeft` /
`RefreshRight` 本项目 icons 目录暂无（`FullScreen` / `ScaleToOriginal` 亦缺）。
主控统一维护图标生成清单，本组件在 `viewer-icons.tsx` 内联了官方同一份 SVG path 兜底，
已把这 5 个图标名提报主控补入清单。示例中的 `Right` / `Refresh` 同理。
