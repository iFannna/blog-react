import { createContext, useContext } from "react";
import type { ComponentSize } from "../button/types";

export type RadioValue = string | number | boolean;

export interface RadioGroupContextValue {
  /** 当前选中值 */
  value: RadioValue | undefined;
  /** 选中值变化 */
  onChange: (value: RadioValue) => void;
  disabled?: boolean;
  size?: ComponentSize;
  /** 原生 name 属性 */
  name?: string;
  /** button 形态下选中态的背景色 */
  fill?: string;
  /** button 形态下选中态的字体色 */
  textColor?: string;
  /**
   * 组的渲染形态。官方由 group 决定渲染 ElRadio 还是 ElRadioButton，
   * React 里子元素已写死在 JSX 中，改由子组件读取该字段自行切换。
   */
  type?: "radio" | "button";
}

export const RadioGroupContext = createContext<RadioGroupContextValue | null>(
  null,
);

export function useRadioGroup() {
  return useContext(RadioGroupContext);
}
