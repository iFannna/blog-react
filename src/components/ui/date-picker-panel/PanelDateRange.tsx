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
import { BasicMonthTable } from "./BasicMonthTable";
import { BasicYearTable } from "./BasicYearTable";
import {
  DEFAULT_FORMATS_DATE,
  DEFAULT_FORMATS_TIME,
} from "./constants";
import { dayjs } from "./dayjs";
import { useRangePicker } from "./use-range-picker";
import {
  correctlyParseUserInput,
  extractDateFormat,
  extractTimeFormat,
  getDefaultValue,
  getValidDateOfMonth,
  getValidDateOfYear,
  isValidRange,
} from "./utils";

import type { BasicDateTableExpose } from "./BasicDateTable";
import type { BasicMonthTableExpose } from "./BasicMonthTable";
import type { BasicYearTableExpose } from "./BasicYearTable";
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

type ChangeType = "min" | "max";
type CurrentView = "date" | "month" | "year";
type ViewRef =
  | BasicDateTableExpose
  | BasicYearTableExpose
  | BasicMonthTableExpose;

interface UserInputState {
  min: string | null;
  max: string | null;
}

export interface PanelDateRangeProps {
  type?: Extract<DatePickerType, "daterange" | "datetimerange">;
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
  clearable?: boolean;
  unlinkPanels?: boolean;
  singlePanel?: boolean;
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
  valueOnClear?: unknown;
  renderCell?: (cell: DateCell) => ReactNode;
  prevMonthIcon?: ReactNode;
  nextMonthIcon?: ReactNode;
  prevYearIcon?: ReactNode;
  nextYearIcon?: ReactNode;
  onPick?: (value: Dayjs | Dayjs[] | null, keepOpen?: boolean) => void;
  onCalendarChange?: (dates: [Date, Date | null]) => void;
  onPanelChange?: (
    value: Date | [Date, Date],
    mode: "month" | "year",
    view?: string,
  ) => void;
  onClear?: () => void;
}

export function PanelDateRange({
  ref,
  type = "daterange",
  parsedValue,
  visible = false,
  format = "",
  isDefaultFormat,
  dateFormat,
  timeFormat,
  defaultValue,
  defaultTime,
  disabled,
  editable = true,
  border,
  clearable,
  unlinkPanels = false,
  singlePanel = false,
  showConfirm = true,
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
  valueOnClear = null,
  renderCell,
  prevMonthIcon,
  nextMonthIcon,
  prevYearIcon,
  nextYearIcon,
  onPick,
  onCalendarChange,
  onPanelChange,
  onClear,
}: PanelDateRangeProps & { ref?: Ref<PanelInstance> }) {
  const { name: lang } = useLocale();
  const t = useTranslator();
  const formDisabled = useFormDisabled(disabled);
  const dateRangeDisabled = formDisabled;
  const defaultFormatFlag = isDefaultFormat ?? !format;

  const unit = "month";

  const [leftDate, setLeftDate] = useState<Dayjs>(() =>
    dayjs().locale(lang),
  );
  const [rightDate, setRightDate] = useState<Dayjs>(() =>
    dayjs().locale(lang).add(1, unit),
  );
  const [leftCurrentView, setLeftCurrentView] =
    useState<CurrentView>("date");
  const [rightCurrentView, setRightCurrentView] =
    useState<CurrentView>("date");
  const [dateUserInput, setDateUserInput] = useState<UserInputState>({
    min: null,
    max: null,
  });
  const [timeUserInput, setTimeUserInput] = useState<UserInputState>({
    min: null,
    max: null,
  });
  const [minTimePickerVisible, setMinTimePickerVisible] =
    useState(false);
  const [maxTimePickerVisible, setMaxTimePickerVisible] =
    useState(false);
  const leftViewRef = useRef<ViewRef>(null);
  const rightViewRef = useRef<ViewRef>(null);
  const minTimeWrapRef = useRef<HTMLSpanElement>(null);
  const maxTimeWrapRef = useRef<HTMLSpanElement>(null);

  const showTime = type === "datetimerange";

  const timeFormatValue =
    timeFormat ||
    extractTimeFormat(format) ||
    DEFAULT_FORMATS_TIME;
  const dateFormatValue =
    dateFormat ||
    extractDateFormat(format) ||
    DEFAULT_FORMATS_DATE;

  const sortDates = useCallback(
    (minDateValue: Dayjs | undefined, maxDateValue: Dayjs | undefined) => {
      if (unlinkPanels && maxDateValue) {
        const minDateYear = minDateValue?.year() || 0;
        const minDateMonth = minDateValue?.month() || 0;
        const maxDateYear = maxDateValue.year();
        const maxDateMonth = maxDateValue.month();
        setRightDate(
          minDateYear === maxDateYear &&
            minDateMonth === maxDateMonth
            ? maxDateValue.add(1, unit)
            : maxDateValue,
        );
      } else {
        let nextRightDate = leftDate.add(1, unit);
        if (maxDateValue) {
          nextRightDate = nextRightDate
            .hour(maxDateValue.hour())
            .minute(maxDateValue.minute())
            .second(maxDateValue.second());
        }
        setRightDate(nextRightDate);
      }
    },
    [unlinkPanels, leftDate],
  );

  const {
    minDate,
    maxDate,
    setMinDate,
    setMaxDate,
    rangeState,
    handleChangeRange,
    handleRangeConfirm,
    handleShortcutClick,
    onSelect,
  } = useRangePicker({
    unit,
    visible,
    parsedValue,
    defaultValue,
    defaultTime,
    unlinkPanels,
    onPick,
    sortDates,
    setLeftDate,
    setRightDate,
  });

  const timeFormatD = useMemo(() => {
    const dt = Array.isArray(defaultTime)
      ? defaultTime[0]
      : defaultTime;
    return dt ? dayjs(dt).locale(lang) : undefined;
  }, [defaultTime, lang]);

  const formatEmit = useCallback(
    (emitDayjs: Dayjs | null | undefined, index?: number) => {
      if (!emitDayjs) return undefined;
      if (defaultTime) {
        const candidate = Array.isArray(defaultTime)
          ? defaultTime[index ?? 0]
          : defaultTime;
        const defaultTimeD = dayjs(
          candidate || (timeFormatD as Dayjs),
        ).locale(lang);
        return defaultTimeD
          .year(emitDayjs.year())
          .month(emitDayjs.month())
          .date(emitDayjs.date());
      }
      return emitDayjs;
    },
    [defaultTime, lang, timeFormatD],
  );

  const handleRangePick = useCallback(
    (
      value: { minDate: Dayjs; maxDate: Dayjs | null },
      close = true,
    ) => {
      const min_ = value.minDate;
      const max_ = value.maxDate;
      const newMin = formatEmit(min_, 0);
      const newMax = formatEmit(max_, 1);

      if (maxDate === newMax && minDate === newMin) return;
      onCalendarChange?.([min_.toDate(), max_ ? max_.toDate() : null]);

      setMaxDate(newMax);
      setMinDate(newMin);

      let shouldClose = close;
      if (!showTime && shouldClose) {
        shouldClose = !newMin || !newMax;
      }
      if (isValidRange([newMin, newMax])) {
        onPick?.([newMin!, newMax!], shouldClose);
      }
    },
    [
      formatEmit,
      maxDate,
      minDate,
      showTime,
      onCalendarChange,
      onPick,
      setMaxDate,
      setMinDate,
    ],
  );

  const handleMinTimeClose = useCallback(
    () => setMinTimePickerVisible(false),
    [],
  );
  const handleMaxTimeClose = useCallback(
    () => setMaxTimePickerVisible(false),
    [],
  );

  useEffect(() => {
    if (!minTimePickerVisible && !maxTimePickerVisible) return;
    const onDocMouseDown = (event: MouseEvent) => {
      if (
        minTimePickerVisible &&
        !minTimeWrapRef.current?.contains(event.target as Node)
      ) {
        handleMinTimeClose();
      }
      if (
        maxTimePickerVisible &&
        !maxTimeWrapRef.current?.contains(event.target as Node)
      ) {
        handleMaxTimeClose();
      }
    };
    document.addEventListener("mousedown", onDocMouseDown);
    return () =>
      document.removeEventListener("mousedown", onDocMouseDown);
  }, [
    minTimePickerVisible,
    maxTimePickerVisible,
    handleMinTimeClose,
    handleMaxTimeClose,
  ]);

  const findValidDateToward = useCallback(
    (from: Dayjs, toward: Dayjs): Dayjs => {
      if (!disabledDate || !disabledDate(from.toDate())) return from;
      const forward = from.isBefore(toward);
      let cursor = from;
      while (forward ? cursor.isBefore(toward) : cursor.isAfter(toward)) {
        cursor = forward
          ? cursor.add(1, "day")
          : cursor.subtract(1, "day");
        if (!disabledDate(cursor.toDate())) return cursor;
      }
      return from;
    },
    [disabledDate],
  );

  const handleDateInput = useCallback(
    (value: string, changeType: ChangeType) => {
      setDateUserInput((current) => ({
        ...current,
        [changeType]:
          typeof value === "string" ? value : null,
      }));
      const parsedValueD = dayjs(
        value,
        dateFormatValue,
      ).locale(lang);
      if (!parsedValueD.isValid()) return;
      if (disabledDate?.(parsedValueD.toDate())) return;

      if (changeType === "min") {
        setLeftDate(parsedValueD);
        const nextMin = (minDate || parsedValueD)
          .year(parsedValueD.year())
          .month(parsedValueD.month())
          .date(parsedValueD.date());
        setMinDate(nextMin);
        let nextMax = maxDate;
        if (!unlinkPanels && !maxDate) {
          const adjustedMax = findValidDateToward(
            nextMin.add(1, "month"),
            nextMin,
          );
          setRightDate(adjustedMax);
          setMaxDate(adjustedMax);
          nextMax = adjustedMax;
        }
        sortDates(nextMin, nextMax);
        if (isValidRange([nextMin, nextMax])) {
          onPick?.([nextMin, nextMax!], true);
        }
      } else {
        setRightDate(parsedValueD);
        const nextMax = (maxDate || parsedValueD)
          .year(parsedValueD.year())
          .month(parsedValueD.month())
          .date(parsedValueD.date());
        setMaxDate(nextMax);
        let nextMin = minDate;
        if (!unlinkPanels && !minDate) {
          const adjustedMin = findValidDateToward(
            nextMax.subtract(1, "month"),
            nextMax,
          );
          setLeftDate(adjustedMin);
          setMinDate(adjustedMin);
          nextMin = adjustedMin;
        }
        sortDates(nextMin, nextMax);
        if (isValidRange([nextMin, nextMax])) {
          onPick?.([nextMin!, nextMax], true);
        }
      }
    },
    [
      dateFormatValue,
      lang,
      disabledDate,
      unlinkPanels,
      maxDate,
      minDate,
      findValidDateToward,
      sortDates,
      onPick,
      setMaxDate,
      setMinDate,
    ],
  );

  const handleDateChange = useCallback(
    (_value: string, changeType: ChangeType) => {
      setDateUserInput((current) => ({
        ...current,
        [changeType]: null,
      }));
      if (changeType === "min") {
        let nextMax = maxDate;
        if (
          !unlinkPanels &&
          maxDate &&
          minDate &&
          maxDate.isBefore(minDate)
        ) {
          nextMax = findValidDateToward(
            minDate.add(1, "month"),
            minDate,
          );
          setRightDate(nextMax);
          setMaxDate(nextMax);
        }
        sortDates(minDate, nextMax);
        if (isValidRange([minDate, nextMax])) {
          onPick?.([minDate!, nextMax!], true);
        }
      } else {
        let nextMin = minDate;
        if (
          !unlinkPanels &&
          minDate &&
          maxDate &&
          minDate.isAfter(maxDate)
        ) {
          nextMin = findValidDateToward(
            maxDate.subtract(1, "month"),
            maxDate,
          );
          setLeftDate(nextMin);
          setMinDate(nextMin);
        }
        sortDates(nextMin, maxDate);
        if (isValidRange([nextMin, maxDate])) {
          onPick?.([nextMin!, maxDate!], true);
        }
      }
    },
    [
      unlinkPanels,
      maxDate,
      minDate,
      findValidDateToward,
      sortDates,
      onPick,
      setMaxDate,
      setMinDate,
    ],
  );

  const handleTimeInput = useCallback(
    (value: string, changeType: ChangeType) => {
      setTimeUserInput((current) => ({
        ...current,
        [changeType]:
          typeof value === "string" ? value : null,
      }));
      const parsedValueD = dayjs(
        value,
        timeFormatValue,
      ).locale(lang);
      if (!parsedValueD.isValid()) return;
      if (changeType === "min") {
        setMinTimePickerVisible(true);
        const nextMin = (minDate || leftDate)
          .hour(parsedValueD.hour())
          .minute(parsedValueD.minute())
          .second(parsedValueD.second());
        setMinDate(nextMin);
        setLeftDate(nextMin);
      } else {
        setMaxTimePickerVisible(true);
        const nextMax = (maxDate || rightDate)
          .hour(parsedValueD.hour())
          .minute(parsedValueD.minute())
          .second(parsedValueD.second());
        setMaxDate(nextMax);
        setRightDate(nextMax);
      }
    },
    [
      timeFormatValue,
      lang,
      minDate,
      leftDate,
      maxDate,
      rightDate,
      setMaxDate,
      setMinDate,
    ],
  );

  const handleTimeChange = useCallback(
    (_value: string, changeType: ChangeType) => {
      setTimeUserInput((current) => ({
        ...current,
        [changeType]: null,
      }));
      if (changeType === "min") {
        const nextMin = minDate;
        setLeftDate(nextMin!);
        setMinTimePickerVisible(false);
        let nextMax = maxDate;
        if (!maxDate || (nextMin && maxDate.isBefore(nextMin))) {
          nextMax = nextMin;
          setMaxDate(nextMin);
        }
        if (isValidRange([nextMin, nextMax])) {
          onPick?.([nextMin!, nextMax!], true);
        }
      } else {
        const nextMax = maxDate;
        setRightDate(nextMax!);
        setMaxTimePickerVisible(false);
        let nextMin = minDate;
        if (nextMax && nextMin && nextMax.isBefore(nextMin)) {
          nextMin = nextMax;
          setMinDate(nextMax);
        }
        if (isValidRange([nextMin, nextMax])) {
          onPick?.([nextMin!, nextMax!], true);
        }
      }
    },
    [minDate, maxDate, onPick, setMaxDate, setMinDate],
  );

  const handleMinTimePick = useCallback(
    (value: Day | null, pickerVisible: boolean) => {
      if (timeUserInput.min) return;
      let nextMin = minDate;
      if (value) {
        nextMin = (minDate || leftDate)
          .hour(value.hour())
          .minute(value.minute())
          .second(value.second());
        setMinDate(nextMin);
      }
      setMinTimePickerVisible(pickerVisible);

      let nextMax = maxDate;
      if (!maxDate || (nextMin && maxDate.isBefore(nextMin))) {
        nextMax = nextMin;
        setMaxDate(nextMin);
        if (value) {
          setRightDate(dayjs(value.toDate()).locale(lang));
        }
      }
      if (isValidRange([nextMin, nextMax])) {
        onPick?.([nextMin!, nextMax!], true);
      }
    },
    [
      timeUserInput.min,
      minDate,
      maxDate,
      leftDate,
      lang,
      onPick,
      setMaxDate,
      setMinDate,
    ],
  );

  const handleMaxTimePick = useCallback(
    (value: Day | null, pickerVisible: boolean) => {
      if (timeUserInput.max) return;
      let nextMax = maxDate;
      if (value) {
        nextMax = (maxDate || rightDate)
          .hour(value.hour())
          .minute(value.minute())
          .second(value.second());
        setMaxDate(nextMax);
      }
      setMaxTimePickerVisible(pickerVisible);

      let nextMin = minDate;
      if (nextMax && nextMin && nextMax.isBefore(nextMin)) {
        nextMin = nextMax;
        setMinDate(nextMin);
      }
      if (isValidRange([nextMin, nextMax])) {
        onPick?.([nextMin!, nextMax!], true);
      }
    },
    [
      timeUserInput.max,
      maxDate,
      minDate,
      rightDate,
      onPick,
      setMaxDate,
      setMinDate,
    ],
  );

  const leftYear = leftDate.year();
  const leftMonth = leftDate.month();
  const rightYear = rightDate.year();
  const rightMonth = rightDate.month();

  const adjustDateByView = useCallback(
    (view: CurrentView, date: Dayjs, forward: boolean) => {
      const action: "add" | "subtract" = forward ? "add" : "subtract";
      return view === "year"
        ? date[action](10, "year")
        : date[action](1, "year");
    },
    [],
  );

  const handlePanelChange = useCallback(
    (mode: "month" | "year") => {
      onPanelChange?.(
        [leftDate.toDate(), rightDate.toDate()],
        mode,
      );
    },
    [leftDate, rightDate, onPanelChange],
  );

  const leftPrevYear = useCallback(() => {
    const next = adjustDateByView(
      leftCurrentView,
      leftDate,
      false,
    );
    setLeftDate(next);
    if (!unlinkPanels) setRightDate(next.add(1, "month"));
    handlePanelChange("year");
  }, [
    adjustDateByView,
    leftCurrentView,
    leftDate,
    unlinkPanels,
    handlePanelChange,
  ]);

  const leftPrevMonth = useCallback(() => {
    const next = leftDate.subtract(1, "month");
    setLeftDate(next);
    if (!unlinkPanels) setRightDate(next.add(1, "month"));
    handlePanelChange("month");
  }, [leftDate, unlinkPanels, handlePanelChange]);

  const rightNextYear = useCallback(() => {
    if (!unlinkPanels) {
      const nextLeft = adjustDateByView(
        rightCurrentView,
        leftDate,
        true,
      );
      setLeftDate(nextLeft);
      setRightDate(nextLeft.add(1, "month"));
    } else {
      setRightDate(
        adjustDateByView(rightCurrentView, rightDate, true),
      );
    }
    handlePanelChange("year");
  }, [
    unlinkPanels,
    rightCurrentView,
    leftDate,
    rightDate,
    adjustDateByView,
    handlePanelChange,
  ]);

  const rightNextMonth = useCallback(() => {
    if (!unlinkPanels) {
      const nextLeft = leftDate.add(1, "month");
      setLeftDate(nextLeft);
      setRightDate(nextLeft);
    } else {
      setRightDate(rightDate.add(1, "month"));
    }
    handlePanelChange("month");
  }, [unlinkPanels, leftDate, rightDate, handlePanelChange]);

  const leftNextYear = useCallback(() => {
    setLeftDate(adjustDateByView(leftCurrentView, leftDate, true));
    handlePanelChange("year");
  }, [adjustDateByView, leftCurrentView, leftDate, handlePanelChange]);

  const leftNextMonth = useCallback(() => {
    setLeftDate(leftDate.add(1, "month"));
    handlePanelChange("month");
  }, [leftDate, handlePanelChange]);

  const rightPrevYear = useCallback(() => {
    setRightDate(
      adjustDateByView(rightCurrentView, rightDate, false),
    );
    handlePanelChange("year");
  }, [
    adjustDateByView,
    rightCurrentView,
    rightDate,
    handlePanelChange,
  ]);

  const rightPrevMonth = useCallback(() => {
    setRightDate(rightDate.subtract(1, "month"));
    handlePanelChange("month");
  }, [rightDate, handlePanelChange]);

  const enableMonthArrow = useMemo(() => {
    const nextMonth = (leftMonth + 1) % 12;
    const yearOffset = leftMonth + 1 >= 12 ? 1 : 0;
    return (
      singlePanel ||
      (unlinkPanels &&
        new Date(leftYear + yearOffset, nextMonth) <
          new Date(rightYear, rightMonth))
    );
  }, [
    singlePanel,
    unlinkPanels,
    leftYear,
    leftMonth,
    rightYear,
    rightMonth,
  ]);

  const enableYearArrow = useMemo(
    () =>
      singlePanel ||
      (unlinkPanels &&
        rightYear * 12 +
          rightMonth -
          (leftYear * 12 + leftMonth + 1) >=
          12),
    [
      singlePanel,
      unlinkPanels,
      rightYear,
      rightMonth,
      leftYear,
      leftMonth,
    ],
  );

  const btnDisabled = useMemo(
    () =>
      !(
        minDate &&
        maxDate &&
        !rangeState.selecting &&
        isValidRange([minDate, maxDate]) &&
        !dateRangeDisabled
      ),
    [minDate, maxDate, rangeState.selecting, dateRangeDisabled],
  );

  const isValidValue = useCallback(
    (date: DayOrDays) => {
      if (!Array.isArray(date)) return false;
      return (
        isValidRange(date) &&
        (disabledDate
          ? !disabledDate(date[0].toDate()) &&
            !disabledDate(date[1].toDate())
          : true)
      );
    },
    [disabledDate],
  );

  const parseUserInput = useCallback(
    (value: UserInput) =>
      correctlyParseUserInput(
        value as unknown as Dayjs | Dayjs[],
        format,
        lang,
        defaultFormatFlag,
      ) as DayOrDays,
    [format, lang, defaultFormatFlag],
  );

  const handleClear = useCallback(() => {
    const first = getDefaultValue(defaultValue, {
      lang,
      unit: "month",
      unlinkPanels,
    })[0];
    setLeftDate(first);
    setRightDate(first.add(1, "month"));
    setMaxDate(undefined);
    setMinDate(undefined);
    onPick?.((valueOnClear ?? null) as Dayjs | null);
  }, [
    defaultValue,
    lang,
    unlinkPanels,
    onPick,
    valueOnClear,
    setMaxDate,
    setMinDate,
  ]);

  const handleClearClick = useCallback(() => {
    handleClear();
    onClear?.();
  }, [handleClear, onClear]);

  useImperativeHandle(
    ref,
    () => ({
      focus: () =>
        (leftViewRef.current ?? rightViewRef.current)?.focus(),
      isValidValue,
      parseUserInput,
      handleClear,
    }),
    [isValidValue, parseUserInput, handleClear],
  );

  const leftYearLabel = useMemo(() => {
    const yearTranslation = t("el.datepicker.year");
    if (leftCurrentView === "year") {
      const startYear = Math.floor(leftYear / 10) * 10;
      return yearTranslation
        ? `${startYear} ${yearTranslation} - ${startYear + 9} ${yearTranslation}`
        : `${startYear} - ${startYear + 9}`;
    }
    return `${leftYear} ${yearTranslation}`;
  }, [leftCurrentView, leftYear, t]);

  const rightYearLabel = useMemo(() => {
    const yearTranslation = t("el.datepicker.year");
    if (rightCurrentView === "year") {
      const startYear = Math.floor(rightYear / 10) * 10;
      return yearTranslation
        ? `${startYear} ${yearTranslation} - ${startYear + 9} ${yearTranslation}`
        : `${startYear} - ${startYear + 9}`;
    }
    return `${rightYear} ${yearTranslation}`;
  }, [rightCurrentView, rightYear, t]);

  const minVisibleDate = useMemo(() => {
    if (dateUserInput.min !== null) return dateUserInput.min;
    if (minDate) return minDate.format(dateFormatValue);
    return "";
  }, [dateUserInput.min, minDate, dateFormatValue]);

  const maxVisibleDate = useMemo(() => {
    if (dateUserInput.max !== null) return dateUserInput.max;
    if (maxDate || minDate)
      return (maxDate || minDate)!.format(dateFormatValue);
    return "";
  }, [dateUserInput.max, maxDate, minDate, dateFormatValue]);

  const minVisibleTime = useMemo(() => {
    if (timeUserInput.min !== null) return timeUserInput.min;
    if (minDate) return minDate.format(timeFormatValue);
    return "";
  }, [timeUserInput.min, minDate, timeFormatValue]);

  const maxVisibleTime = useMemo(() => {
    if (timeUserInput.max !== null) return timeUserInput.max;
    if (maxDate || minDate)
      return (maxDate || minDate)!.format(timeFormatValue);
    return "";
  }, [timeUserInput.max, maxDate, minDate, timeFormatValue]);

  const focusView = (target: "left" | "right") =>
    requestAnimationFrame(() => {
      (target === "left" ? leftViewRef : rightViewRef).current?.focus();
    });

  const showPicker = useCallback(
    (target: "left" | "right", view: "month" | "year") => {
      if (disabled) return;
      if (target === "left") setLeftCurrentView(view);
      else setRightCurrentView(view);
      focusView(target);
    },
    [disabled],
  );

  const handlePick = useCallback(
    (mode: "month" | "year", target: "left" | "right", value: number) => {
      if (disabled) return;
      const isLeft = target === "left";
      const startDate = isLeft ? leftDate : rightDate;

      let nextStart = startDate;
      if (mode === "year") {
        nextStart = getValidDateOfYear(
          startDate.year(value),
          lang,
          disabledDate,
        );
      }
      if (mode === "month") {
        nextStart = getValidDateOfMonth(
          startDate,
          startDate.year(),
          value,
          lang,
          disabledDate,
        );
      }

      let nextEnd = isLeft ? rightDate : leftDate;
      if (!unlinkPanels) {
        nextEnd = isLeft
          ? nextStart.add(1, "month")
          : nextStart.subtract(1, "month");
      }

      if (isLeft) {
        setLeftDate(nextStart);
        setRightDate(nextEnd);
      } else {
        setRightDate(nextStart);
        setLeftDate(nextEnd);
      }

      if (isLeft)
        setLeftCurrentView(mode === "year" ? "month" : "date");
      else
        setRightCurrentView(mode === "year" ? "month" : "date");
      focusView(target);
      onPanelChange?.(
        [
          (isLeft ? nextStart : nextEnd).toDate(),
          (isLeft ? nextEnd : nextStart).toDate(),
        ],
        mode,
      );
    },
    [
      disabled,
      leftDate,
      rightDate,
      lang,
      disabledDate,
      unlinkPanels,
      onPanelChange,
    ],
  );

  const handleLeftYearPick = useCallback(
    (value: number) => handlePick("year", "left", value),
    [handlePick],
  );
  const handleRightYearPick = useCallback(
    (value: number) => handlePick("year", "right", value),
    [handlePick],
  );
  const handleLeftMonthPick = useCallback(
    (value: number) => handlePick("month", "left", value),
    [handlePick],
  );
  const handleRightMonthPick = useCallback(
    (value: number) => handlePick("month", "right", value),
    [handlePick],
  );

  const minDay = useMemo(
    () => new Day((minDate || leftDate).toDate()),
    [minDate, leftDate],
  );
  const maxDay = useMemo(
    () => new Day((maxDate || rightDate).toDate()),
    [maxDate, rightDate],
  );

  return (
    <div
      className={[
        "el-picker-panel",
        "el-date-range-picker",
        border && "is-border",
        dateRangeDisabled && "is-disabled",
        (sidebar || shortcuts.length) && "has-sidebar",
        showTime && "has-time",
        singlePanel && "single-panel",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="el-picker-panel__body-wrapper">
        {(sidebar || shortcuts.length > 0) && (
          <div className="el-picker-panel__sidebar">
            {sidebar}
            {shortcuts.map((shortcut, key) => (
              <button
                key={key}
                type="button"
                disabled={dateRangeDisabled}
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
            <div className="el-date-range-picker__time-header">
              <span className="el-date-range-picker__editors-wrap">
                <span className="el-date-range-picker__time-picker-wrap">
                  <ElInput
                    size="small"
                    className="el-date-range-picker__editor"
                    disabled={rangeState.selecting || dateRangeDisabled}
                    placeholder={t("el.datepicker.startDate")}
                    value={minVisibleDate}
                    validateEvent={false}
                    readOnly={!editable}
                    onChange={(value) =>
                      handleDateInput(value, "min")
                    }
                    onValueChange={(value) =>
                      handleDateChange(value, "min")
                    }
                  />
                </span>
                <span
                  ref={minTimeWrapRef}
                  className="el-date-range-picker__time-picker-wrap"
                >
                  <ElInput
                    size="small"
                    className="el-date-range-picker__editor"
                    disabled={rangeState.selecting || dateRangeDisabled}
                    placeholder={t("el.datepicker.startTime")}
                    value={minVisibleTime}
                    validateEvent={false}
                    readOnly={!editable}
                    onFocus={() => setMinTimePickerVisible(true)}
                    onChange={(value) =>
                      handleTimeInput(value, "min")
                    }
                    onValueChange={(value) =>
                      handleTimeChange(value, "min")
                    }
                  />
                  {minTimePickerVisible && (
                    <TimePanel
                      parsedValue={minDay}
                      visible={minTimePickerVisible}
                      format={timeFormatValue}
                      datetimeRole="start"
                      arrowControl={arrowControl}
                      disabledHours={disabledHours}
                      disabledMinutes={disabledMinutes}
                      disabledSeconds={disabledSeconds}
                      onPick={(value, pickerVisible) =>
                        handleMinTimePick(
                          value as Day | null,
                          pickerVisible,
                        )
                      }
                      onSelectRange={() => undefined}
                    />
                  )}
                </span>
              </span>
              <span>
                <ElIcon>
                  <ArrowRight />
                </ElIcon>
              </span>
              <span className="el-date-range-picker__editors-wrap is-right">
                <span className="el-date-range-picker__time-picker-wrap">
                  <ElInput
                    size="small"
                    className="el-date-range-picker__editor"
                    disabled={rangeState.selecting || dateRangeDisabled}
                    placeholder={t("el.datepicker.endDate")}
                    value={maxVisibleDate}
                    readOnly={!minDate || !editable}
                    validateEvent={false}
                    onChange={(value) =>
                      handleDateInput(value, "max")
                    }
                    onValueChange={(value) =>
                      handleDateChange(value, "max")
                    }
                  />
                </span>
                <span
                  ref={maxTimeWrapRef}
                  className="el-date-range-picker__time-picker-wrap"
                >
                  <ElInput
                    size="small"
                    className="el-date-range-picker__editor"
                    disabled={rangeState.selecting || dateRangeDisabled}
                    placeholder={t("el.datepicker.endTime")}
                    value={maxVisibleTime}
                    readOnly={!minDate || !editable}
                    validateEvent={false}
                    onFocus={() => {
                      if (minDate) setMaxTimePickerVisible(true);
                    }}
                    onChange={(value) =>
                      handleTimeInput(value, "max")
                    }
                    onValueChange={(value) =>
                      handleTimeChange(value, "max")
                    }
                  />
                  {maxTimePickerVisible && (
                    <TimePanel
                      parsedValue={maxDay}
                      visible={maxTimePickerVisible}
                      format={timeFormatValue}
                      datetimeRole="end"
                      arrowControl={arrowControl}
                      disabledHours={disabledHours}
                      disabledMinutes={disabledMinutes}
                      disabledSeconds={disabledSeconds}
                      onPick={(value, pickerVisible) =>
                        handleMaxTimePick(
                          value as Day | null,
                          pickerVisible,
                        )
                      }
                      onSelectRange={() => undefined}
                    />
                  )}
                </span>
              </span>
            </div>
          )}
          <div
            className={[
              "el-picker-panel__content",
              "el-date-range-picker__content",
              !singlePanel && "is-left",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="el-date-range-picker__header">
              <button
                type="button"
                className="el-picker-panel__icon-btn d-arrow-left"
                aria-label={t("el.datepicker.prevYear")}
                disabled={dateRangeDisabled}
                onClick={leftPrevYear}
              >
                {prevYearIcon ?? (
                  <ElIcon>
                    <DArrowLeft />
                  </ElIcon>
                )}
              </button>
              {leftCurrentView === "date" && (
                <button
                  type="button"
                  className="el-picker-panel__icon-btn arrow-left"
                  aria-label={t("el.datepicker.prevMonth")}
                  disabled={dateRangeDisabled}
                  onClick={leftPrevMonth}
                >
                  {prevMonthIcon ?? (
                    <ElIcon>
                      <ArrowLeft />
                    </ElIcon>
                  )}
                </button>
              )}
              {(unlinkPanels || singlePanel) && (
                <button
                  type="button"
                  disabled={
                    !enableYearArrow || dateRangeDisabled
                  }
                  className={[
                    "el-picker-panel__icon-btn",
                    "d-arrow-right",
                    (!enableYearArrow || dateRangeDisabled) &&
                      "is-disabled",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-label={t("el.datepicker.nextYear")}
                  onClick={leftNextYear}
                >
                  {nextYearIcon ?? (
                    <ElIcon>
                      <DArrowRight />
                    </ElIcon>
                  )}
                </button>
              )}
              {((unlinkPanels && leftCurrentView === "date") ||
                singlePanel) && (
                <button
                  type="button"
                  disabled={
                    !enableMonthArrow || dateRangeDisabled
                  }
                  className={[
                    "el-picker-panel__icon-btn",
                    "arrow-right",
                    (!enableMonthArrow || dateRangeDisabled) &&
                      "is-disabled",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  aria-label={t("el.datepicker.nextMonth")}
                  onClick={leftNextMonth}
                >
                  {nextMonthIcon ?? (
                    <ElIcon>
                      <ArrowRight />
                    </ElIcon>
                  )}
                </button>
              )}
              <div>
                <span
                  role="button"
                  className="el-date-range-picker__header-label"
                  aria-live="polite"
                  tabIndex={disabled ? undefined : 0}
                  aria-disabled={disabled}
                  onKeyDown={(event) => {
                    if (event.key !== "Enter") return;
                    showPicker("left", "year");
                  }}
                  onClick={() => showPicker("left", "year")}
                >
                  {leftYearLabel}
                </span>
                {leftCurrentView === "date" && (
                  <span
                    role="button"
                    className="el-date-range-picker__header-label"
                    aria-live="polite"
                    tabIndex={disabled ? undefined : 0}
                    aria-disabled={disabled}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      showPicker("left", "month");
                    }}
                    onClick={() => showPicker("left", "month")}
                  >
                    {t(`el.datepicker.month${leftMonth + 1}`)}
                  </span>
                )}
              </div>
            </div>
            {leftCurrentView === "date" && (
              <BasicDateTable
                ref={leftViewRef as Ref<BasicDateTableExpose>}
                selectionMode="range"
                date={leftDate}
                minDate={minDate}
                maxDate={maxDate}
                rangeState={rangeState}
                disabledDate={disabledDate}
                cellClassName={cellClassName}
                showWeekNumber={showWeekNumber}
                disabled={dateRangeDisabled}
                renderCell={renderCell}
                onChangeRange={handleChangeRange}
                onPick={(value) =>
                  handleRangePick(
                    value as { minDate: Dayjs; maxDate: Dayjs | null },
                  )
                }
                onSelect={onSelect}
              />
            )}
            {leftCurrentView === "year" && (
              <BasicYearTable
                ref={leftViewRef as Ref<BasicYearTableExpose>}
                selectionMode="year"
                date={leftDate}
                parsedValue={parsedValue}
                disabledDate={disabledDate}
                disabled={dateRangeDisabled}
                cellClassName={cellClassName}
                renderCell={renderCell}
                onPick={(value) => {
                  if (typeof value === "number")
                    handleLeftYearPick(value);
                }}
              />
            )}
            {leftCurrentView === "month" && (
              <BasicMonthTable
                ref={leftViewRef as Ref<BasicMonthTableExpose>}
                selectionMode="month"
                date={leftDate}
                parsedValue={parsedValue}
                disabledDate={disabledDate}
                disabled={dateRangeDisabled}
                cellClassName={cellClassName}
                renderCell={renderCell}
                onPick={(value) => {
                  if (typeof value === "number")
                    handleLeftMonthPick(value);
                }}
              />
            )}
          </div>
          {!singlePanel && (
            <div className="el-picker-panel__content el-date-range-picker__content is-right">
              <div className="el-date-range-picker__header">
                {unlinkPanels && (
                  <button
                    type="button"
                    disabled={
                      !enableYearArrow || dateRangeDisabled
                    }
                    className={[
                      "el-picker-panel__icon-btn",
                      "d-arrow-left",
                      (!enableYearArrow || dateRangeDisabled) &&
                        "is-disabled",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-label={t("el.datepicker.prevYear")}
                    onClick={rightPrevYear}
                  >
                    {prevYearIcon ?? (
                      <ElIcon>
                        <DArrowLeft />
                      </ElIcon>
                    )}
                  </button>
                )}
                {unlinkPanels && rightCurrentView === "date" && (
                  <button
                    type="button"
                    disabled={
                      !enableMonthArrow || dateRangeDisabled
                    }
                    className={[
                      "el-picker-panel__icon-btn",
                      "arrow-left",
                      (!enableMonthArrow || dateRangeDisabled) &&
                        "is-disabled",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-label={t("el.datepicker.prevMonth")}
                    onClick={rightPrevMonth}
                  >
                    {prevMonthIcon ?? (
                      <ElIcon>
                        <ArrowLeft />
                      </ElIcon>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  className="el-picker-panel__icon-btn d-arrow-right"
                  aria-label={t("el.datepicker.nextYear")}
                  disabled={dateRangeDisabled}
                  onClick={rightNextYear}
                >
                  {nextYearIcon ?? (
                    <ElIcon>
                      <DArrowRight />
                    </ElIcon>
                  )}
                </button>
                {rightCurrentView === "date" && (
                  <button
                    type="button"
                    className="el-picker-panel__icon-btn arrow-right"
                    disabled={dateRangeDisabled}
                    aria-label={t("el.datepicker.nextMonth")}
                    onClick={rightNextMonth}
                  >
                    {nextMonthIcon ?? (
                      <ElIcon>
                        <ArrowRight />
                      </ElIcon>
                    )}
                  </button>
                )}
                <div>
                  <span
                    role="button"
                    className="el-date-range-picker__header-label"
                    aria-live="polite"
                    tabIndex={disabled ? undefined : 0}
                    aria-disabled={disabled}
                    onKeyDown={(event) => {
                      if (event.key !== "Enter") return;
                      showPicker("right", "year");
                    }}
                    onClick={() => showPicker("right", "year")}
                  >
                    {rightYearLabel}
                  </span>
                  {rightCurrentView === "date" && (
                    <span
                      role="button"
                      className="el-date-range-picker__header-label"
                      aria-live="polite"
                      tabIndex={disabled ? undefined : 0}
                      aria-disabled={disabled}
                      onKeyDown={(event) => {
                        if (event.key !== "Enter") return;
                        showPicker("right", "month");
                      }}
                      onClick={() => showPicker("right", "month")}
                    >
                      {t(`el.datepicker.month${rightMonth + 1}`)}
                    </span>
                  )}
                </div>
              </div>
              {rightCurrentView === "date" && (
                <BasicDateTable
                  ref={rightViewRef as Ref<BasicDateTableExpose>}
                  selectionMode="range"
                  date={rightDate}
                  minDate={minDate}
                  maxDate={maxDate}
                  rangeState={rangeState}
                  disabledDate={disabledDate}
                  cellClassName={cellClassName}
                  showWeekNumber={showWeekNumber}
                  disabled={dateRangeDisabled}
                  renderCell={renderCell}
                  onChangeRange={handleChangeRange}
                  onPick={(value) =>
                    handleRangePick(
                      value as {
                        minDate: Dayjs;
                        maxDate: Dayjs | null;
                      },
                    )
                  }
                  onSelect={onSelect}
                />
              )}
              {rightCurrentView === "year" && (
                <BasicYearTable
                  ref={rightViewRef as Ref<BasicYearTableExpose>}
                  selectionMode="year"
                  date={rightDate}
                  parsedValue={parsedValue}
                  disabledDate={disabledDate}
                  disabled={dateRangeDisabled}
                  cellClassName={cellClassName}
                  renderCell={renderCell}
                  onPick={(value) => {
                    if (typeof value === "number")
                      handleRightYearPick(value);
                  }}
                />
              )}
              {rightCurrentView === "month" && (
                <BasicMonthTable
                  ref={rightViewRef as Ref<BasicMonthTableExpose>}
                  selectionMode="month"
                  date={rightDate}
                  parsedValue={parsedValue}
                  disabledDate={disabledDate}
                  disabled={dateRangeDisabled}
                  cellClassName={cellClassName}
                  renderCell={renderCell}
                  onPick={(value) => {
                    if (typeof value === "number")
                      handleRightMonthPick(value);
                  }}
                />
              )}
            </div>
          )}
        </div>
      </div>
      {showFooter && showTime && (showConfirm || clearable) && (
        <div className="el-picker-panel__footer">
          {clearable && (
            <ElButton
              text
              size="small"
              className="el-picker-panel__link-btn"
              onClick={handleClearClick}
            >
              {t("el.datepicker.clear")}
            </ElButton>
          )}
          {showConfirm && (
            <ElButton
              plain
              size="small"
              className="el-picker-panel__link-btn"
              disabled={btnDisabled}
              onClick={() => handleRangeConfirm(false)}
            >
              {t("el.datepicker.confirm")}
            </ElButton>
          )}
        </div>
      )}
    </div>
  );
}
