/** 对应官方 time-picker/src/common/props.ts 里的类型别名。 */
import type { Day } from "./datetime";

export type DateModelType = number | string | Date;
export type ModelValueType =
  | DateModelType
  | number[]
  | string[]
  | Date[];
export type SingleOrRange<T> = T | [T, T];
export type DayOrDays = SingleOrRange<Day>;
export type DateOrDates = SingleOrRange<Date>;
export type UserInput = SingleOrRange<string | null>;

export type GetDisabledHours = (role: string, comparingDate?: Day) => number[];
export type GetDisabledMinutes = (
  hour: number,
  role: string,
  comparingDate?: Day,
) => number[];
export type GetDisabledSeconds = (
  hour: number,
  minute: number,
  role: string,
  comparingDate?: Day,
) => number[];
