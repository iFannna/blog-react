"use client";

import {
  Children,
  isValidElement,
  type CSSProperties,
  type ReactNode,
} from "react";

export type DescriptionsDirection = "horizontal" | "vertical";

export interface DescriptionsItemProps {
  /** 标签文本 */
  label?: ReactNode;
  /** 占的列数 */
  span?: number;
  /** 占的行数 */
  rowspan?: number;
  /** 内容宽度 */
  width?: string | number;
  /** 内容最小宽度 */
  minWidth?: string | number;
  /** 标签宽度 */
  labelWidth?: string | number;
  /** 内容对齐 */
  align?: "left" | "center" | "right";
  /** 标签对齐，省略时跟随 align */
  labelAlign?: "left" | "center" | "right";
  /** 内容类名 */
  className?: string;
  /** 标签类名 */
  labelClassName?: string;
  children?: ReactNode;
}

/** 对应官方 ElDescriptionsItem，仅作 ElDescriptions 的子组件。 */
// props 由父组件在渲染期读取，这里只保留签名以对齐官方子组件用法
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function ElDescriptionsItem(props: DescriptionsItemProps) {
  // 实际渲染由父组件统一编排，这里返回 null
  return null;
}

ElDescriptionsItem.displayName = "ElDescriptionsItem";

export interface DescriptionsProps {
  /** 是否带边框 */
  border?: boolean;
  /** 一行显示几列 */
  column?: number;
  /** 排列方向 */
  direction?: DescriptionsDirection;
  /** 尺寸 */
  size?: "large" | "default" | "small";
  /** 标题 */
  title?: ReactNode;
  /** 标题右侧操作区 */
  extra?: ReactNode;
  /** 标签宽度 */
  labelWidth?: string | number;
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
}

const addUnit = (value?: string | number) => {
  if (value === undefined || value === "") return undefined;
  return typeof value === "number" ? `${value}px` : value;
};

interface CellData extends DescriptionsItemProps {
  key: string | number;
}

/**
 * 对应官方 ElDescriptions。
 *
 * 渲染规则与官方 descriptions-row / descriptions-cell 一致：
 * - vertical：每个逻辑行渲染两个 tr（标签行 + 内容行）
 * - horizontal + border：每个单元格渲染 label td 与 content td，
 *   content 的 colSpan 为 span*2-1（因为每项占 2 个表格列）
 * - horizontal 无 border：单个 td 内放 label 与 content 两个 span
 *
 * 子项按 column 分行，最后一行不足时用 span 撑满。
 */
export function ElDescriptions({
  border = false,
  column = 3,
  direction = "horizontal",
  size,
  title,
  extra,
  labelWidth,
  className,
  style,
  children,
}: DescriptionsProps) {
  const isVertical = direction === "vertical";

  // 收集子项配置
  const cells: CellData[] = [];
  Children.forEach(children, (child, index) => {
    if (!isValidElement(child)) return;
    const props = child.props as DescriptionsItemProps;
    cells.push({ ...props, key: child.key ?? index });
  });

  // 按 column 分行：累加 span，满 column 换行
  const rows: CellData[][] = [];
  let current: CellData[] = [];
  let used = 0;

  for (const cell of cells) {
    const span = Math.min(cell.span ?? 1, column);
    if (used + span > column) {
      // 上一行用 span 撑满
      if (current.length > 0) {
        const last = current[current.length - 1];
        last.span = (last.span ?? 1) + (column - used);
      }
      rows.push(current);
      current = [];
      used = 0;
    }
    current.push({ ...cell, span });
    used += span;
  }

  if (current.length > 0) {
    const last = current[current.length - 1];
    last.span = (last.span ?? 1) + (column - used);
    rows.push(current);
  }

  const rootClasses = [
    "el-descriptions",
    size && `el-descriptions--${size}`,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const hasHeader =
    title !== undefined || extra !== undefined;

  const cellStyle = (cell: CellData, kind: "label" | "content"): CSSProperties => {
    const width =
      kind === "label"
        ? (cell.labelWidth ?? labelWidth ?? cell.width)
        : cell.width;
    return {
      width: addUnit(width),
      minWidth: addUnit(cell.minWidth),
    };
  };

  const alignClass = (value?: string) => (value ? `is-${value}` : "");

  const renderLabelCell = (cell: CellData) => (
    <td
      key={`label-${String(cell.key)}`}
      className={[
        "el-descriptions__cell",
        "el-descriptions__label",
        border && "is-bordered-label",
        isVertical && "is-vertical-label",
        alignClass(cell.labelAlign ?? cell.align),
        cell.labelClassName,
      ]
        .filter(Boolean)
        .join(" ")}
      style={cellStyle(cell, "label")}
      colSpan={isVertical ? cell.span : 1}
      rowSpan={isVertical ? 1 : cell.rowspan}
    >
      {cell.label}
    </td>
  );

  const renderContentCell = (cell: CellData) => (
    <td
      key={`content-${String(cell.key)}`}
      className={[
        "el-descriptions__cell",
        "el-descriptions__content",
        border && "is-bordered-content",
        isVertical && "is-vertical-content",
        alignClass(cell.align),
        cell.className,
      ]
        .filter(Boolean)
        .join(" ")}
      style={cellStyle(cell, "content")}
      colSpan={isVertical ? cell.span : border ? cell.span! * 2 - 1 : cell.span}
      rowSpan={isVertical ? (cell.rowspan ?? 1) * 2 - 1 : cell.rowspan}
    >
      {cell.children}
    </td>
  );

  return (
    <div className={rootClasses} style={style}>
      {hasHeader && (
        <div className="el-descriptions__header">
          <div className="el-descriptions__title">{title}</div>
          <div className="el-descriptions__extra">{extra}</div>
        </div>
      )}

      <div className="el-descriptions__body">
        <table
          className={[
            "el-descriptions__table",
            border && "is-bordered",
          ]
            .filter(Boolean)
            .join(" ")}
        >
          <tbody>
            {rows.map((row, rowIndex) => {
              if (isVertical) {
                return [
                  <tr key={`label-${rowIndex}`}>
                    {row.map(renderLabelCell)}
                  </tr>,
                  <tr key={`content-${rowIndex}`}>
                    {row.map(renderContentCell)}
                  </tr>,
                ];
              }

              return (
                <tr key={rowIndex}>
                  {row.map((cell) =>
                    border ? (
                      [
                        renderLabelCell(cell),
                        renderContentCell(cell),
                      ]
                    ) : (
                      <td
                        key={String(cell.key)}
                        className={[
                          "el-descriptions__cell",
                          alignClass(cell.align),
                        ]
                          .filter(Boolean)
                          .join(" ")}
                        style={cellStyle(cell, "content")}
                        colSpan={cell.span}
                        rowSpan={cell.rowspan}
                      >
                        {cell.label !== undefined && cell.label !== null && (
                          <span
                            className={["el-descriptions__label", cell.labelClassName]
                              .filter(Boolean)
                              .join(" ")}
                            style={
                              labelWidth || cell.labelWidth
                                ? {
                                    width: addUnit(cell.labelWidth ?? labelWidth),
                                    display: "inline-block",
                                  }
                                : undefined
                            }
                          >
                            {cell.label}
                          </span>
                        )}
                        <span
                          className={["el-descriptions__content", cell.className]
                            .filter(Boolean)
                            .join(" ")}
                        >
                          {cell.children}
                        </span>
                      </td>
                    ),
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
