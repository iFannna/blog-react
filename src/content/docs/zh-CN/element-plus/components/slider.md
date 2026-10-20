---
title: "Slider 滑块"
description: "通过拖动滑块在一个固定区间内进行选择。"
group: 表单组件
order: 190
---

# Slider 滑块

通过拖动滑块在一个固定区间内进行选择

## 基础用法

在拖动滑块时，显示当前值

通过设置绑定值自定义滑块的初始值

:::demo

slider/basic-usage

:::

## 离散值

选项可以是离散的

改变`step`的值可以改变步长，通过设置 `show-stops` 属性可以显示间断点

:::demo

slider/discrete-values

:::

## 带有输入框的滑块

通过输入框输入来改变当前的值。

设置 `show-input` 属性会在右侧显示一个输入框

:::demo

slider/slider-with-input-box

:::

## 不同尺寸

:::demo

slider/sizes

:::

## 位置

您可以自定义 Tooltip 提示的位置。

:::demo

slider/placement

:::

## 范围选择

你还可以选择一个范围值

配置 `range` 属性以激活范围选择模式，该属性的绑定值是一个数组，由最小边界值和最大边界值组成。

:::demo

slider/range-selection

:::

## 垂直模式

配置 `vertical` 属性为 `true` 启用垂直模式。在垂直模式下，必须设置 `height` 属性。

:::demo

slider/vertical-mode

:::

## 显示标记

设置 `marks` 属性可以在滑块上显示标记。

:::demo

slider/show-marks

:::

## 限制值 ^(2.13.6)

设置 `step="mark"` 以将滑块值限制为刻度。

:::demo

slider/restrict-value

:::

## Slider API

### Slider Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，范围选择时为数组 | ^[number] / ^[array]`number[]` | 0 |
| min | 最小值 | ^[number] | 0 |
| max | 最大值 | ^[number] | 100 |
| disabled | 是否禁用 | ^[boolean] | false |
| step | 步长，可传 `'mark'` 把取值限制在 marks 上（此时必须传 marks） | ^[number] / ^[string]`'mark'` | 1 |
| show-input | 是否显示输入框，range 为真或 step 为 `'mark'` 时不生效 | ^[boolean] | false |
| show-input-controls | showInput 为真时是否显示输入框的控制按钮 | ^[boolean] | true |
| size | 尺寸，纵向模式不生效 | ^[enum]`'large' \| 'default' \| 'small'` | default |
| input-size | 输入框尺寸，省略时跟随 size | ^[enum]`'large' \| 'default' \| 'small'` | default |
| show-stops | 是否显示间断点 | ^[boolean] | false |
| show-tooltip | 是否显示提示 | ^[boolean] | true |
| format-tooltip | 提示内容的格式化函数 | ^[Function]`(value: number) => number \| string` | — |
| range | 是否范围选择 | ^[boolean] | false |
| vertical | 纵向模式 | ^[boolean] | false |
| height | 高度，纵向模式必填 | ^[string] | — |
| aria-label | 根元素的 aria-label | ^[string] | — |
| range-start-label | range 为真时给屏幕阅读器的起始值标签 | ^[string] | — |
| range-end-label | range 为真时给屏幕阅读器的结束值标签 | ^[string] | — |
| format-value-text | aria-valuenow 的格式化函数 | ^[Function]`(value: number) => string` | — |
| tooltip-class | 提示的自定义类名 | ^[string] | — |
| placement | 提示位置 | ^[enum] | top |
| marks | 标记点，键必须是 [min, max] 闭区间内的数字，值可自定义样式 | ^[object]`SliderMarks` | — |
| validate-event | 是否触发表单校验（处于 ElFormItem 内时调用其 change 校验） | ^[boolean] | true |
| persistent | 提示不活跃且为 false 时销毁浮层；showTooltip 为 false 时恒为 false | ^[boolean] | true |

### Slider Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 对应官方 v-model 的 update:modelValue，值变化时触发（拖拽过程中持续触发） | ^[Function]`(value: Arrayable<number>) => void` |
| onInput | 对应官方 input，拖动过程中实时触发 | ^[Function]`(value: Arrayable<number>) => void` |
| onValueChange | 对应官方 change，拖拽结束 / 点击轨道 / 点击标记点后触发 | ^[Function]`(value: Arrayable<number>) => void` |

### Slider Exposes

| 方法名 | 说明 | 类型 |
| --- | --- | --- |
| onSliderClick | 按鼠标 / 触摸位置设置值 | ^[Function]`(event: MouseEvent \| TouchEvent) => void` |
