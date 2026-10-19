"use client";

import { useState } from "react";

import { ElCard } from "@/components/ui/card";
import { ElDatePickerPanel } from "@/components/ui/date-picker-panel";
import { ElDivider } from "@/components/ui/divider";
import { ElSelect } from "@/components/ui/select";
import { ElSwitch } from "@/components/ui/switch";
import type {
  DateModelValue,
  DatePickerType,
} from "@/components/ui/date-picker-panel";

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
  "yearrange",
];

export function DatePickerPanelBasic() {
  const [value, setValue] = useState<DateModelValue>(null);

  return (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <ElDatePickerPanel value={value} onChange={setValue} />
    </div>
  );
}

export function DatePickerPanelAllTypes() {
  const [type, setType] = useState<DatePickerType>("date");
  const [date, setDate] = useState<DateModelValue>(null);

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem" }}>
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

export function DatePickerPanelBorder() {
  const [value, setValue] = useState<DateModelValue>(null);

  return (
    <div>
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
        <ElDivider style={{ height: "auto" }} direction="vertical" />
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

export function DatePickerPanelDisabled() {
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
