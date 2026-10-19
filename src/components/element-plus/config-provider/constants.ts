/**
 * 与官方各处默认值一一对应的常量。
 * 官方分散在 hooks/use-empty-values、hooks/use-namespace、hooks/use-z-index 中，
 * 这里集中一处，供 ConfigProvider 与其消费方共用。
 */

/** 对应官方 DEFAULT_EMPTY_VALUES（组件视为「空」的值）。 */
export const DEFAULT_EMPTY_VALUES: unknown[] = ["", undefined, null];

/** 对应官方 DEFAULT_VALUE_ON_CLEAR。 */
export const DEFAULT_VALUE_ON_CLEAR = undefined;

/** 对应官方 defaultNamespace。 */
export const DEFAULT_NAMESPACE = "el";

/** 对应官方 defaultInitialZIndex。 */
export const DEFAULT_INITIAL_Z_INDEX = 2000;

/** 对应官方 messageConfig 的初始值（仅 placement）。 */
export const DEFAULT_MESSAGE_PLACEMENT = "top";
