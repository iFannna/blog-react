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
      <h1>Table V2 虚拟化表格</h1>
      <p>面向大数据量的虚拟滚动表格，支持固定列、树形数据、动态行高与自定义渲染。</p>

      <Heading level={2}>基础用法</Heading>
      <p>使用 10 列、1000 行数据展示虚拟化表格的基础用法。</p>
      <DemoBlock source={SOURCES.basic}>
        <TableV2Basic />
      </DemoBlock>

      <Heading level={2}>自动调整大小</Heading>
      <p>
        不想手动传 <code>width</code> 与 <code>height</code> 时，可以用{" "}
        <code>ElAutoResizer</code> 包裹表格，它会自动测量并下发尺寸。
        请确保它的父节点有固定高度。
      </p>
      <DemoBlock source={SOURCES.autoResizer}>
        <TableV2AutoResizer />
      </DemoBlock>

      <Heading level={2}>自定义单元格</Heading>
      <p>通过列的 <code>cellRenderer</code> 按需渲染单元格内容。</p>
      <DemoBlock source={SOURCES.cellTemplating}>
        <TableV2CellTemplating />
      </DemoBlock>

      <Heading level={2}>可选择</Heading>
      <p>用自定义单元格渲染器实现行选择，表头复选框支持全选与半选。</p>
      <DemoBlock source={SOURCES.selection}>
        <TableV2Selection />
      </DemoBlock>

      <Heading level={2}>行内编辑</Heading>
      <p>与选择行类似，在单元格内切换到输入框即可实现行内编辑。</p>
      <DemoBlock source={SOURCES.inlineEditing}>
        <TableV2InlineEditing />
      </DemoBlock>

      <Heading level={2}>带状态的行</Heading>
      <p>
        用 <code>rowClass</code> 区分行的状态。示例中每 10 行的第 6 行与第 1
        行分别使用不同背景。
      </p>
      <DemoBlock source={SOURCES.rowClass}>
        <TableV2RowClass />
      </DemoBlock>

      <Heading level={2}>吸顶行</Heading>
      <p>
        通过 <code>fixedData</code> 可以把行固定在表头下方，并配合滚动事件动态切换。
      </p>
      <DemoBlock source={SOURCES.stickyRows}>
        <TableV2StickyRows />
      </DemoBlock>

      <Heading level={2}>固定列</Heading>
      <p>
        把列的 <code>fixed</code> 设为 <code>true</code>（等价于左侧）或{" "}
        <code>TableV2FixedDir.LEFT</code> / <code>RIGHT</code> 即可固定列。
      </p>
      <DemoBlock source={SOURCES.fixedColumns}>
        <TableV2FixedColumns />
      </DemoBlock>

      <Heading level={2}>分组表头</Heading>
      <p>
        通过 <code>headerRenderer</code> 接管整行表头，配合{" "}
        <code>headerHeight</code> 数组渲染多行分组表头。
      </p>
      <DemoBlock source={SOURCES.groupingHeader}>
        <TableV2GroupingHeader />
      </DemoBlock>

      <Heading level={2}>筛选</Heading>
      <p>
        用 <code>headerCellRenderer</code> 在表头中放置筛选按钮与弹出层，筛选后替换数据源。
      </p>
      <DemoBlock source={SOURCES.filter}>
        <TableV2Filter />
      </DemoBlock>

      <Heading level={2}>排序</Heading>
      <p>
        传 <code>sortBy</code> 控制排序指示器，在 <code>onColumnSort</code>{" "}
        中更新数据与排序状态。
      </p>
      <DemoBlock source={SOURCES.sort}>
        <TableV2Sort />
      </DemoBlock>

      <Heading level={2}>受控排序</Heading>
      <p>
        使用 <code>sortState</code> 可以同时维护多列的排序状态。
      </p>
      <DemoBlock source={SOURCES.controlledSort}>
        <TableV2ControlledSort />
      </DemoBlock>

      <Heading level={2}>列/行交叉高亮</Heading>
      <p>
        在 <code>cellProps</code> 中监听鼠标事件并高亮当前列，方便在大表格中定位。
      </p>
      <DemoBlock source={SOURCES.crossHovering}>
        <TableV2CrossHovering />
      </DemoBlock>

      <Heading level={2}>合并列</Heading>
      <p>
        虚拟化表格没有原生 <code>table</code> 元素，需要用{" "}
        <code>rowRenderer</code> 操作单元格节点来实现 colspan。
      </p>
      <DemoBlock source={SOURCES.colspan}>
        <TableV2Colspan />
      </DemoBlock>

      <Heading level={2}>合并行</Heading>
      <p>行合并的思路与列合并类似，只是调整的是单元格高度。</p>
      <DemoBlock source={SOURCES.rowspan}>
        <TableV2Rowspan />
      </DemoBlock>

      <Heading level={2}>行列同时合并</Heading>
      <p>把两种操作放进同一个行渲染器即可同时实现行合并与列合并。</p>
      <DemoBlock source={SOURCES.spans}>
        <TableV2Spans />
      </DemoBlock>

      <Heading level={2}>树形数据</Heading>
      <p>
        指定 <code>expandColumnKey</code> 后，点击箭头即可展开或收起树形节点。
      </p>
      <DemoBlock source={SOURCES.treeData}>
        <TableV2TreeData />
      </DemoBlock>

      <Heading level={2}>动态行高</Heading>
      <p>
        传入 <code>estimatedRowHeight</code> 后，表格会测量每行的实际高度。
        估算值越接近真实高度，滚动体验越平滑。
      </p>
      <DemoBlock source={SOURCES.dynamicHeight}>
        <TableV2DynamicHeight />
      </DemoBlock>

      <Heading level={2}>详情视图</Heading>
      <p>结合动态行高，可以在表格中展示展开后的详情内容。</p>
      <DemoBlock source={SOURCES.detailedView}>
        <TableV2DetailedView />
      </DemoBlock>

      <Heading level={2}>自定义底部</Heading>
      <p>通过 <code>footer</code> 属性渲染表格底部，并设置 <code>footerHeight</code> 参与高度计算。</p>
      <DemoBlock source={SOURCES.footer}>
        <TableV2Footer />
      </DemoBlock>

      <Heading level={2}>自定义空状态</Heading>
      <p>数据为空时用 <code>empty</code> 属性替换默认空状态。</p>
      <DemoBlock source={SOURCES.empty}>
        <TableV2Empty />
      </DemoBlock>

      <Heading level={2}>遮罩层</Heading>
      <p>用 <code>overlay</code> 属性在表格上方渲染加载遮罩或其他内容。</p>
      <DemoBlock source={SOURCES.overlay}>
        <TableV2Overlay />
      </DemoBlock>

      <Heading level={2}>手动滚动</Heading>
      <p>
        通过实例的 <code>scrollTo</code> / <code>scrollToTop</code> /{" "}
        <code>scrollToRow</code> 等方法可以编程式滚动。
        <code>scrollToRow</code> 的第二个参数为滚动策略，默认值为{" "}
        <code>auto</code>，可选 <code>smart</code>、<code>center</code>、
        <code>start</code>、<code>end</code>。
      </p>
      <DemoBlock source={SOURCES.manualScroll}>
        <TableV2ManualScroll />
      </DemoBlock>

      <DocsContent source={API_MD} />
    </>
  );
}
