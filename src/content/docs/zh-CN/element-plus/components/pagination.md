---
title: "Pagination 分页"
description: "当数据量过多时，使用分页分解数据。"
group: 数据展示
order: 110
---

# Pagination 分页

当数据量过多时，使用分页分解数据。

## 基础用法

:::demo 设置`layout`，表示需要显示的内容，用逗号分隔，布局元素会依次显示。分页元素包括：`prev`（跳转到上一页的按钮）、`next`（跳转到下一页的按钮）、`pager`（页码列表）、`jumper`（跳转输入框）、`total`（总条目数）、`sizes`（用于设置每页条数的选择器）以及 `->`（该符号之后的所有元素将被靠右对齐）。

pagination/basic-usage

:::

## 设置最大页码按钮数

:::demo 默认情况下，当总页数超过 7 页时，Pagination 会折叠多余的页码按钮。通过 `pager-count` 属性可以设置最大页码按钮数。

pagination/number-of-pagers

:::

## 带有背景色的分页

:::demo 设置`background`属性可以为分页按钮添加背景色。

pagination/background-color

:::

## 小型分页

在空间有限的情况下，可以使用简单的小型分页。

:::demo 通过`size`更改大小这是个 `small`的例子

pagination/small-pagination

:::

## 当只有一页时隐藏分页

当只有一页时，通过设置 `hide-on-single-page` 属性来隐藏分页。

:::demo

pagination/auto-hide-pagination

:::

## 附加功能

根据场景需要，可以添加其他功能模块。

:::demo 此示例是一个完整的用例。使用了 `size-change` 和 `current-change` 事件来处理页码大小和当前页变动时候触发的事件。 `page-sizes`接受一个整数类型的数组，数组元素为展示的选择每页显示个数的选项，`[100, 200, 300, 400]` 表示四个选项，每页显示 100 个，200 个，300 个或者 400 个。

pagination/more-elements

:::

## Pagination API

### Pagination Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| total | 总条数 | ^[number] | — |
| page-size | 每页条数 | ^[number] | 10 |
| page-count | 总页数，传入后优先于 total/pageSize 的计算 | ^[number] | — |
| current-page | 当前页 | ^[number] | — |
| pager-count | 页码按钮数量，必须为 5~21 之间的奇数 | ^[number]`5 \| 7 \| 9 \| 11 \| 13 \| 15 \| 17 \| 19 \| 21` | 7 |
| layout | 组件布局，逗号分隔 | ^[string]`sizes, prev, pager, next, jumper, ->, total` | prev, pager, next, jumper, ->, total |
| page-sizes | sizes 下拉的可选值 | ^[array]`number[]` | [10, 20, 30, 40, 50, 100] |
| background | 是否显示背景色 | ^[boolean] | false |
| disabled | 是否禁用 | ^[boolean] | false |
| hide-on-single-page | 只有一页时是否隐藏 | ^[boolean] | false |
| small | 小号分页 | ^[boolean] | false |
| size | 尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| prev-text / next-text | 上一页 / 下一页文字，传入后替换箭头图标 | ^[string] | '' |

### Pagination Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onCurrentPageChange | 当前页变化 | ^[Function]`(page: number) => void` |
| onPageSizeChange | 每页条数变化 | ^[Function]`(size: number) => void` |

### Pagination Slots

| 插槽名 | 说明 |
| --- | --- |
| default | 自定义内容，需在 layout 里声明 `slot` |
