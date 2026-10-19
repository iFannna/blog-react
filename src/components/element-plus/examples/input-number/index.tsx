"use client";

import { useState } from "react";
import { ElInputNumber } from "@/components/element-plus/input-number";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { ElSpace } from "@/components/element-plus/space";
import { ArrowDown, ArrowUp, Minus, Plus } from "@/components/element-plus/icons";
import type { ComponentSize } from "@/components/element-plus/button/types";

const row = {
  display: "flex",
  flexWrap: "wrap",
  gap: "1.2rem",
  alignItems: "center",
} as const;

export function InputNumberBasic() {
  const [num, setNum] = useState<number | null>(1);
  return (
    <ElInputNumber
      value={num}
      onChange={(current) => setNum(current)}
      min={1}
      max={10}
    />
  );
}

export function InputNumberDisabled() {
  const [num] = useState<number | null>(1);
  return <ElInputNumber value={num} disabled />;
}

export function InputNumberSteps() {
  const [num, setNum] = useState<number | null>(5);
  return <ElInputNumber value={num} onChange={setNum} step={2} />;
}

export function InputNumberStepStrictly() {
  const [num, setNum] = useState<number | null>(2);
  return <ElInputNumber value={num} onChange={setNum} step={2} stepStrictly />;
}

export function InputNumberPrecision() {
  const [num, setNum] = useState<number | null>(1);
  return (
    <ElInputNumber value={num} onChange={setNum} precision={2} step={0.1} max={10} />
  );
}

export function InputNumberSize() {
  const [num1, setNum1] = useState<number | null>(1);
  const [num2, setNum2] = useState<number | null>(2);
  const [num3, setNum3] = useState<number | null>(3);
  return (
    <div style={row}>
      <ElInputNumber value={num1} onChange={setNum1} size="large" />
      <ElInputNumber value={num2} onChange={setNum2} />
      <ElInputNumber value={num3} onChange={setNum3} size="small" />
    </div>
  );
}

export function InputNumberControlled() {
  const [num, setNum] = useState<number | null>(1);
  const sizes: (ComponentSize | undefined)[] = ["large", undefined, "small"];
  return (
    <div style={row}>
      {sizes.map((size) => (
        <ElInputNumber
          key={size ?? "default"}
          value={num}
          onChange={setNum}
          min={1}
          max={10}
          controlsPosition="right"
          size={size}
        />
      ))}
    </div>
  );
}

export function InputNumberCustom() {
  const [num, setNum] = useState<number | null>(1);
  return (
    <ElSpace direction="vertical">
      <ElSpace>
        <ElInputNumber value={num} onChange={setNum} />
        <ElInputNumber
          value={num}
          onChange={setNum}
          decreaseIcon={<ElIcon><ArrowDown /></ElIcon>}
          increaseIcon={<ElIcon><ArrowUp /></ElIcon>}
        />
      </ElSpace>
      <ElSpace>
        <ElInputNumber value={num} onChange={setNum} controlsPosition="right" />
        <ElInputNumber
          value={num}
          onChange={setNum}
          controlsPosition="right"
          decreaseIcon={<ElIcon><Minus /></ElIcon>}
          increaseIcon={<ElIcon><Plus /></ElIcon>}
        />
      </ElSpace>
    </ElSpace>
  );
}

export function InputNumberWithPrefixSuffix() {
  const [num, setNum] = useState<number | null>(1);
  return (
    <ElSpace>
      <ElInputNumber
        value={num}
        onChange={setNum}
        min={1}
        max={10}
        prefix={<span>￥</span>}
      />
      <ElInputNumber
        value={num}
        onChange={setNum}
        min={1}
        max={10}
        suffix={<span>RMB</span>}
      />
    </ElSpace>
  );
}

export function InputNumberFormatter() {
  const [input, setInput] = useState<number | null>(10000);
  return (
    <ElInputNumber
      value={input}
      onChange={setInput}
      formatter={(value) =>
        `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
      }
      parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
    />
  );
}
