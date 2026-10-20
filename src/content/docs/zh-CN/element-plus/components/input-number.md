---
title: "Input Number 数字输入框"
description: "仅允许输入标准的数字值，可定义范围。"
group: 表单组件
order: 110
---

# Input Number 数字输入框

仅允许输入标准的数字值，可定义范围

## 基础用法

要使用它，只需要在 `<el-input-number>` 元素中使用 `v-model` 绑定变量即可，变量的初始值即为默认值。

:::tip

当输入无效的字符串到输入框时，由于错误，输入值将把 `NaN` 导入到上层

:::

:::demo

input-number/basic

:::

## 禁用状态

`disabled`属性接受一个 `Boolean`，设置为`true`即可禁用整个组件。，如果你只需要控制数值在某一范围内，可以设置 `min` 属性和 `max` 属性，默认情况下，最小值是 `Number.MIN_SAFE_INTEGER`。

:::demo

input-number/disabled

:::

## 步进

允许定义递增递减的步进控制

设置 `step` 属性可以控制步长。

:::demo

input-number/steps

:::

## 严格步进

`step-strictly`属性接受一个`Boolean`。如果这个属性被设置为 `true`，则只能输入步进的倍数。

:::demo

input-number/step-strictly

:::

## 精度

设置 `precision` 属性可以控制数值精度，接收一个 `Number`。

:::tip

`precision` 的值必须是一个非负整数，并且不能小于 `step` 的小数位数。

:::

:::demo

input-number/precision

:::

## 不同的输入框尺寸

使用 `size` 属性额外配置尺寸，可选的尺寸大小为：`large` 或 `small`

:::demo

input-number/size

:::

## 按钮位置

设置 `controls-position` 属性可以控制按钮位置。

:::demo

input-number/controlled

:::

## 自定义图标 ^(2.6.3)

使用 `decrease-icon` 和 `increase-icon` 设置自定义图标。

:::demo

input-number/custom

:::

## 带前缀和后缀^(2.8.4)

使用前缀和标名后缀。

:::tip

为了确保精度，输入的数值被限制在 [Number.MIN_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MIN_SAFE_INTEGER) 到 [Number.MAX_SAFE_INTEGER](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Number/MAX_SAFE_INTEGER) 之间。

:::

:::demo

input-number/with-prefix-suffix

:::

## Formatter ^(2.14.0)

使用 `formatter` 来显示值，通常会同时配合 `parser` 一起使用。

当设置了 `formatter` 时，内部输入框的 `type` 会变为 `text`，从而允许输入非数字字符。 组件内部使用 `Number.parseFloat` 处理输入：解析成功时，将解析后的数值写入 `model-value`；当解析结果为 `NaN` 时，将 `model-value` 设为 `null`。

:::demo

input-number/formatter

:::

## InputNumber API

### InputNumber Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值 | ^[number] / ^[null] | — |
| min | 允许的最小值 | ^[number] | Number.MIN_SAFE_INTEGER |
| max | 允许的最大值 | ^[number] | Number.MAX_SAFE_INTEGER |
| step | 增量步长 | ^[number] | 1 |
| step-strictly | 输入值只能为 step 的整数倍 | ^[boolean] | false |
| precision | 数值精度 | ^[number] | — |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | default |
| readonly | 同原生 readonly | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| controls | 是否显示控制按钮 | ^[boolean] | true |
| controls-position | 控制按钮的位置 | ^[enum]`'' \| 'right'` | — |
| name | 原生 name | ^[string] | — |
| aria-label | 原生 aria-label | ^[string] | — |
| placeholder | 同原生 placeholder | ^[string] | — |
| id | 原生 id | ^[string] | — |
| value-on-clear | 输入框清空时赋的值 | ^[number] / ^[null] / ^[enum]`'min' \| 'max'` | — |
| validate-event | 是否触发表单校验 | ^[boolean] | true |
| inputmode | 同原生 inputmode | ^[string] | — |
| align | 内部输入框的对齐方式 | ^[enum]`'left' \| 'center' \| 'right'` | 'center' |
| disabled-scientific | 是否禁用科学计数法输入（如 'e'） | ^[boolean] | false |
| tabindex | 同原生 tabindex | ^[string] / ^[number] | 0 |
| formatter | 展示值的格式化函数 | ^[Function]`(value: string) => string` | — |
| parser | 从格式化后的输入中还原值的函数 | ^[Function]`(value: string) => string` | — |

### InputNumber Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 值变化 | ^[Function]`(currentValue: number \| null, oldValue: number \| null) => void` |
| onBlur | 内部输入框失焦 | ^[Function]`(event: FocusEvent) => void` |
| onFocus | 内部输入框聚焦 | ^[Function]`(event: FocusEvent) => void` |

### InputNumber Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| decrease-icon | 自定义减少按钮图标 | `decreaseIcon` |
| increase-icon | 自定义增加按钮图标 | `increaseIcon` |
| prefix | 内部输入框前缀 | `prefix` |
| suffix | 内部输入框后缀 | `suffix` |

### InputNumber Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 使内部输入框获得焦点 | ^[Function]`() => void` |
| blur | 使内部输入框失去焦点 | ^[Function]`() => void` |
