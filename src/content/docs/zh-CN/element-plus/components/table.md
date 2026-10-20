---
title: "Table 表格"
description: "用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。"
group: 数据展示
order: 150
---

# Table 表格

用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。

## 基础表格

基础的表格展示用法。

:::demo 当 `el-table` 元素中注入 `data` 对象数组后，在 `el-table-column` 中用 `prop` 属性来对应对象中的键名即可填入数据，用 `label` 属性来定义表格的列名。可以使用 `width` 属性来定义列宽。

table/basic

:::

## 带斑马纹表格

使用带斑马纹的表格，可以更容易区分出不同行的数据。

:::demo `stripe` 可以创建带斑马纹的表格。如果 `true`, 表格将会带有斑马纹。

table/striped

:::

## 带边框表格

:::demo 默认情况下，Table 组件是不具有竖直方向的边框的，如果需要，可以使用 `border` 属性，把该属性设置为 `true` 即可启用。

table/with-border

:::

## 带状态表格

可将表格内容 highlight 显示，方便区分「成功、信息、警告、危险」等内容。

:::demo 可以通过指定 Table 组件的 `row-class-name` 属性来为 Table 中的某一行添加 class，这样就可以自定义每一行的样式了。

table/with-status

:::

## 显示溢出工具提示的表格

当内容太长时，它会分成多行。您可以使用 `show-overflow-tooltip` 将其保留在一行中。

:::demo 属性 show-overflow-tooltip 接受一个布尔值。为 `true` 时多余的内容会在 hover 时以 tooltip 的形式显示出来。

table/show-overflow-tooltip

:::

## 固定表头

纵向内容过多时，可选择固定表头。

:::demo 只要在 `el-table` 元素中定义了 `height` 属性，即可实现固定表头的表格，而不需要额外的代码。

table/fixed-header

:::

## 固定列

横向内容过多时，可选择固定列。

:::demo 固定列需要使用 `fixed` 属性，它接受 `Boolean` 值。如果为 `true`, 列将被左侧固定. 它还接受传入字符串，left 或 right，表示左边固定还是右边固定。

table/fixed-column

:::

## 固定列和表头

当您有大量数据块放入表中，您可以同时固定表头和列。

:::demo 固定列和表头可以同时使用，只需要将上述两个属性分别设置好即可。

table/fixed-column-and-header

:::

## 流体高度

当数据量动态变化时，可以为 Table 设置一个最大高度。

:::demo 通过设置 `max-height` 属性为 `el-table` 指定最大高度。此时若表格所需的高度大于最大高度，则会显示一个滚动条。

table/fixed-header-with-fluid-header

:::

## 多级表头

数据结构比较复杂的时候，可使用多级表头来展现数据的层次关系。

:::demo 只需要将el-table-column 放置于el-table-column 中，你可以实现组头。

table/grouping-header

:::

## 固定表头

支持固定群组头

:::demo 组头的属性 `fixed` 由最外层 `el-table-column`决定

table/fixed-column-and-group-header

:::

## 单选

选择单行数据时使用色块表示。

:::demo Table 组件提供了单选的支持，只需要配置 `highlight-current-row` 属性即可实现单选。之后由 `current-change` 事件来管理选中时触发的事件，它会传入 `currentRow`，`oldCurrentRow`。如果需要显示索引，可以增加一列 `el-table-column`，设置 `type` 属性为 `index` 即可显示从 1 开始的索引号。

table/single-select

:::

## 多选

你也可以选择多行。

在^(2.8.3) 之后， `toggleRowSelection` 支持第三个参数 `ignoreSelectable` 以确定是否忽略可选属性。

:::demo 实现多选非常简单: 手动添加一个 `el-table-column`，设 `type` 属性为 `selection` 即可；

table/multi-select

:::

## 排序

对表格进行排序，可快速查找或对比数据。

:::demo 在列中设置 `sortable` 属性即可实现以该列为基准的排序，接受一个 `Boolean`，默认为 `false`。可以通过 Table 的 `default-sort` 属性设置默认的排序列和排序顺序。可以使用 `sort-method` 或者 `sort-by` 使用自定义的排序规则。如果需要后端排序，需将 `sortable` 设置为 `custom`，同时在 Table 上监听 `sort-change` 事件，在事件回调中可以获取当前排序的字段名和排序顺序，从而向接口请求排序后的表格数据。在本例中，我们还使用了 `formatter` 属性，它用于格式化指定列的值，接受一个 `Function`，会传入两个参数：`row` 和 `column`，可以根据自己的需求进行处理。

table/sort

:::

## 筛选

对表格进行筛选，可快速查找到自己想看的数据。

:::demo 在列中设置 `filters` 和 `filter-method` 属性即可开启该列的筛选， filters 是一个数组，`filter-method` 是一个方法，它用于决定某些数据是否显示，会传入三个参数：`value`, `row` 和 `column`。

table/filter

:::

## 自定义列模板

自定义列的显示内容，可组合其他组件使用。

:::demo 通过 `slot` 可以获取到 row, column, $index 和 store（table 内部的状态管理）的数据，用法参考 demo。

table/custom-column

:::

## 自定义表头

表头支持自定义。

:::demo 通过设置 [slot](https://v3.vuejs.org/guide/component-slots.html) 来自定义表头。

table/custom-header

:::

## 展开行

当行内容过多并且不想显示横向滚动条时，可以使用 Table 展开行功能。

在 ^(2.9.7) 版本后，新增了 `preserve-expanded-content` 属性，用于控制折叠时是否在 DOM 中保留已展开的行内容。

:::demo 通过设置 type="expand" 和 slot 可以开启展开行功能， el-table-column 的模板会被渲染成为展开行的内容，展开行可访问的属性与使用自定义列模板时的 slot 相同。

table/expandable-row

:::

## 树形数据与懒加载

:::demo 支持树类型的数据的显示。当 row 中包含 `children` 字段时，被视为树形数据。渲染嵌套数据需要 prop 的 `row-key`。此外，子行数据可以异步加载。设置 Table 的`lazy`属性为 true 与加载函数 `load` 。通过指定 row 中的`hasChildren`字段来指定哪些行是包含子节点。 `children` 与`hasChildren`都可以通过 `tree-props `配置。

table/tree-and-lazy

:::

## 可选择的树形数据^(2.8.0)

:::demo 当 `treeProps.checkStrictly` 为 true，父节点和子节点的选择状态不再关联， 也就是说，当选择父节点时，它的子节点将不被选择； 当 `treeProps.checkStrictly` 是false，父节点和子节点的选择状态将与子节点的选择状态相关联， 也就是说，当选择父节点时，将选择其所有子节点。

table/check-strictly

:::

## 表尾合计行

若表格展示的是各类数字，可以在表尾显示各列的合计。

:::demo 将 `show-summary` 设置为`true`就会在表格尾部展示合计行。默认情况下，对于合计行，第一列不进行数据求合操作，而是显示「合计」二字（可通过`sum-text`配置），其余列会将本列所有数值进行求合操作，并显示出来。当然，你也可以定义自己的合计逻辑。使用 `summary-method` 并传入一个方法，返回一个数组，这个数组中的各项就会显示在合计行的各列中，可以是一个 VNode 或 String，具体可以参考本例中的第二个表格。

table/summary

:::

## 合并行或列

多行或多列共用一个数据时，可以合并行或列。

:::demo 通过给 table 传入`span-method`方法可以实现合并行或列，方法的参数是一个对象，里面包含当前行` row`、当前列 ` column`、当前行号` rowIndex`、当前列号 ` columnIndex` 四个属性。该函数可以返回一个包含两个元素的数组，第一个元素代表 ` rowspan`，第二个元素代表 ` colspan`。也可以返回一个键名为` rowspan` 和` colspan` 的对象。

table/rowspan-and-colspan

:::

## 自定义索引

自定义 `type=index` 列的行号。

:::demo 通过给` type=index` 的列传入 index 属性，可以自定义索引。该属性传入数字时，将作为索引的起始值。也可以传入一个方法，它提供当前行的行号（从 `0` 开始）作为参数，返回值将作为索引展示。

table/custom-index

:::

## 表格布局

通过属性 [table-layout](https://developer.mozilla.org/en-US/docs/Web/CSS/table-layout) 可以指定表格中单元格、行和列的布局方式

:::demo

table/table-layout

:::

## Tooltip 自定义 ^(2.9.4)

您可以使用 `tooltip-formatter` 自定义 Tooltip 提示内容。

:::demo

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
