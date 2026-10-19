import type { TreeNodeData } from "../tree";

/** 对应官方 isNil。 */
export const isNil = (value: unknown): value is null | undefined =>
  value === null || value === undefined;

/** 对应官方 isValidValue：0 也算有效值。 */
export function isValidValue(val: unknown): boolean {
  return Boolean(val) || val === 0;
}

/** 对应官方 isValidArray：非空数组。 */
export function isValidArray(val: unknown): val is unknown[] {
  return Array.isArray(val) && val.length > 0;
}

/** 对应官方 toValidArray：把单值/数组统一成数组。 */
export function toValidArray(val: unknown): unknown[] {
  return Array.isArray(val) ? val : isValidValue(val) ? [val] : [];
}

type TreeCallback<T> = (
  data: T,
  index: number,
  array: T[],
  parent?: T,
) => void;

/** 对应官方 treeEach：先序遍历整棵树。 */
export function treeEach<T extends TreeNodeData>(
  treeData: T[],
  callback: TreeCallback<T>,
  getChildren: (data: T) => T[] | null | undefined,
  parent?: T,
): void {
  for (let i = 0; i < treeData.length; i++) {
    const data = treeData[i];
    callback(data, i, treeData, parent);

    const children = getChildren(data);
    if (isValidArray(children)) {
      treeEach(children as T[], callback, getChildren, data);
    }
  }
}

/**
 * 对应官方 treeFind。
 *
 * resultCallback 存在时返回它的结果（tree-select 用它取命中节点的父节点值），
 * 否则返回命中的节点数据本身。
 */
export function treeFind<T extends TreeNodeData, R>(
  treeData: T[],
  findCallback: (data: T, index: number, array: T[], parent?: T) => boolean,
  getChildren: (data: T) => T[] | null | undefined,
  resultCallback?: (data: T, index: number, array: T[], parent?: T) => R,
  parent?: T,
): T | R | undefined {
  for (let i = 0; i < treeData.length; i++) {
    const data = treeData[i];
    if (findCallback(data, i, treeData, parent)) {
      return resultCallback ? resultCallback(data, i, treeData, parent) : data;
    }
    const children = getChildren(data);
    if (isValidArray(children)) {
      const found = treeFind(
        children as T[],
        findCallback,
        getChildren,
        resultCallback,
        data,
      );
      if (found) return found;
    }
  }
  return undefined;
}

/** 对应官方 escapeStringRegexp：转义正则元字符，供默认过滤构造 RegExp。 */
export function escapeStringRegexp(str: string): string {
  return str
    .replace(/[|\\{}()[\]^$+*?.]/g, "\\$&")
    .replace(/-/g, "\\x2d");
}
