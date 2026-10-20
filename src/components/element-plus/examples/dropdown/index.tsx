"use client";

import { useRef, useState } from "react";
import { ElDropdown } from "@/components/element-plus/dropdown/ElDropdown";
import { ElDropdownMenu } from "@/components/element-plus/dropdown/ElDropdownMenu";
import { ElDropdownItem } from "@/components/element-plus/dropdown/ElDropdownItem";
import type { DropdownExpose } from "@/components/element-plus/dropdown/ElDropdown";
import { ElButton } from "@/components/element-plus/button";
import { message } from "@/components/element-plus/message";
import {
  ArrowDown,
  Check,
  CircleCheck,
  CirclePlus,
  CirclePlusFilled,
  Plus,
} from "@/components/element-plus/icons";

const row = {
  display: "flex",
  gap: "1.6rem",
  flexWrap: "wrap" as const,
  alignItems: "center",
};

const linkStyle = {
  cursor: "pointer",
  color: "var(--el-color-primary)",
  display: "flex",
  alignItems: "center",
};

function Actions() {
  return (
    <ElDropdownMenu>
      <ElDropdownItem>Action 1</ElDropdownItem>
      <ElDropdownItem>Action 2</ElDropdownItem>
      <ElDropdownItem>Action 3</ElDropdownItem>
      <ElDropdownItem disabled>Action 4</ElDropdownItem>
      <ElDropdownItem divided>Action 5</ElDropdownItem>
    </ElDropdownMenu>
  );
}

function IconActions() {
  return (
    <ElDropdownMenu>
      <ElDropdownItem icon={<Plus />}>Action 1</ElDropdownItem>
      <ElDropdownItem icon={<CirclePlusFilled />}>Action 2</ElDropdownItem>
      <ElDropdownItem icon={<CirclePlus />}>Action 3</ElDropdownItem>
      <ElDropdownItem icon={<Check />}>Action 4</ElDropdownItem>
      <ElDropdownItem icon={<CircleCheck />}>Action 5</ElDropdownItem>
    </ElDropdownMenu>
  );
}

export function DropdownBasicUsage() {
  return (
    <ElDropdown menu={<Actions />}>
      <span style={linkStyle}>
        Dropdown List
        <ArrowDown style={{ marginLeft: 6 }} />
      </span>
    </ElDropdown>
  );
}

export function DropdownPlacements() {
  return (
    <div style={row}>
      {(["top-start", "top", "top-end", "bottom-start", "bottom", "bottom-end"] as const).map(
        (placement) => (
          <ElDropdown key={placement} placement={placement} menu={<Actions />}>
            <ElButton>{placement}</ElButton>
          </ElDropdown>
        ),
      )}
    </div>
  );
}

export function DropdownTriggeringElement() {
  return (
    <div style={row}>
      <ElDropdown menu={<Actions />}>
        <ElButton type="primary">
          Dropdown List
          <ArrowDown style={{ marginLeft: 6 }} />
        </ElButton>
      </ElDropdown>
      <ElDropdown
        splitButton
        type="primary"
        onButtonClick={() => message("button click")}
        menu={<Actions />}
      >
        <span>Dropdown List</span>
      </ElDropdown>
    </div>
  );
}

export function DropdownHowToTrigger() {
  return (
    <div style={row}>
      {(["hover", "click", "contextmenu"] as const).map((trigger) => (
        <div key={trigger} style={{ display: "grid", gap: "1.2rem" }}>
          <span style={{ color: "var(--el-text-color-secondary)", fontSize: 14 }}>
            {trigger} to trigger
          </span>
          <ElDropdown trigger={trigger} menu={<IconActions />}>
            <span style={linkStyle}>
              Dropdown List
              <ArrowDown style={{ marginLeft: 6 }} />
            </span>
          </ElDropdown>
        </div>
      ))}
    </div>
  );
}

export function DropdownMenuHidingBehavior() {
  return (
    <ElDropdown hideOnClick={false} menu={<Actions />}>
      <span style={linkStyle}>
        Dropdown List
        <ArrowDown style={{ marginLeft: 6 }} />
      </span>
    </ElDropdown>
  );
}

export function DropdownCommandEvent() {
  return (
    <ElDropdown
      onCommand={(command) => message(`click on item ${String(command)}`)}
      menu={
        <ElDropdownMenu>
          <ElDropdownItem command="a">Action 1</ElDropdownItem>
          <ElDropdownItem command="b">Action 2</ElDropdownItem>
          <ElDropdownItem command="c">Action 3</ElDropdownItem>
          <ElDropdownItem command="d" disabled>
            Action 4
          </ElDropdownItem>
          <ElDropdownItem command="e" divided>
            Action 5
          </ElDropdownItem>
        </ElDropdownMenu>
      }
    >
      <span style={linkStyle}>
        Dropdown List
        <ArrowDown style={{ marginLeft: 6 }} />
      </span>
    </ElDropdown>
  );
}

export function DropdownMethods() {
  const dropdownRef = useRef<DropdownExpose | null>(null);
  return (
    <div style={{ display: "grid", gap: "1.4rem" }}>
      <p style={{ margin: 0 }}>
        open(close) the Dropdown list2 will close(open) the Dropdown List1.
      </p>
      <div style={row}>
        <ElButton onClick={() => dropdownRef.current?.handleOpen()}>show</ElButton>
        <ElDropdown ref={dropdownRef} trigger="contextmenu" menu={<Actions />}>
          <span style={linkStyle}>Dropdown List1</span>
        </ElDropdown>
        <ElDropdown
          trigger="contextmenu"
          menu={<Actions />}
          onVisibleChange={(visible) => {
            if (visible) dropdownRef.current?.handleClose();
            else dropdownRef.current?.handleOpen();
          }}
        >
          <span style={linkStyle}>Dropdown List2</span>
        </ElDropdown>
      </div>
    </div>
  );
}

export function DropdownSizes() {
  return (
    <div style={row}>
      {(["large", "default", "small"] as const).map((size) => (
        <ElDropdown
          key={size}
          size={size === "default" ? undefined : size}
          splitButton
          type="primary"
          menu={<Actions />}
        >
          <span>
            {size === "default" ? "Default" : size === "large" ? "Large" : "Small"}
          </span>
        </ElDropdown>
      ))}
    </div>
  );
}

export function DropdownVirtualTrigger() {
  const dropdownRef = useRef<DropdownExpose | null>(null);
  const positionRef = useRef({ x: 0, y: 0 });
  const [virtualRef] = useState(() => ({
    getBoundingClientRect: () =>
      new DOMRect(positionRef.current.x, positionRef.current.y, 0, 0),
  }));

  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: 200,
          border: "1px dashed var(--el-border-color)",
          borderRadius: 4,
          cursor: "context-menu",
        }}
        onClick={() => dropdownRef.current?.handleClose()}
        onContextMenu={(event) => {
          const { clientX, clientY } = event;
          positionRef.current = { x: clientX, y: clientY };
          event.preventDefault();
          dropdownRef.current?.handleOpen();
        }}
      >
        Right click
      </div>
      <ElDropdown
        ref={dropdownRef}
        virtualTriggering
        virtualRef={virtualRef}
        showArrow={false}
        trigger="contextmenu"
        placement="bottom-start"
        menu={<IconActions />}
      />
    </>
  );
}
