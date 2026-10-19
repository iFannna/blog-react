import type { CSSProperties, FocusEvent, Ref } from "react";
import type { ColorFormats } from "@ctrl/tinycolor";
import type { ComponentSize } from "../button/types";
import type { ValueOnClear } from "../config-provider/types";
import type Color from "../color-picker-panel/color";

export interface ColorPickerProps {
  /** 绑定值，对应官方 model-value */
  value?: string | null;
  /** 组件 id */
  id?: string;
  /** 是否显示透明度滑块 */
  showAlpha?: boolean;
  /** 绑定值的颜色格式 */
  colorFormat?: ColorFormats;
  disabled?: boolean;
  /** 是否显示清空按钮 */
  clearable?: boolean;
  size?: ComponentSize;
  /** 下拉面板自定义类名 */
  popperClass?: string;
  /** 下拉面板自定义样式 */
  popperStyle?: CSSProperties;
  tabindex?: string | number;
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  predefine?: string[];
  validateEvent?: boolean;
  /** 面板不活跃时是否销毁 */
  persistent?: boolean;
  emptyValues?: unknown[];
  valueOnClear?: ValueOnClear;
  ariaLabel?: string;
  className?: string;
  style?: CSSProperties;
  onChange?: (value: string | null) => void;
  onActiveChange?: (value: string | null) => void;
  onFocus?: (event: FocusEvent<HTMLDivElement>) => void;
  onBlur?: (event: FocusEvent<HTMLDivElement>) => void;
  onClear?: () => void;
  ref?: Ref<ColorPickerExpose>;
}

export interface ColorPickerExpose {
  /** 当前颜色对象 */
  color: Color;
  /** 手动打开 */
  show: () => void;
  /** 手动关闭 */
  hide: () => void;
  focus: () => void;
  blur: () => void;
}
