---
title: "Table V2 虚拟化表格"
description: "面向大数据量的虚拟滚动表格，支持固定列、树形数据、动态行高与自定义渲染。"
group: 数据展示
order: 160
---

# Table V2 虚拟化表格

面向大数据量的虚拟滚动表格，支持固定列、树形数据、动态行高与自定义渲染。

## 基础用法

:::demo 使用 10 列、1000 行数据展示虚拟化表格的基础用法。

table-v2/basic

:::

## 自动调整大小

:::demo 不想手动传 `width` 与 `height` 时，可以用  `ElAutoResizer` 包裹表格，它会自动测量并下发尺寸。 请确保它的父节点有固定高度。

table-v2/auto-resizer

:::

## 自定义单元格

:::demo 通过列的 `cellRenderer` 按需渲染单元格内容。

table-v2/cell-templating

:::

## 可选择

:::demo 用自定义单元格渲染器实现行选择，表头复选框支持全选与半选。

table-v2/selection

:::

## 行内编辑

:::demo 与选择行类似，在单元格内切换到输入框即可实现行内编辑。

table-v2/inline-editing

:::

## 带状态的行

:::demo 用 `rowClass` 区分行的状态。示例中每 10 行的第 6 行与第 1 行分别使用不同背景。

table-v2/row-class

:::

## 吸顶行

:::demo 通过 `fixedData` 可以把行固定在表头下方，并配合滚动事件动态切换。

table-v2/sticky-rows

:::

## 固定列

:::demo 把列的 `fixed` 设为 `true`（等价于左侧）或  `TableV2FixedDir.LEFT` / `RIGHT` 即可固定列。

table-v2/fixed-columns

:::

## 分组表头

:::demo 通过 `headerRenderer` 接管整行表头，配合  `headerHeight` 数组渲染多行分组表头。

table-v2/grouping-header

:::

## 筛选

:::demo 用 `headerCellRenderer` 在表头中放置筛选按钮与弹出层，筛选后替换数据源。

table-v2/filter

:::

## 排序

:::demo 传 `sortBy` 控制排序指示器，在 `onColumnSort`  中更新数据与排序状态。

table-v2/sort

:::

## 受控排序

:::demo 使用 `sortState` 可以同时维护多列的排序状态。

table-v2/controlled-sort

:::

## 列/行交叉高亮

:::demo 在 `cellProps` 中监听鼠标事件并高亮当前列，方便在大表格中定位。

table-v2/cross-hovering

:::

## 合并列

:::demo 虚拟化表格没有原生 `table` 元素，需要用  `rowRenderer` 操作单元格节点来实现 colspan。

table-v2/colspan

:::

## 合并行

:::demo 行合并的思路与列合并类似，只是调整的是单元格高度。

table-v2/rowspan

:::

## 行列同时合并

:::demo 把两种操作放进同一个行渲染器即可同时实现行合并与列合并。

table-v2/spans

:::

## 树形数据

:::demo 指定 `expandColumnKey` 后，点击箭头即可展开或收起树形节点。

table-v2/tree-data

:::

## 动态行高

:::demo 传入 `estimatedRowHeight` 后，表格会测量每行的实际高度。 估算值越接近真实高度，滚动体验越平滑。

table-v2/dynamic-height

:::

## 详情视图

:::demo 结合动态行高，可以在表格中展示展开后的详情内容。

table-v2/detailed-view

:::

## 自定义底部

:::demo 通过 `footer` 属性渲染表格底部，并设置 `footerHeight` 参与高度计算。

table-v2/footer

:::

## 自定义空状态

:::demo 数据为空时用 `empty` 属性替换默认空状态。

table-v2/empty

:::

## 遮罩层

:::demo 用 `overlay` 属性在表格上方渲染加载遮罩或其他内容。

table-v2/overlay

:::

## 手动滚动

:::demo 通过实例的 `scrollTo` / `scrollToTop` /  `scrollToRow` 等方法可以编程式滚动。 `scrollToRow` 的第二个参数为滚动策略，默认值为  `auto`，可选 `smart`、`center`、 `start`、`end`。

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
