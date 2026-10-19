"use client";

import {
  forwardRef,
  useImperativeHandle,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

import { ElEmpty } from "../empty";
import { HeaderRow } from "./HeaderRow";
import { RowRenderer } from "./renderers/Row";
import { TableGrid } from "./TableGrid";
import { useTable } from "./use-table";
import { ns } from "./utils";

import type {
  SortBy,
  TableGridRowSlotParams,
  TableV2Expose,
  TableV2RowSlotProps,
  TableV2HeaderRendererParams,
  TableV2Props,
} from "./types";

export type ElTableV2Props<T = unknown> = TableV2Props<T>;

/**
 * 对应官方 ElTableV2。
 *
 * 三张虚拟网格共享滚动偏移：中间主表负责横向滚动，左右固定表只跟随纵向；
 * 表头始终跟随主表的横向偏移，因此固定列表头也能对齐。
 */
export const ElTableV2 = forwardRef<TableV2Expose, TableV2Props>(
  function ElTableV2(props, ref) {
    const rootRef = useRef<HTMLDivElement>(null);

    const {
      columnsStyles,
      fixedColumnsOnLeft,
      fixedColumnsOnRight,
      mainColumns,
      mainTableHeight,
      fixedTableHeight,
      leftTableWidth,
      rightTableWidth,
      data,
      depthMap,
      expandedRowKeys,
      hasFixedColumns,
      mainTableRef,
      leftTableRef,
      rightTableRef,
      isDynamic,
      bodyWidth,
      emptyStyle,
      rootStyle,
      footerStyle,
      showEmpty,
      scrollTo,
      scrollToLeft,
      scrollToTop,
      scrollToRow,
      getRowHeight,
      onColumnSorted,
      onRowHeightChange,
      onRowHovered,
      onRowExpanded,
      onRowsRendered,
      onScroll,
      onVerticalScroll,
    } = useTable(props, rootRef);

    useImperativeHandle(ref, () => ({
      scrollTo,
      scrollToLeft,
      scrollToTop,
      scrollToRow,
    }));

    const rowKey = props.rowKey ?? "id";
    const sortBy = (props.sortBy ?? {}) as SortBy;

    const renderRow = (params: TableGridRowSlotParams) => (
      <RowRenderer
        {...params}
        columnsStyles={columnsStyles}
        depthMap={depthMap}
        expandColumnKey={props.expandColumnKey}
        expandedRowKeys={expandedRowKeys}
        estimatedRowHeight={props.estimatedRowHeight}
        hasFixedColumns={hasFixedColumns}
        rowProps={props.rowProps}
        rowClass={props.rowClass}
        rowKey={rowKey}
        rowEventHandlers={props.rowEventHandlers}
        cellProps={props.cellProps}
        indentSize={props.indentSize ?? 12}
        iconSize={props.iconSize ?? 12}
        cellRenderer={props.cellRenderer}
        rowRenderer={
          props.rowRenderer as
            | ((params: TableV2RowSlotProps) => ReactNode)
            | undefined
        }
        onRowHovered={onRowHovered}
        onRowExpanded={onRowExpanded}
        onRowHeightChange={onRowHeightChange}
      />
    );

    const renderHeader = (params: TableV2HeaderRendererParams) => (
      <HeaderRow
        {...params}
        columnsStyles={columnsStyles}
        headerClass={props.headerClass}
        headerCellProps={props.headerCellProps}
        sortBy={sortBy}
        sortState={props.sortState}
        onColumnSorted={onColumnSorted}
        headerRenderer={props.headerRenderer}
        headerCellRenderer={props.headerCellRenderer}
      />
    );

    const fixedTableCommonProps = {
      data,
      fixedData: props.fixedData,
      estimatedRowHeight: props.estimatedRowHeight,
      headerHeight: props.headerHeight ?? 50,
      rowHeight: props.rowHeight ?? 50,
      cache: props.cache,
      useIsScrolling: props.useIsScrolling,
      scrollbarAlwaysOn: props.scrollbarAlwaysOn,
      scrollbarStartGap: 2,
      scrollbarEndGap: props.vScrollbarSize ?? 6,
      rowKey,
      getRowHeight,
      renderRow,
      renderHeader,
      onScroll: onVerticalScroll,
    };

    const rootKls = [
      props.className,
      ns.b(),
      ns.e("root"),
      ns.is("dynamic", isDynamic),
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div ref={rootRef} className={rootKls} style={rootStyle}>
        <TableGrid
          {...fixedTableCommonProps}
          ref={mainTableRef}
          className={ns.e("main")}
          columns={mainColumns}
          width={props.width}
          height={mainTableHeight}
          headerWidth={bodyWidth}
          bodyWidth={bodyWidth}
          onRowsRendered={onRowsRendered}
          onScroll={onScroll}
        />

        {fixedColumnsOnLeft.length > 0 && (
          <TableGrid
            {...fixedTableCommonProps}
            ref={leftTableRef}
            className={ns.e("left")}
            columns={fixedColumnsOnLeft}
            width={leftTableWidth}
            height={fixedTableHeight}
            headerWidth={leftTableWidth}
            bodyWidth={leftTableWidth}
          />
        )}

        {fixedColumnsOnRight.length > 0 && (
          <TableGrid
            {...fixedTableCommonProps}
            ref={rightTableRef}
            className={ns.e("right")}
            columns={fixedColumnsOnRight}
            width={rightTableWidth}
            height={fixedTableHeight}
            headerWidth={rightTableWidth}
            bodyWidth={rightTableWidth}
            style={
              {
                "--el-table-v2-table-scrollbar-size": `${props.vScrollbarSize ?? 6}px`,
              } as CSSProperties
            }
          />
        )}

        {props.footer && (
          <div className={ns.e("footer")} style={footerStyle}>
            {props.footer}
          </div>
        )}

        {showEmpty && (
          <div className={ns.e("empty")} style={emptyStyle}>
            {props.empty ?? <ElEmpty />}
          </div>
        )}

        {props.overlay && (
          <div className={ns.e("overlay")}>{props.overlay}</div>
        )}
      </div>
    );
  },
);

export default ElTableV2;
