"use client";

import { useState } from "react";
import { ElRadio, ElRadioGroup } from "@/components/element-plus/radio";
import type { RadioValue } from "@/components/element-plus/radio";

const stack = { display: "flex", flexDirection: "column", gap: 16 } as const;
const spacedRow = { marginTop: 20 } as const;

export function RadioBasic() {
  const [radio1, setRadio1] = useState<RadioValue>("1");
  const [radio2, setRadio2] = useState<RadioValue>("1");
  const [radio3, setRadio3] = useState<RadioValue>("1");

  return (
    <>
      <div style={{ marginBottom: 8, marginLeft: 16 }}>
        <ElRadioGroup value={radio1} onChange={setRadio1}>
          <ElRadio value="1" size="large">Option 1</ElRadio>
          <ElRadio value="2" size="large">Option 2</ElRadio>
        </ElRadioGroup>
      </div>
      <div style={{ margin: "8px 0 8px 16px" }}>
        <ElRadioGroup value={radio2} onChange={setRadio2}>
          <ElRadio value="1">Option 1</ElRadio>
          <ElRadio value="2">Option 2</ElRadio>
        </ElRadioGroup>
      </div>
      <div style={{ margin: "16px 0 16px 16px" }}>
        <ElRadioGroup value={radio3} onChange={setRadio3}>
          <ElRadio value="1" size="small">Option 1</ElRadio>
          <ElRadio value="2" size="small">Option 2</ElRadio>
        </ElRadioGroup>
      </div>
    </>
  );
}

export function RadioDisabled() {
  return (
    <>
      <ElRadio checked={false} disabled value="disabled">
        Option A
      </ElRadio>
      <ElRadio checked disabled value="selected and disabled">
        Option B
      </ElRadio>
    </>
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
    <ElRadioGroup
      value={value}
      onChange={setValue}
      options={OPTIONS}
      optionProps={OPTION_PROPS}
    />
  );
}

export function RadioButton() {
  const [radio, setRadio] = useState<RadioValue>("New York");

  return (
    <>
      <div>
        <ElRadioGroup
          value={radio}
          onChange={setRadio}
          size="large"
          fill="#409eff"
        >
          <ElRadio button value="New York">New York</ElRadio>
          <ElRadio button value="Washington">Washington</ElRadio>
          <ElRadio button value="Los Angeles">Los Angeles</ElRadio>
          <ElRadio button value="Chicago">Chicago</ElRadio>
        </ElRadioGroup>
      </div>
      <div style={spacedRow}>
        <ElRadioGroup
          value={radio}
          onChange={setRadio}
          textColor="#fff"
          fill="#6c6cff"
        >
          <ElRadio button value="New York">New York</ElRadio>
          <ElRadio button value="Washington">Washington</ElRadio>
          <ElRadio button value="Los Angeles">Los Angeles</ElRadio>
          <ElRadio button value="Chicago">Chicago</ElRadio>
        </ElRadioGroup>
      </div>
      <div style={spacedRow}>
        <ElRadioGroup value={radio} onChange={setRadio} size="small">
          <ElRadio button value="New York">New York</ElRadio>
          <ElRadio button value="Washington" disabled>Washington</ElRadio>
          <ElRadio button value="Los Angeles">Los Angeles</ElRadio>
          <ElRadio button value="Chicago">Chicago</ElRadio>
        </ElRadioGroup>
      </div>
    </>
  );
}

export function RadioBorder() {
  const [radio1, setRadio1] = useState<RadioValue>("1");
  const [radio2, setRadio2] = useState<RadioValue>("1");
  const [radio3, setRadio3] = useState<RadioValue>("1");
  const [radio4, setRadio4] = useState<RadioValue>("1");

  return (
    <>
      <div>
        <ElRadioGroup value={radio1} onChange={setRadio1}>
          <ElRadio value="1" size="large" border>Option A</ElRadio>
          <ElRadio value="2" size="large" border>Option B</ElRadio>
        </ElRadioGroup>
      </div>
      <div style={spacedRow}>
        <ElRadioGroup value={radio2} onChange={setRadio2}>
          <ElRadio value="1" border>Option A</ElRadio>
          <ElRadio value="2" border>Option B</ElRadio>
        </ElRadioGroup>
      </div>
      <div style={spacedRow}>
        <ElRadioGroup value={radio3} onChange={setRadio3} size="small">
          <ElRadio value="1" border>Option A</ElRadio>
          <ElRadio value="2" border disabled>Option B</ElRadio>
        </ElRadioGroup>
      </div>
      <div style={spacedRow}>
        <ElRadioGroup value={radio4} onChange={setRadio4} size="small" disabled>
          <ElRadio value="1" border>Option A</ElRadio>
          <ElRadio value="2" border>Option B</ElRadio>
        </ElRadioGroup>
      </div>
    </>
  );
}

export function RadioSizes() {
  const [radio1, setRadio1] = useState<RadioValue>("1");
  const [radio2, setRadio2] = useState<RadioValue>("1");
  const [radio3, setRadio3] = useState<RadioValue>("1");

  return (
    <div style={stack}>
      <ElRadioGroup value={radio1} onChange={setRadio1} size="large">
        <ElRadio value="1">Option 1</ElRadio>
        <ElRadio value="2">Option 2</ElRadio>
      </ElRadioGroup>
      <ElRadioGroup value={radio2} onChange={setRadio2}>
        <ElRadio value="1">Option 1</ElRadio>
        <ElRadio value="2">Option 2</ElRadio>
      </ElRadioGroup>
      <ElRadioGroup value={radio3} onChange={setRadio3} size="small">
        <ElRadio value="1">Option 1</ElRadio>
        <ElRadio value="2">Option 2</ElRadio>
      </ElRadioGroup>
    </div>
  );
}
