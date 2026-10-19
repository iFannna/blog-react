import type { ReactNode } from "react";

import type { DateCell } from "./types";

export interface BasicCellProps {
  cell: DateCell;
  renderCell?: (cell: DateCell) => ReactNode;
}

/** 对应官方 basic-cell-render：自定义插槽整体替换单元格内容。 */
export function BasicCell({ cell, renderCell }: BasicCellProps) {
  if (renderCell) return <>{renderCell(cell)}</>;
  return (
    <div className="el-date-table-cell">
      <span className="el-date-table-cell__text">
        {cell.renderText ?? cell.text}
      </span>
    </div>
  );
}
