import type { CSSProperties, ReactNode } from "react";
import type { Dayjs } from "dayjs";

import type { ComponentSize } from "../button/types";
import type { PopperPlacement } from "../popper/use-popper";
import type {
  GetDisabledHours,
  GetDisabledMinutes,
  GetDisabledSeconds,
} from "../time-picker/types";

export type DatePickerType =
  | "year"
  | "years"
  | "month"
  | "months"
  | "quarter"
  | "quarters"
  | "date"
  | "dates"
  | "week"
  | "datetime"
  | "datetimerange"
  | "daterange"
  | "monthrange"
  | "quarterrange"
  | "yearrange";

export type DateCellType =
  | "normal"
  | "today"
  | "week"
  | "next-month"
  | "prev-month";

/** 对应官方 DateCell：表格渲染与自定义单元格插槽都拿到同一份数据。 */
export interface DateCell {
  column?: number;
  row?: number;
  customClass?: string;
  disabled?: boolean;
  end?: boolean;
  inRange?: boolean;
  selected?: Dayjs;
  isCurrent?: boolean;
  isSelected?: boolean;
  start?: boolean;
  text?: number;
  renderText?: string;
  timestamp?: number;
  date?: Date;
  dayjs?: Dayjs;
  type?: DateCellType;
}

export interface RangeState {
  endDate: Dayjs | null;
  selecting: boolean;
}

export type DateModelType = number | string | Date;
export type DateModelValue =
  | DateModelType
  | number[]
  | string[]
  | Date[]
  | null;
export type SingleOrRange<T> = T | [T, T];
export type DayOrDays = SingleOrRange<Dayjs>;
export type UserInput = string | null | [string | null, string | null];

export type DisabledDateType = (date: Date) => boolean;
export type CellClassNameType = (date: Date) => string;

/** 对应官方快捷键配置；value 为函数时在点击时求值。 */
export interface DateShortcut {
  text: ReactNode;
  value?:
    | Date
    | [Date, Date]
    | (() => Date)
    | (() => [Date, Date]);
  onClick?: (context: {
    emit: (value: Date | [Date, Date] | null) => void;
  }) => void;
}

/** 面板通过 ref 交给日期选择器调用的能力，对应官方 set-picker-option。 */
export interface PanelInstance {
  focus: () => void;
  isValidValue: (date: DayOrDays) => boolean;
  parseUserInput: (value: UserInput) => DayOrDays | null;
  handleClear?: () => void;
  handleFocusPicker?: () => void;
}

export interface DatePickerPanelProps {
  /** 绑定值 */
  value?: DateModelValue;
  /** 绑定值变化，对应官方 update:modelValue */
  onChange?: (value: DateModelValue) => void;
  /** 面板请求关闭 / 保持打开 */
  onPickerVisibleChange?: (visible: boolean) => void;
  /** 面板原始选中值，供选择器触发 change 与关闭 */
  onPick?: (
    value: Date | [Date, Date] | Date[] | null,
    keepOpen?: boolean,
  ) => void;
  onCalendarChange?: (dates: [Date, Date | null]) => void;
  onPanelChange?: (
    value: Date | [Date, Date],
    mode: "month" | "year",
    view?: string,
  ) => void;
  onClear?: () => void;
  /** 面板是否可见 */
  visible?: boolean;
  type?: DatePickerType;
  /** 输入框显示格式 */
  format?: string;
  /** 是否为默认显示格式（对应官方 isDefaultFormat 注入） */
  isDefaultFormat?: boolean;
  /** 绑定值格式 */
  valueFormat?: string;
  dateFormat?: string;
  timeFormat?: string;
  defaultValue?: Date | [Date, Date];
  defaultTime?: Date | [Date, Date];
  disabled?: boolean;
  editable?: boolean;
  border?: boolean;
  clearable?: boolean;
  unlinkPanels?: boolean;
  singlePanel?: boolean;
  showNow?: boolean;
  showConfirm?: boolean;
  showFooter?: boolean;
  showWeekNumber?: boolean;
  arrowControl?: boolean;
  disabledDate?: DisabledDateType;
  cellClassName?: CellClassNameType;
  disabledHours?: GetDisabledHours;
  disabledMinutes?: GetDisabledMinutes;
  disabledSeconds?: GetDisabledSeconds;
  shortcuts?: DateShortcut[];
  /** 清空时写回的值 */
  valueOnClear?: unknown;
  className?: string;
  style?: CSSProperties;
  sidebar?: ReactNode;
  /** 默认单元格插槽，对应官方 default slot */
  renderCell?: (cell: DateCell) => ReactNode;
  prevMonthIcon?: ReactNode;
  nextMonthIcon?: ReactNode;
  prevYearIcon?: ReactNode;
  nextYearIcon?: ReactNode;
}

export interface DatePickerPanelExpose {
  focus: () => void;
  isValidValue: (date: DayOrDays) => boolean;
  parseUserInput: (value: UserInput) => DayOrDays | null;
  handleClear: () => void;
  handleFocusPicker: () => void;
}

export interface DatePickerProps {
  value?: DateModelValue;
  /** 对应官方 v-model */
  onChange?: (value: DateModelValue) => void;
  /** 对应官方 change：用户确认后触发，透传的值与绑定值同格式 */
  onValueChange?: (value: DateModelValue) => void;
  type?: DatePickerType;
  id?: string | [string, string];
  name?: string | [string, string];
  format?: string;
  valueFormat?: string;
  dateFormat?: string;
  timeFormat?: string;
  placeholder?: string;
  startPlaceholder?: string;
  endPlaceholder?: string;
  rangeSeparator?: ReactNode;
  disabled?: boolean;
  readonly?: boolean;
  editable?: boolean;
  clearable?: boolean;
  size?: ComponentSize;
  defaultValue?: Date | [Date, Date];
  defaultTime?: Date | [Date, Date];
  disabledDate?: DisabledDateType;
  cellClassName?: CellClassNameType;
  disabledHours?: GetDisabledHours;
  disabledMinutes?: GetDisabledMinutes;
  disabledSeconds?: GetDisabledSeconds;
  shortcuts?: DateShortcut[];
  arrowControl?: boolean;
  unlinkPanels?: boolean;
  singlePanel?: boolean;
  showNow?: boolean;
  showConfirm?: boolean;
  showFooter?: boolean;
  showWeekNumber?: boolean;
  /** 焦点进入输入框时是否自动弹出 */
  automaticDropdown?: boolean;
  validateEvent?: boolean;
  emptyValues?: unknown[];
  valueOnClear?: unknown;
  ariaLabel?: string;
  tabindex?: string | number;
  popperClass?: string;
  popperStyle?: CSSProperties;
  placement?: PopperPlacement;
  fallbackPlacements?: PopperPlacement[];
  teleported?: boolean;
  appendTo?: string | HTMLElement;
  prefixIcon?: ReactNode;
  clearIcon?: ReactNode;
  onCalendarChange?: (dates: [Date, Date | null]) => void;
  onPanelChange?: (
    value: Date | [Date, Date],
    mode: "month" | "year",
    view?: string,
  ) => void;
  onVisibleChange?: (visible: boolean) => void;
  onFocus?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  onClear?: () => void;
  onKeydown?: (event: React.KeyboardEvent) => void;
  className?: string;
  style?: CSSProperties;
  /** 默认单元格插槽 */
  renderCell?: (cell: DateCell) => ReactNode;
  /** 范围分隔符插槽，优先于 rangeSeparator 文本 */
  separator?: ReactNode;
  sidebar?: ReactNode;
  prevMonthIcon?: ReactNode;
  nextMonthIcon?: ReactNode;
  prevYearIcon?: ReactNode;
  nextYearIcon?: ReactNode;
}

/** 对应官方 defineExpose。 */
export interface DatePickerExpose {
  focus: () => void;
  blur: () => void;
  handleOpen: () => void;
  handleClose: () => void;
}
