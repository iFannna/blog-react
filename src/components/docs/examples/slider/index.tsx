"use client";

import { useState } from "react";
import { ElSlider, type SliderMarks, type SliderValue } from "@/components/ui/slider";

/** 官方示例统一用 .slider-demo-block 包住，这里用等价的内联布局。 */
const block = { maxWidth: 600, marginBottom: 20 };
const label = {
  fontSize: 14,
  color: "var(--el-text-color-secondary)",
  marginRight: 12,
};

export function SliderBasic() {
  const [value1, setValue1] = useState<SliderValue>(0);
  const [value2, setValue2] = useState<SliderValue>(0);
  const [value3, setValue3] = useState<SliderValue>(0);
  const [value4, setValue4] = useState<SliderValue>(0);
  const [value5, setValue5] = useState<SliderValue>(0);

  return (
    <div>
      <div style={block}>
        <span style={label}>默认值</span>
        <ElSlider value={value1} onChange={setValue1} />
      </div>
      <div style={block}>
        <span style={label}>自定义初始值</span>
        <ElSlider value={value2} onChange={setValue2} />
      </div>
      <div style={block}>
        <span style={label}>隐藏提示</span>
        <ElSlider value={value3} onChange={setValue3} showTooltip={false} />
      </div>
      <div style={block}>
        <span style={label}>格式化提示</span>
        <ElSlider
          value={value4}
          onChange={setValue4}
          formatTooltip={(val) => val / 100}
        />
      </div>
      <div style={block}>
        <span style={label}>禁用</span>
        <ElSlider value={value5} onChange={setValue5} disabled />
      </div>
    </div>
  );
}

export function SliderDiscreteValues() {
  const [value1, setValue1] = useState<SliderValue>(0);
  const [value2, setValue2] = useState<SliderValue>(0);
  return (
    <div>
      <div style={block}>
        <span style={label}>不显示间断点</span>
        <ElSlider value={value1} onChange={setValue1} step={10} />
      </div>
      <div style={block}>
        <span style={label}>显示间断点</span>
        <ElSlider value={value2} onChange={setValue2} step={10} showStops />
      </div>
    </div>
  );
}

export function SliderRange() {
  const [value, setValue] = useState<SliderValue>([4, 8]);
  return (
    <div style={block}>
      <ElSlider value={value} onChange={setValue} range showStops max={10} />
    </div>
  );
}

export function SliderPlacement() {
  const [value1, setValue1] = useState<SliderValue>(0);
  const [value2, setValue2] = useState<SliderValue>(0);
  const [value3, setValue3] = useState<SliderValue>(0);
  const [value4, setValue4] = useState<SliderValue>(0);
  return (
    <div>
      <div style={block}>
        <ElSlider value={value1} onChange={setValue1} />
      </div>
      <div style={block}>
        <ElSlider value={value2} onChange={setValue2} placement="bottom" />
      </div>
      <div style={block}>
        <ElSlider value={value3} onChange={setValue3} placement="right" />
      </div>
      <div style={block}>
        <ElSlider value={value4} onChange={setValue4} placement="left" />
      </div>
    </div>
  );
}

const marks1: SliderMarks = { 0: "0°C", 37: "37°C", 100: "100°C" };
const marks2: SliderMarks = {
  0: "0cm",
  10: "10cm",
  25: "25cm",
  50: "50cm",
  75: "75cm",
  100: "100cm",
};
const marks3: SliderMarks = {
  0: "0",
  13: "13",
  42: "42",
  58: "58",
  89: "89",
  100: "100",
};

export function SliderRestrictValue() {
  const [value1, setValue1] = useState<SliderValue>(37);
  const [value2, setValue2] = useState<SliderValue>(50);
  const [value3, setValue3] = useState<SliderValue>([13, 42]);
  return (
    <div>
      <div style={block}>
        <ElSlider
          value={value1}
          onChange={setValue1}
          vertical
          height="200px"
          marks={marks1}
          placement="right"
          formatTooltip={(v) => `${v}°C`}
          step="mark"
        />
      </div>
      <div style={block}>
        <ElSlider value={value2} onChange={setValue2} marks={marks2} step="mark" />
      </div>
      <div style={block}>
        <ElSlider value={value3} onChange={setValue3} range marks={marks3} step="mark" />
      </div>
    </div>
  );
}

const marksShow: SliderMarks = {
  0: "0°C",
  8: "8°C",
  37: "37°C",
  50: { style: { color: "#1989FA" }, label: "50%" },
};

export function SliderShowMarks() {
  const [value, setValue] = useState<SliderValue>([30, 60]);
  return (
    <div style={block}>
      <ElSlider value={value} onChange={setValue} range marks={marksShow} />
    </div>
  );
}

export function SliderSizes() {
  const [value, setValue] = useState<SliderValue>(0);
  return (
    <div style={block}>
      <ElSlider value={value} onChange={setValue} showInput size="large" />
      <ElSlider value={value} onChange={setValue} showInput />
      <ElSlider value={value} onChange={setValue} showInput size="small" />
    </div>
  );
}

export function SliderWithInput() {
  const [value, setValue] = useState<SliderValue>(0);
  return (
    <div style={block}>
      <ElSlider value={value} onChange={setValue} showInput />
    </div>
  );
}

export function SliderVertical() {
  const [value, setValue] = useState<SliderValue>(0);
  return (
    <div style={block}>
      <ElSlider value={value} onChange={setValue} vertical height="200px" />
    </div>
  );
}
