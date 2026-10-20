---
title: "Calendar 日历"
description: "显示日期。"
group: 数据展示
order: 30
---

# Calendar 日历

显示日期。

## 基础用法

:::demo 设置 `value` 指定当前显示的月份，不设置时显示当前月份。

calendar/basic

:::

## 控制器类型

:::demo 通过 `controller-type` 设置日历头部控制器类型，选择器标签可通过 `formatter` 自定义。

calendar/controller-type

:::

## 自定义内容

:::demo 通过 `renderDateCell` 自定义日历单元格内容。

calendar/customize

:::

## 范围

:::demo 通过 `range` 指定显示范围，跨度不能超过两个月。

calendar/range

:::

## 自定义头部

:::demo

calendar/header

:::

## 本地化

日期标题、星期与控制按钮文案均读取 ConfigProvider 语言包。

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
