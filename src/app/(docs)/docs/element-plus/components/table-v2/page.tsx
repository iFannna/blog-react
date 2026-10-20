import type { Metadata } from "next";
import DemoBlock from "../../../../_components/DemoBlock";
import { Heading } from "../../../../_components/Heading";
import DocsContent from "../../../../_components/DocsContent";
import {
  TableV2AutoResizer,
  TableV2Basic,
  TableV2CellTemplating,
  TableV2Colspan,
  TableV2ControlledSort,
  TableV2CrossHovering,
  TableV2DetailedView,
  TableV2DynamicHeight,
  TableV2Empty,
  TableV2Filter,
  TableV2FixedColumns,
  TableV2Footer,
  TableV2GroupingHeader,
  TableV2InlineEditing,
  TableV2ManualScroll,
  TableV2Overlay,
  TableV2RowClass,
  TableV2Rowspan,
  TableV2Selection,
  TableV2Sort,
  TableV2Spans,
  TableV2StickyRows,
  TableV2TreeData,
} from "@/components/element-plus/examples/table-v2";

export const metadata: Metadata = {
  title: "Table V2 虚拟化表格",
};

const SOURCES = {
  basic: `const columns = generateColumns(10);
const data = generateData(columns, 1000);

<ElTableV2
  columns={columns}
  data={data}
  width={700}
  height={400}
  fixed
/>`,

  autoResizer: `<div style={{ height: 400 }}>
  <ElAutoResizer>
    {({ height, width }) => (
      <ElTableV2
        columns={columns}
        data={data}
        width={width}
        height={height}
        fixed
      />
    )}
  </ElAutoResizer>
</div>`,

  cellTemplating: `const columns: TableV2Column[] = [
  {
    key: "date",
    title: "Date",
    dataKey: "date",
    width: 150,
    fixed: TableV2FixedDir.LEFT,
    cellRenderer: ({ cellData }) => (
      <ElTooltip content={dayjs(String(cellData)).format("YYYY/MM/DD")}>
        <span style={{ display: "inline-flex", alignItems: "center" }}>
          <ElIcon style={{ marginRight: 8 }}><Timer /></ElIcon>
          {dayjs(String(cellData)).format("YYYY/MM/DD")}
        </span>
      </ElTooltip>
    ),
  },
  {
    key: "name",
    title: "Name",
    dataKey: "name",
    width: 150,
    align: "center",
    cellRenderer: ({ cellData }) => <ElTag>{String(cellData)}</ElTag>,
  },
  {
    key: "operations",
    title: "Operations",
    width: 150,
    align: "center",
    cellRenderer: () => (
      <>
        <ElButton size="small">Edit</ElButton>
        <ElButton size="small" type="danger">Delete</ElButton>
      </>
    ),
  },
];

<ElTableV2 columns={columns} data={data} width={700} height={400} fixed />`,

  selection: `const [data, setData] = useState<TableV2Row[]>(initialData);
const allSelected = data.every((row) => row.checked);
const containsChecked = data.some((row) => row.checked);

const columns: TableV2Column[] = [
  {
    key: "selection",
    width: 50,
    cellRenderer: ({ rowData }) => (
      <ElCheckbox
        checked={Boolean(rowData.checked)}
        onCheckedChange={(checked) => toggleRow(rowData.id, checked)}
        aria-label="选择本行"
      />
    ),
    headerCellRenderer: () => (
      <ElCheckbox
        checked={allSelected}
        indeterminate={containsChecked && !allSelected}
        onCheckedChange={toggleAll}
        aria-label="全选"
      />
    ),
  },
  ...baseColumns,
];

<ElAutoResizer>
  {({ height, width }) => (
    <ElTableV2 columns={columns} data={data} width={width} height={height} fixed />
  )}
</ElAutoResizer>`,

  inlineEditing: `const firstColumn: TableV2Column = {
  ...baseColumns[0],
  title: "Editable Column",
  cellRenderer: ({ rowData, column }) =>
    rowData.editing ? (
      <ElInput
        autoFocus
        value={String(rowData[column.dataKey as string] ?? "")}
        onChange={(value) => updateCell(rowData.id, column.dataKey as string, value)}
        onBlur={exitEditMode}
        onKeyDown={(event) => event.key === "Enter" && exitEditMode()}
      />
    ) : (
      <div style={{ padding: 4, cursor: "text" }} onClick={enterEditMode}>
        {String(rowData[column.dataKey as string] ?? "")}
      </div>
    ),
};`,

  rowClass: `const rowClass = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex % 10 === 5) return "bg-red-100";
  if (rowIndex % 10 === 0) return "bg-blue-200";
  return "";
};

<ElTableV2
  columns={columns}
  data={data}
  rowClass={rowClass}
  width={700}
  height={400}
/>`,

  stickyRows: `const [stickyIndex, setStickyIndex] = useState(0);
const fixedData = sourceData.slice(stickyIndex, stickyIndex + 1);

<ElTableV2
  columns={columns}
  data={sourceData.slice(1)}
  fixedData={fixedData}
  rowClass={({ rowIndex }) => (rowIndex < 0 ? "sticky-row" : "")}
  width={700}
  height={400}
  fixed
  onScroll={({ scrollTop }) => setStickyIndex(Math.floor(scrollTop / 250) * 5)}
/>`,

  fixedColumns: `columns[0].fixed = true;
columns[1].fixed = TableV2FixedDir.LEFT;
columns[9].fixed = TableV2FixedDir.RIGHT;
columns.forEach((column, index) => {
  if (index < 3) column.sortable = true;
});

<ElTableV2
  columns={columns}
  data={data}
  sortBy={sortBy}
  width={700}
  height={400}
  fixed
  onColumnSort={(nextSort) => {
    setData((previous) => [...previous].reverse());
    setSortBy({ key: nextSort.key, order: nextSort.order });
  }}
/>`,

  groupingHeader: `const renderGroupedHeader = ({ cells, columns, headerIndex }) => {
  if (headerIndex === 2) return cells;

  const groupCells: ReactNode[] = [];
  let width = 0;
  let count = 0;

  columns.forEach((column, columnIndex) => {
    if (column.placeholderSign) {
      groupCells.push(cells[columnIndex]);
      return;
    }

    width += column.width;
    count += 1;

    const groupEnded =
      columnIndex === columns.length - 1 ||
      columns[columnIndex + 1]?.placeholderSign ||
      count === (headerIndex === 0 ? 4 : 2);

    if (groupEnded) {
      groupCells.push(
        <div role="columnheader" style={{ width }}>
          Group width {width}
        </div>,
      );
      width = 0;
      count = 0;
    }
  });

  return groupCells;
};

<ElTableV2
  fixed
  columns={columns}
  data={data}
  headerHeight={[50, 40, 50]}
  width={700}
  height={400}
  headerRenderer={renderGroupedHeader}
/>`,

  filter: `const [shouldFilter, setShouldFilter] = useState(false);
const popoverRef = useRef<PopoverExpose>(null);

const onFilter = () => {
  popoverRef.current?.hide();
  setData(
    shouldFilter
      ? generateData(columns, 100, "filtered-")
      : generateData(columns, 200),
  );
};

const columns = baseColumns.map((column, columnIndex) =>
  columnIndex === 0
    ? {
        ...column,
        headerCellRenderer: () => (
          <ElPopover
            ref={popoverRef}
            trigger="click"
            width={200}
            content={
              <div>
                <ElCheckbox
                  checked={shouldFilter}
                  onCheckedChange={setShouldFilter}
                >
                  Filter Text
                </ElCheckbox>
                <ElButton text onClick={onFilter}>Confirm</ElButton>
                <ElButton text onClick={reset}>Reset</ElButton>
              </div>
            }
          >
            <button type="button" aria-label="筛选 Column 0">
              <ElIcon size={14}><Filter /></ElIcon>
            </button>
          </ElPopover>
        ),
      }
    : column,
);`,

  sort: `const [data, setData] = useState(baseData);
const [sortBy, setSortBy] = useState<TableV2SortBy>({
  key: "column-0",
  order: TableV2SortOrder.ASC,
});

<ElTableV2
  columns={columns}
  data={data}
  sortBy={sortBy}
  width={700}
  height={400}
  fixed
  onColumnSort={(nextSort) => {
    setData((previous) => [...previous].reverse());
    setSortBy({ key: nextSort.key, order: nextSort.order });
  }}
/>`,

  controlledSort: `const [sortState, setSortState] = useState<TableV2SortState>({
  "column-0": TableV2SortOrder.DESC,
  "column-1": TableV2SortOrder.ASC,
});

<ElTableV2
  columns={columns}
  data={data}
  sortState={sortState}
  width={700}
  height={400}
  fixed
  onColumnSort={({ key, order }) => {
    setSortState((previous) => ({ ...previous, [key]: order }));
    setData((previous) => [...previous].reverse());
  }}
/>`,

  crossHovering: `const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

const cellProps = ({ columnIndex }: { columnIndex: number }) => ({
  "data-key": \`hovering-col-\${columnIndex}\`,
  style:
    hoveredColumn === columnIndex
      ? { backgroundColor: "var(--el-color-primary-light-9)" }
      : undefined,
  onMouseEnter: () => setHoveredColumn(columnIndex),
  onMouseLeave: () => setHoveredColumn(null),
});

<ElAutoResizer>
  {({ height, width }) => (
    <ElTableV2
      columns={columns}
      cellProps={cellProps}
      data={data}
      width={width}
      height={height}
    />
  )}
</ElAutoResizer>`,

  colspan: `const colSpanIndex = 1;
columns[colSpanIndex].colSpan = ({ rowIndex }) => (rowIndex % 4) + 1;

const renderRow = ({ cells, columns, rowIndex }) => {
  const next = [...cells];
  const colSpan = columns[colSpanIndex].colSpan({ rowIndex });

  if (colSpan > 1) {
    let width = columns[colSpanIndex].width;
    for (let offset = 1; offset < colSpan; offset++) {
      width += columns[colSpanIndex + offset].width;
      next[colSpanIndex + offset] = null;
    }
    next[colSpanIndex] = cloneElement(next[colSpanIndex], {
      style: {
        ...next[colSpanIndex].props.style,
        width,
        backgroundColor: "var(--el-color-primary-light-3)",
      },
    });
  }

  return next;
};

<ElTableV2
  fixed
  columns={columns}
  data={data}
  width={700}
  height={400}
  rowRenderer={renderRow}
/>`,

  rowspan: `columns[0].rowSpan = ({ rowIndex }) =>
  rowIndex % 2 === 0 && rowIndex <= data.length - 2 ? 2 : 1;

const renderRow = ({ cells, columns, rowIndex }) => {
  const next = [...cells];
  const rowSpan = columns[0].rowSpan({ rowIndex });

  if (rowSpan > 1) {
    next[0] = cloneElement(next[0], {
      style: {
        ...next[0].props.style,
        backgroundColor: "var(--el-color-primary-light-3)",
        height: rowSpan * 50 - 1,
        alignSelf: "flex-start",
        zIndex: 1,
      },
    });
  }

  return next;
};`,

  spans: `const renderRow = ({ cells, columns, rowIndex }) => {
  const next = applyColSpan(cells, columns, rowIndex);
  const rowSpan = columns[rowSpanIndex].rowSpan({ rowIndex });

  if (rowSpan > 1) {
    next[rowSpanIndex] = cloneElement(next[rowSpanIndex], {
      style: {
        ...next[rowSpanIndex].props.style,
        backgroundColor: "var(--el-color-danger-light-3)",
        height: rowSpan * 50,
        alignSelf: "flex-start",
        zIndex: 1,
      },
    });
  } else {
    next[rowSpanIndex] = <div style={{ width: columns[rowSpanIndex].width }} />;
  }

  return next;
};`,

  treeData: `const [expandedRowKeys, setExpandedRowKeys] = useState<TableV2KeyType[]>([]);

<ElTableV2
  columns={columns}
  data={treeData}
  expandedRowKeys={expandedRowKeys}
  expandColumnKey="column-0"
  width={700}
  height={400}
  fixed
  onExpandedRowsChange={setExpandedRowKeys}
/>`,

  dynamicHeight: `const [data, setData] = useState(dynamicRows);
const [sortBy, setSortBy] = useState<TableV2SortBy>({
  key: "name",
  order: TableV2SortOrder.ASC,
});

<ElTableV2
  columns={columns}
  data={data}
  sortBy={sortBy}
  estimatedRowHeight={40}
  width={700}
  height={400}
  fixed
  onColumnSort={({ key, order }) => {
    const factor = order === TableV2SortOrder.ASC ? 1 : -1;
    setData((previous) =>
      [...previous].sort((left, right) =>
        String(left[key]) > String(right[key]) ? factor : -factor,
      ),
    );
    setSortBy({ key, order });
  }}
/>`,

  detailedView: `const renderDetailRow = ({ cells, rowData }) => {
  if (rowData.detail) {
    return <div style={{ padding: 24 }}>{rowData.detail}</div>;
  }
  return cells;
};

<ElTableV2
  columns={columns}
  data={data}
  estimatedRowHeight={50}
  expandColumnKey={String(columns[0].key)}
  width={700}
  height={400}
  rowRenderer={renderDetailRow}
/>`,

  footer: `<ElTableV2
  columns={columns}
  data={data}
  rowHeight={40}
  width={700}
  height={400}
  footerHeight={50}
  fixed
  footer={
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      Display a message in the footer
    </div>
  }
/>`,

  empty: `<ElTableV2
  columns={columns}
  data={[]}
  rowHeight={40}
  width={700}
  height={400}
  footerHeight={50}
  empty={
    <div style={{ display: "flex", justifyContent: "center", height: "100%" }}>
      <ElEmpty />
    </div>
  }
/>`,

  overlay: `<ElTableV2
  columns={columns}
  data={data}
  rowHeight={40}
  width={700}
  height={400}
  overlay={
    <div className="el-loading-mask" style={{ position: "absolute", inset: 0 }}>
      <ElIcon className="is-loading" color="var(--el-color-primary)" size={26}>
        <Loading />
      </ElIcon>
    </div>
  }
/>`,

  manualScroll: `const tableRef = useRef<TableV2Expose>(null);
const [scrollDelta, setScrollDelta] = useState("200");
const [scrollRows, setScrollRows] = useState("10");

<ElInput value={scrollDelta} onChange={setScrollDelta} />
<ElInput value={scrollRows} onChange={setScrollRows} />

<ElButton onClick={() => tableRef.current?.scrollToTop(Number(scrollDelta))}>
  Scroll by pixels
</ElButton>
<ElButton onClick={() => tableRef.current?.scrollToRow(Number(scrollRows))}>
  Scroll by rows
</ElButton>

<ElAutoResizer>
  {({ height, width }) => (
    <ElTableV2
      ref={tableRef}
      columns={columns}
      data={data}
      width={width}
      height={height}
      fixed
    />
  )}
</ElAutoResizer>`,
};

const API_MD = `
## TableV2 API

### TableV2 Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| cache | 额外预渲染的行数，用于提升滚动性能 | ^[number] | 2 |
| estimated-row-height | 动态行高的估算值；提供后启用行高测量 | ^[number] | — |
| header-class | 表头行的自定义类名 | ^[string] / ^[Function]\`(params) => string\` | — |
| header-props | 透传给表头的属性 | ^[object] / ^[Function] | — |
| header-cell-props | 透传给表头单元格的属性 | ^[object] / ^[Function] | — |
| header-height | 表头高度；传数组时按数组长度渲染多行表头 | ^[number] / ^[number[]] | 50 |
| footer-height | 底部高度，参与表格总高度计算 | ^[number] | 0 |
| row-class | 行自定义类名 | ^[string] / ^[Function]\`(params) => string\` | — |
| row-key | 行唯一标识字段 | ^[string] / ^[number] / ^[symbol] | id |
| row-props | 透传给行的属性 | ^[object] / ^[Function] | — |
| row-height | 行高（固定行高模式） | ^[number] | 50 |
| row-event-handlers | 行事件集合，见下方 RowEventHandlers | ^[object] | — |
| cell-props | 透传给每个单元格的属性 | ^[object] / ^[Function] | — |
| columns | 列定义数组 | ^[array]\`TableV2Column[]\` | — |
| data | 表格数据 | ^[array]\`TableV2Row[]\` | [] |
| data-getter | 自定义单元格取值方法 | ^[Function]\`(params) => T\` | — |
| fixed-data | 固定在表头下方、主内容上方的行数据 | ^[array]\`TableV2Row[]\` | — |
| expand-column-key | 展开图标所在的列 key | ^[string] | — |
| expanded-row-keys | 展开行的 key 数组（受控） | ^[array]\`TableV2KeyType[]\` | — |
| default-expanded-row-keys | 初始展开行的 key 数组（非响应式） | ^[array]\`TableV2KeyType[]\` | — |
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
| sort-by | 单列排序状态 | ^[object]\`TableV2SortBy\` | {} |
| sort-state | 多列排序状态 | ^[object]\`TableV2SortState\` | undefined |

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
| cell | 自定义单元格内容 | \`cellRenderer({ cellData, column, columns, columnIndex, rowData, rowIndex })\` |
| header | 自定义整行表头 | \`headerRenderer({ cells, columns, headerIndex })\` |
| header-cell | 自定义表头单元格 | \`headerCellRenderer(params)\` |
| row | 自定义整行 | \`rowRenderer({ cells, columns, depth, style, rowData, rowIndex, isScrolling })\` |
| footer | 表格底部 | \`footer\` 属性（ReactNode） |
| empty | 数据为空时的内容 | \`empty\` 属性（ReactNode） |
| overlay | 覆盖在表格上的内容 | \`overlay\` 属性（ReactNode） |

### TableV2 Exposes

通过 \`ref\` 获取实例方法。

| 方法 | 说明 | 参数 |
| --- | --- | --- |
| scrollTo | 滚动到指定位置 | ({ scrollLeft?, scrollTop? }) |
| scrollToLeft | 滚动到指定横向位置 | (scrollLeft) |
| scrollToTop | 滚动到指定纵向位置 | (scrollTop) |
| scrollToRow | 滚动到指定行，可指定策略 | (row, strategy?) |

### Column Attributes

| 属性名 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| align | 单元格内容对齐方式 | ^[string]\`'left' \\| 'center' \\| 'right'\` | left |
| class | 列的自定义类名或 getter | ^[string] / ^[Function] | — |
| key | 列唯一标识 | ^[string] / ^[number] / ^[symbol] | — |
| dataKey | 数据字段名，支持 \`a.b[0].c\` | ^[string] / ^[number] / ^[symbol] | — |
| fixed | 固定方向 | ^[boolean] / ^[string]\`'left' \\| 'right'\` | false |
| flexGrow | flex-grow；仅非 fixed 表生效 | ^[number] | 0 |
| flexShrink | flex-shrink；仅非 fixed 表生效 | ^[number] | 1 |
| headerClass | 表头单元格类名 | ^[string] / ^[Function] | — |
| hidden | 是否隐藏该列 | ^[boolean] | — |
| style | 单元格样式，与网格样式合并 | ^[object] | — |
| sortable | 是否可排序 | ^[boolean] | — |
| title | 表头默认文本 | ^[string] | — |
| maxWidth / minWidth | 列最大/最小宽度 | ^[number] | — |
| width ^(required) | 列宽 | ^[number] | — |
| cellRenderer | 自定义单元格渲染函数 | ^[Function]\`(params) => ReactNode\` | — |
| headerCellRenderer | 自定义表头单元格渲染函数 | ^[Function]\`(params) => ReactNode\` | — |
| dataGetter | 自定义取值函数 | ^[Function]\`(params) => T\` | — |

`;

export default function TableV2Page() {
  return (
    <>
      <h1>
        Virtualized Table 虚拟化表格{" "}
        <span className="docs-version-tag docs-version-tag--beta">beta</span>
      </h1>
      <p>
        在前端开发领域，表格一直都是一个高频出现的组件，尤其是在中后台和数据分析场景。但是，对于{" "}
        <a href="./table">Table V1</a>来说，当一屏里超过 1000
        条数据记录时，就会出现卡顿等性能问题，体验不是很好。
      </p>
      <p>通过虚拟化表格组件，超大数据渲染将不再是一个头疼的问题。</p>
      <DocsContent
        source={`:::tip

该组件**仍在测试中**，生产环境使用可能有风险。若您发现了 bug 或问题，请于 [GitHub](https://github.com/element-plus/element-plus/issues) 报告给我们以便修复。同时，有一些 API 并未在此文档中提及，因为部分还没有开发完全，因此我们不在此提及。

**即使**虚拟化的表格是高效的，但是当数据负载过大时，**网络**和**内存容量**也会成为您应用程序的瓶颈。因此请牢记，虚拟化表格永远不是最完美的解决方案，请考虑数据分页、过滤器等优化方案。

:::`}
      />

      <Heading level={2}>基础用法</Heading>
      <p>让我们演示虚拟化表的性能，用10列和1 000行渲染一个基本示例。</p>
      <DemoBlock source={SOURCES.basic}>
        <TableV2Basic />
      </DemoBlock>

      <Heading level={2}>自动调整大小</Heading>
      <p>
        如果不想手动向表格传递 <code>width</code> 和 <code>height</code>{" "}
        属性，可以使用 AutoResizer 对表格组件进行封装。这会自动为你更新宽度和高度。
      </p>
      <p>尝试调整您的浏览器大小来看看它是如何工作的。</p>
      <DocsContent
        source={`:::tip

由于 \`AutoResizer\` 组件的默认高度是 100%，所以请确保该组件的父元素**拥有固定的高度值**。或者，您可以通过将 \`style\` 属性传递到 \`AutoResizer\` 来定义它。

:::`}
      />
      <DemoBlock source={SOURCES.autoResizer}>
        <TableV2AutoResizer />
      </DemoBlock>

      <Heading level={2}>自定义单元格渲染器</Heading>
      <p>
        当然，您可以根据您的需要呈现表格单元格。这是如何自定义您的单元格的简单例子。
      </p>
      <DemoBlock source={SOURCES.cellTemplating}>
        <TableV2CellTemplating />
      </DemoBlock>

      <Heading level={2}>带有选择的表格</Heading>
      <p>使用自定义的单元格渲染来给表格组件添加选择的能力。</p>
      <DemoBlock source={SOURCES.selection}>
        <TableV2Selection />
      </DemoBlock>

      <Heading level={2}>可编辑单元格</Heading>
      <p>类似上面添加筛选框的方法，我们可以用同样的方法实现可编辑单元格。</p>
      <DemoBlock source={SOURCES.inlineEditing}>
        <TableV2InlineEditing />
      </DemoBlock>

      <Heading level={2}>带状态的表格</Heading>
      <p>
        可将表格内容 highlight 显示，方便区分「成功、信息、警告、危险」等内容。
      </p>
      <p>
        要自定义行的外观，请使用 <code>row-class-name</code>{" "}
        属性。举个例子，每10行会自动添加 <code>bg-blue-200</code> 类名，每5行会添加{" "}
        <code>bg-red-100</code> 类名。
      </p>
      <DemoBlock source={SOURCES.rowClass}>
        <TableV2RowClass />
      </DemoBlock>

      <Heading level={2}>表格行的粘性布局</Heading>
      <p>
        您可以简单地使用 <code>fixed-data</code> 属性来实现将某些行固定到表格的头部。
      </p>
      <p>您可以根据滚动事件动态设置粘性行，如这个示例所示。</p>
      <DemoBlock source={SOURCES.stickyRows}>
        <TableV2StickyRows />
      </DemoBlock>

      <Heading level={2}>固定列表格</Heading>
      <p>
        如果您想要有列粘贴左侧或右侧的某种原因。 您可以通过向表中添加特殊属性来实现这一点。
      </p>
      <p>
        您可以设置该行的<code>{" fixed"}</code> 属性为 <code>true</code>{" "}
        （代表<code>FixedDir.LEFT</code>）、<code>FixedDir.LEFT</code> 或{" "}
        <code>FixedDir.RIGHT</code>
      </p>
      <DemoBlock source={SOURCES.fixedColumns}>
        <TableV2FixedColumns />
      </DemoBlock>

      <Heading level={2}>表头分组</Heading>
      <p>正如这个示例，通过自定义表头渲染以将表头分组。</p>
      <DocsContent
        source={`:::tip

在这种情况下，我们使用了 \`JSX\` 功能，这个功能在playground上不被支持。您可以在本地环境或在线集成开发环境（如 \`codesandbox\` ）中试用它们。

建议您使用 JSX 使用您的表格组件，因为它包含 VNode 操作。

:::`}
      />
      <DemoBlock source={SOURCES.groupingHeader}>
        <TableV2GroupingHeader />
      </DemoBlock>

      <Heading level={2}>过滤器</Heading>
      <p>
        虚拟表格提供自定义页眉渲染器以创建自定义标题。然后我们可以利用这些来渲染过滤器。
      </p>
      <DemoBlock source={SOURCES.filter}>
        <TableV2Filter />
      </DemoBlock>

      <Heading level={2}>可排序表格</Heading>
      <p>您可以使用排序状态来对表格进行排序。</p>
      <DemoBlock source={SOURCES.sort}>
        <TableV2Sort />
      </DemoBlock>

      <Heading level={2}>受控的排序</Heading>
      <p>
        您可以在需要时定义多个可排序的列。请记住，当您在定义了多个可排序的列时， UI
        可能会显得有些奇怪，因为用户不知道哪一列被排序。
      </p>
      <DemoBlock source={SOURCES.controlledSort}>
        <TableV2ControlledSort />
      </DemoBlock>

      <Heading level={2}>高亮显示鼠标悬停单元格</Heading>
      <p>
        当处理一个大的列表时，很容易丢失当前行的轨迹和您正在访问的一列。在这种情况下，使用这个功能可能很有帮助。
      </p>
      <DemoBlock source={SOURCES.crossHovering}>
        <TableV2CrossHovering />
      </DemoBlock>

      <Heading level={2}>横跨列</Heading>
      <p>
        虚拟化表格没有使用内置的 <code>table</code> 元素，故 <code>colspan</code>{" "}
        和 <code>rowspan</code> 与 <a href="./table">TableV1</a>{" "}
        比较略有不同。然而，通过定制的行渲染器，这些功能仍然可以实现。在本节中，我们将演示如何实现这一点。
      </p>
      <DemoBlock source={SOURCES.colspan}>
        <TableV2Colspan />
      </DemoBlock>

      <Heading level={2}>纵跨行</Heading>
      <p>
        既然我们已经提到了 <a href="#colspan">Colspan</a>，那跨行（row
        span）也是没有问题的。它与colspan略有不同，但是基本原理是一样的。
      </p>
      <DemoBlock source={SOURCES.rowspan}>
        <TableV2Rowspan />
      </DemoBlock>

      <Heading level={2}>同时跨行和跨列</Heading>
      <p>我们当然可以同时使用横跨列与纵跨行来满足您的业务需求！</p>
      <DemoBlock source={SOURCES.spans}>
        <TableV2Spans />
      </DemoBlock>

      <Heading level={2}>树形数据</Heading>
      <p>虚拟表也可以在树状结构中呈现数据。点击箭头图标，你可以展开或折叠树节点。</p>
      <DemoBlock source={SOURCES.treeData}>
        <TableV2TreeData />
      </DemoBlock>

      <Heading level={2}>动态高度行</Heading>
      <p>
        虚拟表能够呈现具有动态高度的行数。如果您正在处理数据并不确定内容大小，
        此功能对于调整到内容高度的渲染行是理想的。要启用此功能，请传递{" "}
        <code>estimated-row-height</code>{" "}
        属性。估计高度越接近实际内容，渲染体验就越顺。
      </p>
      <DocsContent
        source={`:::tip

每行高度在渲染过程中动态测量。因此，如果您试图显示大量数据， UI **可能会** 抖动。

:::`}
      />
      <DemoBlock source={SOURCES.dynamicHeight}>
        <TableV2DynamicHeight />
      </DemoBlock>

      <Heading level={2}>可展开的附加信息</Heading>
      <p>使用动态高度渲染，您也可以在表格中显示详细的视图。</p>
      <DemoBlock source={SOURCES.detailedView}>
        <TableV2DetailedView />
      </DemoBlock>

      <Heading level={2}>自定义页脚</Heading>
      <p>自定义表格 footer， 通常用来展示一些汇总数据和信息。</p>
      <DemoBlock source={SOURCES.footer}>
        <TableV2Footer />
      </DemoBlock>

      <Heading level={2}>自定义空元素渲染器</Heading>
      <p>渲染自定义的空元素。</p>
      <DemoBlock source={SOURCES.empty}>
        <TableV2Empty />
      </DemoBlock>

      <Heading level={2}>浮动遮罩层</Heading>
      <p>
        当您想要显示加载指示器之类的浮动元素，可以通过渲染一个浮动在表格之上的遮罩层来实现。
      </p>
      <DemoBlock source={SOURCES.overlay}>
        <TableV2Overlay />
      </DemoBlock>

      <Heading level={2}>手动滚动</Heading>
      <p>使用 Table V2 暴露的方法可以进行手动或编程式的滚动到指定的偏移量或者行。</p>
      <DocsContent
        source={`:::tip

\`scrollToRow\` 的第二个参数代表滚动策略，计算了要滚动的位置，其默认值是 \`auto\`。如果你想要滚动到某个特定位置，你可以自己定义战略。可用的选项是 \`"auto" | "center" | "end" | "start" | "smart"\`

\`smart\` 和\`auto\` 之间的区别是， \`auto\` 是 \`smart\` 滚动策略的子集。

:::`}
      />
      <DemoBlock source={SOURCES.manualScroll}>
        <TableV2ManualScroll />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
