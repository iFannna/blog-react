"use client";

import { ElAvatar, ElAvatarGroup } from "@/components/ui/avatar";
import { ElCol, ElRow } from "@/components/ui/row";
import { UserFilled } from "@/components/ui/icons";

const IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80'%3E%3Crect width='80' height='80' fill='%23409eff'/%3E%3C/svg%3E";

const WIDE_IMG =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='120' height='80'%3E%3Crect width='120' height='80' fill='%23409eff'/%3E%3Ccircle cx='60' cy='40' r='24' fill='%23fff'/%3E%3C/svg%3E";

const subTitle = {
  marginBottom: "10px",
  fontSize: "14px",
  color: "var(--el-text-color-secondary)",
} as const;

const basicCol = {
  textAlign: "center",
} as const;

const basicRow = {
  display: "flex",
  alignItems: "center",
} as const;

const basicBlock = {
  flex: 1,
  textAlign: "center",
} as const;

const typesRow = {
  display: "flex",
} as const;

const typeBlock = {
  flex: 1,
  textAlign: "center",
} as const;

const fitRow = {
  display: "flex",
  textAlign: "center",
  justifyContent: "space-between",
} as const;

const fitBlock = {
  flex: 1,
  display: "flex",
  flexDirection: "column",
} as const;

const groupStack = {
  display: "flex",
  flexDirection: "column",
  gap: "1.6rem",
} as const;

const divider = {
  borderRight: "1px solid var(--el-border-color)",
} as const;

export function AvatarBasic() {
  const sizeList = [50, "small", undefined, "large"] as const;

  const renderSizes = (shape?: "circle" | "square") => (
    <div style={basicRow}>
      {sizeList.map((size, index) => (
        <div
          key={index}
          style={{
            ...basicBlock,
            ...(index < sizeList.length - 1 ? divider : {}),
          }}
        >
          <ElAvatar size={size} shape={shape} src={IMG} alt="avatar" />
        </div>
      ))}
    </div>
  );

  return (
    <ElRow>
      <ElCol lg={12} md={12} style={basicCol}>
        <div style={subTitle}>circle</div>
        {renderSizes()}
      </ElCol>
      <ElCol lg={12} md={12} style={basicCol}>
        <div style={subTitle}>square</div>
        {renderSizes("square")}
      </ElCol>
    </ElRow>
  );
}

export function AvatarTypes() {
  return (
    <div style={typesRow}>
      <div style={{ ...typeBlock, ...divider }}>
        <ElAvatar icon={<UserFilled />} />
      </div>
      <div style={{ ...typeBlock, ...divider }}>
        <ElAvatar src={IMG} alt="avatar" />
      </div>
      <div style={typeBlock}>
        <ElAvatar>user</ElAvatar>
      </div>
    </div>
  );
}

export function AvatarFallback() {
  return (
    <ElAvatar
      size={60}
      src="https://empty"
      onError={() => true}
      alt="avatar"
    >
      <img src={IMG} alt="avatar" />
    </ElAvatar>
  );
}

export function AvatarFit() {
  const fits = ["fill", "contain", "cover", "none", "scale-down"] as const;

  return (
    <div style={fitRow}>
      {fits.map((fit) => (
        <div key={fit} style={fitBlock}>
          <span style={subTitle}>{fit}</span>
          <ElAvatar
            shape="square"
            size={100}
            fit={fit}
            src={WIDE_IMG}
            alt="avatar"
          />
        </div>
      ))}
    </div>
  );
}

export function AvatarGroupDemo() {
  const avatars = Array.from({ length: 5 }, (_, index) => (
    <ElAvatar key={index} src={IMG} alt="avatar" />
  ));

  return (
    <div style={groupStack}>
      <div>
        <p>default</p>
        <ElAvatarGroup>{avatars}</ElAvatarGroup>
      </div>
      <div>
        <p>use collapse-avatars</p>
        <ElAvatarGroup collapseAvatars>{avatars}</ElAvatarGroup>
      </div>
      <div>
        <p>use collapse-class and collapse-style</p>
        <ElAvatarGroup
          collapseAvatars
          collapseClass="my-collapse-avatar"
          collapseStyle={{
            backgroundColor: "#d9ecff",
            color: "var(--el-color-primary)",
          }}
        >
          {avatars}
        </ElAvatarGroup>
      </div>
      <div>
        <p>use max-collapse-avatars</p>
        <ElAvatarGroup collapseAvatars maxCollapseAvatars={3}>
          {avatars}
        </ElAvatarGroup>
      </div>
      <div>
        <p>use collapse-avatars-tooltip</p>
        <ElAvatarGroup
          collapseAvatars
          collapseAvatarsTooltip
          maxCollapseAvatars={3}
        >
          {avatars}
        </ElAvatarGroup>
      </div>
    </div>
  );
}
