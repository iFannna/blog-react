"use client";

import { ElAvatar, ElAvatarGroup } from "@/components/element-plus/avatar";
import { ElCol, ElRow } from "@/components/element-plus/row";
import { UserFilled } from "@/components/element-plus/generated/icons";

const CIRCLE_URL =
  "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png";

const SQUARE_URL =
  "https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png";

const TYPES_URL =
  "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png";

const FALLBACK_URL =
  "https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png";

const FIT_URL =
  "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";

const subTitle = {
  marginBottom: "10px",
  fontSize: "14px",
  color: "var(--el-text-color-secondary)",
} as const;

const basicRowStyle = {
  textAlign: "center",
} as const;

const basicCol = {
  textAlign: "center",
  borderRadius: 4,
} as const;

const basicColDivider = {
  ...basicCol,
  borderRight: "1px solid var(--el-border-color)",
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
  flex: "1",
  flexGrow: 0,
  display: "flex",
  flexDirection: "column",
} as const;

const groupBlock = {
  margin: 16,
} as const;

const divider = {
  borderRight: "1px solid var(--el-border-color)",
} as const;

export function AvatarBasic() {
  const renderSizes = (shape?: "circle" | "square", src = CIRCLE_URL) => (
    <div style={basicRow}>
      <div style={{ ...basicBlock, ...divider }}>
        <ElAvatar size={50} shape={shape} src={src} alt="avatar" />
      </div>
      <div style={{ ...basicBlock, ...divider }}>
        <ElAvatar size="small" shape={shape} src={src} alt="avatar" />
      </div>
      <div style={{ ...basicBlock, ...divider }}>
        <ElAvatar shape={shape} src={src} alt="avatar" />
      </div>
      <div style={basicBlock}>
        <ElAvatar size="large" shape={shape} src={src} alt="avatar" />
      </div>
    </div>
  );

  return (
    <ElRow style={basicRowStyle}>
      <ElCol lg={12} md={12} style={basicColDivider}>
        <div style={{ ...subTitle, textAlign: "center" }}>circle</div>
        {renderSizes("circle", CIRCLE_URL)}
      </ElCol>
      <ElCol lg={12} md={12} style={basicCol}>
        <div style={{ ...subTitle, textAlign: "center" }}>square</div>
        {renderSizes("square", SQUARE_URL)}
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
        <ElAvatar src={TYPES_URL} alt="avatar" />
      </div>
      <div style={typeBlock}>
        <ElAvatar>user</ElAvatar>
      </div>
    </div>
  );
}

export function AvatarFallback() {
  return (
    <div>
      <ElAvatar
        size={60}
        src="https://empty"
        onError={() => true}
        alt="avatar"
      >
        <img src={FALLBACK_URL} alt="avatar" />
      </ElAvatar>
    </div>
  );
}

export function AvatarFit() {
  return (
    <div style={fitRow}>
      <div style={fitBlock}>
        <span style={subTitle}>fill</span>
        <ElAvatar
          shape="square"
          size={100}
          fit="fill"
          src={FIT_URL}
          alt="avatar"
        />
      </div>
      <div style={fitBlock}>
        <span style={subTitle}>contain</span>
        <ElAvatar
          shape="square"
          size={100}
          fit="contain"
          src={FIT_URL}
          alt="avatar"
        />
      </div>
      <div style={fitBlock}>
        <span style={subTitle}>cover</span>
        <ElAvatar
          shape="square"
          size={100}
          fit="cover"
          src={FIT_URL}
          alt="avatar"
        />
      </div>
      <div style={fitBlock}>
        <span style={subTitle}>none</span>
        <ElAvatar
          shape="square"
          size={100}
          fit="none"
          src={FIT_URL}
          alt="avatar"
        />
      </div>
      <div style={fitBlock}>
        <span style={subTitle}>scale-down</span>
        <ElAvatar
          shape="square"
          size={100}
          fit="scale-down"
          src={FIT_URL}
          alt="avatar"
        />
      </div>
    </div>
  );
}

export function AvatarGroupDemo() {
  const avatars = Array.from({ length: 5 }, (_, index) => (
    <ElAvatar key={index} src={CIRCLE_URL} alt="avatar" />
  ));

  return (
    <>
      <div style={groupBlock}>
        <p>default</p>
        <ElAvatarGroup>{avatars}</ElAvatarGroup>
      </div>
      <div style={groupBlock}>
        <p>use collapse-avatars</p>
        <ElAvatarGroup collapseAvatars>{avatars}</ElAvatarGroup>
      </div>
      <div style={groupBlock}>
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
      <div style={groupBlock}>
        <p>use max-collapse-avatars</p>
        <ElAvatarGroup collapseAvatars maxCollapseAvatars={3}>
          {avatars}
        </ElAvatarGroup>
      </div>
      <div style={groupBlock}>
        <p>use collapse-avatars-tooltip</p>
        <ElAvatarGroup
          collapseAvatars
          collapseAvatarsTooltip
          maxCollapseAvatars={3}
        >
          {avatars}
        </ElAvatarGroup>
      </div>
    </>
  );
}
