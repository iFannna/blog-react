"use client";

import {
  useCallback,
  useImperativeHandle,
  useState,
  type ReactNode,
  type Ref,
} from "react";

import { useLocale, useTranslator } from "../config-provider/context";
import { useFormDisabled } from "../form";
import { ElIcon } from "../icon/ElIcon";
import { DArrowLeft, DArrowRight } from "../icons";

import { BasicMonthTable } from "./BasicMonthTable";
import { dayjs } from "./dayjs";
import { useRangePicker } from "./use-range-picker";
import {
  correctlyParseUserInput,
  getDefaultValue,
  isValidRange,
} from "./utils";

import type { Dayjs } from "./dayjs";
import type {
  DateCell,
  DateShortcut,
  DayOrDays,
  PanelInstance,
  UserInput,
} from "./types";

export interface PanelMonthRangeProps {
  parsedValue?: Dayjs | Dayjs[];
  visible?: boolean;
  format?: string;
  isDefaultFormat?: boolean;
  defaultValue?: Date | [Date, Date];
  disabled?: boolean;
  border?: boolean;
  unlinkPanels?: boolean;
  singlePanel?: boolean;
  disabledDate?: (date: Date) => boolean;
  cellClassName?: (date: Date) => string;
  shortcuts?: DateShortcut[];
  sidebar?: ReactNode;
  valueOnClear?: unknown;
  renderCell?: (cell: DateCell) => ReactNode;
  prevYearIcon?: ReactNode;
  nextYearIcon?: ReactNode;
  onPick?: (value: Dayjs | Dayjs[] | null, keepOpen?: boolean) => void;
  onCalendarChange?: (dates: [Date, Date | null]) => void;
  onClear?: () => void;
}

export function PanelMonthRange({
  ref,
  parsedValue,
  visible = false,
  format = "",
  isDefaultFormat,
  defaultValue,
  disabled,
  border,
  unlinkPanels = false,
  singlePanel = false,
  disabledDate,
  cellClassName,
  shortcuts = [],
  sidebar,
  valueOnClear = null,
  renderCell,
  prevYearIcon,
  nextYearIcon,
  onPick,
  onCalendarChange,
}: PanelMonthRangeProps & { ref?: Ref<PanelInstance> }) {
  const { name: lang } = useLocale();
  const t = useTranslator();
  const formDisabled = useFormDisabled(disabled);
  const monthRangeDisabled = formDisabled;
  const defaultFormatFlag = isDefaultFormat ?? !format;

  const unit = "year";

  const [leftDate, setLeftDate] = useState<Dayjs>(() =>
    dayjs().locale(lang),
  );
  const [rightDate, setRightDate] = useState<Dayjs>(() =>
    dayjs().locale(lang).add(1, unit),
  );

  const sortDates = useCallback(
    (minDateValue: Dayjs | undefined, maxDateValue: Dayjs | undefined) => {
      if (unlinkPanels && maxDateValue) {
        const minDateYear = minDateValue?.year() || 0;
        const maxDateYear = maxDateValue.year();
        setRightDate(
          minDateYear === maxDateYear
            ? maxDateValue.add(1, unit)
            : maxDateValue,
        );
      } else {
        setRightDate(leftDate.add(1, unit));
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
    handleShortcutClick,
    onSelect,
  } = useRangePicker({
    unit,
    visible,
    parsedValue,
    defaultValue,
    unlinkPanels,
    onPick,
    sortDates,
    setLeftDate,
    setRightDate,
  });

  const leftYear = leftDate.year();
  const rightYear =
    rightDate.year() === leftDate.year()
      ? leftDate.year() + 1
      : rightDate.year();

  const hasShortcuts = shortcuts.length > 0;

  const leftLabel = `${leftYear} ${t("el.datepicker.year")}`;
  const rightLabel = `${rightDate.year()} ${t("el.datepicker.year")}`;

  const enableYearArrow =
    singlePanel || (unlinkPanels && rightYear > leftYear + 1);

  const leftPrevYear = () => {
    const nextLeft = leftDate.subtract(1, "year");
    setLeftDate(nextLeft);
    if (!unlinkPanels) setRightDate(rightDate.subtract(1, "year"));
  };

  const rightNextYear = () => {
    if (!unlinkPanels) setLeftDate(leftDate.add(1, "year"));
    setRightDate(rightDate.add(1, "year"));
  };

  const leftNextYear = () => {
    setLeftDate(leftDate.add(1, "year"));
  };

  const rightPrevYear = () => {
    setRightDate(rightDate.subtract(1, "year"));
  };

  const handleRangePick = useCallback(
    (
      value: { minDate: Dayjs; maxDate: Dayjs | null | undefined },
      close = true,
    ) => {
      const minDate_ = value.minDate;
      const maxDate_ = value.maxDate;
      if (maxDate === maxDate_ && minDate === minDate_) return;
      onCalendarChange?.([
        minDate_.toDate(),
        maxDate_ ? maxDate_.toDate() : null,
      ]);
      setMaxDate(maxDate_ ?? undefined);
      setMinDate(minDate_);

      if (!close) return;
      if (maxDate_ && isValidRange([minDate_, maxDate_])) {
        onPick?.([minDate_, maxDate_], false);
      }
    },
    [maxDate, minDate, onCalendarChange, onPick, setMaxDate, setMinDate],
  );

  const handleClear = useCallback(() => {
    const first = getDefaultValue(defaultValue, {
      lang,
      unit: "year",
      unlinkPanels,
    })[0];
    setLeftDate(first);
    setRightDate(first.add(1, "year"));
    onPick?.((valueOnClear ?? null) as Dayjs | null);
  }, [defaultValue, lang, unlinkPanels, onPick, valueOnClear]);

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

  const isValidValue = useCallback(
    (date: DayOrDays) =>
      Array.isArray(date) ? isValidRange(date) : false,
    [],
  );

  useImperativeHandle(
    ref,
    () => ({
      focus: () => undefined,
      isValidValue,
      parseUserInput,
      handleClear,
    }),
    [isValidValue, parseUserInput, handleClear],
  );

  return (
    <div
      className={[
        "el-picker-panel",
        "el-date-range-picker",
        border && "is-border",
        monthRangeDisabled && "is-disabled",
        (sidebar || hasShortcuts) && "has-sidebar",
        singlePanel && "single-panel",
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
                disabled={monthRangeDisabled}
                onClick={() => handleShortcutClick(shortcut)}
              >
                {shortcut.text}
              </button>
            ))}
          </div>
        )}
        <div className="el-picker-panel__body">
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
                disabled={monthRangeDisabled}
                onClick={leftPrevYear}
              >
                {prevYearIcon ?? (
                  <ElIcon>
                    <DArrowLeft />
                  </ElIcon>
                )}
              </button>
              {(unlinkPanels || singlePanel) && (
                <button
                  type="button"
                  disabled={!enableYearArrow || monthRangeDisabled}
                  className={[
                    "el-picker-panel__icon-btn",
                    "d-arrow-right",
                    (!enableYearArrow || monthRangeDisabled) &&
                      "is-disabled",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={leftNextYear}
                >
                  {nextYearIcon ?? (
                    <ElIcon>
                      <DArrowRight />
                    </ElIcon>
                  )}
                </button>
              )}
              <div>{leftLabel}</div>
            </div>
            <BasicMonthTable
              selectionMode="range"
              date={leftDate}
              minDate={minDate}
              maxDate={maxDate}
              rangeState={rangeState}
              disabledDate={disabledDate}
              disabled={monthRangeDisabled}
              cellClassName={cellClassName}
              renderCell={renderCell}
              onChangeRange={handleChangeRange}
              onPick={(value) => {
                if (typeof value === "object" && !Array.isArray(value)) {
                  handleRangePick(value);
                }
              }}
              onSelect={onSelect}
            />
          </div>
          {!singlePanel && (
            <div className="el-picker-panel__content el-date-range-picker__content is-right">
              <div className="el-date-range-picker__header">
                {unlinkPanels && (
                  <button
                    type="button"
                    disabled={!enableYearArrow || monthRangeDisabled}
                    className={[
                      "el-picker-panel__icon-btn",
                      "d-arrow-left",
                      (!enableYearArrow || monthRangeDisabled) &&
                        "is-disabled",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={rightPrevYear}
                  >
                    {prevYearIcon ?? (
                      <ElIcon>
                        <DArrowLeft />
                      </ElIcon>
                    )}
                  </button>
                )}
                <button
                  type="button"
                  className="el-picker-panel__icon-btn d-arrow-right"
                  disabled={monthRangeDisabled}
                  onClick={rightNextYear}
                >
                  {nextYearIcon ?? (
                    <ElIcon>
                      <DArrowRight />
                    </ElIcon>
                  )}
                </button>
                <div>{rightLabel}</div>
              </div>
              <BasicMonthTable
                selectionMode="range"
                date={rightDate}
                minDate={minDate}
                maxDate={maxDate}
                rangeState={rangeState}
                disabledDate={disabledDate}
                disabled={monthRangeDisabled}
                cellClassName={cellClassName}
                renderCell={renderCell}
                onChangeRange={handleChangeRange}
                onPick={(value) => {
                  if (
                    typeof value === "object" &&
                    !Array.isArray(value)
                  ) {
                    handleRangePick(value);
                  }
                }}
                onSelect={onSelect}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
