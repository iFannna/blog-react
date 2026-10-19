/** 对应官方 @element-plus/utils 里被 upload 用到的几个判定函数。 */

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isNil(value: unknown): value is null | undefined {
  return value === null || value === undefined;
}

/** 与 React 的 isValidElement 等价的最简判定，用于区分 options 与 ReactNode。 */
export function isReactElement(value: unknown): boolean {
  return (
    typeof value === "object" &&
    value !== null &&
    "$$typeof" in (value as Record<string, unknown>)
  );
}
