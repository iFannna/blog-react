---
title: "Slider 滑块"
description: "通过拖动滑块在一个固定区间内进行选择。"
group: 表单组件
order: 190
---

# Slider 滑块

通过拖动滑块在一个固定区间内进行选择。

## 基础用法

:::demo 在拖动滑块时，显示当前值。

slider/basic-usage

:::

## 离散值

:::demo 选项可以是离散的。设置 `step` 可以改变步长， 设置 `showStops` 可以显示间断点。

slider/discrete-values

:::

## 带输入框的滑块

:::demo 设置 `showInput` 会在右侧显示输入框。

slider/slider-with-input-box

:::

## 尺寸

:::demo

slider/sizes

:::

## 位置

:::demo 可以自定义提示的显示位置。

slider/placement

:::

## 范围选择

:::demo 支持选择一个范围。

slider/range-selection

:::

## 垂直模式

:::demo `vertical` 开启纵向模式，此时必须设置 `height`。

slider/vertical-mode

:::

## 显示标记

:::demo `marks` 支持自定义样式与文案。

slider/show-marks

:::

## 限制取值

:::demo `step="mark"` 把取值限制在 `marks` 上。

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | React 惯用写法 |
| `@input` 实时事件 | `onInput` | 同义 |
| `@change` 拖拽结束 | `onValueChange` | `onChange` 已占用为 v-model 回调，故另开一个 |
| `defineExpose({ onSliderClick })` | `ref` + `onSliderClick` | 用 `useImperativeHandle` 暴露 |
| `label`（已废弃） | `ariaLabel` | 官方亦标注 deprecated |

**实现说明**：

- 坐标换算、`setPosition` 的取整（`fullRangePercentage` / `threshold` 三段判定）、
  `step="mark"` 时取最近 mark、键盘 `Arrow/Home/End/PageUp/PageDown`、
  拖拽结束后一个宏任务收尾防误触发 click，均逐行对齐官方。
- 提示复用本项目的 `ElTooltip`（受控模式），显隐按官方做 50ms 防抖；
  `persistent` 透传给 ElTooltip 决定不可见时是否保留浮层 DOM。
- `id`、`aria-label` / `aria-labelledby` 与 FormItem 的关联对齐官方：
  range 模式下 id 落在根节点，非 range 时落在滑块按钮上，并注册到 FormItem。
- `validate-event` 在值变化时调用所在 ElFormItem 的 `change` 校验。

**未实现的官方能力**：

- 官方 tooltip 在拖拽中用 `updatePopper()` 主动重算定位；本项目 ElTooltip 未暴露该能力，
  改为依赖拖拽引发的重渲染重新定位，拖拽中提示位置有一帧级误差。
