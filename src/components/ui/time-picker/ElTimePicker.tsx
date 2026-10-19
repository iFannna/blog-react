"use client";

import {
  useCallback,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
  type Ref,
} from "react";
import { ElInput } from "../input";
import { ElIcon } from "../icon/ElIcon";
import { ElTooltip } from "../tooltip/ElTooltip";
import { Clock, CircleClose } from "../icons";
import {
  useFormDisabled,
  useFormItemInputId,
  useFormSize,
} from "../form/use-form";
import { useEmptyValues } from "../config-provider/context";
import type { ValueOnClear } from "../config-provider/types";
import type { ComponentSize } from "../button/types";
import type { PopperPlacement } from "../popper/use-popper";
import {
  DEFAULT_FORMATS_TIME,
  Day,
  dayOrDaysToDate,
  formatter,
  isArray,
  parseDate,
  valueEquals,
  type DateInput,
} from "./datetime";
import {
  TimePanel,
  TimeRangePanel,
  getRangeAvailableTime,
  getSingleAvailableTime,
  type TimePanelExpose,
} from "./TimePanel";
import type {
  GetDisabledHours,
  GetDisabledMinutes,
  GetDisabledSeconds,
  ModelValueType,
  UserInput,
} from "./types";

export interface TimePickerProps {
  /** 绑定值。范围模式传长度为 2 的数组 */
  value?: ModelValueType | null;
  /** 绑定值变化，对应官方 v-model（update:modelValue） */
  onChange?: (value: ModelValueType | null) => void;
  /** 对应官方 change 事件：面板关闭且值相对打开时变化后触发，参数为绑定值 */
  onValueChange?: (value: ModelValueType | null) => void;
  /** 原生 id，范围模式传长度为 2 的数组 */
  id?: string | [string, string];
  /** 原生 name */
  name?: string | [string, string];
  /** 是否选择时间范围 */
  isRange?: boolean;
  /** 输入框显示格式 */
  format?: string;
  /** 绑定值格式。省略时绑定值是 Date */
  valueFormat?: string;
  /** 非范围模式的占位文本 */
  placeholder?: string;
  /** 范围模式起始占位文本 */
  startPlaceholder?: string;
  /** 范围模式结束占位文本 */
  endPlaceholder?: string;
  /** 范围分隔符 */
  rangeSeparator?: string;
  disabled?: boolean;
  readonly?: boolean;
  /** 输入框是否可编辑 */
  editable?: boolean;
  /** 是否显示清空按钮 */
  clearable?: boolean;
  size?: ComponentSize;
  /** 是否用箭头按钮选择时间 */
  arrowControl?: boolean;
  /** 自定义前缀图标，缺省为 Clock */
  prefixIcon?: ReactNode;
  /** 自定义清空图标，缺省为 CircleClose */
  clearIcon?: ReactNode;
  /** 浮层自定义类名 */
  popperClass?: string;
  /** 浮层自定义样式 */
  popperStyle?: CSSProperties;
  placement?: PopperPlacement;
  fallbackPlacements?: PopperPlacement[];
  /** 面板默认时间，对应官方 default-value */
  defaultValue?: Date | [Date, Date];
  /** 小时禁用表 */
  disabledHours?: GetDisabledHours;
  /** 分钟禁用表 */
  disabledMinutes?: GetDisabledMinutes;
  /** 秒禁用表 */
  disabledSeconds?: GetDisabledSeconds;
  /** 对应官方 aria-label */
  ariaLabel?: string;
  tabindex?: string | number;
  /** 空值集合，对应官方 empty-values */
  emptyValues?: unknown[];
  /** 清空时返回的值 */
  valueOnClear?: ValueOnClear;
  /** 失焦时未选中值是否自动填入当前时间 */
  saveOnBlur?: boolean;
  /** 聚焦输入框时是否自动弹出面板 */
  automaticDropdown?: boolean;
  /** 是否挂载到 body（本项目的 Popper 统一内联渲染，见 unimplmented 说明） */
  teleported?: boolean;
  /** 面板显隐变化 */
  onVisibleChange?: (visible: boolean) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  /** 点击清空图标 */
  onClear?: () => void;
  className?: string;
  style?: CSSProperties;
}

/** 对应官方 defineExpose 暴露的实例方法。 */
export interface TimePickerExpose {
  focus: () => void;
  blur: () => void;
  handleOpen: () => void;
  handleClose: () => void;
}

/**
 * 对应官方 ElTimePicker（含 TimeRangePicker，靠 isRange 切换）。
 *
 * 结构：触发区 .el-date-editor.el-date-editor--time（范围模式是
 * .el-range-editor.el-date-editor--timerange），浮层 .el-picker__popper 内一块时间面板。
 *
 * 官方靠 Vue watcher 的延迟（visible 变更到 nextTick 才同步给 Tooltip）来避免
 * 「聚焦打开面板后 click 又把面板关掉」。React 没有这种延迟，这里改为
 * 让浮层不与任何触发方式绑定、完全由本组件按官方 picker.vue 的分支逻辑驱动，
 * 面板内的交互改为「mousedown 落在面板内时忽略 blur」。
 */
export const ElTimePicker = ({
  ref,
  value: modelValue,
  onChange,
  onValueChange,
  id,
  name,
  isRange = false,
  format,
  valueFormat,
  placeholder,
  startPlaceholder,
  endPlaceholder,
  rangeSeparator = "-",
  disabled,
  readonly,
  editable = true,
  clearable = true,
  size,
  arrowControl,
  prefixIcon,
  clearIcon,
  popperClass,
  popperStyle,
  placement = "bottom",
  fallbackPlacements,
  defaultValue,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  ariaLabel,
  tabindex = 0,
  emptyValues,
  valueOnClear,
  saveOnBlur = true,
  automaticDropdown = true,
  teleported = true,
  onVisibleChange,
  onFocus,
  onBlur,
  onClear,
  className,
  style,
}: TimePickerProps & { ref?: Ref<TimePickerExpose> }) => {
  const pickerDisabled = useFormDisabled(disabled);
  const pickerSize = useFormSize(size);
  const { valueOnClear: resolvedValueOnClear } = useEmptyValues({
    emptyValues,
    valueOnClear,
  });

  const { inputId } = useFormItemInputId({
    id: isRange ? undefined : (id as string),
    ariaLabel,
  });

  const actualFormat = format ?? DEFAULT_FORMATS_TIME;

  const [pickerVisible, setPickerVisible] = useState(false);
  const [userInput, setUserInput] = useState<UserInput>(null);
  const [focused, setFocused] = useState(false);
  const [hovering, setHovering] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const popperRef = useRef<HTMLDivElement>(null);
  // 范围模式两个输入框的 aria-controls 需要指向浮层
  const panelId = useId();
  const startInputRef = useRef<HTMLInputElement>(null);
  const endInputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<TimePanelExpose>(null);
  // 打开面板时的值，用于判断是否真的变化（对应官方 valueOnOpen）
  const valueOnOpenRef = useRef<ModelValueType | null>(null);
  // 最新一次写回的绑定值：onChange 之后 props 尚未回流时，关闭面板也要能比较
  const latestValueRef = useRef<ModelValueType | null>(modelValue ?? null);
  // 与 pickerVisible 同步的 ref，供事件回调读取而不受闭包过期影响
  const pickerVisibleRef = useRef(false);
  // 清空等场景官方强制发 change，关闭时不再重复比较
  const skipChangeOnCloseRef = useRef(false);
  // 取消（取消按钮 / saveOnBlur 回滚）时要还原的值（对应官方 useOldValue）
  const oldValueRef = useRef<Day | [Day, Day] | null>(null);
  // mousedown 是否落在浮层内：用于忽略「点面板导致输入框失焦」的 blur
  const mousedownInPanelRef = useRef(false);

  const valueIsEmpty = useMemo(() => {
    if (!modelValue) return true;
    if (isArray(modelValue) && !modelValue.filter(Boolean).length) return true;
    return false;
  }, [modelValue]);

  // 外部重置绑定值时同步快照
  useEffect(() => {
    latestValueRef.current = modelValue ?? null;
  }, [modelValue]);

  /** 按 value-format 把 Date 转成绑定值；空值原样返回。 */
  const formatInput = useCallback(
    (input: ModelValueType | null): ModelValueType | null => {
      if (!input) return input;
      if (isArray(input)) {
        return input.map((item) =>
          formatter(item as Date | string | number, valueFormat),
        ) as ModelValueType;
      }
      return formatter(input as Date | string | number, valueFormat) as ModelValueType;
    },
    [valueFormat],
  );

  /**
   * 对应官方 emitInput：格式化后回写绑定值。
   * 返回是否真的抛出以及抛出的值，供事件路径同步 latestValueRef。
   */
  const emitInputValue = useCallback(
    (input: ModelValueType | null) => {
      if (valueEquals(modelValue, input)) {
        return { changed: false, value: input };
      }
      const emitVal = formatInput(input);
      onChange?.(emitVal);
      return { changed: true, value: emitVal };
    },
    [modelValue, onChange, formatInput],
  );

  /** 事件路径使用：立即更新「当前值」，避免父组件回流前关闭面板时比较到旧值。 */
  const emitInput = useCallback(
    (input: ModelValueType | null) => {
      const { changed, value } = emitInputValue(input);
      if (changed) latestValueRef.current = value;
    },
    [emitInputValue],
  );

  /**
   * 对应官方 emitChange：仅在值相对打开面板时发生变化才触发。
   * isClear 为 true 时官方无条件触发（清空按钮 / 输入框清空）。
   */
  const emitChange = useCallback(
    (value: ModelValueType | null, isClear = false) => {
      if (!isClear && valueEquals(value, valueOnOpenRef.current)) return;
      if (isClear) valueOnOpenRef.current = value;
      onValueChange?.(value);
    },
    [onValueChange],
  );

  /** 对应官方 getDefaultValue：单点取 default-value，范围缺省时用 +60 分钟补足。 */
  const getDefaultValue = useCallback((): Day | [Day, Day] => {
    if (isRange) {
      if (isArray(defaultValue)) {
        return defaultValue.map((date) => new Day(date)) as [Day, Day];
      }
      const defaultDay = new Day(defaultValue as DateInput);
      return [defaultDay, defaultDay.add(60, "m")];
    }
    return new Day(defaultValue as DateInput);
  }, [defaultValue, isRange]);

  /**
   * 对应官方 parsedValue：把绑定值解析成面板用的 Day，
   * 再用禁用表把越界时间收敛到可用值；收敛结果与绑定值不同且有值时回写。
   */
  const parsedValue = useMemo((): Day | [Day, Day] => {
    let dayOrDays: Day | [Day, Day];

    if (valueIsEmpty) {
      dayOrDays = getDefaultValue();
    } else if (isArray(modelValue)) {
      dayOrDays = modelValue.map((item) =>
        parseDate(item as DateInput, valueFormat),
      ) as [Day, Day];
    } else {
      dayOrDays = parseDate(modelValue as DateInput, valueFormat) as Day;
    }

    if (isArray(dayOrDays) && dayOrDays.some((day) => !day)) {
      return [] as unknown as [Day, Day];
    }

    const available = isArray(dayOrDays)
      ? getRangeAvailableTime(
          dayOrDays[0],
          dayOrDays[1],
          disabledHours,
          disabledMinutes,
          disabledSeconds,
        )
      : getSingleAvailableTime(
          dayOrDays,
          disabledHours,
          disabledMinutes,
          disabledSeconds,
        );

    const changed = isArray(available)
      ? available.some(
          (day, index) => day.valueOf() !== (dayOrDays as Day[])[index].valueOf(),
        )
      : available.valueOf() !== (dayOrDays as Day).valueOf();

    if (changed) {
      dayOrDays = available;
      // 官方：仅当存在绑定值时回写修正结果，避免空值状态下反复触发 change
      // 这里处在渲染期的 useMemo 内，只抛事件、不写 ref
      if (!valueIsEmpty) emitInputValue(dayOrDaysToDate(available));
    }

    return dayOrDays;
  }, [
    modelValue,
    valueIsEmpty,
    getDefaultValue,
    valueFormat,
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    emitInputValue,
  ]);

  /** 对应官方 formatToString。 */
  const formatToString = useCallback(
    (value: Day | [Day, Day] | null): UserInput => {
      if (!value) return null;
      // 官方对空数组也返回 null（parsedValue 可能被置成 []）
      if (Array.isArray(value) && value.length !== 2) return null;
      const res = isArray(value)
        ? value.map((day) => day.format(actualFormat))
        : value.format(actualFormat);
      return res as UserInput;
    },
    [actualFormat],
  );

  /** 对应官方 displayValue：手输内容优先，其次格式化后的值。 */
  const displayValue: UserInput = useMemo(() => {
    const formattedValue = formatToString(parsedValue);
    if (isArray(userInput)) {
      return [
        userInput[0] ?? formattedValue?.[0] ?? "",
        userInput[1] ?? formattedValue?.[1] ?? "",
      ];
    }
    if (userInput !== null) return userInput;
    if (valueIsEmpty) return "";
    return formattedValue ?? "";
  }, [parsedValue, userInput, valueIsEmpty, formatToString]);

  const setVisible = useCallback(
    (next: boolean) => {
      if (pickerVisibleRef.current === next) return;
      const wasVisible = pickerVisibleRef.current;
      pickerVisibleRef.current = next;
      if (wasVisible && !next) {
        // 对应官方 watch(pickerVisible) 关闭时的 emitChange：
        // 清空路径已强制发过 change，这里跳过避免重复
        if (skipChangeOnCloseRef.current) {
          skipChangeOnCloseRef.current = false;
        } else {
          emitChange(latestValueRef.current);
        }
      }
      setPickerVisible(next);
      onVisibleChange?.(next);
    },
    [emitChange, onVisibleChange],
  );

  const openPicker = useCallback(() => {
    if (!pickerVisibleRef.current) {
      valueOnOpenRef.current = modelValue ?? null;
      // 打开时记下当前解析值，取消时回滚（对应官方 useOldValue 的两个分支）
      oldValueRef.current = valueIsEmpty
        ? null
        : isArray(parsedValue)
          ? ([parsedValue[0], parsedValue[1]] as [Day, Day])
          : parsedValue;
    }
    setVisible(true);
  }, [modelValue, valueIsEmpty, parsedValue, setVisible]);

  /** 对应官方 onPick。 */
  const onPick = useCallback(
    (date: Day | [Day, Day] | null, visible = false) => {
      let result: Date | [Date, Date] | null;
      if (isArray(date)) {
        result = date.map((day) => day.toDate()) as [Date, Date];
      } else {
        result = date ? date.toDate() : date;
      }
      setUserInput(null);
      // 先写回再关闭，关闭时的 change 比较才能看到新值
      emitInput(result);
      setVisible(visible);
    },
    [emitInput, setVisible],
  );

  /** 把手输字符串解析成 Day，对应官方 parseUserInputToDayjs。 */
  const parseUserInputToDay = useCallback(
    (input: UserInput) => {
      if (!input) return null;
      if (isArray(input)) {
        return input.map((item) => parseDate(item as DateInput, actualFormat)) as Day[];
      }
      return parseDate(input as DateInput, actualFormat);
    },
    [actualFormat],
  );

  /**
   * 解析结果是否可用，对应官方 isValidValue：
   * 除有效性外，还要求经可用时间收敛后与输入完全一致（即没有落在禁用项或越界）。
   */
  const isValidParsed = useCallback(
    (parsed: Day | Day[] | null | undefined) => {
      if (!parsed) return false;
      if (isRange) {
        if (
          !isArray(parsed) ||
          parsed.length !== 2 ||
          !parsed.every((day) => day && day.isValid)
        ) {
          return false;
        }
        const [startValue, endValue] = parsed as [Day, Day];
        const [availableStart, availableEnd] = getRangeAvailableTime(
          startValue,
          endValue,
          disabledHours,
          disabledMinutes,
          disabledSeconds,
        );
        return (
          availableStart.valueOf() === startValue.valueOf() &&
          availableEnd.valueOf() === endValue.valueOf()
        );
      }
      if (isArray(parsed) || !parsed.isValid) return false;
      const available = getSingleAvailableTime(
        parsed,
        disabledHours,
        disabledMinutes,
        disabledSeconds,
      );
      return available.valueOf() === parsed.valueOf();
    },
    [isRange, disabledHours, disabledMinutes, disabledSeconds],
  );

  /** 对应官方 handleChange：失焦或回车时提交手输内容。 */
  const handleChange = useCallback(
    (input: UserInput = userInput) => {
      // 官方：save-on-blur 为 false 时不再把输入框内容提交为值
      if (!saveOnBlur) return;

      const isRangeEmpty =
        isArray(input) && (input as (string | null)[]).every((item) => item === "");

      if (input && !isRangeEmpty) {
        const value = parseUserInputToDay(displayValue);
        if (value && isValidParsed(value)) {
          emitInput(dayOrDaysToDate(value as Day | [Day, Day]));
        }
        // 官方即使解析失败也会清空 userInput，让输入框回到绑定值
        setUserInput(null);
      }

      if (input === "" || isRangeEmpty) {
        const clearValue = resolvedValueOnClear as ModelValueType | null;
        emitInput(clearValue);
        emitChange(clearValue, true);
        skipChangeOnCloseRef.current = true;
        setUserInput(null);
      }
    },
    [
      saveOnBlur,
      userInput,
      displayValue,
      parseUserInputToDay,
      isValidParsed,
      emitInput,
      emitChange,
      resolvedValueOnClear,
    ],
  );

  /** 对应官方 handleCancel：回滚到打开前的值。 */
  const handleCancel = useCallback(() => {
    const old = oldValueRef.current;
    if (old) onPick(old, false);
    else setVisible(false);
  }, [onPick, setVisible]);

  const handleFocus = useCallback(
    // 事件元素类型放宽到 input | textarea：ElInput 的 onFocus 声明是二者联合
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
      if (!saveOnBlur && !valueIsEmpty) {
        handleCancel();
      } else {
        handleChange();
      }
      setVisible(false);
      onBlur?.(event as React.FocusEvent<HTMLInputElement>);
    },
    [saveOnBlur, valueIsEmpty, handleCancel, handleChange, setVisible, onBlur],
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

  const showClearBtn =
    clearable &&
    !pickerDisabled &&
    !readonly &&
    !valueIsEmpty &&
    (hovering || focused);

  const onClearClick = useCallback(
    (event: React.MouseEvent) => {
      if (readonly || pickerDisabled) return;
      event.stopPropagation();
      // 官方只有 showClearBtn 为真时才真正清空，但 clear 事件始终抛出
      if (showClearBtn) {
        const clearValue = resolvedValueOnClear as ModelValueType | null;
        emitInput(clearValue);
        emitChange(clearValue, true);
        skipChangeOnCloseRef.current = true;
        setVisible(false);
      }
      onClear?.();
    },
    [
      readonly,
      pickerDisabled,
      showClearBtn,
      emitInput,
      emitChange,
      resolvedValueOnClear,
      setVisible,
      onClear,
    ],
  );

  /** 对应官方 setSelectionRange：把光标定位到输入框对应片段。 */
  const setSelectionRange = useCallback(
    (start: number, end: number, pos?: "min" | "max") => {
      const useEnd = isRange && pos === "max";
      const el = useEnd ? endInputRef.current : startInputRef.current;
      if (!el) return;
      el.setSelectionRange(start, end);
      el.focus();
    },
    [isRange],
  );

  /** 对应官方 handleKeydownInput：Esc / ↓ / Enter 三个分支 + 交给面板的方向键。 */
  const handleKeydown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (readonly || pickerDisabled) return;
      const code = event.key;

      if (code === "Escape") {
        if (pickerVisible) {
          setVisible(false);
          event.preventDefault();
          event.stopPropagation();
        }
        return;
      }

      if (code === "ArrowDown") {
        event.preventDefault();
        event.stopPropagation();
        if (!pickerVisible) {
          openPicker();
          // 官方 await nextTick 后继续把按键交给面板，让首次展开也滚动一格
          window.setTimeout(() => {
            panelRef.current?.handleKeydown({
              key: code,
              preventDefault: () => {},
            } as React.KeyboardEvent);
          }, 0);
          return;
        }
        panelRef.current?.handleKeydown(event as React.KeyboardEvent);
        return;
      }

      if (code === "Enter") {
        if (!pickerVisible) {
          openPicker();
        } else if (
          !userInput ||
          isValidParsed(parseUserInputToDay(displayValue))
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
        return;
      }
      if (pickerVisible) panelRef.current?.handleKeydown(event as React.KeyboardEvent);
    },
    [
      readonly,
      pickerDisabled,
      pickerVisible,
      setVisible,
      openPicker,
      userInput,
      isValidParsed,
      parseUserInputToDay,
      displayValue,
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
      setUserInput((prev) => {
        const next: [string | null, string | null] = isArray(prev)
          ? [prev[0] ?? null, prev[1] ?? null]
          : [null, null];
        next[index] = raw;
        return next;
      });
      if (!pickerVisible) openPicker();
    },
    [pickerVisible, openPicker],
  );

  /** 对应官方 handleStartChange / handleEndChange。 */
  const handleRangeChange = useCallback(
    (index: 0 | 1, raw: string) => {
      if (!raw) return;
      const parsed = parseDate(raw, actualFormat);
      if (!parsed) return;
      const current = parsedValue as [Day, Day];
      const next: [Day, Day] =
        index === 0 ? [parsed, current[1]] : [current[0], parsed];
      // 对应官方 isValidValue：升序且不落在禁用区间才写回
      if (isValidParsed(next)) {
        emitInput(dayOrDaysToDate(next));
        setUserInput(null);
      }
    },
    [actualFormat, parsedValue, isValidParsed, emitInput],
  );

  const singleClasses = [
    "el-date-editor",
    "el-date-editor--time",
    pickerVisible && "is-focus",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const rangeClasses = [
    "el-date-editor",
    "el-date-editor--timerange",
    "el-input__wrapper",
    pickerDisabled && "is-disabled",
    (pickerVisible || focused) && "is-active",
    "el-range-editor",
    pickerSize ? `el-range-editor--${pickerSize}` : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // 点击输入框与浮层之外的区域关闭面板（对应官方 onClickOutside 的 needClose 分支）
  useEffect(() => {
    if (!pickerVisible) return;

    const onDocMouseDown = (event: MouseEvent) => {
      const target = event.target as Node;
      const inPanel = !!popperRef.current?.contains(target);
      mousedownInPanelRef.current = inPanel;
      if (inPanel) {
        // 这次 mousedown 引起的 blur 已在同步阶段消费掉标记；
        // 之后用户再 Tab 离开时应正常关闭面板
        window.setTimeout(() => {
          mousedownInPanelRef.current = false;
        }, 0);
        return;
      }
      if (rootRef.current?.contains(target)) return;
      setVisible(false);
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [pickerVisible, setVisible]);

  const panelNode = pickerVisible ? (
    isRange ? (
      <TimeRangePanel
        ref={panelRef}
        parsedValue={parsedValue as [Day, Day]}
        visible={pickerVisible}
        format={actualFormat}
        arrowControl={arrowControl}
        disabledHours={disabledHours}
        disabledMinutes={disabledMinutes}
        disabledSeconds={disabledSeconds}
        saveOnBlur={saveOnBlur}
        valueIsEmpty={valueIsEmpty}
        valueOnClear={resolvedValueOnClear as DateInput}
        onPick={(next, visible) => onPick(next, visible)}
        onSelectRange={(start, end, pos) => setSelectionRange(start, end, pos)}
      />
    ) : (
      <TimePanel
        ref={panelRef}
        parsedValue={parsedValue as Day}
        visible={pickerVisible}
        format={actualFormat}
        arrowControl={arrowControl}
        disabledHours={disabledHours}
        disabledMinutes={disabledMinutes}
        disabledSeconds={disabledSeconds}
        isRange={isRange}
        saveOnBlur={saveOnBlur}
        valueIsEmpty={valueIsEmpty}
        valueOnClear={resolvedValueOnClear as DateInput}
        onPick={(next, visible) => onPick(next as Day, visible)}
        onSelectRange={(start, end) => setSelectionRange(start, end)}
      />
    )
  ) : null;

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

  return (
    <div ref={rootRef} className="el-time-picker" style={style}>
      <ElTooltip
        content={
          <div ref={popperRef} id={panelId}>
            {panelNode}
          </div>
        }
        placement={placement}
        effect="light"
        role="dialog"
        // 显隐完全由本组件驱动，故不绑定任何触发方式，
        // 避免 Tooltip 的 click 触发与「聚焦自动弹出」互相打架
        trigger={[] as never}
        visible={pickerVisible}
        showArrow
        pure
        enterable
        hideAfter={0}
        popperClass={["el-picker__popper", popperClass]
          .filter(Boolean)
          .join(" ")}
        popperStyle={popperStyle}
        fallbackPlacements={fallbackPlacements}
        teleported={teleported}
      >
        {isRange ? (
          <div
            className={rangeClasses}
            onMouseDown={onMouseDownInput}
            onMouseEnter={() => {
              if (readonly || pickerDisabled) return;
              setHovering(true);
            }}
            onMouseLeave={() => setHovering(false)}
          >
            <ElIcon className="el-input__icon el-range__icon">
              {prefixIcon || <Clock />}
            </ElIcon>
            <input
              ref={startInputRef}
              id={isArray(id) ? id[0] : undefined}
              name={isArray(name) ? name[0] : (name as string)}
              className="el-range-input"
              placeholder={startPlaceholder}
              disabled={pickerDisabled}
              readOnly={!editable || readonly}
              tabIndex={Number(tabindex)}
              aria-label={ariaLabel}
              role="combobox"
              aria-controls={panelId}
              aria-expanded={pickerVisible}
              autoComplete="off"
              value={displayValue?.[0] ?? ""}
              onFocus={handleFocus}
              onBlur={handleBlur}
              onKeyDown={handleKeydown}
              onInput={(event) =>
                onRangeInput(0, (event.target as HTMLInputElement).value)
              }
              onChange={(event) => handleRangeChange(0, event.target.value)}
            />
            <span className="el-range-separator">{rangeSeparator}</span>
            <input
              ref={endInputRef}
              id={isArray(id) ? id[1] : undefined}
              name={isArray(name) ? name[1] : undefined}
              className="el-range-input"
              placeholder={endPlaceholder}
              disabled={pickerDisabled}
              readOnly={!editable || readonly}
              tabIndex={Number(tabindex)}
              aria-label={ariaLabel}
              role="combobox"
              aria-controls={panelId}
              aria-expanded={pickerVisible}
              autoComplete="off"
              value={displayValue?.[1] ?? ""}
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
          <ElInput
            id={inputId}
            className={singleClasses}
            value={(displayValue as string) ?? ""}
            name={name as string}
            size={size}
            disabled={pickerDisabled}
            placeholder={placeholder}
            readOnly={!editable || readonly}
            aria-label={ariaLabel}
            tabIndex={Number(tabindex)}
            containerRole="combobox"
            prefix={
              <ElIcon className="el-input__icon">
                {prefixIcon || <Clock />}
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
              ) : undefined
            }
            onChange={onUserInput}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeydown}
            onMouseDown={onMouseDownInput}
            onMouseEnter={() => {
              if (readonly || pickerDisabled) return;
              if (!valueIsEmpty && clearable) setHovering(true);
            }}
            onMouseLeave={() => setHovering(false)}
            validateEvent={false}
          />
        )}
      </ElTooltip>
    </div>
  );
};
