"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type RefObject,
} from "react";
import { ElScrollbar, type ScrollbarExpose } from "../scrollbar";
import { ElIcon } from "../icon/ElIcon";
import { ArrowDown, ArrowUp } from "../generated/icons";
import {
  DEFAULT_FORMATS_TIME,
  buildTimeList,
  timeUnits,
  type Day,
  type TimeList,
  type TimeUnit,
} from "./datetime";
import { getTimeLists } from "./use-time-picker";
import type {
  GetDisabledHours,
  GetDisabledMinutes,
  GetDisabledSeconds,
} from "./types";

/** 对应官方 v-repeat-click：按下立即触发，600ms 后进入 100ms 的连发。 */
const REPEAT_DELAY = 600;
const REPEAT_INTERVAL = 100;

type ColumnRoots = Record<TimeUnit, HTMLElement | null>;

const EMPTY_ROOTS: ColumnRoots = { hours: null, minutes: null, seconds: null };

/** 对应官方 v-repeat-click 指令，用于 arrow-control 的上下箭头按钮。 */
function useRepeatClick(handler: () => void) {
  const ref = useRef<HTMLElement | null>(null);
  const handlerRef = useRef(handler);

  useEffect(() => {
    handlerRef.current = handler;
  });

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let delayId: ReturnType<typeof setTimeout> | undefined;
    let intervalId: ReturnType<typeof setInterval> | undefined;

    const clear = () => {
      if (delayId) clearTimeout(delayId);
      if (intervalId) clearInterval(intervalId);
      delayId = undefined;
      intervalId = undefined;
    };

    const start = (event: MouseEvent) => {
      if (event.button !== 0) return;
      clear();
      handlerRef.current();
      document.addEventListener("mouseup", clear, { once: true, capture: true });
      delayId = setTimeout(() => {
        intervalId = setInterval(() => handlerRef.current(), REPEAT_INTERVAL);
      }, REPEAT_DELAY);
    };

    el.addEventListener("mousedown", start);
    return () => {
      el.removeEventListener("mousedown", start);
      document.removeEventListener("mouseup", clear, true);
      clear();
    };
  }, []);

  return ref;
}

export interface TimeSpinnerProps {
  /** 'start' | 'end'，范围模式下用于生成禁用表与选区前缀 */
  role: string;
  /** 当前展示的时间 */
  spinnerDate: Day;
  showSeconds?: boolean;
  arrowControl?: boolean;
  /** 'a': am/pm；'A': AM/PM */
  amPmMode?: "" | "a" | "A";
  disabledHours?: GetDisabledHours;
  disabledMinutes?: GetDisabledMinutes;
  disabledSeconds?: GetDisabledSeconds;
  /** 时间变化（对应官方 change 事件） */
  onChange?: (date: Day) => void;
  /** 光标落在输入框内的时间段（对应官方 select-range 事件的左右下标） */
  onSelectRange?: (left: number, right: number) => void;
  /** 面板通过它拿到 scrollDown / emitSelectRange（对应官方 set-option） */
  onSetOption?: (key: string, value: (...args: never[]) => void) => void;
  /** 输入框的显示格式，决定选区下标 */
  format?: string;
  /** 是否范围选择，影响禁用表的 compare 传参 */
  isRange?: boolean;
  saveOnBlur?: boolean;
}

/**
 * 对应官方 ElTimeSpinner。
 *
 * 两个分支：
 * - 滚动模式：三列 ElScrollbar，滚轮 / 点击选中，滚动位置换算与官方逐行一致
 * - arrow-control：每列只有三个相邻项，靠上下箭头按钮连发调整
 *
 * 官方的 scrollDown / emitSelectRange 通过 set-option 事件交给面板持有。
 * React 侧把「最新一次渲染的闭包」放进 helpersRef（在 effect 里同步），
 * 面板与原生监听都通过它调用，因此不会拿到过期的禁用表。
 */
export function TimeSpinner({
  role,
  spinnerDate,
  showSeconds = true,
  arrowControl = false,
  amPmMode = "",
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  onChange,
  onSelectRange,
  onSetOption,
  format,
  isRange = false,
  saveOnBlur = true,
}: TimeSpinnerProps) {
  const { getHoursList, getMinutesList, getSecondsList } = getTimeLists(
    disabledHours,
    disabledMinutes,
    disabledSeconds,
  );

  const hoursRef = useRef<ScrollbarExpose | null>(null);
  const minutesRef = useRef<ScrollbarExpose | null>(null);
  const secondsRef = useRef<ScrollbarExpose | null>(null);

  // 三列滚动条根节点，供 mouseenter / mousemove / scroll 绑原生监听
  const [roots, setRoots] = useState<ColumnRoots>(EMPTY_ROOTS);

  // 命令式中间量，不参与渲染，对应官方组件作用域的 let
  const stateRef = useRef({
    isScrolling: false,
    ignoreScroll: { hours: false, minutes: false, seconds: false },
    currentScrollbar: undefined as TimeUnit | undefined,
  });
  // 对应官方 lodash debounce(adjustCurrentSpinner, 200)：
  // 必须取消上一次的复位，否则滚动过程中会被定时器拉回当前选中项，出现闪烁
  const scrollEndTimerRef = useRef<number | null>(null);

  const spinnerItems = showSeconds ? timeUnits : timeUnits.slice(0, 2);

  const hours = spinnerDate.hour();
  const minutes = spinnerDate.minute();
  const seconds = spinnerDate.second();
  const timePartials: Record<TimeUnit, number> = { hours, minutes, seconds };

  const compare = !isRange ? spinnerDate : undefined;
  const timeList: Record<TimeUnit, boolean[]> = {
    hours: getHoursList(role, compare),
    minutes: getMinutesList(hours, role, compare),
    seconds: getSecondsList(hours, minutes, role, compare),
  };

  const arrowControlTimeList: Record<TimeUnit, TimeList> = {
    hours: buildTimeList(hours, 23),
    minutes: buildTimeList(minutes, 59),
    seconds: buildTimeList(seconds, 59),
  };

  /** 对应官方 getScrollbarElement：拿到内层可滚动容器。 */
  const getWrapEl = (type: TimeUnit) =>
    roots[type]?.querySelector<HTMLElement>(".el-scrollbar__wrap") ?? null;

  const typeItemHeight = (type: TimeUnit): number => {
    const listItem = getWrapEl(type)?.querySelector("li");
    if (!listItem) return 0;
    return Number.parseFloat(window.getComputedStyle(listItem).height) || 0;
  };

  const getAmPmFlag = (hour: number) => {
    if (!amPmMode) return "";
    const content = hour < 12 ? " am" : " pm";
    return amPmMode === "A" ? content.toUpperCase() : content;
  };

  const adjustSpinner = (type: TimeUnit, value: number) => {
    if (arrowControl) return;
    const wrapEl = getWrapEl(type);
    if (!wrapEl) return;
    if (!saveOnBlur) {
      stateRef.current.ignoreScroll[type] = true;
      window.requestAnimationFrame(() => {
        stateRef.current.ignoreScroll[type] = false;
      });
    }
    wrapEl.scrollTop = Math.max(0, value * typeItemHeight(type));
  };

  /** 对应官方 emitSelectRange：把光标定位到输入框的对应片段。 */
  const emitSelectRange = (type: TimeUnit) => {
    let range: [number, number] = [0, 0];
    const actualFormat = format || DEFAULT_FORMATS_TIME;
    const hourIndex = actualFormat.indexOf("HH");
    const minuteIndex = actualFormat.indexOf("mm");
    const secondIndex = actualFormat.indexOf("ss");
    switch (type) {
      case "hours":
        if (hourIndex !== -1) range = [hourIndex, hourIndex + 2];
        break;
      case "minutes":
        if (minuteIndex !== -1) range = [minuteIndex, minuteIndex + 2];
        break;
      case "seconds":
        if (secondIndex !== -1) range = [secondIndex, secondIndex + 2];
        break;
    }
    onSelectRange?.(range[0], range[1]);
    stateRef.current.currentScrollbar = type;
  };

  const adjustCurrentSpinner = (type: TimeUnit) =>
    adjustSpinner(type, timePartials[type]);

  const adjustSpinners = () => {
    adjustSpinner("hours", timePartials.hours);
    adjustSpinner("minutes", timePartials.minutes);
    adjustSpinner("seconds", timePartials.seconds);
  };

  /** 对应官方 modifyDateField：把某一列改成指定值（禁用项直接忽略）。 */
  const modifyDateField = (type: TimeUnit, value: number) => {
    if (timeList[type][value]) return;

    switch (type) {
      case "hours":
        onChange?.(spinnerDate.hour(value).minute(minutes).second(seconds));
        break;
      case "minutes":
        onChange?.(spinnerDate.hour(hours).minute(value).second(seconds));
        break;
      case "seconds":
        onChange?.(spinnerDate.hour(hours).minute(minutes).second(value));
        break;
    }
  };

  /** 对应官方 findNextUnDisabled + scrollDown。 */
  const scrollDown = (step: number) => {
    if (!stateRef.current.currentScrollbar) emitSelectRange("hours");

    const label = stateRef.current.currentScrollbar as TimeUnit;
    const now = timePartials[label];
    const total = label === "hours" ? 24 : 60;
    const list = timeList[label];

    let next = (now + step + total) % total;
    while (list[next] && next !== now) {
      next = (next + step + total) % total;
    }

    modifyDateField(label, next);
    adjustSpinner(label, next);
    window.setTimeout(() => emitSelectRange(label), 0);
  };

  /** 对应官方 handleScroll：滚动停止后把滚动位置换算成时间并回写。 */
  const handleScroll = (type: TimeUnit) => {
    if (!saveOnBlur && stateRef.current.ignoreScroll[type]) return;
    const wrapEl = getWrapEl(type);
    if (!wrapEl) return;

    stateRef.current.isScrolling = true;
    if (scrollEndTimerRef.current) window.clearTimeout(scrollEndTimerRef.current);
    scrollEndTimerRef.current = window.setTimeout(() => {
      scrollEndTimerRef.current = null;
      stateRef.current.isScrolling = false;
      helpersRef.current.adjustCurrentSpinner(type);
    }, 200);

    const itemHeight = typeItemHeight(type);
    const bound = type === "hours" ? 23 : 59;
    const value = Math.min(
      Math.round(
        (wrapEl.scrollTop - (wrapEl.offsetHeight * 0.5 - 10) / itemHeight + 3) /
          itemHeight,
      ),
      bound,
    );
    modifyDateField(type, value);
  };

  /**
   * 命令式方法的统一出口。
   * 面板拿到的 scrollDown 是一个转发闭包，这里始终指向最新一次渲染的实现，
   * 与官方「注册时读 setup 里的闭包、闭包读响应式列表」的效果一致。
   */
  const helpersRef = useRef({
    emitSelectRange,
    adjustCurrentSpinner,
    adjustSpinners,
    scrollDown,
  });
  useEffect(() => {
    helpersRef.current = {
      emitSelectRange,
      adjustCurrentSpinner,
      adjustSpinners,
      scrollDown,
    };
  });

  const onSetOptionRef = useRef(onSetOption);
  useEffect(() => {
    onSetOptionRef.current = onSetOption;
  });

  const handleScrollRef = useRef(handleScroll);
  useEffect(() => {
    handleScrollRef.current = handleScroll;
  });

  // 对应官方 emit('set-option', ...)：把命令式方法交给面板
  useEffect(() => {
    onSetOptionRef.current?.(`${role}_scrollDown`, (step: unknown) =>
      helpersRef.current.scrollDown(step as number),
    );
    onSetOptionRef.current?.(`${role}_emitSelectRange`, (type: unknown) =>
      helpersRef.current.emitSelectRange(type as TimeUnit),
    );
  }, [role]);

  /**
   * mouseenter 决定键盘方向键作用的列，mousemove 用于对齐当前项。
   * 官方把这两个事件直接写在 el-scrollbar 上，React 侧绑到滚动条根节点。
   */
  useEffect(() => {
    if (arrowControl) return;

    const cleanups = timeUnits.map((type) => {
      const root = roots[type];
      if (!root) return () => {};
      const enter = () => helpersRef.current.emitSelectRange(type);
      const move = () => helpersRef.current.adjustCurrentSpinner(type);
      root.addEventListener("mouseenter", enter);
      root.addEventListener("mousemove", move);
      return () => {
        root.removeEventListener("mouseenter", enter);
        root.removeEventListener("mousemove", move);
      };
    });

    return () => cleanups.forEach((cleanup) => cleanup());
  }, [roots, arrowControl]);

  // 绑定原生 scroll 事件：程序化滚动需要「忽略窗口」，故不用 React 的 onScroll
  useEffect(() => {
    if (arrowControl) return;

    const cleanups = timeUnits.map((type) => {
      const wrapEl = getWrapEl(type);
      if (!wrapEl) return () => {};
      const listener = () => handleScrollRef.current(type);
      wrapEl.addEventListener("scroll", listener);
      return () => wrapEl.removeEventListener("scroll", listener);
    });

    return () => cleanups.forEach((cleanup) => cleanup());
    // handleScroll 通过 ref 取最新实现
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roots, arrowControl, showSeconds]);

  useEffect(
    () => () => {
      if (scrollEndTimerRef.current) window.clearTimeout(scrollEndTimerRef.current);
    },
    [],
  );

  const incrementRef = useRepeatClick(() => scrollDown(1));
  const decrementRef = useRepeatClick(() => scrollDown(-1));

  // 对应官方 onMounted：调整到当前时间，并让起始列先取得焦点
  useEffect(() => {
    if (arrowControl) return;
    const timer = window.setTimeout(() => {
      helpersRef.current.adjustSpinners();
      if (role === "start") helpersRef.current.emitSelectRange("hours");
    }, 0);
    return () => window.clearTimeout(timer);
  }, [arrowControl, role, showSeconds]);

  // 对应官方 watch(spinnerDate)：滚动过程中不打断用户
  const dateKey = spinnerDate.valueOf();
  useEffect(() => {
    if (stateRef.current.isScrolling) return;
    helpersRef.current.adjustSpinners();
  }, [dateKey, arrowControl, showSeconds]);

  const handleClick = (type: TimeUnit, value: number, disabled: boolean) => {
    if (disabled) return;
    modifyDateField(type, value);
    emitSelectRange(type);
    adjustSpinner(type, value);
  };

  /**
   * 三列滚动条实例的 ref 回调。
   * 必须是稳定引用：每次渲染新建回调会让 React 反复「先解绑再绑定」，
   * 而回调里的 setState 又会触发渲染，直接打成无限循环。
   */
  const bindColumn = useCallback(
    (type: TimeUnit, instance: ScrollbarExpose | null) => {
      if (type === "hours") hoursRef.current = instance;
      else if (type === "minutes") minutesRef.current = instance;
      else secondsRef.current = instance;
      const root = instance?.wrapRef.current?.parentElement ?? null;
      setRoots((prev) =>
        prev[type] === root ? prev : { ...prev, [type]: root },
      );
    },
    [],
  );

  const setHoursRef = useCallback(
    (instance: ScrollbarExpose | null) => bindColumn("hours", instance),
    [bindColumn],
  );
  const setMinutesRef = useCallback(
    (instance: ScrollbarExpose | null) => bindColumn("minutes", instance),
    [bindColumn],
  );
  const setSecondsRef = useCallback(
    (instance: ScrollbarExpose | null) => bindColumn("seconds", instance),
    [bindColumn],
  );

  const renderItemText = (item: TimeUnit, key: number) =>
    item === "hours"
      ? `${`0${amPmMode ? key % 12 || 12 : key}`.slice(-2)}${getAmPmFlag(key)}`
      : `0${key}`.slice(-2);

  return (
    <div
      className={["el-time-spinner", showSeconds && "has-seconds"]
        .filter(Boolean)
        .join(" ")}
    >
      {!arrowControl &&
        spinnerItems.map((item) => (
          <ElScrollbar
            key={item}
            ref={
              item === "hours"
                ? setHoursRef
                : item === "minutes"
                  ? setMinutesRef
                  : setSecondsRef
            }
            className="el-time-spinner__wrapper"
            wrapStyle={{ maxHeight: "inherit" }}
            viewClass="el-time-spinner__list"
            tag="ul"
            noresize
          >
            {timeList[item].map((disabled, key) => (
              <li
                key={key}
                className={[
                  "el-time-spinner__item",
                  key === timePartials[item] && "is-active",
                  disabled && "is-disabled",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => handleClick(item, key, disabled)}
              >
                {renderItemText(item, key)}
              </li>
            ))}
          </ElScrollbar>
        ))}

      {arrowControl &&
        spinnerItems.map((item) => (
          <div
            key={item}
            className="el-time-spinner__wrapper is-arrow"
            onMouseEnter={() => emitSelectRange(item)}
          >
            <ElIcon
              ref={decrementRef as RefObject<HTMLElement>}
              className="arrow-up el-time-spinner__arrow"
            >
              <ArrowUp />
            </ElIcon>
            <ElIcon
              ref={incrementRef as RefObject<HTMLElement>}
              className="arrow-down el-time-spinner__arrow"
            >
              <ArrowDown />
            </ElIcon>
            <ul className="el-time-spinner__list">
              {arrowControlTimeList[item].map((time, key) => (
                <li
                  key={key}
                  className={[
                    "el-time-spinner__item",
                    time === timePartials[item] && "is-active",
                    typeof time === "number" && timeList[item][time] && "is-disabled",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {typeof time === "number" ? renderItemText(item, time) : null}
                </li>
              ))}
            </ul>
          </div>
        ))}
    </div>
  );
}
