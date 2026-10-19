"use client";

import { useMemo } from "react";
import {
  ConfigProviderContextKey,
  EmptyValuesContextKey,
  LocaleContextKey,
  SizeContextKey,
  ZIndexContextKey,
  getGlobalConfig,
  mergeConfig,
  translate,
  useEmptyValues,
  useGlobalConfig,
  useLocale,
  useTranslator,
} from "./context";
import { createNamespace, type UseNamespaceReturn } from "./namespace";
import type { ConfigProviderContext, Language, ValueOnClear } from "./types";

/**
 * 对应官方 @element-plus/hooks 的 useNamespace。
 *
 * 官方会注入 namespaceContextKey 取前缀，React 侧从 ConfigProvider 下发的
 * namespace 读，缺省为 "el"；返回值与官方 _bem / cssVar 规则一致。
 */
export function useNamespace(block: string): UseNamespaceReturn {
  const namespace = useGlobalConfig("namespace") ?? "el";
  return useMemo(() => createNamespace(namespace, block), [namespace, block]);
}

export {
  ConfigProviderContextKey,
  EmptyValuesContextKey,
  LocaleContextKey,
  SizeContextKey,
  ZIndexContextKey,
  getGlobalConfig,
  mergeConfig,
  translate,
  useEmptyValues,
  useGlobalConfig,
  useLocale,
  useTranslator,
};

export type { ConfigProviderContext, Language, ValueOnClear };
