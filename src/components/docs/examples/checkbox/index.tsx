"use client";

import { useState } from "react";
import { ElCheckbox, ElCheckboxGroup } from "@/components/element-plus/checkbox";
import type { CheckboxValueType } from "@/components/element-plus/checkbox";

const CITIES = ["Shanghai", "Beijing", "Guangzhou", "Shenzhen"];
const ALL = ["Shanghai", "Beijing", "Guangzhou", "Shenzhen"];

export function CheckboxBasic() {
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(false);
  const [checked5, setChecked5] = useState(false);
  const [checked6, setChecked6] = useState(false);

  return (
    <>
      <div>
        <ElCheckbox checked={checked1} onCheckedChange={setChecked1} label="Option 1" size="large" />
        <ElCheckbox checked={checked2} onCheckedChange={setChecked2} label="Option 2" size="large" />
      </div>
      <div style={{ margin: "8px 0" }}>
        <ElCheckbox checked={checked3} onCheckedChange={setChecked3} label="Option 1" />
        <ElCheckbox checked={checked4} onCheckedChange={setChecked4} label="Option 2" />
      </div>
      <div style={{ marginTop: 8 }}>
        <ElCheckbox checked={checked5} onCheckedChange={setChecked5} label="Option 1" size="small" />
        <ElCheckbox checked={checked6} onCheckedChange={setChecked6} label="Option 2" size="small" />
      </div>
    </>
  );
}

export function CheckboxDisabled() {
  return (
    <>
      <ElCheckbox disabled>Disabled</ElCheckbox>
      <ElCheckbox checked>Not disabled</ElCheckbox>
    </>
  );
}

export function CheckboxGroupDemo() {
  const [checked, setChecked] = useState<CheckboxValueType[]>([
    "Value selected and disabled",
    "Value A",
  ]);
  return (
    <ElCheckboxGroup value={checked} onChange={setChecked}>
      <ElCheckbox label="Option A" value="Value A" />
      <ElCheckbox label="Option B" value="Value B" />
      <ElCheckbox label="Option C" value="Value C" />
      <ElCheckbox label="disabled" value="Value disabled" disabled />
      <ElCheckbox
        label="selected and disabled"
        value="Value selected and disabled"
        disabled
      />
    </ElCheckboxGroup>
  );
}

export function CheckboxIndeterminate() {
  const [checked, setChecked] = useState<CheckboxValueType[]>([
    "Shanghai",
    "Beijing",
  ]);
  const [checkAll, setCheckAll] = useState(false);
  const [indeterminate, setIndeterminate] = useState(true);

  return (
    <>
      <ElCheckbox
        checked={checkAll}
        indeterminate={indeterminate}
        onCheckedChange={(value) => {
          setCheckAll(value);
          setChecked(value ? [...ALL] : []);
          setIndeterminate(false);
        }}
      >
        Check all
      </ElCheckbox>
      <ElCheckboxGroup
        value={checked}
        onChange={(value) => {
          const count = value.length;
          setCheckAll(count === ALL.length);
          setIndeterminate(count > 0 && count < ALL.length);
          setChecked(value);
        }}
      >
        {ALL.map((city) => (
          <ElCheckbox key={city} value={city} label={city} />
        ))}
      </ElCheckboxGroup>
    </>
  );
}

export function CheckboxMinMax() {
  const [checked, setChecked] = useState<CheckboxValueType[]>([
    "Shanghai",
    "Beijing",
  ]);
  return (
    <ElCheckboxGroup value={checked} onChange={setChecked} min={1} max={2}>
      {CITIES.map((city) => (
        <ElCheckbox key={city} value={city} label={city} />
      ))}
    </ElCheckboxGroup>
  );
}

export function CheckboxButton() {
  const [group1, setGroup1] = useState<CheckboxValueType[]>(["Shanghai"]);
  const [group2, setGroup2] = useState<CheckboxValueType[]>(["Shanghai"]);
  const [group3, setGroup3] = useState<CheckboxValueType[]>(["Shanghai"]);
  const [group4] = useState<CheckboxValueType[]>(["Shanghai"]);

  return (
    <>
      <div>
        <ElCheckboxGroup value={group1} onChange={setGroup1} size="large" type="button">
          {CITIES.map((city) => (
            <ElCheckbox key={city} value={city} label={city} />
          ))}
        </ElCheckboxGroup>
      </div>
      <div style={{ marginTop: 24 }}>
        <ElCheckboxGroup value={group2} onChange={setGroup2} type="button">
          {CITIES.map((city) => (
            <ElCheckbox key={city} value={city} label={city} />
          ))}
        </ElCheckboxGroup>
      </div>
      <div style={{ marginTop: 24 }}>
        <ElCheckboxGroup value={group3} onChange={setGroup3} size="small" type="button">
          {CITIES.map((city) => (
            <ElCheckbox
              key={city}
              value={city}
              label={city}
              disabled={city === "Beijing"}
            />
          ))}
        </ElCheckboxGroup>
      </div>
      <div style={{ marginTop: 24 }}>
        <ElCheckboxGroup value={group4} onChange={() => {}} size="small" disabled type="button">
          {CITIES.map((city) => (
            <ElCheckbox key={city} value={city} label={city} />
          ))}
        </ElCheckboxGroup>
      </div>
    </>
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
  const [checked1, setChecked1] = useState(true);
  const [checked2, setChecked2] = useState(false);
  const [checked3, setChecked3] = useState(false);
  const [checked4, setChecked4] = useState(true);
  const [group1, setGroup1] = useState<CheckboxValueType[]>(["Value1"]);

  return (
    <>
      <div>
        <ElCheckbox checked={checked1} onCheckedChange={setChecked1} label="Option1" size="large" border />
        <ElCheckbox checked={checked2} onCheckedChange={setChecked2} label="Option2" size="large" border />
      </div>
      <div style={{ marginTop: 16 }}>
        <ElCheckbox checked={checked3} onCheckedChange={setChecked3} label="Option1" border />
        <ElCheckbox checked={checked4} onCheckedChange={setChecked4} label="Option2" border />
      </div>
      <div style={{ marginTop: 16 }}>
        <ElCheckboxGroup value={group1} onChange={setGroup1} size="small">
          <ElCheckbox label="Option1" value="Value1" border />
          <ElCheckbox label="Option2" value="Value2" border />
        </ElCheckboxGroup>
      </div>
      <div style={{ marginTop: 16 }}>
        <ElCheckboxGroup value={group1} onChange={() => {}} size="small">
          <ElCheckbox label="Option1" value="Value1" border disabled />
          <ElCheckbox label="Option2" value="Value2" border disabled />
        </ElCheckboxGroup>
      </div>
    </>
  );
}
