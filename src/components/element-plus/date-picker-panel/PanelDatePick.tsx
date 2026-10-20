"use client";

import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type Ref,
} from "react";

import { ElButton } from "../button";
import { useLocale, useTranslator } from "../config-provider/context";
import { useFormDisabled } from "../form";
import { ElIcon } from "../icon/ElIcon";
import {
  ArrowLeft,
  ArrowRight,
  DArrowLeft,
  DArrowRight,
} from "../icons";
import { ElInput } from "../input";
import { Day, TimePanel } from "../time-picker";

import { BasicDateTable } from "./BasicDateTable";
import {
  BasicMonthTable,
  type BasicMonthTableExpose,
} from "./BasicMonthTable";
import {
  BasicQuarterTable,
  type BasicQuarterTableExpose,
} from "./BasicQuarterTable";
import {
  BasicYearTable,
  type BasicYearTableExpose,
} from "./BasicYearTable";
import {
  DEFAULT_FORMATS_DATE,
  DEFAULT_FORMATS_TIME,
} from "./constants";
import { dayjs } from "./dayjs";
import {
  correctlyParseUserInput,
  extractDateFormat,
  extractTimeFormat,
  getValidDateOfMonth,
  getValidDateOfYear,
} from "./utils";

import type { BasicDateTableExpose } from "./BasicDateTable";
import type { MonthTablePickValue } from "./BasicMonthTable";
import type { YearTablePickValue } from "./BasicYearTable";
import type { QuarterTablePickValue } from "./BasicQuarterTable";
import type { Dayjs } from "./dayjs";
import type {
  DateCell,
  DatePickerType,
  DateShortcut,
  DayOrDays,
  PanelInstance,
  UserInput,
} from "./types";
import type {
  GetDisabledHours,
  GetDisabledMinutes,
  GetDisabledSeconds,
} from "../time-picker/types";

type CurrentView = "date" | "month" | "year" | "quarter";
type SelectionMode =
  | "date"
  | "dates"
  | "week"
  | "month"
  | "months"
  | "year"
  | "years"
  | "quarter"
  | "quarters";

export interface PanelDatePickProps {
  type: DatePickerType;
  parsedValue?: Dayjs | Dayjs[];
  visible?: boolean;
  format?: string;
  isDefaultFormat?: boolean;
  dateFormat?: string;
  timeFormat?: string;
  defaultValue?: Date | [Date, Date];
  defaultTime?: Date | [Date, Date];
  disabled?: boolean;
  editable?: boolean;
  border?: boolean;
  showNow?: boolean;
  showConfirm?: boolean;
  showFooter?: boolean;
  showWeekNumber?: boolean;
  arrowControl?: boolean;
  disabledDate?: (date: Date) => boolean;
  cellClassName?: (date: Date) => string;
  disabledHours?: GetDisabledHours;
  disabledMinutes?: GetDisabledMinutes;
  disabledSeconds?: GetDisabledSeconds;
  shortcuts?: DateShortcut[];
  sidebar?: ReactNode;
  renderCell?: (cell: DateCell) => ReactNode;
  prevMonthIcon?: ReactNode;
  nextMonthIcon?: ReactNode;
  prevYearIcon?: ReactNode;
  nextYearIcon?: ReactNode;
  onPick?: (value: Dayjs | Dayjs[] | null, keepOpen?: boolean) => void;
  onPanelChange?: (
    value: Date | [Date, Date],
    mode: "month" | "year",
    view?: string,
  ) => void;
}

const selectionViews: Record<SelectionMode, CurrentView> = {
  date: "date",
  dates: "date",
  week: "date",
  month: "month",
  months: "month",
  year: "year",
  years: "year",
  quarter: "quarter",
  quarters: "quarter",
};

function extractFirst(value?: Dayjs | Dayjs[]) {
  if (!value) return undefined;
  return Array.isArray(value) ? value[0] : value;
}

const isEnter = (event: React.KeyboardEvent) =>
  event.key === "Enter" || event.key === "NumpadEnter";

type KeyboardOffset = (date: Date, step: number) => void;

interface KeyboardControl {
  [key: string]: number | ((date: Date) => number) | KeyboardOffset;
  offset: KeyboardOffset;
}

const keyboardMapping: Record<string, KeyboardControl> = {
  year: {
    ArrowUp: -4,
    ArrowDown: 4,
    ArrowLeft: -1,
    ArrowRight: 1,
    offset: (date, step) => date.setFullYear(date.getFullYear() + step),
  },
  month: {
    ArrowUp: -4,
    ArrowDown: 4,
    ArrowLeft: -1,
    ArrowRight: 1,
    offset: (date, step) => date.setMonth(date.getMonth() + step),
  },
  week: {
    ArrowUp: -1,
    ArrowDown: 1,
    ArrowLeft: -1,
    ArrowRight: 1,
    offset: (date, step) => date.setDate(date.getDate() + step * 7),
  },
  date: {
    ArrowUp: -7,
    ArrowDown: 7,
    ArrowLeft: -1,
    ArrowRight: 1,
    Home: (date: Date) => -date.getDay(),
    End: (date: Date) => -date.getDay() + 6,
    PageUp: (date: Date) =>
      -new Date(date.getFullYear(), date.getMonth(), 0).getDate(),
    PageDown: (date: Date) =>
      new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate(),
    offset: (date, step) => date.setDate(date.getDate() + step),
  },
};

export function PanelDatePick({
  ref,
  type,
  parsedValue,
  visible = true,
  format = "",
  isDefaultFormat,
  dateFormat,
  timeFormat,
  defaultValue,
  defaultTime,
  disabled,
  editable = true,
  border,
  showNow = true,
  showConfirm = false,
  showFooter = true,
  showWeekNumber,
  arrowControl,
  disabledDate,
  cellClassName,
  disabledHours,
  disabledMinutes,
  disabledSeconds,
  shortcuts = [],
  sidebar,
  renderCell,
  prevMonthIcon,
  nextMonthIcon,
  prevYearIcon,
  nextYearIcon,
  onPick,
  onPanelChange,
}: PanelDatePickProps & { ref?: Ref<PanelInstance> }) {
  const { name: lang } = useLocale();
  const t = useTranslator();
  const formDisabled = useFormDisabled(disabled);
  const dateDisabled = formDisabled;

  const selectionMode = useMemo<SelectionMode>(() => {
    if (
      [
        "week",
        "month",
        "months",
        "year",
        "years",
        "dates",
        "quarter",
        "quarters",
      ].includes(type)
    ) {
      return type as SelectionMode;
    }
    return "date";
  }, [type]);

  const isMultipleType = useMemo(
    () =>
      selectionMode === "dates" ||
      selectionMode === "months" ||
      selectionMode === "years" ||
      selectionMode === "quarters",
    [selectionMode],
  );

  const showTime = type === "datetime" || type === "datetimerange";
  const defaultFormatFlag = isDefaultFormat ?? !format;

  const defaultTimeD = useMemo(
    () =>
      dayjs(
        Array.isArray(defaultTime) ? defaultTime[0] : (defaultTime as Date),
      ).locale(lang),
    [defaultTime, lang],
  );

  const getDefaultValue = useCallback(() => {
    const parsed = dayjs(defaultValue as Date).locale(lang);
    if (!defaultValue) {
      return dayjs()
        .hour(defaultTimeD.hour())
        .minute(defaultTimeD.minute())
        .second(defaultTimeD.second())
        .locale(lang);
    }
    return parsed;
  }, [defaultValue, defaultTimeD, lang]);

  const getInitialInnerDate = useCallback(() => {
    if (parsedValue && !Array.isArray(parsedValue) && !isMultipleType) {
      return parsedValue;
    }
    return getDefaultValue();
  }, [parsedValue, isMultipleType, getDefaultValue]);

  /**
   * 对应官方 watch(parsedValue/defaultValue)：外部值变化时丢弃内部浏览状态。
   * 用外部引用作为 base 派生，避免在 effect 里 setState 造成级联渲染。
   */
  const [innerDateStore, setInnerDateStore] = useState<{
    baseValue: Dayjs | Dayjs[] | undefined;
    baseDefault: Date | [Date, Date] | undefined;
    date: Dayjs;
  }>(() => ({
    baseValue: parsedValue,
    baseDefault: defaultValue,
    date: getInitialInnerDate(),
  }));
  const innerDate =
    innerDateStore.baseValue === parsedValue &&
    innerDateStore.baseDefault === defaultValue
      ? innerDateStore.date
      : getInitialInnerDate();
  const setInnerDate = useCallback(
    (next: Dayjs | ((current: Dayjs) => Dayjs)) => {
      setInnerDateStore((store) => {
        const current =
          store.baseValue === parsedValue &&
          store.baseDefault === defaultValue
            ? store.date
            : getInitialInnerDate();
        return {
          baseValue: parsedValue,
          baseDefault: defaultValue,
          date: typeof next === "function" ? next(current) : next,
        };
      });
    },
    [parsedValue, defaultValue, getInitialInnerDate],
  );

  // 与官方 watch(selectionMode) 对应：type 变化时回退到该模式的默认视图
  const [viewStore, setViewStore] = useState<{
    base: SelectionMode;
    view: CurrentView;
  }>(() => ({ base: selectionMode, view: selectionViews[selectionMode] }));
  const currentView =
    viewStore.base === selectionMode
      ? viewStore.view
      : selectionViews[selectionMode];
  const setCurrentView = useCallback(
    (view: CurrentView) => {
      setViewStore({ base: selectionMode, view });
    },
    [selectionMode],
  );

  const [userInputDate, setUserInputDate] = useState<string | null>(null);
  const [userInputTime, setUserInputTime] = useState<string | null>(null);
  const [timePickerVisible, setTimePickerVisible] = useState(false);

  const isChangeToNowRef = useRef(false);
  const isShortcutRef = useRef(false);
  const currentViewRef = useRef<
    | BasicDateTableExpose
    | BasicYearTableExpose
    | BasicMonthTableExpose
    | BasicQuarterTableExpose
  >(null);
  const timeWrapperRef = useRef<HTMLSpanElement>(null);
  const initializedRef = useRef(false);

  const month = innerDate.month();
  const year = innerDate.year();

  const timeFormatValue =
    timeFormat ||
    extractTimeFormat(format) ||
    DEFAULT_FORMATS_TIME;
  const dateFormatValue =
    dateFormat ||
    extractDateFormat(format) ||
    DEFAULT_FORMATS_DATE;

  const visibleTime = useMemo(() => {
    if (userInputTime) return userInputTime;
    if (!parsedValue && !defaultValue) return undefined;
    const dateValue = extractFirst(parsedValue) || innerDate;
    return dateValue.format(timeFormatValue);
  }, [
    userInputTime,
    parsedValue,
    defaultValue,
    innerDate,
    timeFormatValue,
  ]);

  const visibleDate = useMemo(() => {
    if (userInputDate) return userInputDate;
    if (!parsedValue && !defaultValue) return undefined;
    const dateValue = extractFirst(parsedValue) || innerDate;
    return dateValue.format(dateFormatValue);
  }, [userInputDate, parsedValue, defaultValue, innerDate, dateFormatValue]);

  const formatEmit = useCallback(
    (emitDayjs: Dayjs) => {
      if (
        defaultTime &&
        !visibleTime &&
        !isChangeToNowRef.current &&
        !isShortcutRef.current
      ) {
        return defaultTimeD
          .year(emitDayjs.year())
          .month(emitDayjs.month())
          .date(emitDayjs.date());
      }
      if (showTime) return emitDayjs.millisecond(0);
      return emitDayjs.startOf("day");
    },
    [defaultTime, visibleTime, defaultTimeD, showTime],
  );

  const emitPick = useCallback(
    (value: Dayjs | Dayjs[] | null, keepOpen?: boolean) => {
      if (!value) {
        onPick?.(value, keepOpen);
      } else if (Array.isArray(value)) {
        onPick?.(
          value.map(formatEmit),
          keepOpen,
        );
      } else {
        onPick?.(formatEmit(value), keepOpen);
      }
      setUserInputDate(null);
      setUserInputTime(null);
      isChangeToNowRef.current = false;
      isShortcutRef.current = false;
    },
    [formatEmit, onPick],
  );

  const handlePanelChange = useCallback(
    (mode: "month" | "year") => {
      onPanelChange?.(innerDate.toDate(), mode, currentView);
    },
    [onPanelChange, innerDate, currentView],
  );

  const focusCurrentView = useCallback(() => {
    requestAnimationFrame(() => currentViewRef.current?.focus());
  }, []);

  const showPicker = useCallback(
    (view: "month" | "year") => {
      if (dateDisabled) return;
      setCurrentView(view);
      focusCurrentView();
    },
    [dateDisabled, focusCurrentView, setCurrentView],
  );

  const handleDatePick = useCallback(
    (
      value: Dayjs | Dayjs[] | { minDate: Dayjs; maxDate: Dayjs | null } | {
        year: number;
        week: number;
        value: string;
        date: Dayjs;
      },
      keepOpen?: boolean,
    ) => {
      if (selectionMode === "date" && dayjs.isDayjs(value)) {
        const parsedDateValue = extractFirst(parsedValue);
        const newDate = parsedDateValue
          ? parsedDateValue
              .year(value.year())
              .month(value.month())
              .date(value.date())
          : value;
        setInnerDate(newDate);
        emitPick(newDate, showTime || keepOpen);
      } else if (selectionMode === "week") {
        emitPick((value as { date: Dayjs }).date);
      } else if (selectionMode === "dates") {
        emitPick(value as Dayjs[], true);
      }
    },
    [selectionMode, parsedValue, showTime, emitPick, setInnerDate],
  );

  const handleMonthPick = useCallback(
    (value: MonthTablePickValue, keepOpen?: boolean) => {
      if (typeof value === "object" && !Array.isArray(value)) return;
      if (selectionMode === "month") {
        const newDate = getValidDateOfMonth(
          innerDate,
          innerDate.year(),
          value as number,
          lang,
          disabledDate,
        );
        setInnerDate(newDate);
        emitPick(newDate, false);
      } else if (selectionMode === "months") {
        emitPick(value as Dayjs[], keepOpen);
      } else {
        const newDate = getValidDateOfMonth(
          innerDate,
          innerDate.year(),
          value as number,
          lang,
          disabledDate,
        );
        setInnerDate(newDate);
        setCurrentView("date");
        if (["month", "year", "date", "week"].includes(selectionMode)) {
          emitPick(newDate, true);
          focusCurrentView();
        }
      }
      handlePanelChange("month");
    },
    [
      selectionMode,
      innerDate,
      lang,
      disabledDate,
      emitPick,
      focusCurrentView,
      handlePanelChange,
      setInnerDate,
      setCurrentView,
    ],
  );

  const handleQuarterPick = useCallback(
    (value: QuarterTablePickValue, keepOpen?: boolean) => {
      if (typeof value === "object" && !Array.isArray(value)) return;
      if (selectionMode === "quarter") {
        const newDate = innerDate.startOf("year").month((value as number) * 3);
        setInnerDate(newDate);
        emitPick(newDate, false);
      } else if (selectionMode === "quarters") {
        emitPick(value as Dayjs[], keepOpen);
      }
    },
    [selectionMode, innerDate, emitPick, setInnerDate],
  );

  const handleYearPick = useCallback(
    (value: YearTablePickValue, keepOpen?: boolean) => {
      if (typeof value === "object" && !Array.isArray(value)) return;
      if (selectionMode === "year") {
        const data = innerDate.startOf("year").year(value as number);
        const newDate = getValidDateOfYear(data, lang, disabledDate);
        setInnerDate(newDate);
        emitPick(newDate, false);
      } else if (selectionMode === "years") {
        emitPick(value as Dayjs[], keepOpen);
      } else {
        const data = innerDate.year(value as number);
        const newDate = getValidDateOfYear(data, lang, disabledDate);
        setInnerDate(newDate);
        setCurrentView("month");
        if (["month", "year", "date", "week"].includes(selectionMode)) {
          emitPick(newDate, true);
          focusCurrentView();
        }
      }
      handlePanelChange("year");
    },
    [
      selectionMode,
      innerDate,
      lang,
      disabledDate,
      emitPick,
      focusCurrentView,
      handlePanelChange,
      setInnerDate,
      setCurrentView,
    ],
  );

  const moveByMonth = useCallback(
    (forward: boolean) => {
      const next = forward
        ? innerDate.add(1, "month")
        : innerDate.subtract(1, "month");
      setInnerDate(next);
      onPanelChange?.(next.toDate(), "month", currentView);
    },
    [innerDate, onPanelChange, currentView, setInnerDate],
  );

  const moveByYear = useCallback(
    (forward: boolean) => {
      const step = currentView === "year" ? 10 : 1;
      const next = forward
        ? innerDate.add(step, "year")
        : innerDate.subtract(step, "year");
      setInnerDate(next);
      onPanelChange?.(next.toDate(), "year", currentView);
    },
    [currentView, innerDate, onPanelChange, setInnerDate],
  );

  const handleShortcutClick = useCallback(
    (shortcut: DateShortcut) => {
      const shortcutValue =
        typeof shortcut.value === "function"
          ? shortcut.value()
          : shortcut.value;
      if (shortcutValue) {
        isShortcutRef.current = true;
        emitPick(
          Array.isArray(shortcutValue)
            ? shortcutValue.map((item) => dayjs(item).locale(lang))
            : dayjs(shortcutValue).locale(lang),
        );
        return;
      }
      shortcut.onClick?.({
        emit: (value) =>
          emitPick(
            value
              ? Array.isArray(value)
                ? value.map((item) => dayjs(item).locale(lang))
                : dayjs(value).locale(lang)
              : null,
          ),
      });
    },
    [emitPick, lang],
  );

  const getUnits = (date: Dayjs) => ({
    hour: date.hour(),
    minute: date.minute(),
    second: date.second(),
    year: date.year(),
    month: date.month(),
    date: date.date(),
  });

  const handleTimePick = useCallback(
    (value: Day | null, pickerVisible: boolean) => {
      if (!value) {
        setTimePickerVisible(pickerVisible);
        return;
      }
      const valueDayjs = dayjs(value.toDate()).locale(lang);
      const { hour, minute, second } = getUnits(valueDayjs);
      const parsedDateValue = extractFirst(parsedValue);
      const newDate = parsedDateValue
        ? parsedDateValue.hour(hour).minute(minute).second(second)
        : valueDayjs;
      setInnerDate(newDate);
      emitPick(newDate, true);
      setTimePickerVisible(pickerVisible);
    },
    [lang, parsedValue, emitPick, setInnerDate],
  );

  const handleVisibleTimeChange = useCallback(
    (value: string) => {
      const newDate = dayjs(value, timeFormatValue).locale(lang);
      if (!newDate.isValid()) return;
      const { year: yearValue, month: monthValue, date: dateValue } =
        getUnits(innerDate);
      const result = newDate
        .year(yearValue)
        .month(monthValue)
        .date(dateValue);
      setInnerDate(result);
      setUserInputTime(null);
      setTimePickerVisible(false);
      emitPick(result, true);
    },
    [timeFormatValue, lang, innerDate, emitPick, setInnerDate],
  );

  const handleVisibleDateChange = useCallback(
    (value: string) => {
      const newDate = correctlyParseUserInput(
        value,
        dateFormatValue,
        lang,
        defaultFormatFlag,
      ) as Dayjs;
      if (!newDate.isValid()) return;
      if (disabledDate?.(newDate.toDate())) return;
      const { hour, minute, second } = getUnits(innerDate);
      const result = newDate.hour(hour).minute(minute).second(second);
      setInnerDate(result);
      setUserInputDate(null);
      emitPick(result, true);
    },
    [
      dateFormatValue,
      lang,
      defaultFormatFlag,
      disabledDate,
      innerDate,
      emitPick,
      setInnerDate,
    ],
  );

  useEffect(() => {
    if (!timePickerVisible) return;
    const onDocMouseDown = (event: MouseEvent) => {
      if (timeWrapperRef.current?.contains(event.target as Node)) return;
      setTimePickerVisible(false);
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
  }, [timePickerVisible]);

  const isValidValue = useCallback(
    (date: Dayjs | Dayjs[]) => {
      if (Array.isArray(date)) return false;
      return (
        dayjs.isDayjs(date) &&
        date.isValid() &&
        (disabledDate ? !disabledDate(date.toDate()) : true)
      );
    },
    [disabledDate],
  );

  const parseUserInput = useCallback(
    (value: UserInput) => {
      if (!value) return null;
      if (Array.isArray(value)) {
        return correctlyParseUserInput(
          value as unknown as Dayjs[],
          format,
          lang,
          defaultFormatFlag,
        ) as unknown as DayOrDays;
      }
      return correctlyParseUserInput(
        value as string,
        format,
        lang,
        defaultFormatFlag,
      ) as Dayjs;
    },
    [format, lang, defaultFormatFlag],
  );

  const handleKeyControl = useCallback(
    (code: string) => {
      const keyboardMode =
        selectionMode === "date" ? currentView : selectionMode;
      const newDate = innerDate.toDate();
      const map = keyboardMapping[keyboardMode];
      if (!map) return;

      const mapped = map[code];
      const step =
        typeof mapped === "function"
          ? (mapped as (date: Date) => number)(newDate)
          : ((mapped as number) ?? 0);
      map.offset(newDate, step);

      if (disabledDate?.(newDate)) return;
      const result = dayjs(newDate).locale(lang);
      setInnerDate(result);
      onPick?.(result, true);
    },
    [
      selectionMode,
      currentView,
      innerDate,
      disabledDate,
      lang,
      onPick,
      setInnerDate,
    ],
  );

  const handleFocusPicker = useCallback(() => {
    if (["week", "month", "year", "date"].includes(selectionMode)) {
      currentViewRef.current?.focus();
      if (selectionMode === "week") handleKeyControl("ArrowDown");
    }
  }, [selectionMode, handleKeyControl]);

  const handleKeydownTable = (event: React.KeyboardEvent) => {
    const validCode = [
      "ArrowUp",
      "ArrowDown",
      "ArrowLeft",
      "ArrowRight",
      "Home",
      "End",
      "PageUp",
      "PageDown",
    ];
    if (validCode.includes(event.key)) {
      handleKeyControl(event.key);
      event.stopPropagation();
      event.preventDefault();
    }
    if (
      ["Enter", " ", "NumpadEnter"].includes(event.key) &&
      userInputDate === null &&
      userInputTime === null
    ) {
      event.preventDefault();
      emitPick(innerDate, false);
    }
  };

  const footerVisible = useMemo(() => {
    const showDateFooter = showTime || selectionMode === "dates";
    const showYearFooter = selectionMode === "years";
    const showMonthFooter = selectionMode === "months";
    const showQuarterFooter = selectionMode === "quarters";
    return (
      (showDateFooter && currentView === "date") ||
      (showYearFooter && currentView === "year") ||
      (showMonthFooter && currentView === "month") ||
      (showQuarterFooter && currentView === "quarter")
    );
  }, [showTime, selectionMode, currentView]);

  const footerFilled = (!isMultipleType && showNow) || showConfirm;

  const disabledConfirm = useMemo(() => {
    if (!disabledDate) return false;
    if (!parsedValue) return true;
    if (Array.isArray(parsedValue)) {
      return disabledDate(parsedValue[0].toDate());
    }
    return disabledDate(parsedValue.toDate());
  }, [disabledDate, parsedValue]);

  const onConfirm = useCallback(() => {
    if (isMultipleType) {
      emitPick(parsedValue as Dayjs[]);
      return;
    }
    let result = extractFirst(parsedValue);
    if (!result) {
      const defaultValueD = getDefaultValue();
      result = defaultTimeD
        .year(defaultValueD.year())
        .month(defaultValueD.month())
        .date(defaultValueD.date());
    }
    setInnerDate(result);
    emitPick(result);
  }, [
    isMultipleType,
    parsedValue,
    getDefaultValue,
    defaultTimeD,
    emitPick,
    setInnerDate,
  ]);

  const disabledNow = useMemo(
    () =>
      disabledDate
        ? disabledDate(dayjs().locale(lang).toDate())
        : false,
    [disabledDate, lang],
  );

  const changeToNow = useCallback(() => {
    const now = dayjs().locale(lang);
    isChangeToNowRef.current = true;
    if (!disabledDate || !disabledDate(now.toDate())) {
      setInnerDate(now);
      emitPick(now);
    }
  }, [lang, disabledDate, emitPick, setInnerDate]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => currentViewRef.current?.focus(),
      isValidValue,
      parseUserInput,
      handleFocusPicker,
    }),
    [isValidValue, parseUserInput, handleFocusPicker],
  );

  const yearLabel = useMemo(() => {
    const yearTranslation = t("el.datepicker.year");
    if (currentView === "year") {
      const startYear = Math.floor(year / 10) * 10;
      return yearTranslation
        ? `${startYear} ${yearTranslation} - ${startYear + 9} ${yearTranslation}`
        : `${startYear} - ${startYear + 9}`;
    }
    if (currentView === "quarter") return `${year} `;
    return `${year} ${yearTranslation}`;
  }, [currentView, year, t]);

  const hasShortcuts = shortcuts.length > 0;

  const innerDay = useMemo(
    () => new Day(innerDate.toDate()),
    [innerDate],
  );

  // 首次挂载不处理：此时没有可聚焦的表格
  useEffect(() => {
    if (!visible) return;
    initializedRef.current = true;
  }, [visible]);

  return (
    <div
      className={[
        "el-picker-panel",
        "el-date-picker",
        border && "is-border",
        dateDisabled && "is-disabled",
        (sidebar || hasShortcuts) && "has-sidebar",
        showTime && "has-time",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="el-picker-panel__body-wrapper">
        {(sidebar || hasShortcuts) && (
          <div className="el-picker-panel__sidebar">
            {sidebar}
            {shortcuts.map((shortcut, key) => (
              <button
                key={key}
                type="button"
                className="el-picker-panel__shortcut"
                onClick={() => handleShortcutClick(shortcut)}
              >
                {shortcut.text}
              </button>
            ))}
          </div>
        )}
        <div className="el-picker-panel__body">
          {showTime && (
            <div className="el-date-picker__time-header">
              <span className="el-date-picker__editor-wrap">
                <ElInput
                  placeholder={t("el.datepicker.selectDate")}
                  value={visibleDate ?? ""}
                  size="small"
                  validateEvent={false}
                  disabled={dateDisabled}
                  readOnly={!editable}
                  onChange={(value) => setUserInputDate(value)}
                  onValueChange={handleVisibleDateChange}
                />
              </span>
              <span
                ref={timeWrapperRef}
                className="el-date-picker__editor-wrap"
              >
                <ElInput
                  placeholder={t("el.datepicker.selectTime")}
                  value={visibleTime ?? ""}
                  size="small"
                  validateEvent={false}
                  disabled={dateDisabled}
                  readOnly={!editable}
                  onFocus={() => setTimePickerVisible(true)}
                  onChange={(value) => setUserInputTime(value)}
                  onValueChange={handleVisibleTimeChange}
                />
                {timePickerVisible && (
                  <TimePanel
                    parsedValue={innerDay}
                    visible={timePickerVisible}
                    format={timeFormatValue}
                    arrowControl={arrowControl}
                    disabledHours={disabledHours}
                    disabledMinutes={disabledMinutes}
                    disabledSeconds={disabledSeconds}
                    onPick={(value, pickerVisible) =>
                      handleTimePick(value as Day | null, pickerVisible)
                    }
                    onSelectRange={() => undefined}
                  />
                )}
              </span>
            </div>
          )}
          <div
            className={[
              "el-date-picker__header",
              (currentView === "year" ||
                currentView === "month" ||
                currentView === "quarter") &&
                "el-date-picker__header--bordered",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <span className="el-date-picker__prev-btn">
              <button
                type="button"
                aria-label={t("el.datepicker.prevYear")}
                className="d-arrow-left el-picker-panel__icon-btn"
                disabled={dateDisabled}
                onClick={() => moveByYear(false)}
              >
                {prevYearIcon ?? (
                  <ElIcon>
                    <DArrowLeft />
                  </ElIcon>
                )}
              </button>
              {currentView === "date" && (
                <button
                  type="button"
                  aria-label={t("el.datepicker.prevMonth")}
                  className="arrow-left el-picker-panel__icon-btn"
                  disabled={dateDisabled}
                  onClick={() => moveByMonth(false)}
                >
                  {prevMonthIcon ?? (
                    <ElIcon>
                      <ArrowLeft />
                    </ElIcon>
                  )}
                </button>
              )}
            </span>
            <span
              role="button"
              className="el-date-picker__header-label"
              aria-live="polite"
              tabIndex={disabled ? undefined : 0}
              aria-disabled={disabled}
              onKeyDown={(event) => {
                if (isEnter(event)) showPicker("year");
              }}
              onClick={() => showPicker("year")}
            >
              {yearLabel}
            </span>
            {currentView === "date" && (
              <span
                role="button"
                aria-live="polite"
                tabIndex={disabled ? undefined : 0}
                aria-disabled={disabled}
                className="el-date-picker__header-label"
                onKeyDown={(event) => {
                  if (isEnter(event)) showPicker("month");
                }}
                onClick={() => showPicker("month")}
              >
                {t(`el.datepicker.month${month + 1}`)}
              </span>
            )}
            <span className="el-date-picker__next-btn">
              {currentView === "date" && (
                <button
                  type="button"
                  aria-label={t("el.datepicker.nextMonth")}
                  className="arrow-right el-picker-panel__icon-btn"
                  disabled={dateDisabled}
                  onClick={() => moveByMonth(true)}
                >
                  {nextMonthIcon ?? (
                    <ElIcon>
                      <ArrowRight />
                    </ElIcon>
                  )}
                </button>
              )}
              <button
                type="button"
                aria-label={t("el.datepicker.nextYear")}
                className="d-arrow-right el-picker-panel__icon-btn"
                disabled={dateDisabled}
                onClick={() => moveByYear(true)}
              >
                {nextYearIcon ?? (
                  <ElIcon>
                    <DArrowRight />
                  </ElIcon>
                )}
              </button>
            </span>
          </div>
          <div
            className="el-picker-panel__content"
            onKeyDown={handleKeydownTable}
          >
            {currentView === "date" && (
              <BasicDateTable
                ref={currentViewRef as Ref<BasicDateTableExpose>}
                selectionMode={
                  selectionMode === "date" ||
                  selectionMode === "dates" ||
                  selectionMode === "week"
                    ? selectionMode
                    : "date"
                }
                date={innerDate}
                parsedValue={parsedValue}
                disabledDate={disabledDate}
                disabled={dateDisabled}
                cellClassName={cellClassName}
                showWeekNumber={showWeekNumber}
                renderCell={renderCell}
                onPick={handleDatePick}
              />
            )}
            {currentView === "year" && (
              <BasicYearTable
                ref={currentViewRef as Ref<BasicYearTableExpose>}
                selectionMode={selectionMode === "years" ? "years" : "year"}
                date={innerDate}
                parsedValue={parsedValue}
                disabledDate={disabledDate}
                disabled={dateDisabled}
                cellClassName={cellClassName}
                renderCell={renderCell}
                onPick={(value, keepOpen) =>
                  handleYearPick(value, keepOpen)
                }
              />
            )}
            {currentView === "quarter" && (
              <BasicQuarterTable
                ref={currentViewRef as Ref<BasicQuarterTableExpose>}
                selectionMode={
                  selectionMode === "quarters" ? "quarters" : "quarter"
                }
                date={innerDate}
                parsedValue={parsedValue}
                disabledDate={disabledDate}
                disabled={dateDisabled}
                cellClassName={cellClassName}
                renderCell={renderCell}
                onPick={(value, keepOpen) =>
                  handleQuarterPick(value, keepOpen)
                }
              />
            )}
            {currentView === "month" && (
              <BasicMonthTable
                ref={currentViewRef as Ref<BasicMonthTableExpose>}
                selectionMode={selectionMode === "months" ? "months" : "month"}
                date={innerDate}
                parsedValue={parsedValue}
                disabledDate={disabledDate}
                disabled={dateDisabled}
                cellClassName={cellClassName}
                renderCell={renderCell}
                onPick={(value, keepOpen) =>
                  handleMonthPick(value, keepOpen)
                }
              />
            )}
          </div>
        </div>
      </div>
      {showFooter && footerVisible && footerFilled && (
        <div className="el-picker-panel__footer">
          {!isMultipleType && showNow && (
            <ElButton
              text
              size="small"
              className="el-picker-panel__link-btn"
              disabled={disabledNow}
              onClick={changeToNow}
            >
              {t("el.datepicker.now")}
            </ElButton>
          )}
          {showConfirm && (
            <ElButton
              plain
              size="small"
              className="el-picker-panel__link-btn"
              disabled={disabledConfirm}
              onClick={onConfirm}
            >
              {t("el.datepicker.confirm")}
            </ElButton>
          )}
        </div>
      )}
    </div>
  );
}
