"use client";

import { useState } from "react";
import { ElCheckbox, ElCheckboxGroup } from "@/components/element-plus/checkbox";
import type { CheckboxValueType } from "@/components/element-plus/checkbox";

const stack = { display: "flex", flexDirection: "column", gap: "1rem" } as const;
const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  alignItems: "center",
} as const;

const CITIES = ["上海", "北京", "广州", "深圳"];
const ALL = ["上海", "北京", "广州", "深圳"];

export function CheckboxBasic() {
  const [checked, setChecked] = useState(false);
  return (
    <div style={stack}>
      <ElCheckbox checked={checked} onCheckedChange={setChecked}>选项</ElCheckbox>
    </div>
  );
}

export function CheckboxDisabled() {
  return (
    <div style={stack}>
      <ElCheckbox>未选中</ElCheckbox>
      <ElCheckbox checked disabled>选中且禁用</ElCheckbox>
      <ElCheckbox disabled>禁用</ElCheckbox>
    </div>
  );
}

export function CheckboxGroupDemo() {
  const [checked, setChecked] = useState<CheckboxValueType[]>(["上海"]);
  return (
    <div style={stack}>
      <ElCheckboxGroup value={checked} onChange={setChecked}>
        {CITIES.map((city) => (
          <ElCheckbox key={city} value={city} label={city} />
        ))}
      </ElCheckboxGroup>
    </div>
  );
}

export function CheckboxIndeterminate() {
  const [checked, setChecked] = useState<CheckboxValueType[]>(["上海", "北京"]);

  const isAll = checked.length === ALL.length;
  const isIndeterminate = checked.length > 0 && !isAll;

  return (
    <div style={stack}>
      <ElCheckbox
        checked={isAll}
        indeterminate={isIndeterminate}
        onCheckedChange={(value) => setChecked(value ? [...ALL] : [])}
      >
        全选
      </ElCheckbox>
      <ElCheckboxGroup value={checked} onChange={setChecked}>
        {ALL.map((city) => (
          <ElCheckbox key={city} value={city} label={city} />
        ))}
      </ElCheckboxGroup>
    </div>
  );
}

export function CheckboxMinMax() {
  const [checked, setChecked] = useState<CheckboxValueType[]>(["上海", "北京"]);
  return (
    <div style={stack}>
      <ElCheckboxGroup value={checked} onChange={setChecked} min={1} max={2}>
        {CITIES.map((city) => (
          <ElCheckbox key={city} value={city} label={city} />
        ))}
      </ElCheckboxGroup>
    </div>
  );
}

export function CheckboxButton() {
  const [checked, setChecked] = useState<CheckboxValueType[]>(["上海"]);
  return (
    <div style={stack}>
      <ElCheckboxGroup value={checked} onChange={setChecked} type="button">
        {CITIES.map((city) => (
          <ElCheckbox key={city} value={city} label={city} />
        ))}
      </ElCheckboxGroup>
      <ElCheckboxGroup
        value={["上海"]}
        onChange={() => {}}
        type="button"
        fill="#626aef"
        textColor="#fff"
      >
        <ElCheckbox value="上海" label="上海" />
        <ElCheckbox value="北京" label="北京" />
      </ElCheckboxGroup>
    </div>
  );
}

const OPTION_PROPS = { label: "name", value: "id", disabled: "unable" } as const;
const OPTIONS = [
  { name: "Option A", id: "Value A" },
  { name: "Option B", id: "Value B" },
  { name: "Option C", id: "Value C" },
  { name: "disabled", id: "Value disabled", unable: true },
  {
    name: "selected and disabled",
    id: "Value selected and disabled",
    unable: true,
  },
];

export function CheckboxOptions() {
  const [checked, setChecked] = useState<CheckboxValueType[]>([
    "Value selected and disabled",
    "Value A",
  ]);

  return (
    <ElCheckboxGroup
      value={checked}
      onChange={setChecked}
      options={OPTIONS}
      optionProps={OPTION_PROPS}
    />
  );
}

export function CheckboxBorder() {
  return (
    <div style={stack}>
      <div style={row}>
        <ElCheckbox border>选项一</ElCheckbox>
        <ElCheckbox border checked>选项二</ElCheckbox>
        <ElCheckbox border disabled>选项三</ElCheckbox>
      </div>
    </div>
  );
}
