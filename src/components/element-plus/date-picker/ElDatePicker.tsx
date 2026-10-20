"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type Ref,
} from "react";

import { useEmptyValues, useLocale } from "../config-provider/context";
import { ElDatePickerPanel } from "../date-picker-panel/ElDatePickerPanel";
import {
  DEFAULT_FORMATS_DATE,
  DEFAULT_FORMATS_DATEPICKER,
} from "../date-picker-panel/constants";
import { formatter, parseDate, valueEquals } from "../date-picker-panel/utils";
import { useFormDisabled, useFormItemInputId, useFormSize } from "../form/use-form";
import { ElIcon } from "../icon/ElIcon";
import { Calendar, CircleClose, Clock } from "../icons";
import { ElInput } from "../input";
import { ElTooltip } from "../tooltip/ElTooltip";

import type { Dayjs } from "../date-picker-panel/dayjs";
import type {
  DateModelType,
  DateModelValue,
  DatePickerExpose,
  DatePickerPanelExpose,
  DatePickerProps,
  DatePickerType,
  DayOrDays,
  UserInput,
} from "../date-picker-panel/types";

/** 官方 handleChange 里的空范围判断：两端都被清空才算整体清空。 */
function isRangeEmptyInput(input: UserInput) {
  return Array.isArray(input) && input.every((item) => item === "");
}

/** 显示值与解析值可能是数组，统一取出第 index 段文本。 */
function pickDisplayPart(
  value: string | string[] | null | undefined,
  index: 0 | 1,
) {
  if (Array.isArray(value)) return value[index] ?? "";
  return value ?? "";
}

/**
 * 对应官方 ElDatePicker（CommonPicker + ElDatePickerPanel）。
 *
 * 与 ElTimePicker 的差异：
 * - 面板自己负责解析绑定值与回写值，选择器只把模型原样交给面板；
 * - change 事件按官方在「面板关闭」时比较 valueOnOpen 后触发，值保持绑定格式
 *   （设置 value-format 时是字符串）；
 * - 范围面板的 handleClear 比单面板多一步复位，因此清空时优先交给面板处理。
 */
export const ElDatePicker = ({
  ref,
  value: modelValue,
  onChange,
  onValueChange,
  type = "date",
  id,
  name,
  format,
  valueFormat,
  dateFormat,
  timeFormat,
  placeholder,
  startPlaceholder,
  endPlaceholder,
  rangeSeparator = "-",
  separator,
  disabled,
  readonly,
  editable = true,
  clearable = true,
  size,
  defaultValue,
  defaultTime,
  disabledDate,
  cellClassName,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  shortcuts,
  arrowControl,
  unlinkPanels,
  singlePanel,
  showNow = true,
  showConfirm = true,
  showFooter = true,
  showWeekNumber,
  automaticDropdown = true,
  validateEvent = true,
  emptyValues,
  valueOnClear,
  ariaLabel,
  tabindex = 0,
  popperClass,
  popperStyle,
  placement = "bottom",
  fallbackPlacements,
  teleported = true,
  appendTo,
  prefixIcon,
  clearIcon,
  onCalendarChange,
  onPanelChange,
  onVisibleChange,
  onFocus,
  onBlur,
  onClear,
  onKeydown,
  className,
  style,
  renderCell,
  sidebar,
  prevMonthIcon,
  nextMonthIcon,
  prevYearIcon,
  nextYearIcon,
}: DatePickerProps & { ref?: Ref<DatePickerExpose> }) => {
  const { name: lang } = useLocale();
  const pickerDisabled = useFormDisabled(disabled);
  const pickerSize = useFormSize(size);
  const { valueOnClear: emptyValueOnClear } = useEmptyValues({
    emptyValues,
    valueOnClear: valueOnClear as never,
  });
  // 官方 CommonPicker 给空值兜底传 null
  const resolvedValueOnClear = (emptyValueOnClear ?? null) as DateModelType | null;

  const isRangeInput = type.includes("range") as boolean;
  const isDatesPicker = type === "dates";
  const isMonthsPicker = type === "months";
  const isYearsPicker = type === "years";
  const isQuartersPicker = type === "quarters";
  // 对应官方 isTimeLikePicker：datetime / datetimerange 用时钟图标
  const isTimeLikePicker = type.includes("time");

  const { inputId } = useFormItemInputId({
    id: isRangeInput ? undefined : (id as string),
    ariaLabel,
  });

  const actualFormat =
    format ?? (DEFAULT_FORMATS_DATEPICKER[type] || DEFAULT_FORMATS_DATE);

  const [pickerVisible, setPickerVisible] = useState(false);
  const [userInput, setUserInput] = useState<UserInput>(null);
  const [focused, setFocused] = useState(false);
  const [hovering, setHovering] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<DatePickerPanelExpose>(null);
  // 打开面板时的值，用于关闭时判断是否真的变化（对应官方 valueOnOpen）
  const valueOnOpenRef = useRef<DateModelValue>(null);
  // 上一帧的面板显隐：只在「打开 → 关闭」时触发 change
  const prevVisibleRef = useRef(false);
  // mousedown 是否落在浮层内：用于忽略「点面板导致输入框失焦」的 blur
  const mousedownInPanelRef = useRef(false);

  const valueIsEmpty = useMemo(() => {
    if (!modelValue) return true;
    if (Array.isArray(modelValue) && !modelValue.filter(Boolean).length) {
      return true;
    }
    return false;
  }, [modelValue]);

  /** 对应官方 parsedValue：仅用于输入框显示文本。 */
  const parsedValue = useMemo<DayOrDays | undefined>(() => {
    if (valueIsEmpty) return undefined;
    if (Array.isArray(modelValue)) {
      const parsed = modelValue.map((item) =>
        parseDate(item as DateModelType, valueFormat, lang),
      );
      if (parsed.some((item) => !item)) {
        return [] as unknown as DayOrDays;
      }
      return parsed as unknown as [Dayjs, Dayjs];
    }
    return parseDate(modelValue as DateModelType, valueFormat, lang);
  }, [modelValue, valueIsEmpty, valueFormat, lang]);

  /** 对应官方 emitInput：格式化后回写绑定值。 */
  const emitInput = useCallback(
    (input: DateModelType | DateModelType[] | null) => {
      if (valueEquals(modelValue, input)) return;
      let formatted: DateModelValue;
      if (Array.isArray(input)) {
        formatted = input.map((item) =>
          formatter(item, valueFormat, lang),
        ) as DateModelValue;
      } else {
        formatted = input
          ? (formatter(input, valueFormat, lang) as DateModelValue)
          : null;
      }
      onChange?.(formatted);
    },
    [modelValue, onChange, valueFormat, lang],
  );

  /** 对应官方 emitChange：只比较关闭时的值与打开时是否一致。 */
  const emitChange = useCallback(
    (value: DateModelValue, isClear?: boolean) => {
      if (isClear || !valueEquals(value, valueOnOpenRef.current)) {
        onValueChange?.(value);
        // 清空后同步快照，避免关闭时再触发一次 change
        if (isClear) valueOnOpenRef.current = value;
      }
    },
    [onValueChange],
  );

  const setVisible = useCallback(
    (next: boolean) => {
      // 关闭时丢弃未提交的手输内容（对应官方 watcher 对 userInput 的复位）
      if (!next) setUserInput(null);
      setPickerVisible(next);
      onVisibleChange?.(next);
    },
    [onVisibleChange],
  );

  const openPicker = useCallback(() => {
    if (!pickerVisible) {
      valueOnOpenRef.current = modelValue ?? null;
    }
    setVisible(true);
  }, [pickerVisible, modelValue, setVisible]);

  /** 对应官方 formatToString。 */
  const formatToString = useCallback(
    (value: DayOrDays | undefined): string | string[] | null => {
      if (!value) return null;
      if (Array.isArray(value)) return value.map((item) => item.format(actualFormat));
      return value.format(actualFormat);
    },
    [actualFormat],
  );

  /** 对应官方 displayValue：手输内容优先，其次格式化后的值。 */
  const displayValue = useMemo<string | [string, string]>(() => {
    const formattedValue = formatToString(parsedValue);
    if (Array.isArray(userInput)) {
      return [
        userInput[0] ?? pickDisplayPart(formattedValue, 0),
        userInput[1] ?? pickDisplayPart(formattedValue, 1),
      ];
    }
    if (userInput !== null) return userInput;
    if (valueIsEmpty) return "";
    if (formattedValue) {
      if (
        isDatesPicker ||
        isMonthsPicker ||
        isYearsPicker ||
        isQuartersPicker
      ) {
        return (formattedValue as string[]).join(", ");
      }
      return formattedValue as string | [string, string];
    }
    return "";
  }, [
    parsedValue,
    userInput,
    valueIsEmpty,
    isDatesPicker,
    isMonthsPicker,
    isYearsPicker,
    isQuartersPicker,
    formatToString,
  ]);

  /** 把手输文本交给面板解析。 */
  const parseUserInputToDayjs = useCallback((input: UserInput) => {
    if (!input) return null;
    return panelRef.current?.parseUserInput(input) ?? null;
  }, []);

  const isValidValue = useCallback(
    (value: DayOrDays) => panelRef.current?.isValidValue(value) ?? false,
    [],
  );

  /** 对应官方 handleChange：失焦 / 回车时提交手输内容。 */
  const handleChange = useCallback(() => {
    const rangeEmpty = isRangeEmptyInput(userInput);

    if (userInput && !rangeEmpty) {
      const value = parseUserInputToDayjs(displayValue);
      if (value) {
        if (isValidValue(value)) {
          if (Array.isArray(value)) {
            emitInput(value.map((item) => item.toDate()));
          } else {
            emitInput(value.toDate());
          }
        }
        setUserInput(null);
      }
    }
    if (userInput === "" || rangeEmpty) {
      emitInput(resolvedValueOnClear);
      emitChange(resolvedValueOnClear, true);
      setUserInput(null);
    }
  }, [
    userInput,
    displayValue,
    parseUserInputToDayjs,
    isValidValue,
    emitInput,
    resolvedValueOnClear,
    emitChange,
  ]);

  /** 关闭时按官方时机触发 change。 */
  useEffect(() => {
    if (!pickerVisible && prevVisibleRef.current) {
      emitChange(modelValue ?? null);
    }
    prevVisibleRef.current = pickerVisible;
  }, [pickerVisible, modelValue, emitChange]);

  const handleFocus = useCallback(
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (pickerDisabled || readonly) return;
      setFocused(true);
      if (automaticDropdown) openPicker();
      onFocus?.(event as React.FocusEvent<HTMLInputElement>);
    },
    [pickerDisabled, readonly, automaticDropdown, openPicker, onFocus],
  );

  /** 对应官方 handleBlur：面板内的 mousedown 不视为失焦。 */
  const handleBlur = useCallback(
    (event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (mousedownInPanelRef.current) {
        mousedownInPanelRef.current = false;
        return;
      }
      setFocused(false);
      handleChange();
      setVisible(false);
      onBlur?.(event as React.FocusEvent<HTMLInputElement>);
    },
    [handleChange, setVisible, onBlur],
  );

  /** 对应官方 onMouseDownInput：点击输入框区域时打开面板。 */
  const onMouseDownInput = useCallback(
    (event: React.MouseEvent) => {
      if (readonly || pickerDisabled) return;
      const target = event.target as HTMLElement;
      if (target?.tagName !== "INPUT" || focused || !automaticDropdown) {
        openPicker();
      }
    },
    [readonly, pickerDisabled, focused, automaticDropdown, openPicker],
  );

  const onMouseEnter = useCallback(() => {
    if (readonly || pickerDisabled) return;
    if (!valueIsEmpty && clearable) setHovering(true);
  }, [readonly, pickerDisabled, valueIsEmpty, clearable]);

  const showClearBtn =
    clearable &&
    !pickerDisabled &&
    !readonly &&
    !valueIsEmpty &&
    (hovering || focused);

  /** 对应官方 onClear：范围面板优先用自己的 handleClear 复位。 */
  const onClearClick = useCallback(
    (event?: React.MouseEvent) => {
      if (readonly || pickerDisabled) return;
      if (showClearBtn) {
        event?.stopPropagation();
        if (isRangeInput && panelRef.current) {
          panelRef.current.handleClear();
        } else {
          emitInput(resolvedValueOnClear);
        }
        emitChange(resolvedValueOnClear, true);
        setVisible(false);
      }
      onClear?.();
    },
    [
      readonly,
      pickerDisabled,
      showClearBtn,
      isRangeInput,
      emitInput,
      resolvedValueOnClear,
      emitChange,
      setVisible,
      onClear,
    ],
  );

  /** 对应官方 handleKeydownInput。 */
  const handleKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (readonly || pickerDisabled) return;
      const code = event.key;
      onKeydown?.(event as React.KeyboardEvent);

      if (code === "Escape") {
        if (pickerVisible) {
          setVisible(false);
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }

      if (code === "ArrowDown") {
        if (pickerVisible) {
          event.preventDefault();
          event.stopPropagation();
        }
        if (!pickerVisible) {
          openPicker();
        }
        // React 没有 nextTick；面板在本次渲染后才会挂载，故放到下一帧聚焦
        requestAnimationFrame(() => panelRef.current?.handleFocusPicker());
        return;
      }

      if (code === "Tab") {
        return;
      }

      if (code === "Enter") {
        if (!pickerVisible) {
          openPicker();
        } else if (
          userInput === null ||
          userInput === "" ||
          isValidValue(parseUserInputToDayjs(displayValue) as DayOrDays)
        ) {
          handleChange();
          setVisible(false);
        }
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      if (userInput) {
        event.stopPropagation();
      }
    },
    [
      readonly,
      pickerDisabled,
      onKeydown,
      pickerVisible,
      setVisible,
      openPicker,
      userInput,
      displayValue,
      isValidValue,
      parseUserInputToDayjs,
      handleChange,
    ],
  );

  const onUserInput = useCallback(
    (input: string) => {
      setUserInput(input);
      if (!pickerVisible) openPicker();
    },
    [pickerVisible, openPicker],
  );

  const onRangeInput = useCallback(
    (index: 0 | 1, raw: string) => {
      setUserInput((prev) =>
        (Array.isArray(prev)
          ? [index === 0 ? raw : (prev[0] ?? null), index === 1 ? raw : (prev[1] ?? null)]
          : [index === 0 ? raw : null, index === 1 ? raw : null]) as [
          string | null,
          string | null,
        ],
      );
      if (!pickerVisible) openPicker();
    },
    [pickerVisible, openPicker],
  );

  /** 对应官方 handleStartChange / handleEndChange。 */
  const handleRangeChange = useCallback(
    (index: 0 | 1, raw: string) => {
      if (!raw) return;
      const parsed = parseDate(raw, actualFormat, lang);
      if (!parsed) return;
      const current = (
        parsedValue && Array.isArray(parsedValue) ? parsedValue : []
      ) as [Dayjs | undefined, Dayjs | undefined];
      const next = (
        index === 0
          ? [parsed, current[1]]
          : [current[0], parsed]
      ) as [Dayjs, Dayjs];
      if (isValidValue(next)) {
        emitInput([next[0].toDate(), next[1].toDate()]);
        setUserInput(null);
      }
    },
    [actualFormat, lang, parsedValue, isValidValue, emitInput],
  );

  // 点击输入框与浮层之外的区域关闭面板（对应官方 onClickOutside）
  useEffect(() => {
    if (!pickerVisible) return;

    const onDocMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const inPanel = !!popperRef.current?.contains(target);
      mousedownInPanelRef.current = inPanel;
      if (inPanel) return;
      if (rootRef.current?.contains(target)) return;
      setVisible(false);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [pickerVisible, setVisible]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => startInputRef.current?.focus(),
      blur: () => {
        startInputRef.current?.blur();
        endInputRef.current?.blur();
      },
      handleOpen: () => openPicker(),
      handleClose: () => setVisible(false),
    }),
    [openPicker, setVisible],
  );

  const triggerIcon = prefixIcon ?? (isTimeLikePicker ? <Clock /> : <Calendar />);

  const singleClasses = [
    "el-date-editor",
    `el-date-editor--${type}`,
    pickerVisible && "is-focus",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const rangeClasses = [
    "el-date-editor",
    `el-date-editor--${type}`,
    "el-input__wrapper",
    pickerDisabled && "is-disabled",
    pickerVisible && "is-active",
    "el-range-editor",
    pickerSize ? `el-range-editor--${pickerSize}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const panel = (
    <div ref={popperRef}>
      <ElDatePickerPanel
        ref={panelRef}
        value={modelValue}
        onChange={(next) => onChange?.(next)}
        onPickerVisibleChange={setVisible}
        type={type as DatePickerType}
        format={actualFormat}
        isDefaultFormat={!format}
        valueFormat={valueFormat}
        dateFormat={dateFormat}
        timeFormat={timeFormat}
        visible={pickerVisible}
        defaultValue={defaultValue}
        defaultTime={defaultTime}
        disabled={pickerDisabled}
        editable={editable}
        border={false}
        clearable={clearable}
        unlinkPanels={unlinkPanels}
        singlePanel={singlePanel}
        showNow={showNow}
        showConfirm={showConfirm}
        showFooter={showFooter}
        showWeekNumber={showWeekNumber}
        arrowControl={arrowControl}
        disabledDate={disabledDate}
        cellClassName={cellClassName}
        disabledHours={disabledHours}
        disabledMinutes={disabledMinutes}
        disabledSeconds={disabledSeconds}
        shortcuts={shortcuts}
        sidebar={sidebar}
        renderCell={renderCell}
        valueOnClear={resolvedValueOnClear}
        prevMonthIcon={prevMonthIcon}
        nextMonthIcon={nextMonthIcon}
        prevYearIcon={prevYearIcon}
        nextYearIcon={nextYearIcon}
        onCalendarChange={onCalendarChange}
        onPanelChange={onPanelChange}
        onClear={onClear}
      />
    </div>
  );

  return (
    // 官方没有额外的选择器外壳；display: contents 只保留 React 的定位节点
    <div ref={rootRef} style={{ display: "contents", ...style }}>
      <ElTooltip
        content={panel}
        placement={placement}
        effect="light"
        // 显隐完全由本组件驱动，避免 Tooltip 的 click 触发与聚焦自动弹出互相打架
        trigger={[] as never}
        visible={pickerVisible}
        showArrow
        pure
        enterable
        hideAfter={0}
        persistent
        popperClass={["el-picker__popper", popperClass]
          .filter(Boolean)
          .join(" ")}
        popperStyle={popperStyle}
        fallbackPlacements={fallbackPlacements}
        teleported={teleported}
        appendTo={appendTo}
      >
        {isRangeInput ? (
          <div
            className={rangeClasses}
            style={style}
            onMouseDown={onMouseDownInput}
            onMouseEnter={onMouseEnter}
            onMouseLeave={() => setHovering(false)}
          >
            <ElIcon className="el-input__icon el-range__icon">
              {triggerIcon}
            </ElIcon>
            <input
              ref={startInputRef}
              id={Array.isArray(id) ? id[0] : undefined}
              name={Array.isArray(name) ? name[0] : (name as string)}
              className="el-range-input"
              placeholder={startPlaceholder}
              disabled={pickerDisabled}
              readOnly={!editable || readonly}
              tabIndex={Number(tabindex)}
              aria-label={ariaLabel}
              autoComplete="off"
              value={displayValue[0] ?? ""}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeydown}
              onInput={(event) =>
                onRangeInput(0, (event.target as HTMLInputElement).value)
              }
              onChange={(event) => handleRangeChange(0, event.target.value)}
            />
            {separator ?? (
              <span className="el-range-separator">{rangeSeparator}</span>
            )}
            <input
              ref={endInputRef}
              id={Array.isArray(id) ? id[1] : undefined}
              name={Array.isArray(name) ? name[1] : undefined}
              className="el-range-input"
              placeholder={endPlaceholder}
              disabled={pickerDisabled}
              readOnly={!editable || readonly}
              tabIndex={Number(tabindex)}
              aria-label={ariaLabel}
              autoComplete="off"
              value={displayValue[1] ?? ""}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeydown}
              onInput={(event) =>
                onRangeInput(1, (event.target as HTMLInputElement).value)
              }
              onChange={(event) => handleRangeChange(1, event.target.value)}
            />
            <ElIcon
              className={[
                "el-input__icon",
                "el-range__close-icon",
                !showClearBtn && "el-range__close-icon--hidden",
              ]
                .filter(Boolean)
                .join(" ")}
              onMouseDown={(event) => event.preventDefault()}
              onClick={onClearClick}
            >
              {clearIcon ?? <CircleClose />}
            </ElIcon>
          </div>
        ) : (
          // Tooltip 的 trigger ref 不能直接指向 ElInput 的 imperative handle；
          // display: contents 让节点不参与布局，避免撑宽或破坏居中
          <div style={{ display: "contents" }}>
            <ElInput
              id={inputId}
              className={singleClasses}
              style={style}
              value={(displayValue as string) ?? ""}
              name={name as string}
              size={size}
              disabled={pickerDisabled}
              placeholder={placeholder}
              readOnly={
                !editable ||
                !!readonly ||
                isDatesPicker ||
                isMonthsPicker ||
                isYearsPicker ||
                isQuartersPicker ||
                type === "week"
              }
              aria-label={ariaLabel}
              tabIndex={Number(tabindex)}
              containerRole="combobox"
              prefix={
                <ElIcon
                  className="el-input__icon"
                  onMouseDown={(event) => {
                    // 官方在图标上 prevent 后手动触发，避免输入框先失焦
                    event.preventDefault();
                    onMouseDownInput(event);
                  }}
                >
                  {triggerIcon}
                </ElIcon>
              }
              suffix={
                showClearBtn ? (
                  <ElIcon
                    className="el-input__icon clear-icon"
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={onClearClick}
                  >
                    {clearIcon ?? <CircleClose />}
                  </ElIcon>
                ) : (
                  // 官方即使没有清空按钮也保留空的 suffix 容器
                  <></>
                )
              }
              onChange={onUserInput}
              onValueChange={() => handleChange()}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeydown}
              onMouseDown={onMouseDownInput}
              onMouseEnter={onMouseEnter}
              onMouseLeave={() => setHovering(false)}
              validateEvent={validateEvent}
            />
          </div>
        )}
      </ElTooltip>
    </div>
  );
};
