"use client";

import { useState } from "react";
import { ElSwitch } from "@/components/ui/switch";
import { Check, Close, Hide, View } from "@/components/ui/icons";

const stack = { display: "flex", flexDirection: "column", gap: "1rem" } as const;
const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1rem",
  alignItems: "center",
} as const;

export function SwitchBasic() {
  const [checked, setChecked] = useState(false);
  return (
    <div style={stack}>
      <ElSwitch checked={checked} onCheckedChange={setChecked} />
    </div>
  );
}

export function SwitchDisabled() {
  return (
    <div style={stack}>
      <ElSwitch disabled />
      <ElSwitch checked disabled />
    </div>
  );
}

export function SwitchText() {
  const [checked, setChecked] = useState(true);
  return (
    <div style={stack}>
      <div style={row}>
        <ElSwitch
          checked={checked}
          onCheckedChange={setChecked}
          activeText="开"
          inactiveText="关"
        />
      </div>
      <div style={row}>
        <ElSwitch
          checked={checked}
          onCheckedChange={setChecked}
          inlinePrompt
          activeText="是"
          inactiveText="否"
        />
      </div>
    </div>
  );
}

export function SwitchIcons() {
  const [checked, setChecked] = useState(true);
  const [checked2, setChecked2] = useState(false);
  return (
    <div style={stack}>
      <div style={row}>
        <ElSwitch
          checked={checked}
          onCheckedChange={setChecked}
          activeIcon={<Check />}
          inactiveIcon={<Close />}
        />
      </div>
      <div style={row}>
        <ElSwitch
          checked={checked2}
          onCheckedChange={setChecked2}
          inlinePrompt
          activeIcon={<Check />}
          inactiveIcon={<Close />}
        />
      </div>
    </div>
  );
}

export function SwitchSizes() {
  const [checked, setChecked] = useState(true);
  return (
    <div style={row}>
      <ElSwitch checked={checked} onCheckedChange={setChecked} size="large" />
      <ElSwitch checked={checked} onCheckedChange={setChecked} />
      <ElSwitch checked={checked} onCheckedChange={setChecked} size="small" />
    </div>
  );
}

export function SwitchCustomValue() {
  const [value, setValue] = useState<string>("off");
  return (
    <div style={row}>
      <ElSwitch
        value={value}
        onChange={(next) => setValue(String(next))}
        activeValue="on"
        inactiveValue="off"
        activeText="on"
        inactiveText="off"
      />
      <span>当前值: {value}</span>
    </div>
  );
}

export function SwitchBeforeChange() {
  const [checked, setChecked] = useState(false);
  return (
    <div style={stack}>
      <ElSwitch
        checked={checked}
        onCheckedChange={setChecked}
        beforeChange={() =>
          new Promise<boolean>((resolve) => {
            window.setTimeout(() => resolve(true), 600);
          })
        }
      />
      <span>切换前会等待 600ms 的异步确认</span>
    </div>
  );
}

export function SwitchLoading() {
  return (
    <div style={row}>
      <ElSwitch checked loading />
      <ElSwitch loading />
    </div>
  );
}

export function SwitchCustomActionIcon() {
  const [checked, setChecked] = useState(true);
  return (
    <div style={row}>
      <ElSwitch
        checked={checked}
        onCheckedChange={setChecked}
        activeActionIcon={<View />}
        inactiveActionIcon={<Hide />}
      />
    </div>
  );
}

export function SwitchCustomActionSlot() {
  const [checked, setChecked] = useState(true);
  return (
    <div style={row}>
      <ElSwitch
        checked={checked}
        onCheckedChange={setChecked}
        activeActionContent={<span>T</span>}
        inactiveActionContent={<span>F</span>}
      />
      <span>当前状态: {checked ? "T" : "F"}</span>
    </div>
  );
}
