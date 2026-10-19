/** 对应官方 time-picker/src/composables/use-time-picker.ts 与 use-time-panel.ts。 */
import { makeList, type Day } from "./datetime";
import type {
  GetDisabledHours,
  GetDisabledMinutes,
  GetDisabledSeconds,
} from "./types";

/** 把 makeList 产出的布尔表压回「可选值索引」数组。 */
function makeAvailableArr(disabledList: boolean[]): number[] {
  return disabledList
    .map((isDisabled, index) => (isDisabled ? true : index))
    .filter((value): value is number => value !== true);
}

/**
 * 对应官方 getTimeLists：三张禁用表，compare 为范围选择时用于互相约束的对侧时间。
 */
export function getTimeLists(
  disabledHours?: GetDisabledHours,
  disabledMinutes?: GetDisabledMinutes,
  disabledSeconds?: GetDisabledSeconds,
) {
  const getHoursList = (role: string, compare?: Day) =>
    makeList(24, disabledHours && (() => disabledHours(role, compare)));

  const getMinutesList = (hour: number, role: string, compare?: Day) =>
    makeList(
      60,
      disabledMinutes && (() => disabledMinutes(hour, role, compare)),
    );

  const getSecondsList = (
    hour: number,
    minute: number,
    role: string,
    compare?: Day,
  ) =>
    makeList(
      60,
      disabledSeconds && (() => disabledSeconds(hour, minute, role, compare)),
    );

  return { getHoursList, getMinutesList, getSecondsList };
}

/**
 * 对应官方 buildAvailableTimeSlotGetter：把禁用表反转成可用值数组。
 * 范围模式的 had 语义靠它把「越界的小时」也剔除掉。
 */
export function buildAvailableTimeSlotGetter(
  disabledHours: GetDisabledHours,
  disabledMinutes: GetDisabledMinutes,
  disabledSeconds: GetDisabledSeconds,
) {
  const { getHoursList, getMinutesList, getSecondsList } = getTimeLists(
    disabledHours,
    disabledMinutes,
    disabledSeconds,
  );

  const getAvailableHours: GetDisabledHours = (role, compare) =>
    makeAvailableArr(getHoursList(role, compare));

  const getAvailableMinutes: GetDisabledMinutes = (hour, role, compare) =>
    makeAvailableArr(getMinutesList(hour, role, compare));

  const getAvailableSeconds: GetDisabledSeconds = (
    hour,
    minute,
    role,
    compare,
  ) => makeAvailableArr(getSecondsList(hour, minute, role, compare));

  return { getAvailableHours, getAvailableMinutes, getAvailableSeconds };
}

/** 对应官方 useTimePanel 的 getAvailableTime 所依赖的取数表。 */
export interface TimePanelGetters {
  getAvailableHours: GetDisabledHours;
  getAvailableMinutes: GetDisabledMinutes;
  getAvailableSeconds: GetDisabledSeconds;
}

/**
 * 读 / 写 Day 的时分秒。
 * 官方用 result[type]() 的动态下标调用，React 侧 Day 的方法带重载，
 * 动态下标会因重载签名不兼容报错，这里显式展开分支。
 */
function readPart(day: Day, type: "hour" | "minute" | "second") {
  if (type === "hour") return day.hour();
  if (type === "minute") return day.minute();
  return day.second();
}

function writePart(day: Day, type: "hour" | "minute" | "second", value: number) {
  if (type === "hour") return day.hour(value);
  if (type === "minute") return day.minute(value);
  return day.second(value);
}

/**
 * 对应官方 useTimePanel 的 getAvailableTime：逐级把时间收敛到最近的可用值。
 *
 * first 为 true 时取第一个可用槽位（起始时间向前找），否则取最后一个（结束时间向后找）；
 * 这决定了范围面板里越界值被修正的方向。
 */
export function getAvailableTime(
  { getAvailableHours, getAvailableMinutes, getAvailableSeconds }: TimePanelGetters,
  date: Day,
  role: string,
  first: boolean,
  compareDate?: Day,
): Day {
  let result = date;

  (["hour", "minute", "second"] as const).forEach((type) => {
    let availableTimeSlots: number[];
    switch (type) {
      case "minute":
        availableTimeSlots = getAvailableMinutes(
          result.hour(),
          role,
          compareDate,
        );
        break;
      case "second":
        availableTimeSlots = getAvailableSeconds(
          result.hour(),
          result.minute(),
          role,
          compareDate,
        );
        break;
      default:
        availableTimeSlots = getAvailableHours(role, compareDate);
        break;
    }

    if (
      availableTimeSlots?.length &&
      !availableTimeSlots.includes(readPart(result, type))
    ) {
      const pos = first ? 0 : availableTimeSlots.length - 1;
      result = writePart(result, type, availableTimeSlots[pos]);
    }
  });

  return result;
}
