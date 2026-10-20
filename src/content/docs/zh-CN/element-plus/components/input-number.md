---
title: "Input Number 数字输入框"
description: "仅允许输入标准的数字值，可定义范围。"
group: 表单组件
order: 110
---

# Input Number 数字输入框

仅允许输入标准的数字值，可定义范围。

## 基础用法

:::demo 绑定 `value` 与 `onChange` 即可使用， `min` 与 `max` 控制可输入的范围。

input-number/basic

:::

## 禁用状态

:::demo `disabled` 接受一个 boolean，设为 true 即可禁用整个组件。

input-number/disabled

:::

## 步长

:::demo 通过 `step` 属性设置每次改变的步长。

input-number/steps

:::

## 严格步长

:::demo `stepStrictly` 接受一个 boolean，设为 true 后输入值只能是 `step` 的整数倍。

input-number/step-strictly

:::

## 精度

:::demo 通过 `precision` 属性设置数值精度。`precision` 必须是非负整数， 且不能小于 `step` 的小数位数。

input-number/precision

:::

## 尺寸

:::demo 通过 `size` 属性设置尺寸，除默认外还有 `large`、 `small`。

input-number/size

:::

## 按钮位置

:::demo 设置 `controlsPosition` 决定控制按钮的位置，设为 `right` 后按钮固定在右侧。

input-number/controlled

:::

## 自定义图标

:::demo 使用 `decreaseIcon` 与 `increaseIcon` 自定义控制按钮的图标。

input-number/custom

:::

## 前缀与后缀

:::demo 使用 `prefix` 与 `suffix` 为内部输入框添加前后缀。

input-number/with-prefix-suffix

:::

## 格式化

:::demo 设置 `formatter` 展示格式化后的值，通常与 `parser` 搭配使用。 设置 `formatter` 后内部输入框的 `type` 会变为 `text`，允许输入非数字字符；组件内部用 `Number.parseFloat` 解析，解析成功时把数值写回，解析为 NaN 时写入 `null`。

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `model-value` / `v-model` | `value` | React 惯用写法 |
| `@change` + `update:modelValue` + `@input` | `onChange(currentValue, oldValue)` | 官方三个事件在数值变化时同时触发，React 侧合并为一次回调 |
| `decrease-icon` 等插槽 | `decreaseIcon` 等 props | 无插槽语法，改用节点属性 |
| `@blur` / `@focus` | `onBlur` / `onFocus` | 透传内部 ElInput 的焦点事件 |
| `ref.focus()` / `ref.blur()` | `ref.current.focus()` / `ref.current.blur()` | `ref` 类型为 `InputNumberExpose` |

### 未实现的官方能力

| 能力 | 原因 |
| --- | --- |
| `label` 属性（已废弃） | 官方标注 deprecated，等价于 `aria-label`，未实现 |
| `@input` 事件 | 与 ElInput 一致，输入过程不单独暴露事件，仅 `onChange` 回传解析后的值 |

**实现说明**：数值处理逐行移植官方实现，包含 `toPrecision` / `getPrecision` /
`ensurePrecision` / `verifyValue` / `setCurrentValue` / `displayValue` /
`handleInput` / `handleInputChange`，编辑期间用 `userInput` 优先展示，
失焦或回车后再回写受控值；长按按钮的连续加减按官方 `v-repeat-click`
的节奏实现（首次立即触发，按住 600ms 后每 100ms 触发一次）。
