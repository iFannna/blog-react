"use client";

import { useRef, useState } from "react";
import { ElTooltip } from "@/components/element-plus/tooltip";
import { ElPopover } from "@/components/element-plus/popover";
import { ElPopconfirm } from "@/components/element-plus/popconfirm";
import { ElButton } from "@/components/element-plus/button";
import { ElTable, ElTableColumn } from "@/components/element-plus/table";
import { ElAvatar } from "@/components/element-plus/avatar";
import { InfoFilled } from "@/components/element-plus/icons";

const row = {
  display: "flex",
  gap: "1.2rem",
  flexWrap: "wrap" as const,
  alignItems: "center",
};

const virtualStyles = {
  content: {
    display: "grid",
    placeItems: "center",
    height: 200,
    border: "1px dashed var(--el-border-color)",
    borderRadius: 4,
    cursor: "context-menu",
  },
};

/** 官方 basic.vue：12 个方向分五排展示 */
export function TooltipBasic() {
  return (
    <div style={{ display: "grid", gap: "1rem", width: "100%", maxWidth: 600 }}>
      <div style={{ ...row, justifyContent: "center" }}>
        <ElTooltip content="placement: top-start" placement="top-start">
          <ElButton style={{ width: 110 }}>top-start</ElButton>
        </ElTooltip>
        <ElTooltip content="placement: top" placement="top">
          <ElButton style={{ width: 110 }}>top</ElButton>
        </ElTooltip>
        <ElTooltip content="placement: top-end" placement="top-end">
          <ElButton style={{ width: 110 }}>top-end</ElButton>
        </ElTooltip>
      </div>
      <div style={{ ...row, justifyContent: "space-between" }}>
        <ElTooltip content="placement: left-start" placement="left-start">
          <ElButton style={{ width: 110 }}>left-start</ElButton>
        </ElTooltip>
        <ElTooltip content="placement: right-start" placement="right-start">
          <ElButton style={{ width: 110 }}>right-start</ElButton>
        </ElTooltip>
      </div>
      <div style={{ ...row, justifyContent: "space-between" }}>
        <ElTooltip content="placement: left" placement="left">
          <ElButton style={{ width: 110 }}>left</ElButton>
        </ElTooltip>
        <ElTooltip content="placement: right" placement="right">
          <ElButton style={{ width: 110 }}>right</ElButton>
        </ElTooltip>
      </div>
      <div style={{ ...row, justifyContent: "space-between" }}>
        <ElTooltip content="placement: left-end" placement="left-end">
          <ElButton style={{ width: 110 }}>left-end</ElButton>
        </ElTooltip>
        <ElTooltip content="placement: right-end" placement="right-end">
          <ElButton style={{ width: 110 }}>right-end</ElButton>
        </ElTooltip>
      </div>
      <div style={{ ...row, justifyContent: "center" }}>
        <ElTooltip content="placement: bottom-start" placement="bottom-start">
          <ElButton style={{ width: 110 }}>bottom-start</ElButton>
        </ElTooltip>
        <ElTooltip content="placement: bottom" placement="bottom">
          <ElButton style={{ width: 110 }}>bottom</ElButton>
        </ElTooltip>
        <ElTooltip content="placement: bottom-end" placement="bottom-end">
          <ElButton style={{ width: 110 }}>bottom-end</ElButton>
        </ElTooltip>
      </div>
    </div>
  );
}

export function TooltipTheme() {
  return (
    <div style={row}>
      <ElTooltip content="Top center" placement="top">
        <ElButton>Dark</ElButton>
      </ElTooltip>
      <ElTooltip content="Bottom center" placement="bottom" effect="light">
        <ElButton>Light</ElButton>
      </ElTooltip>
      <ElTooltip
        content="Customized theme"
        effect="customized"
        popperStyle={{
          background: "linear-gradient(90deg, rgb(159, 229, 151), rgb(204, 229, 129))",
        }}
      >
        <ElButton>Customized theme</ElButton>
      </ElTooltip>
    </div>
  );
}

export function TooltipRichContent() {
  return (
    <ElTooltip
      placement="top"
      content={
        <>
          multiple lines
          <br />
          second line
        </>
      }
    >
      <ElButton>Top center</ElButton>
    </ElTooltip>
  );
}

export function TooltipAdvancedUsage() {
  const [disabled, setDisabled] = useState(false);
  return (
    <ElTooltip
      disabled={disabled}
      content="click to close tooltip function"
      placement="bottom"
      effect="light"
    >
      <ElButton onClick={() => setDisabled((value) => !value)}>
        click to {disabled ? "active" : "close"} tooltip function
      </ElButton>
    </ElTooltip>
  );
}

export function TooltipHtmlContent() {
  return (
    <ElTooltip
      content="<span>The content can be <strong>HTML</strong></span>"
      rawContent
    >
      <ElButton>hover me</ElButton>
    </ElTooltip>
  );
}

interface VirtualPosition {
  x: number;
  y: number;
}

function useVirtualTrigger() {
  const positionRef = useRef<VirtualPosition>({ x: 0, y: 0 });
  const [virtualRef] = useState(() => ({
    getBoundingClientRect: () =>
      new DOMRect(positionRef.current.x, positionRef.current.y, 0, 0),
  }));
  return { positionRef, virtualRef };
}

export function TooltipVirtualTrigger() {
  const [visible, setVisible] = useState(false);
  const { positionRef, virtualRef } = useVirtualTrigger();

  return (
    <div
      style={virtualStyles.content}
      onMouseMove={(event) => {
        positionRef.current = { x: event.clientX, y: event.clientY };
      }}
    >
      <ElTooltip
        visible={visible}
        content="Bottom center"
        placement="bottom"
        effect="light"
        trigger="click"
        virtualTriggering
        virtualRef={virtualRef}
      />
      <ElButton onClick={() => setVisible((value) => !value)}>test</ElButton>
    </div>
  );
}

export function TooltipSingleton() {
  const [visible, setVisible] = useState(false);
  const anchorRef = useRef({ x: 0, y: 0, width: 0, height: 0 });
  const [virtualRef] = useState(() => ({
    getBoundingClientRect: () =>
      new DOMRect(
        anchorRef.current.x,
        anchorRef.current.y,
        anchorRef.current.width,
        anchorRef.current.height,
      ),
  }));

  return (
    <div style={row}>
      {[1, 2, 3].map((i) => (
        <ElButton
          key={i}
          onMouseOver={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            anchorRef.current = {
              x: rect.x,
              y: rect.y,
              width: rect.width,
              height: rect.height,
            };
          }}
          onClick={() => setVisible((value) => !value)}
        >
          Click to open tooltip
        </ElButton>
      ))}
      <ElTooltip
        visible={visible}
        virtualTriggering
        virtualRef={virtualRef}
        popperClass="singleton-tooltip"
        content={<span>Some content</span>}
      />
    </div>
  );
}

export function TooltipControlled() {
  const [visible, setVisible] = useState(false);
  return (
    <ElTooltip visible={visible} content={<span>Content</span>}>
      <ElButton
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
      >
        Hover me
      </ElButton>
    </ElTooltip>
  );
}

export function TooltipAnimations() {
  return (
    <ElTooltip
      content="I am an el-tooltip"
      transition="el-zoom-in-top"
    >
      <ElButton>trigger me</ElButton>
    </ElTooltip>
  );
}

export function TooltipAppendTo() {
  return (
    <ElTooltip
      appendTo=".tooltip-append-target"
      trigger="click"
      content="Append to .target"
      placement="top"
    >
      <ElButton className="tooltip-append-target" style={{ position: "relative", marginTop: 20 }}>
        Click to open tooltip
      </ElButton>
    </ElTooltip>
  );
}

/** 官方 placement.vue：12 个方向 */
export function PopoverPlacement() {
  return (
    <div style={{ display: "grid", gap: "1rem", width: "100%", maxWidth: 600 }}>
      <div style={{ ...row, justifyContent: "center" }}>
        <ElPopover title="Title" content="top-start prompts info" placement="top-start">
          <ElButton>top-start</ElButton>
        </ElPopover>
        <ElPopover title="Title" content="top prompts info" placement="top">
          <ElButton>top</ElButton>
        </ElPopover>
        <ElPopover title="Title" content="top-end prompts info" placement="top-end">
          <ElButton>top-end</ElButton>
        </ElPopover>
      </div>
      <div style={{ ...row, justifyContent: "space-between" }}>
        <ElPopover title="Title" content="left-start prompts info" placement="left-start">
          <ElButton>left-start</ElButton>
        </ElPopover>
        <ElPopover title="Title" content="right-start prompts info" placement="right-start">
          <ElButton>right-start</ElButton>
        </ElPopover>
      </div>
      <div style={{ ...row, justifyContent: "space-between" }}>
        <ElPopover title="Title" content="left prompts info" placement="left">
          <ElButton>left</ElButton>
        </ElPopover>
        <ElPopover title="Title" content="right prompts info" placement="right">
          <ElButton>right</ElButton>
        </ElPopover>
      </div>
      <div style={{ ...row, justifyContent: "space-between" }}>
        <ElPopover title="Title" content="left-end prompts info" placement="left-end">
          <ElButton>left-end</ElButton>
        </ElPopover>
        <ElPopover title="Title" content="right-end prompts info" placement="right-end">
          <ElButton>right-end</ElButton>
        </ElPopover>
      </div>
      <div style={{ ...row, justifyContent: "center" }}>
        <ElPopover title="Title" content="bottom-start prompts info" placement="bottom-start">
          <ElButton>bottom-start</ElButton>
        </ElPopover>
        <ElPopover title="Title" content="bottom prompts info" placement="bottom">
          <ElButton>bottom</ElButton>
        </ElPopover>
        <ElPopover title="Title" content="bottom-end prompts info" placement="bottom-end">
          <ElButton>bottom-end</ElButton>
        </ElPopover>
      </div>
    </div>
  );
}

export function PopoverBasicUsage() {
  const [visible, setVisible] = useState(false);
  return (
    <div style={row}>
      <ElPopover
        placement="top-start"
        title="Title"
        width={200}
        trigger="hover"
        content="this is content, this is content, this is content"
      >
        <ElButton>Hover to activate</ElButton>
      </ElPopover>
      <ElPopover
        placement="bottom"
        title="Title"
        width={200}
        trigger="click"
        content="this is content, this is content, this is content"
      >
        <ElButton>Click to activate</ElButton>
      </ElPopover>
      <ElPopover
        placement="right"
        title="Title"
        width={200}
        trigger="focus"
        content="this is content, this is content, this is content"
      >
        <ElButton>Focus to activate</ElButton>
      </ElPopover>
      <ElPopover
        title="Title"
        width={200}
        trigger="contextmenu"
        content="this is content, this is content, this is content"
      >
        <ElButton>contextmenu to activate</ElButton>
      </ElPopover>
      <ElPopover
        visible={visible}
        placement="bottom"
        title="Title"
        width={200}
        content="this is content, this is content, this is content"
      >
        <ElButton onClick={() => setVisible((value) => !value)}>
          Manual to activate
        </ElButton>
      </ElPopover>
    </div>
  );
}

export function PopoverVirtualTriggering() {
  const [buttonEl, setButtonEl] = useState<HTMLSpanElement | null>(null);
  return (
    <>
      <span ref={setButtonEl} style={{ display: "inline-block" }}>
        <ElButton>Click me</ElButton>
      </span>
      <ElPopover
        virtualTriggering
        virtualRef={buttonEl}
        trigger="click"
        title="With title"
        content={<span>Some content</span>}
      />
    </>
  );
}

const gridData = [
  { date: "2016-05-02", name: "Jack", address: "New York City" },
  { date: "2016-05-04", name: "Jack", address: "New York City" },
  { date: "2016-05-01", name: "Jack", address: "New York City" },
  { date: "2016-05-03", name: "Jack", address: "New York City" },
];

export function PopoverNestedInformation() {
  return (
    <div style={row}>
      <ElPopover
        placement="right"
        width={400}
        trigger="click"
        content={
          <ElTable data={gridData}>
            <ElTableColumn width={150} prop="date" label="date" />
            <ElTableColumn width={100} prop="name" label="name" />
            <ElTableColumn width={300} prop="address" label="address" />
          </ElTable>
        }
      >
        <ElButton>Click to activate</ElButton>
      </ElPopover>

      <ElPopover
        width={300}
        popperStyle={{
          boxShadow:
            "rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px",
          padding: 20,
        }}
        content={
          <div style={{ display: "flex", gap: 16, flexDirection: "column" }}>
            <ElAvatar
              size={60}
              src="https://avatars.githubusercontent.com/u/72015883?v=4"
              style={{ marginBottom: 8 }}
            />
            <div>
              <p style={{ margin: 0, fontWeight: 500 }}>Element Plus</p>
              <p
                style={{
                  margin: 0,
                  fontSize: 14,
                  color: "var(--el-color-info)",
                }}
              >
                @element-plus
              </p>
            </div>
            <p style={{ margin: 0 }}>
              Element Plus, a Vue 3 based component library for developers,
              designers and product managers
            </p>
          </div>
        }
      >
        <ElAvatar src="https://avatars.githubusercontent.com/u/72015883?v=4" />
      </ElPopover>
    </div>
  );
}

export function PopoverNestedOperation() {
  const [visible, setVisible] = useState(false);
  return (
    <ElPopover
      visible={visible}
      placement="top"
      width={180}
      content={
        <>
          <p>Are you sure to delete this?</p>
          <div style={{ textAlign: "right", margin: 0 }}>
            <ElButton size="small" text onClick={() => setVisible(false)}>
              cancel
            </ElButton>
            <ElButton
              size="small"
              type="primary"
              onClick={() => setVisible(false)}
            >
              confirm
            </ElButton>
          </div>
        </>
      }
    >
      <ElButton onClick={() => setVisible(true)}>Delete</ElButton>
    </ElPopover>
  );
}

export function PopoverDirectiveUsage() {
  const [buttonEl, setButtonEl] = useState<HTMLSpanElement | null>(null);
  return (
    <>
      <span ref={setButtonEl} style={{ display: "inline-block" }}>
        <ElButton>Click me</ElButton>
      </span>
      <ElPopover
        virtualTriggering
        virtualRef={buttonEl}
        trigger="click"
        title="With title"
        persistent
        content={<span>Some content</span>}
      />
    </>
  );
}

export function PopconfirmPlacement() {
  return (
    <div style={{ display: "grid", gap: "1rem", width: "100%", maxWidth: 600 }}>
      <div style={{ ...row, justifyContent: "center" }}>
        <ElPopconfirm title="top-start prompts info" placement="top-start">
          <ElButton style={{ width: 110 }}>top-start</ElButton>
        </ElPopconfirm>
        <ElPopconfirm title="top prompts info" placement="top">
          <ElButton style={{ width: 110 }}>top</ElButton>
        </ElPopconfirm>
        <ElPopconfirm title="top-end prompts info" placement="top-end">
          <ElButton style={{ width: 110 }}>top-end</ElButton>
        </ElPopconfirm>
      </div>
      <div style={{ ...row, justifyContent: "space-between" }}>
        <ElPopconfirm title="left-start prompts info" placement="left-start">
          <ElButton style={{ width: 110 }}>left-start</ElButton>
        </ElPopconfirm>
        <ElPopconfirm title="right-start prompts info" placement="right-start">
          <ElButton style={{ width: 110 }}>right-start</ElButton>
        </ElPopconfirm>
      </div>
      <div style={{ ...row, justifyContent: "space-between" }}>
        <ElPopconfirm title="left prompts info" placement="left">
          <ElButton style={{ width: 110 }}>left</ElButton>
        </ElPopconfirm>
        <ElPopconfirm title="right prompts info" placement="right">
          <ElButton style={{ width: 110 }}>right</ElButton>
        </ElPopconfirm>
      </div>
      <div style={{ ...row, justifyContent: "space-between" }}>
        <ElPopconfirm title="left-end prompts info" placement="left-end">
          <ElButton style={{ width: 110 }}>left-end</ElButton>
        </ElPopconfirm>
        <ElPopconfirm title="right-end prompts info" placement="right-end">
          <ElButton style={{ width: 110 }}>right-end</ElButton>
        </ElPopconfirm>
      </div>
      <div style={{ ...row, justifyContent: "center" }}>
        <ElPopconfirm title="bottom-start prompts info" placement="bottom-start">
          <ElButton style={{ width: 110 }}>bottom-start</ElButton>
        </ElPopconfirm>
        <ElPopconfirm title="bottom prompts info" placement="bottom">
          <ElButton style={{ width: 110 }}>bottom</ElButton>
        </ElPopconfirm>
        <ElPopconfirm title="bottom-end prompts info" placement="bottom-end">
          <ElButton style={{ width: 110 }}>bottom-end</ElButton>
        </ElPopconfirm>
      </div>
    </div>
  );
}

export function PopconfirmBasicUsage() {
  return (
    <ElPopconfirm title="Are you sure to delete this?">
      <ElButton>Delete</ElButton>
    </ElPopconfirm>
  );
}

export function PopconfirmCustomize() {
  const [clicked, setClicked] = useState(false);
  return (
    <ElPopconfirm
      width={220}
      icon={<InfoFilled />}
      iconColor="#626AEF"
      title="Are you sure to delete this?"
      onCancel={() => setClicked(true)}
      actions={({ confirm, cancel }) => (
        <>
          <ElButton size="small" onClick={cancel}>
            No!
          </ElButton>
          <ElButton
            type="danger"
            size="small"
            disabled={!clicked}
            onClick={confirm}
          >
            Yes?
          </ElButton>
        </>
      )}
    >
      <ElButton>Delete</ElButton>
    </ElPopconfirm>
  );
}

export function PopconfirmTriggerEvent() {
  const [event, setEvent] = useState("等待操作");
  return (
    <div style={row}>
      <ElPopconfirm
        confirmButtonText="Yes"
        cancelButtonText="No"
        icon={<InfoFilled />}
        iconColor="#626AEF"
        title="Are you sure to delete this?"
        onConfirm={() => setEvent("confirm!")}
        onCancel={() => setEvent("cancel!")}
      >
        <ElButton>Delete</ElButton>
      </ElPopconfirm>
      <span>{event}</span>
    </div>
  );
}
