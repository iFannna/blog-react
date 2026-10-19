"use client";

import type { CSSProperties, ReactNode } from "react";

export interface TableCellProps {
  className?: string;
  cellData?: unknown;
  style?: CSSProperties;
  children?: ReactNode;
}

/**
 * 对应官方 components/cell.tsx：单元格文本容器。
 * 有自定义内容时渲染自定义内容，否则输出 cellData 的字符串形式。
 */
export function TableCell({
  className,
  cellData,
  style,
  children,
}: TableCellProps) {
  const displayText = cellData?.toString?.() || "";

  return (
    <div className={className} title={displayText} style={style}>
      {children ?? displayText}
    </div>
  );
}
