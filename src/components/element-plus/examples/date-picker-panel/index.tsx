"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

import { ElCard } from "@/components/element-plus/card";
import { ElConfigProvider, en } from "@/components/element-plus/config-provider";
import { ElDatePickerPanel } from "@/components/element-plus/date-picker-panel";
import { ElDivider } from "@/components/element-plus/divider";
import { ElSelect } from "@/components/element-plus/select";
import { ElSwitch } from "@/components/element-plus/switch";
import type {
  DateModelValue,
  DatePickerType,
} from "@/components/element-plus/date-picker-panel";

const DATE_PICKER_TYPES: DatePickerType[] = [
  "year",
  "years",
  "month",
  "months",
  "date",
  "dates",
  "week",
  "datetime",
  "datetimerange",
  "daterange",
  "monthrange",
  "quarterrange",
  "yearrange",
];

function DatePickerPanelBasicDemo() {
  const [value, setValue] = useState<DateModelValue>(null);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <ElDatePickerPanel value={value} onChange={setValue} />
    </div>
  );
}

function DatePickerPanelAllTypesDemo() {
  const [type, setType] = useState<DatePickerType>("date");
  const [date, setDate] = useState<DateModelValue>(null);

  return (
    <div>
      <div style={{ display: "flex", gap: "16px" }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            flexBasis: 150,
            gap: 4,
          }}
        >
          <span>Type:</span>
          <ElSelect
            value={type}
            options={DATE_PICKER_TYPES.map((item) => ({
              value: item,
              label: item,
            }))}
            onChange={(next) => {
              setType(next as DatePickerType);
              setDate(null);
            }}
          />
        </div>
      </div>
      <ElDivider />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <ElDatePickerPanel value={date} onChange={setDate} type={type} />
      </div>
    </div>
  );
}

function DatePickerPanelBorderDemo() {
  const [value, setValue] = useState<DateModelValue>(null);
  const [isNarrow, setIsNarrow] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // 官方 demo 在容器窄于 815px 时把竖分隔线换成横线
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      setIsNarrow(entry.contentRect.width < 815);
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef}>
      <div style={{ textAlign: "center" }}>No border:</div>
      <ElDivider />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 16,
          justifyContent: "center",
        }}
      >
        <div style={{ padding: 20 }}>
          <ElDatePickerPanel
            value={value}
            onChange={setValue}
            border={false}
          />
        </div>
        <ElDivider
          style={{ height: "auto" }}
          direction={isNarrow ? "horizontal" : "vertical"}
        />
        <ElCard>
          <ElDatePickerPanel
            value={value}
            onChange={setValue}
            border={false}
          />
        </ElCard>
      </div>
    </div>
  );
}

function DatePickerPanelDisabledDemo() {
  const [value, setValue] = useState<DateModelValue>(null);
  const [disabled, setDisabled] = useState(true);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <ElSwitch
        checked={disabled}
        onCheckedChange={setDisabled}
        activeText="Disabled"
        inactiveText="Enabled"
      />
      <ElDatePickerPanel
        value={value}
        onChange={setValue}
        disabled={disabled}
      />
    </div>
  );
}

/** 官方文档 demo 运行在 en 语言环境，与站点正文语言无关。 */
function withEn(Component: () => ReactNode) {
  return function Demo() {
    return (
      <ElConfigProvider locale={en}>
        <Component />
      </ElConfigProvider>
    );
  };
}
export const DatePickerPanelBasic = withEn(DatePickerPanelBasicDemo);
export const DatePickerPanelAllTypes = withEn(DatePickerPanelAllTypesDemo);
export const DatePickerPanelBorder = withEn(DatePickerPanelBorderDemo);
export const DatePickerPanelDisabled = withEn(DatePickerPanelDisabledDemo);
