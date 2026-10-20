---
title: "DatePickerPanel 日期选择器面板"
description: "DatePickerPanel 是 DatePicker 的核心组件。"
group: 表单组件
order: 60
---

# DatePickerPanel 日期选择器面板

DatePickerPanel 是 DatePicker 的核心组件。

## 输入日期

:::demo 以「日」为度量单位的基础日期选择面板。

date-picker-panel/basic

:::

## 边框

:::demo 默认情况下面板带边框，某些场景下不需要边框。例如 DatePicker 就不会继承边框。

date-picker-panel/border

:::

## 禁用

:::demo 通过 `disabled` 属性完全禁用日期选择面板。

date-picker-panel/disabled

:::

## 类型

:::demo 度量单位由 `type` 属性决定。

date-picker-panel/all-types

:::

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

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model` | `value` + `onChange` | 受控用法 |
| 默认插槽 `#default` | `renderCell` | 作用域插槽改为 render prop |
| 图标插槽 | `prevMonthIcon` 等 props | 具名插槽改为 ReactNode prop |
| `ref` + defineExpose | `ref` + `DatePickerPanelExpose` | 方法名保持一致 |
