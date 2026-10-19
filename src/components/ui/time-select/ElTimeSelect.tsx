"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { ElIcon } from "../icon/ElIcon";
import { ArrowDown, CircleClose, Clock } from "../icons";
import { ElScrollbar, type ScrollbarExpose } from "../scrollbar";
import { ElPopperContent } from "../popper/ElPopperContent";
import { ElPopperArrow } from "../popper/ElPopperArrow";
import { useFormDisabled, useFormItemInputId, useFormSize } from "../form/use-form";
import { useEmptyValues, useLocale, useTranslator } from "../config-provider/context";
import type { ValueOnClear } from "../config-provider/types";
import type { ComponentSize } from "../button/types";
import type { PopperEffect, PopperPlacement } from "../popper/use-popper";
import {
  DEFAULT_END,
  DEFAULT_START,
  DEFAULT_STEP,
  compareTime,
  escapeRegExp,
  formatWith,
  getValidTimeOrDefault,
  nextTime,
  parseTime,
  formatTime,
} from "./utils";

/** 官方 select 的 MINIMUM_INPUT_WIDTH，输入框最小宽度。 */
const MINIMUM_INPUT_WIDTH = 11;
/** 官方 select-dropdown 用 selectRef.offsetWidth - BORDER_HORIZONTAL_WIDTH 作最小宽度。 */
const BORDER_HORIZONTAL_WIDTH = 2;

export interface TimeSelectOption {
  /** 显示值，即按 format 渲染后的字符串 */
  value: string;
  /** 参与比较的原始 "HH:mm" 值 */
  rawValue: string;
  disabled: boolean;
}

export interface TimeSelectProps {
  /** 绑定值，对应官方 modelValue */
  value?: string | null;
  /** 值变化，对应官方 v-model 的 update:model-value 与 change */
  onChange?: (value: string | null) => void;
  /** 失焦 */
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** 聚焦 */
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** 点击清空图标 */
  onClear?: () => void;
  /** 原生 id，注册给 FormItem 的 label for */
  id?: string;
  /** 同原生 input 的 name */
  name?: string;
  /** 是否禁用 */
  disabled?: boolean;
  /** 输入框是否可编辑（即官方 filterable） */
  editable?: boolean;
  /** 是否可清空 */
  clearable?: boolean;
  /** 尺寸 */
  size?: ComponentSize;
  /** 占位文本，缺省取语言包的 el.select.placeholder */
  placeholder?: string;
  /** 起始时间 */
  start?: string;
  /** 结束时间 */
  end?: string;
  /** 时间步长 */
  step?: string;
  /** 最小可选时间，之前的时间项禁用 */
  minTime?: string | null;
  /** 最大可选时间，之后的时间项禁用 */
  maxTime?: string | null;
  /** 是否把 end 也作为可选项 */
  includeEndTime?: boolean;
  /** 时间格式，支持 dayjs 的 HH/H/hh/h/mm/m/ss/s/A/a 与 [] 字面量 */
  format?: string;
  /** 主题 */
  effect?: PopperEffect;
  /** 前缀图标 */
  prefixIcon?: ReactNode;
  /** 清空图标 */
  clearIcon?: ReactNode;
  /** 下拉的自定义类名 */
  popperClass?: string;
  /** 下拉的自定义样式 */
  popperStyle?: CSSProperties;
  /** 下拉位置 */
  placement?: PopperPlacement;
  /** 空值集合，对应官方 empty-values，缺省取全局配置 */
  emptyValues?: unknown[];
  /** 清空时返回的值，对应官方 value-on-clear，缺省取全局配置 */
  valueOnClear?: ValueOnClear;
  className?: string;
  style?: CSSProperties;
}

/** 对应官方 defineExpose 暴露的实例方法。 */
export interface TimeSelectExpose {
  focus: () => void;
  blur: () => void;
}

/**
 * 对应官方 ElTimeSelect。
 *
 * 官方把时间列表交给 ElSelect（filterable + default-first-option + prefix 插槽）渲染，
 * 这里按官方 2.14 的 el-select DOM 结构直接实现，以便 1:1 复刻：
 *   .el-select > .el-select__wrapper > .el-select__prefix / __selection / __suffix
 *   下拉为 .el-select__popper > .el-select-dropdown > el-scrollbar > __list > __item
 *
 * 与官方一致的点：格式化用同一套 format token；选项禁用由 min-time / max-time 比较得出；
 * 选中项高亮、悬停项背景、键盘上下切换、default-first-option 均按官方行为实现。
 */
export const ElTimeSelect = forwardRef<TimeSelectExpose, TimeSelectProps>(
  function ElTimeSelect(
    {
      value,
      onChange,
      onBlur,
      onFocus,
      onClear,
      id,
      name,
      disabled,
      editable = true,
      clearable = true,
      size,
      placeholder,
      start = DEFAULT_START,
      end = DEFAULT_END,
      step = DEFAULT_STEP,
      minTime,
      maxTime,
      includeEndTime = false,
      format = "HH:mm",
      effect = "light",
      prefixIcon,
      clearIcon,
      popperClass = "",
      popperStyle,
      placement = "bottom-start",
      emptyValues,
      valueOnClear,
      className,
      style,
    },
    ref,
  ) {
    const t = useTranslator();
    const locale = useLocale();

    const selectDisabled = useFormDisabled(disabled);
    const selectSize = useFormSize(size);
    const { inputId } = useFormItemInputId({ id });
    const { valueOnClear: resolvedValueOnClear, isEmptyValue } = useEmptyValues({
      emptyValues,
      valueOnClear,
    });

    const rootRef = useRef<HTMLDivElement>(null);
    // 对应官方 contentId：挂到 listbox 上，供 input 的 aria-controls 引用
    const contentId = useId();
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const calculatorRef = useRef<HTMLSpanElement>(null);
    const scrollbarRef = useRef<ScrollbarExpose>(null);

    // 输入法组合期间不按中间态过滤，对应官方 ElSelect 的 isComposing 保护
    const composingRef = useRef(false);

    const [expanded, setExpanded] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [inputHovering, setInputHovering] = useState(false);
    const [inputValue, setInputValue] = useState("");
    // 实际参与过滤的查询串：输入法组合期间与 inputValue 解耦（官方 previousQuery）
    const [query, setQuery] = useState("");
    const [hoveringIndex, setHoveringIndex] = useState(-1);
    const [calculatorWidth, setCalculatorWidth] = useState(0);
    const [dropdownWidth, setDropdownWidth] = useState("");

    // 语言包的 AM/PM：官方走 dayjs locale 的 meridiem，这里按语言名近似（中文用上午/下午）
    const meridiem = useCallback(
      (hours: number) => {
        const isZh = locale.name.startsWith("zh");
        if (isZh) return hours < 12 ? "上午" : "下午";
        return hours < 12 ? "AM" : "PM";
      },
      [locale.name],
    );

    // 官方 getValidTimeOrDefault 校验 start / end / step（step 不允许为 00:00）
    const resolvedStart = getValidTimeOrDefault(start, "start", DEFAULT_START);
    const resolvedEnd = getValidTimeOrDefault(end, "end", DEFAULT_END);
    const resolvedStep = getValidTimeOrDefault(step, "step", DEFAULT_STEP, false);

    const resolvedMinTime = useMemo(() => {
      const time = parseTime(minTime || "");
      return time ? formatTime(time) : null;
    }, [minTime]);

    const resolvedMaxTime = useMemo(() => {
      const time = parseTime(maxTime || "");
      return time ? formatTime(time) : null;
    }, [maxTime]);

    /** 官方 items computed：从 start 按 step 递增到 end，逐项算出禁用态。 */
    const items = useMemo(() => {
      const result: TimeSelectOption[] = [];
      const push = (rawValue: string) => {
        result.push({
          value: formatWith(rawValue, format, meridiem),
          rawValue,
          disabled:
            compareTime(rawValue, resolvedMinTime || "-1:-1") <= 0 ||
            compareTime(rawValue, resolvedMaxTime || "100:100") >= 0,
        });
      };

      let current = resolvedStart;
      while (compareTime(current, resolvedEnd) <= 0) {
        push(current);
        current = nextTime(current, resolvedStep);
      }
      if (
        includeEndTime &&
        result[result.length - 1]?.rawValue !== resolvedEnd
      ) {
        push(resolvedEnd);
      }
      return result;
    }, [
      format,
      includeEndTime,
      meridiem,
      resolvedEnd,
      resolvedMaxTime,
      resolvedMinTime,
      resolvedStart,
      resolvedStep,
    ]);

    // 对应官方 updateOption：按输入值正则过滤，visible 为 false 的项不渲染
    const visibleFlags = useMemo(() => {
      if (!editable || !query) return items.map(() => true);
      const regexp = new RegExp(escapeRegExp(query), "i");
      return items.map((item) => regexp.test(item.value));
    }, [editable, query, items]);

    const visibleCount = visibleFlags.filter(Boolean).length;

    const hasModelValue = !isEmptyValue(value ?? undefined);
    const selectedLabel = value ?? "";
    const resolvedPlaceholder = placeholder ?? t("el.select.placeholder");

    const showClear =
      clearable &&
      !selectDisabled &&
      hasModelValue &&
      (isFocused || inputHovering);

    const inputStyle: CSSProperties = {
      minWidth: `${Math.max(calculatorWidth, MINIMUM_INPUT_WIDTH)}px`,
    };

    /** 对应官方 scrollToOption：把目标项滚到容器可视区内。 */
    const scrollToOption = useCallback((rawValue?: string) => {
      const container = scrollbarRef.current?.wrapRef.current;
      if (!container) return;
      const selector = rawValue === undefined ? null : `[data-raw="${rawValue}"]`;
      const selected = selector
        ? (container.querySelector(selector) as HTMLElement | null)
        : null;

      if (!selected) {
        container.scrollTop = 0;
        return;
      }

      const offsetParents: HTMLElement[] = [];
      let pointer = selected.offsetParent as HTMLElement | null;
      while (
        pointer !== null &&
        container !== pointer &&
        container.contains(pointer)
      ) {
        offsetParents.push(pointer);
        pointer = pointer.offsetParent as HTMLElement | null;
      }
      const top =
        selected.offsetTop +
        offsetParents.reduce((prev, curr) => prev + curr.offsetTop, 0);
      const bottom = top + selected.offsetHeight;
      const viewRectTop = container.scrollTop;
      const viewRectBottom = viewRectTop + container.clientHeight;

      if (top < viewRectTop) {
        container.scrollTop = top;
      } else if (bottom > viewRectBottom) {
        container.scrollTop = bottom - container.clientHeight;
      }
      // 对应官方 scrollToOption 尾部：直接改 scrollTop 后让滚动条同步
      scrollbarRef.current?.handleScroll();
    }, []);

    /** 对应官方 checkDefaultFirstOption：把悬停项落到第一个可见且未禁用的项。 */
    const checkDefaultFirstOption = useCallback(() => {
      const index = items.findIndex((item, i) => visibleFlags[i] && !item.disabled);
      setHoveringIndex(index);
    }, [items, visibleFlags]);

    // 对应官方 watch([hoveringIndex, optionsArray]) 与 defaultFirstOption 的联动：
    // 打开或过滤条件变化时重设悬停项
    useEffect(() => {
      if (!expanded) return;
      if (visibleCount === 0) {
        setHoveringIndex(-1);
        return;
      }
      // 官方 default-first-option 只在 filterable 时生效；
      // 不可编辑时保持选中项为悬停项（updateHoveringIndex）
      if (!editable) {
        setHoveringIndex(items.findIndex((item) => item.value === value));
        return;
      }
      checkDefaultFirstOption();
    }, [editable, expanded, checkDefaultFirstOption, items, value, visibleCount]);

    // 悬停变化后把该项滚进视野，对应官方 navigateOptions 尾部的 nextTick(scrollToOption)
    useEffect(() => {
      if (!expanded || hoveringIndex < 0) return;
      const item = items[hoveringIndex];
      if (item) scrollToOption(item.rawValue);
    }, [expanded, hoveringIndex, items, scrollToOption]);

    // 输入计算器宽度决定输入框 min-width，对应官方 useCalcInputWidth
    useEffect(() => {
      const el = calculatorRef.current;
      if (!el) return;

      const update = () => setCalculatorWidth(el.getBoundingClientRect().width);
      update();
      const observer = new ResizeObserver(update);
      observer.observe(el);
      return () => observer.disconnect();
    }, [inputValue, expanded]);

    // 下拉最小宽度跟随触发器，对应官方 select-dropdown 的 updateMinWidth
    useEffect(() => {
      const el = rootRef.current;
      if (!el) return;

      const update = () =>
        setDropdownWidth(
          el.offsetWidth ? `${el.offsetWidth - BORDER_HORIZONTAL_WIDTH}px` : "",
        );
      update();
      const observer = new ResizeObserver(update);
      observer.observe(el);
      return () => observer.disconnect();
    }, []);

    const selectOption = useCallback(
      (option: TimeSelectOption) => {
        if (option.disabled) return;
        onChange?.(option.value);
        setExpanded(false);
        setInputValue("");
        setQuery("");
        setHoveringIndex(-1);
        inputRef.current?.focus();
      },
      [onChange],
    );

    const deleteSelected = useCallback(() => {
      const next = (resolvedValueOnClear ?? null) as string | null;
      onChange?.(next);
      setHoveringIndex(-1);
      setExpanded(false);
      onClear?.();
      inputRef.current?.focus();
    }, [onChange, onClear, resolvedValueOnClear]);

    const toggleMenu = useCallback(() => {
      if (selectDisabled) return;
      setExpanded((v) => !v);
    }, [selectDisabled]);

    /** 对应官方 navigateOptions：跳过禁用与不可见项，越界时回绕。 */
    const navigateOptions = useCallback(
      (direction: "prev" | "next") => {
        if (!expanded) {
          setExpanded(true);
          return;
        }
        if (items.length === 0 || visibleCount === 0) return;
        if (items.every((item, i) => !visibleFlags[i] || item.disabled)) return;

        const step = direction === "next" ? 1 : -1;
        let next = hoveringIndex;
        // 最多绕一圈，避免全禁用时死循环
        for (let i = 0; i < items.length; i++) {
          next += step;
          if (next >= items.length) next = 0;
          if (next < 0) next = items.length - 1;
          if (visibleFlags[next] && !items[next].disabled) break;
        }
        setHoveringIndex(next);
      },
      [expanded, hoveringIndex, items, visibleCount, visibleFlags],
    );

    /**
     * 对应官方 focusOption：从 start 出发按 step 方向找第一个可见且未禁用的项，
     * 找不到就反向再找一次；用于 Home / End / PageUp / PageDown。
     */
    const focusOption = useCallback(
      (targetIndex: number, mode: "up" | "down") => {
        if (items.length === 0) return;
        const start = Math.min(Math.max(targetIndex, 0), items.length - 1);
        const direction = mode === "up" ? -1 : 1;

        const find = (from: number, step: number) => {
          for (let i = from; i >= 0 && i < items.length; i += step) {
            if (visibleFlags[i] && !items[i].disabled) return i;
          }
          return null;
        };

        const next = find(start, direction) ?? find(start - direction, -direction);
        if (next !== null) setHoveringIndex(next);
      },
      [items, visibleFlags],
    );

    const handleKeydown = useCallback(
      (event: React.KeyboardEvent<HTMLInputElement>) => {
        switch (event.key) {
          case "ArrowUp":
            event.preventDefault();
            navigateOptions("prev");
            break;
          case "ArrowDown":
            event.preventDefault();
            navigateOptions("next");
            break;
          case "Enter":
            event.preventDefault();
            if (!expanded) {
              toggleMenu();
            } else if (hoveringIndex >= 0 && items[hoveringIndex]) {
              selectOption(items[hoveringIndex]);
            }
            break;
          case "Escape":
            event.preventDefault();
            if (inputValue.length > 0) {
              setInputValue("");
              setQuery("");
            } else {
              setExpanded(false);
            }
            break;
          case "Home":
            if (!expanded) return;
            event.preventDefault();
            checkDefaultFirstOption();
            break;
          case "End": {
            if (!expanded) return;
            event.preventDefault();
            focusOption(items.length - 1, "up");
            break;
          }
          case "PageUp":
            if (!expanded) return;
            event.preventDefault();
            focusOption(hoveringIndex - 10, "up");
            break;
          case "PageDown":
            if (!expanded) return;
            event.preventDefault();
            focusOption(hoveringIndex + 10, "down");
            break;
          default:
            break;
        }
      },
      [
        checkDefaultFirstOption,
        expanded,
        focusOption,
        hoveringIndex,
        inputValue,
        items,
        navigateOptions,
        selectOption,
        toggleMenu,
      ],
    );

    // 官方 useSelect 在 expanded 关闭时清空 inputValue / previousQuery，避免残留过滤词
    useEffect(() => {
      if (expanded) return;
      setInputValue("");
      setQuery("");
    }, [expanded]);

    // 点击外部关闭并失焦，对应官方 v-click-outside + handleClickOutside
    useEffect(() => {
      if (!expanded) return;

      const onDocMousedown = (event: MouseEvent) => {
        const target = event.target as Node;
        if (rootRef.current?.contains(target)) return;
        setExpanded(false);
        if (isFocused) {
          setIsFocused(false);
          inputRef.current?.blur();
        }
      };

      document.addEventListener("mousedown", onDocMousedown);
      return () => document.removeEventListener("mousedown", onDocMousedown);
    }, [expanded, isFocused]);

    useImperativeHandle(
      ref,
      () => ({
        focus: () => inputRef.current?.focus(),
        blur: () => {
          if (expanded) {
            setExpanded(false);
            window.setTimeout(() => inputRef.current?.blur(), 0);
            return;
          }
          inputRef.current?.blur();
        },
      }),
      [expanded],
    );

    const rootClasses = [
      "el-select",
      selectSize && `el-select--${selectSize}`,
      className,
    ]
      .filter(Boolean)
      .join(" ");

    const dropdownClasses = "el-select-dropdown";

    return (
      <div className={rootClasses} ref={rootRef} style={style}>
        <ElPopperContent
          referenceEl={wrapperRef.current}
          placement={placement}
          effect={effect}
          offset={12}
          fallbackPlacements={["bottom-start", "top-start", "right", "left"]}
          popperClass={["el-select__popper", popperClass].filter(Boolean).join(" ")}
          popperStyle={popperStyle}
          pure
          role="tooltip"
          visible={expanded}
          style={{ minWidth: dropdownWidth }}
        >
          <div className={dropdownClasses}>
            <ElScrollbar
              ref={scrollbarRef}
              id={contentId}
              className={visibleCount === 0 ? "is-empty" : undefined}
              tag="ul"
              wrapClass="el-select-dropdown__wrap"
              viewClass="el-select-dropdown__list"
              role="listbox"
              ariaOrientation="vertical"
              // 官方 v-show="states.options.size > 0"，没有任何选项时才隐藏滚动区
              style={items.length > 0 ? undefined : { display: "none" }}
            >
              {items.map((item, index) => {
                if (!visibleFlags[index]) return null;
                return (
                  <li
                    key={item.rawValue}
                    id={`${contentId}-option-${index}`}
                    data-raw={item.rawValue}
                    role="option"
                    aria-disabled={item.disabled || undefined}
                    aria-selected={item.value === value}
                    className={[
                      "el-select-dropdown__item",
                      item.disabled && "is-disabled",
                      item.value === value && "is-selected",
                      index === hoveringIndex && "is-hovering",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onMouseMove={() => {
                      if (!item.disabled) setHoveringIndex(index);
                    }}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={(event) => {
                      event.stopPropagation();
                      selectOption(item);
                    }}
                  >
                    <span>{item.value}</span>
                  </li>
                );
              })}
            </ElScrollbar>

            {visibleCount === 0 && (
              <div className="el-select-dropdown__empty">
                <span>{t("el.select.noData")}</span>
              </div>
            )}
          </div>
          <ElPopperArrow style={{ position: "absolute" }} />
        </ElPopperContent>

        <div
          ref={wrapperRef}
          className={[
            "el-select__wrapper",
            isFocused && "is-focused",
            inputHovering && "is-hovering",
            editable && "is-filterable",
            selectDisabled && "is-disabled",
          ]
            .filter(Boolean)
            .join(" ")}
          onMouseEnter={() => setInputHovering(true)}
          onMouseLeave={() => setInputHovering(false)}
          onClick={(event) => {
            // 点击清空图标时不切换下拉，事件已由图标自身拦截
            if ((event.target as HTMLElement).closest(".el-select__clear")) {
              return;
            }
            toggleMenu();
            if (!editable) inputRef.current?.focus();
          }}
        >
          {prefixIcon !== null && (
            <div className="el-select__prefix">
              <ElIcon className="el-input__prefix-icon">{prefixIcon ?? <Clock />}</ElIcon>
            </div>
          )}

          <div className="el-select__selection">
            <div
              className={[
                "el-select__selected-item",
                "el-select__input-wrapper",
                (!editable || selectDisabled) && "is-hidden",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <input
                id={inputId}
                ref={inputRef}
                className={[
                  "el-select__input",
                  selectSize && `is-${selectSize}`,
                ]
                  .filter(Boolean)
                  .join(" ")}
                value={inputValue}
                name={name}
                type="text"
                disabled={selectDisabled}
                readOnly={!editable}
                tabIndex={0}
                role="combobox"
                autoComplete="off"
                spellCheck={false}
                style={inputStyle}
                aria-expanded={expanded}
                aria-controls={contentId}
                aria-activedescendant={
                  expanded && hoveringIndex >= 0
                    ? `${contentId}-option-${hoveringIndex}`
                    : undefined
                }
                aria-autocomplete="none"
                aria-haspopup="listbox"
                onFocus={(event) => {
                  if (selectDisabled || isFocused) return;
                  setIsFocused(true);
                  onFocus?.(event);
                }}
                onBlur={(event) => {
                  if (
                    selectDisabled ||
                    (event.relatedTarget &&
                      rootRef.current?.contains(event.relatedTarget as Node))
                  ) {
                    return;
                  }
                  setIsFocused(false);
                  setExpanded(false);
                  onBlur?.(event);
                }}
                onChange={(event) => {
                  const nextValue = event.target.value;
                  setInputValue(nextValue);
                  if (composingRef.current) return;
                  setQuery(nextValue);
                  if (nextValue.length > 0) setExpanded(true);
                }}
                onCompositionStart={() => {
                  composingRef.current = true;
                }}
                onCompositionEnd={(event) => {
                  composingRef.current = false;
                  const nextValue = event.currentTarget.value;
                  setInputValue(nextValue);
                  setQuery(nextValue);
                  if (nextValue.length > 0) setExpanded(true);
                }}
                onKeyDown={handleKeydown}
                onClick={(event) => {
                  event.stopPropagation();
                  // 官方 filterable 展开时点击输入框不会收起下拉
                  if (!expanded) toggleMenu();
                }}
              />
              {editable && (
                <span
                  ref={calculatorRef}
                  className="el-select__input-calculator"
                  aria-hidden="true"
                >
                  {inputValue}
                </span>
              )}
            </div>

            <div
              className={[
                "el-select__selected-item",
                "el-select__placeholder",
                (!hasModelValue || (expanded && !inputValue)) && "is-transparent",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span>{hasModelValue ? selectedLabel : resolvedPlaceholder}</span>
            </div>
          </div>

          <div className="el-select__suffix">
            {showClear ? (
              <ElIcon
                className="el-select__caret el-select__clear"
                onClick={(event) => {
                  event.stopPropagation();
                  deleteSelected();
                }}
              >
                {clearIcon ?? <CircleClose />}
              </ElIcon>
            ) : (
              <ElIcon
                className={["el-select__caret", expanded && "is-reverse"]
                  .filter(Boolean)
                  .join(" ")}
              >
                <ArrowDown />
              </ElIcon>
            )}
          </div>
        </div>
      </div>
    );
  },
);
