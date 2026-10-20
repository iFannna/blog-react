"use client";

import { ElButton } from "@/components/element-plus/button";
import { exampleRow } from "./styles";

export default function ButtonText() {
  return (
    <div>
      <p>Basic text button</p>
      <div style={exampleRow}>
        <ElButton text>plain</ElButton>
        <ElButton type="primary" text>primary</ElButton>
        <ElButton type="success" text>success</ElButton>
        <ElButton type="info" text>info</ElButton>
        <ElButton type="warning" text>warning</ElButton>
        <ElButton type="danger" text>danger</ElButton>
      </div>

      <p>Background color always on</p>
      <div style={exampleRow}>
        <ElButton text bg>plain</ElButton>
        <ElButton type="primary" text bg>primary</ElButton>
        <ElButton type="success" text bg>success</ElButton>
        <ElButton type="info" text bg>info</ElButton>
        <ElButton type="warning" text bg>warning</ElButton>
        <ElButton type="danger" text bg>danger</ElButton>
      </div>

      <p>Disabled text button</p>
      <div style={exampleRow}>
        <ElButton text disabled>plain</ElButton>
        <ElButton type="primary" text disabled>primary</ElButton>
        <ElButton type="success" text disabled>success</ElButton>
        <ElButton type="info" text disabled>info</ElButton>
        <ElButton type="warning" text disabled>warning</ElButton>
        <ElButton type="danger" text disabled>danger</ElButton>
      </div>
    </div>
  );
}
