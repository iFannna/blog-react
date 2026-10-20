---
title: "Tooltip 文字提示"
description: "常用于展示鼠标 hover 时的提示信息。"
group: 反馈组件
order: 100
---

# Tooltip 文字提示

常用于展示鼠标 hover 时的提示信息。

## 基础用法

:::demo 通过 `placement` 设置弹出位置，共 12 个方向。

tooltip/basic

:::

## 主题

:::demo Tooltip 提供 dark / light 两种主题，也可通过 `effect` + `popperStyle` 自定义。

tooltip/theme

:::

## 多行内容

:::demo `content` 接受任意节点，可以包含换行等结构。

tooltip/rich-content

:::

## 高级用法

:::demo 通过 `disabled` 动态关闭提示能力。

tooltip/advanced-usage

:::

## HTML 内容

:::demo `rawContent` 会把字符串当作 HTML 渲染。

tooltip/html-content

:::

## 虚拟触发

:::demo `virtualTriggering` + `virtualRef` 可以让提示跟随一个 提供 `getBoundingClientRect` 的对象定位，无需真实子元素。

tooltip/virtual-trigger

:::

## 单例

:::demo 多个按钮共用一个 Tooltip 实例，鼠标移入按钮时更新虚拟参照物即可。

tooltip/singleton

:::

## 受控模式

:::demo 传入 `visible` 后完全由外部状态控制显隐。

tooltip/controlled

:::

## 动画

:::demo 通过 `transition` 指定过渡动画名。

tooltip/animations

:::

## 挂载到指定容器

:::demo `appendTo` 指定浮层的挂载目标，可与触发元素自身的层叠上下文配合。

tooltip/append-to

:::

## Tooltip API

### Tooltip Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| content | 提示内容 | ^[string] / ^[ReactNode] | — |
| placement | 弹出位置，共 12 个方向 | ^[enum]`'top' \| 'top-start' \| ...` | bottom |
| effect | 主题 | ^[enum]`'dark' \| 'light' \| 自定义` | dark |
| trigger | 触发方式，可传数组组合 | ^[enum]`'hover' \| 'click' \| 'focus' \| 'contextmenu'` / ^[array] | hover |
| trigger-keys | 键盘触发键 | ^[array] | `['Enter','NumpadEnter',' ']` |
| disabled | 是否禁用 | ^[boolean] | false |
| visible | 受控显示状态 | ^[boolean] | — |
| show-after | 显示延迟（毫秒） | ^[number] | 0 |
| hide-after | 隐藏延迟（毫秒） | ^[number] | 200 |
| auto-close | 自动关闭延迟（毫秒），0 表示不自动关 | ^[number] | 0 |
| show-arrow | 是否显示箭头 | ^[boolean] | true |
| offset | 与触发元素的距离 | ^[number] | 12 |
| fallback-placements | 翻转时的兜底方位列表 | ^[array] | — |
| popper-class | 提示内容的类名 | ^[string] | — |
| popper-style | 提示内容的样式 | ^[object] | — |
| enterable | 鼠标是否可进入提示内容 | ^[boolean] | true |
| raw-content | 内容是否作为 HTML 字符串渲染 | ^[boolean] | false |
| teleported | 是否挂载到 appendTo | ^[boolean] | true |
| append-to | 挂载目标选择器或元素 | ^[string] / ^[HTMLElement] | — |
| persistent | 不可见时是否保留 DOM | ^[boolean] | false |
| transition | 过渡动画名 | ^[string] | el-fade-in-linear |
| virtual-triggering | 是否启用虚拟触发 | ^[boolean] | false |
| virtual-ref | 虚拟触发参照物 | ^[HTMLElement] / ^[object] | — |
| role | 浮层语义角色 | ^[string] | tooltip |
| aria-label | 浮层 aria-label | ^[string] | — |
| z-index | 层级 | ^[number] | — |

### Tooltip Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onVisibleChange | 显隐状态变化 | ^[Function]`(visible: boolean) => void` |

### Tooltip Exposes

| 方法 | 说明 |
| --- | --- |
| show() | 立即显示 |
| hide() | 立即隐藏 |
| toggle() | 切换显隐 |
| onOpen() | 按 showAfter 延迟显示 |
| onClose(delay?) | 按 hideAfter 延迟隐藏，传 0 立即隐藏 |
| popperRef | 浮层根节点 |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model:visible` | `visible` + `onVisibleChange` | React 惯用写法 |
| `<slot name="content">` | `content` 属性 | 传节点或字符串 |
| `<slot name="reference">` / 单个子元素 | 直接包住触发元素 | `children` 为触发元素 |
| `virtual-ref` 传模板 ref | `virtualRef` 传元素或 `{ getBoundingClientRect }` | 支持虚拟定位 |

**实现说明**：定位由 `@popperjs/core` 提供（官方 el-popper 用的同一个库），
`offset` / `flip` / `preventOverflow` 参数逐项对齐官方；
`applyStyles` 关闭，定位结果由组件写内联 style。
自定义 `transition` 需在样式中提供对应的 `*-enter-from` / `*-enter-active` 等类名，
演示使用 theme-chalk 内置的 `el-zoom-in-top`。
