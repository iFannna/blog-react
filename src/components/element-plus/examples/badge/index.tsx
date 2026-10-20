"use client";

import { ElBadge } from "@/components/element-plus/badge";
import { ElButton } from "@/components/element-plus/button";
import { ElDropdown } from "@/components/element-plus/dropdown/ElDropdown";
import { ElDropdownMenu } from "@/components/element-plus/dropdown/ElDropdownMenu";
import { ElDropdownItem } from "@/components/element-plus/dropdown/ElDropdownItem";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { CaretBottom, Message, Share } from "@/components/element-plus/icons";

const item = {
  marginTop: "1rem",
  marginRight: "3rem",
} as const;

const row = {
  display: "flex",
  alignItems: "center",
  gap: "3.2rem",
  flexWrap: "wrap",
  marginTop: "1rem",
} as const;

const dropdownLink = {
  display: "flex",
  alignItems: "center",
  cursor: "pointer",
} as const;

const mark = {
  marginLeft: "0.8rem",
} as const;

const customContent = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "0.4rem",
} as const;

export function BadgeBasic() {
  return (
    <div style={row}>
      <ElBadge value={12} style={item}>
        <ElButton>评论</ElButton>
      </ElBadge>
      <ElBadge value={3} style={item}>
        <ElButton>回复</ElButton>
      </ElBadge>
      <ElBadge value={1} type="primary" style={item}>
        <ElButton>评论</ElButton>
      </ElBadge>
      <ElBadge value={2} type="warning" style={item}>
        <ElButton>回复</ElButton>
      </ElBadge>
      <ElBadge value={1} color="green" style={item}>
        <ElButton>自定义背景</ElButton>
      </ElBadge>
      <ElDropdown
        trigger="click"
        menu={
          <ElDropdownMenu>
            <ElDropdownItem>
              评论
              <ElBadge value={12} style={mark} />
            </ElDropdownItem>
            <ElDropdownItem>
              回复
              <ElBadge value={3} style={mark} />
            </ElDropdownItem>
          </ElDropdownMenu>
        }
      >
        <span style={dropdownLink}>
          点我
          <ElIcon className="el-icon--right">
            <CaretBottom />
          </ElIcon>
        </span>
      </ElDropdown>
    </div>
  );
}

export function BadgeMax() {
  return (
    <div style={row}>
      <ElBadge value={200} max={99} style={item}>
        <ElButton>评论</ElButton>
      </ElBadge>
      <ElBadge value={100} max={10} style={item}>
        <ElButton>回复</ElButton>
      </ElBadge>
    </div>
  );
}

export function BadgeCustomize() {
  return (
    <div style={row}>
      <ElBadge value="new" style={item}>
        <ElButton>评论</ElButton>
      </ElBadge>
      <ElBadge value="hot" style={item}>
        <ElButton>回复</ElButton>
      </ElBadge>
      <ElBadge
        value={99}
        style={item}
        content={(value) => (
          <div style={customContent}>
            <ElIcon>
              <Message />
            </ElIcon>
            <span>{value}</span>
          </div>
        )}
      >
        <ElButton>分享</ElButton>
      </ElBadge>
    </div>
  );
}

export function BadgeDot() {
  return (
    <div style={row}>
      <ElBadge isDot style={item}>查询</ElBadge>
      <ElBadge isDot style={item}>
        <ElButton icon={<Share />} type="primary" />
      </ElBadge>
    </div>
  );
}

export function BadgeOffset() {
  return (
    <div style={row}>
      <ElBadge value={1} offset={[10, 5]} style={item}>
        <ElButton>偏移</ElButton>
      </ElBadge>
    </div>
  );
}
