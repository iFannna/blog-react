"use client";

import { useState } from "react";
import { ElProgress } from "@/components/ui/progress";
import { ElButton } from "@/components/ui/button";

const stack = { display: "flex", flexDirection: "column", gap: "1.6rem" } as const;
const row = {
  display: "flex",
  alignItems: "center",
  gap: "2rem",
  flexWrap: "wrap",
} as const;

export function ProgressBasic() {
  return (
    <div style={stack}>
      <ElProgress percentage={50} />
      <ElProgress percentage={70} />
      <ElProgress percentage={90} />
    </div>
  );
}

export function ProgressTextInside() {
  return (
    <div style={stack}>
      <ElProgress percentage={60} textInside strokeWidth={20} />
      <ElProgress percentage={80} textInside strokeWidth={24} />
    </div>
  );
}

export function ProgressCustomText() {
  return (
    <div style={stack}>
      <ElProgress percentage={70} format={(p) => `进度 ${p}%`} />
      <ElProgress percentage={100} format={() => "完成"} />
    </div>
  );
}

export function ProgressColor() {
  return (
    <div style={stack}>
      <ElProgress percentage={80} color="#626aef" />
      <ElProgress
        percentage={70}
        color={[
          { color: "#f56c6c", percentage: 20 },
          { color: "#e6a23c", percentage: 40 },
          { color: "#5cb87a", percentage: 60 },
          { color: "#1989fa", percentage: 80 },
        ]}
      />
      <ElProgress percentage={50} color={(p) => (p < 60 ? "#f56c6c" : "#5cb87a")} />
    </div>
  );
}

export function ProgressStriped() {
  return (
    <div style={stack}>
      <ElProgress percentage={40} striped />
      <ElProgress percentage={60} striped stripedFlow />
    </div>
  );
}

export function ProgressCircle() {
  return (
    <div style={row}>
      <ElProgress type="circle" percentage={0} />
      <ElProgress type="circle" percentage={25} />
      <ElProgress type="circle" percentage={75} />
      <ElProgress type="circle" percentage={100} status="success" />
    </div>
  );
}

export function ProgressDashboard() {
  return (
    <div style={row}>
      <ElProgress type="dashboard" percentage={0} />
      <ElProgress type="dashboard" percentage={30} />
      <ElProgress type="dashboard" percentage={60} strokeWidth={12} />
      <ElProgress type="dashboard" percentage={100} status="warning" />
    </div>
  );
}

export function ProgressIndeterminate() {
  const [loading, setLoading] = useState(true);
  return (
    <div style={stack}>
      <ElProgress percentage={loading ? 100 : 50} indeterminate={loading} duration={2} />
      <ElButton onClick={() => setLoading((v) => !v)}>切换</ElButton>
    </div>
  );
}
