"use client";

import {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  type Ref,
} from "react";

import { BasicCell } from "./BasicCell";
import { dayjs } from "./dayjs";
import "./quarter-table.module.css";

import type { Dayjs } from "./dayjs";
import type {
  CellClassNameType,
  DateCell,
  DisabledDateType,
  RangeState,
} from "./types";
import type { ReactNode } from "react";

export type QuarterTablePickValue =
  | number
  | Dayjs[]
  | { minDate: Dayjs; maxDate: Dayjs | null | undefined };

export interface BasicQuarterTableProps {
  date: Dayjs;
  selectionMode?: "quarter" | "quarters";
  parsedValue?: Dayjs | Dayjs[];
  minDate?: Dayjs | null;
  maxDate?: Dayjs | null;
  rangeState?: RangeState;
  disabledDate?: DisabledDateType;
  disabled?: boolean;
  cellClassName?: CellClassNameType;
  renderCell?: (cell: DateCell) => ReactNode;
  onPick?: (value: QuarterTablePickValue, keepOpen?: boolean) => void;
  onChangeRange?: (state: RangeState) => void;
  onSelect?: (selecting: boolean) => void;
}

export interface BasicQuarterTableExpose {
  focus: () => void;
}

const QUARTERS = [0, 1, 2, 3];

/** 对应官方 basic-quarter-table：一年四个季度，单行展示。 */
export function BasicQuarterTable({
  ref,
  date,
  parsedValue,
  selectionMode = "quarter",
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
}: BasicQuarterTableProps & { ref?: Ref<BasicQuarterTableExpose> }) {
  const tbodyRef = useRef<HTMLTableSectionElement>(null);
  const lastColumnRef = useRef<number | undefined>(undefined);

  const rows = useMemo(() => {
    const now = dayjs();
    const calEndDate =
      rangeState?.endDate ||
      maxDate ||
      (rangeState?.selecting && minDate) ||
      null;

    return [
      QUARTERS.map((quarter) => {
        const calTime = date.startOf("year").month(quarter * 3);
        const cell: DateCell = {
          row: 0,
          column: quarter,
          type: "normal",
          inRange: false,
          start: false,
          end: false,
          text: quarter,
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

        // 官方 today 判定只比较季度，不看年份
        if (now.month() === calTime.month()) cell.type = "today";

        const cellDate = calTime.toDate();
        cell.disabled = disabledDate?.(cellDate) || false;
        cell.date = cellDate;
        cell.customClass = cellClassName?.(cellDate);
        cell.dayjs = calTime;
        cell.timestamp = calTime.valueOf();
        cell.isSelected = Array.isArray(parsedValue)
          ? parsedValue.some(
              (item) =>
                item.year() === calTime.year() &&
                item.month() === calTime.month(),
            )
          : !!parsedValue &&
            parsedValue.year() === calTime.year() &&
            parsedValue.month() === calTime.month();
        return cell;
      }),
    ];
  }, [
    date,
    rangeState,
    maxDate,
    minDate,
    disabledDate,
    cellClassName,
    parsedValue,
  ]);

  const focus = useCallback(() => {
    tbodyRef.current
      ?.querySelector<HTMLElement>("td[tabindex='0']")
      ?.focus();
  }, []);

  const getCellClasses = (cell: DateCell) => {
    const classes: string[] = [];
    const quarterStart = date.startOf("year").month((cell.text ?? 0) * 3);

    if (disabled || cell.disabled) classes.push("disabled");
    if (cell.type === "today") classes.push("today");
    if (cell.isSelected) classes.push("current");
    if (cell.customClass) classes.push(cell.customClass);
    if (cell.inRange) {
      classes.push("in-range");
      if (cell.start) classes.push("start-date");
      if (cell.end) classes.push("end-date");
    }
    if (quarterStart.isValid()) classes.push("available");

    return classes.join(" ");
  };

  const handleMouseMove = (event: React.MouseEvent<HTMLTableElement>) => {
    if (!rangeState?.selecting) return;
    const target = (event.target as HTMLElement).closest(
      "td",
    ) as HTMLTableCellElement | null;
    if (!target) return;

    const column = target.cellIndex;
    if (rows[0]?.[column]?.disabled) return;

    if (column !== lastColumnRef.current) {
      lastColumnRef.current = column;
      onChangeRange?.({
        selecting: true,
        endDate: date.startOf("year").month(column * 3),
      });
    }
  };

  const handleQuarterTableClick = (
    event: React.MouseEvent<HTMLTableElement> | React.KeyboardEvent,
  ) => {
    if (disabled) return;
    const target = (event.target as HTMLElement)?.closest(
      "td",
    ) as HTMLTableCellElement | null;
    if (!target || target.tagName !== "TD") return;
    if (target.classList.contains("disabled")) return;

    const quarter = target.cellIndex;
    const newDate = date.startOf("year").month(quarter * 3);

    if (selectionMode === "quarters") {
      const values = Array.isArray(parsedValue) ? parsedValue : [];
      const exists = values.some(
        (item) =>
          item.year() === newDate.year() &&
          item.month() === newDate.month(),
      );
      onPick?.(
        exists
          ? values.filter(
              (item) =>
                item.year() !== newDate.year() ||
                item.month() !== newDate.month(),
            )
          : values.concat([newDate]),
      );
      return;
    }

    if (selectionMode === "quarter") {
      onPick?.(quarter);
      return;
    }

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
  };

  useImperativeHandle(ref, () => ({ focus }), [focus]);

  return (
    <table
      role="grid"
      aria-label="Use the arrow keys and enter to select the quarter"
      className="el-quarter-table"
      onClick={handleQuarterTableClick}
      onMouseMove={handleMouseMove}
    >
      <tbody ref={tbodyRef}>
        <tr>
          {rows[0].map((cell, columnKey) => (
            <td
              key={columnKey}
              className={getCellClasses(cell)}
              aria-selected={!!cell.isSelected}
              aria-label={`Q${Number(cell.text) + 1}`}
              tabIndex={cell.isSelected ? 0 : -1}
              onKeyDown={(event) => {
                if (event.key !== " " && event.key !== "Enter") return;
                event.preventDefault();
                event.stopPropagation();
                handleQuarterTableClick(event);
              }}
            >
              <BasicCell
                cell={{
                  ...cell,
                  renderText: `Q${Number(cell.text) + 1}`,
                }}
                renderCell={renderCell}
              />
            </td>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
