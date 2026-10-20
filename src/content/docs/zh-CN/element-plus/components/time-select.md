---
title: "TimeSelect 时间选择器"
description: "用于选择或输入时间。"
group: 表单组件
order: 220
---

# TimeSelect 时间选择

用于选择或输入日期

可用时间范围是 00:00-23:59

## 固定时间点

提供几个固定的时间点供用户选择

:::demo 使用 `el-time-select` 标签，然后通过`start`、`end`和`step`指定起始时间，结束时间和步长。

time-select/basic

:::

## 时间格式

使用 `format` 属性来控制时间格式 (小时以及分钟)。

:::demo 在 [这里](https://day.js.org/docs/zh-CN/display/format) 查看 Day.js 支持的 format 参数。

time-select/time-formats

:::

:::warning

请一定要注意传入参数的大小写是否正确

:::

## 固定时间范围

如果先选中了开始（或结束）时间，则结束（或开始）时间的状态也将会随之改变。

:::demo

time-select/time-range

:::

## TimeSelect API

### TimeSelect Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值 | ^[string] / ^[null] | — |
| disabled | 是否禁用 | ^[boolean] | false |
| editable | 输入框是否可编辑 | ^[boolean] | true |
| clearable | 是否显示清空按钮 | ^[boolean] | true |
| include-end-time | 是否把 `end` 也作为可选项 | ^[boolean] | false |
| size | 输入框尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | default |
| placeholder | 占位文本，缺省取语言包的 `el.select.placeholder` | ^[string] | — |
| name | 同原生 input 的 name | ^[string] | — |
| id | 原生 id，供 FormItem 的 label 关联 | ^[string] | — |
| effect | 主题，可选 `dark` / `light` | ^[string] / ^[enum]`'dark' \| 'light'` | light |
| prefix-icon | 自定义前缀图标 | ^[ReactNode] | Clock |
| clear-icon | 自定义清空图标 | ^[ReactNode] | CircleClose |
| start | 起始时间 | ^[string] | 09:00 |
| end | 结束时间 | ^[string] | 18:00 |
| step | 时间步长 | ^[string] | 00:30 |
| min-time | 最小时间，之前的时间项禁用 | ^[string] | — |
| max-time | 最大时间，之后的时间项禁用 | ^[string] | — |
| format | 时间格式，支持 dayjs 的 HH/H/hh/h/mm/m/ss/s/A/a 与 [] 字面量 | ^[string] | HH:mm |
| empty-values | 空值集合，见 ConfigProvider | ^[array] | — |
| value-on-clear | 清空时返回的值，见 ConfigProvider | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| popper-class | 下拉的自定义类名 | ^[string] | '' |
| popper-style | 下拉的自定义样式 | ^[string] / ^[object] | — |
| placement | 下拉位置（React 补充） | ^[enum]`Placement` | bottom-start |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |

### TimeSelect Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 选中值变化（含清空，清空时收到 `value-on-clear`，缺省为 null） | ^[Function]`(value: string \| null) => void` |
| onBlur | 输入框失焦 | ^[Function]`(event: FocusEvent) => void` |
| onFocus | 输入框聚焦 | ^[Function]`(event: FocusEvent) => void` |
| onClear | 点击清空图标 | ^[Function]`() => void` |

### TimeSelect Exposes

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| focus | 让输入框聚焦 | ^[Function]`() => void` |
| blur | 让输入框失焦 | ^[Function]`() => void` |
