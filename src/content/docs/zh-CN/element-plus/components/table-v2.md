---
title: "Table V2 虚拟化表格"
description: "面向大数据量的虚拟滚动表格，支持固定列、树形数据、动态行高与自定义渲染。"
group: 数据展示
order: 160
---

# Virtualized Table 虚拟化表格 ^(beta)

在前端开发领域，表格一直都是一个高频出现的组件，尤其是在中后台和数据分析场景。但是，对于 [Table V1](./table)来说，当一屏里超过 1000 条数据记录时，就会出现卡顿等性能问题，体验不是很好。

通过虚拟化表格组件，超大数据渲染将不再是一个头疼的问题。

:::tip

该组件**仍在测试中**，生产环境使用可能有风险。若您发现了 bug 或问题，请于 [GitHub](https://github.com/element-plus/element-plus/issues) 报告给我们以便修复。同时，有一些 API 并未在此文档中提及，因为部分还没有开发完全，因此我们不在此提及。

**即使**虚拟化的表格是高效的，但是当数据负载过大时，**网络**和**内存容量**也会成为您应用程序的瓶颈。因此请牢记，虚拟化表格永远不是最完美的解决方案，请考虑数据分页、过滤器等优化方案。

:::

## 基础用法

让我们演示虚拟化表的性能，用10列和1 000行渲染一个基本示例。

:::demo

table-v2/basic

:::

## 自动调整大小

如果不想手动向表格传递 `width` 和 `height` 属性，可以使用 AutoResizer 对表格组件进行封装。这会自动为你更新宽度和高度。

尝试调整您的浏览器大小来看看它是如何工作的。

:::tip

由于 `AutoResizer` 组件的默认高度是 100%，所以请确保该组件的父元素**拥有固定的高度值**。或者，您可以通过将 `style` 属性传递到 `AutoResizer` 来定义它。

:::

:::demo

table-v2/auto-resizer

:::

## 自定义单元格渲染器

当然，您可以根据您的需要呈现表格单元格。这是如何自定义您的单元格的简单例子。

:::demo

table-v2/cell-templating

:::

## 带有选择的表格

使用自定义的单元格渲染来给表格组件添加选择的能力。

:::demo

table-v2/selection

:::

## 可编辑单元格

类似上面添加筛选框的方法，我们可以用同样的方法实现可编辑单元格。

:::demo

table-v2/inline-editing

:::

## 带状态的表格

可将表格内容 highlight 显示，方便区分「成功、信息、警告、危险」等内容。

要自定义行的外观，请使用 `row-class-name` 属性。举个例子，每10行会自动添加 `bg-blue-200` 类名，每5行会添加 `bg-red-100` 类名。

:::demo

table-v2/row-class

:::

## 表格行的粘性布局

您可以简单地使用 `fixed-data` 属性来实现将某些行固定到表格的头部。

您可以根据滚动事件动态设置粘性行，如这个示例所示。

:::demo

table-v2/sticky-rows

:::

## 固定列表格

如果您想要有列粘贴左侧或右侧的某种原因。 您可以通过向表中添加特殊属性来实现这一点。

您可以设置该行的` fixed` 属性为 `true` （代表`FixedDir.LEFT`）、`FixedDir.LEFT` 或 `FixedDir.RIGHT`

:::demo

table-v2/fixed-columns

:::

## 表头分组

正如这个示例，通过自定义表头渲染以将表头分组。

:::tip

在这种情况下，我们使用了 `JSX` 功能，这个功能在playground上不被支持。您可以在本地环境或在线集成开发环境（如 `codesandbox` ）中试用它们。

建议您使用 JSX 使用您的表格组件，因为它包含 VNode 操作。

:::

:::demo

table-v2/grouping-header

:::

## 过滤器

虚拟表格提供自定义页眉渲染器以创建自定义标题。然后我们可以利用这些来渲染过滤器。

:::demo

table-v2/filter

:::

## 可排序表格

您可以使用排序状态来对表格进行排序。

:::demo

table-v2/sort

:::

## 受控的排序

您可以在需要时定义多个可排序的列。请记住，当您在定义了多个可排序的列时， UI 可能会显得有些奇怪，因为用户不知道哪一列被排序。

:::demo

table-v2/controlled-sort

:::

## 高亮显示鼠标悬停单元格

当处理一个大的列表时，很容易丢失当前行的轨迹和您正在访问的一列。在这种情况下，使用这个功能可能很有帮助。

:::demo

table-v2/cross-hovering

:::

## 横跨列

虚拟化表格没有使用内置的 `table` 元素，故 `colspan` 和 `rowspan` 与 [TableV1](./table) 比较略有不同。然而，通过定制的行渲染器，这些功能仍然可以实现。在本节中，我们将演示如何实现这一点。

:::demo

table-v2/colspan

:::

## 纵跨行

既然我们已经提到了 [Colspan](#colspan)，那跨行（row span）也是没有问题的。它与colspan略有不同，但是基本原理是一样的。

:::demo

table-v2/rowspan

:::

## 同时跨行和跨列

我们当然可以同时使用横跨列与纵跨行来满足您的业务需求！

:::demo

table-v2/spans

:::

## 树形数据

虚拟表也可以在树状结构中呈现数据。点击箭头图标，你可以展开或折叠树节点。

:::demo

table-v2/tree-data

:::

## 动态高度行

虚拟表能够呈现具有动态高度的行数。如果您正在处理数据并不确定内容大小， 此功能对于调整到内容高度的渲染行是理想的。要启用此功能，请传递 `estimated-row-height` 属性。估计高度越接近实际内容，渲染体验就越顺。

:::tip

每行高度在渲染过程中动态测量。因此，如果您试图显示大量数据， UI **可能会** 抖动。

:::

:::demo

table-v2/dynamic-height

:::

## 可展开的附加信息

使用动态高度渲染，您也可以在表格中显示详细的视图。

:::demo

table-v2/detailed-view

:::

## 自定义页脚

自定义表格 footer， 通常用来展示一些汇总数据和信息。

:::demo

table-v2/footer

:::

## 自定义空元素渲染器

渲染自定义的空元素。

:::demo

table-v2/empty

:::

## 浮动遮罩层

当您想要显示加载指示器之类的浮动元素，可以通过渲染一个浮动在表格之上的遮罩层来实现。

:::demo

table-v2/overlay

:::

## 手动滚动

使用 Table V2 暴露的方法可以进行手动或编程式的滚动到指定的偏移量或者行。

:::tip

`scrollToRow` 的第二个参数代表滚动策略，计算了要滚动的位置，其默认值是 `auto`。如果你想要滚动到某个特定位置，你可以自己定义战略。可用的选项是 `"auto" | "center" | "end" | "start" | "smart"`

`smart` 和`auto` 之间的区别是， `auto` 是 `smart` 滚动策略的子集。

:::

:::demo

table-v2/manual-scroll

:::

## TableV2 API

### TableV2 Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| cache | 额外预渲染的行数，用于提升滚动性能 | ^[number] | 2 |
| estimated-row-height | 动态行高的估算值；提供后启用行高测量 | ^[number] | — |
| header-class | 表头行的自定义类名 | ^[string] / ^[Function]`(params) => string` | — |
| header-props | 透传给表头的属性 | ^[object] / ^[Function] | — |
| header-cell-props | 透传给表头单元格的属性 | ^[object] / ^[Function] | — |
| header-height | 表头高度；传数组时按数组长度渲染多行表头 | ^[number] / ^[number[]] | 50 |
| footer-height | 底部高度，参与表格总高度计算 | ^[number] | 0 |
| row-class | 行自定义类名 | ^[string] / ^[Function]`(params) => string` | — |
| row-key | 行唯一标识字段 | ^[string] / ^[number] / ^[symbol] | id |
| row-props | 透传给行的属性 | ^[object] / ^[Function] | — |
| row-height | 行高（固定行高模式） | ^[number] | 50 |
| row-event-handlers | 行事件集合，见下方 RowEventHandlers | ^[object] | — |
| cell-props | 透传给每个单元格的属性 | ^[object] / ^[Function] | — |
| columns | 列定义数组 | ^[array]`TableV2Column[]` | — |
| data | 表格数据 | ^[array]`TableV2Row[]` | [] |
| data-getter | 自定义单元格取值方法 | ^[Function]`(params) => T` | — |
| fixed-data | 固定在表头下方、主内容上方的行数据 | ^[array]`TableV2Row[]` | — |
| expand-column-key | 展开图标所在的列 key | ^[string] | — |
| expanded-row-keys | 展开行的 key 数组（受控） | ^[array]`TableV2KeyType[]` | — |
| default-expanded-row-keys | 初始展开行的 key 数组（非响应式） | ^[array]`TableV2KeyType[]` | — |
| class-name / style | 根元素类名与样式 | ^[string] / ^[object] | — |
| fixed | 列宽固定还是弹性分配 | ^[boolean] | false |
| width ^(required) | 表格宽度 | ^[number] | — |
| height ^(required) | 表格高度 | ^[number] | — |
| max-height | 表格最大高度 | ^[number] | — |
| indent-size | 树形层级的水平缩进 | ^[number] | 12 |
| icon-size | 展开图标尺寸 | ^[number] | 12 |
| h-scrollbar-size | 横向滚动条尺寸 | ^[number] | 6 |
| v-scrollbar-size | 纵向滚动条尺寸 | ^[number] | 6 |
| scrollbar-always-on | 是否始终显示滚动条 | ^[boolean] | false |
| sort-by | 单列排序状态 | ^[object]`TableV2SortBy` | {} |
| sort-state | 多列排序状态 | ^[object]`TableV2SortState` | undefined |

### TableV2 Events

| 事件名 | 说明 | 参数 |
| --- | --- | --- |
| onColumnSort | 列排序变化时触发 | ({ column, key, order }) |
| onExpandedRowsChange | 展开行变化时触发 | (expandedRowKeys) |
| onEndReached | 滚动到末尾时触发，参数为剩余距离 | (remainDistance) |
| onScroll | 滚动时触发 | ({ scrollLeft, scrollTop, ... }) |
| onRowsRendered | 行渲染完成时触发 | ({ rowCacheStart, rowCacheEnd, rowVisibleStart, rowVisibleEnd }) |
| onRowExpand | 点击展开箭头时触发 | ({ expanded, rowData, rowIndex, rowKey }) |

### TableV2 Slots

React 版把作用域插槽映射为 render prop，具名插槽映射为 ReactNode 属性。

| 名称 | 说明 | React 映射 |
| --- | --- | --- |
| cell | 自定义单元格内容 | `cellRenderer({ cellData, column, columns, columnIndex, rowData, rowIndex })` |
| header | 自定义整行表头 | `headerRenderer({ cells, columns, headerIndex })` |
| header-cell | 自定义表头单元格 | `headerCellRenderer(params)` |
| row | 自定义整行 | `rowRenderer({ cells, columns, depth, style, rowData, rowIndex, isScrolling })` |
| footer | 表格底部 | `footer` 属性（ReactNode） |
| empty | 数据为空时的内容 | `empty` 属性（ReactNode） |
| overlay | 覆盖在表格上的内容 | `overlay` 属性（ReactNode） |

### TableV2 Exposes

通过 `ref` 获取实例方法。

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| scrollTo | 滚动到指定位置 | ({ scrollLeft?, scrollTop? }) |
| scrollToLeft | 滚动到指定横向位置 | (scrollLeft) |
| scrollToTop | 滚动到指定纵向位置 | (scrollTop) |
| scrollToRow | 滚动到指定行，可指定策略 | (row, strategy?) |

### Column Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| align | 单元格内容对齐方式 | ^[string]`'left' \| 'center' \| 'right'` | left |
| class | 列的自定义类名或 getter | ^[string] / ^[Function] | — |
| key | 列唯一标识 | ^[string] / ^[number] / ^[symbol] | — |
| dataKey | 数据字段名，支持 `a.b[0].c` | ^[string] / ^[number] / ^[symbol] | — |
| fixed | 固定方向 | ^[boolean] / ^[string]`'left' \| 'right'` | false |
| flexGrow | flex-grow；仅非 fixed 表生效 | ^[number] | 0 |
| flexShrink | flex-shrink；仅非 fixed 表生效 | ^[number] | 1 |
| headerClass | 表头单元格类名 | ^[string] / ^[Function] | — |
| hidden | 是否隐藏该列 | ^[boolean] | — |
| style | 单元格样式，与网格样式合并 | ^[object] | — |
| sortable | 是否可排序 | ^[boolean] | — |
| title | 表头默认文本 | ^[string] | — |
| maxWidth / minWidth | 列最大/最小宽度 | ^[number] | — |
| width ^(required) | 列宽 | ^[number] | — |
| cellRenderer | 自定义单元格渲染函数 | ^[Function]`(params) => ReactNode` | — |
| headerCellRenderer | 自定义表头单元格渲染函数 | ^[Function]`(params) => ReactNode` | — |
| dataGetter | 自定义取值函数 | ^[Function]`(params) => T` | — |
