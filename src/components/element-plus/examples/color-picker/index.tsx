"use client";

import { useState } from "react";
import { ElColorPicker } from "@/components/element-plus/color-picker";

const blockStyle = {
  display: "flex",
  alignItems: "center",
  marginBottom: "16px",
} as const;

const labelStyle = { marginRight: "16px" } as const;

const sizeRowStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
} as const;

export function ColorPickerBasic() {
  const [color1, setColor1] = useState<string | null>("#409EFF");
  const [color2, setColor2] = useState<string | null>(null);

  return (
    <>
      <div style={blockStyle}>
        <span style={labelStyle}>With default value</span>
        <ElColorPicker value={color1} onChange={setColor1} />
      </div>
      <div style={blockStyle}>
        <span style={labelStyle}>With no default value</span>
        <ElColorPicker value={color2} onChange={setColor2} />
      </div>
    </>
  );
}

export function ColorPickerAlpha() {
  const [color, setColor] = useState<string | null>("rgba(19, 206, 102, 0.8)");

  return <ElColorPicker value={color} showAlpha onChange={setColor} />;
}

const PREDEFINE_COLORS = [
  "#ff4500",
  "#ff8c00",
  "#ffd700",
  "#90ee90",
  "#00ced1",
  "#1e90ff",
  "#c71585",
  "rgba(255, 69, 0, 0.68)",
  "rgb(255, 120, 0)",
  "hsv(51, 100, 98)",
  "hsva(120, 40, 94, 0.5)",
  "hsl(181, 100%, 37%)",
  "hsla(209, 100%, 56%, 0.73)",
  "#c7158577",
];

export function ColorPickerPredefinedColor() {
  const [color, setColor] = useState<string | null>("rgba(255, 69, 0, 0.68)");

  return (
    <ElColorPicker
      value={color}
      showAlpha
      predefine={PREDEFINE_COLORS}
      onChange={setColor}
    />
  );
}

export function ColorPickerSizes() {
  const [color, setColor] = useState<string | null>("#409EFF");

  return (
    <div style={sizeRowStyle}>
      <ElColorPicker value={color} size="large" onChange={setColor} />
      <ElColorPicker value={color} onChange={setColor} />
      <ElColorPicker value={color} size="small" onChange={setColor} />
    </div>
  );
}
