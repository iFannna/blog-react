"use client";

import { ElLink } from "@/components/element-plus/link";
import { ElIcon } from "@/components/element-plus/icon/ElIcon";
import { Edit } from "@/components/element-plus/icons";

const stack = { display: "flex", flexDirection: "column", gap: "1.2rem", alignItems: "flex-start" } as const;

const TYPES = ["default", "primary", "success", "warning", "danger", "info"] as const;

export function LinkBasic() {
  return (
    <div style={stack}>
      {TYPES.map((type) => (
        <ElLink key={type} type={type} href="#">
          {type} 链接
        </ElLink>
      ))}
    </div>
  );
}

export function LinkDisabled() {
  return (
    <div style={stack}>
      {TYPES.map((type) => (
        <ElLink key={type} type={type} href="#" disabled>
          {type} 链接
        </ElLink>
      ))}
    </div>
  );
}

export function LinkUnderline() {
  return (
    <div style={stack}>
      <ElLink type="primary" underline="always" href="#">
        always 始终显示下划线
      </ElLink>
      <ElLink type="primary" underline="hover" href="#">
        hover 悬停显示下划线
      </ElLink>
      <ElLink type="primary" underline="never" href="#">
        never 从不显示下划线
      </ElLink>
    </div>
  );
}

export function LinkIcon() {
  return (
    <div style={stack}>
      <ElLink type="primary" icon={<Edit />} href="#">
        编辑
      </ElLink>
      <ElLink type="primary" href="#">
        右侧图标
        <ElIcon style={{ marginLeft: "0.4rem" }}>
          <Edit />
        </ElIcon>
      </ElLink>
    </div>
  );
}
