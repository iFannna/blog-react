import { useCallback, useRef, type Dispatch, type SetStateAction } from "react";

import type { SelectV2Option, SelectV2OptionType } from "./types";

interface AllowCreateOptions {
  allowCreate?: boolean;
  filterable?: boolean;
  multiple?: boolean;
  reserveKeyword?: boolean;
  options: SelectV2OptionType[];
  createdOptions: SelectV2Option[];
  setCreatedOptions: Dispatch<SetStateAction<SelectV2Option[]>>;
  previousQuery: string | null;
  inputValue: string;
  getLabel: (option: SelectV2Option) => string | number | undefined;
  getValue: (option: SelectV2Option) => unknown;
  aliasProps: { label: string; value: string; disabled: string };
}

/**
 * 官方 useAllowCreate 的 React 版。
 *
 * createdOptions 由外部 state 持有，这里只负责计数与增删，
 * 计数用于区分「已确认创建」与「正在输入中的临时项」。
 */
export function useAllowCreate({
  allowCreate,
  filterable,
  multiple,
  reserveKeyword = true,
  options,
  createdOptions,
  setCreatedOptions,
  previousQuery,
  inputValue,
  getLabel,
  getValue,
  aliasProps,
}: AllowCreateOptions) {
  const createOptionCountRef = useRef(0);
  const cachedSelectedOptionRef = useRef<SelectV2Option | undefined>(undefined);

  const enabled = Boolean(allowCreate && filterable);

  const hasExistingOption = useCallback(
    (query: string) => {
      const match = (option: SelectV2Option) => getLabel(option) === query;
      return options.some(match) || createdOptions.some(match);
    },
    [options, createdOptions, getLabel],
  );

  const selectNewOption = useCallback(
    (option: SelectV2Option) => {
      if (!enabled) return;
      if (multiple && option.created) createOptionCountRef.current += 1;
      else cachedSelectedOptionRef.current = option;
    },
    [enabled, multiple],
  );

  const createNewOption = useCallback(
    (query: string) => {
      if (!enabled) return;

      if (query && query.length > 0) {
        if (hasExistingOption(query)) {
          setCreatedOptions((prev) =>
            prev.filter((item) => getLabel(item) !== previousQuery),
          );
          return;
        }

        const newOption: SelectV2Option = {
          [aliasProps.value]: query,
          [aliasProps.label]: query,
          created: true,
          [aliasProps.disabled]: false,
        };

        setCreatedOptions((prev) => {
          const next = prev.slice();
          if (next.length >= createOptionCountRef.current) {
            next[createOptionCountRef.current] = newOption;
          } else {
            next.push(newOption);
          }
          return next;
        });
        return;
      }

      if (multiple) {
        setCreatedOptions((prev) =>
          prev.length === createOptionCountRef.current
            ? prev
            : prev.slice(0, createOptionCountRef.current),
        );
        return;
      }

      const selectedOption = cachedSelectedOptionRef.current;
      setCreatedOptions(
        selectedOption?.created
          ? [{ ...selectedOption }]
          : (prev) => (prev.length === 0 ? prev : []),
      );
    },
    [
      enabled,
      hasExistingOption,
      multiple,
      previousQuery,
      getLabel,
      aliasProps.value,
      aliasProps.label,
      aliasProps.disabled,
      setCreatedOptions,
    ],
  );

  const removeNewOption = useCallback(
    (option?: SelectV2Option) => {
      if (
        !enabled ||
        !option ||
        !option.created ||
        (option.created && reserveKeyword && inputValue === getLabel(option))
      ) {
        return;
      }

      const index = createdOptions.findIndex(
        (item) => getValue(item) === getValue(option),
      );
      if (index > -1) {
        setCreatedOptions((prev) => prev.filter((_, i) => i !== index));
        createOptionCountRef.current -= 1;
      }
    },
    [
      enabled,
      reserveKeyword,
      inputValue,
      createdOptions,
      getValue,
      getLabel,
      setCreatedOptions,
    ],
  );

  const clearAllNewOption = useCallback(() => {
    if (!enabled) return;
    createOptionCountRef.current = 0;
    cachedSelectedOptionRef.current = undefined;
    setCreatedOptions((prev) => (prev.length === 0 ? prev : []));
  }, [enabled, setCreatedOptions]);

  return {
    createNewOption,
    removeNewOption,
    selectNewOption,
    clearAllNewOption,
  };
}
