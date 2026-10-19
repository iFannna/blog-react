import { useCallback, useEffect, useState } from "react";

import { useLocale } from "../config-provider/context";

import { dayjs } from "./dayjs";
import { getDefaultValue, isValidRange } from "./utils";

import type { Dayjs } from "./dayjs";
import type { DateShortcut, RangeState } from "./types";

export interface UseRangePickerOptions {
  unit: "month" | "year";
  step?: number;
  visible?: boolean;
  parsedValue?: Dayjs | Dayjs[];
  defaultValue?: Date | [Date, Date];
  defaultTime?: Date | [Date, Date];
  unlinkPanels?: boolean;
  onPick?: (value: [Dayjs, Dayjs] | null, keepOpen?: boolean) => void;
  sortDates: (
    minDate: Dayjs | undefined,
    maxDate: Dayjs | undefined,
  ) => void;
  setLeftDate: (date: Dayjs) => void;
  setRightDate: (date: Dayjs) => void;
}

/**
 * 对应官方 useRangePicker。
 *
 * 两个外部 watch 在这里合并为 effect：parsedValue 变化时同步，
 * visible 变为 true 时重新解析。
 */
export function useRangePicker({
  unit,
  step = 1,
  visible,
  parsedValue,
  defaultValue,
  defaultTime,
  unlinkPanels = false,
  onPick,
  sortDates,
  setLeftDate,
  setRightDate,
}: UseRangePickerOptions) {
  const { name: lang } = useLocale();
  const [minDate, setMinDate] = useState<Dayjs>();
  const [maxDate, setMaxDate] = useState<Dayjs>();
  const [rangeState, setRangeState] = useState<RangeState>({
    endDate: null,
    selecting: false,
  });

  const restoreDefault = useCallback(() => {
    let [start, end] = getDefaultValue(defaultValue, {
      lang,
      step,
      unit,
      unlinkPanels,
    });

    if (defaultTime) {
      const getShift = (day: Dayjs) =>
        day.diff(day.startOf("d"), "ms");
      let leftShift = 0;
      let rightShift = 0;
      if (Array.isArray(defaultTime)) {
        const [timeStart, timeEnd] = defaultTime.map((item) =>
          dayjs(item),
        );
        leftShift = getShift(timeStart);
        rightShift = getShift(timeEnd);
      } else {
        const shift = getShift(dayjs(defaultTime));
        leftShift = shift;
        rightShift = shift;
      }
      start = start.startOf("d").add(leftShift, "ms");
      end = end.startOf("d").add(rightShift, "ms");
    }

    setMinDate(undefined);
    setMaxDate(undefined);
    setLeftDate(start);
    setRightDate(end);
  }, [
    defaultValue,
    defaultTime,
    lang,
    step,
    unit,
    unlinkPanels,
    setLeftDate,
    setRightDate,
  ]);

  const parseValue = useCallback(
    (value?: Dayjs | Dayjs[]) => {
      if (Array.isArray(value) && value.length === 2) {
        const [start, end] = value;
        setMinDate(start);
        setLeftDate(start);
        setMaxDate(end);
        sortDates(start, end);
      } else {
        restoreDefault();
      }
    },
    [restoreDefault, sortDates, setLeftDate],
  );

  /*
   * 这里逐条对应官方的四个 watch。左右面板日期由父组件命令式持有，
   * 无法在渲染期派生；parsedValue 在调用方已记忆化，effect 只在外部值
   * 或面板显隐真正变化时执行，回调内的多次 setState 由 React 批处理，
   * 不会形成级联循环，因此按 Vue watch 语义保留 effect。
   */
  /* eslint-disable react-hooks/set-state-in-effect */
  // 与官方 watch(defaultValue, { immediate: true }) 对应
  useEffect(() => {
    if (defaultValue) restoreDefault();
  }, [defaultValue, restoreDefault]);

  // 与官方 watch(parsedValue, { immediate: true }) 对应
  useEffect(() => {
    parseValue(parsedValue);
    // parseValue 会更新面板内部状态，不应因此重复解析
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsedValue]);

  // 与官方 watch(visible, { immediate: true }) 对应：打开时重新解析绑定值
  useEffect(() => {
    if (visible) parseValue(parsedValue);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  // 与官方 visible watch 对应：关闭时若仍在选择，恢复已确认的值
  useEffect(() => {
    if (!visible && rangeState.selecting) {
      parseValue(parsedValue);
      setRangeState({ selecting: false, endDate: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleChangeRange = useCallback((value: RangeState) => {
    setRangeState(value);
  }, []);

  const handleRangeConfirm = useCallback(
    (keepOpen = false) => {
      if (isValidRange([minDate, maxDate])) {
        onPick?.([minDate!, maxDate!], keepOpen);
      }
    },
    [minDate, maxDate, onPick],
  );

  const onSelect = useCallback((selecting: boolean) => {
    setRangeState((current) =>
      selecting
        ? { ...current, selecting }
        : { selecting: false, endDate: null },
    );
  }, []);

  const toRange = useCallback(
    (value: Date | [Date, Date]) =>
      (Array.isArray(value) ? value : [value, value]).map((item) =>
        dayjs(item).locale(lang),
      ) as [Dayjs, Dayjs],
    [lang],
  );

  const handleShortcutClick = useCallback(
    (shortcut: DateShortcut) => {
      const shortcutValues =
        typeof shortcut.value === "function"
          ? shortcut.value()
          : shortcut.value;
      if (shortcutValues) {
        onPick?.(toRange(shortcutValues));
        return;
      }
      shortcut.onClick?.({
        emit: (value) => onPick?.(value ? toRange(value) : null),
      });
    },
    [onPick, toRange],
  );

  return {
    minDate,
    maxDate,
    setMinDate,
    setMaxDate,
    rangeState,
    handleChangeRange,
    handleRangeConfirm,
    handleShortcutClick,
    onSelect,
    parseValue,
    restoreDefault,
  };
}
