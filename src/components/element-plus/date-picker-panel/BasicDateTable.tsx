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
import { dayjs, getWeekStart } from "./dayjs";
import {
  buildPickerTable,
  castArray,
} from "./utils";

import type { Dayjs } from "./dayjs";
import type {
  CellClassNameType,
  DateCell,
  DisabledDateType,
  RangeState,
} from "./types";
import type { ReactNode } from "react";

export interface WeekPickValue {
  year: number;
  week: number;
  value: string;
  date: Dayjs;
}

export type DateTablePickValue =
  | Dayjs
  | Dayjs[]
  | { minDate: Dayjs; maxDate: Dayjs | null }
  | WeekPickValue;

export interface BasicDateTableProps {
  date: Dayjs;
  parsedValue?: Dayjs | Dayjs[];
  selectionMode?: "date" | "dates" | "week" | "range";
  minDate?: Dayjs | null;
  maxDate?: Dayjs | null;
  rangeState?: RangeState;
  disabledDate?: DisabledDateType;
  disabled?: boolean;
  cellClassName?: CellClassNameType;
  showWeekNumber?: boolean;
  renderCell?: (cell: DateCell) => ReactNode;
  onPick?: (value: DateTablePickValue, keepOpen?: boolean) => void;
  onChangeRange?: (state: RangeState) => void;
  onSelect?: (selecting: boolean) => void;
}

export interface BasicDateTableExpose {
  focus: () => void;
}

const isNormalDay = (type = "") => ["normal", "today"].includes(type);

export function BasicDateTable({
  ref,
  date,
  parsedValue,
  selectionMode = "date",
  minDate,
  maxDate,
  rangeState,
  disabledDate,
  disabled,
  cellClassName,
  showWeekNumber,
  renderCell,
  onPick,
  onChangeRange,
  onSelect,
}: BasicDateTableProps & { ref?: Ref<BasicDateTableExpose> }) {
  const { name: lang } = useLocale();
  const t = useTranslator();
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const lastRowRef = useRef<number | undefined>(undefined);
  const lastColumnRef = useRef<number | undefined>(undefined);
  const focusWithClickRef = useRef(false);
  const mountedRef = useRef(false);

  const firstDayOfWeek = getWeekStart(date);

  const offsetDay = firstDayOfWeek > 3 ? 7 - firstDayOfWeek : -firstDayOfWeek;

  const startDate = useMemo(() => {
    const startDayOfMonth = date.startOf("month");
    return startDayOfMonth.subtract(startDayOfMonth.day() || 7, "day");
  }, [date]);

  const weekdays = useMemo(() => {
    return date
      .locale("en")
      .localeData()
      .weekdaysShort()
      .map((item) => item.toLowerCase());
  }, [date]);

  const WEEKS = useMemo(
    () => weekdays.concat(weekdays).slice(firstDayOfWeek, firstDayOfWeek + 7),
    [weekdays, firstDayOfWeek],
  );

  const days = useMemo(() => {
    const startOfMonth = date.startOf("month");
    return {
      startOfMonthDay: startOfMonth.day() || 7,
      dateCountOfMonth: startOfMonth.daysInMonth(),
      dateCountOfLastMonth: startOfMonth.subtract(1, "month").daysInMonth(),
    };
  }, [date]);

  const singleParsedValue = Array.isArray(parsedValue)
    ? undefined
    : parsedValue;

  const cellMatchesDate = useCallback(
    (cell: DateCell, value?: Dayjs) =>
      !!value &&
      dayjs(value)
        .locale(lang)
        .isSame(date.date(Number(cell.text)), "day"),
    [date, lang],
  );

  const isCurrent = useCallback(
    (cell: DateCell) =>
      selectionMode === "date" &&
      isNormalDay(cell.type) &&
      cellMatchesDate(cell, singleParsedValue),
    [selectionMode, cellMatchesDate, singleParsedValue],
  );

  const isWeekActive = useCallback(
    (cell: DateCell) => {
      if (selectionMode !== "week") return false;
      let newDate = date.startOf("day");
      if (cell.type === "prev-month") newDate = newDate.subtract(1, "month");
      if (cell.type === "next-month") newDate = newDate.add(1, "month");
      newDate = newDate.date(Number.parseInt(String(cell.text), 10));

      if (parsedValue && !Array.isArray(parsedValue)) {
        const dayOffset =
          ((parsedValue.day() - firstDayOfWeek + 7) % 7) - 1;
        const weekDate = parsedValue.subtract(dayOffset, "day");
        return weekDate.isSame(newDate, "day");
      }
      return false;
    },
    [selectionMode, date, parsedValue, firstDayOfWeek],
  );

  const rows = useMemo(() => {
    const result: DateCell[][] = [[], [], [], [], [], []];
    const now = dayjs().locale(lang).startOf("day");
    const { startOfMonthDay, dateCountOfMonth, dateCountOfLastMonth } = days;
    const selectedDate =
      selectionMode === "dates" ? castArray(parsedValue) : [];
    const nextEndDate =
      rangeState?.endDate ||
      maxDate ||
      (rangeState?.selecting && minDate) ||
      null;
    let count = 1;

    const setDateText = (
      cell: DateCell,
      rowIndex: number,
      columnIndex: number,
    ): boolean => {
      if (rowIndex >= 0 && rowIndex <= 1) {
        const numberOfDaysFromPreviousMonth =
          startOfMonthDay + offsetDay < 0
            ? 7 + startOfMonthDay + offsetDay
            : startOfMonthDay + offsetDay;

        if (columnIndex + rowIndex * 7 >= numberOfDaysFromPreviousMonth) {
          cell.text = count;
          return true;
        }
        cell.text =
          dateCountOfLastMonth -
          (numberOfDaysFromPreviousMonth - (columnIndex % 7)) +
          1 +
          rowIndex * 7;
        cell.type = "prev-month";
      } else {
        if (count <= dateCountOfMonth) {
          cell.text = count;
        } else {
          cell.text = count - dateCountOfMonth;
          cell.type = "next-month";
        }
        return true;
      }
      return false;
    };

    buildPickerTable({ row: 6, column: 7 }, result, {
      startDate: minDate,
      columnIndexOffset: showWeekNumber ? 1 : 0,
      nextEndDate,
      now,
      unit: "day",
      relativeDateGetter: (index) => startDate.add(index - offsetDay, "day"),
      setCellMetadata: (cell, { rowIndex, columnIndex }) => {
        const shouldIncrement = setDateText(cell, rowIndex, columnIndex);
        const cellDate = cell.dayjs!.toDate();
        cell.selected = selectedDate.find((item) =>
          item.isSame(cell.dayjs, "day"),
        );
        cell.isSelected = !!cell.selected;
        cell.isCurrent =
          selectionMode === "date" &&
          isNormalDay(cell.type) &&
          cellMatchesDate(cell, singleParsedValue);
        cell.disabled = disabledDate?.(cellDate);
        cell.customClass = cellClassName?.(cellDate);
        if (shouldIncrement) count += 1;
      },
      setRowMetadata: (row) => {
        if (selectionMode === "week") {
          const [start, end] = showWeekNumber ? [1, 7] : [0, 6];
          const isActive = isWeekActive(row[start + 1]);
          row[start].inRange = isActive;
          row[start].start = isActive;
          row[end].inRange = isActive;
          row[end].end = isActive;
        }
      },
    });

    if (showWeekNumber) {
      for (let rowIndex = 0; rowIndex < 6; rowIndex += 1) {
        const firstDay = result[rowIndex][1];
        if (firstDay?.dayjs) {
          result[rowIndex][0] = {
            type: "week",
            text: firstDay.dayjs.week(),
          };
        }
      }
    }

    return result;
  }, [
    lang,
    days,
    selectionMode,
    parsedValue,
    rangeState,
    maxDate,
    minDate,
    showWeekNumber,
    startDate,
    offsetDay,
    disabledDate,
    cellClassName,
    isWeekActive,
    cellMatchesDate,
  ]);

  const hasCurrent = useMemo(
    () => rows.some((row) => row.some((cell) => cell.isCurrent)),
    [rows],
  );

  const isSelectedCell = useCallback(
    (cell: DateCell) =>
      (!hasCurrent && cell?.text === 1 && isNormalDay(cell.type)) ||
      !!cell.isCurrent,
    [hasCurrent],
  );

  const focus = useCallback(() => {
    tbodyRef.current
      ?.querySelector<HTMLElement>("td[tabindex='0']")
      ?.focus();
  }, []);

  // 与官方 watch(date) 一致：仅在焦点位于表格内时，换月后重新聚焦当前单元格
  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      return;
    }
    if (tbodyRef.current?.contains(document.activeElement)) focus();
  }, [date, focus]);

  const getDateOfCell = useCallback(
    (row: number, column: number) => {
      const { startOfMonthDay } = days;
      const numberOfDaysFromPreviousMonth =
        startOfMonthDay + offsetDay < 0
          ? 7 + startOfMonthDay + offsetDay
          : startOfMonthDay + offsetDay;
      const offsetFromStart =
        row * 7 + (column - (showWeekNumber ? 1 : 0));
      return date
        .startOf("month")
        .subtract(numberOfDaysFromPreviousMonth, "day")
        .add(offsetFromStart, "day");
    },
    [days, offsetDay, showWeekNumber, date],
  );

  const handleRangePick = (newDate: Dayjs) => {
    if (!rangeState?.selecting || !minDate) {
      onPick?.({ minDate: newDate, maxDate: null });
      onSelect?.(true);
    } else {
      if (newDate.valueOf() >= minDate.valueOf()) {
        onPick?.({ minDate, maxDate: newDate });
      } else {
        onPick?.({ minDate: newDate, maxDate: minDate });
      }
      onSelect?.(false);
    }
  };

  const handlePickDate = (
    event: React.MouseEvent | React.FocusEvent,
    isKeyboardMovement = false,
  ) => {
    if (disabled) return;
    const target = (event.target as HTMLElement).closest(
      "td",
    ) as HTMLTableCellElement | null;
    if (!target) return;

    const row = (target.parentNode as HTMLTableRowElement).rowIndex - 1;
    const column = target.cellIndex;
    const cell = rows[row]?.[column];
    if (!cell || cell.disabled || cell.type === "week") return;

    const newDate = getDateOfCell(row, column);

    switch (selectionMode) {
      case "range":
        handleRangePick(newDate);
        break;
      case "date":
        onPick?.(newDate, isKeyboardMovement);
        break;
      case "week": {
        const week = newDate.week();
        onPick?.({
          year: newDate.year(),
          week,
          value: `${newDate.year()}w${week}`,
          date: newDate.startOf("week"),
        });
        break;
      }
      case "dates": {
        const value = cell.selected
          ? castArray(parsedValue).filter(
              (item) => item?.valueOf() !== newDate.valueOf(),
            )
          : castArray(parsedValue).concat([newDate]);
        onPick?.(value);
        break;
      }
      default:
        break;
    }
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLTableElement>) => {
    if (!rangeState?.selecting) return;
    const target = (event.target as HTMLElement).closest(
      "td",
    ) as HTMLTableCellElement | null;
    if (!target) return;

    const row = (target.parentNode as HTMLTableRowElement).rowIndex - 1;
    const column = target.cellIndex;
    if (rows[row]?.[column]?.disabled) return;

    if (row !== lastRowRef.current || column !== lastColumnRef.current) {
      lastRowRef.current = row;
      lastColumnRef.current = column;
      onChangeRange?.({
        selecting: true,
        endDate: getDateOfCell(row, column),
      });
    }
  };

  const handleFocus = (event: React.FocusEvent<HTMLTableCellElement>) => {
    if (focusWithClickRef.current || hasCurrent || selectionMode !== "date")
      return;
    handlePickDate(event, true);
  };

  const handleMouseDown = (event: React.MouseEvent<HTMLTableElement>) => {
    if (!(event.target as HTMLElement).closest("td")) return;
    focusWithClickRef.current = true;
  };

  const handleMouseUp = (event: React.MouseEvent<HTMLTableElement>) => {
    if (!(event.target as HTMLElement).closest("td")) return;
    focusWithClickRef.current = false;
  };

  const getCellClasses = (cell: DateCell) => {
    const classes: string[] = [];
    if (isNormalDay(cell.type) && !cell.disabled) {
      classes.push("available");
      if (cell.type === "today") classes.push("today");
    } else if (cell.type) {
      classes.push(cell.type);
    }

    if (isCurrent(cell)) classes.push("current");

    if (
      cell.inRange &&
      (isNormalDay(cell.type) || selectionMode === "week")
    ) {
      classes.push("in-range");
      if (cell.start) classes.push("start-date");
      if (cell.end) classes.push("end-date");
    }

    if (cell.disabled || disabled) classes.push("disabled");
    if (cell.selected) classes.push("selected");
    if (cell.customClass) classes.push(cell.customClass);

    return classes.filter(Boolean).join(" ");
  };

  const tableLabel = t("el.datepicker.dateTablePrompt");

  useImperativeHandle(ref, () => ({ focus }), [focus]);

  return (
    <table
      aria-label={tableLabel}
      className={[
        "el-date-table",
        selectionMode === "week" && !disabled && "is-week-mode",
      ]
        .filter(Boolean)
        .join(" ")}
      cellSpacing={0}
      cellPadding={0}
      role="grid"
      onClick={handlePickDate}
      onMouseMove={handleMouseMove}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <tbody ref={tbodyRef}>
        <tr>
          {showWeekNumber && (
            <th scope="col" className="el-date-table__week-header" />
          )}
          {WEEKS.map((week, key) => (
            <th
              key={key}
              aria-label={t(`el.datepicker.weeksFull.${week}`)}
              scope="col"
            >
              {t(`el.datepicker.weeks.${week}`)}
            </th>
          ))}
        </tr>
        {rows.map((row, rowKey) => (
          <tr
            key={rowKey}
            className={[
              "el-date-table__row",
              isWeekActive(row[showWeekNumber ? 2 : 1]) && "current",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {row.map((cell, columnKey) => (
              <td
                key={`${rowKey}.${columnKey}`}
                className={getCellClasses(cell)}
                aria-current={cell.isCurrent ? "date" : undefined}
                aria-selected={cell.isCurrent}
                tabIndex={disabled ? undefined : isSelectedCell(cell) ? 0 : -1}
                aria-disabled={disabled}
                onFocus={handleFocus}
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
