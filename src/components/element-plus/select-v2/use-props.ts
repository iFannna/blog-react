import { get } from "../utils";
import { defaultOptionProps } from "./defaults";

import type { SelectV2Option, SelectV2OptionProps } from "./types";

/** 官方 useProps：按别名从选项对象上取值。 */
export function useOptionProps(optionProps?: SelectV2OptionProps) {
  const aliasProps = { ...defaultOptionProps, ...optionProps };

  return {
    aliasProps,
    getLabel: (option: SelectV2Option) =>
      get(option, aliasProps.label) as string | number | undefined,
    getValue: (option: SelectV2Option) => get(option, aliasProps.value),
    getDisabled: (option: SelectV2Option) => Boolean(get(option, aliasProps.disabled)),
    getOptions: (option: SelectV2Option) => get(option, aliasProps.options),
  };
}
