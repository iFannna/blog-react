"use client";

import { ElButton } from "@/components/element-plus/button";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { Eleme } from "@/components/element-plus/icons";
import { exampleStack } from "./styles";

/** 官方第三个示例是自定义 loading 插槽，用一个带动画的 svg 代替默认图标。 */
function CustomLoading() {
  return (
    <span className="docs-custom-loading">
      <svg className="docs-custom-loading__circular" viewBox="-10 -10 50 50">
        <path
          className="docs-custom-loading__path"
          d="M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15"
          style={{ strokeWidth: 4, fill: "rgba(0, 0, 0, 0)" }}
        />
      </svg>
    </span>
  );
}

export default function ButtonLoading() {
  return (
    <div style={exampleStack}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem" }}>
        <ElButton type="primary" loading>Loading</ElButton>
        <ElButton type="primary" loadingIcon={<ElIcon><Eleme /></ElIcon>} loading>
          Loading
        </ElButton>
        <ElButton type="primary" loadingIcon={<CustomLoading />} loading>
          Loading
        </ElButton>
      </div>
    </div>
  );
}
