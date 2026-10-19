import type { CSSProperties, KeyboardEvent, ReactNode, Ref } from "react";
import type { ColorFormats } from "@ctrl/tinycolor";
import type Color from "./color";

export interface ColorPickerPanelProps {
  /** 绑定值，对应官方 model-value */
  value?: string | null;
  /** 是否带边框 */
  border?: boolean;
  /** 是否显示透明度滑块 */
  showAlpha?: boolean;
  /** 绑定值的颜色格式 */
  colorFormat?: ColorFormats;
  disabled?: boolean;
  /** 预定义颜色 */
  predefine?: string[];
  validateEvent?: boolean;
  /** 透传给色相滑块的类名 */
  hueSliderClass?: string;
  /** 透传给色相滑块的样式 */
  hueSliderStyle?: CSSProperties;
  /** 面板底部自定义内容，对应官方 footer 插槽 */
  footer?: ReactNode;
  className?: string;
  style?: CSSProperties;
  onChange?: (value: string | null) => void;
  onKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void;
  ref?: Ref<ColorPickerPanelExpose>;
}

export interface ColorPickerPanelExpose {
  /** 当前颜色对象 */
  color: Color;
  /** 底部输入框的原生 input */
  inputRef: HTMLInputElement | null;
  /** 手动刷新子组件 */
  update: () => void;
}
