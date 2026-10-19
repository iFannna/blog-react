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
import { castArray, getValidDateOfYear, rangeArr } from "./utils";

import type { Dayjs } from "./dayjs";
import type {
  CellClassNameType,
  DateCell,
  DisabledDateType,
  RangeState,
} from "./types";
import type { ReactNode } from "react";

export type YearTablePickValue =
  | number
  | Dayjs[]
  | { minDate: Dayjs; maxDate: Dayjs | null | undefined };

export interface BasicYearTableProps {
  date: Dayjs;
  parsedValue?: Dayjs | Dayjs[];
  selectionMode?: "year" | "years" | "range";
  minDate?: Dayjs | null;
  maxDate?: Dayjs | null;
  rangeState?: RangeState;
  disabledDate?: DisabledDateType;
  disabled?: boolean;
  cellClassName?: CellClassNameType;
  renderCell?: (cell: DateCell) => ReactNode;
  onPick?: (value: YearTablePickValue, keepOpen?: boolean) => void;
  onChangeRange?: (state: RangeState) => void;
  onSelect?: (selecting: boolean) => void;
}

export interface BasicYearTableExpose {
  focus: () => void;
}

function datesInYear(year: number, lang: string) {
  const firstDay = dayjs(String(year)).locale(lang).startOf("year");
  const lastDay = firstDay.endOf("year");
  const numOfDays = lastDay.dayOfYear();
  return rangeArr(numOfDays).map((n) => firstDay.add(n, "day").toDate());
}

export function BasicYearTable({
  ref,
  date,
  parsedValue,
  selectionMode = "year",
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
}: BasicYearTableProps & { ref?: Ref<BasicYearTableExpose> }) {
  const { name: lang } = useLocale();
  const t = useTranslator();
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const lastRowRef = useRef<number | undefined>(undefined);
  const lastColumnRef = useRef<number | undefined>(undefined);
  const mountedRef = useRef(false);

  const startYear = Math.floor(date.year() / 10) * 10;

  const isSelectedCell = useCallback(
    (cell: DateCell) =>
      castArray(date).some((item) => item.year() === cell.text),
    [date],
  );

  const rows = useMemo(() => {
    const result: DateCell[][] = [[], [], []];
    const now = dayjs().locale(lang).startOf("year");
    const calEndDate =
      rangeState?.endDate ||
      maxDate ||
      (rangeState?.selecting && minDate) ||
      null;

    for (let rowIndex = 0; rowIndex < 3; rowIndex += 1) {
      for (let columnIndex = 0; columnIndex < 4; columnIndex += 1) {
        if (rowIndex * 4 + columnIndex >= 10) break;

        const index = rowIndex * 4 + columnIndex + startYear;
        const calTime = dayjs().year(index);
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
            calTime.isSameOrAfter(minDate, "year") &&
            calEndDate &&
            calTime.isSameOrBefore(calEndDate, "year")
          ) ||
          !!(
            minDate &&
            calTime.isSameOrBefore(minDate, "year") &&
            calEndDate &&
            calTime.isSameOrAfter(calEndDate, "year")
          );

        if (minDate && calEndDate && minDate.isSameOrAfter(calEndDate)) {
          cell.start = calTime.isSame(calEndDate, "year");
          cell.end = calTime.isSame(minDate, "year");
        } else {
          cell.start = !!minDate && calTime.isSame(minDate, "year");
          cell.end = !!calEndDate && calTime.isSame(calEndDate, "year");
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
    startYear,
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
    const classes = ["available"];
    const year = cell.text ?? 0;
    const today = dayjs().locale(lang);

    if (
      disabled ||
      (disabledDate
        ? datesInYear(year, lang).every(disabledDate)
        : false)
    ) {
      classes.push("disabled");
    }
    if (today.year() === year) classes.push("today");
    if (
      castArray(parsedValue).some(
        (item) => dayjs.isDayjs(item) && item.year() === year,
      )
    ) {
      classes.push("current");
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
        endDate: dayjs()
          .year(startYear)
          .add(row * 4 + column, "year"),
      });
    }
  };

  const handleYearTableClick = (
    event: React.MouseEvent<HTMLTableElement> | React.KeyboardEvent,
  ) => {
    if (disabled) return;
    const target = (event.target as HTMLElement)?.closest(
      "td",
    ) as HTMLTableCellElement | null;
    if (!target || !target.textContent) return;
    if (target.classList.contains("disabled")) return;

    const column = target.cellIndex;
    const row = (target.parentNode as HTMLTableRowElement).rowIndex;
    const selectedYear = row * 4 + column + startYear;
    const newDate = dayjs().year(selectedYear);

    if (selectionMode === "range") {
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
    } else if (selectionMode === "years") {
      if (event.type === "keydown") {
        onPick?.(castArray(parsedValue), false);
        return;
      }
      const validYear = getValidDateOfYear(
        newDate.startOf("year"),
        lang,
        disabledDate,
      );
      const newValue = target.classList.contains("current")
        ? castArray(parsedValue).filter(
            (item) => item?.year() !== selectedYear,
          )
        : castArray(parsedValue).concat([validYear]);
      onPick?.(newValue);
    } else {
      onPick?.(selectedYear);
    }
  };

  useImperativeHandle(ref, () => ({ focus }), [focus]);

  return (
    <table
      role="grid"
      aria-label={t("el.datepicker.yearTablePrompt")}
      className="el-year-table"
      onClick={handleYearTableClick}
      onMouseMove={handleMouseMove}
    >
      <tbody ref={tbodyRef}>
        {rows.map((row, rowKey) => (
          <tr key={rowKey}>
            {row.map((cell, cellKey) => (
              <td
                key={`${rowKey}_${cellKey}`}
                className={getCellClasses(cell)}
                aria-selected={cell.isSelected}
                aria-label={String(cell.text)}
                tabIndex={cell.isSelected ? 0 : -1}
                onKeyDown={(event) => {
                  if (event.key !== " " && event.key !== "Enter") return;
                  event.preventDefault();
                  event.stopPropagation();
                  handleYearTableClick(event);
                }}
              >
                <BasicCell cell={cell} renderCell={renderCell} />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
