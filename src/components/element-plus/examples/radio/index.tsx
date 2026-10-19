"use client";

import { useState } from "react";
import { ElRadio, ElRadioGroup } from "@/components/element-plus/radio";
import type { RadioValue } from "@/components/element-plus/radio";

const stack = { display: "flex", flexDirection: "column", gap: "1rem" } as const;
const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  alignItems: "center",
} as const;

export function RadioBasic() {
  const [value, setValue] = useState<RadioValue>("1");
  return (
    <div style={stack}>
      <ElRadioGroup value={value} onChange={setValue}>
        <ElRadio value="1" label="选项一" />
        <ElRadio value="2" label="选项二" />
      </ElRadioGroup>
    </div>
  );
}

export function RadioDisabled() {
  const [value, setValue] = useState<RadioValue>("1");
  return (
    <div style={stack}>
      <ElRadioGroup value={value} onChange={setValue}>
        <ElRadio value="1" label="选项一" />
        <ElRadio value="2" label="选项二" disabled />
      </ElRadioGroup>
      <ElRadioGroup value="1" onChange={() => {}} disabled>
        <ElRadio value="1" label="全部禁用一" />
        <ElRadio value="2" label="全部禁用二" />
      </ElRadioGroup>
    </div>
  );
}

export function RadioButton() {
  const [value, setValue] = useState<RadioValue>("1");
  return (
    <div style={stack}>
      <ElRadioGroup value={value} onChange={setValue} type="button">
        <ElRadio value="1" label="上海" />
        <ElRadio value="2" label="北京" />
        <ElRadio value="3" label="广州" />
      </ElRadioGroup>
      <ElRadioGroup
        value="1"
        onChange={() => {}}
        type="button"
        fill="#626aef"
        textColor="#fff"
      >
        <ElRadio value="1" label="自定义填充色" />
        <ElRadio value="2" label="未选中" />
      </ElRadioGroup>
    </div>
  );
}

export function RadioBorder() {
  const [value, setValue] = useState<RadioValue>("1");
  return (
    <div style={row}>
      <ElRadioGroup value={value} onChange={setValue}>
        <ElRadio value="1" label="选项一" border />
        <ElRadio value="2" label="选项二" border />
      </ElRadioGroup>
    </div>
  );
}

const OPTION_PROPS = { value: "id", label: "name", disabled: "unable" } as const;
const OPTIONS = [
  { id: 3, name: "Option A" },
  { id: 6, name: "Option B" },
  { id: 9, name: "Option C", unable: true },
];

export function RadioOptions() {
  const [value, setValue] = useState<RadioValue>(3);
  return (
    <div style={stack}>
      <ElRadioGroup
        value={value}
        onChange={setValue}
        options={OPTIONS}
        optionProps={OPTION_PROPS}
      />
    </div>
  );
}

export function RadioSizes() {
  const [value, setValue] = useState<RadioValue>("1");
  return (
    <div style={stack}>
      <ElRadioGroup value={value} onChange={setValue} size="large">
        <ElRadio value="1" label="large" />
        <ElRadio value="2" label="选项二" />
      </ElRadioGroup>
      <ElRadioGroup value={value} onChange={setValue}>
        <ElRadio value="1" label="default" />
        <ElRadio value="2" label="选项二" />
      </ElRadioGroup>
      <ElRadioGroup value={value} onChange={setValue} size="small">
        <ElRadio value="1" label="small" />
        <ElRadio value="2" label="选项二" />
      </ElRadioGroup>
    </div>
  );
}
