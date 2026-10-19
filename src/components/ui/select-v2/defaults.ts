import type { SelectV2OptionProps } from "./types";

/** 官方 defaultProps，选项字段别名的缺省值。 */
export const defaultOptionProps: Required<SelectV2OptionProps> = {
  label: "label",
  value: "value",
  disabled: "disabled",
  options: "options",
};

/** 官方 MINIMUM_INPUT_WIDTH，过滤输入框的最小宽度。 */
export const MINIMUM_INPUT_WIDTH = 11;

/** 官方 BORDER_HORIZONTAL_WIDTH，下拉宽度需要刨掉左右边框。 */
export const BORDER_HORIZONTAL_WIDTH = 2;
