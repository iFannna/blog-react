"use client";

import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { ElCheckbox } from "../checkbox";
import { ElIcon } from "../icon/ElIcon";
import { ArrowRight, Loading } from "../generated/icons";
import { ElTooltip } from "../tooltip";
import type {
  DefaultRow,
  TableCellScope,
  TableColumnCtx,
  TreeNode,
} from "./context";
import { defaultRenderCell, readCellValue } from "./utils";
import { renderForcedCell } from "./config";

/** 表头渲染需要的表格侧信息。 */
export interface HeaderRenderContext<T extends DefaultRow> {
  ns: string;
  tableSize: string;
  store: {
    states: {
      data: T[];
      isAllSelected: boolean;
      isIndeterminate: boolean;
    };
    toggleAllSelection: () => void;
  };
}

/** 单元格渲染需要的表格侧信息。 */
export interface BodyRenderContext<T extends DefaultRow> {
  ns: string;
  tableSize: string;
  tooltipEffect?: "dark" | "light";
  tooltipFormatter?: (data: { row: T; column: TableColumnCtx<T>; cellValue: unknown }) => ReactNode;
  store: {
    states: {
      data: T[];
      rowExpandable?: (row: T, index: number) => boolean;
    };
    isSelected: (row: T) => boolean;
    getRowIndeterminate: (row: T) => boolean;
    toggleRowSelection: (row: T) => void;
    toggleRowExpansion: (row: T) => void;
  };
}

/**
 * 渲染表头单元格内容。
 *
 * selection / index / expand 三类列由表格接管（对应官方 cellForced），
 * 其余列优先用用户的自定义表头，再回退到 label 文本。
 */
export function renderHeaderCellContent<T extends DefaultRow>(
  column: TableColumnCtx<T>,
  cellIndex: number,
  ctx: HeaderRenderContext<T>,
): ReactNode {
  if (column.type !== "default") {
    return renderForcedCell(
      column.type,
      "header",
      { row: undefined as unknown as T, column, $index: cellIndex },
      { store: ctx.store as never, ns: ctx.ns },
    );
  }

  if (column.customHeaderRender) {
    return column.customHeaderRender({ column, $index: cellIndex });
  }

  return column.label;
}

/**
 * 渲染单元格内容。
 *
 * 对应官方 table-column/render-helper.ts 里对 renderCell 的包装：
 * 外层固定是 `<div class="cell">`，selection 等类型由表格接管。
 */
export function renderBodyCellContent<T extends DefaultRow>(options: {
  row: T;
  column: TableColumnCtx<T>;
  $index: number;
  cellIndex: number;
  expanded?: boolean;
  treeNode?: TreeNode;
  onTreeToggle?: () => void;
  ctx: BodyRenderContext<T>;
}): ReactNode {
  const {
    row,
    column,
    $index,
    expanded,
    treeNode,
    onTreeToggle,
    ctx,
  } = options;

  if (column.type !== "default") {
    return (
      <div className="cell">
        {renderForcedCell(
          column.type,
          "cell",
          { row, column, $index, expanded },
          { store: ctx.store as never, ns: ctx.ns },
        )}
      </div>
    );
  }

  const children = column.customRender
    ? column.customRender({ row, column, $index } as TableCellScope<T>)
    : defaultRenderCell({ row, column, $index });

  const prefix = renderTreePrefix({
    treeNode,
    ns: ctx.ns,
    onToggle: onTreeToggle,
  });

  if (!column.showOverflowTooltip) {
    return <div className="cell">{prefix}{children}</div>;
  }

  return (
    <CellWithOverflowTooltip
      row={row}
      column={column}
      cellStyle={{
        width: `${(column.realWidth || Number(column.width)) - 1}px`,
      }}
      cellValue={readCellValue(row, column.property)}
      tableFormatter={ctx.tooltipFormatter}
      tooltipEffect={ctx.tooltipEffect}
    >
      {prefix}
      {children}
    </CellWithOverflowTooltip>
  );
}

/**
 * 溢出才弹出的单元格 tooltip。
 *
 * 官方用表格级单例 popper + mouseenter 时测量；React 侧换成受控 ElTooltip，
 * 由单元格自己的 scrollWidth / clientWidth 判断是否真的溢出。
 * trigger 置空是为了不让 ElTooltip 的触发事件覆盖测量用的 onMouseEnter。
 */
function CellWithOverflowTooltip<T extends DefaultRow>({
  row,
  column,
  cellStyle,
  cellValue,
  tableFormatter,
  tooltipEffect,
  children,
}: {
  row: T;
  column: TableColumnCtx<T>;
  cellStyle: CSSProperties;
  cellValue: unknown;
  tableFormatter?: (data: { row: T; column: TableColumnCtx<T>; cellValue: unknown }) => ReactNode;
  tooltipEffect?: "dark" | "light";
  children: ReactNode;
}) {
  const [visible, setVisible] = useState(false);
  const [overflowText, setOverflowText] = useState("");
  const triggerRef = useRef<HTMLElement | null>(null);

  const formatter = column.tooltipFormatter ?? tableFormatter;
  const formattedContent = formatter
    ? formatter({ row, column, cellValue })
    : undefined;
  const hasFormattedContent =
    formattedContent !== undefined && formattedContent !== null && formattedContent !== "";

  const handleMouseEnter = () => {
    const el = triggerRef.current;
    if (!el) return;
    const overflow =
      el.scrollWidth > el.clientWidth + 1 ||
      el.scrollHeight > el.clientHeight + 1;
    if (!overflow) {
      setVisible(false);
      return;
    }
    if (!hasFormattedContent) {
      setOverflowText(el.innerText || el.textContent || "");
    }
    setVisible(true);
  };

  return (
    <ElTooltip
      trigger={[]}
      visible={visible}
      onVisibleChange={(next) => {
        if (!next) setVisible(false);
      }}
      placement="top"
      effect={tooltipEffect ?? "dark"}
      showAfter={0}
      hideAfter={0}
      content={hasFormattedContent ? formattedContent : overflowText}
      triggerRef={triggerRef}
    >
      <div
        className="cell el-tooltip"
        style={cellStyle}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={() => setVisible(false)}
      >
        {children}
      </div>
    </ElTooltip>
  );
}

/**
 * 对应官方 config.ts 的 treeCellPrefix：树形单元格前的缩进与展开按钮。
 * 无 treeNode 时不输出任何节点，与官方无树数据时一致。
 */
export function renderTreePrefix(options: {
  treeNode?: TreeNode;
  ns: string;
  createPlaceholder?: boolean;
  onToggle?: () => void;
}): ReactNode {
  const { treeNode, ns, createPlaceholder, onToggle } = options;

  if (!treeNode) {
    return createPlaceholder ? <span className={`${ns}__placeholder`} /> : null;
  }

  const nodes: ReactNode[] = [];

  if (treeNode.indent) {
    nodes.push(
      <span
        key="indent"
        className={`${ns}__indent`}
        style={{ paddingLeft: `${treeNode.indent}px` }}
      />,
    );
  }

  if (typeof treeNode.expanded === "boolean" && !treeNode.noLazyChildren) {
    nodes.push(
      <button
        key="expand"
        type="button"
        aria-expanded={treeNode.expanded}
        aria-label={treeNode.expanded ? "收起" : "展开"}
        className={[
          `${ns}__expand-icon`,
          treeNode.expanded ? `${ns}__expand-icon--expanded` : "",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={(event) => {
          event.stopPropagation();
          onToggle?.();
        }}
      >
        <ElIcon className={treeNode.loading ? "is-loading" : ""}>
          {treeNode.loading ? <Loading /> : <ArrowRight />}
        </ElIcon>
      </button>,
    );
  } else {
    nodes.push(<span key="placeholder" className={`${ns}__placeholder`} />);
  }

  return nodes;
}

export { ElCheckbox };
