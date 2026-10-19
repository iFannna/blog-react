"use client";

import { ElButton } from "@/components/element-plus/button";
import { exampleRow } from "./styles";

const BUTTONS = [
  { type: "", text: "plain" },
  { type: "primary", text: "primary" },
  { type: "success", text: "success" },
  { type: "info", text: "info" },
  { type: "warning", text: "warning" },
  { type: "danger", text: "danger" },
] as const;

export default function ButtonLink() {
  return (
    <div>
      <p>Basic link button</p>
      <div style={exampleRow}>
        {BUTTONS.map(({ type, text }) => (
          <ElButton key={text} type={type} link>
            {text}
          </ElButton>
        ))}
      </div>

      <p>Disabled link button</p>
      <div style={exampleRow}>
        {BUTTONS.map(({ type, text }) => (
          <ElButton key={text} type={type} link disabled>
            {text}
          </ElButton>
        ))}
      </div>
    </div>
  );
}
