import { dayjs } from "./dayjs";

import type { Dayjs } from "./dayjs";
import type {
  DateCell,
  DateModelType,
  DayOrDays,
  DisabledDateType,
} from "./types";

export const rangeArr = (n: number) =>
  Array.from(Array.from({ length: n }).keys());

export function castArray<T>(value: T | T[] | undefined | null): T[] {
  if (value === undefined || value === null) return [];
  return Array.isArray(value) ? value : [value];
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function valueEquals(
  a: Array<Date> | unknown,
  b: Array<Date> | unknown,
): boolean {
  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);
  if (aIsArray && bIsArray) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => {
      const left = item;
      const right = b[index];
      if (isDate(left) && isDate(right)) {
        return left.getTime() === right.getTime();
      }
      if (!isDate(left) && !isDate(right)) return left === right;
      return false;
    });
  }
  if (!aIsArray && !bIsArray) {
    if (isDate(a) && isDate(b)) return a.getTime() === b.getTime();
    if (!isDate(a) && !isDate(b)) return a === b;
    return false;
  }
  return false;
}

export function parseDate(
  date: DateModelType,
  format: string | undefined,
  lang: string,
): Dayjs | undefined {
  const day =
    !format || format === "x"
      ? dayjs(date).locale(lang)
      : dayjs(date, format).locale(lang);
  return day.isValid() ? day : undefined;
}

export function formatter(
  date: string | number | Date | Dayjs,
  format: string | undefined,
  lang: string,
): string | number | Date | Dayjs {
  if (!format) return date;
  if (format === "x") return +date;
  return dayjs(date).locale(lang).format(format);
}

export function dayOrDaysToDate(dayOrDays: DayOrDays): Date | [Date, Date] {
  return Array.isArray(dayOrDays)
    ? (dayOrDays.map((d) => d.toDate()) as [Date, Date])
    : dayOrDays.toDate();
}

export function isValidRange(
  range: [Dayjs | undefined, Dayjs | undefined],
): boolean {
  if (!Array.isArray(range)) return false;
  const [left, right] = range;
  return (
    dayjs.isDayjs(left) &&
    dayjs.isDayjs(right) &&
    dayjs(left).isValid() &&
    dayjs(right).isValid() &&
    left.isSameOrBefore(right)
  );
}

export function extractDateFormat(format: string) {
  return format
    .replace(/\W?m{1,2}|\W?ZZ/g, "")
    .replace(/\W?h{1,2}|\W?s{1,3}|\W?a/gi, "")
    .trim();
}

export function extractTimeFormat(format: string) {
  return format
    .replace(/\W?D{1,2}|\W?Do|\W?d{1,4}|\W?M{1,4}|\W?Y{2,4}/g, "")
    .trim();
}

export type DefaultValue = [Date, Date] | Date | undefined;

export function getDefaultValue(
  defaultValue: DefaultValue,
  {
    lang,
    step = 1,
    unit,
    unlinkPanels,
  }: {
    lang: string;
    step?: number;
    unit: "month" | "year";
    unlinkPanels: boolean;
  },
): [Dayjs, Dayjs] {
  let start: Dayjs;

  if (Array.isArray(defaultValue)) {
    const [left, providedRight] = defaultValue.map((d) =>
      dayjs(d).locale(lang),
    );
    const right = unlinkPanels ? providedRight : left.add(step, unit);
    return [left, right];
  }

  if (defaultValue) start = dayjs(defaultValue);
  else start = dayjs();
  start = start.locale(lang);
  return [start, start.add(step, unit)];
}

interface BuildPickerTableOptions {
  startDate?: Dayjs | null;
  unit: "month" | "day";
  columnIndexOffset: number;
  now: Dayjs;
  nextEndDate: Dayjs | null;
  relativeDateGetter: (index: number) => Dayjs;
  setCellMetadata?: (cell: DateCell, dimension: CellDimension) => void;
  setRowMetadata?: (row: DateCell[]) => void;
}

export interface CellDimension {
  rowIndex: number;
  columnIndex: number;
}

export function buildPickerTable(
  dimension: { row: number; column: number },
  rows: DateCell[][],
  {
    columnIndexOffset,
    startDate,
    nextEndDate,
    now,
    unit,
    relativeDateGetter,
    setCellMetadata,
    setRowMetadata,
  }: BuildPickerTableOptions,
) {
  for (let rowIndex = 0; rowIndex < dimension.row; rowIndex += 1) {
    const row = rows[rowIndex];
    for (
      let columnIndex = 0;
      columnIndex < dimension.column;
      columnIndex += 1
    ) {
      let cell = row[columnIndex + columnIndexOffset];
      if (!cell) {
        cell = {
          row: rowIndex,
          column: columnIndex,
          type: "normal",
          inRange: false,
          start: false,
          end: false,
        };
      }
      const index = rowIndex * dimension.column + columnIndex;
      const nextStartDate = relativeDateGetter(index);
      cell.dayjs = nextStartDate;
      cell.date = nextStartDate.toDate();
      cell.timestamp = nextStartDate.valueOf();
      cell.type = "normal";

      cell.inRange =
        !!(
          startDate &&
          nextStartDate.isSameOrAfter(startDate, unit) &&
          nextEndDate &&
          nextStartDate.isSameOrBefore(nextEndDate, unit)
        ) ||
        !!(
          startDate &&
          nextStartDate.isSameOrBefore(startDate, unit) &&
          nextEndDate &&
          nextStartDate.isSameOrAfter(nextEndDate, unit)
        );

      if (startDate && nextEndDate && startDate.isSameOrAfter(nextEndDate)) {
        cell.start = !!nextEndDate && nextStartDate.isSame(nextEndDate, unit);
        cell.end = nextStartDate.isSame(startDate, unit);
      } else {
        cell.start = !!startDate && nextStartDate.isSame(startDate, unit);
        cell.end = !!nextEndDate && nextStartDate.isSame(nextEndDate, unit);
      }

      if (nextStartDate.isSame(now, unit)) {
        cell.type = "today";
      }
      setCellMetadata?.(cell, { rowIndex, columnIndex });
      row[columnIndex + columnIndexOffset] = cell;
    }
    setRowMetadata?.(row);
  }
}

export function datesInMonth(
  date: Dayjs,
  year: number,
  month: number,
  lang: string,
) {
  const firstDay = dayjs()
    .locale(lang)
    .startOf("month")
    .month(month)
    .year(year)
    .hour(date.hour())
    .minute(date.minute())
    .second(date.second());

  const numOfDays = firstDay.daysInMonth();
  return rangeArr(numOfDays).map((n) => firstDay.add(n, "day").toDate());
}

export function getValidDateOfMonth(
  date: Dayjs,
  year: number,
  month: number,
  lang: string,
  disabledDate?: DisabledDateType,
) {
  const fallback = dayjs()
    .year(year)
    .month(month)
    .startOf("month")
    .hour(date.hour())
    .minute(date.minute())
    .second(date.second());
  const validDate = datesInMonth(date, year, month, lang).find(
    (item) => !disabledDate?.(item),
  );
  if (validDate) return dayjs(validDate).locale(lang);
  return fallback.locale(lang);
}

export function getValidDateOfYear(
  value: Dayjs,
  lang: string,
  disabledDate?: DisabledDateType,
) {
  const year = value.year();
  if (!disabledDate?.(value.toDate())) return value.locale(lang);
  const month = value.month();
  if (!datesInMonth(value, year, month, lang).every(disabledDate)) {
    return getValidDateOfMonth(value, year, month, lang, disabledDate);
  }
  for (let i = 0; i < 12; i += 1) {
    if (!datesInMonth(value, year, i, lang).every(disabledDate)) {
      return getValidDateOfMonth(value, year, i, lang, disabledDate);
    }
  }
  return value;
}

/**
 * 对应官方 correctlyParseUserInput。
 *
 * 默认格式下先用 dayjs 的宽松解析判断有效性，再按传入格式解析，
 * 这样既能接受 `2026-10-19` 这类省略了时间部分的输入，又保留格式约束。
 */
export function correctlyParseUserInput(
  value: string | Dayjs | Dayjs[],
  format: string,
  lang: string,
  isDefaultFormat?: boolean,
): Dayjs | Dayjs[] {
  if (Array.isArray(value)) {
    return value.map(
      (item) =>
        correctlyParseUserInput(item, format, lang, isDefaultFormat) as Dayjs,
    );
  }
  if (typeof value === "string") {
    const dayjsValue = isDefaultFormat ? dayjs(value) : dayjs(value, format);
    if (!dayjsValue.isValid()) return dayjsValue;
  }
  return dayjs(value, format).locale(lang);
}
