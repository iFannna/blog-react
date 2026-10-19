export type CalendarDateType = "prev-month" | "next-month" | "prev-year" | "next-year" | "today";
export type CalendarCellType = "prev" | "current" | "next";

export interface CalendarCell {
  text: number;
  type: CalendarCellType;
}

export const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
export const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);
export const endOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
export const addMonths = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount, 1);
export const addYears = (date: Date, amount: number) => new Date(date.getFullYear() + amount, date.getMonth(), 1);

export const addDays = (date: Date, amount: number) => {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return startOfDay(result);
};

export const isSameDay = (left?: Date, right?: Date) =>
  !!left && !!right && left.getFullYear() === right.getFullYear() &&
  left.getMonth() === right.getMonth() && left.getDate() === right.getDate();

export const startOfWeek = (date: Date, firstDayOfWeek: number) =>
  addDays(date, -((date.getDay() - firstDayOfWeek + 7) % 7));

export const endOfWeek = (date: Date, firstDayOfWeek: number) =>
  addDays(startOfWeek(date, firstDayOfWeek), 6);

export const formatDate = (date: Date) => {
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${date.getFullYear()}-${month}-${day}`;
};

export function buildMonthRows(date: Date, firstDayOfWeek: number) {
  const firstDay = startOfMonth(date);
  const previousCount = (firstDay.getDay() - firstDayOfWeek + 7) % 7;
  const previousLastDay = endOfMonth(addMonths(date, -1)).getDate();
  const currentCount = endOfMonth(date).getDate();
  const cells: CalendarCell[] = [];

  for (let index = previousCount; index > 0; index -= 1) {
    cells.push({ text: previousLastDay - index + 1, type: "prev" });
  }
  for (let day = 1; day <= currentCount; day += 1) cells.push({ text: day, type: "current" });
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= remaining; day += 1) cells.push({ text: day, type: "next" });

  return Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7));
}

export function getCellDate(date: Date, cell: CalendarCell) {
  const month = cell.type === "prev" ? addMonths(date, -1) : cell.type === "next" ? addMonths(date, 1) : date;
  return new Date(month.getFullYear(), month.getMonth(), cell.text);
}

const isSameWeek = (left: Date, right: Date, firstDayOfWeek: number) =>
  isSameDay(startOfWeek(left, firstDayOfWeek), startOfWeek(right, firstDayOfWeek));

export function calculateValidatedDateRange(start: Date, end: Date, firstDayOfWeek: number): [Date, Date][] {
  const firstDay = startOfWeek(start, firstDayOfWeek);
  const lastDay = endOfWeek(end, firstDayOfWeek);
  const monthDistance = (lastDay.getFullYear() - firstDay.getFullYear()) * 12 + lastDay.getMonth() - firstDay.getMonth();
  if (monthDistance === 0) return [[firstDay, lastDay]];
  if (monthDistance < 0 || monthDistance > 2) return [];

  const ranges: [Date, Date][] = [];
  let rangeStart = firstDay;
  for (let offset = 0; offset <= monthDistance; offset += 1) {
    const month = addMonths(firstDay, offset);
    const monthEnd = endOfMonth(month);
    ranges.push([rangeStart, offset === monthDistance ? lastDay : monthEnd]);
    if (offset < monthDistance) {
      const nextMonth = addMonths(month, 1);
      rangeStart = isSameWeek(monthEnd, nextMonth, firstDayOfWeek)
        ? addDays(startOfWeek(nextMonth, firstDayOfWeek), 7)
        : startOfWeek(nextMonth, firstDayOfWeek);
    }
  }
  return ranges.filter(([rangeStartDate, rangeEndDate]) => rangeStartDate <= rangeEndDate);
}

export function buildRangeRows(start: Date, end: Date) {
  const cells: CalendarCell[] = [];
  const currentMonth = start.getMonth();
  for (let cursor = startOfDay(start); cursor <= end; cursor = addDays(cursor, 1)) {
    cells.push({ text: cursor.getDate(), type: cursor.getMonth() === currentMonth ? "current" : "next" });
  }
  const remaining = (7 - (cells.length % 7)) % 7;
  for (let day = 1; day <= remaining; day += 1) cells.push({ text: day, type: "next" });
  return Array.from({ length: cells.length / 7 }, (_, index) => cells.slice(index * 7, index * 7 + 7));
}
