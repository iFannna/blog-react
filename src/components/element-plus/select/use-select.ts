"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import { useEmptyValues, useTranslator } from "../config-provider/context";
import {
  useFormDisabled,
  useFormItem,
  useFormItemInputId,
  useFormSize,
} from "../form/use-form";
import { findLastIndex, get, isEqual, isEmpty, isObject } from "../utils";

import { MINIMUM_INPUT_WIDTH } from "./defaults";
import { useAllowCreate } from "./use-allow-create";
import { useOptionProps } from "./use-props";

import type { FocusEvent as ReactFocusEvent } from "react";
import type { ComponentSize } from "../button/types";
import type { EndReachedDirection } from "../virtual-list";
import type { SelectDropdownHandle } from "./SelectDropdown";
import type {
  SelectOption,
  SelectOptionType,
  SelectProps,
  SelectValue,
} from "./types";

const NOOP = () => {};

/** 与官方 escapeStringRegexp 对齐，过滤时按字面量匹配。 */
function escapeStringRegexp(value: string) {
  return value
    .replace(/[|\\{}()[\]^$+*?.]/g, "\\$&")
    .replace(/-/g, "\\x2d");
}

/**
 * ElSelect 的核心状态与交互，对应官方 useSelect。
 *
 * 与 Vue 版的差异：
 * - cachedOptions / selectedLabel 由 modelValue + 选项派生，避免两处状态不同步；
 * - 展开态的副作用（清空输入、重置查询）收敛到 openMenu / closeMenu，
 *   不使用 watch，以免 React 中出现级联渲染。
 */
export function useSelect(props: SelectProps) {
  const {
    value,
    options = [],
    multiple = false,
    disabled,
    valueKey = "value",
    size,
    clearable = false,
    collapseTags = false,
    maxCollapseTags = 1,
    multipleLimit = 0,
    id,
    effect = "light",
    autocomplete = "none",
    automaticDropdown = false,
    placeholder,
    filterable = false,
    allowCreate = false,
    filterMethod,
    loading = false,
    loadingText,
    reserveKeyword = true,
    defaultFirstOption = false,
    noMatchText,
    noDataText,
    teleported = true,
    persistent = true,
    remote = false,
    debounce = 300,
    scrollbarAlwaysOn = false,
    validateEvent = true,
    remoteShowSuffix = false,
    placement = "bottom-start",
    fallbackPlacements,
    tagType = "info",
    tagEffect = "light",
    tabindex = 0,
    fitInputWidth = true,
    height = 274,
    itemHeight = 34,
    estimatedOptionHeight,
    remoteMethod,
    emptyValues,
    valueOnClear,
    ariaLabel,
    onChange,
    onVisibleChange,
    onRemoveTag,
    onClear,
    onFocus,
    onBlur,
    onEndReached,
    props: optionProps,
  } = props;

  const t = useTranslator();
  const { valueOnClear: resolvedValueOnClear, isEmptyValue } = useEmptyValues({
    emptyValues,
    valueOnClear,
  });

  const { form: elForm, formItem: elFormItem } = useFormItem();
  const selectDisabled = useFormDisabled(disabled);
  const selectSize = useFormSize(size);
  const { inputId } = useFormItemInputId({ id, ariaLabel });

  const {
    aliasProps,
    getLabel,
    getValue: getRawValue,
    getDisabled,
    getOptions,
  } = useOptionProps(optionProps);

  // 官方 select 的 value-key 允许把选项对象本身当作值；
  // 数据驱动模式下选项可能没有 value 字段，此时回退为选项对象。
  const getValue = useCallback(
    (option: SelectOption) => {
      const optionValue = getRawValue(option);
      if (
        optionValue === undefined &&
        isObject(option) &&
        !(aliasProps.value in option) &&
        !Array.isArray(getOptions(option))
      ) {
        return option;
      }
      return optionValue;
    },
    [getRawValue, aliasProps.value, getOptions],
  );

  // 回退数组保持引用稳定，否则每次渲染都会让派生 memo 失效
  const emptyArray = useMemo<unknown[]>(() => [], []);
  // 与官方 modelValue computed 一致：数组值只在多选下有效，其余回退为空
  const modelValue: SelectValue = multiple
    ? Array.isArray(value)
      ? value
      : emptyArray
    : Array.isArray(value)
      ? undefined
      : value;

  const [inputValue, setInputValue] = useState("");
  const [createdOptions, setCreatedOptions] = useState<SelectOption[]>([]);
  const [hoveringIndex, setHoveringIndex] = useState(-1);
  const [inputHovering, setInputHovering] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [debouncing, setDebouncing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [previousQuery, setPreviousQuery] = useState<string | null>(null);
  const [popperSize, setPopperSize] = useState(200);
  const [calculatorWidth, setCalculatorWidth] = useState(0);
  const [selectionWidth, setSelectionWidth] = useState(0);
  const [collapseItemWidth, setCollapseItemWidth] = useState(0);
  const [gapWidth, setGapWidth] = useState(6);

  const rootRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const selectionRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const suffixRef = useRef<HTMLDivElement>(null);
  const collapseItemRef = useRef<HTMLDivElement>(null);
  const calculatorRef = useRef<HTMLSpanElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const tagMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<SelectDropdownHandle>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const menuVisibleOnFocusRef = useRef(false);
  const composingRef = useRef(false);
  const previousValueRef = useRef<SelectValue>(modelValue);

  const contentId = useId();

  const getValueKey = useCallback(
    (item: unknown) => (isObject(item) ? get(item, valueKey) : item),
    [valueKey],
  );

  const hasOptions = !loading && (options.length > 0 || createdOptions.length > 0);

  const hasModelValue = multiple
    ? Array.isArray(modelValue) && modelValue.length > 0
    : !isEmptyValue(modelValue);

  const filterOptions = useCallback(
    (query: string): SelectOptionType[] => {
      const regexp = new RegExp(escapeStringRegexp(query), "i");
      const isFilterMethodValid =
        filterable && typeof filterMethod === "function";
      const isRemoteMethodValid =
        filterable && remote && typeof remoteMethod === "function";

      const isValidOption = (option: SelectOption): boolean => {
        if (isFilterMethodValid || isRemoteMethodValid) return true;
        return query
          ? regexp.test(String(getLabel(option) ?? ""))
          : true;
      };

      if (loading) return [];

      const result: SelectOptionType[] = [];

      for (const item of [...createdOptions, ...options]) {
        const children = getOptions(item);
        if (Array.isArray(children)) {
          const filtered = children.filter(isValidOption);
          if (filtered.length > 0) {
            result.push(
              { label: getLabel(item), type: "Group" },
              ...(filtered as SelectOptionType[]),
            );
          }
        } else if (remote || isValidOption(item)) {
          result.push(item);
        }
      }

      return result;
    },
    [
      loading,
      createdOptions,
      options,
      remote,
      filterable,
      filterMethod,
      remoteMethod,
      getLabel,
      getOptions,
    ],
  );

  const allOptions = useMemo(() => filterOptions(""), [filterOptions]);

  const filteredOptions = useMemo(
    () => filterOptions(inputValue),
    [filterOptions, inputValue],
  );

  const allOptionsValueMap = useMemo(() => {
    const map = new Map<unknown, { option: SelectOptionType; index: number }>();
    allOptions.forEach((option, index) => {
      map.set(getValueKey(getValue(option)), { option, index });
    });
    return map;
  }, [allOptions, getValueKey, getValue]);

  const getOption = useCallback(
    (optionValue: unknown): SelectOption => {
      const key = getValueKey(optionValue);
      const found = allOptionsValueMap.get(key);
      if (found) return found.option as SelectOption;

      return {
        [aliasProps.value]: optionValue,
        [aliasProps.label]: optionValue,
      } as SelectOption;
    },
    [allOptionsValueMap, getValueKey, aliasProps.value, aliasProps.label],
  );

  const getIndex = useCallback(
    (option: SelectOption) =>
      allOptionsValueMap.get(getValueKey(getValue(option)))?.index ?? -1,
    [allOptionsValueMap, getValueKey, getValue],
  );

  const cachedOptions = useMemo(
    () =>
      multiple && Array.isArray(modelValue)
        ? modelValue.map((item) => getOption(item))
        : [],
    [multiple, modelValue, getOption],
  );

  const selectedLabel = useMemo(() => {
    if (multiple) return cachedOptions.map((item) => getLabel(item) as string);
    if (!hasModelValue) return "";

    const found = allOptionsValueMap.get(getValueKey(modelValue));
    return found
      ? String(getLabel(found.option) ?? "")
      : String(getValueKey(modelValue) ?? "");
  }, [
    multiple,
    hasModelValue,
    modelValue,
    cachedOptions,
    allOptionsValueMap,
    getValueKey,
    getLabel,
  ]);

  const showTagList = useMemo(() => {
    if (!multiple) return [];
    return collapseTags
      ? cachedOptions.slice(0, maxCollapseTags)
      : cachedOptions;
  }, [multiple, collapseTags, cachedOptions, maxCollapseTags]);

  const collapseTagList = useMemo(() => {
    if (!multiple || !collapseTags) return [];
    return cachedOptions.slice(maxCollapseTags);
  }, [multiple, collapseTags, cachedOptions, maxCollapseTags]);

  const isRemoteSearchEmpty = remote && !inputValue && !hasOptions;

  const dropdownVisible =
    expanded &&
    (loading ||
      !isRemoteSearchEmpty ||
      (remote && props.empty !== undefined)) &&
    (!debouncing || !isEmpty(previousQuery) || hasOptions);

  const popupHeight = useMemo(
    () => Math.min(filteredOptions.length * itemHeight, height),
    [filteredOptions.length, itemHeight, height],
  );

  const emptyText = useMemo(() => {
    if (loading) return loadingText || t("el.select.loading");
    if (
      filterable &&
      inputValue &&
      hasOptions &&
      filteredOptions.length === 0
    ) {
      return noMatchText || t("el.select.noMatch");
    }
    if (!hasOptions) return noDataText || t("el.select.noData");
    return null;
  }, [
    loading,
    loadingText,
    t,
    filterable,
    inputValue,
    hasOptions,
    filteredOptions.length,
    noMatchText,
    noDataText,
  ]);

  const showClearBtn =
    clearable && !selectDisabled && hasModelValue && (isFocused || inputHovering);

  const shouldShowPlaceholder = Array.isArray(modelValue)
    ? modelValue.length === 0 && !inputValue
    : filterable
      ? !inputValue
      : true;

  const currentPlaceholder =
    multiple || !hasModelValue
      ? (placeholder ?? t("el.select.placeholder"))
      : (selectedLabel as string);

  const collapseTagSize: ComponentSize =
    selectSize === "small" ? "small" : "default";

  // 标签最大宽度随选择区尺寸变化，避免多选标签把输入框挤出容器
  const tagStyle = useMemo(() => {
    if (!selectionWidth) return { maxWidth: "100%" };
    const inputSlotWidth = filterable ? gapWidth + MINIMUM_INPUT_WIDTH : 0;
    const maxWidth =
      collapseItemWidth > 0 && maxCollapseTags === 1
        ? selectionWidth -
          collapseItemWidth -
          gapWidth -
          inputSlotWidth
        : selectionWidth - inputSlotWidth;
    return { maxWidth: `${maxWidth}px` };
  }, [
    filterable,
    maxCollapseTags,
    selectionWidth,
    collapseItemWidth,
    gapWidth,
  ]);

  const collapseTagStyle = useMemo(
    () => ({ maxWidth: `${selectionWidth}px` }),
    [selectionWidth],
  );

  const iconReverse = expanded ? "is-reverse" : "";

  const indexRef = useMemo(() => {
    if (multiple) {
      const values = Array.isArray(modelValue) ? modelValue : [];
      if (!values.length) return -1;
      const last = values[values.length - 1];
      return filteredOptions.findIndex(
        (item) => getValueKey(last) === getValueKey(getValue(item)),
      );
    }
    if (isEmptyValue(modelValue)) return -1;
    return filteredOptions.findIndex(
      (item) => getValueKey(modelValue) === getValueKey(getValue(item)),
    );
  }, [multiple, modelValue, filteredOptions, getValueKey, getValue, isEmptyValue]);

  const { createNewOption, removeNewOption, selectNewOption, clearAllNewOption } =
    useAllowCreate({
      allowCreate,
      filterable,
      multiple,
      reserveKeyword,
      options,
      createdOptions,
      setCreatedOptions,
      previousQuery,
      inputValue,
      getLabel,
      getValue,
      aliasProps,
    });

  const getValueIndex = useCallback(
    (list: unknown[] = [], target: unknown) => {
      if (!isObject(target)) return list.indexOf(target);
      let index = -1;
      list.some((item, i) => {
        if (get(item, valueKey) === get(target, valueKey)) {
          index = i;
          return true;
        }
        return false;
      });
      return index;
    },
    [valueKey],
  );

  const updateHovering = useCallback(
    (list: SelectOptionType[]) => {
      if (!multiple) {
        setHoveringIndex(
          list.findIndex(
            (item) => getValueKey(getValue(item)) === getValueKey(modelValue),
          ),
        );
        return;
      }

      const values = Array.isArray(modelValue) ? modelValue : [];
      if (!values.length) {
        setHoveringIndex(-1);
        return;
      }

      const last = values[values.length - 1];
      setHoveringIndex(
        list.findIndex(
          (item) => getValueKey(last) === getValueKey(getValue(item)),
        ),
      );
    },
    [multiple, modelValue, getValueKey, getValue],
  );

  const checkDefaultFirstOption = useCallback(
    (list: SelectOptionType[]) => {
      const candidates = list.filter(
        (item) => !getDisabled(item) && item.type !== "Group",
      );
      const userCreated = candidates.find((item) => item.created);
      const target = userCreated ?? candidates[0];
      setHoveringIndex(target ? list.indexOf(target) : -1);
    },
    [getDisabled],
  );

  const handleQueryChange = useCallback(
    (query: string) => {
      if (previousQuery === query || composingRef.current) return;

      setPreviousQuery(query);

      if (filterable && typeof filterMethod === "function") filterMethod(query);
      else if (filterable && remote && typeof remoteMethod === "function") {
        remoteMethod(query);
      }
      // hover 由 filteredOptions 的渲染后副作用统一计算，
      // 避免闭包拿到创建选项之前的旧列表
    },
    [previousQuery, filterable, filterMethod, remote, remoteMethod],
  );

  const inputChange = useCallback(
    (query: string) => {
      if (query.length > 0 && !expanded) setExpanded(true);
      createNewOption(query);
      handleQueryChange(query);
    },
    [expanded, createNewOption, handleQueryChange],
  );

  const debouncedInputChange = useCallback(
    (query: string) => {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => {
        timerRef.current = null;
        setDebouncing(false);
        inputChange(query);
      }, debounce);
    },
    [debounce, inputChange],
  );

  /**
   * 选项列表变化后重算 hover。放在渲染后的副作用里，
   * 才能看到本次输入创建的临时选项，对应官方的 nextTick(updateHoveringIndex)。
   */
  useEffect(() => {
    if (!expanded) return;
    queueMicrotask(() => {
      if (defaultFirstOption && (filterable || remote)) {
        checkDefaultFirstOption(filteredOptions);
      } else {
        updateHovering(filteredOptions);
      }
    });
  }, [
    expanded,
    filteredOptions,
    defaultFirstOption,
    filterable,
    remote,
    checkDefaultFirstOption,
    updateHovering,
  ]);

  // 过滤结果变化后回到顶部，对应官方对 filteredOptions 的 resetScrollTop
  useEffect(() => {
    queueMicrotask(() => menuRef.current?.resetScrollTop());
  }, [filteredOptions]);

  const closeMenu = useCallback(() => {
    setExpanded(false);
    setInputValue("");
    setPreviousQuery(null);
    createNewOption("");
  }, [createNewOption]);

  const calculateLabelMaxWidth = useCallback(() => {
    if (typeof document === "undefined") return 0;

    const dropdownItemEl =
      popperRef.current?.querySelector<HTMLElement>(".el-select-dropdown__item");
    const ctx = document.createElement("canvas").getContext("2d");
    if (!dropdownItemEl || !ctx) return 0;

    const style = getComputedStyle(dropdownItemEl);
    const padding =
      (Number.parseFloat(style.paddingLeft) || 0) +
      (Number.parseFloat(style.paddingRight) || 0);

    ctx.font = `bold ${style.font.replace(
      new RegExp(`\\b${style.fontWeight}\\b`),
      "",
    )}`;

    const maxWidth = filteredOptions.reduce((max, option) => {
      const metrics = ctx.measureText(String(getLabel(option) ?? ""));
      return Math.max(metrics.width, max);
    }, 0);

    return maxWidth + padding;
  }, [filteredOptions, getLabel]);

  const updatePopperSize = useCallback(() => {
    if (typeof fitInputWidth === "number") {
      setPopperSize(fitInputWidth);
      return;
    }

    const width = rootRef.current?.offsetWidth || 200;

    if (!fitInputWidth && hasOptions) {
      queueMicrotask(() =>
        setPopperSize(Math.max(width, calculateLabelMaxWidth())),
      );
    } else {
      setPopperSize(width);
    }
  }, [fitInputWidth, hasOptions, calculateLabelMaxWidth]);

  const openMenu = useCallback(() => {
    if (!persistent) updatePopperSize();
    setExpanded(true);
    handleQueryChange("");
  }, [persistent, updatePopperSize, handleQueryChange]);

  const toggleMenu = useCallback(
    (event?: { target: EventTarget | null }) => {
      if (selectDisabled) return;
      if (
        filterable &&
        expanded &&
        event &&
        !suffixRef.current?.contains(event.target as Node)
      ) {
        return;
      }

      if (menuVisibleOnFocusRef.current) {
        menuVisibleOnFocusRef.current = false;
        return;
      }

      if (expanded) closeMenu();
      else openMenu();
    },
    [selectDisabled, filterable, expanded, closeMenu, openMenu],
  );

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const blur = useCallback(() => {
    if (expanded) {
      closeMenu();
      queueMicrotask(() => inputRef.current?.blur());
      return;
    }
    inputRef.current?.blur();
  }, [expanded, closeMenu]);

  const onSelect = useCallback(
    (option: SelectOptionType) => {
      const optionValue = getValue(option);

      if (multiple) {
        const values = Array.isArray(modelValue) ? modelValue.slice() : [];
        const index = getValueIndex(values, optionValue);
        let next = values;

        if (index > -1) {
          next = [...values.slice(0, index), ...values.slice(index + 1)];
          removeNewOption(option as SelectOption);
        } else if (multipleLimit <= 0 || values.length < multipleLimit) {
          next = [...values, optionValue];
          selectNewOption(option as SelectOption);
        }

        if (!isEqual(values, next)) onChange?.(next);
        if (option.created) handleQueryChange("");
        if (filterable && (option.created || !reserveKeyword)) {
          setInputValue("");
        }
      } else {
        if (!isEqual(modelValue, optionValue)) {
          onChange?.(optionValue as SelectValue);
        }

        setExpanded(false);
        setInputValue("");
        setPreviousQuery(null);
        selectNewOption(option as SelectOption);
        if (!option.created) {
          clearAllNewOption();
        }
        createNewOption("");
      }

      focus();
    },
    [
      multiple,
      modelValue,
      getValue,
      getValueIndex,
      removeNewOption,
      multipleLimit,
      selectNewOption,
      onChange,
      handleQueryChange,
      filterable,
      reserveKeyword,
      clearAllNewOption,
      createNewOption,
      focus,
    ],
  );

  const deleteTag = useCallback(
    (event: { stopPropagation: () => void }, option: SelectOption) => {
      const values = Array.isArray(modelValue) ? modelValue.slice() : [];
      const index = getValueIndex(values, getValue(option));

      if (index > -1 && !selectDisabled) {
        const next = [
          ...values.slice(0, index),
          ...values.slice(index + 1),
        ];
        removeNewOption(option);
        if (!isEqual(modelValue, next)) onChange?.(next);
        onRemoveTag?.(getValue(option));
      }

      event.stopPropagation();
      focus();
    },
    [
      modelValue,
      getValueIndex,
      getValue,
      selectDisabled,
      removeNewOption,
      onChange,
      onRemoveTag,
      focus,
    ],
  );

  const handleClear = useCallback(() => {
    const emptyValue = Array.isArray(modelValue) ? [] : resolvedValueOnClear;

    setExpanded(false);
    setInputValue("");
    setPreviousQuery(null);
    onChange?.(emptyValue);
    onClear?.();
    clearAllNewOption();
    focus();
  }, [
    modelValue,
    resolvedValueOnClear,
    onChange,
    onClear,
    clearAllNewOption,
    focus,
  ]);

  const handleDel = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (!multiple) return;
      // Vue 的 .delete 修饰符同时覆盖 Delete 与 Backspace，
      // 官方在 Delete 上直接返回，只有 Backspace 会删标签
      if (event.key !== "Backspace") return;
      if (inputValue.length !== 0) return;

      event.preventDefault();
      const values = Array.isArray(modelValue) ? modelValue.slice() : [];
      const lastNotDisabledIndex = findLastIndex(
        values,
        (item) =>
          !cachedOptions.some(
            (option) =>
              getValue(option) === item && getDisabled(option),
          ),
      );
      if (lastNotDisabledIndex < 0) return;

      const removed = values[lastNotDisabledIndex];
      values.splice(lastNotDisabledIndex, 1);
      const option = cachedOptions[lastNotDisabledIndex];
      removeNewOption(option);
      if (!isEqual(modelValue, values)) onChange?.(values);
      onRemoveTag?.(removed);
    },
    [
      multiple,
      inputValue,
      modelValue,
      cachedOptions,
      getValue,
      getDisabled,
      removeNewOption,
      onChange,
      onRemoveTag,
    ],
  );

  const scrollToItem = useCallback((index: number) => {
    menuRef.current?.scrollToItem(index);
  }, []);

  const onKeyboardNavigate = useCallback(
    (direction: "forward" | "backward", startIndex?: number) => {
      const list = filteredOptions;
      if (
        selectDisabled ||
        list.length <= 0 ||
        list.every((item) => getDisabled(item)) ||
        composingRef.current
      ) {
        return;
      }

      if (!expanded) {
        toggleMenu();
        return;
      }

      const navigate = (dir: "forward" | "backward", from: number) => {
        let nextIndex = -1;
        if (dir === "forward") {
          nextIndex = from + 1;
          if (nextIndex >= list.length) nextIndex = 0;
        } else {
          nextIndex = from - 1;
          if (nextIndex < 0 || nextIndex >= list.length) {
            nextIndex = list.length - 1;
          }
        }

        const option = list[nextIndex];
        if (getDisabled(option) || option.type === "Group") {
          return navigate(dir, nextIndex);
        }

        setHoveringIndex(nextIndex);
        scrollToItem(nextIndex);
      };

      navigate(direction, startIndex ?? hoveringIndex);
    },
    [
      filteredOptions,
      selectDisabled,
      getDisabled,
      expanded,
      toggleMenu,
      hoveringIndex,
      scrollToItem,
    ],
  );

  const onKeyboardSelect = useCallback(() => {
    if (!expanded) {
      toggleMenu();
      return;
    }
    if (hoveringIndex > -1 && filteredOptions[hoveringIndex]) {
      onSelect(filteredOptions[hoveringIndex]);
    }
  }, [expanded, toggleMenu, hoveringIndex, filteredOptions, onSelect]);

  const onHoverOption = useCallback((index: number) => {
    setHoveringIndex(index);
  }, []);

  const handleEsc = useCallback(() => {
    if (inputValue.length > 0) setInputValue("");
    else closeMenu();
  }, [inputValue, closeMenu]);

  const handleFocus = useCallback(
    (event: ReactFocusEvent<HTMLElement>) => {
      if (selectDisabled || isFocused) return;

      setIsFocused(true);
      onFocus?.(event);

      if (automaticDropdown && !expanded) {
        menuVisibleOnFocusRef.current = true;
        openMenu();
      }
    },
    [selectDisabled, isFocused, onFocus, automaticDropdown, expanded, openMenu],
  );

  const handleBlur = useCallback(
    (event: ReactFocusEvent<HTMLElement>) => {
      const related = event.relatedTarget as Node | null;
      if (
        related &&
        (wrapperRef.current?.contains(related) ||
          popperRef.current?.contains(related) ||
          tagMenuRef.current?.contains(related))
      ) {
        return;
      }

      setIsFocused(false);
      menuVisibleOnFocusRef.current = false;
      onBlur?.(event);
      if (expanded) closeMenu();
      if (validateEvent) elFormItem?.validate?.("blur").catch(NOOP);
    },
    [onBlur, expanded, closeMenu, validateEvent, elFormItem],
  );

  const resetCalculatorWidth = useCallback(() => {
    setCalculatorWidth(
      calculatorRef.current?.getBoundingClientRect().width ?? 0,
    );
  }, []);

  const resetSelectionWidth = useCallback(() => {
    const el = selectionRef.current;
    if (!el) return;
    setSelectionWidth(Number.parseFloat(getComputedStyle(el).width) || 0);
    setGapWidth(Number.parseFloat(getComputedStyle(el).gap || "6px") || 6);
  }, []);

  const resetCollapseItemWidth = useCallback(() => {
    setCollapseItemWidth(
      collapseItemRef.current?.getBoundingClientRect().width ?? 0,
    );
  }, []);

  const handleEndReached = useCallback(
    (direction: EndReachedDirection) => {
      onEndReached?.(direction);
    },
    [onEndReached],
  );

  // visible-change：展开态可见性变化时通知外部（首次渲染不触发）
  const visibleChangeInitRef = useRef(false);
  useEffect(() => {
    if (!visibleChangeInitRef.current) {
      visibleChangeInitRef.current = true;
      return;
    }
    onVisibleChange?.(dropdownVisible);
  }, [dropdownVisible, onVisibleChange]);

  // 打开时滚动到当前选中项，对应官方 handleMenuEnter。
  // 只在可见性由隐到显时执行，过滤过程中的 index 变化不触发。
  const wasDropdownVisibleRef = useRef(false);
  useEffect(() => {
    const justOpened = dropdownVisible && !wasDropdownVisibleRef.current;
    wasDropdownVisibleRef.current = dropdownVisible;
    if (!justOpened || indexRef < 0) return;
    queueMicrotask(() => menuRef.current?.scrollToItem(indexRef));
  }, [dropdownVisible, indexRef]);

  // 打开后再测量一次，fit-input-width 为 false 时需要读取下拉项的字体
  useEffect(() => {
    if (!expanded) return;
    queueMicrotask(updatePopperSize);
  }, [expanded, updatePopperSize]);

  // 外部值变化触发表单校验
  useEffect(() => {
    const changed = !isEqual(previousValueRef.current, modelValue);
    previousValueRef.current = modelValue;
    if (changed && validateEvent) {
      elFormItem?.validate?.("change").catch(NOOP);
    }
  }, [modelValue, validateEvent, elFormItem]);

  // 点击外部关闭
  useEffect(() => {
    if (!expanded) return;

    const handler = (event: MouseEvent) => {
      const target = event.target as Node;
      if (rootRef.current?.contains(target)) return;
      if (popperRef.current?.contains(target)) return;
      if (tagMenuRef.current?.contains(target)) return;

      closeMenu();
      setIsFocused(false);
      menuVisibleOnFocusRef.current = false;
      onBlur?.(event as unknown as ReactFocusEvent<HTMLElement>);
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [expanded, closeMenu, onBlur]);

  // 卸载时清掉远程搜索的防抖定时器
  useEffect(
    () => () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    },
    [],
  );

  const inputStyle = {
    minWidth: `${Math.max(calculatorWidth, MINIMUM_INPUT_WIDTH)}px`,
  };

  return {
    // 数据
    inputId,
    contentId,
    modelValue,
    cachedOptions,
    filteredOptions,
    allOptions,
    allOptionsValueMap,
    hasOptions,
    hover: hoveringIndex,
    hoverIndex: hoveringIndex,
    inputValue,
    inputStyle,
    emptyText,
    popupHeight,
    popperSize,
    dropdownVisible,
    expanded,
    hasModelValue,
    shouldShowPlaceholder,
    currentPlaceholder,
    selectedLabel,
    showClearBtn,
    showTagList,
    collapseTagList,
    collapseTagSize,
    tagStyle,
    collapseTagStyle,
    iconReverse,
    selectDisabled,
    selectSize,
    isFocused,
    inputHovering,
    tagType,
    tagEffect,
    effect,
    teleported,
    persistent,
    placement,
    fallbackPlacements,
    tabindex,
    autocomplete,
    ariaLabel,
    height,
    itemHeight,
    estimatedOptionHeight,
    scrollbarAlwaysOn,
    multiple,
    multipleLimit,
    valueKey,
    popperClass: props.popperClass,
    popperStyle: props.popperStyle,
    appendTo: props.appendTo,
    showArrow: props.showArrow,
    offset: props.offset,
    fitInputWidth,
    clearIcon: props.clearIcon,
    suffixIcon: props.suffixIcon,
    header: props.header,
    footer: props.footer,
    empty: props.empty,
    loadingSlot: props.loadingSlot,
    prefix: props.prefix,
    tag: props.tag,
    label: props.label,
    renderOption: props.children,
    needStatusIcon: elForm?.statusIcon ?? false,
    validateState: elFormItem?.validateState ?? "",
    iconComponent:
      remote && filterable && !remoteShowSuffix ? null : props.suffixIcon,

    // refs
    rootRef,
    wrapperRef,
    selectionRef,
    inputRef,
    suffixRef,
    collapseItemRef,
    calculatorRef,
    popperRef,
    tagMenuRef,
    menuRef,

    // 方法
    getLabel,
    getValue,
    getDisabled,
    getValueKey,
    getIndex,
    toggleMenu,
    focus,
    blur,
    scrollTo: scrollToItem,
    onSelect,
    deleteTag,
    handleClear,
    handleDel,
    handleEsc,
    onKeyboardNavigate,
    onKeyboardSelect,
    onHover: onHoverOption,
    onInputChange: inputChange,
    debouncedInputChange,
    handleQueryChange,
    handleFocus,
    handleBlur,
    resetCalculatorWidth,
    resetSelectionWidth,
    resetCollapseItemWidth,
    onEndReached: handleEndReached,
    updatePopperSize,
    handleResize: updatePopperSize,
    setInputValue,
    setDebouncing,
    setInputHovering,
    setHoveringIndex,
    setIsFocused,
    registerInput: (node: HTMLInputElement | null) => {
      inputRef.current = node;
    },
    menuVisibleOnFocusRef,
    composingRef,
  };
}
