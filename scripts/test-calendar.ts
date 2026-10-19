import assert from "node:assert/strict";
import { test } from "node:test";
import {
  addMonths,
  addYears,
  buildMonthRows,
  buildRangeRows,
  calculateValidatedDateRange,
  formatDate,
  getCellDate,
} from "../src/components/element-plus/calendar/date-utils.ts";

const date = (year: number, month: number, day: number) => new Date(year, month - 1, day);

test("leap-year month has 29 current days and complete weeks", () => {
  const rows = buildMonthRows(date(2024, 2, 1), 1);
  assert.equal(rows.flat().filter((cell) => cell.type === "current").length, 29);
  assert.ok(rows.every((row) => row.length === 7));
  assert.deepEqual(rows[0][0], { text: 29, type: "prev" });
});

test("a four-week month does not append an extra week", () => {
  assert.equal(buildMonthRows(date(2021, 2, 1), 1).length, 4);
});

test("weekday order is reflected in month padding", () => {
  const sunday = buildMonthRows(date(2026, 10, 1), 0);
  const monday = buildMonthRows(date(2026, 10, 1), 1);
  assert.equal(formatDate(getCellDate(date(2026, 10, 1), sunday[0][0])), "2026-09-27");
  assert.equal(formatDate(getCellDate(date(2026, 10, 1), monday[0][0])), "2026-09-28");
});

test("month and year navigation clamp to first day", () => {
  assert.equal(formatDate(addMonths(date(2024, 1, 31), 1)), "2024-02-01");
  assert.equal(formatDate(addMonths(date(2024, 12, 31), 1)), "2025-01-01");
  assert.equal(formatDate(addYears(date(2024, 2, 29), -1)), "2023-02-01");
});

test("range example stays within three complete weeks", () => {
  const ranges = calculateValidatedDateRange(date(2019, 3, 4), date(2019, 3, 24), 1);
  assert.equal(ranges.length, 1);
  assert.equal(buildRangeRows(...ranges[0]).length, 3);
});

test("adjacent-month ranges do not repeat the shared week", () => {
  const ranges = calculateValidatedDateRange(date(2024, 1, 29), date(2024, 2, 18), 1);
  assert.deepEqual(ranges.map(([start, end]) => [formatDate(start), formatDate(end)]), [
    ["2024-01-29", "2024-01-31"],
    ["2024-02-05", "2024-02-18"],
  ]);
  const allDates = ranges.flatMap(([start, end]) => buildRangeRows(start, end).flat().map((cell) => formatDate(getCellDate(start, cell))));
  assert.equal(new Set(allDates).size, allDates.length);
  assert.equal(allDates.length, 21);
});

test("ranges spanning year end have complete continuous weeks", () => {
  const ranges = calculateValidatedDateRange(date(2024, 12, 20), date(2025, 1, 15), 1);
  const allDates = ranges.flatMap(([start, end]) => buildRangeRows(start, end).flat().map((cell) => formatDate(getCellDate(start, cell))));
  assert.equal(allDates[0], "2024-12-16");
  assert.equal(allDates.at(-1), "2025-01-19");
  assert.equal(new Set(allDates).size, 35);
});

test("week expansion can produce three month segments", () => {
  const ranges = calculateValidatedDateRange(date(2021, 1, 30), date(2021, 2, 28), 1);
  const allDates = ranges.flatMap(([start, end]) => buildRangeRows(start, end).flat().map((cell) => formatDate(getCellDate(start, cell))));
  assert.equal(allDates[0], "2021-01-25");
  assert.equal(allDates.at(-1), "2021-02-28");
  assert.equal(new Set(allDates).size, allDates.length);
});
