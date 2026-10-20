---
title: "InputOtp 一次性密码输入框 ^(beta)"
description: "用于输入一次性密码（OTP）。"
group: 表单组件
order: 130
---

# InputOtp 一次性密码输入框 ^(beta)

用于输入一次性密码（OTP）。

## 基础用法

:::demo

input-otp/basic

:::

## 自定义长度

:::demo 通过 `length` 自定义输入框的数量。

input-otp/custom-length

:::

## 类型

:::demo 支持三种类型：outlined（默认）、filled、underlined。

input-otp/types

:::

## 尺寸

:::demo 支持三种尺寸：`large`、`default`、`small`。

input-otp/sizes

:::

## 禁用与只读

:::demo 支持 `disabled` 与 `readonly` 状态。

input-otp/disabled

:::

## 掩码

:::demo 通过 `mask` 隐藏输入的字符。

input-otp/mask

:::

## 分隔符

:::demo 自定义 OTP 输入框之间的分隔符。

input-otp/separator

:::

## 自定义校验

:::demo 通过 `validator` 校验输入的字符，并用 `inputmode` 指定键盘类型。

input-otp/validator

:::

## InputOtp API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | OTP 各框的值。数字不能有前导零，官方仅允许初始化时传数字 | ^[string] / ^[number] | undefined |
| length | OTP 输入框数量 | ^[number] | 6 |
| validator | 自定义校验函数，返回 false 时该字符不写入 | ^[Function]`(char: string, index: number) => boolean` | `() => true` |
| inputmode | 原生 `inputmode` 属性 | ^[string] | — |
| type | 输入框类型 | ^[enum]`'outlined' \| 'filled' \| 'underlined'` | outlined |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| mask | 是否密码模式（掩码显示） | ^[boolean] | — |
| disabled | 是否禁用 | ^[boolean] | undefined |
| readonly | 同原生 `readonly` | ^[boolean] | false |
| validate-event | 是否触发表单校验 | ^[boolean] | true |
| id | 原生 `id` 属性 | ^[string] | — |
| aria-label | 原生 `aria-label` 属性 | ^[string] | — |
| separator | 框之间的分隔符，字符串 / ReactNode / `(index) => ReactNode` | ^[string] / ^[ReactNode] / ^[Function] | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| separator | 框之间的分隔符，作用域参数为当前框下标；提供即渲染 | `separatorSlot={(index) => ReactNode}` |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 值更新，对应官方 `update:modelValue` | ^[Function]`(value: string) => void` |
| onValueChange | 失焦且值相比获焦时变化时触发，对应官方 `change` | ^[Function]`(value: string) => void` |
| onFinish | 所有框填满时触发，对应官方 `finish` | ^[Function]`(value: string) => void` |
| onFocus | 获焦时触发（跳过内部框之间的焦点转移） | ^[Function]`(event: FocusEvent) => void` |
| onBlur | 失焦时触发（跳过内部框之间的焦点转移） | ^[Function]`(event: FocusEvent) => void` |

### Exposes

通过 `ref` 获取，对应官方 `defineExpose`。

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| inputRefs | HTML input 元素数组 | ^[array]`(HTMLInputElement \| undefined)[]` |
| focus | 聚焦到指定 OTP 框 | ^[Function]`(index?: number) => void` |
| blur | 让当前聚焦的 OTP 框失焦 | ^[Function]`() => void` |

## 未实现的官方能力

- `separator` 传 VNode（如官方示例 `h('span', null, '—')`）时的动态组件渲染：
  React 直接接收 ReactNode，语义一致，只是不再有 VNode 概念。
- `separator` 的默认插槽回退链（`$slots.separator || separators[index]`）在本实现里
  拆成 `separatorSlot` 与 `separator` 两个 prop，提供 `separatorSlot` 时优先且始终渲染。
