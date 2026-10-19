import type { CSSProperties, FocusEvent, ReactNode, Ref } from "react";

import type { ComponentSize } from "../button/types";
import type { ValueOnClear } from "../config-provider/types";
import type { PopperEffect, PopperPlacement } from "../popper/use-popper";
import type { TagEffect, TagType } from "../tag/ElTag";
import type Node from "../cascader-panel/node";
import type {
  CascaderNodePathValue,
  CascaderNodeValue,
  CascaderOption,
  CascaderPanelHandle,
  CascaderPropsConfig,
  CascaderValue,
  RenderLabel,
  Tag,
} from "../cascader-panel/types";

/** 对应官方 cascaderProps 的上层属性（含面板公共属性）。 */
export interface CascaderProps {
  /** 选中值，对应官方 model-value */
  value?: CascaderValue | null;
  options?: CascaderOption[];
  /** 节点字段与交互配置，对应官方 props */
  props?: CascaderPropsConfig;
  size?: ComponentSize;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  clearIcon?: ReactNode;
  filterable?: boolean;
  filterMethod?: (node: Node, keyword: string) => boolean;
  separator?: string;
  showAllLevels?: boolean;
  collapseTags?: boolean;
  maxCollapseTags?: number;
  collapseTagsTooltip?: boolean;
  maxCollapseTagsTooltipHeight?: string | number;
  /** 输入过滤的防抖时间（ms） */
  debounce?: number;
  /** 过滤前钩子，返回 false 或 reject 时中止过滤 */
  beforeFilter?: (value: string) => boolean | Promise<unknown>;
  placement?: PopperPlacement;
  fallbackPlacements?: PopperPlacement[];
  popperClass?: string;
  popperStyle?: CSSProperties;
  teleported?: boolean;
  effect?: PopperEffect;
  tagType?: TagType;
  tagEffect?: TagEffect;
  validateEvent?: boolean;
  persistent?: boolean;
  /** multiple 模式下标签取父节点还是叶子节点 */
  showCheckedStrategy?: "parent" | "child";
  checkOnClickNode?: boolean;
  showPrefix?: boolean;
  /** 建议面板宽度是否与输入框一致；数字表示固定宽度 */
  fitInputWidth?: boolean | number;
  virtualScroll?: boolean;
  itemSize?: number;
  height?: number;
  emptyValues?: unknown[];
  valueOnClear?: ValueOnClear;
  /** 自定义节点文本，对应官方默认插槽 */
  renderLabel?: RenderLabel;
  /** 无数据占位，对应官方 empty 插槽 */
  empty?: ReactNode;
  /** 输入框前缀，对应官方 prefix 插槽 */
  prefix?: ReactNode;
  /** 自定义标签列表，对应官方 tag 插槽 */
  renderTag?: (params: { data: Tag[]; deleteTag: (tag: Tag) => void }) => ReactNode;
  /** 自定义搜索建议项，对应官方 suggestion-item 插槽 */
  renderSuggestionItem?: (params: { item: Node }) => ReactNode;
  /** 下拉头部，对应官方 header 插槽 */
  header?: ReactNode;
  /** 下拉底部，对应官方 footer 插槽 */
  footer?: ReactNode;
  id?: string;
  className?: string;
  style?: CSSProperties;
  onChange?: (value: CascaderValue) => void;
  onVisibleChange?: (visible: boolean) => void;
  onExpandChange?: (value: CascaderValue) => void;
  onRemoveTag?: (
    value: CascaderNodeValue | CascaderNodePathValue | undefined,
  ) => void;
  onClear?: () => void;
  onFocus?: (event: FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: FocusEvent<HTMLInputElement>) => void;
  ref?: Ref<CascaderExpose>;
}

export interface CascaderExpose {
  getCheckedNodes: (leafOnly?: boolean) => Node[];
  panelRef: CascaderPanelHandle | null;
  togglePopperVisible: (visible?: boolean) => void;
  contentRef: HTMLDivElement | null;
  presentText: string;
  focus: () => void;
  blur: () => void;
}
