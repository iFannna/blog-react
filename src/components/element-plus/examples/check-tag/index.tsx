"use client";

import { useState } from "react";
import { ElCheckTag, type CheckTagType } from "@/components/element-plus/check-tag";

const row = { display: "flex", gap: "1.2rem", flexWrap: "wrap" as const };

export function CheckTagBasic() {
  const [checked, setChecked] = useState(true);
  return (
    <ElCheckTag checked={checked} onCheckedChange={setChecked}>
      标签
    </ElCheckTag>
  );
}

export function CheckTagTypes() {
  const [state, setState] = useState<Record<string, boolean>>({ primary: true });
  return (
    <div style={row}>
      {(["primary", "success", "info", "warning", "danger"] as CheckTagType[]).map((t) => (
        <ElCheckTag
          key={t}
          type={t}
          checked={!!state[t]}
          onCheckedChange={(v) => setState((prev) => ({ ...prev, [t]: v }))}
        >
          {t}
        </ElCheckTag>
      ))}
    </div>
  );
}

export function CheckTagDisabled() {
  return (
    <div style={row}>
      <ElCheckTag disabled>未选中禁用</ElCheckTag>
      <ElCheckTag checked disabled>
        选中禁用
      </ElCheckTag>
    </div>
  );
}
