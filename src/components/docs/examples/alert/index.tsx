"use client";

import { useState } from "react";
import { ElAlert } from "@/components/ui/alert";

const stack = { display: "flex", flexDirection: "column", gap: "1.2rem" } as const;

export function AlertBasic() {
  return (
    <div style={stack}>
      <ElAlert title="成功提示的文案" type="success" />
      <ElAlert title="消息提示的文案" type="info" />
      <ElAlert title="警告提示的文案" type="warning" />
      <ElAlert title="错误提示的文案" type="error" />
    </div>
  );
}

export function AlertTheme() {
  return (
    <div style={stack}>
      <ElAlert title="成功提示的文案" type="success" effect="dark" />
      <ElAlert title="消息提示的文案" type="info" effect="dark" />
      <ElAlert title="警告提示的文案" type="warning" effect="dark" />
      <ElAlert title="错误提示的文案" type="error" effect="dark" />
    </div>
  );
}

export function AlertCustomClose() {
  const [visible, setVisible] = useState(true);
  return (
    <div style={stack}>
      {visible && (
        <ElAlert
          title="自定义关闭按钮"
          type="info"
          closeText="知道了"
          onClose={() => setVisible(false)}
        />
      )}
      {!visible && (
        <button
          type="button"
          onClick={() => setVisible(true)}
          style={{
            alignSelf: "flex-start",
            padding: "0.4rem 1rem",
            border: "1px solid #dcdfe6",
            borderRadius: "0.4rem",
            background: "#fff",
            cursor: "pointer",
          }}
        >
          重置
        </button>
      )}
    </div>
  );
}

export function AlertDescription() {
  return (
    <div style={stack}>
      <ElAlert
        title="带辅助性文字介绍"
        type="success"
        description="这是一段辅助性文字，用于补充说明。"
        showIcon
      />
      <ElAlert
        title="带图标与描述"
        type="warning"
        description="这是一段辅助性文字。"
        showIcon
      />
    </div>
  );
}

export function AlertIcon() {
  return (
    <div style={stack}>
      <ElAlert title="显示图标" type="success" showIcon />
      <ElAlert title="显示图标" type="info" showIcon />
      <ElAlert title="显示图标" type="warning" showIcon />
      <ElAlert title="显示图标" type="error" showIcon />
    </div>
  );
}

export function AlertCenter() {
  return (
    <div style={stack}>
      <ElAlert title="文字居中" type="success" center showIcon />
      <ElAlert
        title="文字居中"
        type="info"
        description="辅助性文字也居中显示。"
        center
        showIcon
      />
    </div>
  );
}

export function AlertClosable() {
  const [items, setItems] = useState(["提示一", "提示二", "提示三"]);
  return (
    <div style={stack}>
      {items.map((title) => (
        <ElAlert
          key={title}
          title={title}
          onClose={() => setItems(items.filter((t) => t !== title))}
        />
      ))}
      {items.length === 0 && <span>已全部关闭</span>}
    </div>
  );
}
