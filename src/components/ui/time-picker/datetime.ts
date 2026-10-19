/**
 * 官方用 dayjs 承载时间面板里的日期对象：hour()/minute()/second() 返回新实例并可链式调用。
 * 本项目未引入 dayjs，这里用原生 Date 复刻同一套「不可变 + 链式」语义，
 * 方法名与官方保持一致，便于与 panel / spinner 源码逐行对照。
 */

export const timeUnits = ["hours", "minutes", "seconds"] as const;

export type TimeUnit = (typeof timeUnits)[number];

export const DEFAULT_FORMATS_TIME = "HH:mm:ss";

export type DateInput = number | string | Date | Day | null | undefined;

/** 官方 utils 里的 isArray / isDate / isEmpty 的等价实现。 */
export function isArray(value: unknown): value is unknown[] {
  return Array.isArray(value);
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date;
}

export function isEmpty(value: unknown) {
  if (value === null || value === undefined) return true;
  if (typeof value === "string") return value.trim() === "";
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === "object") return Object.keys(value).length === 0;
  return false;
}

function pad(value: number, length = 2) {
  return String(Math.abs(value)).padStart(length, "0");
}

function toMillis(input: DateInput): number {
  if (input === null || input === undefined) return Date.now();
  if (input instanceof Day) return input.valueOf();
  if (input instanceof Date) return input.getTime();
  if (typeof input === "number") return input;
  if (typeof input === "string") {
    if (input.trim() === "") return NaN;
    return new Date(input).getTime();
  }
  return NaN;
}

/** 与官方 dayjs 的格式化 token 对齐，子集覆盖 date formats 文档里的常用项。 */
const TOKEN_RE =
  /\[([^\]]*)\]|YYYY|YY|MM|M|DD|D|HH|H|hh|h|mm|m|ss|s|SSS|A|a|x/g;

type DayUnit = "year" | "month" | "date" | "hour" | "minute" | "second" | "millisecond";

const UNIT_GET: Record<DayUnit, (date: Date) => number> = {
  year: (d) => d.getFullYear(),
  month: (d) => d.getMonth(),
  date: (d) => d.getDate(),
  hour: (d) => d.getHours(),
  minute: (d) => d.getMinutes(),
  second: (d) => d.getSeconds(),
  millisecond: (d) => d.getMilliseconds(),
};

const UNIT_SET: Record<DayUnit, (date: Date, value: number) => void> = {
  year: (d, v) => d.setFullYear(v),
  month: (d, v) => d.setMonth(v),
  date: (d, v) => d.setDate(v),
  hour: (d, v) => d.setHours(v),
  minute: (d, v) => d.setMinutes(v),
  second: (d, v) => d.setSeconds(v),
  millisecond: (d, v) => d.setMilliseconds(v),
};

/**
 * 对应官方 Dayjs 实例的用法子集。
 *
 * 注意 hour() / minute() / second() 同时承担读与写：
 * 官方靠 dayjs 的重载实现，这里用 TS 重载签名表达同样的两种调用方式。
 */
export class Day {
  private readonly ms: number;

  constructor(input?: DateInput) {
    this.ms = toMillis(input);
  }

  get isValid() {
    return !Number.isNaN(this.ms);
  }

  toDate(): Date {
    return new Date(this.ms);
  }

  valueOf(): number {
    return this.ms;
  }

  private reach(unit: DayUnit, value?: number): number | Day {
    if (value === undefined) return UNIT_GET[unit](this.toDate());
    const date = this.toDate();
    UNIT_SET[unit](date, value);
    return new Day(date);
  }

  year(): number;
  year(value: number): Day;
  year(value?: number): number | Day {
    return this.reach("year", value);
  }

  month(): number;
  month(value: number): Day;
  month(value?: number): number | Day {
    return this.reach("month", value);
  }

  date(): number;
  date(value: number): Day;
  date(value?: number): number | Day {
    return this.reach("date", value);
  }

  hour(): number;
  hour(value: number): Day;
  hour(value?: number): number | Day {
    return this.reach("hour", value);
  }

  minute(): number;
  minute(value: number): Day;
  minute(value?: number): number | Day {
    return this.reach("minute", value);
  }

  second(): number;
  second(value: number): Day;
  second(value?: number): number | Day {
    return this.reach("second", value);
  }

  millisecond(): number;
  millisecond(value: number): Day;
  millisecond(value?: number): number | Day {
    return this.reach("millisecond", value);
  }

  /** 对应官方 dayjs().add(n, unit)，时间面板只用得到分钟。 */
  add(amount: number, unit: string): Day {
    const date = this.toDate();
    if (unit === "m" || unit === "minute" || unit === "minutes") {
      date.setMinutes(date.getMinutes() + amount);
    } else if (unit === "h" || unit === "hour" || unit === "hours") {
      date.setHours(date.getHours() + amount);
    } else if (unit === "s" || unit === "second" || unit === "seconds") {
      date.setSeconds(date.getSeconds() + amount);
    } else if (unit === "d" || unit === "day" || unit === "days") {
      date.setDate(date.getDate() + amount);
    }
    return new Day(date);
  }

  format(template: string = DEFAULT_FORMATS_TIME): string {
    if (!this.isValid) return "";
    const date = this.toDate();
    const hours24 = date.getHours();
    const hours12 = hours24 % 12 || 12;
    const meridiem = hours24 < 12 ? "am" : "pm";

    return template.replace(TOKEN_RE, (match, literal?: string) => {
      // 方括号内的字面量原样输出，与 dayjs 一致
      if (literal !== undefined) return literal;
      switch (match) {
        case "YYYY":
          return pad(date.getFullYear(), 4);
        case "YY":
          return pad(date.getFullYear() % 100);
        case "MM":
          return pad(date.getMonth() + 1);
        case "M":
          return String(date.getMonth() + 1);
        case "DD":
          return pad(date.getDate());
        case "D":
          return String(date.getDate());
        case "HH":
          return pad(hours24);
        case "H":
          return String(hours24);
        case "hh":
          return pad(hours12);
        case "h":
          return String(hours12);
        case "mm":
          return pad(date.getMinutes());
        case "m":
          return String(date.getMinutes());
        case "ss":
          return pad(date.getSeconds());
        case "s":
          return String(date.getSeconds());
        case "SSS":
          return pad(date.getMilliseconds(), 3);
        case "A":
          return meridiem.toUpperCase();
        case "a":
          return meridiem;
        case "x":
          return String(this.ms);
        default:
          return match;
      }
    });
  }

  isSame(other: unknown): boolean {
    return other instanceof Day ? other.ms === this.ms : false;
  }
}

/** 对应官方 utils 的 parseDate：无法解析时返回 undefined。 */
export function parseDate(input: DateInput, format?: string): Day | undefined {
  if (isEmpty(format) || format === "x") {
    const day = new Day(input);
    return day.isValid ? day : undefined;
  }
  return parseByFormat(input, format as string);
}

/** 对应官方 utils 的 formatter。 */
export function formatter(
  date: Date | Day | string | number,
  format: string | undefined,
): Date | Day | string | number {
  if (isEmpty(format)) return date;
  if (format === "x") return +date;
  return new Day(date as DateInput).format(format);
}

const PATTERN_MAP: Record<string, string> = {
  YYYY: "(\\d{4})",
  YY: "(\\d{2})",
  MM: "(\\d{1,2})",
  M: "(\\d{1,2})",
  DD: "(\\d{1,2})",
  D: "(\\d{1,2})",
  HH: "(\\d{1,2})",
  H: "(\\d{1,2})",
  hh: "(\\d{1,2})",
  h: "(\\d{1,2})",
  mm: "(\\d{1,2})",
  m: "(\\d{1,2})",
  ss: "(\\d{1,2})",
  s: "(\\d{1,2})",
  SSS: "(\\d{1,3})",
  A: "([AaPp][Mm])",
  a: "([AaPp][Mm])",
};

function escapeRegExp(text: string) {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * 对应官方 dayjs(date, format) 的解析：按 format 的 token 逐个从字符串里取值。
 * 输入框手动编辑后靠它还原成日期（官方走 customParseFormat 插件）。
 */
function parseByFormat(input: DateInput, format: string): Day | undefined {
  if (input instanceof Date || typeof input === "number") {
    const day = new Day(input);
    return day.isValid ? day : undefined;
  }
  if (typeof input !== "string") return undefined;

  const tokens = format.match(TOKEN_RE);
  if (!tokens) return undefined;

  let pattern = "";
  for (const token of tokens) {
    const literal = /^\[([^\]]*)\]$/.exec(token);
    if (literal) {
      pattern += escapeRegExp(literal[1]);
      continue;
    }
    pattern += PATTERN_MAP[token] ?? escapeRegExp(token);
  }

  const matched = new RegExp(`^${pattern}$`).exec(input.trim());
  if (!matched) return undefined;

  const now = new Date();
  const parts: Record<string, number> = {
    year: now.getFullYear(),
    month: now.getMonth(),
    date: now.getDate(),
    hour: 0,
    minute: 0,
    second: 0,
    millisecond: 0,
  };
  let meridiem = "";

  tokens.forEach((token, index) => {
    const raw = matched[index + 1];
    if (raw === undefined) return;
    switch (token) {
      case "YYYY":
        parts.year = Number(raw);
        break;
      case "YY":
        parts.year = 2000 + Number(raw);
        break;
      case "MM":
      case "M":
        parts.month = Number(raw) - 1;
        break;
      case "DD":
      case "D":
        parts.date = Number(raw);
        break;
      case "HH":
      case "H":
        parts.hour = Number(raw);
        break;
      case "hh":
      case "h":
        parts.hour = Number(raw);
        break;
      case "mm":
      case "m":
        parts.minute = Number(raw);
        break;
      case "ss":
      case "s":
        parts.second = Number(raw);
        break;
      case "SSS":
        parts.millisecond = Number(raw);
        break;
      case "A":
      case "a":
        meridiem = raw.toLowerCase();
        break;
      default:
        break;
    }
  });

  if (meridiem) {
    const hour = parts.hour % 12;
    parts.hour = meridiem === "pm" ? hour + 12 : hour;
  }

  const result = new Day(
    new Date(
      parts.year,
      parts.month,
      parts.date,
      parts.hour,
      parts.minute,
      parts.second,
      parts.millisecond,
    ),
  );
  return result.isValid ? result : undefined;
}

/** 对应官方 utils 的 dateEquals。 */
export function dateEquals(a: unknown, b: unknown) {
  const aIsDate = isDate(a) || a instanceof Day;
  const bIsDate = isDate(b) || b instanceof Day;
  if (aIsDate && bIsDate) {
    return new Day(a as DateInput).valueOf() === new Day(b as DateInput).valueOf();
  }
  if (!aIsDate && !bIsDate) return a === b;
  return false;
}

/** 对应官方 utils 的 valueEquals。 */
export function valueEquals(a: unknown, b: unknown) {
  const aIsArray = isArray(a);
  const bIsArray = isArray(b);
  if (aIsArray && bIsArray) {
    if (a.length !== b.length) return false;
    return a.every((item, index) => dateEquals(item, b[index]));
  }
  if (!aIsArray && !bIsArray) return dateEquals(a, b);
  return false;
}

/** 面板里比较「可用时间修正前后的结果」是否相等，对应官方 lodash isEqual 的用法。 */
export function isEqualDayOrDays(a: unknown, b: unknown) {
  const toMillisList = (value: unknown) =>
    isArray(value)
      ? value.map((item) => (item instanceof Day ? item.valueOf() : item))
      : value instanceof Day
        ? value.valueOf()
        : value;

  return JSON.stringify(toMillisList(a)) === JSON.stringify(toMillisList(b));
}

/** 对应官方 utils 的 dayOrDaysToDate。 */
export function dayOrDaysToDate(dayOrDays: Day | Day[]): Date | [Date, Date] {
  return isArray(dayOrDays)
    ? (dayOrDays.map((day) => day.toDate()) as [Date, Date])
    : dayOrDays.toDate();
}

/** 对应官方 utils 的 makeList。 */
export function makeList(total: number, method?: () => number[]): boolean[] {
  const list: boolean[] = [];
  const disabledList = method?.();
  for (let i = 0; i < total; i++) {
    list.push(disabledList?.includes(i) ?? false);
  }
  return list;
}

export type TimeList = [number | undefined, number, number | undefined];

/** 对应官方 utils 的 buildTimeList（arrow-control 模式只渲染相邻三项）。 */
export function buildTimeList(value: number, bound: number): TimeList {
  return [
    value > 0 ? value - 1 : undefined,
    value,
    value < bound ? value + 1 : undefined,
  ];
}

/** 对应官方 utils 的 rangeArr。 */
export function rangeArr(length: number) {
  return Array.from(Array.from({ length }).keys());
}
