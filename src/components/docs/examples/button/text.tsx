"use client";

import { ElButton } from "@/components/ui/button";
import { exampleRow } from "./styles";

const BUTTONS = [
  { type: "", text: "plain" },
  { type: "primary", text: "primary" },
  { type: "success", text: "success" },
  { type: "info", text: "info" },
  { type: "warning", text: "warning" },
  { type: "danger", text: "danger" },
] as const;

export default function ButtonText() {
  return (
    <div>
      <p>Basic text button</p>
      <div style={exampleRow}>
        {BUTTONS.map(({ type, text }) => (
          <ElButton key={text} type={type} text>
            {text}
          </ElButton>
        ))}
      </div>

      <p>Background color always on</p>
      <div style={exampleRow}>
        {BUTTONS.map(({ type, text }) => (
          <ElButton key={text} type={type} text bg>
            {text}
          </ElButton>
        ))}
      </div>

      <p>Disabled text button</p>
      <div style={exampleRow}>
        {BUTTONS.map(({ type, text }) => (
          <ElButton key={text} type={type} text disabled>
            {text}
          </ElButton>
        ))}
      </div>
    </div>
  );
}
