import type { ButtonType, ComponentSize } from "../button/types";

export type CheckboxValueType = string | number | boolean;

export interface CheckboxGroupContextValue {
  /** 组内选中值集合 */
  value: CheckboxValueType[];
  /** 选中集合变化 */
  onChange: (value: CheckboxValueType[], event?: Event) => void;
  /** 组级禁用，单个 Checkbox 可再单独覆盖 */
  disabled?: boolean;
  size?: ComponentSize;
  /** 选中数量下限，达到后已选中项不可取消 */
  min?: number;
  /** 选中数量上限，达到后未选中项禁用 */
  max?: number;
  /** button 模式下选中态的背景色 */
  fill?: string;
  /** button 模式下选中态的字体色 */
  textColor?: string;
  /**
   * 组的渲染形态。官方由 group 决定渲染 ElCheckbox 还是 ElCheckboxButton，
   * React 里子元素已经写死在 JSX 中，因此改由子组件读取该字段自行切换。
   */
  type?: "checkbox" | "button";
}

export type { ButtonType, ComponentSize };
