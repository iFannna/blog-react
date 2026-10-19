"use client";

import { useState } from "react";
import { ElWatermark } from "@/components/ui/watermark";
import { ElForm, ElFormItem } from "@/components/ui/form";
import { ElInput } from "@/components/ui/input";
import { ElInputNumber } from "@/components/ui/input-number";
import { ElSlider, type SliderValue } from "@/components/ui/slider";
import { ElSpace } from "@/components/ui/space";
import { useTheme } from "@/hooks/theme";

/** 官方 basic / multi-line 示例用 500px 高的空 div 撑开容器。 */
const containerStyle = { height: 500 };

/** 官方 custom 示例：水印铺满左侧内容区，右侧是固定宽度的配置表单。 */
const watermarkStyle = { display: "flex", flex: "auto" };
const previewStyle = { flex: "auto" };
const formStyle = {
  width: 330,
  marginLeft: 20,
  borderLeft: "1px solid var(--el-border-color-lighter)",
  paddingLeft: 20,
};

const LIGHT_FONT_COLOR = "rgba(0, 0, 0, .15)";
const DARK_FONT_COLOR = "rgba(255, 255, 255, .15)";

/**
 * 官方的 basic / multi-line 示例都会跟随文档站主题切换水印颜色，
 * 这里复用博客的 useTheme（同一份 darkmode 存储），暗色下换成白色半透明。
 */
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
      image="https://element-plus.org/images/element-plus-logo.svg"
    >
      <div style={containerStyle} />
    </ElWatermark>
  );
}

/** 官方用 el-color-picker 的 show-alpha 取色，此处用可输入 rgba 的文本框代替。 */
export function WatermarkCustom() {
  const { isDarkMode } = useTheme();
  const themeColor = isDarkMode ? DARK_FONT_COLOR : LIGHT_FONT_COLOR;
  const [color, setColor] = useState(LIGHT_FONT_COLOR);
  const [lastDark, setLastDark] = useState(isDarkMode);

  // 等价官方 watch(isDark)：主题切换时把颜色重置为对应的默认值。
  // 用「渲染期按前值调整 state」的官方写法，避免在 effect 里同步 setState。
  if (lastDark !== isDarkMode) {
    setLastDark(isDarkMode);
    setColor(themeColor);
  }

  const [content, setContent] = useState("Element Plus");
  const [fontSize, setFontSize] = useState(16);
  const [zIndex, setZIndex] = useState(9);
  const [rotate, setRotate] = useState(-22);
  const [gap, setGap] = useState<[number, number]>([100, 100]);
  // 官方 offset 初始为空元组，这里用 null 表示「未设置」，组件内回退到 gap/2
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
        </div>
      </ElWatermark>

      <ElForm style={formStyle} labelPosition="top" labelWidth="50px">
        <ElFormItem label="Content">
          <ElInput value={content} onChange={setContent} />
        </ElFormItem>
        <ElFormItem label="Color">
          <ElInput value={color} onChange={setColor} />
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
