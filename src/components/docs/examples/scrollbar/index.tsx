"use client";

import { useRef, useState } from "react";
import { ElScrollbar, type ScrollbarDirection, type ScrollbarExpose } from "@/components/ui/scrollbar";
import { ElButton } from "@/components/ui/button";
import { ElSlider } from "@/components/ui/slider";

/** 官方示例统一用 .scrollbar-demo-item 做条目，这里用等价的内联样式。 */
const itemStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: 50,
  margin: 10,
  textAlign: "center",
  borderRadius: 4,
  background: "var(--el-color-primary-light-9)",
  color: "var(--el-color-primary)",
};

export function ScrollbarBasic() {
  return (
    <ElScrollbar height="400px">
      {Array.from({ length: 20 }, (_, i) => (
        <p key={i + 1} style={itemStyle}>
          {i + 1}
        </p>
      ))}
    </ElScrollbar>
  );
}

export function ScrollbarHorizontal() {
  return (
    <ElScrollbar>
      <div style={{ display: "flex", width: "fit-content" }}>
        {Array.from({ length: 50 }, (_, i) => (
          <p key={i + 1} style={{ ...itemStyle, flexShrink: 0, width: 100 }}>
            {i + 1}
          </p>
        ))}
      </div>
    </ElScrollbar>
  );
}

export function ScrollbarMaxHeight() {
  const [count, setCount] = useState(3);
  return (
    <>
      <ElButton onClick={() => setCount((n) => n + 1)}>Add Item</ElButton>
      <ElButton onClick={() => setCount((n) => (n > 0 ? n - 1 : 0))}>Delete Item</ElButton>

      <ElScrollbar maxHeight="400px">
        {Array.from({ length: count }, (_, i) => (
          <p key={i + 1} style={itemStyle}>
            {i + 1}
          </p>
        ))}
      </ElScrollbar>
    </>
  );
}

export function ScrollbarInfinite() {
  const [num, setNum] = useState(30);
  const loadMore = (direction: ScrollbarDirection) => {
    if (direction === "bottom") setNum((n) => n + 5);
  };

  return (
    <ElScrollbar height="400px" distance={5} onEndReached={loadMore}>
      {Array.from({ length: num }, (_, i) => (
        <p key={i + 1} style={itemStyle}>
          {i + 1}
        </p>
      ))}
    </ElScrollbar>
  );
}

export function ScrollbarManual() {
  const scrollbarRef = useRef<ScrollbarExpose>(null);
  const [value, setValue] = useState(0);
  const max = 19 * 70 - 400;

  return (
    <>
      <ElScrollbar ref={scrollbarRef} height="400px" always>
        {Array.from({ length: 20 }, (_, i) => (
          <p key={i + 1} style={itemStyle}>
            {i + 1}
          </p>
        ))}
      </ElScrollbar>

      <ElSlider
        value={value}
        max={max}
        onChange={(next) => {
          const v = Number(next) || 0;
          setValue(v);
          scrollbarRef.current?.setScrollTop(v);
        }}
      />
    </>
  );
}
