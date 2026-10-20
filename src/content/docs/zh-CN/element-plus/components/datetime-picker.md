---
title: "DateTimePicker 日期时间选择器"
description: "在一个选择器中选择日期与时间。"
group: 表单组件
order: 80
---

# DateTimePicker 日期时间选择器

在同一个选择器里选择日期和时间

:::tip

日期时间选择器来自日期选择器和时间选择器的组合。关于属性的更详细解释，请参阅日期选择器和时间选择器。

:::

## 日期和时间点

通过设置`type`属性为`datetime`，即可在同一个选择器里同时进行日期和时间的选择。快捷方式的使用方法与 Date Picker 相同。

:::demo

datetime-picker/date-and-time

:::

## 日期时间格式

使用`format`指定输入框的格式。使用`value-format`指定绑定值的格式。

默认情况下，组件接受并返回`Date`对象。

在 [这里](https://day.js.org/docs/en/display/format#list-of-all-available-formats) 查看 Day.js 支持的所有格式。

:::warning

请一定要注意传入参数的大小写是否正确

:::

:::demo

datetime-picker/date-and-time-formats

:::

## 下拉列表中的日期和时间格式

使用 `date-format` 和 `time-format` 控制下拉列表面板输入框中显示的文本格式

:::demo

datetime-picker/date-and-time-formats-panel

:::

## 日期和时间范围

设置`type`为`datetimerange`即可选择日期和时间范围

:::demo

datetime-picker/date-and-time-range

:::

## 单个面板 ^(2.14.0)

默认日期选择器范围有两个面板。如果你想要一个面板设置 `single-panel` 属性。

:::demo

datetime-picker/single-panel

:::

## 默认的起始与结束时刻

使用`datetimerange`进行范围选择时，在日期选择面板中选定起始与结束的日期，默认会使用该日期的`00:00:00`作为起始与结束的时刻；通过选项`default-time`可以控制选中起始与结束日期时所使用的具体时刻。我们可以使用 `default-time` 属性来控制它。 `default-time`接受一个数组，其中第一项控制起始日期的具体时刻，第二项控制结束日期的具体时刻。第一项控制开始日期的时间值，第二项控制结束日期的时间值。

:::demo

datetime-picker/default-time

:::

## 自定义图标 ^(2.8.0)

使用插槽自定义图标。

:::demo

datetime-picker/custom-icon

:::

## DateTimePicker API

DateTimePicker 由 DatePicker 与 TimePicker 派生，属性可参考两者的完整说明。

### Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值，对应官方 model-value；范围选择器应为长度为 2 的数组 | ^[number] / ^[string] / ^[Date] / ^[array]`number[] \| string[] \| Date[]` | '' |
| readonly | 是否只读 | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| editable | 输入框是否可编辑 | ^[boolean] | true |
| clearable | 是否显示清空按钮 | ^[boolean] | true |
| size | 输入框尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | default |
| placeholder | 非范围模式的占位文本 | ^[string] | — |
| startPlaceholder | 范围模式起始占位文本 | ^[string] | — |
| endPlaceholder | 范围模式结束占位文本 | ^[string] | — |
| arrowControl | 是否用箭头按钮选择时间 | ^[boolean] | false |
| type | 选择器类型 | ^[enum]`'year' \| 'month' \| 'date' \| 'datetime' \| 'week' \| 'datetimerange' \| 'daterange'` | date |
| format | 输入框显示格式 | ^[string] | YYYY-MM-DD HH:mm:ss |
| popperClass | 下拉面板自定义类名 | ^[string] | — |
| popperStyle | 下拉面板自定义样式 | ^[string] / ^[object] | — |
| fallbackPlacements | 浮层兜底方位 | ^[array]`Placement[]` | ['bottom', 'top', 'right', 'left'] |
| placement | 下拉位置 | `Placement` | bottom |
| rangeSeparator | 范围分隔符 | ^[string] | '-' |
| defaultValue | 日历默认显示日期 | ^[object]`Date \| [Date, Date]` | — |
| defaultTime | 选择日期后的默认时间，未设置时为 00:00:00 | ^[object]`Date \| [Date, Date]` | — |
| valueFormat | 绑定值格式，不传时绑定值为 Date | ^[string] | — |
| dateFormat | 面板中日期显示格式 | ^[string] | YYYY-MM-DD |
| timeFormat | 面板中时间显示格式 | ^[string] | HH:mm:ss |
| id | 原生 input 的 id | ^[string] / ^[array]`[string, string]` | — |
| name | 原生 input 的 name | ^[string] | — |
| unlinkPanels | 范围选择时左右面板不联动 | ^[boolean] | false |
| singlePanel | 范围选择时只显示一个面板 | ^[boolean] | false |
| prefixIcon | 自定义前缀图标 | ^[string] / `Component` | Date |
| clearIcon | 自定义清空图标 | ^[string] / `Component` | CircleClose |
| shortcuts | 快捷选项 | ^[array]`Array<{ text: string, value: Date \| Function }>` | — |
| disabledDate | 判断日期是否禁用 | ^[Function]`(data: Date) => boolean` | — |
| disabledHours | 不可选小时 | ^[Function]`(role: string, comparingDate?: Dayjs) => number[]` | — |
| disabledMinutes | 不可选分钟 | ^[Function]`(hour: number, role: string, comparingDate?: Dayjs) => number[]` | — |
| disabledSeconds | 不可选秒 | ^[Function]`(hour: number, minute: number, role: string, comparingDate?: Dayjs) => number[]` | — |
| cellClassName | 自定义单元格类名 | ^[Function]`(data: Date) => string` | — |
| teleported | 下拉是否挂载到 body | ^[boolean] | true |
| emptyValues | 组件空值配置 | ^[array] | — |
| valueOnClear | 清空后的返回值 | ^[string] / ^[number] / ^[boolean] / ^[Function] | — |
| showNow | 是否显示此刻按钮 | ^[boolean] | true |
| showFooter | 是否显示底栏，仅 datetime / datetimerange | ^[boolean] | true |
| showConfirm | 是否显示确认按钮 | ^[boolean] | true |
| showWeekNumber | 是否显示周数 | ^[boolean] | false |

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
| separator | 自定义范围分隔符内容 |
| prevMonthIcon / nextMonthIcon | 上 / 下个月图标 |
| prevYearIcon / nextYearIcon | 上 / 下一年图标 |

### Exposes

| 方法 | 说明 | 类型 |
| --- | --- | --- |
| focus | 聚焦输入框 | ^[Function]`() => void` |
| blur | 输入框失焦 | ^[Function]`() => void` |
