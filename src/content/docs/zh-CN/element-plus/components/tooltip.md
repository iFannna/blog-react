---
title: "Tooltip 文字提示"
description: "常用于展示鼠标 hover 时的提示信息。"
group: 反馈组件
order: 100
---

# Tooltip 文字提示

常用于展示鼠标 hover 时的提示信息。

## 基础用法

在这里我们提供 9 种不同方向的展示方式，可以通过以下完整示例来理解，选择你要的效果。

:::demo 使用 `content` 属性来决定 hover 时的提示信息。由 `placement` 属性决定展示效果：`placement` 属性值为：`[方向]-[对齐位置]`；四个方向：`top`、`left`、`right`、`bottom`；三种对齐位置：`start`、`end`，默认为空。如 `placement="left-end"`，则提示信息出现在目标元素的左侧，且提示信息的底部与目标元素的底部对齐。

tooltip/basic

:::

## 主题

Tooltip 组件内置了两个主题：`dark` 和 `light`。

:::tip TIP
要使用自定义主题，您必须知道您的工具提示在哪里渲染，如果您的工具提示被呈现为根元素，您将需要全局设置 CSS 规则。

建议您使用自定义主题并同时显示箭头时不使用线性渐变背景颜色。因为弹出箭头和内容是两个不同的元素，弹出箭头的样式需要单独设置，当它到渐变背景颜色时，会看起来很奇怪。

:::

:::demo 通过设置 `effect` 来修改主题，默认值为 `dark`。

tooltip/theme

:::

## 更多内容的文字提示

展示多行文本或者是设置文本内容的格式。

:::demo 用具名插槽 content，替代 tooltip 中的 `content` 属性。

tooltip/rich-content

:::

## 高级扩展

除了这些基本设置外，还有一些属性可以让使用者更好的定制自己的效果：

`transition` 属性可以定制显隐的动画效果，默认为 `fade-in-linear`。

如果需要关闭 tooltip 功能，`disabled` 属性可以满足这个需求，你只需要将其设置为 `true`。

事实上，Tooltip 是一个基于 Popper 的扩展，您可以使用 Popper 中允许的任何属性。

:::demo

tooltip/advanced-usage

:::

:::tip TIP
Tooltip 内不支持 router-link 组件，请使用 router.push 代替。

tooltip 内不支持 disabled form 元素，参考 MDN，请在 disabled form 元素外层添加一层包裹元素。

:::

## 显示 HTML 内容

内容属性可以设置为 HTML 字符串。

:::danger WARNING
`content` 属性虽然支持传入 HTML 片段，但是在网站上动态渲染任意 HTML 是非常危险的，因为容易导致 XSS 攻击。因此在 `raw-content` 打开的情况下，请确保 `content` 的内容是可信的，永远不要将用户提交的内容赋值给 `content` 属性。

:::

:::demo

tooltip/html-content

:::

## 虚拟触发

有时候我们想把 tooltip 的触发元素放在别的地方，而不需要写在一起，这时候就可以使用虚拟触发。

:::tip TIP
需要注意的是，虚拟触发的 tooltip 是受控组件，因此你必须自己去控制 tooltip 是否显示，你将无法通过点击空白处来关闭 tooltip。

:::

:::demo

tooltip/virtual-trigger

:::

## 单例模式

Tooltip 可以作为单例，也就是说你可以同时有多个触发同一个 tooltip 的触发元素，这个功能是在虚拟触发的基础上开发的。

:::tip TIP
已知问题：使用单例模式时，弹出窗口会从意料之外的位置弹出。

:::

:::demo

tooltip/singleton

:::

## 受控模式

Tooltip 可以通过父组件使用 `visible` 来控制它的显示与关闭。

:::demo

tooltip/controlled

:::

## 自定义动画

Tooltip 可以自定义动画，您可以使用 `transition` 设置所需的动画效果。

:::tip TIP
过渡效果的更多信息可以在 Vue 过渡效果中找到。

:::

:::demo

tooltip/animations

:::

## 使用 append-to

您必须等待 DOM 加载后才能使用 `targetElement`。

:::demo

tooltip/append-to

:::

## API

### Attributes

| 名称 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| append-to | 指示 Tooltip 的内容将附加在哪一个网页元素上 | ^[CSSSelector] / ^[HTMLElement] | — |
| effect | Tooltip 主题，内置了 dark / light 两种 | ^[enum] | dark |
| content | 显示的内容，也可被 content 插槽覆盖 | ^[string] | '' |
| raw-content | content 中的内容是否作为 HTML 字符串处理 | ^[boolean] | false |
| placement | Tooltip 组件出现的位置 | ^[enum] | bottom |
| fallback-placements | Tooltip 可用的 positions 请查看 popper.js 文档 | ^[array] | — |
| visible | Tooltip 组件可见性 | ^[boolean] | — |
| disabled | Tooltip 组件是否禁用 | ^[boolean] | — |
| offset | Tooltip 出现位置的偏移量 | ^[number] | 12 |
| transition | 动画名称 | ^[string] | — |
| popper-options | popper.js 参数 | ^[object] | {} |
| arrow-offset <span class="docs-version-tag">2.9.10</span> | 控制 Tooltip 的箭头相对于弹出窗口的偏移（添加）。 | ^[number] | 5 |
| show-after | 延迟显示时间（以毫秒为单位），在受控模式下无效。 | ^[number] | 0 |
| show-arrow | tooltip 的内容是否有箭头 | ^[boolean] | true |
| hide-after | 消失延迟时间（以毫秒为单位），在受控模式下无效。 | ^[number] | 200 |
| auto-close | 隐藏提示框的超时时间（以毫秒为单位），在受控模式下无效。 | ^[number] | 0 |
| popper-class | 为 Tooltip 的 popper 添加自定义类名 | ^[string] | — |
| popper-style | 为 Tooltip 的 popper 添加自定义样式 | ^[string] / ^[object] | — |
| enterable | 鼠标是否可进入到 tooltip 中 | ^[boolean] | true |
| teleported | 是否使用 teleport。设置成 true 则会被追加到 append-to 的位置 | ^[boolean] | true |
| trigger | 提示框的触发方式（用于显示），在受控模式下无效。 | ^[enum] / ^[array] | hover |
| virtual-triggering | 用来标识虚拟触发是否被启用 | ^[boolean] | — |
| virtual-ref | 标识虚拟触发时的触发元素 | ^[HTMLElement] | — |
| trigger-keys | 当通过鼠标点击使触发元素获得焦点时，可以定义一组键盘按键代码，通过键盘控制提示框的显示，在受控模式下无效。 | ^[Array] | ['Enter','Space'] |
| persistent | 当 tooltip 未激活且 persistent 为 false 时，tooltip 将被销毁。 | ^[boolean] | — |
| aria-label <el-tag round effect="plain" size="small">a11y</el-tag> | 和 aria-label 属性保持一致 | ^[string] | — |
| focus-on-target <span class="docs-version-tag">2.11.2</span> | 当通过悬停触发提示时，是否聚焦触发元素，以提升可访问性 | ^[boolean] | false |

### 事件

| 插槽名 | 说明 | 类型 |
| --- | --- | --- |
| before-show | 在显示提示框之前触发。将触发原因作为参数传入。 | ^[Function] |
| show | 在提示框显示时触发。将触发原因作为参数传入。 | ^[Function] |
| before-hide | 在提示框隐藏之前触发。将触发原因作为参数传入。 | ^[Function] |
| hide | 在提示框隐藏时触发。将触发原因作为参数传入。 | ^[Function] |

### Slots

| 名称 | 详情 |
| --- | --- |
| default | 提示框触发及参考元素，只接受单个根元素。 |
| content | 自定义内容 |

### Exposes

| 方法名 | 详情 | Type |
| --- | --- | --- |
| popperRef | el-popper 组件实例 | ^[object] |
| contentRef | el-tooltip-content 组件实例 | ^[object] |
| isFocusInsideContent | 验证当前焦点事件是否在 el-tooltip-content 中触发 | ^[Function] |
| updatePopper | 更新 el-popper 组件实例 | ^[Function] |
| onOpen | onOpen 方法控制 el-tooltip 显示状态 | ^[Function] |
| onClose | onClose 方法控制 el-tooltip 显示状态 | ^[Function] |
| hide | 提供 hide 方法 | ^[Function] |

## FAQ

#### 如何在嵌套了 tooltip 的情况下允许输入框输入空格？

典型问题：#20907

```vue
<template>
  <el-tooltip content="tooltip content" placement="top" :trigger-keys="[]">
    <el-input v-model="value" placeholder="" />
  </el-tooltip>
</template>
```
