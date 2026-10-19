import type { CSSProperties, MouseEvent as ReactMouseEvent, ReactNode } from "react";

import type { ComponentSize } from "../button/types";
import type { PopperEffect, PopperPlacement } from "../popper/use-popper";
import type { TagEffect, TagType } from "../tag";
import type { ValueOnClear } from "../config-provider/types";

/** 官方 OptionCommon，允许任意业务字段。 */
export type SelectOptionCommon = Record<string, unknown>;

export interface SelectOption extends SelectOptionCommon {
  /** 由 allow-create 生成的临时选项 */
  created?: boolean;
}

export type SelectOptionGroup = SelectOptionCommon;

export type SelectOptionType = SelectOption | SelectOptionGroup;

/** 官方 useProps 的 props 别名配置。 */
export interface SelectOptionProps {
  label?: string;
  value?: string;
  disabled?: string;
  options?: string;
}

export type SelectValue =
  | string
  | number
  | boolean
  | Record<string, unknown>
  | unknown[]
  | null
  | undefined;

/** 对应官方 TagTooltipProps。 */
export interface SelectTagTooltipProps {
  appendTo?: string | HTMLElement;
  placement?: PopperPlacement;
  fallbackPlacements?: PopperPlacement[];
  effect?: PopperEffect;
  popperClass?: string;
  popperStyle?: CSSProperties;
  teleported?: boolean;
  showAfter?: number;
  hideAfter?: number;
  autoClose?: number;
  offset?: number;
}

export interface SelectOptionRenderParams {
  item: SelectOptionType;
  index: number;
  disabled: boolean;
}

export interface SelectLabelRenderParams {
  index: number;
  label: unknown;
  value: unknown;
}

export interface SelectTagRenderParams {
  data: SelectOption[];
  selectDisabled: boolean;
  deleteTag: (event: ReactMouseEvent, option: SelectOption) => void;
}

export interface SelectProps {
  /** 绑定值，对应官方 model-value */
  value?: SelectValue;
  /** 选项数据 */
  options: SelectOptionType[];
  /** 选项字段别名 */
  props?: SelectOptionProps;
  /**
   * 值变化时触发。参数放宽为 unknown：单选/多选/对象值共用同一回调类型，
   * 调用方按自己的 value 形态收窄即可。
   */
  onChange?(value: unknown): void;
  /** 是否多选 */
  multiple?: boolean;
  /** 是否禁用 */
  disabled?: boolean;
  /** 对象值作为唯一标识的字段名 */
  valueKey?: string;
  /** 尺寸 */
  size?: ComponentSize;
  /** 是否可清空 */
  clearable?: boolean;
  /** 自定义清空图标 */
  clearIcon?: ReactNode;
  /** 多选时是否折叠标签 */
  collapseTags?: boolean;
  /** 折叠标签是否在悬停时展示全部 */
  collapseTagsTooltip?: boolean;
  /** 折叠标签浮层配置 */
  tagTooltip?: SelectTagTooltipProps;
  /** 折叠时最多展示的标签数 */
  maxCollapseTags?: number;
  /** 多选可选数量上限，0 表示不限 */
  multipleLimit?: number;
  /** 原生 input id */
  id?: string;
  /** 原生 input name */
  name?: string;
  /** 浮层主题 */
  effect?: PopperEffect;
  /** 原生 autocomplete */
  autocomplete?: "none" | "both" | "list" | "inline";
  /** 非过滤模式下聚焦是否自动展开 */
  automaticDropdown?: boolean;
  /** 占位文本 */
  placeholder?: string;
  /** 是否可过滤 */
  filterable?: boolean;
  /** 是否允许创建新选项 */
  allowCreate?: boolean;
  /** 自定义过滤方法 */
  filterMethod?: (query: string) => void;
  /** 是否正在远程加载 */
  loading?: boolean;
  /** 加载中文案 */
  loadingText?: string;
  /** 过滤后是否保留关键词 */
  reserveKeyword?: boolean;
  /** 回车是否选中第一个匹配项 */
  defaultFirstOption?: boolean;
  /** 无匹配项文案 */
  noMatchText?: string;
  /** 无数据文案 */
  noDataText?: string;
  /** 浮层类名 */
  popperClass?: string;
  /** 浮层样式 */
  popperStyle?: CSSProperties;
  /** 浮层是否 teleport */
  teleported?: boolean;
  /** 浮层挂载目标 */
  appendTo?: string | HTMLElement;
  /** 浮层关闭后是否保留 DOM */
  persistent?: boolean;
  /** 是否远程搜索 */
  remote?: boolean;
  /** 远程搜索防抖时长（毫秒） */
  debounce?: number;
  /** 是否总是显示滚动条 */
  scrollbarAlwaysOn?: boolean;
  /** 是否触发表单校验 */
  validateEvent?: boolean;
  /** 下拉与输入框的间距 */
  offset?: number;
  /** 远程搜索时是否展示后缀图标 */
  remoteShowSuffix?: boolean;
  /** 是否显示下拉箭头 */
  showArrow?: boolean;
  /** 下拉位置 */
  placement?: PopperPlacement;
  /** 下拉翻转兜底位置 */
  fallbackPlacements?: PopperPlacement[];
  /** 标签类型 */
  tagType?: TagType;
  /** 标签主题 */
  tagEffect?: TagEffect;
  /** 原生 input tabindex */
  tabindex?: string | number;
  /** 下拉宽度：是否与输入框一致，或固定数值 */
  fitInputWidth?: boolean | number;
  /** 自定义后缀图标 */
  suffixIcon?: ReactNode;
  /** 下拉面板高度 */
  height?: number;
  /** 每一项高度 */
  itemHeight?: number;
  /** 动态行高的估算值，传入后启用动态尺寸列表 */
  estimatedOptionHeight?: number;
  /** 远程搜索方法 */
  remoteMethod?: (query: string) => void;
  /** 空值集合 */
  emptyValues?: unknown[];
  /** 清空后的返回值 */
  valueOnClear?: ValueOnClear;
  /** 无障碍标签 */
  ariaLabel?: string;
  /** 是否显示下拉 */
  onVisibleChange?: (visible: boolean) => void;
  /** 移除标签 */
  onRemoveTag?: (value: unknown) => void;
  /** 清空 */
  onClear?: () => void;
  /** 聚焦 */
  onFocus?: (event: React.FocusEvent<HTMLElement>) => void;
  /** 失焦 */
  onBlur?: (event: React.FocusEvent<HTMLElement>) => void;
  /** 滚动到边界 */
  onEndReached?: (direction: "top" | "bottom" | "left" | "right") => void;
  /** 选项渲染器，对应官方默认插槽 */
  children?: (params: SelectOptionRenderParams) => ReactNode;
  /** 下拉头部 */
  header?: ReactNode;
  /** 下拉底部 */
  footer?: ReactNode;
  /** 空数据内容 */
  empty?: ReactNode;
  /** 加载中内容 */
  loadingSlot?: ReactNode;
  /** 输入框前缀 */
  prefix?: ReactNode;
  /** 自定义标签 */
  tag?: (params: SelectTagRenderParams) => ReactNode;
  /** 自定义标签与选中值文案 */
  label?: (params: SelectLabelRenderParams) => ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface SelectExpose {
  focus: () => void;
  blur: () => void;
  /** 滚动到指定选项，对应官方 expose 的 scrollTo */
  scrollTo: (index: number) => void;
  /** 当前选中项文案，多选返回数组 */
  selectedLabel: string | string[];
}
