"use client";

import { ElBadge } from "@/components/element-plus/badge";
import { ElButton } from "@/components/element-plus/button";
import { ElDropdown } from "@/components/element-plus/dropdown/ElDropdown";
import { ElDropdownMenu } from "@/components/element-plus/dropdown/ElDropdownMenu";
import { ElDropdownItem } from "@/components/element-plus/dropdown/ElDropdownItem";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { CaretBottom, Message, Share } from "@/components/element-plus/icons";

const item = {
  marginTop: "0.625rem",
  marginRight: "1.875rem",
} as const;

const itemWide = {
  marginTop: "0.625rem",
  marginRight: "2.5rem",
} as const;

const dropdownLink = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
} as const;

const mark = {
  marginLeft: "0.5rem",
} as const;

const dropdown = {
  marginTop: "1.1rem",
} as const;

const customContent = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.25rem",
} as const;

export function BadgeBasic() {
  return (
    <>
      <ElBadge value={12} className="item" style={item}>
        <ElButton>comments</ElButton>
      </ElBadge>
      <ElBadge value={3} className="item" style={item}>
        <ElButton>replies</ElButton>
      </ElBadge>
      <ElBadge value={1} type="primary" className="item" style={item}>
        <ElButton>comments</ElButton>
      </ElBadge>
      <ElBadge value={2} type="warning" className="item" style={item}>
        <ElButton>replies</ElButton>
      </ElBadge>
      <ElBadge value={1} color="green" className="item" style={item}>
        <ElButton>custom background</ElButton>
      </ElBadge>
      <span
        style={{ ...dropdown, display: "inline-flex", verticalAlign: "top" }}
      >
      <ElDropdown
        trigger="click"
        menu={
          <ElDropdownMenu>
            <ElDropdownItem>
              comments
              <ElBadge value={12} className="mark" style={mark} />
            </ElDropdownItem>
            <ElDropdownItem>
              replies
              <ElBadge value={3} className="mark" style={mark} />
            </ElDropdownItem>
          </ElDropdownMenu>
        }
      >
        <span style={dropdownLink}>
          Click Me
          <ElIcon className="el-icon--right">
            <CaretBottom />
          </ElIcon>
        </span>
      </ElDropdown>
      </span>
    </>
  );
}

export function BadgeMax() {
  return (
    <>
      <ElBadge value={200} max={99} className="item" style={itemWide}>
        <ElButton>comments</ElButton>
      </ElBadge>
      <ElBadge value={100} max={10} className="item" style={itemWide}>
        <ElButton>replies</ElButton>
      </ElBadge>
    </>
  );
}

export function BadgeCustomize() {
  return (
    <>
      <ElBadge value="new" className="item" style={itemWide}>
        <ElButton>comments</ElButton>
      </ElBadge>
      <ElBadge value="hot" className="item" style={itemWide}>
        <ElButton>replies</ElButton>
      </ElBadge>
      <ElBadge
        value={99}
        className="item" style={itemWide}
        content={(value) => (
          <div style={customContent}>
            <ElIcon>
              <Message />
            </ElIcon>
            <span>{value}</span>
          </div>
        )}
      >
        <ElButton>share</ElButton>
      </ElBadge>
    </>
  );
}

export function BadgeDot() {
  return (
    <>
      <ElBadge isDot className="item" style={itemWide}>query</ElBadge>
      <ElBadge isDot className="item" style={itemWide}>
        <ElButton icon={<Share />} type="primary" />
      </ElBadge>
    </>
  );
}

export function BadgeOffset() {
  return (
    <ElBadge value={1} offset={[10, 5]} className="item" style={item}>
      <ElButton> offset</ElButton>
    </ElBadge>
  );
}
