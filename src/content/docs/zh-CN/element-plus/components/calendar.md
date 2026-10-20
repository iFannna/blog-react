---
title: "Calendar 日历"
description: "显示日期。"
group: 数据展示
order: 30
---

# Calendar 日历

显示日期

## 基础用法

:::demo 设置 `value` 来指定当前显示的月份。如果 `value` 未指定，则显示当月。 `value` 支持 `v-model` 双向绑定。

calendar/basic

:::

## 控制器类型 ^(2.13.1)

:::demo 您可以设置日历头部的控制器类型。设置 `select`时，您可以使用 `formatter` 自定义 `label`。

calendar/controller-type

:::

## 自定义内容

:::demo 通过设置名为 `date-cell` 的 `scoped-slot` 来自定义日历单元格中显示的内容。在 `scoped-slot` 可以获取到 date（当前单元格的日期）, data（包括 type，isSelected，day 属性）。详情解释参考下方的 API 文档。

calendar/customize

:::

## 范围

:::demo 设置 `range` 属性指定日历的显示范围。开始时间必须是周起始日，结束时间必须是周结束日，且时间跨度不能超过两个月。

calendar/range

:::

## 自定义日历头部

:::demo

calendar/header

:::

## 国际化

由于 Element Plus 的默认语言为英语，如果你需要设置其它的语言，请参考[国际化](/zh-CN/guide/i18n)文档。

要注意的是：日期相关的文字（月份，每一周的第一天等等）也都是通过国际化来配置的。

## Calendar API

### Calendar Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| value | 绑定值 | ^[Date] | — |
| onChange | 选中日期变化 | ^[Function]`(value: Date) => void` | — |
| range | 时间范围，开始日期必须为周起始日，结束日期必须为周结束日，跨度不能超过两个月 | ^[array]`[Date, Date]` | — |
| controller-type | 日历头部控制器类型 | ^[enum]`'button' \| 'select'` | button |
| formatter | controller-type 为 select 时格式化选项标签 | ^[Function]`(value: number, type: 'year' \| 'month') => string \| number` | — |
| render-date-cell | 自定义日期单元格 | ^[Function]`(data: CalendarDateCellData) => ReactNode` | — |
| render-header | 自定义头部 | ^[Function]`(date: string, api: CalendarRef) => ReactNode` | — |

### Calendar Date Cell Data

| 属性名 | 说明 | 类型 |
| --- | --- | --- |
| type | 日期所属月份 | ^[enum]`'prev-month' \| 'current-month' \| 'next-month'` |
| isSelected | 是否为当前选中日期 | ^[boolean] |
| day | YYYY-MM-DD 格式日期 | ^[string] |
| date | 单元格对应日期 | ^[Date] |

### Calendar Exposes

| 名称 | 说明 | 类型 |
| --- | --- | --- |
| selectedDay | 当前选中日期 | ^[Date] / ^[undefined] |
| pickDay | 选择指定日期 | ^[Function]`(day: Date) => void` |
| selectDate | 切换到指定相对日期 | ^[Function]`(type: CalendarDateType) => void` |
| calculateValidatedDateRange | 根据开始与结束日期计算有效区间 | ^[Function]`(start: Date, end: Date) => [Date, Date][]` |
