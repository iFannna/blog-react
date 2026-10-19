"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import { useTranslator } from "../config-provider/context";
import { TimeSpinner } from "./TimeSpinner";
import type { DateInput, Day } from "./datetime";
import {
  buildAvailableTimeSlotGetter,
  getAvailableTime,
  type TimePanelGetters,
} from "./use-time-picker";
import type {
  GetDisabledHours,
  GetDisabledMinutes,
  GetDisabledSeconds,
} from "./types";

/** 对应官方 EVENT_CODE 里面板用到的四个方向键。 */
const KEY_CODES = {
  left: "ArrowLeft",
  right: "ArrowRight",
  up: "ArrowUp",
  down: "ArrowDown",
};

/** 对应官方 lodash union：合并去重并保持先后顺序。 */
function union(left: number[], right: number[]) {
  const result = [...left];
  right.forEach((item) => {
    if (!result.includes(item)) result.push(item);
  });
  return result;
}

/** 对应官方 panel-time-range 的 makeSelectRange。 */
function makeSelectRange(start: number, end: number): number[] {
  const result: number[] = [];
  for (let i = start; i <= end; i += 1) result.push(i);
  return result;
}

/** 面板对外的命令式方法，对应官方 ref 上的调用。 */
export interface TimePanelExpose {
  handleKeydown: (event: React.KeyboardEvent) => void;
}

/**
 * 对应官方 useOldValue：记录面板打开前的值，取消时回滚。
 *
 * visible 变为 false 时刷新为当前解析值；打开且当前值为空值时取 valueOnClear，
 * 与官方 watch 的两个分支一一对应。写入放在 effect 里，避免渲染期改 ref。
 */
function useOldValue<T>(
  parsedValue: T,
  visible: boolean,
  isEmptyValue: boolean,
  valueOnClear: DateInput,
) {
  const oldValueRef = useRef<T | DateInput>(parsedValue);

  useEffect(() => {
    // 打开时若当前值为空则回落到清空值，关闭后回到最新解析值
    oldValueRef.current = visible
      ? isEmptyValue
        ? valueOnClear
        : parsedValue
      : parsedValue;
    // 与官方 watch(visible) 一致：只在 visible 变化时刷新
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  return oldValueRef;
}

export interface TimePanelProps {
  /** 面板当前值 */
  parsedValue: Day;
  /** 面板是否可见。官方用它挡住关闭动画期间的滚动输入 */
  visible: boolean;
  format: string;
  arrowControl?: boolean;
  disabledHours?: GetDisabledHours;
  disabledMinutes?: GetDisabledMinutes;
  disabledSeconds?: GetDisabledSeconds;
  /** 对应官方 datetimeRole，透传给 spinner 的 role */
  datetimeRole?: string;
  isRange?: boolean;
  saveOnBlur?: boolean;
  /** 当前绑定值是否为空值（供 useOldValue 判断） */
  valueIsEmpty?: boolean;
  /** 清空时写回的值 */
  valueOnClear?: DateInput;
  onPick: (value: Day | [Day, Day] | null, visible: boolean) => void;
  onSelectRange: (start: number, end: number) => void;
}

/**
 * 对应官方 panel-time-pick.vue（单点时间面板）。
 *
 * 结构：.el-time-panel > .el-time-panel__content(.has-seconds?) > TimeSpinner
 *                     + .el-time-panel__footer > 取消 / 确定
 */
export const TimePanel = ({
  ref,
  parsedValue,
  visible,
  format,
  arrowControl,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  datetimeRole,
  isRange,
  saveOnBlur,
  valueIsEmpty = false,
  valueOnClear,
  onPick,
  onSelectRange,
}: TimePanelProps & { ref?: Ref<TimePanelExpose> }) => {
  const t = useTranslator();
  const [selectionRange, setSelectionRangeState] = useState<[number, number]>([
    0, 2,
  ]);
  const timePickerOptions = useRef<Record<string, (...args: never[]) => void>>({});
  const oldValueRef = useOldValue(parsedValue, visible, valueIsEmpty, valueOnClear);

  const showSeconds = format.includes("ss");
  const amPmMode = format.includes("A") ? "A" : format.includes("a") ? "a" : "";

  const handleSelectRange = useCallback(
    (start: number, end: number) => {
      onSelectRange(start, end);
      setSelectionRangeState([start, end]);
    },
    [onSelectRange],
  );

  const changeSelectionRange = (step: number) => {
    const hourIndex = format.indexOf("HH");
    const minuteIndex = format.indexOf("mm");
    const secondIndex = format.indexOf("ss");
    const list: number[] = [];
    const mapping: string[] = [];
    if (hourIndex !== -1) {
      list.push(hourIndex);
      mapping.push("hours");
    }
    if (minuteIndex !== -1) {
      list.push(minuteIndex);
      mapping.push("minutes");
    }
    if (secondIndex !== -1 && showSeconds) {
      list.push(secondIndex);
      mapping.push("seconds");
    }

    const index = list.indexOf(selectionRange[0]);
    const next = (index + step + list.length) % list.length;
    timePickerOptions.current["start_emitSelectRange"]?.(mapping[next] as never);
  };

  useImperativeHandle(
    ref,
    () => ({
      handleKeydown: (event: React.KeyboardEvent) => {
        const code = event.key;
        if (code === KEY_CODES.left || code === KEY_CODES.right) {
          changeSelectionRange(code === KEY_CODES.left ? -1 : 1);
          event.preventDefault();
          return;
        }
        if (code === KEY_CODES.up || code === KEY_CODES.down) {
          timePickerOptions.current["start_scrollDown"]?.(
            (code === KEY_CODES.up ? -1 : 1) as never,
          );
          event.preventDefault();
        }
      },
    }),
    // 与官方一致：按键行为读最新选区，故每次渲染重建
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectionRange, showSeconds, format],
  );

  const getters = buildAvailableTimeSlotGetter(
    disabledHours ?? (() => []),
    disabledMinutes ?? (() => []),
    disabledSeconds ?? (() => []),
  );

  const handleChange = (date: Day) => {
    // visible 为 false 时不处理，避免关闭动画期间的滚动误改值（官方注释同此）
    if (!visible) return;
    onPick(
      getAvailableTime(getters, date, datetimeRole || "", true).millisecond(0),
      true,
    );
  };

  return (
    <div className="el-time-panel">
      <div
        className={["el-time-panel__content", showSeconds && "has-seconds"]
          .filter(Boolean)
          .join(" ")}
      >
        <TimeSpinner
          role={datetimeRole || "start"}
          spinnerDate={parsedValue}
          showSeconds={showSeconds}
          amPmMode={amPmMode}
          arrowControl={arrowControl}
          disabledHours={disabledHours}
          disabledMinutes={disabledMinutes}
          disabledSeconds={disabledSeconds}
          format={format}
          isRange={isRange}
          saveOnBlur={saveOnBlur}
          onChange={handleChange}
          onSelectRange={handleSelectRange}
          onSetOption={(key, value) => {
            timePickerOptions.current[key] = value;
          }}
        />
      </div>
      <div className="el-time-panel__footer">
        <button
          type="button"
          className="el-time-panel__btn cancel"
          onClick={() => onPick((oldValueRef.current as Day | null) ?? null, false)}
        >
          {t("el.datepicker.cancel")}
        </button>
        <button
          type="button"
          className="el-time-panel__btn confirm"
          onClick={() => onPick(parsedValue, false)}
        >
          {t("el.datepicker.confirm")}
        </button>
      </div>
    </div>
  );
};

/** 范围面板的互斥禁用表：左侧不得越过右侧，右侧不得早于左侧。 */
export function buildRangeDisabledLists(
  disabledHours: GetDisabledHours | undefined,
  disabledMinutes: GetDisabledMinutes | undefined,
  disabledSeconds: GetDisabledSeconds | undefined,
  startTime: Day,
  endTime: Day,
) {
  const disabledHoursList = (role: string, compare?: Day) => {
    const defaultDisable = disabledHours ? disabledHours(role) : [];
    const isStart = role === "start";
    const compareDate = compare || (isStart ? endTime : startTime);
    const compareHour = compareDate.hour();
    const nextDisable = isStart
      ? makeSelectRange(compareHour + 1, 23)
      : makeSelectRange(0, compareHour - 1);
    return union(defaultDisable, nextDisable);
  };

  const disabledMinutesList = (hour: number, role: string, compare?: Day) => {
    const defaultDisable = disabledMinutes ? disabledMinutes(hour, role) : [];
    const isStart = role === "start";
    const compareDate = compare || (isStart ? endTime : startTime);
    if (hour !== compareDate.hour()) return defaultDisable;
    const compareMinute = compareDate.minute();
    const nextDisable = isStart
      ? makeSelectRange(compareMinute + 1, 59)
      : makeSelectRange(0, compareMinute - 1);
    return union(defaultDisable, nextDisable);
  };

  const disabledSecondsList = (
    hour: number,
    minute: number,
    role: string,
    compare?: Day,
  ) => {
    const defaultDisable = disabledSeconds
      ? disabledSeconds(hour, minute, role)
      : [];
    const isStart = role === "start";
    const compareDate = compare || (isStart ? endTime : startTime);
    if (hour !== compareDate.hour() || minute !== compareDate.minute()) {
      return defaultDisable;
    }
    const compareSecond = compareDate.second();
    const nextDisable = isStart
      ? makeSelectRange(compareSecond + 1, 59)
      : makeSelectRange(0, compareSecond - 1);
    return union(defaultDisable, nextDisable);
  };

  return {
    getters: buildAvailableTimeSlotGetter(
      disabledHoursList,
      disabledMinutesList,
      disabledSecondsList,
    ),
    disabledHoursList,
    disabledMinutesList,
    disabledSecondsList,
  };
}

/** 对应官方 panel-time-range 的 getRangeAvailableTime。 */
export function getRangeAvailableTime(
  start: Day,
  end: Day,
  disabledHours?: GetDisabledHours,
  disabledMinutes?: GetDisabledMinutes,
  disabledSeconds?: GetDisabledSeconds,
): [Day, Day] {
  const { getters } = buildRangeDisabledLists(
    disabledHours,
    disabledMinutes,
    disabledSeconds,
    start,
    end,
  );
  return [
    getAvailableTime(getters, start, "start", true, end),
    getAvailableTime(getters, end, "end", false, start),
  ];
}

/** 对应官方 panel-time-pick 的 getRangeAvailableTime（单点面板只收敛一次）。 */
export function getSingleAvailableTime(
  date: Day,
  disabledHours?: GetDisabledHours,
  disabledMinutes?: GetDisabledMinutes,
  disabledSeconds?: GetDisabledSeconds,
): Day {
  const getters: TimePanelGetters = buildAvailableTimeSlotGetter(
    disabledHours ?? (() => []),
    disabledMinutes ?? (() => []),
    disabledSeconds ?? (() => []),
  );
  return getAvailableTime(getters, date, "", true);
}

export interface TimeRangePanelProps {
  parsedValue: [Day, Day];
  visible: boolean;
  format: string;
  arrowControl?: boolean;
  disabledHours?: GetDisabledHours;
  disabledMinutes?: GetDisabledMinutes;
  disabledSeconds?: GetDisabledSeconds;
  saveOnBlur?: boolean;
  valueIsEmpty?: boolean;
  valueOnClear?: DateInput;
  onPick: (value: [Day, Day] | null, visible: boolean) => void;
  onSelectRange: (start: number, end: number, pos?: "min" | "max") => void;
}

/**
 * 对应官方 panel-time-range.vue。
 *
 * 两列 spinner，起始与结束互相约束（见 buildRangeDisabledLists）；
 * 底部的确定按钮在起始晚于结束时禁用，与官方 btnConfirmDisabled 一致。
 */
export const TimeRangePanel = ({
  ref,
  parsedValue,
  visible,
  format,
  arrowControl,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  saveOnBlur,
  valueIsEmpty = false,
  valueOnClear,
  onPick,
  onSelectRange,
}: TimeRangePanelProps & { ref?: Ref<TimePanelExpose> }) => {
  const t = useTranslator();
  const [selectionRange, setSelectionRange] = useState<[number, number]>([0, 2]);
  const timePickerOptions = useRef<Record<string, (...args: never[]) => void>>({});

  const startTime = parsedValue[0];
  const endTime = parsedValue[1];
  const oldValueRef = useOldValue(
    [startTime, endTime] as [Day, Day],
    visible,
    valueIsEmpty,
    valueOnClear,
  );

  const showSeconds = format.includes("ss");
  const amPmMode = format.includes("A") ? "A" : format.includes("a") ? "a" : "";
  const offset = showSeconds ? 11 : 8;

  const { disabledHoursList, disabledMinutesList, disabledSecondsList } =
    buildRangeDisabledLists(
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      startTime,
      endTime,
    );

  const setMinSelectionRange = (start: number, end: number) => {
    onSelectRange(start, end, "min");
    setSelectionRange([start, end]);
  };

  const setMaxSelectionRange = (start: number, end: number) => {
    onSelectRange(start, end, "max");
    setSelectionRange([start + offset, end + offset]);
  };

  const changeSelectionRange = (step: number) => {
    const list = showSeconds ? [0, 3, 6, 11, 14, 17] : [0, 3, 8, 11];
    const mapping = ["hours", "minutes"].concat(showSeconds ? ["seconds"] : []);
    const index = list.indexOf(selectionRange[0]);
    const next = (index + step + list.length) % list.length;
    const half = list.length / 2;
    if (next < half) {
      timePickerOptions.current["start_emitSelectRange"]?.(mapping[next] as never);
    } else {
      timePickerOptions.current["end_emitSelectRange"]?.(
        mapping[next - half] as never,
      );
    }
  };

  useImperativeHandle(
    ref,
    () => ({
      handleKeydown: (event: React.KeyboardEvent) => {
        const code = event.key;
        if (code === KEY_CODES.left || code === KEY_CODES.right) {
          changeSelectionRange(code === KEY_CODES.left ? -1 : 1);
          event.preventDefault();
          return;
        }
        if (code === KEY_CODES.up || code === KEY_CODES.down) {
          const role = selectionRange[0] < offset ? "start" : "end";
          timePickerOptions.current[`${role}_scrollDown`]?.(
            (code === KEY_CODES.up ? -1 : 1) as never,
          );
          event.preventDefault();
        }
      },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [selectionRange, showSeconds, format, offset],
  );

  const handleChange = (start: Day, end: Day) => {
    if (!visible) return;
    // 官方此处留了 todo：只做毫秒归零，不对可用值做修正
    onPick([start.millisecond(0), end.millisecond(0)], true);
  };

  const bodyClasses = [
    "el-time-range-picker__body",
    "el-time-panel__content",
    arrowControl && "is-arrow",
    showSeconds && "has-seconds",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="el-time-range-picker el-picker-panel">
      <div className="el-time-range-picker__content">
        <div className="el-time-range-picker__cell">
          <div className="el-time-range-picker__header">
            {t("el.datepicker.startTime")}
          </div>
          <div className={bodyClasses}>
            <TimeSpinner
              role="start"
              spinnerDate={startTime}
              showSeconds={showSeconds}
              amPmMode={amPmMode}
              arrowControl={arrowControl}
              format={format}
              saveOnBlur={saveOnBlur}
              // 官方 spinner 从 pickerBase 读到 isRange=true，范围模式不把自身日期作为 compare
              isRange
              disabledHours={disabledHoursList}
              disabledMinutes={disabledMinutesList}
              disabledSeconds={disabledSecondsList}
              onChange={(date) => handleChange(date, endTime)}
              onSelectRange={setMinSelectionRange}
              onSetOption={(key, value) => {
                timePickerOptions.current[key] = value;
              }}
            />
          </div>
        </div>
        <div className="el-time-range-picker__cell">
          <div className="el-time-range-picker__header">
            {t("el.datepicker.endTime")}
          </div>
          <div className={bodyClasses}>
            <TimeSpinner
              role="end"
              spinnerDate={endTime}
              showSeconds={showSeconds}
              amPmMode={amPmMode}
              arrowControl={arrowControl}
              format={format}
              saveOnBlur={saveOnBlur}
              // 官方 spinner 从 pickerBase 读到 isRange=true，范围模式不把自身日期作为 compare
              isRange
              disabledHours={disabledHoursList}
              disabledMinutes={disabledMinutesList}
              disabledSeconds={disabledSecondsList}
              onChange={(date) => handleChange(startTime, date)}
              onSelectRange={setMaxSelectionRange}
              onSetOption={(key, value) => {
                timePickerOptions.current[key] = value;
              }}
            />
          </div>
        </div>
      </div>
      <div className="el-time-panel__footer">
        <button
          type="button"
          className="el-time-panel__btn cancel"
          onClick={() =>
            onPick((oldValueRef.current as [Day, Day] | null) ?? null, false)
          }
        >
          {t("el.datepicker.cancel")}
        </button>
        <button
          type="button"
          className="el-time-panel__btn confirm"
          disabled={startTime.valueOf() > endTime.valueOf()}
          onClick={() => onPick([startTime, endTime], false)}
        >
          {t("el.datepicker.confirm")}
        </button>
      </div>
    </div>
  );
};
