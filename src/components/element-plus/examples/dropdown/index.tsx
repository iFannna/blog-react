"use client";

import { useRef, useState, type HTMLAttributes, type ReactNode } from "react";
import { ElDropdown } from "@/components/element-plus/dropdown/ElDropdown";
import { ElDropdownMenu } from "@/components/element-plus/dropdown/ElDropdownMenu";
import { ElDropdownItem } from "@/components/element-plus/dropdown/ElDropdownItem";
import type { DropdownExpose } from "@/components/element-plus/dropdown/ElDropdown";
import { ElButton } from "@/components/element-plus/button";
import { ElCard } from "@/components/element-plus/card";
import { ElCol } from "@/components/element-plus/row/ElCol";
import { ElRow } from "@/components/element-plus/row/ElRow";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { message } from "@/components/element-plus/message";
import {
  ArrowDown,
  Check,
  CircleCheck,
  CirclePlus,
  CirclePlusFilled,
  Plus,
} from "@/components/element-plus/icons";
import styles from "./dropdown.module.css";

function DropdownLink({
  children,
  ...rest
}: { children: ReactNode } & HTMLAttributes<HTMLSpanElement>) {
  return (
    <span {...rest} className={`el-dropdown-link ${styles.link}`}>
      {children}
    </span>
  );
}

function Actions({ dividedLast = false }: { dividedLast?: boolean }) {
  return (
    <ElDropdownMenu>
      <ElDropdownItem>Action 1</ElDropdownItem>
      <ElDropdownItem>Action 2</ElDropdownItem>
      <ElDropdownItem>Action 3</ElDropdownItem>
      <ElDropdownItem disabled>Action 4</ElDropdownItem>
      <ElDropdownItem divided>Action 5</ElDropdownItem>
      {dividedLast && <ElDropdownItem divided>Action 6</ElDropdownItem>}
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
      <DropdownLink>
        Dropdown List
        <ElIcon className="el-icon--right">
          <ArrowDown />
        </ElIcon>
      </DropdownLink>
    </ElDropdown>
  );
}

export function DropdownPlacements() {
  return (
    <div className={`${styles.row} ${styles.gap4}`}>
      {([
        ["top-start", "topStart"],
        ["top", "top"],
        ["top-end", "topEnd"],
        ["bottom-start", "bottomStart"],
        ["bottom", "bottom"],
        ["bottom-end", "bottomEnd"],
      ] as const).map(([placement, label]) => (
        <ElDropdown key={placement} placement={placement} menu={<Actions />}>
          <ElButton>{label}</ElButton>
        </ElDropdown>
      ))}
    </div>
  );
}

export function DropdownTriggeringElement() {
  return (
    <div className={styles.row}>
      <ElDropdown menu={<Actions />}>
        <ElButton type="primary">
          Dropdown List
          <ElIcon className="el-icon--right">
            <ArrowDown />
          </ElIcon>
        </ElButton>
      </ElDropdown>
      <ElDropdown
        splitButton
        type="primary"
        className={styles.ml15}
        onButtonClick={() => message("button click")}
        menu={<Actions />}
      >
        <>Dropdown List</>
      </ElDropdown>
    </div>
  );
}

export function DropdownHowToTrigger() {
  const triggers = [
    ["hover", "hover to trigger"],
    ["click", "click to trigger"],
    ["contextmenu", "right click to trigger"],
  ] as const;

  return (
    <ElRow className={styles.columns}>
      {triggers.map(([trigger, label]) => (
        <ElCol key={trigger} span={8}>
          <span className={styles.demonstration}>{label}</span>
          <ElDropdown trigger={trigger} menu={<IconActions />}>
            <span className={`el-dropdown-link ${styles.linkPlain}`}>
              Dropdown List
              <ElIcon className="el-icon--right">
                <ArrowDown />
              </ElIcon>
            </span>
          </ElDropdown>
        </ElCol>
      ))}
    </ElRow>
  );
}

export function DropdownMenuHidingBehavior() {
  return (
    <ElDropdown hideOnClick={false} menu={<Actions dividedLast />}>
      <DropdownLink>
        Dropdown List
        <ElIcon className="el-icon--right">
          <ArrowDown />
        </ElIcon>
      </DropdownLink>
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
          <ElDropdownItem command="d" disabled>Action 4</ElDropdownItem>
          <ElDropdownItem command="e" divided>Action 5</ElDropdownItem>
        </ElDropdownMenu>
      }
    >
      <DropdownLink>
        Dropdown List
        <ElIcon className="el-icon--right">
          <ArrowDown />
        </ElIcon>
      </DropdownLink>
    </ElDropdown>
  );
}

export function DropdownMethods() {
  const dropdownRef = useRef<DropdownExpose | null>(null);
  return (
    <>
      <div className={styles.methods}>
        <p>open(close) the Dropdown list2 will close(open) the Dropdown List1.</p>
      </div>
      <div className={styles.showButton}>
        <ElButton onClick={() => dropdownRef.current?.handleOpen()}>show</ElButton>
      </div>
      <ElDropdown
        ref={dropdownRef}
        trigger="contextmenu"
        className={styles.mr30}
        menu={<Actions />}
      >
        <span className={`el-dropdown-link ${styles.link}`}>Dropdown List1</span>
      </ElDropdown>
      <ElDropdown
        trigger="contextmenu"
        menu={<Actions />}
        onVisibleChange={(visible) => {
          if (visible) dropdownRef.current?.handleClose();
          else dropdownRef.current?.handleOpen();
        }}
      >
        <span className={`el-dropdown-link ${styles.link}`}>Dropdown List2</span>
      </ElDropdown>
    </>
  );
}

export function DropdownSizes() {
  return (
    <>
      <ElDropdown size="large" splitButton type="primary" menu={<Actions />}>
        <>Large</>
      </ElDropdown>
      <ElDropdown
        splitButton
        type="primary"
        className={styles.ml15}
        menu={<Actions />}
      >
        <>Default</>
      </ElDropdown>
      <ElDropdown
        size="small"
        splitButton
        type="primary"
        className={styles.ml15}
        menu={<Actions />}
      >
        <>Small</>
      </ElDropdown>
    </>
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
        onClick={() => dropdownRef.current?.handleClose()}
        onContextMenu={(event) => {
          const { clientX, clientY } = event;
          positionRef.current = { x: clientX, y: clientY };
          event.preventDefault();
          dropdownRef.current?.handleOpen();
        }}
      >
        <ElCard className={styles.virtualCard} bodyClass="card-body">
          Right click
        </ElCard>
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
