"use client";

import type { ReactNode } from "react";
import { ElCheckbox } from "../checkbox";
import { ElIcon } from "../icon/ElIcon";
import { ArrowRight } from "../icons";
import type {
  ColumnStarts,
  DefaultRow,
  TableCellScope,
  TableColumnCtx,
  TableHeaderScope,
} from "./context";

/**
 * 对应官方 config.ts 的 cellStarts：几种固定类型列的默认尺寸。
 */
export const CELL_STARTS: Record<string, ColumnStarts> = {
  default: { order: "" },
  selection: { width: 48, minWidth: 48, realWidth: 48, order: "" },
  expand: { width: 48, minWidth: 48, realWidth: 48, order: "" },
  index: { width: 48, minWidth: 48, realWidth: 48, order: "" },
};

const DEFAULT_CLASS_NAMES: Record<string, string> = {
  selection: "table-column--selection",
  expand: "table__expand-column",
};

/** 对应官方 getDefaultClassName：给固定类型的列追加强制类名。 */
export function getDefaultClassName(type: string) {
  return DEFAULT_CLASS_NAMES[type] || "";
}

/** 表格内文案，对应官方 locale 的 el.table。 */
export const TABLE_LOCALE = {
  emptyText: "暂无数据",
  sumText: "合计",
  selectAllLabel: "全选",
  selectRowLabel: "选择本行",
  expandRowLabel: "展开本行",
  collapseRowLabel: "收起本行",
  confirmFilter: "确定",
  resetFilter: "重置",
  clearFilter: "清除筛选",
  filterLabel: "筛选 ",
};

/** 渲染上下文里需要用到的表格能力，避免直接依赖组件实例类型。 */
export interface CellRenderContext<T extends DefaultRow> {
  store: {
    states: {
      tableSize: string;
      data: T[];
      isAllSelected: boolean;
      isIndeterminate: boolean;
      rowExpandable?: (row: T, index: number) => boolean;
    };
    isSelected: (row: T) => boolean;
    getRowIndeterminate: (row: T) => boolean;
    toggleAllSelection: () => void;
    toggleRowSelection: (row: T) => void;
    toggleRowExpansion: (row: T) => void;
  };
  ns: string;
}

/**
 * 对应官方 config.ts 的 cellForced：selection / index / expand 三类列的
 * 表头与单元格渲染由表格接管，用户设的渲染函数对它无效。
 */
export function renderForcedCell<T extends DefaultRow>(
  type: TableColumnCtx<T>["type"],
  kind: "header" | "cell",
  data: {
    row: T;
    column: TableColumnCtx<T>;
    $index: number;
    expanded?: boolean;
  },
  ctx: CellRenderContext<T>,
): ReactNode {
  const { store } = ctx;

  if (type === "selection") {
    if (kind === "header") {
      const disabled = (store.states.data || []).length === 0;
      return (
        <ElCheckbox
          disabled={disabled}
          size={store.states.tableSize as "large" | "default" | "small"}
          indeterminate={store.states.isIndeterminate}
          checked={store.states.isAllSelected}
          onCheckedChange={() => store.toggleAllSelection()}
        />
      );
    }

    const { row, column, $index } = data;
    const selectableDisabled = column.selectable
      ? !column.selectable(row, $index)
      : false;
    return (
      <ElCheckbox
        disabled={selectableDisabled}
        size={store.states.tableSize as "large" | "default" | "small"}
        checked={store.isSelected(row)}
        onCheckedChange={() => store.toggleRowSelection(row)}
      />
    );
  }

  if (type === "index") {
    if (kind === "header") return data.column.label || "#";
    const { column, $index } = data;
    let i = $index + 1;
    const index = column.index;
    if (typeof index === "number") i = $index + index;
    else if (typeof index === "function") i = index($index);
    return <div>{i}</div>;
  }

  if (type === "expand") {
    if (kind === "header") return data.column.label || "";
    const { row, $index, expanded } = data;
    const isRowExpandable =
      store.states.rowExpandable?.(row, $index) ?? true;
    const classes = [
      `${ctx.ns}__expand-icon`,
      expanded ? `${ctx.ns}__expand-icon--expanded` : "",
      !isRowExpandable ? "is-disabled" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <button
        type="button"
        disabled={!isRowExpandable}
        aria-expanded={expanded}
        className={classes}
        onClick={(event) => {
          event.stopPropagation();
          store.toggleRowExpansion(row);
        }}
      >
        <ElIcon>
          <ArrowRight />
        </ElIcon>
      </button>
    );
  }

  return null;
}

export type { TableCellScope, TableHeaderScope };
