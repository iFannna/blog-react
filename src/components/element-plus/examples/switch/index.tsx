"use client";

import { useState, type CSSProperties } from "react";
import { ElSwitch } from "@/components/element-plus/switch";
import { ElTooltip } from "@/components/element-plus/tooltip";
import { message } from "@/components/element-plus/message";
import { Check, Close, Hide, View } from "@/components/element-plus/icons";

const ml2 = { marginLeft: 8 };
const mb2 = { marginBottom: 8 };
const greenRed = {
  "--el-switch-on-color": "#13ce66",
  "--el-switch-off-color": "#ff4949",
} as CSSProperties;

export function SwitchBasic() {
  const [value1, setValue1] = useState(true);
  const [value2, setValue2] = useState(true);
  return (
    <>
      <ElSwitch checked={value1} onCheckedChange={setValue1} />
      <ElSwitch
        checked={value2}
        onCheckedChange={setValue2}
        style={{ ...ml2, ...greenRed }}
      />
    </>
  );
}

export function SwitchDisabled() {
  const [value1, setValue1] = useState(true);
  const [value2, setValue2] = useState(true);
  return (
    <>
      <ElSwitch checked={value1} onCheckedChange={setValue1} disabled />
      <ElSwitch
        checked={value2}
        onCheckedChange={setValue2}
        style={ml2}
      />
    </>
  );
}

export function SwitchText() {
  const [value1, setValue1] = useState(true);
  const [value2, setValue2] = useState(true);
  const [value3, setValue3] = useState(true);
  const [value4, setValue4] = useState(true);
  const [value5, setValue5] = useState(true);
  const [value6, setValue6] = useState(true);
  return (
    <>
      <ElSwitch
        checked={value1}
        onCheckedChange={setValue1}
        style={mb2}
        activeText="Pay by month"
        inactiveText="Pay by year"
      />
      <br />
      <ElSwitch
        checked={value2}
        onCheckedChange={setValue2}
        style={{ ...mb2, ...greenRed }}
        activeText="Pay by month"
        inactiveText="Pay by year"
      />
      <br />
      <ElSwitch
        checked={value3}
        onCheckedChange={setValue3}
        inlinePrompt
        activeText="是"
        inactiveText="否"
      />
      <ElSwitch
        checked={value4}
        onCheckedChange={setValue4}
        style={{ ...ml2, ...greenRed }}
        inlinePrompt
        activeText="Y"
        inactiveText="N"
      />
      <ElSwitch
        checked={value6}
        onCheckedChange={setValue6}
        style={ml2}
        width="60"
        inlinePrompt
        activeText="超出省略"
        inactiveText="超出省略"
      />
      <ElSwitch
        checked={value5}
        onCheckedChange={setValue5}
        style={{ ...ml2, ...greenRed }}
        inlinePrompt
        activeText="完整展示多个内容"
        inactiveText="多个内容"
      />
    </>
  );
}

export function SwitchIcons() {
  const [value1, setValue1] = useState(true);
  const [value2, setValue2] = useState(true);
  return (
    <>
      <ElSwitch
        checked={value1}
        onCheckedChange={setValue1}
        activeIcon={<Check />}
        inactiveIcon={<Close />}
      />
      <br />
      <ElSwitch
        checked={value2}
        onCheckedChange={setValue2}
        style={{ marginTop: 8, marginLeft: 24 }}
        inlinePrompt
        activeIcon={<Check />}
        inactiveIcon={<Close />}
      />
    </>
  );
}

export function SwitchSizes() {
  const [value, setValue] = useState(true);
  return (
    <>
      <ElSwitch
        checked={value}
        onCheckedChange={setValue}
        size="large"
        activeText="Open"
        inactiveText="Close"
      />
      <br />
      <ElSwitch
        checked={value}
        onCheckedChange={setValue}
        activeText="Open"
        inactiveText="Close"
      />
      <br />
      <ElSwitch
        checked={value}
        onCheckedChange={setValue}
        size="small"
        activeText="Open"
        inactiveText="Close"
      />
    </>
  );
}

export function SwitchCustomValue() {
  const [value, setValue] = useState<string>("100");
  return (
    <ElTooltip content={`Switch value: ${value}`} placement="top">
      <span>
        <ElSwitch
          value={value}
          onChange={(next) => setValue(String(next))}
          activeValue="100"
          inactiveValue="0"
          style={greenRed}
        />
      </span>
    </ElTooltip>
  );
}

export function SwitchBeforeChange() {
  const [value1, setValue1] = useState(false);
  const [value2, setValue2] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  const beforeChange1 = (): Promise<boolean> => {
    setLoading1(true);
    return new Promise((resolve) => {
      setTimeout(() => {
        setLoading1(false);
        message.success("Switch success");
        resolve(true);
      }, 1000);
    });
  };

  const beforeChange2 = (): Promise<boolean> => {
    setLoading2(true);
    return new Promise((_, reject) => {
      setTimeout(() => {
        setLoading2(false);
        message.error("Switch failed");
        reject(new Error("Error"));
      }, 1000);
    });
  };

  return (
    <>
      <ElSwitch
        checked={value1}
        onCheckedChange={setValue1}
        loading={loading1}
        beforeChange={beforeChange1}
      />
      <ElSwitch
        checked={value2}
        onCheckedChange={setValue2}
        style={ml2}
        loading={loading2}
        beforeChange={beforeChange2}
      />
    </>
  );
}

export function SwitchLoading() {
  const [value1, setValue1] = useState(true);
  const [value2, setValue2] = useState(false);
  return (
    <>
      <ElSwitch checked={value1} onCheckedChange={setValue1} loading />
      <ElSwitch
        checked={value2}
        onCheckedChange={setValue2}
        style={ml2}
        loading
      />
    </>
  );
}

export function SwitchCustomActionIcon() {
  const [value1, setValue1] = useState(true);
  return (
    <ElSwitch
      checked={value1}
      onCheckedChange={setValue1}
      activeActionIcon={<View />}
      inactiveActionIcon={<Hide />}
    />
  );
}

export function SwitchCustomActionSlot() {
  const [value1, setValue1] = useState(true);
  return (
    <ElSwitch
      checked={value1}
      onCheckedChange={setValue1}
      activeActionContent={<span className="custom-active-action">T</span>}
      inactiveActionContent={<span className="custom-inactive-action">F</span>}
    />
  );
}
