import type { FormItemProp } from "./context";

/**
 * 按路径读写对象属性。
 *
 * 官方 depends 于 lodash-unified 的 get/set；这里只实现官方用到的两种形态：
 * 数组路径（['a', 'b', '0']）与点号分隔的字符串（'a.b.0'）。
 */
function toPath(prop: FormItemProp): string[] {
  return Array.isArray(prop) ? prop : prop.split(".");
}

export function getPropValue(source: unknown, prop: FormItemProp): unknown {
  let current: unknown = source;
  for (const key of toPath(prop)) {
    if (current === null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[key];
  }
  return current;
}

/** 与 getPropValue 同一套路径语义的写入版，用于 resetFields 回写。 */
export function setPropValue(
  target: unknown,
  prop: FormItemProp,
  value: unknown,
): void {
  const path = toPath(prop);
  let current = target as Record<string, unknown> | undefined;

  for (let i = 0; i < path.length - 1; i++) {
    if (current === undefined || current === null) return;
    current = current[path[i]] as Record<string, unknown>;
  }

  if (current === undefined || current === null) return;
  current[path[path.length - 1]] = value;
}

/** 把官方同时接受单个值或数组的地方统一成数组。 */
export function ensureArray<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}

export function isString(value: unknown): value is string {
  return typeof value === "string";
}

export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isFunction(value: unknown): value is (...args: never[]) => unknown {
  return typeof value === "function";
}

export function isBoolean(value: unknown): value is boolean {
  return typeof value === "boolean";
}

/** 官方把 prop 归一成点号字符串，用于比较与 filterFields。 */
export function normalizeProp(prop: FormItemProp): string {
  return Array.isArray(prop) ? prop.join(".") : prop;
}

export function addUnit(value?: string | number): string | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return typeof value === "number" ? `${value}px` : value;
}

const SCOPE = "ElForm";

export function debugWarn(scope: string, message: string) {
  if (process.env.NODE_ENV !== "production") {
    console.warn(`[${SCOPE}] ${scope}: ${message}`);
  }
}

export function throwError(message: string): never {
  throw new Error(`[${SCOPE}] ${message}`);
}

/** 对应官方 utils.ts 的 filterFields。 */
export function filterFields<T extends { propString: string }>(
  fields: T[],
  props: FormItemProp | FormItemProp[],
): T[] {
  const normalized = ensureArray(props).map(normalizeProp);
  return normalized.length > 0
    ? fields.filter(
        (field) => field.propString && normalized.includes(field.propString),
      )
    : fields;
}

/** 官方 filterFields 里经由 getProp 的读取，这里复用同一套路径语义。 */
export { setPropValue as setValue };
