"use client";

import { ElButton } from "@/components/element-plus/button";
import { exampleRow, exampleStack } from "./styles";

const TYPES = [
  { type: "", label: "Default" },
  { type: "primary", label: "Primary" },
  { type: "success", label: "Success" },
  { type: "info", label: "Info" },
  { type: "warning", label: "Warning" },
  { type: "danger", label: "Danger" },
] as const;

export default function ButtonDisabled() {
  return (
    <div style={exampleStack}>
      <div style={exampleRow}>
        {TYPES.map(({ type, label }) => (
          <ElButton key={label} type={type} disabled>
            {label}
          </ElButton>
        ))}
      </div>

      <div style={exampleRow}>
        {TYPES.map(({ type, label }) => (
          <ElButton key={label} type={type} plain disabled>
            {label}
          </ElButton>
        ))}
      </div>
    </div>
  );
}
