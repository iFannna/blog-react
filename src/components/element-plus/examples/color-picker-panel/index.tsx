"use client";

import { useState } from "react";
import { ElCard } from "@/components/element-plus/card";
import { ElColorPickerPanel } from "@/components/element-plus/color-picker-panel";
import { ElDivider } from "@/components/element-plus/divider";

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

export function ColorPickerPanelBasic() {
  const [color, setColor] = useState<string | null>("#409EFF");

  return <ElColorPickerPanel value={color} onChange={setColor} />;
}

export function ColorPickerPanelAlpha() {
  const [color, setColor] = useState<string | null>("rgba(19, 206, 102, 0.8)");

  return <ElColorPickerPanel value={color} showAlpha onChange={setColor} />;
}

export function ColorPickerPanelPredefinedColor() {
  const [color, setColor] = useState<string | null>("rgba(255, 69, 0, 0.68)");

  return (
    <ElColorPickerPanel
      value={color}
      showAlpha
      predefine={PREDEFINE_COLORS}
      onChange={setColor}
    />
  );
}

export function ColorPickerPanelBorder() {
  const [color, setColor] = useState<string | null>("#ff6900");

  return (
    <div>
      <div style={{ textAlign: "center" }}>No border:</div>
      <ElDivider />
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "1rem",
        }}
      >
        <div style={{ padding: "20px" }}>
          <ElColorPickerPanel
            value={color}
            border={false}
            onChange={setColor}
          />
        </div>
        <ElDivider style={{ height: "auto" }} direction="vertical" />
        <ElCard>
          <ElColorPickerPanel
            value={color}
            border={false}
            onChange={setColor}
          />
        </ElCard>
      </div>
    </div>
  );
}

export function ColorPickerPanelDisabled() {
  const [color, setColor] = useState<string | null>("#ff6900");

  return (
    <ElColorPickerPanel
      value={color}
      disabled
      showAlpha
      predefine={PREDEFINE_COLORS}
      onChange={setColor}
    />
  );
}
