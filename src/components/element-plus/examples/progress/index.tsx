"use client";

import { useEffect, useState } from "react";
import { ElProgress } from "@/components/element-plus/progress";
import { ElButton, ElButtonGroup } from "@/components/element-plus/button";
import { Check, Minus, Plus } from "@/components/element-plus/generated/icons";

const lineStyle = { marginBottom: 15, maxWidth: 600 } as const;
const line = { maxWidth: 600 } as const;
const circleStyle = { marginRight: 15 } as const;
const row = { display: "flex", alignItems: "center", flexWrap: "wrap" } as const;

const COLORS = [
  { color: "#f56c6c", percentage: 20 },
  { color: "#e6a23c", percentage: 40 },
  { color: "#5cb87a", percentage: 60 },
  { color: "#1989fa", percentage: 80 },
  { color: "#6f7ad3", percentage: 100 },
];

const format = (percentage: number) =>
  percentage === 100 ? "Full" : `${percentage}%`;

export function ProgressBasic() {
  return (
    <div>
      <ElProgress percentage={50} style={lineStyle} />
      <ElProgress percentage={100} format={format} style={lineStyle} />
      <ElProgress percentage={100} status="success" style={lineStyle} />
      <ElProgress percentage={100} status="warning" style={lineStyle} />
      <ElProgress percentage={50} status="exception" style={lineStyle} />
    </div>
  );
}

export function ProgressTextInside() {
  return (
    <div>
      <ElProgress textInside strokeWidth={26} percentage={70} style={lineStyle} />
      <ElProgress
        textInside
        strokeWidth={24}
        percentage={100}
        status="success"
        style={lineStyle}
      />
      <ElProgress
        textInside
        strokeWidth={22}
        percentage={80}
        status="warning"
        style={lineStyle}
      />
      <ElProgress
        textInside
        strokeWidth={20}
        percentage={50}
        status="exception"
        style={lineStyle}
      />
    </div>
  );
}

export function ProgressColor() {
  const [percentage, setPercentage] = useState(20);

  const customColorMethod = (value: number) => {
    if (value < 30) return "#909399";
    if (value < 70) return "#e6a23c";
    return "#67c23a";
  };

  const increase = () => setPercentage((value) => Math.min(value + 10, 100));
  const decrease = () => setPercentage((value) => Math.max(value - 10, 0));

  return (
    <div>
      <ElProgress percentage={percentage} color="#409eff" style={lineStyle} />
      <ElProgress
        percentage={percentage}
        color={customColorMethod}
        style={lineStyle}
      />
      <ElProgress percentage={percentage} color={COLORS} style={lineStyle} />
      <ElProgress percentage={percentage} color={COLORS} style={lineStyle} />
      <ElButtonGroup>
        <ElButton icon={<Minus />} onClick={decrease} />
        <ElButton icon={<Plus />} onClick={increase} />
      </ElButtonGroup>
    </div>
  );
}

export function ProgressCircle() {
  return (
    <div>
      <ElProgress type="circle" percentage={0} style={circleStyle} />
      <ElProgress type="circle" percentage={25} style={circleStyle} />
      <ElProgress
        type="circle"
        percentage={100}
        status="success"
        style={circleStyle}
      />
      <ElProgress
        type="circle"
        percentage={70}
        status="warning"
        style={circleStyle}
      />
      <ElProgress
        type="circle"
        percentage={50}
        status="exception"
        style={circleStyle}
      />
    </div>
  );
}

export function ProgressDashboard() {
  const [percentage, setPercentage] = useState(10);
  const [percentage2, setPercentage2] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPercentage2((value) => (value % 100) + 10);
    }, 500);
    return () => window.clearInterval(timer);
  }, []);

  const increase = () => setPercentage((value) => Math.min(value + 10, 100));
  const decrease = () => setPercentage((value) => Math.max(value - 10, 0));

  return (
    <div>
      <ElProgress
        type="dashboard"
        percentage={percentage}
        color={COLORS}
      />
      <ElProgress
        type="dashboard"
        percentage={percentage2}
        color={COLORS}
      />
      <div>
        <ElButtonGroup>
          <ElButton icon={<Minus />} onClick={decrease} />
          <ElButton icon={<Plus />} onClick={increase} />
        </ElButtonGroup>
      </div>
    </div>
  );
}

export function ProgressCustomText() {
  return (
    <div>
      <ElProgress percentage={50} style={lineStyle}>
        {() => <ElButton text>Content</ElButton>}
      </ElProgress>
      <ElProgress
        textInside
        strokeWidth={20}
        percentage={50}
        status="exception"
        style={lineStyle}
      >
        {() => <span>Content</span>}
      </ElProgress>
      <ElProgress
        type="circle"
        percentage={100}
        status="success"
        style={circleStyle}
      >
        {() => <ElButton type="success" icon={<Check />} circle />}
      </ElProgress>
      <ElProgress type="dashboard" percentage={80}>
        {(value) => (
          <>
            <span
              style={{ display: "block", marginTop: 10, fontSize: 28 }}
            >
              {value}%
            </span>
            <span
              style={{ display: "block", marginTop: 10, fontSize: 12 }}
            >
              Progressing
            </span>
          </>
        )}
      </ElProgress>
    </div>
  );
}

export function ProgressIndeterminate() {
  return (
    <div>
      <ElProgress percentage={50} indeterminate style={lineStyle} />
      <ElProgress
        percentage={100}
        format={format}
        indeterminate
        style={lineStyle}
      />
      <ElProgress
        percentage={100}
        status="success"
        indeterminate
        duration={5}
        style={lineStyle}
      />
      <ElProgress
        percentage={100}
        status="warning"
        indeterminate
        duration={1}
        style={lineStyle}
      />
      <ElProgress
        percentage={50}
        status="exception"
        indeterminate
        style={lineStyle}
      />
    </div>
  );
}

export function ProgressStriped() {
  const [percentage, setPercentage] = useState(70);
  const duration = Math.floor(percentage / 10);

  const increase = () => setPercentage((value) => Math.min(value + 10, 100));
  const decrease = () => setPercentage((value) => Math.max(value - 10, 0));

  return (
    <div style={line}>
      <ElProgress percentage={50} strokeWidth={15} striped style={lineStyle} />
      <ElProgress
        percentage={30}
        strokeWidth={15}
        status="warning"
        striped
        stripedFlow
        style={lineStyle}
      />
      <ElProgress
        percentage={100}
        strokeWidth={15}
        status="success"
        striped
        stripedFlow
        duration={10}
        style={lineStyle}
      />
      <ElProgress
        percentage={percentage}
        strokeWidth={15}
        status="exception"
        striped
        stripedFlow
        duration={duration}
        style={lineStyle}
      />
      <ElButtonGroup>
        <ElButton icon={<Minus />} onClick={decrease} />
        <ElButton icon={<Plus />} onClick={increase} />
      </ElButtonGroup>
    </div>
  );
}
