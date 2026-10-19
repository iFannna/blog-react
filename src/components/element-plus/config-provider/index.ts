export { ElConfigProvider } from "./ElConfigProvider";
export {
  useEmptyValues,
  useGlobalConfig,
  useLocale,
  useNamespace,
  useTranslator,
  getGlobalConfig,
  mergeConfig,
  translate,
} from "./use-global-config";
export { en, zhCn } from "./locales";
export { createNamespace, defaultNamespace } from "./namespace";
export type { UseNamespaceReturn } from "./namespace";
export { useZIndex, nextZIndex, defaultInitialZIndex } from "./use-z-index";
export {
  DEFAULT_EMPTY_VALUES,
  DEFAULT_INITIAL_Z_INDEX,
  DEFAULT_NAMESPACE,
  DEFAULT_VALUE_ON_CLEAR,
} from "./constants";
export type {
  ButtonConfigContext,
  CardConfigContext,
  ConfigProviderContext,
  ConfigProviderProps,
  DialogConfigContext,
  ExperimentalFeatures,
  Language,
  LinkConfigContext,
  MessageConfigContext,
  TableConfigContext,
  TranslatePair,
  ValueOnClear,
} from "./types";
