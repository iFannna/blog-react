import type { ReactNode } from "react";
import type { ComponentSize } from "../button/types";
import type { ButtonType } from "../button/types";
import type { CardShadow } from "../card/ElCard";
import type { LinkType, LinkUnderline } from "../link/ElLink";

/** 对应官方 locale 的 TranslatePair：嵌套的 key -> 文案表。 */
export interface TranslatePair {
  [key: string]: string | string[] | TranslatePair;
}

/** 对应官方 locale/index.ts 的 Language。 */
export interface Language {
  name: string;
  el: TranslatePair;
}

/** 对应官方 use-empty-values 的 ValueOnClear。 */
export type ValueOnClear =
  | string
  | number
  | boolean
  | null
  | (() => string | number | boolean | null | undefined);

/** 对应官方 ButtonConfigContext。 */
export interface ButtonConfigContext {
  type?: ButtonType;
  plain?: boolean;
  text?: boolean;
  round?: boolean;
  dashed?: boolean;
  autoInsertSpace?: boolean;
}

/** 对应官方 CardConfigContext。 */
export interface CardConfigContext {
  shadow?: CardShadow;
}

/** 对应官方 DialogConfigContext。 */
export interface DialogConfigContext {
  alignCenter?: boolean;
  draggable?: boolean;
  overflow?: boolean;
  /**
   * 官方支持字符串（过渡类名）或 Vue 过渡配置对象。
   * React 没有过渡系统，这里只保留字符串，且当前 ElDialog 的过渡类名固定，
   * 该字段仅作为配置透传，不改变动画。
   */
  transition?: string;
}

/** 对应官方 LinkConfigContext。 */
export interface LinkConfigContext {
  type?: LinkType;
  underline?: LinkUnderline;
}

/** 对应官方 MessageConfigContext。 */
export interface MessageConfigContext {
  max?: number;
  grouping?: boolean;
  duration?: number;
  offset?: number;
  showClose?: boolean;
  plain?: boolean;
  placement?: string;
}

/** 对应官方 TableConfigContext；tooltip 相关项依赖 Tooltip 组件。 */
export interface TableConfigContext {
  showOverflowTooltip?: boolean;
  tooltipEffect?: "dark" | "light";
}

/** 对应官方 ExperimentalFeatures，当前官方也是空对象。 */
export type ExperimentalFeatures = Record<string, boolean>;

/** 对应官方 ConfigProviderContext：所有可下发的全局配置。 */
export interface ConfigProviderContext {
  a11y?: boolean;
  locale?: Language;
  size?: ComponentSize;
  button?: ButtonConfigContext;
  card?: CardConfigContext;
  dialog?: DialogConfigContext;
  link?: LinkConfigContext;
  keyboardNavigation?: boolean;
  message?: MessageConfigContext;
  zIndex?: number;
  namespace?: string;
  table?: TableConfigContext;
  experimentalFeatures?: ExperimentalFeatures;
  emptyValues?: unknown[];
  valueOnClear?: ValueOnClear;
}

export interface ConfigProviderProps extends ConfigProviderContext {
  /**
   * 默认插槽。官方插槽会回传合并后的全局配置，
   * 这里等价支持函数子节点 `(config) => ReactNode`。
   */
  children?: ReactNode | ((config: ConfigProviderContext) => ReactNode);
}
