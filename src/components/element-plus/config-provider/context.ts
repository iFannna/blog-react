"use client";

import {
  createContext,
  useCallback,
  useContext,
} from "react";
import type { ConfigProviderContext, Language, ValueOnClear } from "./types";
import {
  DEFAULT_EMPTY_VALUES,
  DEFAULT_VALUE_ON_CLEAR,
} from "./constants";
import { en } from "./locales";

/** 对应官方 emptyValuesContextKey 的值形状。 */
export interface EmptyValuesContextValue {
  emptyValues?: unknown[];
  valueOnClear?: ValueOnClear;
}

/**
 * 对应官方 configProviderContextKey。
 *
 * 官方用 provide 逐层合并（provideGlobalConfig 里 mergeConfig 父配置），
 * React 侧由 ElConfigProvider 在渲染时合并好父子配置再下发，
 * Context 本身只承载「当前生效的完整配置」。
 */
export const ConfigProviderContextKey = createContext<ConfigProviderContext>({});

/** 对应官方 localeContextKey。 */
export const LocaleContextKey = createContext<Language | undefined>(undefined);

/** 对应官方 zIndexContextKey。 */
export const ZIndexContextKey = createContext<number | undefined>(undefined);

/** 对应官方 SIZE_INJECTION_KEY 中的 size 部分。 */
export const SizeContextKey = createContext<string>("");

/** 对应官方 emptyValuesContextKey。 */
export const EmptyValuesContextKey = createContext<EmptyValuesContextValue>({});

/**
 * Provider 嵌套深度，用来在第 N 层退出时还原成第 N-1 层的模块级配置。
 * 官方用 globalConfig 单例 + watch 覆盖，React 侧用「深度 -> 配置」映射保证
 * 无论 effect 执行顺序如何，最内层始终是模块级配置的来源。
 */
export const ConfigProviderDepthKey = createContext(-1);

let globalConfigSnapshot: ConfigProviderContext | undefined;
const mountedConfigs = new Map<
  string,
  { depth: number; config: ConfigProviderContext }
>();

/**
 * 取嵌套最深的那层配置。
 *
 * 子组件的 effect 先于父组件执行，卸载时子组件的清理又先于父组件，
 * 因此不能用「最后一次写入」决定快照；按深度取最深层，与挂载/卸载顺序无关。
 *
 * 同层多个 Provider 时按挂载顺序合并：文档页把每个 demo 渲染在同一个 React
 * 树里，而官方每个 demo 是独立的 Vue 应用，两者的 globalConfig 互不干扰。
 * 若同层只取最后一个，后面的 demo（如 table）会把前面 demo 下发的 message /
 * locale 配置覆盖成 undefined，命令式 message() 就读不到配置了。
 */
function publishDeepest() {
  let deepestDepth = -1;

  for (const { depth } of mountedConfigs.values()) {
    if (depth > deepestDepth) deepestDepth = depth;
  }

  if (deepestDepth < 0) {
    globalConfigSnapshot = undefined;
    return;
  }

  let merged: ConfigProviderContext = {};

  for (const { depth, config } of mountedConfigs.values()) {
    if (depth === deepestDepth) merged = mergeConfig(merged, config);
  }

  globalConfigSnapshot = merged;
}

/** 供 ElConfigProvider 在挂载/更新时写入。 */
export function mountGlobalConfig(
  id: string,
  depth: number,
  config: ConfigProviderContext,
) {
  mountedConfigs.set(id, { depth, config });
  publishDeepest();
}

/** 供 ElConfigProvider 卸载时清除。 */
export function unmountGlobalConfig(id: string) {
  mountedConfigs.delete(id);
  publishDeepest();
}

/**
 * 命令式读取当前全局配置，对应官方 useGlobalConfig 在组件 setup 之外
 * 直接读模块级 globalConfig 的分支（ElMessage / ElMessageBox 等）。
 */
export function getGlobalConfig(): ConfigProviderContext | undefined {
  return globalConfigSnapshot;
}

/**
 * 合并父子两级的全局配置；undefined 值不覆盖父级，与官方 mergeConfig 一致。
 */
export function mergeConfig(
  parent: ConfigProviderContext,
  own: ConfigProviderContext,
): ConfigProviderContext {
  const keys = new Set<string>([
    ...Object.keys(parent),
    ...Object.keys(own),
  ]) as Set<keyof ConfigProviderContext>;

  const merged: ConfigProviderContext = {};

  for (const key of keys) {
    const value = own[key];
    (merged as Record<string, unknown>)[key] =
      value !== undefined ? value : parent[key];
  }

  return merged;
}

/**
 * 对应官方 useGlobalConfig。
 *
 * 重载与官方一致：带 key 取该字段（缺省回退 defaultValue），不带 key 取完整配置。
 * 官方返回 Ref，React 侧直接返回当前值（配置变化会随 Provider 重渲染）。
 */
export function useGlobalConfig(): ConfigProviderContext;
export function useGlobalConfig<K extends keyof ConfigProviderContext>(
  key: K,
): ConfigProviderContext[K];
export function useGlobalConfig<K extends keyof ConfigProviderContext>(
  key: K,
  defaultValue: NonNullable<ConfigProviderContext[K]>,
): NonNullable<ConfigProviderContext[K]>;
export function useGlobalConfig<K extends keyof ConfigProviderContext>(
  key?: K,
  defaultValue?: ConfigProviderContext[K],
): ConfigProviderContext | ConfigProviderContext[K] {
  const config = useContext(ConfigProviderContextKey);

  if (key === undefined) return config;

  const value = config[key];
  return value !== undefined ? value : defaultValue;
}

/** 对应官方 useLocale：取当前语言包，缺省为英文。 */
export function useLocale(): Language {
  const locale = useContext(LocaleContextKey);
  const config = useGlobalConfig();
  return locale ?? config.locale ?? en;
}

/**
 * 对应官方 useLocale 返回的 t 函数实现（非 Hook 版，供命令式组件复用）。
 * path 形如 "el.pagination.total"，用 {key} 占位符插值，与官方 translate 一致。
 */
export function translate(
  path: string,
  locale: Language,
  option?: Record<string, string | number>,
) {
  const raw = path
    .split(".")
    .reduce<unknown>(
      (acc, part) =>
        acc && typeof acc === "object"
          ? (acc as Record<string, unknown>)[part]
          : undefined,
      locale,
    );

  if (raw === undefined) return path;
  if (typeof raw !== "string") return String(raw);

  return raw.replace(/\{(\w+)\}/g, (_, key: string) =>
    option?.[key] !== undefined ? String(option[key]) : `{${key}}`,
  );
}

/** 对应官方 useLocale 返回的 t 函数（Hook 版）。 */
export function useTranslator() {
  const locale = useLocale();

  return useCallback(
    (path: string, option?: Record<string, string | number>) =>
      translate(path, locale, option),
    [locale],
  );
}

/** 对应官方 useEmptyValues：空值与清空返回值，回退链与官方一致。 */
export function useEmptyValues(overrides?: {
  emptyValues?: unknown[];
  valueOnClear?: ValueOnClear;
}) {
  const context = useContext(EmptyValuesContextKey);

  const emptyValues =
    overrides?.emptyValues ?? context.emptyValues ?? DEFAULT_EMPTY_VALUES;

  const resolveOnClear = (value: ValueOnClear | undefined) =>
    typeof value === "function" ? value() : value;

  // 函数形态用于表达 undefined（undefined 无法作为 prop 值传递）
  const valueOnClear =
    overrides?.valueOnClear !== undefined
      ? resolveOnClear(overrides.valueOnClear)
      : context.valueOnClear !== undefined
        ? resolveOnClear(context.valueOnClear)
        : DEFAULT_VALUE_ON_CLEAR;

  /** 对应官方 isEmptyValue：数组值用深比较，其余用 includes。 */
  const isEmptyValue = (value: unknown) => {
    if (Array.isArray(value)) {
      return emptyValues.some(
        (emptyValue) => JSON.stringify(emptyValue) === JSON.stringify(value),
      );
    }
    return emptyValues.includes(value);
  };

  return { emptyValues, valueOnClear, isEmptyValue };
}
