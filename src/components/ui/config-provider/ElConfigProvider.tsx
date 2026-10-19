"use client";

import { useContext, useEffect, useId, useMemo, type ReactNode } from "react";
import {
  ConfigProviderContextKey,
  ConfigProviderDepthKey,
  EmptyValuesContextKey,
  LocaleContextKey,
  SizeContextKey,
  ZIndexContextKey,
  mergeConfig,
  mountGlobalConfig,
  unmountGlobalConfig,
  useGlobalConfig,
} from "./context";
import type { ConfigProviderContext, ConfigProviderProps } from "./types";

/**
 * 对应官方 ElConfigProvider。
 *
 * 官方在 setup 里调 provideGlobalConfig(props)，把配置注入各 InjectionKey
 * （configProviderContextKey / localeContextKey / namespaceContextKey /
 * zIndexContextKey / SIZE_INJECTION_KEY / emptyValuesContextKey），
 * 同时把结果写进模块级 globalConfig 供命令式方法读取。
 *
 * React 侧：
 * - 逐层合并父配置（官方 mergeConfig 的语义），再分别下发到各 Context
 * - 不产出包装 DOM，渲染的只有 children
 * - 模块级快照在 effect 中写入，避免渲染期产生副作用，
 *   ElMessage / ElMessageBox 这类方法读到的仍是当前生效的配置
 */
export function ElConfigProvider(props: ConfigProviderProps) {
  const parentConfig = useGlobalConfig();
  const parentDepth = useContext(ConfigProviderDepthKey);
  const depth = parentDepth + 1;
  const providerId = useId();

  const { children, ...ownConfig } = props;

  /**
   * 合并后的配置需要引用稳定：它同时是 Context 值与命令式组件的读取源，
   * 而 JSX 每次渲染都会新建 ownConfig 对象，故按字段值逐一比较。
   * 依赖数组是字面量、长度固定，不违反 Hooks 规则。
   */
  const config = useMemo(
    () => mergeConfig(parentConfig, ownConfig),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      parentConfig,
      ownConfig.a11y,
      ownConfig.locale,
      ownConfig.size,
      ownConfig.button,
      ownConfig.card,
      ownConfig.dialog,
      ownConfig.link,
      ownConfig.keyboardNavigation,
      ownConfig.message,
      ownConfig.zIndex,
      ownConfig.namespace,
      ownConfig.table,
      ownConfig.experimentalFeatures,
      ownConfig.emptyValues,
      ownConfig.valueOnClear,
    ],
  );

  useEffect(() => {
    mountGlobalConfig(providerId, depth, config);
    return () => unmountGlobalConfig(providerId);
  }, [providerId, depth, config]);

  // 空值配置单独打包下发，与官方 emptyValuesContextKey 的独立注入对应
  const emptyValuesContext = useMemo(
    () => ({
      emptyValues: config.emptyValues,
      valueOnClear: config.valueOnClear,
    }),
    [config.emptyValues, config.valueOnClear],
  );

  const content: ReactNode =
    typeof children === "function" ? children(config) : children;

  return (
    <ConfigProviderContextKey.Provider value={config}>
      <LocaleContextKey.Provider value={config.locale}>
        <ZIndexContextKey.Provider value={config.zIndex}>
          <SizeContextKey.Provider value={config.size ?? ""}>
            <EmptyValuesContextKey.Provider value={emptyValuesContext}>
              <ConfigProviderDepthKey.Provider value={depth}>
                {content}
              </ConfigProviderDepthKey.Provider>
            </EmptyValuesContextKey.Provider>
          </SizeContextKey.Provider>
        </ZIndexContextKey.Provider>
      </LocaleContextKey.Provider>
    </ConfigProviderContextKey.Provider>
  );
}

export type { ConfigProviderContext };
