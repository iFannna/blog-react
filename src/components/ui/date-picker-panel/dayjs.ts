import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import customParseFormat from "dayjs/plugin/customParseFormat";
import dayOfYear from "dayjs/plugin/dayOfYear";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import localeData from "dayjs/plugin/localeData";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
// 与官方一致：只直接注册中文语言包，其它语言由 dayjs 回退
import "dayjs/locale/zh-cn";

import type { Dayjs } from "dayjs";

dayjs.extend(localeData);
dayjs.extend(advancedFormat);
dayjs.extend(customParseFormat);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);
dayjs.extend(dayOfYear);
dayjs.extend(isSameOrAfter);
dayjs.extend(isSameOrBefore);

export { dayjs };
export type { Dayjs } from "dayjs";

/** 面板依赖实例上的 $locale() 取周起始日，类型里没有声明。 */
export function getWeekStart(date: Dayjs): number {
  const locale = (
    date as Dayjs & { $locale: () => { weekStart?: number } }
  ).$locale();
  return locale.weekStart || 7;
}
