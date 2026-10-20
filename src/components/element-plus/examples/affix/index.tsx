"use client";

import { type CSSProperties } from "react";
import { ElAffix } from "@/components/element-plus/affix";
import { ElButton } from "@/components/element-plus/button";

const containerStyle: CSSProperties = {
  textAlign: "center",
  height: 400,
  borderRadius: 4,
  background: "var(--el-color-primary-light-9)",
};

export function AffixBasic() {
  return (
    <ElAffix offset={120}>
      <ElButton type="primary">Offset top 120px</ElButton>
    </ElAffix>
  );
}

export function AffixTarget() {
  return (
    <div className="affix-container" style={containerStyle}>
      <ElAffix target=".affix-container" offset={80}>
        <ElButton type="primary">Target container</ElButton>
      </ElAffix>
    </div>
  );
}

export function AffixFixed() {
  return (
    <ElAffix position="bottom" offset={20}>
      <ElButton type="primary">Offset bottom 20px</ElButton>
    </ElAffix>
  );
}
