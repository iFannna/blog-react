"use client";

import { useState } from "react";
import { ElButton, ElButtonGroup } from "@/components/element-plus/button";
import {
  ArrowLeft,
  ArrowRight,
  House,
  Notification,
  Operation,
} from "@/components/element-plus/icons";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { ElRadio, ElRadioGroup } from "@/components/element-plus/radio";
import { mb16, mb8 } from "./styles";

export default function ButtonGroupDemo() {
  const [direction, setDirection] = useState<"horizontal" | "vertical">(
    "horizontal",
  );

  return (
    <>
      <ElButtonGroup className={mb16}>
        <ElButton type="primary" icon={<ArrowLeft />}>
          Previous Page
        </ElButton>
        <ElButton type="primary">
          Next Page
          <ElIcon className="el-icon--right">
            <ArrowRight />
          </ElIcon>
        </ElButton>
      </ElButtonGroup>
      <br />
      <ElRadioGroup
        value={direction}
        onChange={(value) => setDirection(value as "horizontal" | "vertical")}
        className={mb8}
      >
        <ElRadio value="horizontal" label="Horizontal" />
        <ElRadio value="vertical" label="Vertical" />
      </ElRadioGroup>
      <br />
      <ElButtonGroup direction={direction}>
        <ElButton type="primary" icon={<House />} aria-label="house" />
        <ElButton type="primary" icon={<Operation />} aria-label="operation" />
        <ElButton
          type="primary"
          icon={<Notification />}
          aria-label="notification"
        />
      </ElButtonGroup>
    </>
  );
}
