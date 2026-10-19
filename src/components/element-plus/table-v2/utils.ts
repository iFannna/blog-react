import type { CSSProperties } from "react";

import type { Column, KeyType } from "./types";

/** 与官方 sum 一致：数组求和，单个数字原样返回。 */
export const sum = (listLike: number | number[]): number =>
  Array.isArray(listLike)
    ? listLike.reduce((total, value) => total + value, 0)
    : listLike;

export const ensureArray = <T,>(value: T | T[]): T[] =>
  Array.isArray(value) ? value : [value];

export const isObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object";

export const addUnit = (value?: string | number): string | undefined => {
  if (value === undefined || value === null || value === "") return undefined;
  return typeof value === "number" ? `${value}px` : `${value}`;
};

/** 对应官方 enforceUnit：给尺寸类属性补 px，返回新对象避免污染外部样式。 */
export const enforceUnit = (style: CSSProperties = {}): CSSProperties => {
  const next: Record<string, unknown> = { ...style };
  (["width", "maxWidth", "minWidth", "height"] as const).forEach((key) => {
    next[key] = addUnit(style[key] as string | number | undefined);
  });
  return next as CSSProperties;
};

/** 对应官方 tryCall：函数则调用，否则返回原值或默认值。 */
export const tryCall = <P, R>(
  fLike: R | ((params: P) => R) | undefined,
  params: P,
  defaultRet: R,
): R => {
  if (typeof fLike === "function") {
    return (fLike as (params: P) => R)(params);
  }
  return fLike ?? defaultRet;
};

/** 简化版 lodash get，支持 `a.b[0].c` 形式的 dataKey。 */
export const get = (target: unknown, path: KeyType | undefined): unknown => {
  if (path === undefined || path === null || path === "") return undefined;
  if (typeof path !== "string") {
    return (target as Record<KeyType, unknown>)?.[path];
  }

  const segments = path
    .replace(/\[(\w+)\]/g, ".$1")
    .replace(/^\./, "")
    .split(".");

  let current: unknown = target;
  for (const segment of segments) {
    if (current === null || current === undefined) return undefined;
    current = (current as Record<string, unknown>)[segment];
  }
  return current;
};

export const ns = {
  b: () => "el-table-v2",
  e: (name: string) => `el-table-v2__${name}`,
  em: (name: string, suffix: string) => `el-table-v2__${name}--${suffix}`,
  is: (name: string, state = true) => (state ? `is-${name}` : ""),
};

/** 对应官方 composables/utils 的 calcColumnStyle。 */
export const calcColumnStyle = <T,>(
  column: Column<T>,
  tableFixed: boolean,
): CSSProperties => {
  const flex = tableFixed
    ? { flexGrow: 0, flexShrink: 0 }
    : {
        flexGrow: column.flexGrow ?? 0,
        flexShrink: column.flexShrink ?? 1,
      };

  const style: CSSProperties = {
    ...(column.style ?? {}),
    ...flex,
    flexBasis: "auto",
    width: column.width,
  };

  // 官方在非 fixed 表才应用列的 min/maxWidth
  if (!tableFixed) {
    if (column.maxWidth) style.maxWidth = column.maxWidth;
    if (column.minWidth) style.minWidth = column.minWidth;
  }

  return style;
};
