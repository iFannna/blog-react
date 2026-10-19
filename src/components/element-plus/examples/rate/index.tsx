"use client";

import { useState, type CSSProperties } from "react";
import { ElRate } from "@/components/element-plus/rate";
import {
  ChatDotRound,
  ChatLineRound,
  ChatRound,
} from "@/components/element-plus/icons";
import type { ComponentSize } from "@/components/element-plus/button/types";

const blockBase: CSSProperties = {
  padding: "30px 0",
  textAlign: "center",
  display: "inline-block",
  width: "49%",
  boxSizing: "border-box",
};

const blockLeft: CSSProperties = {
  ...blockBase,
  borderRight: "solid 1px var(--el-border-color)",
};

const labelStyle: CSSProperties = {
  display: "block",
  color: "var(--el-text-color-secondary)",
  fontSize: 14,
  marginBottom: 20,
};

const row: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  gap: "0.8rem",
};

export function RateBasic() {
  const [value1, setValue1] = useState(0);
  const [value2, setValue2] = useState(0);

  return (
    <div>
      <div style={blockLeft}>
        <span style={labelStyle}>Default</span>
        <ElRate value={value1} onChange={setValue1} />
      </div>
      <div style={{ ...blockBase, verticalAlign: "top" }}>
        <span style={labelStyle}>Color for different levels</span>
        <ElRate
          value={value2}
          onChange={setValue2}
          colors={["#99A9BF", "#F7BA2A", "#FF9900"]}
        />
      </div>
    </div>
  );
}

export function RateSizes() {
  const [value, setValue] = useState(0);
  return (
    <div style={row}>
      {(["large", "default", "small"] as ComponentSize[]).map((size) => (
        <ElRate key={size} value={value} onChange={setValue} size={size} />
      ))}
    </div>
  );
}

export function RateAllowHalf() {
  const [value, setValue] = useState(0);
  return <ElRate value={value} onChange={setValue} allowHalf />;
}

export function RateText() {
  const [value, setValue] = useState(0);
  return (
    <ElRate
      value={value}
      onChange={setValue}
      texts={["oops", "disappointed", "normal", "good", "great"]}
      showText
    />
  );
}

export function RateClearable() {
  const [value, setValue] = useState(3);
  return <ElRate value={value} onChange={setValue} clearable />;
}

export function RateMoreIcons() {
  const [value, setValue] = useState(0);
  return (
    <ElRate
      value={value}
      onChange={setValue}
      icons={[ChatRound, ChatLineRound, ChatDotRound]}
      voidIcon={ChatRound}
      colors={["#409eff", "#67c23a", "#FF9900"]}
    />
  );
}

export function RateReadonly() {
  const [value] = useState(3.7);
  return (
    <ElRate
      value={value}
      disabled
      showScore
      textColor="#ff9900"
      scoreTemplate="{value} points"
    />
  );
}
