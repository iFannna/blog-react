"use client";

import { useState } from "react";
import { MessageBox } from "@/components/element-plus/message-box";
import { message } from "@/components/element-plus/message";
import { ElButton } from "@/components/element-plus/button";
import { ElSwitch } from "@/components/element-plus/switch";
import { Delete } from "@/components/element-plus/icons";

const row = {
  display: "flex",
  gap: "1.2rem",
  flexWrap: "wrap" as const,
  alignItems: "center",
};

export function MessageBoxAlert() {
  return (
    <ElButton
      plain
      onClick={() => {
        MessageBox.alert("This is a message", "Title", {
          confirmButtonText: "OK",
          callback: (result) => {
            message({
              type: "info",
              message: `action: ${typeof result === "string" ? result : result.action}`,
            });
          },
        });
      }}
    >
      Click to open the Message Box
    </ElButton>
  );
}

export function MessageBoxConfirm() {
  return (
    <ElButton
      plain
      onClick={() => {
        MessageBox.confirm(
          "proxy will permanently delete the file. Continue?",
          "Warning",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning",
          },
        )
          .then(() => message({ type: "success", message: "Delete completed" }))
          .catch(() => message({ type: "info", message: "Delete canceled" }));
      }}
    >
      Click to open the Message Box
    </ElButton>
  );
}

export function MessageBoxPrompt() {
  return (
    <ElButton
      plain
      onClick={() => {
        MessageBox.prompt("Please input your e-mail", "Tip", {
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          inputPattern:
            /[\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?/,
          inputErrorMessage: "Invalid Email",
        })
          .then((result) => {
            const value = typeof result === "object" ? result.value : result;
            message({ type: "success", message: `Your email is:${value}` });
          })
          .catch(() => message({ type: "info", message: "Input canceled" }));
      }}
    >
      Click to open Message Box
    </ElButton>
  );
}

function DynamicSwitch() {
  const [checked, setChecked] = useState(false);
  return <ElSwitch checked={checked} onCheckedChange={setChecked} />;
}

export function MessageBoxUseVnode() {
  return (
    <div style={row}>
      <ElButton
        plain
        onClick={() =>
          MessageBox({
            title: "Message",
            message: (
              <p>
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
          MessageBox({
            title: "Message",
            message: () => <DynamicSwitch />,
          })
        }
      >
        Dynamic props
      </ElButton>
    </div>
  );
}

export function MessageBoxUseVnodeWithActionHandlers() {
  return (
    <ElButton
      plain
      onClick={() => {
        MessageBox.confirm(
          ({ confirm, cancel, close }) => (
            <div>
              <p style={{ marginBottom: 8 }}>
                Custom buttons with MessageBox action handlers
              </p>
              <ElButton type="primary" onClick={confirm}>
                Resolve
              </ElButton>
              <ElButton type="danger" onClick={cancel}>
                Reject
              </ElButton>
              <ElButton onClick={close}>Close</ElButton>
            </div>
          ),
          {
            title: "Message",
            showConfirmButton: false,
            showCancelButton: false,
            distinguishCancelAndClose: true,
          },
        )
          .then((action) =>
            message({
              type: "success",
              message: `resolved: ${typeof action === "string" ? action : action.action}`,
            }),
          )
          .catch((reason) =>
            message({ type: "error", message: `rejected: ${String(reason)}` }),
          );
      }}
    >
      Click to open Message Box
    </ElButton>
  );
}

export function MessageBoxCustomization() {
  return (
    <ElButton
      plain
      onClick={() => {
        MessageBox({
          title: "Message",
          message: (
            <p>
              Message can be <i style={{ color: "teal" }}>VNode</i>
            </p>
          ),
          showCancelButton: true,
          confirmButtonText: "OK",
          cancelButtonText: "Cancel",
          beforeClose: (action, instance, done) => {
            if (action === "confirm") {
              instance.confirmButtonLoading = true;
              instance.confirmButtonText = "Loading...";
              setTimeout(() => {
                done();
                setTimeout(() => {
                  instance.confirmButtonLoading = false;
                }, 300);
              }, 3000);
            } else {
              done();
            }
          },
        }).then((result) => {
          message({
            type: "info",
            message: `action: ${typeof result === "string" ? result : result.action}`,
          });
        });
      }}
    >
      Click to open Message Box
    </ElButton>
  );
}

export function MessageBoxUseHtml() {
  return (
    <ElButton
      plain
      onClick={() =>
        MessageBox.alert(
          "<strong>proxy is <i>HTML</i> string</strong>",
          "HTML String",
          { dangerouslyUseHTMLString: true },
        )
      }
    >
      Click to open Message Box
    </ElButton>
  );
}

export function MessageBoxDistinguishableCloseCancel() {
  return (
    <ElButton
      plain
      onClick={() => {
        MessageBox.confirm(
          "You have unsaved changes, save and proceed?",
          "Confirm",
          {
            distinguishCancelAndClose: true,
            confirmButtonText: "Save",
            cancelButtonText: "Discard Changes",
          },
        )
          .then(() =>
            message({
              type: "info",
              message: "Changes saved. Proceeding to a new route.",
            }),
          )
          .catch((action) =>
            message({
              type: "info",
              message:
                action === "cancel"
                  ? "Changes discarded. Proceeding to a new route."
                  : "Stay in the current route",
            }),
          );
      }}
    >
      Click to open Message Box
    </ElButton>
  );
}

export function MessageBoxCenteredContent() {
  return (
    <ElButton
      plain
      onClick={() => {
        MessageBox.confirm(
          "proxy will permanently delete the file. Continue?",
          "Warning",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning",
            center: true,
          },
        )
          .then(() => message({ type: "success", message: "Delete completed" }))
          .catch(() => message({ type: "info", message: "Delete canceled" }));
      }}
    >
      Click to open Message Box
    </ElButton>
  );
}

export function MessageBoxCustomizedIcon() {
  return (
    <ElButton
      plain
      onClick={() => {
        MessageBox.confirm(
          "It will permanently delete the file. Continue?",
          "Warning",
          {
            confirmButtonText: "OK",
            cancelButtonText: "Cancel",
            type: "warning",
            icon: <Delete />,
          },
        )
          .then(() => message({ type: "success", message: "Delete completed" }))
          .catch(() => message({ type: "info", message: "Delete canceled" }));
      }}
    >
      Click to open Message Box
    </ElButton>
  );
}

export function MessageBoxDraggable() {
  return (
    <div style={row}>
      <ElButton
        plain
        onClick={() => {
          MessageBox.confirm(
            "proxy will permanently delete the file. Continue?",
            "Warning",
            {
              confirmButtonText: "OK",
              cancelButtonText: "Cancel",
              type: "warning",
              draggable: true,
            },
          )
            .then(() => message({ type: "success", message: "Delete completed" }))
            .catch(() => message({ type: "info", message: "Delete canceled" }));
        }}
      >
        Open a draggable Message Box
      </ElButton>
      <ElButton
        plain
        onClick={() => {
          MessageBox.confirm(
            "proxy will permanently delete the file. Continue?",
            "Warning",
            {
              confirmButtonText: "OK",
              cancelButtonText: "Cancel",
              type: "warning",
              draggable: true,
              overflow: true,
            },
          )
            .then(() => message({ type: "success", message: "Delete completed" }))
            .catch(() => message({ type: "info", message: "Delete canceled" }));
        }}
      >
        Open a overflow draggable Message Box
      </ElButton>
      <ElButton
        plain
        onClick={() => {
          MessageBox.confirm(
            "This message box has custom dragging styles. Try dragging it to see the effects!",
            "Custom Dragging Style",
            {
              confirmButtonText: "OK",
              cancelButtonText: "Cancel",
              type: "info",
              draggable: true,
              customClass: "custom-dragging-message-box",
            },
          )
            .then(() => message({ type: "success", message: "Action completed" }))
            .catch(() => message({ type: "info", message: "Action canceled" }));
        }}
      >
        Open a custom dragging style Message Box
      </ElButton>
    </div>
  );
}
