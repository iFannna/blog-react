---
title: "DatePicker 日期选择器"
description: "用于选择或输入日期，支持年、月、周、日期、日期时间与范围选择。"
group: 表单组件
order: 70
---

# DatePicker 日期选择器

用于选择或输入日期

## 选择某一天

以”日“为基本单位，基础的日期选择控件

基本单位由 `type` 属性指定。通过 `shortcuts` 配置快捷选项，通过 `disabledDate` 函数，来设置禁用掉的日期。

:::demo

date-picker/enter-date

:::

## 其他日期单位

You can choose week, month, year, quarter or multiple dates by extending the standard date picker component.

:::demo

date-picker/other-measurements

:::

## 选择一段时间

你可以通过如下例子来学习如何设置一个日期范围选择器。

在选择日期范围时，默认情况下左右面板会联动。如果希望两个面板各自独立切换当前月份，可以使用 `unlink-panels` 属性解除联动。

:::demo

date-picker/date-range

:::

## 选择月份范围

你当然还可以选择一个月的范围。

在选择月份范围时，默认情况下左右面板会联动。如果希望两个面板各自独立切换当前年份，可以使用 `unlink-panels` 属性解除联动。

:::demo

date-picker/month-range

:::

## 年份范围^(2.8.0)

你可以通过如下例子来学习如何设置一个年份范围选择器。

在选择范围时，默认情况下左右面板会联动。如果希望两个面板各自独立切换当前年份，可以使用 `unlink-panels` 属性解除联动。

:::demo

date-picker/year-range

:::

## Quarter Range ^(2.14.5)

Picking a quarter range is supported.

在选择范围时，默认情况下左右面板会联动。如果希望两个面板各自独立切换当前年份，可以使用 `unlink-panels` 属性解除联动。

:::demo

date-picker/quarter-range

:::

## 单个面板 ^(2.14.0)

默认日期选择器范围有两个面板。如果你想要一个面板设置 `single-panel` 属性。

:::demo

date-picker/single-panel

:::

## 默认值

日期选择器会在用户未选择任何日期的时候默认展示当天的日期。你也可以使用 `default-value` 来修改这个默认的日期。请注意该值需要是一个可以解析的 `new Date()` 对象。

如果类型是 `daterange`, `default-value` 则会设置左边窗口的默认值。

:::demo

date-picker/default-value

:::

## 日期格式

使用`format`指定输入框的格式。使用 `value-format` 指定绑定值的格式。

默认情况下，组件接受并返回`Date`对象。

在 [这里](https://day.js.org/docs/en/display/format#list-of-all-available-formats) 查看 Day.js 支持的所有格式。

:::warning

请一定要注意传入参数的大小写是否正确

:::

:::demo

date-picker/date-formats

:::

## 默认显示日期

在选择日期范围时，你可以指定起始日期和结束日期的默认时间。

默认情况下，开始日期和结束日期的时间部分都是选择日期当日的 `00:00:00`。通过 `default-time` 可以分别指定开始日期和结束日期的具体时刻。它接受最多两个日期对象的数组。其中第一项控制起始日期的具体时刻，第二项控制结束日期的具体时刻。

:::demo

date-picker/default-time

:::

## 设置自定义前缀的内容

前缀内容可以被自定义。

当你从其他vue组件或由渲染函数生成的组件中导入组件时, 你可以设置 `prefix-icon` 属性来定制前缀内容

:::demo

date-picker/custom-prefix-icon

:::

## 自定义内容

弹出框的内容是可以自定义的，在插槽内你可以获取到当前单元格的数据请注意，自定义内容结构应与默认结构一致，否则可能风格会不一致。

:::demo

date-picker/custom-content

:::

## 自定义图标 ^(2.8.0)

使用插槽自定义图标。

:::demo

date-picker/custom-icon

:::

## 国际化

由于 Element Plus 的默认语言为英语，如果你需要设置其它的语言，请参考[国际化](/zh-CN/guide/i18n)文档。

要注意的是：日期相关的文字（月份，每一周的第一天等等）也都是通过国际化来配置的。

## DatePicker API

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value；范围选择器应为长度为 2 的数组 | ^[number] / ^[string] / ^[Date] / ^[array]`number[] \| string[] \| Date[]` | '' |
| readonly | 是否只读 | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| size | 输入框尺寸 | ^[enum]`'' \| 'large' \| 'default' \| 'small'` | — |
| editable | 输入框是否可编辑 | ^[boolean] | true |
| clearable | 是否显示清空按钮 | ^[boolean] | true |
| placeholder | 非范围模式的占位文本 | ^[string] | '' |
| startPlaceholder | 范围模式起始占位文本 | ^[string] | — |
| endPlaceholder | 范围模式结束占位文本 | ^[string] | — |
| type | 选择器类型 | ^[enum]`'year' \| 'years' \| 'month' \| 'months' \| 'date' \| 'dates' \| 'datetime' \| 'week' \| 'datetimerange' \| 'daterange' \| 'monthrange' \| 'yearrange'` | date |
| format | 输入框显示格式 | ^[string] | YYYY-MM-DD |
| popperClass | 下拉面板自定义类名 | ^[string] | — |
| popperStyle | 下拉面板自定义样式 | ^[string] / ^[object] | — |
| rangeSeparator | 范围分隔符 | ^[string] | '-' |
| defaultValue | 日历默认显示日期 | ^[object]`Date \| [Date, Date]` | — |
| defaultTime | 选择范围时使用的时间值 | ^[object]`Date \| [Date, Date]` | — |
| valueFormat | 绑定值格式，不传时绑定值为 Date | ^[string] | — |
| id | 原生 input 的 id | ^[string] / ^[array]`[string, string]` | — |
| name | 原生 input 的 name | ^[string] / ^[array]`[string, string]` | '' |
| unlinkPanels | 范围选择时左右面板不联动 | ^[boolean] | false |
| singlePanel | 范围选择时只显示一个面板 | ^[boolean] | false |
| prefixIcon | 自定义前缀图标 | ^[string] / ^[object]`Component` | '' |
| clearIcon | 自定义清空图标 | ^[string] / ^[object]`Component` | CircleClose |
| validateEvent | 是否触发表单校验 | ^[boolean] | true |
| disabledDate | 判断日期是否禁用 | ^[Function]`(data: Date) => boolean` | — |
| shortcuts | 快捷选项 | ^[array]`Array<{ text: string, value: Date \| Function }>` | [] |
| cellClassName | 自定义单元格类名 | ^[Function]`(data: Date) => string` | — |
| teleported | 下拉是否挂载到 body | ^[boolean] | true |
| emptyValues | 组件空值配置 | ^[array] | — |
| valueOnClear | 清空后的返回值 | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| fallbackPlacements | 浮层兜底方位 | ^[array]`Placement[]` | ['bottom', 'top', 'right', 'left'] |
| placement | 下拉位置 | `Placement` | bottom |
| showFooter | 是否显示底栏 | ^[boolean] | true |
| showConfirm | 是否显示确认按钮 | ^[boolean] | true |
| showWeekNumber | 是否显示周数 | ^[boolean] | false |
| automaticDropdown | 聚焦输入框时是否自动弹出 | ^[boolean] | true |

### Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onChange | 用户确认值或点击外部时触发 | ^[Function]`(val: typeof v-model) => void` |
| onBlur | 输入框失焦时触发 | ^[Function]`(e: FocusEvent) => void` |
| onFocus | 输入框聚焦时触发 | ^[Function]`(e: FocusEvent) => void` |
| onClear | 点击清空按钮时触发 | ^[Function]`() => void` |
| onCalendarChange | 日历选中日期变化时触发，仅范围模式 | ^[Function]`(val: [Date, null \| Date]) => void` |
| onPanelChange | 点击导航按钮时触发 | ^[Function]`(date: Date \| [Date, Date], mode: 'month' \| 'year', view?: string) => void` |
| onVisibleChange | 下拉出现 / 消失时触发 | ^[Function]`(visibility: boolean) => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| renderCell | 自定义单元格内容，对应官方 default 插槽 |
| separator | 自定义范围分隔符内容，对应官方 range-separator 插槽 |
| prevMonthIcon | 上个月图标 |
| nextMonthIcon | 下个月图标 |
| prevYearIcon | 上一年图标 |
| nextYearIcon | 下一年图标 |

### Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 聚焦输入框 | ^[Function]`() => void` |
| blur | 输入框失焦 | ^[Function]`() => void` |
| handleOpen | 打开下拉面板 | ^[Function]`() => void` |
| handleClose | 关闭下拉面板 | ^[Function]`() => void` |
