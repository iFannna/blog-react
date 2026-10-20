"use client";

import { useState } from "react";
import { ElButton } from "@/components/element-plus/button";

export default function HelloDemo() {
  const [count, setCount] = useState(0);

  return (
    <div className="docs-notes-demo">
      <ElButton type="primary" onClick={() => setCount((value) => value + 1)}>
        Clicked {count} times
      </ElButton>
      <ElButton onClick={() => setCount(0)}>Reset</ElButton>
    </div>
  );
}
