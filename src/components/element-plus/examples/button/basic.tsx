"use client";

import { ElButton } from "@/components/element-plus/button";
import { Check, Delete, Edit, Message, Search, Star } from "@/components/element-plus/icons";
import { exampleRow, exampleStack } from "./styles";

export default function ButtonBasic() {
  return (
    <div style={exampleStack}>
      <div style={exampleRow}>
        <ElButton>Default</ElButton>
        <ElButton type="primary">Primary</ElButton>
        <ElButton type="success">Success</ElButton>
        <ElButton type="info">Info</ElButton>
        <ElButton type="warning">Warning</ElButton>
        <ElButton type="danger">Danger</ElButton>
      </div>

      <div style={exampleRow}>
        <ElButton plain>Plain</ElButton>
        <ElButton type="primary" plain>Primary</ElButton>
        <ElButton type="success" plain>Success</ElButton>
        <ElButton type="info" plain>Info</ElButton>
        <ElButton type="warning" plain>Warning</ElButton>
        <ElButton type="danger" plain>Danger</ElButton>
      </div>

      <div style={exampleRow}>
        <ElButton round>Round</ElButton>
        <ElButton type="primary" round>Primary</ElButton>
        <ElButton type="success" round>Success</ElButton>
        <ElButton type="info" round>Info</ElButton>
        <ElButton type="warning" round>Warning</ElButton>
        <ElButton type="danger" round>Danger</ElButton>
      </div>

      <div style={exampleRow}>
        <ElButton dashed>Dashed</ElButton>
        <ElButton type="primary" dashed>Primary</ElButton>
        <ElButton type="success" dashed>Success</ElButton>
        <ElButton type="info" dashed>Info</ElButton>
        <ElButton type="warning" dashed>Warning</ElButton>
        <ElButton type="danger" dashed>Danger</ElButton>
      </div>

      <div style={exampleRow}>
        <ElButton icon={<Search />} circle aria-label="search" />
        <ElButton type="primary" icon={<Edit />} circle aria-label="edit" />
        <ElButton type="success" icon={<Check />} circle aria-label="check" />
        <ElButton type="info" icon={<Message />} circle aria-label="message" />
        <ElButton type="warning" icon={<Star />} circle aria-label="star" />
        <ElButton type="danger" icon={<Delete />} circle aria-label="delete" />
      </div>
    </div>
  );
}
