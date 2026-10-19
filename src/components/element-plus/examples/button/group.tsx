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
import { exampleStack } from "./styles";

/** 官方示例用 el-radio-group 切换方向，Radio 尚未实现，这里用原生按钮代替。 */
export default function ButtonGroupDemo() {
  const [direction, setDirection] = useState<"horizontal" | "vertical">(
    "horizontal",
  );

  return (
    <div style={exampleStack}>
      <ElButtonGroup>
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

      <div style={{ display: "flex", gap: "1rem" }}>
        {(["horizontal", "vertical"] as const).map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => setDirection(value)}
            style={{
              padding: "0.4rem 1rem",
              border: "1px solid #dcdfe6",
              borderRadius: "0.4rem",
              background: direction === value ? "#409eff" : "#fff",
              color: direction === value ? "#fff" : "#606266",
              cursor: "pointer",
            }}
          >
            {value === "horizontal" ? "Horizontal" : "Vertical"}
          </button>
        ))}
      </div>

      <ElButtonGroup direction={direction}>
        <ElButton type="primary" icon={<House />} aria-label="house" />
        <ElButton type="primary" icon={<Operation />} aria-label="operation" />
        <ElButton
          type="primary"
          icon={<Notification />}
          aria-label="notification"
        />
      </ElButtonGroup>
    </div>
  );
}
