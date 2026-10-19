"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ElScrollbar } from "../scrollbar";
import { useFormSize } from "../form/use-form";
import { useGlobalConfig, useTranslator } from "../config-provider/context";
import { TableContext, type TableContextValue } from "./table-context";
import { ElTableColumn } from "./ElTableColumn";
import { useTableStore } from "./store";
import { useTableLayout } from "./layout";
import { renderBodyCellContent, renderHeaderCellContent } from "./render";
import { TableFilterPanel } from "./filter";
import {
  convertToRows,
  ensurePosition,
  getFixedColumnOffset,
  getFixedColumnsClass,
  parseHeight,
} from "./utils";
import type {
  DefaultRow,
  TableColumnCtx,
  TableExpose,
  TableProps,
  TableSortOrder,
} from "./context";

/** 表格尺寸类名，与官方的 auto / default 行为一致。 */
type TableLayoutKind = "fixed" | "auto";

/**
 * 对应官方 ElTable（阶段一）。
 *
 * 已实现：列注册与布局、表头（含分组表头）、单元格渲染、斑马纹、边框、固定列、
 * 固定表头（height / maxHeight）、排序、多选、单选高亮、展开行、自定义列模板、空数据。
 * 列宽计算逐行对齐官方 table-layout.ts 的 updateColumnsWidth。
 */
export const ElTable = forwardRef<TableExpose, TableProps>(function ElTable(
  {
    data = [],
    size,
    height,
    maxHeight,
    fit = true,
    stripe = false,
    border = false,
    rowKey,
    showHeader = true,
    showSummary = false,
    sumText,
    summaryMethod,
    rowClassName,
    rowStyle,
    cellClassName,
    cellStyle,
    headerRowClassName,
    headerRowStyle,
    headerCellClassName,
    headerCellStyle,
    highlightCurrentRow = false,
    emptyText,
    defaultSort,
    spanMethod,
    tableLayout = "fixed" as TableLayoutKind,
    scrollbarAlwaysOn = false,
    showOverflowTooltip,
    tooltipFormatter,
    treeProps,
    lazy = false,
    load,
    defaultExpandAll = false,
    expandRowKeys,
    indent = 16,
    empty,
    append,
    renderExpanded,
    rowExpandable,
    onSelect,
    onSelectAll,
    onSelectionChange,
    onRowClick,
    onCellClick,
    onSortChange,
    onFilterChange,
    onCurrentChange,
    onExpandChange,
    onHeaderClick,
    onHeaderDragend,
    className,
    style,
    children,
  },
  ref,
) {
  const tableSize = useFormSize(size);
  const t = useTranslator();
  const [tableId] = useState(() => `el-table_${Math.random().toString(36).slice(2, 10)}`);
  const columnNoRef = useRef(0);

  const store = useTableStore(
    useMemo(
      () => ({
        data,
        rowKey,
        treeProps,
        lazy,
        load,
        defaultExpandAll,
        expandRowKeys,
        indent,
        onSelect,
        onSelectAll,
        onSelectionChange,
        onSortChange,
        onFilterChange,
        onCurrentChange,
        onExpandChange,
      }),
      [
        data,
        rowKey,
        treeProps,
        lazy,
        load,
        defaultExpandAll,
        expandRowKeys,
        indent,
        onSelect,
        onSelectAll,
        onSelectionChange,
        onSortChange,
        onFilterChange,
        onCurrentChange,
        onExpandChange,
      ],
    ),
  );

  const { states } = store;

  const { tableRef, bodyWidth, scrollX, widthVersion, doLayout } =
    useTableLayout({
      columns: states.columns,
      fixedColumns: states.fixedColumns,
      rightFixedColumns: states.rightFixedColumns,
      fit,
    });

  // 表头行结构由列树换算得到，分组表头时会有多行
  const columnRows = useMemo(
    () => convertToRows(states.originColumnTree),
    // widthVersion 变化表示列宽已写入，需要重新换算 colSpan / rowSpan
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [states.originColumnTree, widthVersion],
  );

  const hasExpandColumn = states.columns.some((column) => column.type === "expand");
  const isEmpty = states.data.length === 0;
  // 树形缩进与展开按钮只挂在第一个普通列上（官方 firstDefaultColumnIndex）
  const firstDefaultColumnIndex = states.columns.findIndex(
    (column) => column.type === "default",
  );
  const resizeProxyRef = useRef<HTMLDivElement>(null);
  const headerWrapperRef = useRef<HTMLDivElement>(null);
  const [resizeVisible, setResizeVisible] = useState(false);

  // 默认排序：官方在表头 mounted 时 commit 一次 sort。
  // 列是异步注册的，若首次执行时列还没就绪就等下一次，避免默认排序丢失。
  const defaultSortDone = useRef(false);
  useEffect(() => {
    if (defaultSortDone.current || !defaultSort?.prop) return;
    if (store.commitSort({ ...defaultSort, init: true })) {
      defaultSortDone.current = true;
    }
  }, [defaultSort, store, states.columns]);

  useImperativeHandle(
    ref,
    () => ({
      clearSelection: store.clearSelection,
      getSelectionRows: store.getSelectionRows,
      toggleRowSelection: store.toggleRowSelection,
      toggleAllSelection: store.toggleAllSelection,
      setCurrentRow: store.setCurrentRow,
      toggleRowExpansion: store.toggleRowExpansion,
      clearSort: store.clearSort,
      sort: store.sort,
      clearFilter: store.clearFilter,
      doLayout,
    }),
    [doLayout, store],
  );

  // 对应官方 table-props：表格自身未传时，列的取值链继续回落到 ConfigProvider
  const globalTableConfig = useGlobalConfig("table");
  const resolvedShowOverflowTooltip =
    showOverflowTooltip ?? globalTableConfig?.showOverflowTooltip;

  const contextValue: TableContextValue = useMemo(
    () => ({
      ns: "el-table",
      tableSize,
      tableId,
      showOverflowTooltip: resolvedShowOverflowTooltip,
      registerColumn: store.registerColumn as (column: TableColumnCtx<DefaultRow>) => void,
      unregisterColumn: store.unregisterColumn,
      nextColumnNo: () => ++columnNoRef.current,
      parentColumnId: null,
    }),
    [
      store.registerColumn,
      store.unregisterColumn,
      tableId,
      tableSize,
      resolvedShowOverflowTooltip,
    ],
  );

  const sortStore = useMemo(
    () => ({
      states: {
        data: states.data,
        isAllSelected: states.isAllSelected,
        isIndeterminate: states.isIndeterminate,
      },
      toggleAllSelection: store.toggleAllSelection,
    }),
    [states.data, states.isAllSelected, states.isIndeterminate, store.toggleAllSelection],
  );

  const bodyStore = useMemo(
    () => ({
      states: { data: states.data, rowExpandable },
      isSelected: store.isSelected,
      getRowIndeterminate: store.getRowIndeterminate,
      toggleRowSelection: store.toggleRowSelection,
      toggleRowExpansion: store.toggleRowExpansion,
    }),
    [
      rowExpandable,
      states.data,
      store.isSelected,
      store.getRowIndeterminate,
      store.toggleRowExpansion,
      store.toggleRowSelection,
    ],
  );

  /** 表头单元格的类名，对应官方 table-header/style.helper.ts 的 getHeaderCellClass。 */
  const getHeaderCellClass = useCallback(
    (rowIndex: number, columnIndex: number, row: TableColumnCtx<DefaultRow>[], column: TableColumnCtx) => {
      const fixedClasses = getFixedColumnsClass(
        "el-table",
        columnIndex,
        column.fixed || undefined,
        {
          columns: states.columns as TableColumnCtx[],
          fixedLeafColumnsLength: states.fixedLeafColumnsLength,
          rightFixedLeafColumnsLength: states.rightFixedLeafColumnsLength,
        },
        row,
      );

      const classes = [
        column.id,
        column.order,
        column.headerAlign,
        column.className,
        column.labelClassName,
        ...fixedClasses,
      ];
      if (!column.children) classes.push("is-leaf");
      if (column.sortable) classes.push("is-sortable");

      if (typeof headerCellClassName === "string") classes.push(headerCellClassName);
      classes.push(`${"el-table"}__cell`);
      void rowIndex;
      return classes.filter(Boolean).join(" ");
    },
    [headerCellClassName, states.columns, states.fixedLeafColumnsLength, states.rightFixedLeafColumnsLength],
  );

  const getHeaderCellStyle = useCallback(
    (columnIndex: number, row: TableColumnCtx<DefaultRow>[], column: TableColumnCtx) => {
      const base =
        typeof headerCellStyle === "function"
          ? headerCellStyle({ rowIndex: 0, columnIndex, column })
          : headerCellStyle ?? {};
      const fixedStyle = getFixedColumnOffset(
        columnIndex,
        column.fixed || undefined,
        {
          columns: states.columns as TableColumnCtx[],
          fixedLeafColumnsLength: states.fixedLeafColumnsLength,
          rightFixedLeafColumnsLength: states.rightFixedLeafColumnsLength,
        },
        row,
      );
      ensurePosition(fixedStyle, "left");
      ensurePosition(fixedStyle, "right");
      return { ...base, ...(fixedStyle ?? {}) } as CSSProperties;
    },
    [headerCellStyle, states.columns, states.fixedLeafColumnsLength, states.rightFixedLeafColumnsLength],
  );

  /** 单元格类名，对应官方 table-body/styles-helper.ts 的 getCellClass。 */
  const getBodyCellClass = useCallback(
    (rowIndex: number, columnIndex: number, row: DefaultRow, column: TableColumnCtx, offset: number) => {
      const fixedClasses = getFixedColumnsClass(
        "el-table",
        columnIndex,
        column.fixed || undefined,
        {
          columns: states.columns as TableColumnCtx[],
          fixedLeafColumnsLength: states.fixedLeafColumnsLength,
          rightFixedLeafColumnsLength: states.rightFixedLeafColumnsLength,
        },
        undefined,
        offset,
      );
      const classes = [column.id, column.align, column.className, ...fixedClasses];
      if (typeof cellClassName === "string") classes.push(cellClassName);
      else if (typeof cellClassName === "function") {
        classes.push(
          cellClassName({ row: row as never, rowIndex, column: column as never, columnIndex }),
        );
      }
      classes.push("el-table__cell");
      return classes.filter(Boolean).join(" ");
    },
    [cellClassName, states.columns, states.fixedLeafColumnsLength, states.rightFixedLeafColumnsLength],
  );

  const getBodyCellStyle = useCallback(
    (rowIndex: number, columnIndex: number, column: TableColumnCtx) => {
      const base =
        typeof cellStyle === "function"
          ? cellStyle({
              row: {} as never,
              rowIndex,
              column: column as never,
              columnIndex,
            })
          : cellStyle ?? {};
      const fixedStyle = getFixedColumnOffset(
        columnIndex,
        column.fixed || undefined,
        {
          columns: states.columns as TableColumnCtx[],
          fixedLeafColumnsLength: states.fixedLeafColumnsLength,
          rightFixedLeafColumnsLength: states.rightFixedLeafColumnsLength,
        },
      );
      ensurePosition(fixedStyle, "left");
      ensurePosition(fixedStyle, "right");
      return { ...base, ...(fixedStyle ?? {}) } as CSSProperties;
    },
    [cellStyle, states.columns, states.fixedLeafColumnsLength, states.rightFixedLeafColumnsLength],
  );

  /** 对应官方 getSpan：由 spanMethod 决定行列合并。 */
  const getSpan = useCallback(
    (row: DefaultRow, column: TableColumnCtx, rowIndex: number, columnIndex: number) => {
      let rowspan = 1;
      let colspan = 1;
      if (typeof spanMethod === "function") {
        const result = spanMethod({
          row: row as never,
          rowIndex,
          column: column as never,
          columnIndex,
        });
        if (Array.isArray(result)) {
          rowspan = result[0];
          colspan = result[1];
        } else if (result && typeof result === "object") {
          rowspan = result.rowspan;
          colspan = result.colspan;
        }
      }
      return { rowspan, colspan };
    },
    [spanMethod],
  );

  /** 对应官方 getColspanRealWidth：合并列后的实际可用宽度。 */
  const getColspanRealWidth = useCallback(
    (columns: TableColumnCtx[], colspan: number, index: number) => {
      if (colspan < 1) return columns[index].realWidth ?? 0;
      const widthArr = columns
        .map((column) => column.realWidth || column.width)
        .slice(index, index + colspan);
      return Number(
        widthArr.reduce<number>((acc, width) => acc + Number(width), -1),
      );
    },
    [],
  );

  const getRowClass = useCallback(
    (row: DefaultRow, rowIndex: number, displayIndex: number) => {
      const classes = ["el-table__row"];
      if (highlightCurrentRow && row === states.currentRow) classes.push("current-row");
      if (stripe && displayIndex % 2 === 1) classes.push("el-table__row--striped");
      if (typeof rowClassName === "string") classes.push(rowClassName);
      else if (typeof rowClassName === "function") {
        classes.push(rowClassName({ row: row as never, rowIndex }));
      }
      return classes;
    },
    [highlightCurrentRow, rowClassName, states.currentRow, stripe],
  );

  const tableSizeClass = tableSize || "default";

  const rootClasses = [
    "el-table",
    `el-table--${tableSizeClass}`,
    fit && "el-table--fit",
    stripe && "el-table--striped",
    border && "el-table--border",
    maxHeight && "el-table--fluid-height",
    scrollX && "el-table--scrollable-x",
    !border && "el-table--enable-row-hover",
    (states.data.length !== 0 || states.data.length < 100) &&
      "el-table--enable-row-transition",
    showSummary && "has-footer",
    `el-table--layout-${tableLayout}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const rootStyle: CSSProperties = { ...style };
  const heightUnit = parseHeight(height);
  const maxHeightUnit = parseHeight(maxHeight);
  if (heightUnit) rootStyle.height = typeof heightUnit === "number" ? `${heightUnit}px` : heightUnit;
  if (maxHeightUnit) {
    rootStyle.maxHeight =
      typeof maxHeightUnit === "number" ? `${maxHeightUnit}px` : maxHeightUnit;
  }

  const needFixedHeader = !!height || !!maxHeight;

  /** colgroup：fixed 布局用 col 的 name 关联列 id，auto 布局直接把宽度写进 style。 */
  const renderColgroup = () => {
    const isAuto = tableLayout === "auto";
    let cols = states.columns;
    if (isAuto && cols.every((column) => column.width === undefined)) cols = [];

    return (
      <colgroup>
        {cols.map((column) => (
          <col
            key={`${tableLayout}_${column.id}`}
            // fixed 布局靠 col 的 name + width 关联列并下发列宽，
            // 这一步对应官方 layout-observer 里 col.setAttribute('width', ...)。
            // name 不在 React 的 col 类型里，官方也是运行时 setAttribute，
            // 这里用 spread 透传保持与官方一致的 DOM 输出。
            {...({
              name: isAuto ? undefined : column.id,
              width: isAuto ? undefined : (column.realWidth ?? column.width),
            } as Record<string, unknown>)}
            style={isAuto ? { width: `${column.width}px` } : undefined}
          />
        ))}
      </colgroup>
    );
  };

  /**
   * 列宽拖拽，对应官方 table-header/event-helper.ts 的 handleMouseDown。
   * 官方仅在 border 模式且鼠标落在表头单元格右缘 8px 内时启动。
   */
  const handleHeaderMouseDown = (
    event: React.MouseEvent<HTMLTableCellElement>,
    column: TableColumnCtx,
  ) => {
    if (!border || column.resizable === false || column.children) return;
    const th = event.currentTarget;
    const rect = th.getBoundingClientRect();
    if (rect.right - event.clientX > 8) return;

    event.preventDefault();
    const tableRect = tableRef.current?.getBoundingClientRect();
    if (!tableRect) return;
    const startLeft = rect.right - tableRect.left;
    const startColumnLeft = rect.left - tableRect.left;
    const startWidth = rect.width;
    const minLeft = startColumnLeft + 30;
    const proxy = resizeProxyRef.current;
    if (proxy) proxy.style.left = `${startLeft}px`;
    setResizeVisible(true);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - event.clientX;
      const proxyLeft = Math.max(minLeft, startLeft + delta);
      if (proxy) proxy.style.left = `${proxyLeft}px`;
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      setResizeVisible(false);
      const finalLeft = proxy
        ? Number.parseFloat(proxy.style.left)
        : startLeft;
      const newWidth = Math.max(30, finalLeft - startColumnLeft);
      column.width = newWidth;
      column.realWidth = newWidth;
      doLayout();
      onHeaderDragend?.(newWidth, startWidth, column, upEvent);
    };

    document.body.style.cursor = "col-resize";
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleHeaderMouseMove = (
    event: React.MouseEvent<HTMLTableCellElement>,
    column: TableColumnCtx,
  ) => {
    if (!border || column.resizable === false) return;
    const th = event.currentTarget;
    const rect = th.getBoundingClientRect();
    th.style.cursor = rect.right - event.clientX <= 8 ? "col-resize" : "";
  };

  const renderHeader = (extraClass?: string) => (
    <thead className={["el-table__header", extraClass].filter(Boolean).join(" ")}>
      {columnRows.map((subColumns, rowIndex) => (
        <tr
          key={rowIndex}
          className={
            typeof headerRowClassName === "function"
              ? headerRowClassName({ rowIndex })
              : headerRowClassName
          }
          style={
            typeof headerRowStyle === "function"
              ? headerRowStyle({ rowIndex })
              : (headerRowStyle as CSSProperties | undefined)
          }
        >
          {subColumns.map((column, cellIndex) => (
            <th
              key={`${column.id}-thead`}
              colSpan={column.colSpan}
              rowSpan={column.rowSpan}
              scope={column.colSpan > 1 ? "colgroup" : "col"}
              aria-sort={column.sortable && column.order ? column.order : undefined}
              className={getHeaderCellClass(rowIndex, cellIndex, subColumns, column)}
              style={getHeaderCellStyle(cellIndex, subColumns, column)}
              onClick={(event) => onHeaderClick?.(column, event)}
              onMouseDown={(event) => handleHeaderMouseDown(event, column)}
              onMouseMove={(event) => handleHeaderMouseMove(event, column)}
              onMouseOut={(event) => {
                event.currentTarget.style.cursor = "";
              }}
            >
              <div
                className={[
                  "cell",
                  states.filterState[column.id]?.length ? "highlight" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                {renderHeaderCellContent(column, cellIndex, {
                  ns: "el-table",
                  tableSize,
                  store: sortStore,
                })}
                {column.sortable && (
                  <span
                    className="caret-wrapper"
                    onClick={(event) => {
                      event.stopPropagation();
                      const next: TableSortOrder | null =
                        column.order === "ascending" ? "descending" : "ascending";
                      store.commitSort({ prop: column.property, order: next });
                    }}
                  >
                    <i
                      className="sort-caret ascending"
                      onClick={(event) => {
                        event.stopPropagation();
                        store.commitSort({ prop: column.property, order: "ascending" });
                      }}
                    />
                    <i
                      className="sort-caret descending"
                      onClick={(event) => {
                        event.stopPropagation();
                        store.commitSort({ prop: column.property, order: "descending" });
                      }}
                    />
                  </span>
                )}
                {column.filterable && (column.filters?.length ?? 0) > 0 && (
                  <TableFilterPanel
                    column={column}
                    values={states.filterState[column.id] ?? []}
                    onConfirm={(values) =>
                      store.commitFilter(column, values)
                    }
                  />
                )}
              </div>
            </th>
          ))}
        </tr>
      ))}
    </thead>
  );

  const renderRow = (
    row: DefaultRow,
    $index: number,
    treeRow?: {
      level: number;
      expanded: boolean;
      loading: boolean;
      noLazyChildren: boolean;
    },
  ) => {
    const expanded = hasExpandColumn && store.isRowExpanded(row as never);
    const rows: ReactNode[] = [];

    rows.push(
      <tr
        key={$index}
        className={getRowClass(row, $index, $index).join(" ")}
        style={
          typeof rowStyle === "function"
            ? rowStyle({ row: row as never, rowIndex: $index })
            : (rowStyle as CSSProperties | undefined)
        }
        // 与官方一致：点击整行即切换当前行（不受 highlightCurrentRow 限制）
        onClick={(event) => {
          store.setCurrentRow(row as never);
          onRowClick?.(row as never, null, event);
        }}
      >
        {states.columns.map((column, cellIndex) => {
          const { rowspan, colspan } = getSpan(row, column, $index, cellIndex);
          if (!rowspan || !colspan) return null;

          const columnData = { ...column };
          columnData.realWidth = getColspanRealWidth(states.columns, colspan, cellIndex);

          return (
            <td
              key={`${column.id}-${cellIndex}`}
              rowSpan={rowspan}
              colSpan={colspan}
              className={getBodyCellClass($index, cellIndex, row, column, colspan - 1)}
              style={getBodyCellStyle($index, cellIndex, column)}
              onClick={(event) =>
                onCellClick?.(row as never, column as never, event.currentTarget, event)
              }
            >
              {renderBodyCellContent({
                row,
                column: columnData,
                $index,
                cellIndex,
                expanded,
                treeNode:
                  states.hasTree &&
                  treeRow &&
                  cellIndex === firstDefaultColumnIndex
                    ? {
                        indent: treeRow.level * states.indent,
                        level: treeRow.level,
                        expanded: treeRow.expanded,
                        loading: treeRow.loading,
                        noLazyChildren: treeRow.noLazyChildren,
                      }
                    : undefined,
                onTreeToggle: () => store.toggleRowExpansion(row as never),
                ctx: {
                  ns: "el-table",
                  tableSize,
                  tooltipFormatter,
                  store: bodyStore,
                },
              })}
            </td>
          );
        })}
      </tr>,
    );

    // 展开行：官方同样把展开内容放在紧随其后的一行里，用 display 控制显隐
    if (hasExpandColumn && (expanded || true)) {
      rows.push(
        <tr
          key={`expanded-${$index}`}
          style={{ display: expanded ? undefined : "none" }}
        >
          <td
            colSpan={states.columns.length}
            className="el-table__cell el-table__expanded-cell"
          >
            {renderExpanded
              ? renderExpanded({ row: row as never, $index, expanded })
              : null}
          </td>
        </tr>,
      );
    }

    return rows;
  };

  /** 对应官方 table-footer：第一列放合计文案，其余列走 summaryMethod。 */
  const renderFooter = () => {
    const columns = states.columns;
    if (!showSummary || isEmpty) return null;

    const sums = summaryMethod
      ? summaryMethod({ columns: columns as never, data: states.data as never })
      : columns.map((_column, index) => {
          if (index === 0) return sumText ?? t("el.table.sumText");
          const values = states.data.map((row) =>
            Number((row as Record<string, unknown>)[columns[index].property]),
          );
          const total = values.reduce<number>((prev, curr) => prev + curr, 0);
          return Number.isNaN(total) ? "" : String(total);
        });

    return (
      <tfoot className="el-table__footer">
        <tr>
          {columns.map((column, cellIndex) => (
            <td
              key={`${column.id}-footer`}
              colSpan={column.colSpan}
              rowSpan={column.rowSpan}
              className="el-table__cell"
            >
              <div className="cell">{sums[cellIndex]}</div>
            </td>
          ))}
        </tr>
      </tfoot>
    );
  };

  const renderEmpty = () =>
    isEmpty ? (
      <div className="el-table__empty-block">
        <span className="el-table__empty-text">
          {empty ?? emptyText ?? t("el.table.emptyText")}
        </span>
      </div>
    ) : null;

  const tableBody = (
    <table
      className="el-table__body"
      cellSpacing={0}
      cellPadding={0}
      style={{
        width: bodyWidth ? `${bodyWidth}px` : undefined,
        tableLayout,
      }}
    >
      {renderColgroup()}
      {!needFixedHeader && showHeader && renderHeader("el-table__body-header")}
      <tbody>
        {states.visibleRows.reduce<ReactNode[]>((acc, item) => {
          acc.push(
            ...renderRow(item.row, item.index, {
              level: item.level,
              expanded: item.expanded,
              loading: item.loading,
              noLazyChildren: item.noLazyChildren,
            }),
          );
          return acc;
        }, [])}
      </tbody>
      {!needFixedHeader && renderFooter()}
    </table>
  );

  return (
    <TableContext.Provider value={contextValue}>
      <div ref={tableRef} className={rootClasses} style={rootStyle}>
        <div className="el-table__inner-wrapper">
          {/* 列的配置载体：只注册列，不产出可见 DOM */}
          <div className="hidden-columns">{children}</div>

          {showHeader && needFixedHeader && (
            <div ref={headerWrapperRef} className="el-table__header-wrapper">
              <table
                className="el-table__header"
                cellSpacing={0}
                cellPadding={0}
                style={{ width: bodyWidth ? `${bodyWidth}px` : undefined, tableLayout }}
              >
                {renderColgroup()}
                {renderHeader()}
              </table>
            </div>
          )}

          <div className="el-table__body-wrapper">
            <ElScrollbar
              always={scrollbarAlwaysOn}
              native={false}
              viewStyle={{ width: bodyWidth ? `${bodyWidth}px` : undefined }}
              // 独立表头与表体是两个滚动容器，横向滚动时手动同步表头
              onScroll={({ scrollLeft }) => {
                if (headerWrapperRef.current) {
                  headerWrapperRef.current.scrollLeft = scrollLeft;
                }
              }}
            >
              {tableBody}
              {renderEmpty()}
              {append !== undefined && append !== null && (
                <div className="el-table__append-wrapper">{append}</div>
              )}
            </ElScrollbar>
          </div>

          {border && (
            <div
              ref={resizeProxyRef}
              className="el-table__column-resize-proxy"
              style={{ display: resizeVisible ? undefined : "none" }}
            />
          )}
          {border && <div className="el-table__border-left-patch" />}
        </div>
      </div>
    </TableContext.Provider>
  );
});

export { ElTableColumn };
export type { TableProps, TableExpose };
