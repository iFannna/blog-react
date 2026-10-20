"use client";

import { useState, type CSSProperties, type ReactNode } from "react";
import { ElSplitter, ElSplitterPanel } from "@/components/element-plus/splitter";
import { ElSwitch } from "@/components/element-plus/switch";
import styles from "./splitter.module.css";

/** 官方示例统一给外层盒子一个固定高度和阴影，这里保持一致。 */
const container: CSSProperties = {
  height: 250,
  boxShadow: "var(--el-border-color-light) 0px 0px 10px",
};

const panelContent: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  height: "100%",
};

/** 对应官方示例里的 .demo-panel */
function DemoPanel({ children }: { children?: ReactNode }) {
  return <div style={panelContent}>{children}</div>;
}

export function SplitterBasic() {
  return (
    <div style={container}>
      <ElSplitter>
        <ElSplitterPanel size="30%">
          <DemoPanel>1</DemoPanel>
        </ElSplitterPanel>
        <ElSplitterPanel min={200}>
          <DemoPanel>2</DemoPanel>
        </ElSplitterPanel>
      </ElSplitter>
    </div>
  );
}

export function SplitterVertical() {
  return (
    <div style={container}>
      <ElSplitter layout="vertical">
        <ElSplitterPanel>
          <DemoPanel>1</DemoPanel>
        </ElSplitterPanel>
        <ElSplitterPanel>
          <DemoPanel>2</DemoPanel>
        </ElSplitterPanel>
      </ElSplitter>
    </div>
  );
}

export function SplitterCollapsible() {
  const [isCollapsible, setIsCollapsible] = useState(true);

  return (
    <div>
      <ElSwitch
        className={styles.switch}
        checked={isCollapsible}
        onCheckedChange={setIsCollapsible}
        activeText="enable"
        inactiveText="disable"
        inlinePrompt
      />
      <div style={container}>
        <ElSplitter>
          <ElSplitterPanel collapsible={isCollapsible} min="50">
            <DemoPanel>1</DemoPanel>
          </ElSplitterPanel>
          <ElSplitterPanel collapsible={isCollapsible}>
            <DemoPanel>2</DemoPanel>
          </ElSplitterPanel>
          <ElSplitterPanel>
            <DemoPanel>3</DemoPanel>
          </ElSplitterPanel>
          <ElSplitterPanel collapsible={isCollapsible}>
            <ElSplitter layout="vertical">
              <ElSplitterPanel collapsible={isCollapsible}>
                <DemoPanel>4</DemoPanel>
              </ElSplitterPanel>
              <ElSplitterPanel collapsible={isCollapsible}>
                <DemoPanel>5</DemoPanel>
              </ElSplitterPanel>
            </ElSplitter>
          </ElSplitterPanel>
        </ElSplitter>
      </div>
    </div>
  );
}

export function SplitterDisableDrag() {
  const [resizable, setResizable] = useState(false);

  return (
    <div>
      <ElSwitch
        className={styles.switch}
        checked={resizable}
        onCheckedChange={setResizable}
        activeText="enable"
        inactiveText="disable"
        inlinePrompt
      />
      <div style={container}>
        <ElSplitter>
          <ElSplitterPanel>
            <DemoPanel>1</DemoPanel>
          </ElSplitterPanel>
          <ElSplitterPanel resizable={resizable}>
            <DemoPanel>{`drag ${resizable ? "enable" : "disable"}`}</DemoPanel>
          </ElSplitterPanel>
          <ElSplitterPanel>
            <DemoPanel>3</DemoPanel>
          </ElSplitterPanel>
        </ElSplitter>
      </div>
    </div>
  );
}

export function SplitterSize() {
  const [size, setSize] = useState<number>(100);

  const handleResizeStart = (index: number, sizes: number[]) => {
    console.log("resizeStart", index, sizes);
  };
  const handleResize = (index: number, sizes: number[]) => {
    console.log("resize", index, sizes);
  };
  const handleResizeEnd = (index: number, sizes: number[]) => {
    console.log("resizeEnd", index, sizes);
  };

  return (
    <div style={container}>
      <ElSplitter
        onResizeStart={handleResizeStart}
        onResize={handleResize}
        onResizeEnd={handleResizeEnd}
      >
        <ElSplitterPanel>
          <DemoPanel>1</DemoPanel>
        </ElSplitterPanel>
        <ElSplitterPanel
          size={size}
          onSizeChange={setSize}
          min={50}
          max={200}
        >
          <DemoPanel>{`${size}px`}</DemoPanel>
        </ElSplitterPanel>
        <ElSplitterPanel>
          <DemoPanel>3</DemoPanel>
        </ElSplitterPanel>
      </ElSplitter>
    </div>
  );
}

export function SplitterLazy() {
  return (
    <div style={container}>
      <ElSplitter lazy>
        <ElSplitterPanel collapsible min="50">
          <DemoPanel>1</DemoPanel>
        </ElSplitterPanel>
        <ElSplitterPanel collapsible>
          <DemoPanel>2</DemoPanel>
        </ElSplitterPanel>
        <ElSplitterPanel collapsible>
          <DemoPanel>3</DemoPanel>
        </ElSplitterPanel>
      </ElSplitter>
    </div>
  );
}
