---
title: "Pagination 分页"
description: "当数据量过多时，使用分页分解数据。"
group: 数据展示
order: 110
---

# Pagination 分页

当数据量过多时，使用分页分解数据。

## 基础用法

:::demo 使用 `layout` 配置要显示的组件项，用逗号分隔。

pagination/basic-usage

:::

## 页码数量

:::demo 默认超过 7 页时会折叠多余的页码按钮，可用 `pagerCount` 配置。

pagination/number-of-pagers

:::

## 带背景色的分页

:::demo 设置 `background` 让按钮带有背景色。

pagination/background-color

:::

## 小型分页

:::demo 空间有限时可使用 `small`。

pagination/small-pagination

:::

## 只有一页时隐藏

:::demo `hideOnSinglePage` 在只有一页时隐藏整个分页。

pagination/auto-hide-pagination

:::

## 更多元素

:::demo `pageSizes` 接受一个整数数组，每个值对应 sizes 下拉中的一个页码选项。

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
| default | 自定义内容，需在 layout 里声明 `slot`（未实现） |

## 与 Vue 版 API 的差异

| 官方 Vue | React | 说明 |
| --- | --- | --- |
| `v-model:current-page` | `currentPage` + `onCurrentPageChange` | React 惯用写法 |
| `v-model:page-size` | `pageSize` + `onPageSizeChange` | React 惯用写法 |
| `@current-change` / `@size-change` | 同 v-model 回调 | 不额外提供事件别名 |
| `@prev-click` / `@next-click` | 未实现 | — |

**实现说明**：页码折叠算法逐行移植官方 pager 的 pagers computed；`->` 之后的元素
进右对齐区；`sizes` 项复用 ElSelect。

**未实现的官方能力**：`slot` 布局项、`prev-click`/`next-click` 事件、
`teleported` 与 `popper-class`。
