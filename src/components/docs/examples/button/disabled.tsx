"use client";

import { ElButton } from "@/components/element-plus/button";
import { exampleRow, exampleStack } from "./styles";

export default function ButtonDisabled() {
  return (
    <div className={exampleStack}>
      <div className={exampleRow}>
        <ElButton disabled>Default</ElButton>
        <ElButton type="primary" disabled>Primary</ElButton>
        <ElButton type="success" disabled>Success</ElButton>
        <ElButton type="info" disabled>Info</ElButton>
        <ElButton type="warning" disabled>Warning</ElButton>
        <ElButton type="danger" disabled>Danger</ElButton>
      </div>

      <div className={exampleRow}>
        <ElButton plain disabled>Plain</ElButton>
        <ElButton type="primary" plain disabled>Primary</ElButton>
        <ElButton type="success" plain disabled>Success</ElButton>
        <ElButton type="info" plain disabled>Info</ElButton>
        <ElButton type="warning" plain disabled>Warning</ElButton>
        <ElButton type="danger" plain disabled>Danger</ElButton>
      </div>
    </div>
  );
}
