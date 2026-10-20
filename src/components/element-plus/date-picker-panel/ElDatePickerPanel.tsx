"use client";

import {
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  type Ref,
} from "react";

import { useLocale } from "../config-provider/context";

import {
  DEFAULT_FORMATS_DATE,
  DEFAULT_FORMATS_DATEPICKER,
} from "./constants";
import { PanelDatePick } from "./PanelDatePick";
import { PanelDateRange } from "./PanelDateRange";
import { PanelMonthRange } from "./PanelMonthRange";
import { PanelQuarterRange } from "./PanelQuarterRange";
import { PanelYearRange } from "./PanelYearRange";
import { formatter, parseDate, valueEquals } from "./utils";

import type { Dayjs } from "./dayjs";
import type {
  DateModelValue,
  DateModelType,
  DatePickerPanelExpose,
  DatePickerPanelProps,
  DayOrDays,
  PanelInstance,
  SingleOrRange,
  UserInput,
} from "./types";

type RawPickValue = Date | [Date, Date] | Date[] | null;

/**
 * 对应官方 date-picker-panel.tsx：独立面板 + 内部 common picker 状态。
 *
 * 面板负责把 Dayjs 选中值转换回 Date / Date[]，再按 valueFormat 格式化后
 * 通过 onChange 交给外部（即官方 update:modelValue）。
 */
export function ElDatePickerPanel({
  ref,
  value,
  onChange,
  onPickerVisibleChange,
  onPick,
  type = "date",
  format,
  isDefaultFormat,
  valueFormat,
  ...rest
}: DatePickerPanelProps & { ref?: Ref<DatePickerPanelExpose> }) {
  const { name: lang } = useLocale();
  const panelRef = useRef<PanelInstance>(null);

  const effectiveFormat =
    format ??
    (DEFAULT_FORMATS_DATEPICKER[type] || DEFAULT_FORMATS_DATE);

  const valueIsEmpty = useMemo(() => {
    if (!value) return true;
    if (Array.isArray(value)) {
      return !value.filter(Boolean).length;
    }
    return false;
  }, [value]);

  const parsedValue = useMemo<DayOrDays | undefined>(() => {
    if (valueIsEmpty) return undefined;
    if (Array.isArray(value)) {
      const parsed = value.map((item) =>
        parseDate(item as DateModelType, valueFormat, lang),
      );
      if (parsed.some((item) => !item)) {
        return [] as unknown as DayOrDays;
      }
      return parsed as [Dayjs, Dayjs];
    }
    return parseDate(
      (value ?? "") as DateModelType,
      valueFormat,
      lang,
    );
  }, [value, valueIsEmpty, valueFormat, lang]);

  const emitInput = useCallback(
    (input: SingleOrRange<DateModelType> | null) => {
      if (valueEquals(value, input)) return;
      let formatted: DateModelValue;
      if (Array.isArray(input)) {
        formatted = input.map((item) =>
          formatter(item, valueFormat, lang),
        ) as DateModelValue;
      } else {
        formatted = input
          ? (formatter(input, valueFormat, lang) as DateModelValue)
          : null;
      }
      onChange?.(formatted);
    },
    [value, valueFormat, lang, onChange],
  );

  const handlePick = useCallback(
    (date: Dayjs | Dayjs[] | null, keepOpen?: boolean) => {
      let result: RawPickValue;
      if (Array.isArray(date)) {
        result = date.map((item) => item.toDate());
      } else {
        result = date ? date.toDate() : null;
      }
      emitInput(result as SingleOrRange<DateModelType> | null);
      onPick?.(result, keepOpen);
      onPickerVisibleChange?.(!!keepOpen);
    },
    [emitInput, onPick, onPickerVisibleChange],
  );

  const expose = useMemo<DatePickerPanelExpose>(
    () => ({
      focus: () => panelRef.current?.focus(),
      isValidValue: (date: DayOrDays) =>
        panelRef.current?.isValidValue(date) ?? false,
      parseUserInput: (input: UserInput) =>
        panelRef.current?.parseUserInput(input) ?? null,
      handleClear: () => panelRef.current?.handleClear?.(),
      handleFocusPicker: () => panelRef.current?.handleFocusPicker?.(),
    }),
    [],
  );

  useImperativeHandle(ref, () => expose, [expose]);

  const commonProps = {
    parsedValue,
    visible: rest.visible,
    format: effectiveFormat,
    isDefaultFormat,
    defaultValue: rest.defaultValue,
    defaultTime: rest.defaultTime,
    disabled: rest.disabled,
    editable: rest.editable ?? true,
    border: rest.border ?? true,
    clearable: rest.clearable ?? true,
    unlinkPanels: rest.unlinkPanels,
    singlePanel: rest.singlePanel,
    showNow: rest.showNow ?? true,
    showConfirm: rest.showConfirm ?? false,
    showFooter: rest.showFooter ?? false,
    showWeekNumber: rest.showWeekNumber,
    arrowControl: rest.arrowControl,
    disabledDate: rest.disabledDate,
    cellClassName: rest.cellClassName,
    disabledHours: rest.disabledHours,
    disabledMinutes: rest.disabledMinutes,
    disabledSeconds: rest.disabledSeconds,
    shortcuts: rest.shortcuts,
    sidebar: rest.sidebar,
    renderCell: rest.renderCell,
    prevMonthIcon: rest.prevMonthIcon,
    nextMonthIcon: rest.nextMonthIcon,
    prevYearIcon: rest.prevYearIcon,
    nextYearIcon: rest.nextYearIcon,
    valueOnClear: rest.valueOnClear,
    onPick: handlePick,
    onCalendarChange: rest.onCalendarChange,
    onPanelChange: rest.onPanelChange,
    onClear: rest.onClear,
  };

  if (type === "daterange" || type === "datetimerange") {
    return (
      <PanelDateRange
        ref={panelRef}
        {...commonProps}
        type={type}
        dateFormat={rest.dateFormat}
        timeFormat={rest.timeFormat}
      />
    );
  }

  if (type === "monthrange") {
    return <PanelMonthRange ref={panelRef} {...commonProps} />;
  }

  if (type === "quarterrange") {
    return <PanelQuarterRange ref={panelRef} {...commonProps} />;
  }

  if (type === "yearrange") {
    return <PanelYearRange ref={panelRef} {...commonProps} />;
  }

  return (
    <PanelDatePick
      ref={panelRef}
      {...commonProps}
      type={type}
      dateFormat={rest.dateFormat}
      timeFormat={rest.timeFormat}
    />
  );
}
