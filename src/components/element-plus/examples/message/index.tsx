"use client";

import { useRef } from "react";
import { message } from "@/components/element-plus/message";
import { ElButton } from "@/components/element-plus/button";

const row = {
  display: "flex",
  gap: "1.2rem",
  flexWrap: "wrap" as const,
  alignItems: "center",
};

export function MessageBasic() {
  return (
    <div style={row}>
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

const TYPES = [
  { label: "Primary", type: "primary" },
  { label: "Success", type: "success" },
  { label: "Warning", type: "warning" },
  { label: "Info", type: "info" },
  { label: "Error", type: "error" },
] as const;

export function MessageDifferentTypes() {
  return (
    <div style={row}>
      {TYPES.map(({ label, type }) => (
        <ElButton
          key={type}
          plain
          onClick={() => message({ message: `This is a ${type} message.`, type })}
        >
          {label}
        </ElButton>
      ))}
    </div>
  );
}

export function MessagePlain() {
  return (
    <div style={row}>
      {TYPES.map(({ label, type }) => (
        <ElButton
          key={type}
          plain
          onClick={() =>
            message({ message: `This is a ${type} message.`, type, plain: true })
          }
        >
          {label}
        </ElButton>
      ))}
    </div>
  );
}

export function MessageClosable() {
  return (
    <div style={row}>
      {TYPES.map(({ label, type }) => (
        <ElButton
          key={type}
          plain
          onClick={() =>
            message({ message: `This is a ${type} message.`, type, showClose: true })
          }
        >
          {label}
        </ElButton>
      ))}
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

const PLACEMENTS = [
  { label: "Top", placement: "top", type: "success" },
  { label: "Top Left", placement: "top-left", type: "info" },
  { label: "Top Right", placement: "top-right", type: "primary" },
  { label: "Bottom", placement: "bottom", type: "warning" },
  { label: "Bottom Left", placement: "bottom-left", type: "warning" },
  { label: "Bottom Right", placement: "bottom-right", type: "error" },
] as const;

export function MessagePlacement() {
  const counters = useRef<Record<string, number>>({});

  return (
    <div style={row}>
      {PLACEMENTS.map(({ label, placement, type }) => (
        <ElButton
          key={placement}
          plain
          onClick={() => {
            const count = (counters.current[placement] ?? 0) + 1;
            counters.current[placement] = count;
            message({
              message: `This is a message from the ${placement} ${count}`,
              type,
              placement,
            });
          }}
        >
          {label}
        </ElButton>
      ))}
    </div>
  );
}
