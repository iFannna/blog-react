"use client";

import { ElButton } from "@/components/element-plus/button";
import { exampleRow } from "./styles";

export default function ButtonTag() {
  return (
    <div style={exampleRow}>
      <ElButton>button</ElButton>
      <ElButton tag="div" role="button" tabIndex={0}>div</ElButton>
      <ElButton
        type="primary"
        tag="a"
        href="https://github.com/element-plus/element-plus"
        target="_blank"
        rel="noopener noreferrer"
      >
        a
      </ElButton>
    </div>
  );
}
