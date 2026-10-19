/**
 * 官方 packages/components/time-select/src/utils.ts 的直译，
 * 另加一个补上 dayjs format 语义的 formatWith（项目未引入 dayjs）。
 *
 * 官方依赖 dayjs(customParseFormat) 把 "HH:mm" 原串按 format 渲染，
 * 时间选择只用得到时/分/秒与 AM-PM 这几个 token，这里实现等价子集。
 */

export interface Time {
  hours: number;
  minutes: number;
}

/** 对应官方 time-select.ts 的三个默认值常量。 */
export const DEFAULT_START = "09:00";
export const DEFAULT_END = "18:00";
export const DEFAULT_STEP = "00:30";

/** 对应官方 parseTime：解析 "HH:mm" 或 "hh:mm A" 形态的字符串。 */
export function parseTime(time: string): Time | null {
  const values = (time || "").split(":");
  if (values.length >= 2) {
    let hours = Number.parseInt(values[0], 10);
    const minutes = Number.parseInt(values[1], 10);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return null;

    const timeUpper = time.toUpperCase();
    if (timeUpper.includes("AM") && hours === 12) {
      hours = 0;
    } else if (timeUpper.includes("PM") && hours !== 12) {
      hours += 12;
    }
    return { hours, minutes };
  }

  return null;
}

export function isValidTime(time: Time | null): time is Time {
  return (
    !!time &&
    time.hours >= 0 &&
    time.minutes >= 0 &&
    !Number.isNaN(time.hours) &&
    !Number.isNaN(time.minutes)
  );
}

export function compareTime(time1: string, time2: string): number {
  const value1 = parseTime(time1);
  if (!value1) return -1;
  const value2 = parseTime(time2);
  if (!value2) return -1;
  const minutes1 = value1.minutes + value1.hours * 60;
  const minutes2 = value2.minutes + value2.hours * 60;
  if (minutes1 === minutes2) return 0;
  return minutes1 > minutes2 ? 1 : -1;
}

export function padTime(time: number | string): string {
  return `${time}`.padStart(2, "0");
}

export function formatTime(time: Time): string {
  return `${padTime(time.hours)}:${padTime(time.minutes)}`;
}

export function nextTime(time: string, step: string): string {
  const timeValue = parseTime(time);
  if (!timeValue) return "";

  const stepValue = parseTime(step);
  if (!stepValue) return "";

  const next = { hours: timeValue.hours, minutes: timeValue.minutes };
  next.minutes += stepValue.minutes;
  next.hours += stepValue.hours;
  next.hours += Math.floor(next.minutes / 60);
  next.minutes = next.minutes % 60;
  return formatTime(next);
}

/** 对应官方组件内的 getValidTimeOrDefault：非法值回退默认并告警。 */
export function getValidTimeOrDefault(
  value: string,
  propName: "start" | "end" | "step",
  defaultValue: string,
  allowZero = true,
): string {
  const time = parseTime(value);
  if (
    !isValidTime(time) ||
    (!allowZero && time.hours === 0 && time.minutes === 0)
  ) {
    if (process.env.NODE_ENV !== "production") {
      console.warn(
        `[ElTimeSelect] invalid ${propName}, fallback to default ${propName} (${defaultValue}).`,
      );
    }
    return defaultValue;
  }
  return formatTime(time);
}

/**
 * 按 dayjs 的 format 语义渲染时刻，支持时间范围内的 token：
 *   HH/H 24 小时、hh/h 12 小时、mm/m、ss/s、A/a 上下午、[..] 字面量。
 * meridiem 由调用方按语言包注入（英文 AM/PM，中文 上午/下午）。
 */
export function formatWith(
  raw: string,
  format: string,
  meridiem: (hours: number) => string,
): string {
  const time = parseTime(raw);
  if (!time) return raw;

  const { hours, minutes } = time;
  const hour12 = hours % 12 || 12;

  // 交替顺序必须长 token 在前，否则 "HH" 会被 "H" 先吃掉
  return format.replace(
    /\[([^\]]*)\]|HH|H|hh|h|mm|m|ss|s|A|a/g,
    (match, literal: string | undefined) => {
      if (literal !== undefined) return literal;
      switch (match) {
        case "HH":
          return padTime(hours);
        case "H":
          return String(hours);
        case "hh":
          return padTime(hour12);
        case "h":
          return String(hour12);
        case "mm":
          return padTime(minutes);
        case "m":
          return String(minutes);
        case "ss":
          return "00";
        case "s":
          return "0";
        case "A":
          return meridiem(hours);
        case "a":
          return meridiem(hours).toLowerCase();
        default:
          return match;
      }
    },
  );
}

/** 正则转义，对应官方 escapeStringRegexp，用于按输入过滤选项。 */
export function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
