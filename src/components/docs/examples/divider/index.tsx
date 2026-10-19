"use client";

import { ElDivider } from "@/components/ui/divider";

export function DividerBasic() {
  return (
    <div>
      <span>白日依山尽</span>
      <ElDivider />
      <span>黄河入海流</span>
      <ElDivider />
      <span>欲穷千里目</span>
    </div>
  );
}

export function DividerText() {
  return (
    <div>
      <span>上方内容</span>
      <ElDivider contentPosition="left">左对齐</ElDivider>
      <span>中间内容</span>
      <ElDivider contentPosition="center">居中</ElDivider>
      <span>下方内容</span>
      <ElDivider contentPosition="right">右对齐</ElDivider>
    </div>
  );
}

export function DividerVertical() {
  return (
    <div style={{ display: "flex", alignItems: "center", height: 40 }}>
      <span>左</span>
      <ElDivider direction="vertical" />
      <span>中</span>
      <ElDivider direction="vertical" />
      <span>右</span>
    </div>
  );
}

export function DividerBorderStyle() {
  return (
    <div>
      {(["solid", "dashed", "dotted", "double"] as const).map((style) => (
        <div key={style}>
          <ElDivider borderStyle={style}>{style}</ElDivider>
        </div>
      ))}
    </div>
  );
}
