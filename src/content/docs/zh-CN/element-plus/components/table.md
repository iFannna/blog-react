---
title: "Table 表格"
description: "用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。"
group: 数据展示
order: 150
---

# Table 表格

用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。

## 基础表格

:::demo 基础的表格展示用法。

table/basic

:::

## 带斑马纹表格

:::demo 使用带斑马纹的表格，可以更容易区分出不同行的数据。

table/striped

:::

## 带边框表格

:::demo 默认情况下，Table 组件是不具有竖直方向的边框的，如果需要，可以使用 `border` 属性，把该属性设置为 true 即可启用。

table/with-border

:::

## 带状态表格

:::demo 通过 `rowStyle` 或 `rowClassName` 为不同行设置状态样式。

table/with-status

:::

## 内容溢出提示

:::demo 给列设置 `showOverflowTooltip`，内容溢出时 hover 显示完整文本。

table/show-overflow-tooltip

:::

## 固定表头

:::demo 设置 `height` 属性即可实现固定表头。

table/fixed-header

:::

## 固定列

:::demo 通过 `fixed` 属性固定列，横向滚动时该列保持可见。

table/fixed-column

:::

## 固定列和表头

:::demo 同时设置 `height` 与 `fixed`，横向、纵向滚动时表头与固定列保持可见。

table/fixed-column-and-header

:::

## 流体高度表头

:::demo 设置 `maxHeight` 后，表头随内容高度自适应，数据超出时表体滚动。

table/fixed-header-with-fluid-header

:::

## 分组表头

:::demo 通过嵌套 ElTableColumn 实现多层表头。

table/grouping-header

:::

## 固定列与分组表头

:::demo 分组表头同样支持 `fixed="right"`。

table/fixed-column-and-group-header

:::

## 单选

:::demo 设置 `highlightCurrentRow` 可以高亮当前行。

table/single-select

:::

## 多选

:::demo 通过 `type="selection"` 的列开启多选。

table/multi-select

:::

## 排序

:::demo 设置 `sortable` 即可对该列排序，配合 `defaultSort` 设置默认排序。

table/sort

:::

## 筛选

:::demo 通过 `filters` 与 `filterMethod` 开启列筛选， `clearFilter` 可按列或全部清空。

table/filter

:::

## 自定义列模板

:::demo 通过 `children` 函数自定义单元格内容。

table/custom-column

:::

## 自定义表头

:::demo 通过 `renderHeader` 在表头中放置输入框等交互元素。

table/custom-header

:::

## 展开行

:::demo 通过 `type="expand"` 的列与 `renderExpanded` 实现展开行。

table/expandable-row

:::

## 树形数据与懒加载

:::demo 设置 `rowKey` 与 `treeProps` 展示树形数据；配合 `lazy`、`load` 可异步加载子节点。

table/tree-and-lazy

:::

## 严格树形选择

:::demo `treeProps.checkStrictly` 为 true 时父子节点选择互不影响。

table/check-strictly

:::

## 合计行

:::demo 设置 `showSummary` 与 `summaryMethod` 显示合计行。

table/summary

:::

## 合并行或列

:::demo 通过 `spanMethod` 返回数组或对象，合并指定单元格。

table/rowspan-and-colspan

:::

## 自定义索引

:::demo 给 index 列传入函数即可自定义索引值。

table/custom-index

:::

## 表格布局

:::demo `tableLayout` 支持 `fixed` 与 `auto` 两种布局。

table/table-layout

:::

## Tooltip 格式化

:::demo 表格级与列级 `tooltipFormatter` 可自定义溢出提示内容，支持返回 React 节点。

table/tooltip-formatter

:::

## Table API

### Table Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| data | 表格数据 | ^[array]`T[]` | [] |
| size | 表格尺寸 | ^[enum]`'large' \| 'default' \| 'small'` | — |
| height | 表格高度，传入后表头固定 | ^[string] / ^[number] | — |
| max-height | 表格最大高度 | ^[string] / ^[number] | — |
| fit | 列宽是否自动撑满容器 | ^[boolean] | true |
| stripe | 是否显示斑马纹 | ^[boolean] | false |
| border | 是否显示纵向边框 | ^[boolean] | false |
| row-key | 行数据的 Key，树形数据与保留选中态时必填 | ^[string] / ^[Function] | — |
| show-header | 是否显示表头 | ^[boolean] | true |
| show-summary | 是否显示合计行 | ^[boolean] | false |
| sum-text | 合计行第一列的文案 | ^[string] | 合计 |
| summary-method | 自定义合计方法 | ^[Function]`({ columns, data }) => ReactNode[]` | — |
| row-class-name | 行类名 | ^[string] / ^[Function] | — |
| row-style | 行样式 | ^[object] / ^[Function] | — |
| cell-class-name | 单元格类名 | ^[string] / ^[Function] | — |
| cell-style | 单元格样式 | ^[object] / ^[Function] | — |
| header-row-class-name | 表头行类名 | ^[string] / ^[Function] | — |
| header-row-style | 表头行样式 | ^[object] / ^[Function] | — |
| header-cell-class-name | 表头单元格类名 | ^[string] / ^[Function] | — |
| header-cell-style | 表头单元格样式 | ^[object] / ^[Function] | — |
| highlight-current-row | 是否高亮当前行 | ^[boolean] | false |
| empty-text | 空数据文案 | ^[string] | 暂无数据 |
| empty | 自定义空状态内容 | ^[ReactNode] | — |
| append | 表格尾部追加内容 | ^[ReactNode] | — |
| default-sort | 默认排序 | ^[object]`{ prop, order }` | — |
| span-method | 合并行或列的方法 | ^[Function] | — |
| table-layout | 表格布局方式 | ^[enum]`'fixed' \| 'auto'` | fixed |
| scrollbar-always-on | 是否总是显示滚动条 | ^[boolean] | false |
| show-overflow-tooltip | 内容过长是否显示省略号并提供提示 | ^[boolean] | false |
| tooltip-formatter | 表格级溢出提示内容格式化 | ^[Function]`({ row, column, cellValue }) => ReactNode` | — |
| tree-props | 树形数据字段配置 | ^[object]`{ children?, hasChildren?, checkStrictly? }` | — |
| lazy | 是否懒加载子节点（需 rowKey） | ^[boolean] | false |
| load | 懒加载子节点方法 | ^[Function]`(row, treeNode, resolve) => void` | — |
| default-expand-all | 是否默认展开所有树节点 | ^[boolean] | false |
| expand-row-keys | 默认展开的树节点 key | ^[array]`string[]` | — |
| indent | 树形层级缩进（px） | ^[number] | 16 |
| render-expanded | 展开行内容 | ^[Function]`({ row, $index, expanded }) => ReactNode` | — |
| row-expandable | 本行是否可展开 | ^[Function]`(row, index) => boolean` | — |

### Table Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onSelect | 用户勾选/取消某一行时触发 | ^[Function]`(selection, row) => void` |
| onSelectAll | 用户全选/取消全选时触发 | ^[Function]`(selection) => void` |
| onSelectionChange | 选中项变化时触发 | ^[Function]`(selection) => void` |
| onRowClick | 某一行被点击 | ^[Function]`(row, column, event) => void` |
| onCellClick | 某个单元格被点击 | ^[Function]`(row, column, cell, event) => void` |
| onSortChange | 排序变化 | ^[Function]`({ column, prop, order }) => void` |
| onFilterChange | 筛选条件变化 | ^[Function]`(filters) => void` |
| onCurrentChange | 当前行变化（单选） | ^[Function]`(currentRow, oldCurrentRow) => void` |
| onExpandChange | 展开行/树节点变化 | ^[Function]`(row, expanded) => void` |
| onHeaderClick | 表头单元格点击 | ^[Function]`(column, event) => void` |
| onHeaderDragend | 列宽拖拽结束 | ^[Function]`(newWidth, oldWidth, column, event) => void` |

### Table Exposes

| 方法名 | 说明 |
| --- | --- |
| clearSelection | 清空用户选择 |
| getSelectionRows | 返回当前选中的行 |
| toggleRowSelection | 切换某行的选中状态，参数 `(row, selected?, ignoreSelectable?)` |
| toggleAllSelection | 切换全选/取消全选 |
| setCurrentRow | 设置当前行 |
| toggleRowExpansion | 切换展开行或树节点的展开状态 |
| clearSort | 清空排序 |
| sort | 手动排序，参数为 prop 与 order |
| clearFilter | 清空筛选，参数 `columnKeys?: string \| string[]` |
| doLayout | 重新计算表格布局 |

## Table-column API

### Table-column Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| type | 对应列的类型 | ^[enum]`'default' \| 'selection' \| 'index' \| 'expand'` | default |
| prop | 字段名，也可用 `property` | ^[string] | — |
| label | 列标题 | ^[string] | — |
| width | 列宽 | ^[string] / ^[number] | — |
| min-width | 列最小宽度 | ^[string] / ^[number] | — |
| fixed | 是否固定 | ^[boolean] / ^[enum]`'left' \| 'right'` | — |
| align | 对齐方式 | ^[enum]`'left' \| 'center' \| 'right'` | — |
| header-align | 表头对齐方式 | ^[enum]`'left' \| 'center' \| 'right'` | 跟随 align |
| sortable | 是否可排序，传 `'custom'` 时不走内置排序 | ^[boolean] / ^[string] | false |
| sort-method | 自定义排序比较函数 | ^[Function]`(a, b) => number` | — |
| sort-by | 排序字段 | ^[string] / ^[array] / ^[Function] | — |
| sort-orders | 排序状态循环顺序 | ^[array] | ['ascending', 'descending', null] |
| resizable | 列宽是否可拖动 | ^[boolean] | true |
| column-key | 列标识 | ^[string] | — |
| class-name | 列类名 | ^[string] | — |
| label-class-name | 表头类名 | ^[string] | — |
| show-overflow-tooltip | 内容过长是否省略 | ^[boolean] | false |
| tooltip-formatter | 列级溢出提示内容格式化 | ^[Function]`({ row, column, cellValue }) => ReactNode` | — |
| formatter | 内容格式化函数 | ^[Function]`(row, column, cellValue, index) => ReactNode` | — |
| selectable | selection 列中该行是否可勾选 | ^[Function]`(row, index) => boolean` | — |
| filters | 筛选选项 | ^[array]`{ text, value }[]` | — |
| filter-multiple | 是否多选筛选 | ^[boolean] | true |
| filter-method | 筛选逻辑 | ^[Function]`(value, row, column) => boolean` | — |
| filter-placement | 筛选面板位置 | ^[string] | bottom-start |
| filter-class-name | 筛选面板类名 | ^[string] | — |
| filtered-value | 受控筛选值 | ^[array]`string[]` | — |
| index | index 列的自定义下标 | ^[number] / ^[Function]`(index) => number` | — |

### Table Slots（React 属性）

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| empty | 空状态内容 | `empty` 属性 |
| append | 表格尾部追加内容 | `append` 属性 |

### Table-column Slots

| 插槽名 | 说明 | React 写法 |
| --- | --- | --- |
| default | 自定义单元格内容，参数 `{ row, column, $index }` | `children` 函数 |
| header | 自定义表头内容，参数 `{ column, $index }` | `renderHeader` 函数 |
