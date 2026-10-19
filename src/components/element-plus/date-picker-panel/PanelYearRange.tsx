"use client";

import {
  useCallback,
  useImperativeHandle,
  useState,
  type ReactNode,
  type Ref,
} from "react";

import { useLocale } from "../config-provider/context";
import { useFormDisabled } from "../form";
import { ElIcon } from "../icon/ElIcon";
import { DArrowLeft, DArrowRight } from "../icons";

import { BasicYearTable } from "./BasicYearTable";
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

const step = 10;
const unit = "year";

export interface PanelYearRangeProps {
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
}

export function PanelYearRange({
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
}: PanelYearRangeProps & { ref?: Ref<PanelInstance> }) {
  const { name: lang } = useLocale();
  const formDisabled = useFormDisabled(disabled);
  const yearRangeDisabled = formDisabled;
  const defaultFormatFlag = isDefaultFormat ?? !format;

  const [leftDate, setLeftDate] = useState<Dayjs>(() =>
    dayjs().locale(lang),
  );
  const [rightDate, setRightDate] = useState<Dayjs>(() =>
    dayjs().locale(lang).add(step, unit),
  );

  const sortDates = useCallback(
    (minDateValue: Dayjs | undefined, maxDateValue: Dayjs | undefined) => {
      if (unlinkPanels && maxDateValue) {
        const minDateYear = minDateValue?.year() || 0;
        const maxDateYear = maxDateValue.year();
        setRightDate(
          minDateYear + step > maxDateYear
            ? maxDateValue.add(step, unit)
            : maxDateValue,
        );
      } else {
        setRightDate(leftDate.add(step, unit));
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
    step,
    visible,
    parsedValue,
    defaultValue,
    unlinkPanels,
    onPick,
    sortDates,
    setLeftDate,
    setRightDate,
  });

  const leftYear = Math.floor(leftDate.year() / 10) * 10 + 9;
  const rightYear = Math.floor(rightDate.year() / 10) * 10;

  const leftStartDate = Math.floor(leftDate.year() / 10) * 10;
  const rightStartDate = Math.floor(rightDate.year() / 10) * 10;
  const leftLabel = `${leftStartDate}-${leftStartDate + 9}`;
  const rightLabel = `${rightStartDate}-${rightStartDate + 9}`;

  const hasShortcuts = shortcuts.length > 0;

  const enableYearArrow =
    singlePanel || (unlinkPanels && rightYear > leftYear + 1);

  const leftPrevYear = () => {
    setLeftDate(leftDate.subtract(step, unit));
    if (!unlinkPanels) setRightDate(rightDate.subtract(step, unit));
  };

  const rightNextYear = () => {
    if (!unlinkPanels) setLeftDate(leftDate.add(step, unit));
    setRightDate(rightDate.add(step, unit));
  };

  const leftNextYear = () => {
    setLeftDate(leftDate.add(step, unit));
  };

  const rightPrevYear = () => {
    setRightDate(rightDate.subtract(step, unit));
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
    const defaults = getDefaultValue(defaultValue, {
      lang,
      step,
      unit,
      unlinkPanels,
    });
    setLeftDate(defaults[0]);
    setRightDate(defaults[1]);
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

  const isValidValue = useCallback((date: DayOrDays) => {
    if (!Array.isArray(date)) return false;
    return (
      isValidRange(date) &&
      (disabledDate
        ? !disabledDate(date[0].toDate()) &&
          !disabledDate(date[1].toDate())
        : true)
    );
  }, [disabledDate]);

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
        yearRangeDisabled && "is-disabled",
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
                disabled={yearRangeDisabled}
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
                disabled={yearRangeDisabled}
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
                  disabled={!enableYearArrow || yearRangeDisabled}
                  className={[
                    "el-picker-panel__icon-btn",
                    "d-arrow-right",
                    (!enableYearArrow || yearRangeDisabled) &&
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
            <BasicYearTable
              selectionMode="range"
              date={leftDate}
              minDate={minDate}
              maxDate={maxDate}
              rangeState={rangeState}
              disabledDate={disabledDate}
              disabled={yearRangeDisabled}
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
                    disabled={!enableYearArrow || yearRangeDisabled}
                    className={[
                      "el-picker-panel__icon-btn",
                      "d-arrow-left",
                      (!enableYearArrow || yearRangeDisabled) &&
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
                  disabled={yearRangeDisabled}
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
              <BasicYearTable
                selectionMode="range"
                date={rightDate}
                minDate={minDate}
                maxDate={maxDate}
                rangeState={rangeState}
                disabledDate={disabledDate}
                disabled={yearRangeDisabled}
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
