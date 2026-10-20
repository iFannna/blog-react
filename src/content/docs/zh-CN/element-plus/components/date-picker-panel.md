---
title: "DatePickerPanel 日期选择器面板"
description: "DatePickerPanel 是 DatePicker 的核心组件。"
group: 表单组件
order: 60
---

# DatePickerPane 日期选择器面板 ^(beta)

`DatePickerPanel`是`DatePicker`的核心组件。

## 选择某一天

以”日“为基本单位，基础的日期选择控件

:::demo

date-picker-panel/basic

:::

## 边框

默认情况下，边框是默认的，如果你不想要边框请参考示例。例如，`DatePicker`不继承`border`。

:::demo

date-picker-panel/border

:::

## 禁用

"禁用"属性决定日期选择器是否完全禁用。

:::demo

date-picker-panel/disabled

:::

## 展示类型

时间面板的类型由 `type` 属性指定。

:::demo

date-picker-panel/all-types

:::

## 本地化

由于 Element Plus 的默认语言为英语，如果你需要设置其它的语言，请参考[国际化](/zh-CN/guide/i18n)文档。

要注意的是：日期相关的文字（月份，每一周的第一天等等）也都进行了本地化配置。

## DatePickerPanel API

DatePickerPanel 是 DatePicker 的核心组件。

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value；范围选择器应为长度为 2 的数组 | ^[number] / ^[string] / ^[Date] / ^[array]`number[] \| string[] \| Date[]` | '' |
| border | 是否显示边框 | ^[boolean] | true |
| disabled | 是否禁用 | ^[boolean] | false |
| clearable | 是否显示清空按钮 | ^[boolean] | true |
| editable | 输入框是否可编辑 | ^[boolean] | true |
| type | 选择器类型 | ^[enum]`'year' \| 'years' \| 'month' \| 'months' \| 'date' \| 'dates' \| 'datetime' \| 'week' \| 'datetimerange' \| 'daterange' \| 'monthrange' \| 'yearrange'` | date |
| defaultValue | 日历默认显示日期 | ^[object]`Date \| [Date, Date]` | — |
| defaultTime | 选择范围时使用的时间值 | ^[object]`Date \| [Date, Date]` | — |
| valueFormat | 绑定值格式，不传时绑定值为 Date | ^[string] | — |
| dateFormat | 面板中日期显示格式 | ^[string] | YYYY-MM-DD |
| timeFormat | 面板中时间显示格式 | ^[string] | HH:mm:ss |
| unlinkPanels | 范围选择时左右面板不联动 | ^[boolean] | false |
| singlePanel | 范围选择时只显示一个面板 | ^[boolean] | false |
| disabledDate | 判断日期是否禁用 | ^[Function]`(data: Date) => boolean` | — |
| shortcuts | 快捷选项 | ^[array]`Array<{ text: string, value: Date \| Function }>` | [] |
| cellClassName | 自定义单元格类名 | ^[Function]`(data: Date) => string` | — |
| showFooter | 是否显示底栏，仅 dates / months / years / datetime / datetimerange | ^[boolean] | false |
| showConfirm | 是否显示确认按钮 | ^[boolean] | false |
| showWeekNumber | 是否显示周数 | ^[boolean] | false |

### Events

| 事件名 | 说明 | 类型 |
| --- | --- | --- |
| onChange | 绑定值变化，对应官方 v-model | ^[Function]`(val: DateModelValue) => void` |
| onCalendarChange | 日历选中日期变化时触发，仅范围模式 | ^[Function]`(val: [Date, null \| Date]) => void` |
| onPanelChange | 点击导航按钮时触发 | ^[Function]`(date: Date \| [Date, Date], mode: 'month' \| 'year', view?: string) => void` |
| onClear | 点击清空按钮时触发 | ^[Function]`() => void` |

### Slots

| 插槽名 | 说明 |
| --- | --- |
| renderCell | 自定义单元格内容，对应官方 default 插槽 |
| prevMonthIcon / nextMonthIcon | 上 / 下个月图标 |
| prevYearIcon / nextYearIcon | 上 / 下一年图标 |

### Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| focus | 聚焦面板 | ^[Function]`() => void` |
| isValidValue | 判断值是否合法 | ^[Function]`(date: DayOrDays) => boolean` |
| parseUserInput | 解析用户输入 | ^[Function]`(value: UserInput) => DayOrDays \| null` |
| handleClear | 清空面板值 | ^[Function]`() => void` |
