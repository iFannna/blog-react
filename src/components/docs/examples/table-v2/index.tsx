"use client";

import dayjs from "dayjs";
import {
  cloneElement,
  isValidElement,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

import { ElAutoResizer } from "@/components/ui/auto-resizer";
import { ElButton } from "@/components/ui/button";
import { ElCheckbox } from "@/components/ui/checkbox";
import { ElEmpty } from "@/components/ui/empty";
import { ElIcon } from "@/components/ui/icon/ElIcon";
import { Filter, Loading, Timer } from "@/components/ui/icons";
import { ElInput } from "@/components/ui/input";
import { ElPopover } from "@/components/ui/popover";
import type { PopoverExpose } from "@/components/ui/popover/ElPopover";
import { ElTableV2, TableV2FixedDir, TableV2SortOrder } from "@/components/ui/table-v2";
import type {
  TableV2Column,
  TableV2CustomizedHeaderSlotParam,
  TableV2Expose,
  TableV2KeyType,
  TableV2Row,
  TableV2RowSlotProps,
  TableV2SortBy,
  TableV2SortState,
} from "@/components/ui/table-v2";
import { ElTag } from "@/components/ui/tag";
import { ElTooltip } from "@/components/ui/tooltip";

const resizerWrapperStyle: CSSProperties = { height: 400 };

const rowHoverBackground = "var(--el-color-primary-light-9)";
const dangerBackground = "var(--el-color-danger-light-9)";

const generateColumns = (
  length = 10,
  prefix = "column-",
  props?: Partial<TableV2Column>,
): TableV2Column[] =>
  Array.from({ length }).map((_, columnIndex) => ({
    ...props,
    key: `${prefix}${columnIndex}`,
    dataKey: `${prefix}${columnIndex}`,
    title: `Column ${columnIndex}`,
    width: 150,
  }));

const generateData = (
  columns: TableV2Column[],
  length = 200,
  prefix = "row-",
): TableV2Row[] =>
  Array.from({ length }).map((_, rowIndex) =>
    columns.reduce<TableV2Row>(
      (rowData, column, columnIndex) => {
        rowData[column.dataKey as string] = `Row ${rowIndex} - Col ${columnIndex}`;
        return rowData;
      },
      { id: `${prefix}${rowIndex}`, parentId: null },
    ),
  );

/** 固定种子的线性同余随机数，避免 SSR 与客户端生成不同数据。 */
function createRandom(seed: number) {
  let state = seed;
  return () => {
    state = (state * 1664525 + 1013904223) >>> 0;
    return state / 0x100000000;
  };
}

/* ------------------------------------------------------------------ *
 * Basic / AutoResizer
 * ------------------------------------------------------------------ */

const basicColumns = generateColumns(10);
const basicData = generateData(basicColumns, 1000);

export function TableV2Basic() {
  return (
    <ElTableV2
      columns={basicColumns}
      data={basicData}
      width={700}
      height={400}
      fixed
    />
  );
}

const autoResizerColumns = generateColumns(10);
const autoResizerData = generateData(autoResizerColumns, 200);

export function TableV2AutoResizer() {
  return (
    <div style={resizerWrapperStyle}>
      <ElAutoResizer>
        {({ height, width }) => (
          <ElTableV2
            columns={autoResizerColumns}
            data={autoResizerData}
            width={width}
            height={height}
            fixed
          />
        )}
      </ElAutoResizer>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Customize Cell Renderer
 * ------------------------------------------------------------------ */

const cellTemplatingData: TableV2Row[] = Array.from({ length: 200 }).map(
  (_, index) => ({
    id: `random-id-${index + 1}`,
    name: "Tom",
    date: "2020-10-1",
  }),
);

const cellTemplatingColumns: TableV2Column[] = [
  {
    key: "date",
    title: "Date",
    dataKey: "date",
    width: 150,
    fixed: TableV2FixedDir.LEFT,
    cellRenderer: ({ cellData }) => {
      const formatted = dayjs(String(cellData)).format("YYYY/MM/DD");
      return (
        <ElTooltip content={formatted}>
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            <ElIcon style={{ marginRight: 8 }}>
              <Timer />
            </ElIcon>
            {formatted}
          </span>
        </ElTooltip>
      );
    },
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
        <ElButton size="small" type="danger">
          Delete
        </ElButton>
      </>
    ),
  },
];

export function TableV2CellTemplating() {
  return (
    <ElTableV2
      columns={cellTemplatingColumns}
      data={cellTemplatingData}
      width={700}
      height={400}
      fixed
    />
  );
}

/* ------------------------------------------------------------------ *
 * Selection
 * ------------------------------------------------------------------ */

const selectionBaseColumns = generateColumns(10);
const initialSelectionData = (): TableV2Row[] =>
  generateData(selectionBaseColumns, 200).map((row) => ({
    ...row,
    checked: false,
  }));

export function TableV2Selection() {
  const [data, setData] = useState<TableV2Row[]>(initialSelectionData);
  const allSelected = data.length > 0 && data.every((row) => row.checked);
  const containsChecked = data.some((row) => row.checked);

  const columns = useMemo<TableV2Column[]>(
    () => [
      {
        key: "selection",
        width: 50,
        cellRenderer: ({ rowData }) => (
          <ElCheckbox
            checked={Boolean(rowData.checked)}
            aria-label="选择本行"
            onCheckedChange={(checked) =>
              setData((previous) =>
                previous.map((row) =>
                  row.id === rowData.id ? { ...row, checked } : row,
                ),
              )
            }
          />
        ),
        headerCellRenderer: () => (
          <ElCheckbox
            checked={allSelected}
            indeterminate={containsChecked && !allSelected}
            aria-label="全选"
            onCheckedChange={(checked) =>
              setData((previous) =>
                previous.map((row) => ({ ...row, checked })),
              )
            }
          />
        ),
      },
      ...selectionBaseColumns,
    ],
    [allSelected, containsChecked],
  );

  return (
    <div style={resizerWrapperStyle}>
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
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Inline editing
 * ------------------------------------------------------------------ */

const inlineEditingBaseColumns = generateColumns(10);
const initialEditingData = (): TableV2Row[] =>
  generateData(inlineEditingBaseColumns, 200).map((row) => ({
    ...row,
    editing: false,
  }));

export function TableV2InlineEditing() {
  const [data, setData] = useState<TableV2Row[]>(initialEditingData);

  const columns = useMemo<TableV2Column[]>(() => {
    const updateRow = (rowId: unknown, patch: (row: TableV2Row) => TableV2Row) =>
      setData((previous) =>
        previous.map((row) => (row.id === rowId ? patch(row) : row)),
      );

    const first: TableV2Column = {
      ...inlineEditingBaseColumns[0],
      title: "Editable Column",
      cellRenderer: ({ rowData, column }) => {
        const dataKey = column.dataKey as string;
        const exitEditMode = () =>
          updateRow(rowData.id, (row) => ({ ...row, editing: false }));

        return rowData.editing ? (
          <ElInput
            autoFocus
            value={String(rowData[dataKey] ?? "")}
            onChange={(value) =>
              updateRow(rowData.id, (row) => ({ ...row, [dataKey]: value }))
            }
            onBlur={exitEditMode}
            onKeyDown={(event) => {
              if (event.key === "Enter") exitEditMode();
            }}
          />
        ) : (
          <div
            style={{ padding: 4, border: "1px dotted transparent", cursor: "text" }}
            onClick={() =>
              updateRow(rowData.id, (row) => ({ ...row, editing: true }))
            }
          >
            {String(rowData[dataKey] ?? "")}
          </div>
        );
      },
    };

    return [first, ...inlineEditingBaseColumns.slice(1)];
  }, []);

  return (
    <div style={resizerWrapperStyle}>
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
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Table with status（row class）
 * ------------------------------------------------------------------ */

const rowClassData: TableV2Row[] = Array.from({ length: 200 }).map(
  (_, index) => ({
    id: `random-id-${index + 1}`,
    name: "Tom",
    date: "2020-10-1",
  }),
);

const rowClassColumns: TableV2Column[] = [
  {
    key: "date",
    title: "Date",
    dataKey: "date",
    width: 150,
    fixed: TableV2FixedDir.LEFT,
    cellRenderer: ({ cellData }) => {
      const formatted = dayjs(String(cellData)).format("YYYY/MM/DD");
      return (
        <ElTooltip content={formatted}>
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            <ElIcon style={{ marginRight: 8 }}>
              <Timer />
            </ElIcon>
            {formatted}
          </span>
        </ElTooltip>
      );
    },
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
    flexGrow: 1,
    cellRenderer: () => (
      <>
        <ElButton size="small">Edit</ElButton>
        <ElButton size="small" type="danger">
          Delete
        </ElButton>
      </>
    ),
  },
];

const rowClassGetter = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex % 10 === 5) return "bg-red-100";
  if (rowIndex % 10 === 0) return "bg-blue-200";
  return "";
};

// 项目里没有 Tailwind，rowClass 之外再用 cellProps 把同样的配色落到内联样式
const rowClassCellProps = ({ rowIndex }: { rowIndex: number }) => {
  if (rowIndex % 10 === 5) return { style: { backgroundColor: dangerBackground } };
  if (rowIndex % 10 === 0) return { style: { backgroundColor: rowHoverBackground } };
  return {};
};

export function TableV2RowClass() {
  return (
    <ElTableV2
      columns={rowClassColumns}
      data={rowClassData}
      rowClass={rowClassGetter}
      cellProps={rowClassCellProps}
      width={700}
      height={400}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Sticky rows
 * ------------------------------------------------------------------ */

const stickyColumns = generateColumns(10);
const stickySourceData = generateData(stickyColumns, 200);

const stickyRowClass = ({ rowIndex }: { rowIndex: number }) =>
  rowIndex < 0 || (rowIndex + 1) % 5 === 0 ? "sticky-row" : "";

const stickyCellProps = ({ rowIndex }: { rowIndex: number }) =>
  rowIndex < 0
    ? {
        style: {
          backgroundColor: "var(--el-color-primary-light-5)",
          fontWeight: "bold",
        },
      }
    : {};

export function TableV2StickyRows() {
  const [stickyIndex, setStickyIndex] = useState(0);
  const fixedData = stickySourceData.slice(stickyIndex, stickyIndex + 1);
  const tableData = stickySourceData.slice(1);

  return (
    <ElTableV2
      columns={stickyColumns}
      data={tableData}
      fixedData={fixedData}
      rowClass={stickyRowClass}
      cellProps={stickyCellProps}
      width={700}
      height={400}
      fixed
      onScroll={({ scrollTop }) => {
        const nextIndex = Math.floor(scrollTop / 250) * 5;
        setStickyIndex((previous) =>
          previous === nextIndex ? previous : nextIndex,
        );
      }}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Fixed columns
 * ------------------------------------------------------------------ */

const fixedColumns = generateColumns(10);
fixedColumns[0].fixed = true;
fixedColumns[1].fixed = TableV2FixedDir.LEFT;
fixedColumns[9].fixed = TableV2FixedDir.RIGHT;
for (let index = 0; index < 3; index++) {
  fixedColumns[index].sortable = true;
}

export function TableV2FixedColumns() {
  const [data, setData] = useState<TableV2Row[]>(() =>
    generateData(fixedColumns, 200),
  );
  const [sortBy, setSortBy] = useState<TableV2SortBy>({
    key: "column-0",
    order: TableV2SortOrder.ASC,
  });

  return (
    <ElTableV2
      columns={fixedColumns}
      data={data}
      sortBy={sortBy}
      width={700}
      height={400}
      fixed
      onColumnSort={(nextSort) => {
        setData((previous) => [...previous].reverse());
        setSortBy({ key: nextSort.key, order: nextSort.order });
      }}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Grouping header
 * ------------------------------------------------------------------ */

const groupingSourceColumns = generateColumns(15);
const groupingData = generateData(groupingSourceColumns, 200);
const groupingColumns = groupingSourceColumns.map((column, columnIndex) => {
  let fixed: TableV2FixedDir | undefined;
  if (columnIndex < 3) fixed = TableV2FixedDir.LEFT;
  if (columnIndex > 12) fixed = TableV2FixedDir.RIGHT;
  return { ...column, fixed, width: 100 };
});

const groupingHeaderClass = ({ headerIndex }: { headerIndex: number }) =>
  headerIndex === 1 ? "el-primary-color" : "";

const isPlaceholderColumn = (column: TableV2Column) =>
  Boolean((column as Record<string, unknown>).placeholderSign);

const renderGroupedHeader = ({
  cells,
  columns,
  headerIndex,
}: TableV2CustomizedHeaderSlotParam): ReactNode => {
  if (headerIndex === 2) return cells;

  const groupCells: ReactNode[] = [];
  let width = 0;
  let count = 0;

  columns.forEach((column, columnIndex) => {
    if (isPlaceholderColumn(column)) {
      groupCells.push(cells[columnIndex]);
      return;
    }

    width += column.width;
    count += 1;

    const nextColumn = columns[columnIndex + 1];
    const groupEnded =
      columnIndex === columns.length - 1 ||
      (nextColumn ? isPlaceholderColumn(nextColumn) : false) ||
      count === (headerIndex === 0 ? 4 : 2);

    if (groupEnded) {
      groupCells.push(
        <div
          key={`group-${headerIndex}-${columnIndex}`}
          role="columnheader"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width,
            borderRight: "1px solid var(--el-border-color)",
            backgroundColor:
              headerIndex === 1 ? "var(--el-color-primary)" : undefined,
            color: headerIndex === 1 ? "var(--el-color-white)" : undefined,
            fontSize: headerIndex === 1 ? 14 : undefined,
            fontWeight: headerIndex === 1 ? "bold" : undefined,
          }}
        >
          Group width {width}
        </div>,
      );
      width = 0;
      count = 0;
    }
  });

  return groupCells;
};

export function TableV2GroupingHeader() {
  return (
    <ElTableV2
      fixed
      columns={groupingColumns}
      data={groupingData}
      headerHeight={[50, 40, 50]}
      headerClass={groupingHeaderClass}
      width={700}
      height={400}
      headerRenderer={renderGroupedHeader}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Filter
 * ------------------------------------------------------------------ */

const filterBaseColumns = generateColumns(10);
const filterColumns = filterBaseColumns.map((column, columnIndex) => ({
  ...column,
  fixed:
    columnIndex < 2
      ? TableV2FixedDir.LEFT
      : columnIndex > 9
        ? TableV2FixedDir.RIGHT
        : undefined,
  width: 100,
}));

export function TableV2Filter() {
  const [shouldFilter, setShouldFilter] = useState(false);
  const [data, setData] = useState<TableV2Row[]>(() =>
    generateData(filterBaseColumns, 200),
  );
  const popoverRef = useRef<PopoverExpose>(null);

  const onFilter = () => {
    popoverRef.current?.hide();
    setData(
      shouldFilter
        ? generateData(filterBaseColumns, 100, "filtered-")
        : generateData(filterBaseColumns, 200),
    );
  };

  const onReset = () => {
    setShouldFilter(false);
    popoverRef.current?.hide();
    setData(generateData(filterBaseColumns, 200));
  };

  const columns: TableV2Column[] = filterColumns.map(
    (column, columnIndex) =>
        columnIndex === 0
          ? {
              ...column,
              headerCellRenderer: () => (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <span style={{ marginRight: 8, fontSize: 12 }}>
                    {column.title}
                  </span>
                  <ElPopover
                    ref={popoverRef}
                    trigger="click"
                    width={200}
                    content={
                      <div>
                        <div style={{ padding: "4px 0" }}>
                          <ElCheckbox
                            checked={shouldFilter}
                            onCheckedChange={setShouldFilter}
                          >
                            Filter Text
                          </ElCheckbox>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                            borderTop: "1px solid var(--el-border-color-lighter)",
                            marginTop: 12,
                            paddingTop: 8,
                          }}
                        >
                          <ElButton text onClick={onFilter}>
                            Confirm
                          </ElButton>
                          <ElButton text onClick={onReset}>
                            Reset
                          </ElButton>
                        </div>
                      </div>
                    }
                  >
                    <button
                      type="button"
                      aria-label={`筛选 ${column.title}`}
                      style={{
                        display: "flex",
                        cursor: "pointer",
                        padding: 0,
                        margin: 0,
                        background: "none",
                        appearance: "none",
                        border: "none",
                      }}
                    >
                      <ElIcon size={14}>
                        <Filter />
                      </ElIcon>
                    </button>
                  </ElPopover>
                </div>
              ),
            }
          : column,
  );

  return (
    <ElTableV2
      fixed
      columns={columns}
      data={data}
      width={700}
      height={400}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Sortable / Controlled sort
 * ------------------------------------------------------------------ */

const sortColumns = generateColumns(10, "column-", { width: 150 });
sortColumns[0].sortable = true;

const controlledSortColumns = generateColumns(10);
controlledSortColumns[0].sortable = true;
controlledSortColumns[1].sortable = true;

export function TableV2Sort() {
  const [data, setData] = useState<TableV2Row[]>(() =>
    generateData(sortColumns, 200),
  );
  const [sortBy, setSortBy] = useState<TableV2SortBy>({
    key: "column-0",
    order: TableV2SortOrder.ASC,
  });

  return (
    <ElTableV2
      columns={sortColumns}
      data={data}
      sortBy={sortBy}
      width={700}
      height={400}
      fixed
      onColumnSort={(nextSort) => {
        setData((previous) => [...previous].reverse());
        setSortBy({ key: nextSort.key, order: nextSort.order });
      }}
    />
  );
}

export function TableV2ControlledSort() {
  const [data, setData] = useState<TableV2Row[]>(() =>
    generateData(controlledSortColumns, 200),
  );
  const [sortState, setSortState] = useState<TableV2SortState>({
    "column-0": TableV2SortOrder.DESC,
    "column-1": TableV2SortOrder.ASC,
  });

  return (
    <ElTableV2
      columns={controlledSortColumns}
      data={data}
      sortState={sortState}
      width={700}
      height={400}
      fixed
      onColumnSort={({ key, order }) => {
        setSortState((previous) => ({ ...previous, [key]: order }));
        setData((previous) => [...previous].reverse());
      }}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Cross hovering
 * ------------------------------------------------------------------ */

const crossHoveringBaseColumns = generateColumns(10);
const crossHoveringData = generateData(crossHoveringBaseColumns, 200);
const crossHoveringColumns: TableV2Column[] = [
  {
    key: "column-n-1",
    width: 50,
    title: "Row No.",
    align: "center",
    cellRenderer: ({ rowIndex }) => `${rowIndex + 1}`,
  },
  ...crossHoveringBaseColumns,
];

export function TableV2CrossHovering() {
  const [hoveredColumn, setHoveredColumn] = useState<number | null>(null);

  const cellProps = ({ columnIndex }: { columnIndex: number }) => ({
    "data-key": `hovering-col-${columnIndex}`,
    style:
      hoveredColumn === columnIndex
        ? { backgroundColor: rowHoverBackground }
        : undefined,
    onMouseEnter: () => setHoveredColumn(columnIndex),
    onMouseLeave: () => setHoveredColumn(null),
  });

  return (
    <div style={resizerWrapperStyle}>
      <ElAutoResizer>
        {({ height, width }) => (
          <ElTableV2
            columns={crossHoveringColumns}
            cellProps={cellProps}
            data={crossHoveringData}
            width={width}
            height={height}
          />
        )}
      </ElAutoResizer>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Colspan / Rowspan / Both
 * ------------------------------------------------------------------ */

const spanColumns = generateColumns(10);
const spanData = generateData(spanColumns, 200);

const colSpanIndex = 1;
spanColumns[colSpanIndex].colSpan = ({
  rowIndex,
}: {
  rowIndex: number;
}) => (rowIndex % 4) + 1;
spanColumns[colSpanIndex].align = "center";

const rowSpanIndex = 0;
spanColumns[rowSpanIndex].rowSpan = ({
  rowIndex,
}: {
  rowIndex: number;
}) => (rowIndex % 2 === 0 && rowIndex <= spanData.length - 2 ? 2 : 1);

const cellElementStyle = (cell: ReactNode): CSSProperties => {
  if (!isValidElement<{ style?: CSSProperties }>(cell)) return {};
  return cell.props.style ?? {};
};

const cloneCellStyle = (cell: ReactNode, style: CSSProperties) => {
  if (!isValidElement<{ style?: CSSProperties }>(cell)) return cell;
  return cloneElement(cell, { style: { ...cell.props.style, ...style } });
};

const applyColSpan = (
  cells: ReactNode[],
  columns: TableV2Column[],
  rowIndex: number,
) => {
  const next = [...cells];
  const colSpan = (
    columns[colSpanIndex] as { colSpan?: (params: { rowIndex: number }) => number }
  ).colSpan?.({ rowIndex });

  if (!colSpan || colSpan <= 1) return next;

  let width = columns[colSpanIndex].width;
  for (let offset = 1; offset < colSpan; offset++) {
    width += columns[colSpanIndex + offset].width;
    next[colSpanIndex + offset] = null;
  }

  next[colSpanIndex] = cloneCellStyle(next[colSpanIndex], {
    width,
    backgroundColor: "var(--el-color-primary-light-3)",
  });

  return next;
};

export function TableV2Colspan() {
  const renderRow = ({ cells, columns, rowIndex }: TableV2RowSlotProps) =>
    applyColSpan(cells, columns, rowIndex);

  return (
    <ElTableV2
      fixed
      columns={spanColumns}
      data={spanData}
      width={700}
      height={400}
      rowRenderer={renderRow}
    />
  );
}

export function TableV2Rowspan() {
  const renderRow = ({ cells, columns, rowIndex }: TableV2RowSlotProps) => {
    const next = [...cells];
    const rowSpan = (
      columns[rowSpanIndex] as {
        rowSpan?: (params: { rowIndex: number }) => number;
      }
    ).rowSpan?.({ rowIndex });

    if (rowSpan && rowSpan > 1) {
      next[rowSpanIndex] = cloneCellStyle(next[rowSpanIndex], {
        backgroundColor: "var(--el-color-primary-light-3)",
        height: rowSpan * 50 - 1,
        alignSelf: "flex-start",
        zIndex: 1,
      });
    }

    return next;
  };

  return (
    <ElTableV2
      fixed
      columns={spanColumns}
      data={spanData}
      width={700}
      height={400}
      rowRenderer={renderRow}
    />
  );
}

export function TableV2Spans() {
  const renderRow = ({ cells, columns, rowIndex }: TableV2RowSlotProps) => {
    const next = applyColSpan(cells, columns, rowIndex);

    const rowSpan = (
      columns[rowSpanIndex] as {
        rowSpan?: (params: { rowIndex: number }) => number;
      }
    ).rowSpan?.({ rowIndex });

    if (rowSpan && rowSpan > 1) {
      next[rowSpanIndex] = cloneCellStyle(next[rowSpanIndex], {
        backgroundColor: "var(--el-color-danger-light-3)",
        height: rowSpan * 50,
        alignSelf: "flex-start",
        zIndex: 1,
      });
    } else {
      next[rowSpanIndex] = (
        <div
          key={`span-empty-${rowIndex}`}
          style={{ width: cellElementStyle(next[rowSpanIndex]).width }}
        />
      );
    }

    return next;
  };

  return (
    <ElTableV2
      fixed
      columns={spanColumns}
      data={spanData}
      width={700}
      height={400}
      rowRenderer={renderRow}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Tree data
 * ------------------------------------------------------------------ */

const treeColumns = generateColumns(10).map((column, columnIndex) => {
  let fixed: TableV2FixedDir | undefined;
  if (columnIndex < 2) fixed = TableV2FixedDir.LEFT;
  if (columnIndex > 8) fixed = TableV2FixedDir.RIGHT;
  return { ...column, fixed };
});

const treeFlatData = generateData(treeColumns, 200);
for (let index = 0; index < 50; index++) {
  treeFlatData.push(
    {
      ...treeFlatData[0],
      id: `${treeFlatData[0].id}-sub-${index}`,
      parentId: treeFlatData[0].id,
      "column-0": `Sub ${index}`,
    },
    {
      ...treeFlatData[2],
      id: `${treeFlatData[2].id}-sub-${index}`,
      parentId: treeFlatData[2].id,
      "column-0": `Sub ${index}`,
    },
    {
      ...treeFlatData[2],
      id: `${treeFlatData[2].id}-sub-sub-${index}`,
      parentId: `${treeFlatData[2].id}-sub-${index}`,
      "column-0": `Sub-Sub ${index}`,
    },
  );
}

function unflatten(
  flatData: TableV2Row[],
  rootId: unknown = null,
  dataKey = "id",
  parentKey = "parentId",
): TableV2Row[] {
  const tree: TableV2Row[] = [];
  const childrenMap: Record<string, TableV2Row[]> = {};

  for (const datum of flatData) {
    const item: TableV2Row = { ...datum };
    const id = String(item[dataKey]);
    const parentId = item[parentKey];

    if (Array.isArray(item.children)) {
      childrenMap[id] = [
        ...(item.children as TableV2Row[]),
        ...(childrenMap[id] ?? []),
      ];
    } else if (!childrenMap[id]) {
      childrenMap[id] = [];
    }
    item.children = childrenMap[id];

    if (parentId !== undefined && parentId !== rootId) {
      const parent = String(parentId);
      childrenMap[parent] ??= [];
      childrenMap[parent].push(item);
    } else {
      tree.push(item);
    }
  }

  return tree;
}

const treeData = unflatten(treeFlatData);

export function TableV2TreeData() {
  const [expandedRowKeys, setExpandedRowKeys] = useState<TableV2KeyType[]>([]);

  return (
    <ElTableV2
      columns={treeColumns}
      data={treeData}
      expandedRowKeys={expandedRowKeys}
      expandColumnKey="column-0"
      width={700}
      height={400}
      fixed
      onExpandedRowsChange={setExpandedRowKeys}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Dynamic height
 * ------------------------------------------------------------------ */

const longText =
  "Quaerat ipsam necessitatibus eum quibusdam est id voluptatem cumque mollitia.";
const midText = "Corrupti doloremque a quos vero delectus consequatur.";
const shortText = "Eius optio fugiat.";
const textList = [shortText, midText, longText];

const dynamicHeightData: TableV2Row[] = (() => {
  const random = createRandom(2024);
  return Array.from({ length: 200 }).map((_, index) => ({
    id: `random-${index + 1}`,
    name: "Tom",
    date: "2016-05-03",
    description: textList[Math.floor(random() * textList.length)],
  }));
})();

const dynamicHeightColumns: TableV2Column[] = [
  {
    key: "id",
    title: "Id",
    dataKey: "id",
    width: 150,
    sortable: true,
    fixed: TableV2FixedDir.LEFT,
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
    key: "description",
    title: "Description",
    dataKey: "description",
    width: 150,
    cellRenderer: ({ cellData }) => (
      <div style={{ padding: "10px 0" }}>{String(cellData)}</div>
    ),
  },
  {
    key: "operations",
    title: "Operations",
    width: 150,
    align: "center",
    cellRenderer: () => (
      <>
        <ElButton size="small">Edit</ElButton>
        <ElButton size="small" type="danger">
          Delete
        </ElButton>
      </>
    ),
  },
];

export function TableV2DynamicHeight() {
  const [data, setData] = useState<TableV2Row[]>(dynamicHeightData);
  const [sortBy, setSortBy] = useState<TableV2SortBy>({
    key: "name",
    order: TableV2SortOrder.ASC,
  });

  return (
    <ElTableV2
      columns={dynamicHeightColumns}
      data={data}
      sortBy={sortBy}
      estimatedRowHeight={40}
      width={700}
      height={400}
      fixed
      onColumnSort={({ key, order }) => {
        const factor = order === TableV2SortOrder.ASC ? 1 : -1;
        const dataKey = String(key);
        setData((previous) =>
          [...previous].sort((left, right) =>
            String(left[dataKey]) > String(right[dataKey])
              ? factor
              : -factor,
          ),
        );
        setSortBy({ key, order });
      }}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Detail view
 * ------------------------------------------------------------------ */

const detailedText = `Velit sed aspernatur tempora. Natus consequatur officiis dicta vel assumenda.
Itaque est temporibus minus quis. Ipsum commodiab porro vel voluptas illum.
Qui quam nulla et dolore autem itaque est.
Id consequatur ipsum ea fuga et odit eligendi impedit.
Maiores officiis occaecati et magnam et sapiente est velit sunt.
Non et tempore temporibus. Excepturi et quos. Minus distinctio aut.
Voluptatem ea excepturi omnis vel. Non aperiam sit sed laboriosam eaque omnis deleniti.
Est molestiae omnis non et nulla repudiandae fuga sit.`;

const detailColumns = generateColumns(10);
const detailData = generateData(detailColumns, 200).map((row) => ({
  ...row,
  children: [
    {
      id: `${row.id}-detail-content`,
      detail: detailedText,
    },
  ],
}));

const renderDetailRow = ({ cells, rowData }: TableV2RowSlotProps) => {
  if (rowData.detail) {
    return <div style={{ padding: 24 }}>{String(rowData.detail)}</div>;
  }
  return cells;
};

export function TableV2DetailedView() {
  return (
    <ElTableV2
      columns={detailColumns}
      data={detailData}
      estimatedRowHeight={50}
      expandColumnKey={String(detailColumns[0].key)}
      width={700}
      height={400}
      rowRenderer={renderDetailRow}
    />
  );
}

/* ------------------------------------------------------------------ *
 * Footer / Empty / Overlay
 * ------------------------------------------------------------------ */

const footerColumns = generateColumns(10);
const footerData = generateData(footerColumns, 200);

const footerContent = (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
      backgroundColor: "var(--el-color-primary-light-7)",
    }}
  >
    Display a message in the footer
  </div>
);

export function TableV2Footer() {
  return (
    <ElTableV2
      columns={footerColumns}
      data={footerData}
      rowHeight={40}
      width={700}
      height={400}
      footerHeight={50}
      footer={footerContent}
      fixed
    />
  );
}

const emptyColumns = generateColumns(10);

export function TableV2Empty() {
  return (
    <ElTableV2
      columns={emptyColumns}
      data={[]}
      rowHeight={40}
      width={700}
      height={400}
      footerHeight={50}
      empty={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <ElEmpty />
        </div>
      }
    />
  );
}

const overlayColumns = generateColumns(10);
const overlayData = generateData(overlayColumns, 200);

export function TableV2Overlay() {
  return (
    <ElTableV2
      columns={overlayColumns}
      data={overlayData}
      rowHeight={40}
      width={700}
      height={400}
      overlay={
        <div
          className="el-loading-mask"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "absolute",
            inset: 0,
          }}
        >
          <ElIcon className="is-loading" color="var(--el-color-primary)" size={26}>
            <Loading />
          </ElIcon>
        </div>
      }
    />
  );
}

/* ------------------------------------------------------------------ *
 * Manual scrolling
 * ------------------------------------------------------------------ */

const manualColumns = generateColumns(10);
const manualData = generateData(manualColumns, 200);

export function TableV2ManualScroll() {
  const tableRef = useRef<TableV2Expose>(null);
  const [scrollDelta, setScrollDelta] = useState("200");
  const [scrollRows, setScrollRows] = useState("10");

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 16 }}>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>Scroll pixels</span>
          <ElInput
            value={scrollDelta}
            onChange={setScrollDelta}
            style={{ width: 120 }}
          />
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 14 }}>Scroll rows</span>
          <ElInput
            value={scrollRows}
            onChange={setScrollRows}
            style={{ width: 120 }}
          />
        </label>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
        <ElButton
          onClick={() => tableRef.current?.scrollToTop(Number(scrollDelta) || 0)}
        >
          Scroll by pixels
        </ElButton>
        <ElButton
          onClick={() => tableRef.current?.scrollToRow(Number(scrollRows) || 0)}
        >
          Scroll by rows
        </ElButton>
      </div>

      <div style={resizerWrapperStyle}>
        <ElAutoResizer>
          {({ height, width }) => (
            <ElTableV2
              ref={tableRef}
              columns={manualColumns}
              data={manualData}
              width={width}
              height={height}
              fixed
            />
          )}
        </ElAutoResizer>
      </div>
    </>
  );
}
