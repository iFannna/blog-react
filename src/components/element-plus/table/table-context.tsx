"use client";

import { createContext, type ReactNode } from "react";
import type { DefaultRow, TableColumnCtx } from "./context";

/** 对应官方 TABLE_INJECTION_KEY：TableColumn 靠它拿到所属表格的能力。 */
export interface TableContextValue<T extends DefaultRow = DefaultRow> {
  ns: string;
  tableSize: string;
  /** 表格实例 id，列 id 由它派生，与官方 createTableId 一致 */
  tableId: string;
  /** 表格级 showOverflowTooltip，列的取值链里位于列自身之后、全局配置之前 */
  showOverflowTooltip?: boolean;
  /** 注册一列，列本身会先被算好 width / realWidth 等派生字段 */
  registerColumn: (column: TableColumnCtx<T>) => void;
  unregisterColumn: (id: string) => void;
  /** 取下一个列序号，保证列顺序稳定 */
  nextColumnNo: () => number;
}

export const TableContext = createContext<TableContextValue | undefined>(undefined);

/**
 * 给子列用的上下文：带上父列 id。
 *
 * 官方靠 Vue 的组件树就能拿到父子关系，React 里 Context 只能一层层传，
 * 所以在 ElTableColumn 内部再包一层 provider 把自身 id 作为子列的 parentColumnId。
 */
export interface ColumnContextValue {
  parentColumnId: string;
}

export const ColumnContext = createContext<ColumnContextValue | undefined>(undefined);

export function TableContextProvider<T extends DefaultRow>({
  value,
  children,
}: {
  value: TableContextValue<T>;
  children: ReactNode;
}) {
  return (
    <TableContext.Provider value={value as TableContextValue}>
      {children}
    </TableContext.Provider>
  );
}

export function ColumnContextProvider({
  value,
  children,
}: {
  value: ColumnContextValue;
  children: ReactNode;
}) {
  return <ColumnContext.Provider value={value}>{children}</ColumnContext.Provider>;
}
