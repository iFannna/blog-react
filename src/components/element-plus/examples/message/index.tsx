"use client";

import { useRef } from "react";
import { message } from "@/components/element-plus/message";
import { ElButton } from "@/components/element-plus/button";
import styles from "./message.module.css";

export function MessageBasic() {
  return (
    <div className={styles.row}>
      <ElButton plain onClick={() => message("This is a message.")}>
        Show message
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          message({
            message: (
              <p style={{ lineHeight: 1, fontSize: 14, margin: 0 }}>
                Message can be <i style={{ color: "teal" }}>VNode</i>
              </p>
            ),
          })
        }
      >
        VNode
      </ElButton>
    </div>
  );
}

export function MessageDifferentTypes() {
  return (
    <div className={styles.row}>
      <ElButton
        plain
        onClick={() =>
          message({ message: "This is a primary message.", type: "primary" })
        }
      >
        Primary
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          message({ message: "This is a success message.", type: "success" })
        }
      >
        Success
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          message({ message: "This is a warning message.", type: "warning" })
        }
      >
        Warning
      </ElButton>
      <ElButton
        plain
        onClick={() => message({ message: "This is a info message.", type: "info" })}
      >
        Info
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          message({ message: "This is a error message.", type: "error" })
        }
      >
        Error
      </ElButton>
    </div>
  );
}

export function MessagePlain() {
  return (
    <div className={styles.row}>
      <ElButton
        plain
        onClick={() =>
          message({
            message: "This is a primary message.",
            type: "primary",
            plain: true,
          })
        }
      >
        Primary
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          message({
            message: "This is a success message.",
            type: "success",
            plain: true,
          })
        }
      >
        Success
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          message({
            message: "This is a warning message.",
            type: "warning",
            plain: true,
          })
        }
      >
        Warning
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          message({ message: "This is a info message.", type: "info", plain: true })
        }
      >
        Info
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          message({ message: "This is a error message.", type: "error", plain: true })
        }
      >
        Error
      </ElButton>
    </div>
  );
}

export function MessageClosable() {
  return (
    <div className={styles.row}>
      <ElButton
        plain
        onClick={() =>
          message({
            message: "This is a primary message.",
            type: "primary",
            showClose: true,
          })
        }
      >
        Primary
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          message({
            message: "This is a success message.",
            type: "success",
            showClose: true,
          })
        }
      >
        Success
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          message({
            message: "This is a warning message.",
            type: "warning",
            showClose: true,
          })
        }
      >
        Warning
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          message({
            message: "This is a info message.",
            type: "info",
            showClose: true,
          })
        }
      >
        Info
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          message({
            message: "This is a error message.",
            type: "error",
            showClose: true,
          })
        }
      >
        Error
      </ElButton>
      <ElButton
        plain
        onClick={() =>
          message({
            showClose: true,
            message: "This is a message that does not automatically close.",
            duration: 0,
          })
        }
      >
        Won&apos;t close automatically
      </ElButton>
    </div>
  );
}

export function MessageRawHtml() {
  return (
    <ElButton
      plain
      onClick={() =>
        message({
          dangerouslyUseHTMLString: true,
          message: "<strong>This is <i>HTML</i> string</strong>",
        })
      }
    >
      Use HTML string
    </ElButton>
  );
}

export function MessageGrouping() {
  return (
    <ElButton
      plain
      onClick={() =>
        message({
          message: "This is a message.",
          grouping: true,
          type: "success",
        })
      }
    >
      Show message
    </ElButton>
  );
}

export function MessagePlacement() {
  const counters = useRef<Record<string, number>>({});

  return (
    <div className={styles.row}>
      <ElButton
        plain
        onClick={() => {
          const count = (counters.current.top ?? 0) + 1;
          counters.current.top = count;
          message({
            message: `This is a message from the top ${count}`,
            type: "success",
            placement: "top",
          });
        }}
      >
        Top
      </ElButton>
      <ElButton
        plain
        onClick={() => {
          const count = (counters.current["top-left"] ?? 0) + 1;
          counters.current["top-left"] = count;
          message({
            message: `This is a message from the top-left ${count}`,
            type: "info",
            placement: "top-left",
          });
        }}
      >
        Top Left
      </ElButton>
      <ElButton
        plain
        onClick={() => {
          const count = (counters.current["top-right"] ?? 0) + 1;
          counters.current["top-right"] = count;
          message({
            message: `This is a message from the top-right ${count}`,
            type: "primary",
            placement: "top-right",
          });
        }}
      >
        Top Right
      </ElButton>
      <ElButton
        plain
        onClick={() => {
          const count = (counters.current.bottom ?? 0) + 1;
          counters.current.bottom = count;
          message({
            message: `This is a message from the bottom ${count}`,
            type: "warning",
            placement: "bottom",
          });
        }}
      >
        Bottom
      </ElButton>
      <ElButton
        plain
        onClick={() => {
          const count = (counters.current["bottom-left"] ?? 0) + 1;
          counters.current["bottom-left"] = count;
          message({
            message: `This is a message from the bottom-left ${count}`,
            type: "warning",
            placement: "bottom-left",
          });
        }}
      >
        Bottom Left
      </ElButton>
      <ElButton
        plain
        onClick={() => {
          const count = (counters.current["bottom-right"] ?? 0) + 1;
          counters.current["bottom-right"] = count;
          message({
            message: `This is a message from the bottom-right ${count}`,
            type: "error",
            placement: "bottom-right",
          });
        }}
      >
        Bottom Right
      </ElButton>
    </div>
  );
}
