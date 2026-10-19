import type { Dayjs } from "dayjs";

const timeUnits = [
  ["Y", 1000 * 60 * 60 * 24 * 365], // years
  ["M", 1000 * 60 * 60 * 24 * 30], // months
  ["D", 1000 * 60 * 60 * 24], // days
  ["H", 1000 * 60 * 60], // hours
  ["m", 1000 * 60], // minutes
  ["s", 1000], // seconds
  ["S", 1], // million seconds
] as const;

export function getTime(value: number | Dayjs) {
  return typeof value === "number" ? new Date(value).getTime() : value.valueOf();
}

export function formatTime(timestamp: number, format: string) {
  let timeLeft = timestamp;
  const escapeRegex = /\[([^\]]*)]/g;

  const replacedText = timeUnits.reduce((current, [name, unit]) => {
    // 只替换方括号外的占位符，方括号内的内容稍后原样保留
    const replaceRegex = new RegExp(`${name}+(?![^\\[\\]]*\\])`, "g");
    if (replaceRegex.test(current)) {
      const value = Math.floor(timeLeft / unit);
      timeLeft -= value * unit;
      return current.replace(replaceRegex, (match) =>
        String(value).padStart(match.length, "0"),
      );
    }
    return current;
  }, format);

  return replacedText.replace(escapeRegex, "$1");
}
