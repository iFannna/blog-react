"use client";

import { useEffect, useRef, useState } from "react";
import { ElTooltip } from "@/components/element-plus/tooltip";
import { ElPopover } from "@/components/element-plus/popover";
import { ElPopconfirm } from "@/components/element-plus/popconfirm";
import { ElButton } from "@/components/element-plus/button";
import { ElTable, ElTableColumn } from "@/components/element-plus/table";
import { ElAvatar } from "@/components/element-plus/avatar";
import { InfoFilled } from "@/components/element-plus/icons";
import styles from "./overlay.module.css";

/** 官方 basic.vue：12 个方向分五排展示 */
export function TooltipBasic() {
  return (
    <div className={styles.placement}>
      <div className={`${styles.row} ${styles.center}`}>
        <ElTooltip content="Top Left prompts info" placement="top-start">
          <ElButton>top-start</ElButton>
        </ElTooltip>
        <ElTooltip content="Top Center prompts info" placement="top">
          <ElButton>top</ElButton>
        </ElTooltip>
        <ElTooltip content="Top Right prompts info" placement="top-end">
          <ElButton>top-end</ElButton>
        </ElTooltip>
      </div>
      <div className={`${styles.row} ${styles.between}`}>
        <ElTooltip content="Left Top prompts info" placement="left-start">
          <ElButton>left-start</ElButton>
        </ElTooltip>
        <ElTooltip content="Right Top prompts info" placement="right-start">
          <ElButton>right-start</ElButton>
        </ElTooltip>
      </div>
      <div className={`${styles.row} ${styles.between}`}>
        <ElTooltip content="Left Center prompts info" placement="left">
          <ElButton style={{ margin: "12px 0" }}>left</ElButton>
        </ElTooltip>
        <ElTooltip content="Right Center prompts info" placement="right">
          <ElButton>right</ElButton>
        </ElTooltip>
      </div>
      <div className={`${styles.row} ${styles.between}`}>
        <ElTooltip content="Left Bottom prompts info" placement="left-end">
          <ElButton>left-end</ElButton>
        </ElTooltip>
        <ElTooltip content="Right Bottom prompts info" placement="right-end">
          <ElButton>right-end</ElButton>
        </ElTooltip>
      </div>
      <div className={`${styles.row} ${styles.center}`}>
        <ElTooltip content="Bottom Left prompts info" placement="bottom-start">
          <ElButton>bottom-start</ElButton>
        </ElTooltip>
        <ElTooltip content="Bottom Center prompts info" placement="bottom">
          <ElButton>bottom</ElButton>
        </ElTooltip>
        <ElTooltip content="Bottom Right prompts info" placement="bottom-end">
          <ElButton>bottom-end</ElButton>
        </ElTooltip>
      </div>
    </div>
  );
}

export function TooltipTheme() {
  return (
    <>
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
          padding: "6px 12px",
        }}
      >
        <ElButton>Customized theme</ElButton>
      </ElTooltip>
    </>
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

  // 官方 demo 监听 document 的 mousemove，让浮层跟随光标
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      positionRef.current = { x: event.clientX, y: event.clientY };
    };
    document.addEventListener("mousemove", handler);
    return () => document.removeEventListener("mousemove", handler);
  }, [positionRef]);

  return (
    <>
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
    </>
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
    <>
      <div>
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
      </div>
      <ElTooltip
        visible={visible}
        virtualTriggering
        virtualRef={virtualRef}
        popperClass="singleton-tooltip"
        content={<span>Some content</span>}
      />
    </>
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
    <div className={styles.placement}>
      <div className={`${styles.row} ${styles.center}`}>
        <ElPopover title="Title" content="Top Left prompts info" placement="top-start">
          <ElButton>top-start</ElButton>
        </ElPopover>
        <ElPopover title="Title" content="Top Center prompts info" placement="top">
          <ElButton>top</ElButton>
        </ElPopover>
        <ElPopover title="Title" content="Top Right prompts info" placement="top-end">
          <ElButton>top-end</ElButton>
        </ElPopover>
      </div>
      <div className={`${styles.row} ${styles.between}`}>
        <ElPopover title="Title" content="Left Top prompts info" placement="left-start">
          <ElButton>left-start</ElButton>
        </ElPopover>
        <ElPopover title="Title" content="Right Top prompts info" placement="right-start">
          <ElButton>right-start</ElButton>
        </ElPopover>
      </div>
      <div className={`${styles.row} ${styles.between}`}>
        <ElPopover title="Title" content="Left Center prompts info" placement="left">
          <ElButton style={{ margin: "12px 0" }}>left</ElButton>
        </ElPopover>
        <ElPopover title="Title" content="Right Center prompts info" placement="right">
          <ElButton>right</ElButton>
        </ElPopover>
      </div>
      <div className={`${styles.row} ${styles.between}`}>
        <ElPopover title="Title" content="Left Bottom prompts info" placement="left-end">
          <ElButton>left-end</ElButton>
        </ElPopover>
        <ElPopover title="Title" content="Right Bottom prompts info" placement="right-end">
          <ElButton>right-end</ElButton>
        </ElPopover>
      </div>
      <div className={`${styles.row} ${styles.center}`}>
        <ElPopover title="Title" content="Bottom Left prompts info" placement="bottom-start">
          <ElButton>bottom-start</ElButton>
        </ElPopover>
        <ElPopover title="Title" content="Bottom Center prompts info" placement="bottom">
          <ElButton>bottom</ElButton>
        </ElPopover>
        <ElPopover title="Title" content="Bottom Right prompts info" placement="bottom-end">
          <ElButton>bottom-end</ElButton>
        </ElPopover>
      </div>
    </div>
  );
}

export function PopoverBasicUsage() {
  const [visible, setVisible] = useState(false);
  return (
    <>
      <ElPopover
        placement="top-start"
        title="Title"
        width={200}
        trigger="hover"
        content="this is content, this is content, this is content"
      >
        <ElButton className={styles.m2}>Hover to activate</ElButton>
      </ElPopover>
      <ElPopover
        placement="bottom"
        title="Title"
        width={200}
        trigger="click"
        content="this is content, this is content, this is content"
      >
        <ElButton className={styles.m2}>Click to activate</ElButton>
      </ElPopover>
      <ElPopover
        placement="right"
        title="Title"
        width={200}
        trigger="focus"
        content="this is content, this is content, this is content"
      >
        <ElButton className={styles.m2}>Focus to activate</ElButton>
      </ElPopover>
      <ElPopover
        title="Title"
        width={200}
        trigger="contextmenu"
        content="this is content, this is content, this is content"
      >
        <ElButton className={styles.m2}>contextmenu to activate</ElButton>
      </ElPopover>
      <ElPopover
        visible={visible}
        placement="bottom"
        title="Title"
        width={200}
        content="this is content, this is content, this is content"
      >
        <ElButton className={styles.m2} onClick={() => setVisible((value) => !value)}>
          Manual to activate
        </ElButton>
      </ElPopover>
    </>
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
    <div style={{ display: "flex", alignItems: "center" }}>
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
        <ElButton style={{ marginRight: 16 }}>Click to activate</ElButton>
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
    <div className={styles.placement}>
      <div className={`${styles.row} ${styles.center}`}>
        <ElPopconfirm title="Top Left prompts info" placement="top-start">
          <ElButton>top-start</ElButton>
        </ElPopconfirm>
        <ElPopconfirm title="Top Center prompts info" placement="top">
          <ElButton>top</ElButton>
        </ElPopconfirm>
        <ElPopconfirm title="Top Right prompts info" placement="top-end">
          <ElButton>top-end</ElButton>
        </ElPopconfirm>
      </div>
      <div className={`${styles.row} ${styles.between}`}>
        <ElPopconfirm title="Left Top prompts info" placement="left-start">
          <ElButton>left-start</ElButton>
        </ElPopconfirm>
        <ElPopconfirm title="Right Top prompts info" placement="right-start">
          <ElButton>right-start</ElButton>
        </ElPopconfirm>
      </div>
      <div className={`${styles.row} ${styles.between}`}>
        <ElPopconfirm title="Left Center prompts info" placement="left">
          <ElButton style={{ margin: "12px 0" }}>left</ElButton>
        </ElPopconfirm>
        <ElPopconfirm title="Right Center prompts info" placement="right">
          <ElButton>right</ElButton>
        </ElPopconfirm>
      </div>
      <div className={`${styles.row} ${styles.between}`}>
        <ElPopconfirm title="Left Bottom prompts info" placement="left-end">
          <ElButton>left-end</ElButton>
        </ElPopconfirm>
        <ElPopconfirm title="Right Bottom prompts info" placement="right-end">
          <ElButton>right-end</ElButton>
        </ElPopconfirm>
      </div>
      <div className={`${styles.row} ${styles.center}`}>
        <ElPopconfirm title="Bottom Left prompts info" placement="bottom-start">
          <ElButton>bottom-start</ElButton>
        </ElPopconfirm>
        <ElPopconfirm title="Bottom Center prompts info" placement="bottom">
          <ElButton>bottom</ElButton>
        </ElPopconfirm>
        <ElPopconfirm title="Bottom Right prompts info" placement="bottom-end">
          <ElButton>bottom-end</ElButton>
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
          <ElButton size="small" onClick={cancel}>No!</ElButton>
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
  return (
    <ElPopconfirm
      confirmButtonText="Yes"
      cancelButtonText="No"
      icon={<InfoFilled />}
      iconColor="#626AEF"
      title="Are you sure to delete this?"
    >
      <ElButton>Delete</ElButton>
    </ElPopconfirm>
  );
}
