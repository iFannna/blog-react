import type { DatePickerType } from "./types";

export const DEFAULT_FORMATS_TIME = "HH:mm:ss";

export const DEFAULT_FORMATS_DATE = "YYYY-MM-DD";

/** 对应官方 DEFAULT_FORMATS_DATEPICKER：每种 type 的输入框默认格式。 */
export const DEFAULT_FORMATS_DATEPICKER: Record<DatePickerType, string> = {
  date: DEFAULT_FORMATS_DATE,
  dates: DEFAULT_FORMATS_DATE,
  week: "gggg[w]ww",
  year: "YYYY",
  years: "YYYY",
  month: "YYYY-MM",
  months: "YYYY-MM",
  quarter: "YYYY-[Q]Q",
  quarters: "YYYY-[Q]Q",
  datetime: `${DEFAULT_FORMATS_DATE} ${DEFAULT_FORMATS_TIME}`,
  monthrange: "YYYY-MM",
  quarterrange: "YYYY-[Q]Q",
  yearrange: "YYYY",
  daterange: DEFAULT_FORMATS_DATE,
  datetimerange: `${DEFAULT_FORMATS_DATE} ${DEFAULT_FORMATS_TIME}`,
};

/** 单选与范围共用的默认占位文本键，按 type 推导。 */
export function getDefaultPlaceholder(type: DatePickerType): string {
  return type.includes("time") ? "el.datepicker.selectTime" : "el.datepicker.selectDate";
}
