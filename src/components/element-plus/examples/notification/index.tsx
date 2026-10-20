"use client";

import { useEffect, useRef, useState } from "react";
import { notification } from "@/components/element-plus/notification";
import { Loading } from "@/components/element-plus/loading";
import { ElButton } from "@/components/element-plus/button";
import { ElSwitch } from "@/components/element-plus/switch";
import { ElTable, ElTableColumn } from "@/components/element-plus/table";
import styles from "./notification.module.css";

export function NotificationBasic() {
  return (
    <div className={styles.row}>
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

export function NotificationDifferentTypes() {
  return (
    <div className={styles.row}>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "Primary",
            message: "This is a primary message",
            type: "primary",
          })
        }
      >
        Primary
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "Success",
            message: "This is a success message",
            type: "success",
          })
        }
      >
        Success
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "Warning",
            message: "This is a warning message",
            type: "warning",
          })
        }
      >
        Warning
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "Info",
            message: "This is a info message",
            type: "info",
          })
        }
      >
        Info
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "Error",
            message: "This is a error message",
            type: "error",
          })
        }
      >
        Error
      </ElButton>
    </div>
  );
}

export function NotificationPositioning() {
  return (
    <div className={styles.row}>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "Custom Position",
            message: "I'm at the top right corner",
            position: "top-right",
          })
        }
      >
        Top Right
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "Custom Position",
            message: "I'm at the bottom right corner",
            position: "bottom-right",
          })
        }
      >
        Bottom Right
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "Custom Position",
            message: "I'm at the bottom left corner",
            position: "bottom-left",
          })
        }
      >
        Bottom Left
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          notification({
            title: "Custom Position",
            message: "I'm at the top left corner",
            position: "top-left",
          })
        }
      >
        Top Left
      </ElButton>
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
    <div className={styles.row}>
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
    <>
      <ElButton plain onClick={() => open()}>
        Default
      </ElButton>
      <ElButton plain type="success" onClick={() => open("success")}>
        Success
      </ElButton>
      <ElButton plain type="warning" onClick={() => open("warning")}>
        Warning
      </ElButton>
      <ElButton plain type="danger" onClick={() => open("error")}>
        Error
      </ElButton>
      <ElButton plain type="info" onClick={() => open("info")}>
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
    </>
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

const loadingTableData = [
  {
    date: "2016-05-02",
    name: "John Smith",
    address: "No.1518,  Jinshajiang Road, Putuo District",
  },
  {
    date: "2016-05-04",
    name: "John Smith",
    address: "No.1518,  Jinshajiang Road, Putuo District",
  },
  {
    date: "2016-05-01",
    name: "John Smith",
    address: "No.1518,  Jinshajiang Road, Putuo District",
  },
];

const loadingSvg = `<path class="path" d="M 30 15 L 28 17 M 25.61 25.61 A 15 15, 0, 0, 1, 15 30 A 15 15, 0, 1, 1, 27.99 7.5 L 15 15" style="stroke-width: 4px; fill: rgba(0, 0, 0, 0)"/>`;

function LoadingTable() {
  return (
    <ElTable data={loadingTableData}>
      <ElTableColumn property="date" label="Date" width={180} />
      <ElTableColumn property="name" label="Name" width={180} />
      <ElTableColumn property="address" label="Address" />
    </ElTable>
  );
}

export function LoadingBasic() {
  const tableRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!tableRef.current) return;
    const instance = Loading.service({ target: tableRef.current });
    return () => instance.close();
  }, []);

  return (
    <div ref={tableRef} style={{ width: "100%" }}>
      <LoadingTable />
    </div>
  );
}

export function LoadingCustomization() {
  const firstRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!firstRef.current || !secondRef.current) return;
    const first = Loading.service({
      target: firstRef.current,
      text: "Loading...",
      spinner: loadingSvg,
      svgViewBox: "-10, -10, 50, 50",
      background: "rgba(122, 122, 122, 0.8)",
    });
    const second = Loading.service({
      target: secondRef.current,
      spinner: loadingSvg,
      customClass: "custom-loading-svg",
    });
    return () => {
      first.close();
      second.close();
    };
  }, []);

  return (
    <div style={{ width: "100%" }}>
      <div ref={firstRef} style={{ width: "100%" }}>
        <LoadingTable />
      </div>
      <div ref={secondRef} style={{ width: "100%" }}>
        <LoadingTable />
      </div>
    </div>
  );
}

export function LoadingFullscreen() {
  return (
    <>
      <ElButton
        type="primary"
        onClick={() => {
          const loading = Loading.service({ fullscreen: true, lock: true });
          setTimeout(() => loading.close(), 2000);
        }}
      >
        As a directive
      </ElButton>
      <ElButton
        type="primary"
        onClick={() => {
          const loading = Loading.service({
            lock: true,
            text: "Loading",
            background: "rgba(0, 0, 0, 0.7)",
          });
          setTimeout(() => loading.close(), 2000);
        }}
      >
        As a service
      </ElButton>
    </>
  );
}
