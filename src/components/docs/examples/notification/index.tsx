"use client";

import { useState } from "react";
import { notification } from "@/components/ui/notification";
import { Loading } from "@/components/ui/loading";
import { ElButton } from "@/components/ui/button";
import { ElSwitch } from "@/components/ui/switch";

const row = {
  display: "flex",
  gap: "1.2rem",
  flexWrap: "wrap" as const,
  alignItems: "center",
};

export function NotificationBasic() {
  return (
    <div style={row}>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "Title",
            message: <i style={{ color: "teal" }}>This is a reminder</i>,
          })
        }
      >
        Closes automatically
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "Prompt",
            message: "This is a message that does not automatically close",
            duration: 0,
          })
        }
      >
        Won&apos;t close automatically
      </ElButton>
    </div>
  );
}

const TYPES = [
  { label: "Primary", type: "primary" },
  { label: "Success", type: "success" },
  { label: "Warning", type: "warning" },
  { label: "Info", type: "info" },
  { label: "Error", type: "error" },
] as const;

export function NotificationDifferentTypes() {
  return (
    <div style={row}>
      {TYPES.map(({ label, type }) => (
        <ElButton
          key={type}
          plain
          onClick={() =>
            notification({
              title: label,
              message: `This is a ${type} message`,
              type,
            })
          }
        >
          {label}
        </ElButton>
      ))}
    </div>
  );
}

const POSITIONS = [
  { label: "Top Right", position: "top-right" },
  { label: "Bottom Right", position: "bottom-right" },
  { label: "Bottom Left", position: "bottom-left" },
  { label: "Top Left", position: "top-left" },
] as const;

export function NotificationPositioning() {
  return (
    <div style={row}>
      {POSITIONS.map(({ label, position }) => (
        <ElButton
          key={position}
          plain
          onClick={() =>
            notification({
              title: "Custom Position",
              message: `I'm at the ${position.replace("-", " ")} corner`,
              position,
            })
          }
        >
          {label}
        </ElButton>
      ))}
    </div>
  );
}

export function NotificationOffsetting() {
  return (
    <ElButton
      plain
      onClick={() =>
        notification.success({
          title: "Success",
          message: "This is a success message",
          offset: 100,
        })
      }
    >
      Notification with offset
    </ElButton>
  );
}

export function NotificationRawHtml() {
  return (
    <ElButton
      plain
      onClick={() =>
        notification({
          title: "HTML String",
          dangerouslyUseHTMLString: true,
          message: "<strong>This is <i>HTML</i> string</strong>",
        })
      }
    >
      Use HTML String
    </ElButton>
  );
}

function DynamicSwitch() {
  const [checked, setChecked] = useState(false);
  return <ElSwitch checked={checked} onCheckedChange={setChecked} />;
}

export function NotificationUseVnode() {
  return (
    <div style={row}>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "Use Vnode",
            message: (
              <p style={{ margin: 0 }}>
                Message can be <i style={{ color: "teal" }}>VNode</i>
              </p>
            ),
          })
        }
      >
        Common VNode
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "Use Vnode",
            message: () => <DynamicSwitch />,
          })
        }
      >
        Dynamic props
      </ElButton>
    </div>
  );
}

export function NotificationProgressBar() {
  const open = (type?: "success" | "warning" | "error" | "info") => {
    notification({
      title: `${type ?? "Default"} progress`,
      message: "Hover to pause the timer and progress bar",
      type,
      duration: 6000,
      progress: true,
    });
  };

  return (
    <div style={row}>
      <ElButton plain onClick={() => open()}>
        Default
      </ElButton>
      <ElButton plain onClick={() => open("success")}>
        Success
      </ElButton>
      <ElButton plain onClick={() => open("warning")}>
        Warning
      </ElButton>
      <ElButton plain onClick={() => open("error")}>
        Error
      </ElButton>
      <ElButton plain onClick={() => open("info")}>
        Info
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "Custom color",
            message: "Custom progress bar color overrides the default",
            duration: 6000,
            progress: {
              color: [
                { color: "#f56c6c", percentage: 20 },
                { color: "#e6a23c", percentage: 40 },
                { color: "#5cb87a", percentage: 60 },
                { color: "#1989fa", percentage: 80 },
                { color: "#6f7ad3", percentage: 100 },
              ],
            },
          })
        }
      >
        Custom color
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "No pause on hover",
            message: "Timer and progress bar keep running even when hovering",
            duration: 6000,
            progress: true,
            pauseOnHover: false,
          })
        }
      >
        No pause on hover
      </ElButton>
    </div>
  );
}

export function NotificationNoClose() {
  return (
    <ElButton
      plain
      onClick={() =>
        notification.success({
          title: "Info",
          message: "This is a message without close button",
          showClose: false,
        })
      }
    >
      Hide close button
    </ElButton>
  );
}

// Loading 页面的演示历史上放在此文件，保留导出以免破坏既有引用
export function LoadingBasic() {
  return (
    <div style={{ display: "grid", gap: "1.2rem" }}>
      <div style={row}>
        <ElButton
          onClick={() => {
            const loading = Loading.service({ text: "加载中...", background: "rgba(0,0,0,0.3)" });
            setTimeout(() => loading.close(), 2000);
          }}
        >
          全屏 2 秒
        </ElButton>
        <ElButton
          onClick={() => {
            const loading = Loading.service({ target: "#loading-box", text: "局部加载" });
            setTimeout(() => loading.close(), 2000);
          }}
        >
          局部 2 秒
        </ElButton>
      </div>
      <div
        id="loading-box"
        style={{
          height: 160,
          border: "1px solid var(--docs-example-border)",
          borderRadius: 4,
          display: "grid",
          placeItems: "center",
          color: "var(--docs-text-secondary)",
        }}
      >
        局部 Loading 的目标容器
      </div>
    </div>
  );
}

export function LoadingCustomization() {
  return (
    <div style={{ display: "grid", gap: "1.2rem" }}>
      <div style={row}>
        <ElButton
          onClick={() => {
            const loading = Loading.service({ target: "#loading-custom-box", text: "加载中..." });
            setTimeout(() => loading.close(), 2000);
          }}
        >
          自定义文案
        </ElButton>
        <ElButton
          onClick={() => {
            const loading = Loading.service({
              target: "#loading-custom-box",
              text: "带背景色",
              background: "rgba(64, 158, 255, 0.2)",
            });
            setTimeout(() => loading.close(), 2000);
          }}
        >
          自定义背景色
        </ElButton>
      </div>
      <div
        id="loading-custom-box"
        style={{
          height: 160,
          border: "1px solid var(--docs-example-border)",
          borderRadius: 4,
          display: "grid",
          placeItems: "center",
          color: "var(--docs-text-secondary)",
        }}
      >
        自定义 Loading 的目标容器
      </div>
    </div>
  );
}

export function LoadingFullscreen() {
  return (
    <div style={row}>
      <ElButton
        onClick={() => {
          const loading = Loading.service({ fullscreen: true, text: "全屏加载中..." });
          setTimeout(() => loading.close(), 2000);
        }}
      >
        全屏加载
      </ElButton>
      <ElButton
        onClick={() => {
          const loading = Loading.service({ fullscreen: true, lock: true, text: "锁定滚动" });
          setTimeout(() => loading.close(), 2000);
        }}
      >
        全屏加载并锁定滚动
      </ElButton>
    </div>
  );
}
