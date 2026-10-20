"use client";

import { useState, type CSSProperties } from "react";
import { ElSlider, type SliderMarks, type SliderValue } from "@/components/element-plus/slider";

// 官方 demo 的 scoped 样式：block 为 600px 的横向 flex，label 占剩余宽度，
// slider 固定 70% 并带 12px 左间距。
const block: CSSProperties = {
  maxWidth: 600,
  display: "flex",
  alignItems: "center",
};

const blockSpaced: CSSProperties = {
  ...block,
  marginTop: 20,
};

const label: CSSProperties = {
  fontSize: 14,
  color: "var(--el-text-color-secondary)",
  lineHeight: "44px",
  flex: 1,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
  marginBottom: 0,
};

const slider: CSSProperties = { marginTop: 0, marginLeft: 12 };
const slider70: CSSProperties = { ...slider, flex: "0 0 70%" };

export function SliderBasic() {
  const [value1, setValue1] = useState<SliderValue>(0);
  const [value2, setValue2] = useState<SliderValue>(0);
  const [value3, setValue3] = useState<SliderValue>(0);
  const [value4, setValue4] = useState<SliderValue>(0);
  const [value5, setValue5] = useState<SliderValue>(0);

  return (
    <>
      <div style={block}>
        <span style={label}>Default value</span>
        <ElSlider style={slider70} value={value1} onChange={setValue1} />
      </div>
      <div style={block}>
        <span style={label}>Customized initial value</span>
        <ElSlider style={slider70} value={value2} onChange={setValue2} />
      </div>
      <div style={block}>
        <span style={label}>Hide Tooltip</span>
        <ElSlider
          style={slider70}
          value={value3}
          onChange={setValue3}
          showTooltip={false}
        />
      </div>
      <div style={block}>
        <span style={label}>Format Tooltip</span>
        <ElSlider
          style={slider70}
          value={value4}
          onChange={setValue4}
          formatTooltip={(val) => val / 100}
        />
      </div>
      <div style={block}>
        <span style={label}>Disabled</span>
        <ElSlider style={slider70} value={value5} onChange={setValue5} disabled />
      </div>
    </>
  );
}

export function SliderDiscreteValues() {
  const [value1, setValue1] = useState<SliderValue>(0);
  const [value2, setValue2] = useState<SliderValue>(0);
  return (
    <>
      <div style={block}>
        <span style={label}>Breakpoints not displayed</span>
        <ElSlider style={slider70} value={value1} onChange={setValue1} step={10} />
      </div>
      <div style={block}>
        <span style={label}>Breakpoints displayed</span>
        <ElSlider
          style={slider70}
          value={value2}
          onChange={setValue2}
          step={10}
          showStops
        />
      </div>
    </>
  );
}

export function SliderRange() {
  const [value, setValue] = useState<SliderValue>([4, 8]);
  return (
    <div style={block}>
      <ElSlider
        style={slider}
        value={value}
        onChange={setValue}
        range
        showStops
        max={10}
      />
    </div>
  );
}

export function SliderPlacement() {
  const [value1, setValue1] = useState<SliderValue>(0);
  const [value2, setValue2] = useState<SliderValue>(0);
  const [value3, setValue3] = useState<SliderValue>(0);
  const [value4, setValue4] = useState<SliderValue>(0);
  return (
    <>
      <div style={block}>
        <ElSlider style={slider} value={value1} onChange={setValue1} />
      </div>
      <div style={block}>
        <ElSlider style={slider} value={value2} onChange={setValue2} placement="bottom" />
      </div>
      <div style={block}>
        <ElSlider style={slider} value={value3} onChange={setValue3} placement="right" />
      </div>
      <div style={block}>
        <ElSlider style={slider} value={value4} onChange={setValue4} placement="left" />
      </div>
    </>
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
    <>
      <div style={block}>
        <ElSlider
          style={slider}
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
      <div style={blockSpaced}>
        <ElSlider style={slider} value={value2} onChange={setValue2} marks={marks2} step="mark" />
      </div>
      <div style={blockSpaced}>
        <ElSlider
          style={slider}
          value={value3}
          onChange={setValue3}
          range
          marks={marks3}
          step="mark"
        />
      </div>
    </>
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
      <ElSlider style={slider} value={value} onChange={setValue} range marks={marksShow} />
    </div>
  );
}

const sliderSizes: CSSProperties = { marginTop: 20 };

export function SliderSizes() {
  const [value, setValue] = useState<SliderValue>(0);
  return (
    <div style={{ maxWidth: 600 }}>
      <ElSlider value={value} onChange={setValue} showInput size="large" />
      <ElSlider style={sliderSizes} value={value} onChange={setValue} showInput />
      <ElSlider style={sliderSizes} value={value} onChange={setValue} showInput size="small" />
    </div>
  );
}

export function SliderWithInput() {
  const [value, setValue] = useState<SliderValue>(0);
  return (
    <div style={block}>
      <ElSlider style={slider} value={value} onChange={setValue} showInput />
    </div>
  );
}

export function SliderVertical() {
  const [value, setValue] = useState<SliderValue>(0);
  return (
    <div style={block}>
      <ElSlider style={slider} value={value} onChange={setValue} vertical height="200px" />
    </div>
  );
}
