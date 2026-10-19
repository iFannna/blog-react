import type { CSSProperties } from "react";
import type {
  DefaultRow,
  Sort,
  TableColumnCtx,
  TreeNode,
} from "./context";

/** 对应官方 util.ts 的 orderBy。 */
export function orderBy<T extends DefaultRow>(
  array: T[],
  sortKey: string | null,
  reverse: string | number | null,
  sortMethod: ((a: T, b: T) => number) | undefined,
  sortBy: TableColumnCtx<T>["sortBy"],
): T[] {
  if (
    !sortKey &&
    !sortMethod &&
    (!sortBy || (Array.isArray(sortBy) && !sortBy.length))
  ) {
    return array;
  }

  let direction: number;
  if (typeof reverse === "string") {
    direction = reverse === "descending" ? -1 : 1;
  } else {
    direction = reverse && reverse < 0 ? -1 : 1;
  }

  const getKey = sortMethod
    ? null
    : (value: T, index: number): unknown[] => {
        if (sortBy) {
          return toArray(sortBy).flatMap((by) => {
            if (typeof by === "string") return readPath(value, by);
            return by(value, index, array);
          });
        }
        if (sortKey !== "$key") {
          if (typeof value === "object" && value !== null && "$value" in value) {
            return [(value as Record<string, unknown>).$value];
          }
        }
        return [
          typeof value === "object" && value !== null
            ? sortKey
              ? readPath(value, sortKey)
              : null
            : value,
        ];
      };

  const compare = (a: { value: T; key: unknown[] | null }, b: { value: T; key: unknown[] | null }) => {
    if (sortMethod) return sortMethod(a.value, b.value);
    const len = a.key?.length ?? 0;
    for (let i = 0; i < len; i++) {
      const ka = a.key?.[i];
      const kb = b.key?.[i];
      if ((ka as number) < (kb as number)) return -1;
      if ((ka as number) > (kb as number)) return 1;
    }
    return 0;
  };

  return array
    .map((value, index) => ({ value, index, key: getKey ? getKey(value, index) : null }))
    .sort((a, b) => {
      let order = compare(a, b);
      // 保持稳定排序，与官方一致
      if (!order) order = a.index - b.index;
      return order * direction;
    })
    .map((item) => item.value);
}

/**
 * 对应官方 table-header/utils-helper.ts 的 convertToRows。
 *
 * 把列树拍平成「每一行表头要渲染哪些列」，同时算出每个列节点的
 * level / colSpan / rowSpan，供分组表头渲染使用。
 */
export function convertToRows<T extends DefaultRow>(
  originColumns: TableColumnCtx<T>[],
): TableColumnCtx<T>[][] {
  let maxLevel = 1;

  const traverse = (column: TableColumnCtx<T>, parent?: TableColumnCtx<T>) => {
    if (parent) {
      column.level = parent.level + 1;
      if (maxLevel < column.level) maxLevel = column.level;
    }
    if (column.children) {
      let colSpan = 0;
      column.children.forEach((subColumn) => {
        traverse(subColumn, column);
        colSpan += subColumn.colSpan;
      });
      column.colSpan = colSpan;
    } else {
      column.colSpan = 1;
    }
  };

  originColumns.forEach((column) => {
    column.level = 1;
    traverse(column, undefined);
  });

  const rows: TableColumnCtx<T>[][] = [];
  for (let i = 0; i < maxLevel; i++) rows.push([]);

  const getAllColumns = (columns: TableColumnCtx<T>[]): TableColumnCtx<T>[] => {
    const result: TableColumnCtx<T>[] = [];
    columns.forEach((column) => {
      if (column.children) {
        result.push(column);
        result.push(...getAllColumns(column.children));
      } else {
        result.push(column);
      }
    });
    return result;
  };

  getAllColumns(originColumns).forEach((column) => {
    if (!column.children) {
      column.rowSpan = maxLevel - column.level + 1;
    } else {
      column.rowSpan = 1;
    }
    rows[column.level - 1].push(column);
  });

  return rows;
}

/** 对应官方 util.ts 的 doFlattenColumns：把列树按叶子顺序拍平。 */
export function flattenColumns<T extends DefaultRow>(
  columns: TableColumnCtx<T>[],
): TableColumnCtx<T>[] {
  const result: TableColumnCtx<T>[] = [];
  columns.forEach((column) => {
    if (column.children && column.children.length > 0) {
      result.push(...flattenColumns(column.children));
    } else {
      result.push(column);
    }
  });
  return result;
}

/** 对应官方 util.ts 的 isFixedColumn。 */
export function isFixedColumn<T extends DefaultRow>(
  index: number,
  fixed: string | boolean | undefined,
  store: { columns: TableColumnCtx<T>[]; fixedLeafColumnsLength: number; rightFixedLeafColumnsLength: number },
  realColumns?: TableColumnCtx<T>[],
): { direction?: "left" | "right"; start?: number; after?: number } {
  let start = 0;
  let after = index;
  const columns = store.columns;

  if (realColumns) {
    // 分组表头下的固定列：把当前列组涉及的叶子列范围算出来
    const curColumns = getCurrentColumns(realColumns[index]);
    const preColumns = columns.slice(0, columns.indexOf(curColumns[0]));
    start = preColumns.reduce(getColSpan, 0);
    after = start + curColumns.reduce(getColSpan, 0) - 1;
  } else {
    start = index;
  }

  let direction: "left" | "right" | undefined;
  switch (fixed) {
    case "left":
      if (after < store.fixedLeafColumnsLength) direction = "left";
      break;
    case "right":
      if (start >= columns.length - store.rightFixedLeafColumnsLength) {
        direction = "right";
      }
      break;
    default:
      if (after < store.fixedLeafColumnsLength) direction = "left";
      else if (start >= columns.length - store.rightFixedLeafColumnsLength) {
        direction = "right";
      }
  }

  return direction ? { direction, start, after } : {};
}

function getColSpan<T extends DefaultRow>(sum: number, column: TableColumnCtx<T>) {
  return sum + (column.colSpan || 0);
}

function getCurrentColumns<T extends DefaultRow>(
  column: TableColumnCtx<T>,
): TableColumnCtx<T>[] {
  if (column.children) {
    const result: TableColumnCtx<T>[] = [];
    column.children.forEach((child) => {
      result.push(...getCurrentColumns(child));
    });
    return result;
  }
  return [column];
}

/** 对应官方 util.ts 的 getFixedColumnOffset。 */
export function getFixedColumnOffset<T extends DefaultRow>(
  index: number,
  fixed: string | boolean | undefined,
  store: { columns: TableColumnCtx<T>[]; fixedLeafColumnsLength: number; rightFixedLeafColumnsLength: number },
  realColumns?: TableColumnCtx<T>[],
): CSSProperties | undefined {
  const { direction, start = 0, after = 0 } = isFixedColumn(index, fixed, store, realColumns);
  if (!direction) return undefined;

  const styles: CSSProperties = {};
  const isLeft = direction === "left";
  const columns = store.columns;

  const getOffset = (offset: number, column: TableColumnCtx<T>) =>
    offset +
    (column.realWidth === null || Number.isNaN(column.realWidth)
      ? Number(column.width)
      : column.realWidth);

  if (isLeft) {
    styles.left = columns.slice(0, start).reduce(getOffset, 0);
  } else {
    styles.right = columns
      .slice(after + 1)
      .reverse()
      .reduce(getOffset, 0);
  }
  return styles;
}

/** 对应官方 util.ts 的 getFixedColumnsClass。 */
export function getFixedColumnsClass<T extends DefaultRow>(
  namespace: string,
  index: number,
  fixed: string | boolean | undefined,
  store: { columns: TableColumnCtx<T>[]; fixedLeafColumnsLength: number; rightFixedLeafColumnsLength: number },
  realColumns?: TableColumnCtx<T>[],
  offset = 0,
): string[] {
  const classes: string[] = [];
  const { direction, start = 0, after = 0 } = isFixedColumn(index, fixed, store, realColumns);
  if (direction) {
    const isLeft = direction === "left";
    classes.push(`${namespace}-fixed-column--${direction}`);
    if (isLeft && after + offset === store.fixedLeafColumnsLength - 1) {
      classes.push("is-last-column");
    } else if (
      !isLeft &&
      start - offset === store.columns.length - store.rightFixedLeafColumnsLength
    ) {
      classes.push("is-first-column");
    }
  }
  return classes;
}

/** 对应官方 util.ts 的 ensurePosition：把无单位的数字补上 px。 */
export function ensurePosition<T extends CSSProperties>(style: T | undefined, key: keyof T) {
  if (!style) return;
  const value = style[key];
  if (typeof value === "number" && !Number.isNaN(value)) {
    style[key] = `${value}px` as T[keyof T];
  }
}

/** 对应官方 util.ts 的 parseWidth / parseMinWidth。 */
export function parseWidth(width?: string | number): string | number | undefined {
  const widthValue =
    width !== undefined && width !== null ? String(width).replace("px", "") : undefined;
  return widthValue && /^\d+(\.\d+)?$/.test(widthValue) ? Number(widthValue) : width;
}

export function parseMinWidth(minWidth?: string | number) {
  return parseWidth(minWidth);
}

/**
 * 对应官方 config.ts 的 defaultRenderCell：没给自定义渲染时按 prop 取值。
 */
export function defaultRenderCell<T extends DefaultRow>({
  row,
  column,
  $index,
}: {
  row: T;
  column: TableColumnCtx<T>;
  $index: number;
}) {
  const property = column.property;
  const value = property ? readPath(row, property) : undefined;
  if (column.formatter) {
    return column.formatter(row, column, value, $index);
  }
  return value === null || value === undefined ? "" : String(value);
}

/** 对应官方 util.ts 的 parseHeight。 */
export function parseHeight(height: string | number | null | undefined): string | number | null {
  if (typeof height === "number") return height;
  if (typeof height === "string") {
    if (/^\d+(?:\.\d+)?$/.test(height)) return Number(height);
    return height;
  }
  return null;
}

/** 对应官方 store 里的 getRowIdentity：按 rowKey 取行标识。 */
export function getRowIdentity<T extends DefaultRow>(
  row: T,
  rowKey: string | ((row: T) => string) | undefined,
): string {
  if (!rowKey) return "";
  if (typeof rowKey === "function") return rowKey(row);
  return String(readPath(row, rowKey));
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNumber(value: unknown): value is number {
  return typeof value === "number";
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

export function isFunction(value: unknown): value is (...args: never[]) => unknown {
  return typeof value === "function";
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** 单元格原始值，tooltipFormatter 的 cellValue 用。 */
export function readCellValue<T extends DefaultRow>(
  row: T,
  property: string,
): unknown {
  return property ? readPath(row, property) : undefined;
}

/** 官方基于 getProp 的路径读取，这里用同一套语义的简版。 */
function readPath(source: unknown, prop: string): unknown {
  let current: unknown = source;
  for (const key of prop.split(".")) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

function toArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function debugWarn(scope: string, message: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[${scope}] ${message}`);
  }
}

export type { Sort, TreeNode };
