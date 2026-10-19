import type { CSSProperties, ReactNode } from "react";
import type { ComponentSize } from "../button/types";

export type InputModelModifiers = {
  lazy?: true;
  number?: true;
  trim?: true;
};

export type InputAutoSize = { minRows?: number; maxRows?: number } | boolean;

export type InputType =
  | "text"
  | "textarea"
  | "number"
  | "password"
  | "email"
  | "search"
  | "tel"
  | "url"
  | (string & {});

/**
 * 官方 ElInput 的 type 既可为 textarea 也可为任意 input 类型，原生属性靠 v-bind 动态透传，
 * Vue 不做类型检查。React 里 input 与 textarea 的事件类型不兼容（onCopy/onPaste 等），
 * 所以这里取 input 的属性为基准（更常用），textarea 分支在组件内显式断言。
 */
type NativeCommonProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  | "size"
  | "value"
  | "defaultValue"
  | "onChange"
  | "onInput"
  | "onFocus"
  | "onBlur"
  | "onKeyDown"
  | "onMouseEnter"
  | "onMouseLeave"
  | "prefix"
  | "color"
  | "children"
  | "type"
>;

export interface InputProps extends NativeCommonProps {
  size?: ComponentSize;
  /** 绑定值 */
  value?: string | number | null;
  /**
   * 对应官方 modelModifiers（v-model 修饰符）。
   * React 没有修饰符语法，改为显式传对象：{ trim: true } 等。
   */
  modelModifiers?: InputModelModifiers;
  maxlength?: string | number;
  minlength?: string | number;
  type?: InputType;
  /** 对应官方 resize，避免与原生同名属性冲突 */
  resizable?: "none" | "both" | "horizontal" | "vertical";
  autosize?: InputAutoSize;
  formatter?: (value: string) => string;
  parser?: (value: string) => string;
  clearable?: boolean;
  clearIcon?: ReactNode;
  showPassword?: boolean;
  showWordLimit?: boolean;
  wordLimitPosition?: "inside" | "outside";
  suffixIcon?: ReactNode;
  prefixIcon?: ReactNode;
  containerRole?: string;
  validateEvent?: boolean;
  inputStyle?: CSSProperties;
  rows?: number;
  countGraphemes?: (value: string) => number;
  /** 前缀内容，对应官方 prefix 插槽 */
  prefix?: ReactNode;
  /** 后缀内容，对应官方 suffix 插槽 */
  suffix?: ReactNode;
  /** 前置内容，对应官方 prepend 插槽 */
  prepend?: ReactNode;
  /** 后置内容，对应官方 append 插槽 */
  append?: ReactNode;
  /** 密码可见性图标，对应官方 password-icon 插槽，参数为当前是否明文 */
  passwordIcon?: (visible: boolean) => ReactNode;
  /**
   * 原生 input 元素，供 Mention 等组合型组件读取光标与文本值，
   * 对应官方 input 实例的 input 属性。
   */
  inputRef?: (el: HTMLInputElement | null) => void;
  /**
   * 原生 textarea 元素，对应官方 input 实例的 textarea 属性。
   */
  textareaRef?: (el: HTMLTextAreaElement | null) => void;
  /** 值变化，对应官方 v-model 与 input 事件 */
  onChange?: (value: string) => void;
  /** 对应官方 change 事件（失焦或回车时触发） */
  onValueChange?: (value: string, event: Event) => void;
  onClear?: () => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onMouseEnter?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLDivElement>) => void;
  className?: string;
  style?: CSSProperties;
}

/** 对应官方 defineExpose 暴露的实例属性与方法。 */
export interface InputExpose {
  /** 原生 input 元素 */
  input: HTMLInputElement | null;
  /** 原生 textarea 元素 */
  textarea: HTMLTextAreaElement | null;
  /** 原生 input 或 textarea 元素 */
  ref: HTMLInputElement | HTMLTextAreaElement | null;
  /** 应用到 textarea 的样式 */
  textareaStyle: CSSProperties;
  /** 是否处于输入法组合输入中 */
  isComposing: boolean;
  /** 密码是否明文显示 */
  passwordVisible: boolean;
  /** 是否自适应高度 */
  autosize: InputAutoSize;
  focus: () => void;
  blur: () => void;
  select: () => void;
  clear: () => void;
  resizeTextarea: () => void;
}

