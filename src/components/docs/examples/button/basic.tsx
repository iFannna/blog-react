"use client";

import { ElButton } from "@/components/ui/button";
import { Check, Delete, Edit, Message, Search, Star } from "@/components/ui/icons";
import { exampleRow, exampleStack } from "./styles";

const TYPES = [
  { type: "", label: "Default" },
  { type: "primary", label: "Primary" },
  { type: "success", label: "Success" },
  { type: "info", label: "Info" },
  { type: "warning", label: "Warning" },
  { type: "danger", label: "Danger" },
] as const;

const CIRCLE_ICONS = [
  { type: "", icon: <Search />, label: "search" },
  { type: "primary", icon: <Edit />, label: "edit" },
  { type: "success", icon: <Check />, label: "check" },
  { type: "info", icon: <Message />, label: "message" },
  { type: "warning", icon: <Star />, label: "star" },
  { type: "danger", icon: <Delete />, label: "delete" },
] as const;

export default function ButtonBasic() {
  return (
    <div style={exampleStack}>
      <div style={exampleRow}>
        {TYPES.map(({ type, label }) => (
          <ElButton key={label} type={type}>
            {label}
          </ElButton>
        ))}
      </div>

      <div style={exampleRow}>
        {TYPES.map(({ type, label }) => (
          <ElButton key={label} type={type} plain>
            {label}
          </ElButton>
        ))}
      </div>

      <div style={exampleRow}>
        {TYPES.map(({ type, label }) => (
          <ElButton key={label} type={type} round>
            {label}
          </ElButton>
        ))}
      </div>

      <div style={exampleRow}>
        {TYPES.map(({ type, label }) => (
          <ElButton key={label} type={type} dashed>
            {label}
          </ElButton>
        ))}
      </div>

      <div style={exampleRow}>
        {CIRCLE_ICONS.map(({ type, icon, label }) => (
          <ElButton key={label} type={type} icon={icon} circle aria-label={label} />
        ))}
      </div>
    </div>
  );
}
