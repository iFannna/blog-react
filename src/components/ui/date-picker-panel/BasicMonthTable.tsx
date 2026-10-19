"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  type Ref,
} from "react";

import { useLocale, useTranslator } from "../config-provider/context";

import { BasicCell } from "./BasicCell";
import { dayjs } from "./dayjs";
import {
  castArray,
  datesInMonth,
  getValidDateOfMonth,
} from "./utils";

import type { Dayjs } from "./dayjs";
import type {
  CellClassNameType,
  DateCell,
  DisabledDateType,
  RangeState,
} from "./types";
import type { ReactNode } from "react";

export type MonthTablePickValue =
  | number
  | Dayjs[]
  | { minDate: Dayjs; maxDate: Dayjs | null | undefined };

export interface BasicMonthTableProps {
  date: Dayjs;
  parsedValue?: Dayjs | Dayjs[];
  selectionMode?: "month" | "months" | "range";
  minDate?: Dayjs | null;
  maxDate?: Dayjs | null;
  rangeState?: RangeState;
  disabledDate?: DisabledDateType;
  disabled?: boolean;
  cellClassName?: CellClassNameType;
  renderCell?: (cell: DateCell) => ReactNode;
  onPick?: (value: MonthTablePickValue, keepOpen?: boolean) => void;
  onChangeRange?: (state: RangeState) => void;
  onSelect?: (selecting: boolean) => void;
}

export interface BasicMonthTableExpose {
  focus: () => void;
}

export function BasicMonthTable({
  ref,
  date,
  parsedValue,
  selectionMode = "month",
  minDate,
  maxDate,
  rangeState,
  disabledDate,
  disabled,
  cellClassName,
  renderCell,
  onPick,
  onChangeRange,
  onSelect,
}: BasicMonthTableProps & { ref?: Ref<BasicMonthTableExpose> }) {
  const { name: lang } = useLocale();
  const t = useTranslator();
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const lastRowRef = useRef<number | undefined>(undefined);
  const lastColumnRef = useRef<number | undefined>(undefined);
  const mountedRef = useRef(false);

  const months = useMemo(
    () =>
      date
        .locale("en")
        .localeData()
        .monthsShort()
        .map((item) => item.toLowerCase()),
    [date],
  );

  const isSelectedCell = useCallback(
    (cell: DateCell) => {
      const year = date.year();
      const month = cell.text;
      return castArray(date).some(
        (item) => item.year() === year && item.month() === month,
      );
    },
    [date],
  );

  const rows = useMemo(() => {
    const result: DateCell[][] = [[], [], []];
    const now = dayjs().locale(lang).startOf("month");
    const calEndDate =
      rangeState?.endDate ||
      maxDate ||
      (rangeState?.selecting && minDate) ||
      null;

    for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < 4; columnIndex += 1) {
        const index = rowIndex * 4 + columnIndex;
        const calTime = date.startOf("year").month(index);
        const cell: DateCell = {
          row: rowIndex,
          column: columnIndex,
          type: "normal",
          inRange: false,
          start: false,
          end: false,
          text: index,
          disabled: false,
          isSelected: false,
        };

        cell.inRange =
          !!(
            minDate &&
            calTime.isSameOrAfter(minDate, "month") &&
            calEndDate &&
            calTime.isSameOrBefore(calEndDate, "month")
          ) ||
          !!(
            minDate &&
            calTime.isSameOrBefore(minDate, "month") &&
            calEndDate &&
            calTime.isSameOrAfter(calEndDate, "month")
          );

        if (minDate && calEndDate && minDate.isSameOrAfter(calEndDate)) {
          cell.start = calTime.isSame(calEndDate, "month");
          cell.end = calTime.isSame(minDate, "month");
        } else {
          cell.start = !!minDate && calTime.isSame(minDate, "month");
          cell.end = !!calEndDate && calTime.isSame(calEndDate, "month");
        }

        if (now.isSame(calTime)) cell.type = "today";

        const cellDate = calTime.toDate();
        cell.disabled = disabledDate?.(cellDate) || false;
        cell.date = cellDate;
        cell.customClass = cellClassName?.(cellDate);
        cell.dayjs = calTime;
        cell.timestamp = calTime.valueOf();
        cell.isSelected = isSelectedCell(cell);
        result[rowIndex][columnIndex] = cell;
      }
    }

    return result;
  }, [
    lang,
    date,
    rangeState,
    maxDate,
    minDate,
    disabledDate,
    cellClassName,
    isSelectedCell,
  ]);

  const focus = useCallback(() => {
    tbodyRef.current
      ?.querySelector<HTMLElement>("td[tabindex='0']")
      ?.focus();
  }, []);

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (tbodyRef.current?.contains(document.activeElement)) focus();
  }, [date, focus]);

  const getCellClasses = (cell: DateCell) => {
    const year = date.year();
    const month = cell.text ?? 0;
    const classes: string[] = [];

    if (
      disabled ||
      (disabledDate
        ? datesInMonth(date, year, month, lang).every(disabledDate)
        : false)
    ) {
      classes.push("disabled");
    }

    if (
      castArray(parsedValue).some(
        (item) =>
          dayjs.isDayjs(item) &&
          item.year() === year &&
          item.month() === month,
      )
    ) {
      classes.push("current");
    }

    const today = new Date();
    if (today.getFullYear() === year && today.getMonth() === month) {
      classes.push("today");
    }

    if (cell.customClass) classes.push(cell.customClass);
    if (cell.inRange) {
      classes.push("in-range");
      if (cell.start) classes.push("start-date");
      if (cell.end) classes.push("end-date");
    }

    return classes.join(" ");
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLTableElement>) => {
    if (!rangeState?.selecting) return;
    const target = (event.target as HTMLElement).closest(
      "td",
    ) as HTMLTableCellElement | null;
    if (!target) return;

    const row = (target.parentNode as HTMLTableRowElement).rowIndex;
    const column = target.cellIndex;
    if (rows[row]?.[column]?.disabled) return;

    if (row !== lastRowRef.current || column !== lastColumnRef.current) {
      lastRowRef.current = row;
      lastColumnRef.current = column;
      onChangeRange?.({
        selecting: true,
        endDate: date.startOf("year").month(row * 4 + column),
      });
    }
  };

  const handleMonthTableClick = (
    event: React.MouseEvent<HTMLTableElement> | React.KeyboardEvent,
  ) => {
    if (disabled) return;
    const target = (event.target as HTMLElement)?.closest(
      "td",
    ) as HTMLTableCellElement | null;
    if (!target || target.tagName !== "TD") return;
    if (target.classList.contains("disabled")) return;

    const column = target.cellIndex;
    const row = (target.parentNode as HTMLTableRowElement).rowIndex;
    const month = row * 4 + column;
    const newDate = date.startOf("year").month(month);

    if (selectionMode === "months") {
      if (event.type === "keydown") {
        onPick?.(castArray(parsedValue), false);
        return;
      }
      const newMonth = getValidDateOfMonth(
        date,
        date.year(),
        month,
        lang,
        disabledDate,
      );
      const newValue = target.classList.contains("current")
        ? castArray(parsedValue).filter(
            (item) =>
              item?.year() !== newMonth.year() ||
              item?.month() !== newMonth.month(),
          )
        : castArray(parsedValue).concat([dayjs(newMonth)]);
      onPick?.(newValue);
    } else if (selectionMode === "range") {
      if (!rangeState?.selecting) {
        onPick?.({ minDate: newDate, maxDate: null });
        onSelect?.(true);
      } else {
        if (minDate && newDate.valueOf() >= minDate.valueOf()) {
          onPick?.({ minDate, maxDate: newDate });
        } else {
          onPick?.({ minDate: newDate, maxDate: minDate });
        }
        onSelect?.(false);
      }
    } else {
      onPick?.(month);
    }
  };

  useImperativeHandle(ref, () => ({ focus }), [focus]);

  return (
    <table
      role="grid"
      aria-label={t("el.datepicker.monthTablePrompt")}
      className="el-month-table"
      onClick={handleMonthTableClick}
      onMouseMove={handleMouseMove}
    >
      <tbody ref={tbodyRef}>
        {rows.map((row, rowKey) => (
          <tr key={rowKey}>
            {row.map((cell, columnKey) => (
              <td
                key={columnKey}
                className={getCellClasses(cell)}
                aria-selected={!!cell.isSelected}
                aria-label={t(`el.datepicker.month${Number(cell.text) + 1}`)}
                tabIndex={cell.isSelected ? 0 : -1}
                onKeyDown={(event) => {
                  if (event.key !== " " && event.key !== "Enter") return;
                  event.preventDefault();
                  event.stopPropagation();
                  handleMonthTableClick(event);
                }}
              >
                <BasicCell
                  cell={{
                    ...cell,
                    renderText: t(`el.datepicker.months.${months[cell.text!]}`),
                  }}
                  renderCell={renderCell}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
