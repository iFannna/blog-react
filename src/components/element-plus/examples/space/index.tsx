"use client";

import { useState, type CSSProperties } from "react";
import { ElSpace } from "@/components/element-plus/space";
import { ElButton } from "@/components/element-plus/button";
import { ElCard } from "@/components/element-plus/card";
import { ElRadio, ElRadioGroup } from "@/components/element-plus/radio";
import { ElSlider } from "@/components/element-plus/slider";
import { ElSwitch } from "@/components/element-plus/switch";
import { ElDivider } from "@/components/element-plus/divider";

const alignmentBox: CSSProperties = {
  width: 240,
  marginBottom: 20,
  padding: 8,
  border: "1px solid var(--el-border-color)",
};

const itemText = ["List item 1", "List item 2", "List item 3", "List item 4"];

function renderCards(count: number, width?: number) {
  return Array.from({ length: count }, (_, index) => (
    <ElCard
      key={index}
      style={width ? { width } : undefined}
      header={
        <div className="card-header">
          <span>Card name</span>
          <ElButton text>Operation button</ElButton>
        </div>
      }
    >
      {itemText.map((text) => (
        <div key={text} className="text item">
          {text}
        </div>
      ))}
    </ElCard>
  ));
}

export function SpaceBasic() {
  return <ElSpace wrap>{renderCards(3, 250)}</ElSpace>;
}

export function SpaceVertical() {
  return (
    <ElSpace direction="vertical">
      {renderCards(2, 250)}
    </ElSpace>
  );
}

export function SpaceControlSize() {
  const [size, setSize] = useState<"large" | "default" | "small">("default");

  return (
    <ElSpace direction="vertical" alignment="start" size={30}>
      <ElRadioGroup
        value={size}
        onChange={(value) => setSize(value as "large" | "default" | "small")}
      >
        <ElRadio value="large">Large</ElRadio>
        <ElRadio value="default">Default</ElRadio>
        <ElRadio value="small">Small</ElRadio>
      </ElRadioGroup>
      <ElSpace wrap size={size}>
        {renderCards(3, 250)}
      </ElSpace>
    </ElSpace>
  );
}

export function SpaceCustomizedSize() {
  const [size, setSize] = useState(20);

  return (
    <div>
      <ElSlider value={size} onChange={(value) => setSize(Number(value))} />
      <ElSpace wrap size={size}>
        {renderCards(2, 250)}
      </ElSpace>
    </div>
  );
}

export function SpaceAlignment() {
  return (
    <div>
      {(["center", "flex-start", "flex-end"] as const).map((alignment) => (
        <div key={alignment} style={alignmentBox}>
          <ElSpace alignment={alignment}>
            string
            <ElButton> button </ElButton>
            <ElCard header=" header ">body</ElCard>
          </ElSpace>
        </div>
      ))}
    </div>
  );
}

export function SpaceWrap() {
  return (
    <ElSpace wrap>
      {Array.from({ length: 20 }, (_, index) => (
        <div key={index}>
          <ElButton text> Text button </ElButton>
        </div>
      ))}
    </ElSpace>
  );
}

export function SpaceFill() {
  const [fill, setFill] = useState(true);

  return (
    <div>
      <div style={{ marginBottom: 15 }}>fill: <ElSwitch checked={fill} onCheckedChange={setFill} /></div>
      <ElSpace fill={fill} wrap>
        {renderCards(3)}
      </ElSpace>
    </div>
  );
}

export function SpaceFillRatio() {
  const [direction, setDirection] = useState<"horizontal" | "vertical">("horizontal");
  const [fillRatio, setFillRatio] = useState(30);

  return (
    <div>
      <div style={{ marginBottom: 15 }}>
        direction:
        <ElRadioGroup
          value={direction}
          onChange={(value) =>
            setDirection(value as "horizontal" | "vertical")
          }
        >
          <ElRadio value="horizontal">horizontal</ElRadio>
          <ElRadio value="vertical">vertical</ElRadio>
        </ElRadioGroup>
      </div>
      <div style={{ marginBottom: 15 }}>
        fillRatio:
        <ElSlider
          value={fillRatio}
          onChange={(value) => setFillRatio(Number(value))}
        />
      </div>
      <ElSpace
        fill
        wrap
        fillRatio={fillRatio}
        direction={direction}
        style={{ width: "100%" }}
      >
        {renderCards(5)}
      </ElSpace>
    </div>
  );
}

export function SpaceLiteralSpacer() {
  return (
    <ElSpace size={10} spacer="|">
      {[1, 2].map((index) => (
        <div key={index}>
          <ElButton> button {index} </ElButton>
        </div>
      ))}
    </ElSpace>
  );
}

export function SpaceVnodeSpacer() {
  return (
    <ElSpace size={10} spacer={<ElDivider direction="vertical" />}>
      {[1, 2].map((index) => (
        <div key={index}>
          <ElButton> button {index} </ElButton>
        </div>
      ))}
    </ElSpace>
  );
}
