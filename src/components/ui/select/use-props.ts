import { get } from "../utils";
import { defaultOptionProps } from "./defaults";

import type { SelectOption, SelectOptionProps } from "./types";

/** 官方 useProps：按别名从选项对象上取值。 */
export function useOptionProps(optionProps?: SelectOptionProps) {
  const aliasProps = { ...defaultOptionProps, ...optionProps };

  return {
    aliasProps,
    getLabel: (option: SelectOption) =>
      get(option, aliasProps.label) as string | number | undefined,
    getValue: (option: SelectOption) => get(option, aliasProps.value),
    getDisabled: (option: SelectOption) => Boolean(get(option, aliasProps.disabled)),
    getOptions: (option: SelectOption) => get(option, aliasProps.options),
  };
}
