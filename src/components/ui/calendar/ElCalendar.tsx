"use client";

import { forwardRef, useImperativeHandle, useState, type CSSProperties, type ReactNode } from "react";
import { ElButton, ElButtonGroup } from "../button";
import { useLocale, useTranslator } from "../config-provider/context";
import { ElSelect } from "../select";
import {
  addMonths,
  addYears,
  buildMonthRows,
  buildRangeRows,
  calculateValidatedDateRange,
  formatDate,
  getCellDate,
  isSameDay,
  startOfDay,
  type CalendarCell,
  type CalendarDateType,
} from "./date-utils";

export interface CalendarDateCellData {
  type: "prev-month" | "current-month" | "next-month";
  isSelected: boolean;
  day: string;
  date: Date;
}

export interface CalendarProps {
  value?: Date;
  onChange?: (value: Date) => void;
  range?: [Date, Date];
  controllerType?: "button" | "select";
  formatter?: (value: number, type: "year" | "month") => string | number;
  renderDateCell?: (data: CalendarDateCellData) => ReactNode;
  renderHeader?: (date: string, api: CalendarRef) => ReactNode;
  className?: string;
  style?: CSSProperties;
}

export interface CalendarRef {
  readonly selectedDay: Date | undefined;
  pickDay: (day: Date) => void;
  selectDate: (type: CalendarDateType) => void;
  calculateValidatedDateRange: (start: Date, end: Date) => [Date, Date][];
}

const WEEK_KEYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function CalendarTable({ date, selectedDay, range, hideHeader, firstDayOfWeek, weekDays, renderDateCell, onPick }: {
  date: Date;
  selectedDay?: Date;
  range?: [Date, Date];
  hideHeader?: boolean;
  firstDayOfWeek: number;
  weekDays: string[];
  renderDateCell?: (data: CalendarDateCellData) => ReactNode;
  onPick: (date: Date) => void;
}) {
  const rows = range ? buildRangeRows(range[0], range[1]) : buildMonthRows(date, firstDayOfWeek);
  const today = startOfDay(new Date());
  const resolveDate = (cell: CalendarCell) => getCellDate(date, cell);

  return (
    <table className={["el-calendar-table", range && "is-range"].filter(Boolean).join(" ")} cellSpacing="0" cellPadding="0">
      {!hideHeader && <thead><tr>{weekDays.map((day) => <th key={day} scope="col">{day}</th>)}</tr></thead>}
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex} className={["el-calendar-table__row", rowIndex === 0 && hideHeader && "el-calendar-table__row--hide-border"].filter(Boolean).join(" ")}>
            {row.map((cell, cellIndex) => {
              const cellDate = resolveDate(cell);
              const data: CalendarDateCellData = {
                type: `${cell.type}-month`,
                isSelected: isSameDay(cellDate, selectedDay),
                day: formatDate(cellDate),
                date: cellDate,
              };
              const classes = [
                cell.type,
                cell.type === "current" && data.isSelected && "is-selected",
                cell.type === "current" && isSameDay(cellDate, today) && "is-today",
              ].filter(Boolean).join(" ");

              return (
                <td key={cellIndex} className={classes} onClick={() => onPick(cellDate)}>
                  <div className="el-calendar-day">{renderDateCell ? renderDateCell(data) : <span>{cell.text}</span>}</div>
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export const ElCalendar = forwardRef<CalendarRef, CalendarProps>(function ElCalendar({
  value,
  onChange,
  range,
  controllerType = "button",
  formatter,
  renderDateCell,
  renderHeader,
  className,
  style,
}, ref) {
  const [internalSelectedDay, setInternalSelectedDay] = useState<Date>();
  const t = useTranslator();
  const locale = useLocale();
  const firstDayOfWeek = locale.name.toLowerCase().startsWith("zh") ? 1 : 0;
  const selectedDay = value ?? internalSelectedDay;
  const validInputRange = !!range && range.length === 2 &&
    range.every((item) => item instanceof Date && !Number.isNaN(item.getTime())) && range[0] <= range[1] &&
    (range[1].getFullYear() - range[0].getFullYear()) * 12 + range[1].getMonth() - range[0].getMonth() <= 1;
  const validatedRange = validInputRange ? calculateValidatedDateRange(range[0], range[1], firstDayOfWeek) : [];
  const date = value ?? selectedDay ?? validatedRange[0]?.[0] ?? new Date();

  const pickDay = (day: Date) => {
    const next = startOfDay(day);
    setInternalSelectedDay(next);
    onChange?.(next);
  };

  const selectDate = (type: CalendarDateType) => {
    const current = startOfDay(date);
    const next = type === "prev-month" ? addMonths(current, -1)
      : type === "next-month" ? addMonths(current, 1)
        : type === "prev-year" ? addYears(current, -1)
          : type === "next-year" ? addYears(current, 1) : startOfDay(new Date());
    if (!isSameDay(next, current)) pickDay(next);
  };

  const api: CalendarRef = {
    get selectedDay() { return selectedDay; },
    pickDay,
    selectDate,
    calculateValidatedDateRange: (start, end) => calculateValidatedDateRange(start, end, firstDayOfWeek),
  };
  useImperativeHandle(ref, () => api);

  const i18nDate = `${date.getFullYear()} ${t("el.datepicker.year")} ${t(`el.datepicker.month${date.getMonth() + 1}`)}`;
  const weekDays = Array.from({ length: 7 }, (_, index) => t(`el.datepicker.weeks.${WEEK_KEYS[(firstDayOfWeek + index) % 7]}`));
  const yearOptions = Array.from({ length: 20 }, (_, index) => date.getFullYear() - 10 + index)
    .filter((year) => year > 0).map((year) => ({ value: year, label: formatter?.(year, "year") ?? year }));
  const monthOptions = Array.from({ length: 12 }, (_, index) => index + 1)
    .map((month) => ({ value: month, label: formatter?.(month, "month") ?? month }));

  return (
    <div className={["el-calendar", className].filter(Boolean).join(" ")} style={style}>
      <div className="el-calendar__header">
        {renderHeader ? renderHeader(i18nDate, api) : <>
          <div className="el-calendar__title">{i18nDate}</div>
          {validatedRange.length === 0 && controllerType === "button" && (
            <div className="el-calendar__button-group"><ElButtonGroup>
              <ElButton size="small" onClick={() => selectDate("prev-month")}>{t("el.datepicker.prevMonth")}</ElButton>
              <ElButton size="small" onClick={() => selectDate("today")}>{t("el.datepicker.today")}</ElButton>
              <ElButton size="small" onClick={() => selectDate("next-month")}>{t("el.datepicker.nextMonth")}</ElButton>
            </ElButtonGroup></div>
          )}
          {validatedRange.length === 0 && controllerType === "select" && (
            <div className="el-calendar__select-controller">
              <ElSelect value={date.getFullYear()} size="small" className="el-calendar-select__year" options={yearOptions} onChange={(year) => pickDay(new Date(Number(year), date.getMonth(), 1))} />
              <ElSelect value={date.getMonth() + 1} size="small" className="el-calendar-select__month" options={monthOptions} onChange={(month) => pickDay(new Date(date.getFullYear(), Number(month) - 1, 1))} />
              <ElButton size="small" onClick={() => selectDate("today")}>{t("el.datepicker.today")}</ElButton>
            </div>
          )}
        </>}
      </div>
      <div className="el-calendar__body">
        {validatedRange.length === 0 ? (
          <CalendarTable date={date} selectedDay={selectedDay} firstDayOfWeek={firstDayOfWeek} weekDays={weekDays} renderDateCell={renderDateCell} onPick={pickDay} />
        ) : validatedRange.map((part, index) => (
          <CalendarTable key={`${part[0].getTime()}-${part[1].getTime()}`} date={part[0]} selectedDay={selectedDay} range={part} hideHeader={index !== 0} firstDayOfWeek={firstDayOfWeek} weekDays={weekDays} renderDateCell={renderDateCell} onPick={pickDay} />
        ))}
      </div>
    </div>
  );
});
