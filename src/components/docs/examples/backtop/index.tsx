"use client";

import { ElBacktop } from "@/components/ui/backtop";
import { ElIcon } from "@/components/ui/icon/ElIcon";
import { Star } from "@/components/ui/icons";

export function BacktopBasic() {
  return (
    <div style={{ height: 300 }}>
      <p style={{ color: "var(--docs-text-secondary)" }}>
        向下滚动页面，超过 200px 后右下角会出现回到顶部按钮。
      </p>
      <ElBacktop />
    </div>
  );
}

export function BacktopCustom() {
  return (
    <div style={{ height: 300 }}>
      <p style={{ color: "var(--docs-text-secondary)" }}>
        自定义内容为 40px * 40px 的区域。
      </p>
      <ElBacktop right={80} bottom={80}>
        <ElIcon style={{ fontSize: 20 }}>
          <Star />
        </ElIcon>
      </ElBacktop>
    </div>
  );
}
