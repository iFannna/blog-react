---
title: "Popover 弹出框"
description: "点击或悬停在元素上时弹出的气泡卡片。"
group: 反馈组件
order: 90
---

# Popover 弹出框

## 展示位置

Popover 弹出框提供 9 种展示位置。

:::demo 使用 `content` 属性来设置悬停时显示的信息。由 `placement` 属性决定 Popover 弹出框的位置。该属性值格式为：`[方向]-[对齐位置]`，可供选择的四个方向分别是`top`、`left`、`right`、`bottom`，可供选择的三种对齐方式分别是`start`、`end`、`null`，默认的对齐方式为null。以 `placement="left-end"` 为例，Popover 弹出框会显示在悬停元素的左侧，且提示信息的底部与悬停元素的底部对齐。

popover/placement

:::

## 基础用法

Popover 是在 `ElTooltip` 基础上开发出来的。因此对于重复属性，请参考 Tooltip 的文档，在此文档中不做详尽解释。

:::demo `trigger` 属性被用来决定 popover 的触发方式，支持的触发方式： `hover`、`click`、`focus` 或 `contextmenu`。如果你想手动控制它，可以设置 `:visible` 属性。

popover/basic-usage

:::

## 虚拟触发

像 Tooltip一样，Popover 可以由虚拟元素触发，这个功能就很适合使用在触发元素和展示内容元素是分开的场景。通常我们使用 `#reference` 来放置我们的触发元素， 用 `virtual-ref` API，您可以任意设置您的触发元素 但注意到触发元素应该是接受 `mouse` 和 `keyboard` 事件的元素。

:::warning
`v-popover` 将被废弃，请使用 `virtual-ref` 作为替代。

:::

:::demo

popover/virtual-triggering

:::

## 内容可扩展

可以在 Popover 中嵌套其它组件，以下为嵌套表格的例子。

:::demo 利用插槽取代 `content` 属性

popover/nested-information

:::

## 嵌套操作

当然，你还可以嵌套操作，它比使用dialog更加轻量。

:::demo

popover/nested-operation

:::

## 指令

您可以使用指令性方式弹出窗口，但这种方法**不再推荐** ，因为这使得应用程序变得复杂， 您可以参考虚拟触发来实现一样的效果。

:::demo

popover/directive-usage

:::

## API

### Attributes

| 属性名 | 说明 | 类型 | Default |
| --- | --- | --- | --- |
| trigger | popover 触发方式，在受控模式下无效。 | ^[enum] / ^[array] | hover |
| trigger-keys <span class="docs-version-tag">2.9.8</span> | 当通过鼠标点击使触发元素获得焦点时，可以定义一组键盘按键代码，通过键盘控制气泡框的显示，在受控模式下无效。 | ^[Array] | ['Enter','Space'] |
| title | 标题 | ^[string] | — |
| effect | Tooltip 主题，Element Plus 内置了 dark / light 两种主题 | ^[enum] / ^[string] | light |
| content | 显示的内容，也可以通过写入默认插槽修改显示内容 | ^[string] | '' |
| width | 宽度 | ^[string] / ^[number] | 150 |
| placement | 出现位置 | ^[enum] | bottom |
| disabled | Popover 是否可用 | ^[boolean] | false |
| visible | Popover 是否显示 | ^[boolean] / ^[null] | null |
| offset | 浮层偏移量，Popover 是在 Tooltip 基础上开发的，Popover 的 offset 是 undefined，但 Tooltip 的 offset 是 12 | ^[number] | undefined |
| transition | 定义渐变动画，默认是 el-fade-in-linear | ^[string] | — |
| show-arrow | 是否显示 Tooltip 箭头，欲了解更多信息，请参考 ElPopper | ^[boolean] | true |
| popper-options | popper.js 的参数 | ^[object] | {modifiers: [{name: 'computeStyles',options: {gpuAcceleration: false}}]} |
| popper-class | 为 popper 添加类名 | ^[string] | — |
| popper-style | 为 popper 自定义样式 | ^[string] / ^[object] | — |
| show-after | 延迟显示时间（以毫秒为单位），在受控模式下无效。 | ^[number] | 0 |
| hide-after | 消失延迟时间（以毫秒为单位），在受控模式下无效。 | ^[number] | 200 |
| auto-close | 隐藏提示框的超时时间（以毫秒为单位），在受控模式下无效。 | ^[number] | 0 |
| tabindex | Popover 组件的 tabindex | ^[number] / ^[string] | 0 |
| teleported | 是否将 popover 的下拉列表插入至 body 元素 | ^[boolean] | true |
| append-to <span class="docs-version-tag">2.8.4</span> | 指示 Tooltip 的内容将附加在哪一个网页元素上 | ^[CSSSelector] / ^[HTMLElement] | body |
| persistent | 当 popover 组件长时间不触发且 persistent 属性设置为 false 时，popover 将会被删除 | ^[boolean] | true |
| virtual-triggering | 是否启用虚拟触发器 | ^[boolean] | — |
| virtual-ref | 代表 tooltip 所要附加的参照元素 | ^[HTMLElement] | — |
| tooltip | 继承自 Tooltip 的所有属性 | — | — |

### Slots

| 插槽名 | 说明 | Type |
| --- | --- | --- |
| default | 弹出框的内容，2.13.4 及之后版本可以接收 hide 参数。 | ^[object] |
| reference | 触发弹出框的 HTML 元素，只接受单个根元素。 | - |

### Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| show | 显示时触发 | ^[Function] |
| before-enter | 显示动画播放前触发 | ^[Function] |
| after-enter | 显示动画播放完毕后触发 | ^[Function] |
| hide | 隐藏时触发 | ^[Function] |
| before-leave | 隐藏动画播放前触发 | ^[Function] |
| after-leave | 隐藏动画播放完毕后触发 | ^[Function] |

### Exposes

| 名称 | 详情 | Type |
| --- | --- | --- |
| hide | 隐藏 popover | ^[Function] |
