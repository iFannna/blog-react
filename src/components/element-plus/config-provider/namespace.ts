/**
 * 对应官方 packages/hooks/use-namespace 的 _bem / cssVar / is 逻辑。
 *
 * ConfigProvider 的 namespace 配置需要作用到所有组件的类名与 CSS 变量上，
 * 组件里拼类名的地方多，只有把这些纯函数抽出来，useNamespace 才既能读
 * ConfigProvider 又能保持与官方逐字一致。
 */

/** 对应官方默认 namespace。 */
export const defaultNamespace = "el";

const statePrefix = "is-";

function bem(
  namespace: string,
  block: string,
  blockSuffix: string,
  element: string,
  modifier: string,
) {
  let cls = `${namespace}-${block}`;
  if (blockSuffix) cls += `-${blockSuffix}`;
  if (element) cls += `__${element}`;
  if (modifier) cls += `--${modifier}`;
  return cls;
}

export interface UseNamespaceReturn {
  /** 当前命名空间前缀，对应官方 ns.namespace */
  namespace: string;
  b: (blockSuffix?: string) => string;
  e: (element?: string) => string;
  m: (modifier?: string) => string;
  be: (blockSuffix?: string, element?: string) => string;
  em: (element?: string, modifier?: string) => string;
  bm: (blockSuffix?: string, modifier?: string) => string;
  bem: (blockSuffix?: string, element?: string, modifier?: string) => string;
  is: (name: string, state?: boolean) => string;
  /** 产出 `--el-xxx` 变量，对应官方 cssVar */
  cssVar: (object: Record<string, string>) => Record<string, string>;
  /** 产出 `--el-block-xxx` 变量，对应官方 cssVarBlock */
  cssVarBlock: (object: Record<string, string>) => Record<string, string>;
  cssVarName: (name: string) => string;
  cssVarBlockName: (name: string) => string;
}

export function createNamespace(
  namespace: string,
  block: string,
): UseNamespaceReturn {
  const b = (blockSuffix = "") => bem(namespace, block, blockSuffix, "", "");
  const e = (element?: string) =>
    element ? bem(namespace, block, "", element, "") : "";
  const m = (modifier?: string) =>
    modifier ? bem(namespace, block, "", "", modifier) : "";
  const be = (blockSuffix?: string, element?: string) =>
    blockSuffix && element
      ? bem(namespace, block, blockSuffix, element, "")
      : "";
  const em = (element?: string, modifier?: string) =>
    element && modifier ? bem(namespace, block, "", element, modifier) : "";
  const bm = (blockSuffix?: string, modifier?: string) =>
    blockSuffix && modifier
      ? bem(namespace, block, blockSuffix, "", modifier)
      : "";
  const bemFn = (blockSuffix?: string, element?: string, modifier?: string) =>
    blockSuffix && element && modifier
      ? bem(namespace, block, blockSuffix, element, modifier)
      : "";

  const is = (name: string, state = true) =>
    name && state ? `${statePrefix}${name}` : "";

  const cssVar = (object: Record<string, string>) => {
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) styles[`--${namespace}-${key}`] = object[key];
    }
    return styles;
  };

  const cssVarBlock = (object: Record<string, string>) => {
    const styles: Record<string, string> = {};
    for (const key in object) {
      if (object[key]) styles[`--${namespace}-${block}-${key}`] = object[key];
    }
    return styles;
  };

  const cssVarName = (name: string) => `--${namespace}-${name}`;
  const cssVarBlockName = (name: string) => `--${namespace}-${block}-${name}`;

  return {
    namespace,
    b,
    e,
    m,
    be,
    em,
    bm,
    bem: bemFn,
    is,
    cssVar,
    cssVarBlock,
    cssVarName,
    cssVarBlockName,
  };
}
