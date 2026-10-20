"use client";

import { useState } from "react";
import { ElWatermark } from "@/components/element-plus/watermark";
import { ElColorPicker } from "@/components/element-plus/color-picker";
import { ElForm, ElFormItem } from "@/components/element-plus/form";
import { ElInput } from "@/components/element-plus/input";
import { ElInputNumber } from "@/components/element-plus/input-number";
import { ElSlider, type SliderValue } from "@/components/element-plus/slider";
import { ElSpace } from "@/components/element-plus/space";
import { useTheme } from "@/hooks/theme";

const containerStyle = { height: 500 };

const watermarkStyle = { display: "flex", flex: "auto" };
const previewStyle = { flex: "auto" };
const formStyle = {
  width: 330,
  marginLeft: 20,
  borderLeft: "1px solid #eee",
  paddingLeft: 20,
};

const LIGHT_FONT_COLOR = "rgba(0, 0, 0, .15)";
const DARK_FONT_COLOR = "rgba(255, 255, 255, .15)";

function useWatermarkFont() {
  const { isDarkMode } = useTheme();
  return { color: isDarkMode ? DARK_FONT_COLOR : LIGHT_FONT_COLOR };
}

export function WatermarkBasic() {
  const font = useWatermarkFont();
  return (
    <ElWatermark font={font}>
      <div style={containerStyle} />
    </ElWatermark>
  );
}

export function WatermarkMultiLine() {
  const font = useWatermarkFont();
  return (
    <ElWatermark font={font} content={["Element+", "Element Plus"]}>
      <div style={containerStyle} />
    </ElWatermark>
  );
}

export function WatermarkImage() {
  return (
    <ElWatermark
      width={130}
      height={30}
      image="/images/element-plus-logo.svg"
    >
      <div style={containerStyle} />
    </ElWatermark>
  );
}

export function WatermarkCustom() {
  const { isDarkMode } = useTheme();
  const themeColor = isDarkMode ? DARK_FONT_COLOR : LIGHT_FONT_COLOR;
  const [color, setColor] = useState(LIGHT_FONT_COLOR);
  const [lastDark, setLastDark] = useState(isDarkMode);

  if (lastDark !== isDarkMode) {
    setLastDark(isDarkMode);
    setColor(themeColor);
  }

  const [content, setContent] = useState("Element Plus");
  const [fontSize, setFontSize] = useState(16);
  const [zIndex, setZIndex] = useState(-1);
  const [rotate, setRotate] = useState(-22);
  const [gap, setGap] = useState<[number, number]>([100, 100]);
  const [offsetLeft, setOffsetLeft] = useState<number | null>(null);
  const [offsetTop, setOffsetTop] = useState<number | null>(null);

  const asNumber = (value: SliderValue) => Number(value);

  return (
    <div style={{ display: "flex" }}>
      <ElWatermark
        style={watermarkStyle}
        content={content}
        font={{ fontSize, color }}
        zIndex={zIndex}
        rotate={rotate}
        gap={gap}
        offset={[offsetLeft ?? undefined, offsetTop ?? undefined]}
      >
        <div style={previewStyle}>
          <h1>Element Plus</h1>
          <h2>A Vue 3 based component library for designers and developers</h2>
          <img
            src="/images/hamburger.png"
            alt="示例图片"
            style={{
              zIndex: 10,
              width: "100%",
              maxWidth: 300,
              position: "relative",
            }}
          />
        </div>
      </ElWatermark>

      <ElForm style={formStyle} labelPosition="top" labelWidth="50px">
        <ElFormItem label="Content">
          <ElInput value={content} onChange={setContent} />
        </ElFormItem>
        <ElFormItem label="Color">
          <ElColorPicker
            value={color}
            showAlpha
            onChange={(value) => setColor(value ?? "")}
          />
        </ElFormItem>
        <ElFormItem label="FontSize">
          <ElSlider value={fontSize} onChange={(v) => setFontSize(asNumber(v))} />
        </ElFormItem>
        <ElFormItem label="zIndex">
          <ElSlider value={zIndex} onChange={(v) => setZIndex(asNumber(v))} />
        </ElFormItem>
        <ElFormItem label="Rotate">
          <ElSlider
            value={rotate}
            min={-180}
            max={180}
            onChange={(v) => setRotate(asNumber(v))}
          />
        </ElFormItem>
        <ElFormItem label="Gap">
          <ElSpace>
            <ElInputNumber
              value={gap[0]}
              controlsPosition="right"
              onChange={(v) => setGap((prev) => [v ?? 0, prev[1]])}
            />
            <ElInputNumber
              value={gap[1]}
              controlsPosition="right"
              onChange={(v) => setGap((prev) => [prev[0], v ?? 0])}
            />
          </ElSpace>
        </ElFormItem>
        <ElFormItem label="Offset">
          <ElSpace>
            <ElInputNumber
              value={offsetLeft}
              placeholder="offsetLeft"
              controlsPosition="right"
              onChange={setOffsetLeft}
            />
            <ElInputNumber
              value={offsetTop}
              placeholder="offsetTop"
              controlsPosition="right"
              onChange={setOffsetTop}
            />
          </ElSpace>
        </ElFormItem>
      </ElForm>
    </div>
  );
}
