---
title: "DatePicker 日期选择器"
description: "用于选择或输入日期，支持年、月、周、日期、日期时间与范围选择。"
group: 表单组件
order: 70
---

# DatePicker 日期选择器

用于选择或输入日期，支持年、月、周、日期、日期时间与范围选择。

## 输入日期

:::demo 通过 `type` 属性决定度量单位。通过 `shortcuts` 启用快捷选项，通过 `disabledDate` 禁用日期。

date-picker/enter-date

:::

## 其他度量

:::demo 扩展标准日期选择器，可以选择周、月、年或多选日期。

date-picker/other-measurements

:::

## 日期范围

:::demo 支持选择日期范围。范围模式下左右面板默认联动，可通过  `unlinkPanels` 取消联动。

date-picker/date-range

:::

## 月份范围

:::demo 支持选择月份范围。范围模式下左右面板默认联动，可通过  `unlinkPanels` 取消联动。

date-picker/month-range

:::

## 年份范围

:::demo 支持选择年份范围。范围模式下左右面板默认联动，可通过  `unlinkPanels` 取消联动。

date-picker/year-range

:::

## Quarter Range

:::demo 支持选择季度范围。范围模式下左右面板默认联动，可通过 `unlinkPanels` 取消联动。

date-picker/quarter-range

:::

## 单面板

:::demo 范围选择器默认显示两个面板，通过 `singlePanel` 只显示一个面板。

date-picker/single-panel

:::

## 默认值

:::demo 未选择日期时默认显示当天日历，可通过 `defaultValue`  指定其他日期。类型为 `daterange` 时，它设置左侧日历。

date-picker/default-value

:::

## 日期格式

:::demo 通过 `format` 控制输入框显示格式，通过  `valueFormat` 控制绑定值格式。默认绑定与返回值均为 Date 对象。

date-picker/date-formats

:::

## 范围默认时间

:::demo 选择日期范围时可以指定起止日期的时间部分。默认均为  `00:00:00`。

date-picker/default-time

:::

## 自定义前缀内容

:::demo 通过 `prefixIcon` 自定义前缀内容。

date-picker/custom-prefix-icon

:::

## 自定义内容

:::demo 通过 `renderCell` 自定义单元格内容。自定义内容的结构应与默认结构一致， 否则可能出现样式错位。

date-picker/custom-content

:::

## 自定义图标

:::demo 通过对应 props 自定义导航图标。

date-picker/custom-icon

:::

## 国际化

由于 Element Plus 的默认语言为英语，如果你需要设置其它的语言，请参考国际化文档。

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
